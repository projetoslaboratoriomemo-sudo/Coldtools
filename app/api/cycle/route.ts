import { NextResponse } from "next/server";
// The package runtime exports this initializer, although its bundled declaration describes the initialized module.
// @ts-expect-error coolprop-wasm declaration does not match its ESM entry point
import initCoolProp from "coolprop-wasm";

export const runtime = "nodejs";

type CoolPropModule = {
  PropsSI: (
    output: string,
    input1: string,
    value1: number,
    input2: string,
    value2: number,
    fluid: string,
  ) => number;
};

let coolPropPromise: Promise<CoolPropModule> | null = null;

function getCoolProp(): Promise<CoolPropModule> {
  if (!coolPropPromise) coolPropPromise = initCoolProp() as Promise<CoolPropModule>;
  return coolPropPromise;
}

const fluidNames = {
  R134a: "R134a",
  R410A: "R410A",
  R32: "R32",
  R22: "R22",
  R404A: "R404A",
  R290: "n-Propane",
} as const;

type FluidName = keyof typeof fluidNames;

function finite(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function psigToPa(psig: number) {
  return (psig + 14.6959488) * 6894.757293;
}

function toK(celsius: number) {
  return celsius + 273.15;
}

function toC(kelvin: number) {
  return kelvin - 273.15;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fluid = body.fluid as FluidName;
    if (!(fluid in fluidNames)) {
      return NextResponse.json({ error: "Fluido refrigerante não suportado." }, { status: 400 });
    }

    const lowPsig = finite(body.lowPressure, Number.NaN);
    const highPsig = finite(body.highPressure, Number.NaN);
    const superheat = finite(body.superheat, Number.NaN);
    const subcooling = finite(body.subcooling, Number.NaN);
    const displacement = Math.max(0, finite(body.displacement));
    const rpm = Math.max(0, finite(body.rpm));
    const volumetricEfficiency = Math.min(.98, Math.max(.05, finite(body.volumetricEfficiency, 70) / 100));
    const isentropicEfficiency = Math.min(.98, Math.max(.05, finite(body.isentropicEfficiency, 65) / 100));

    if (![lowPsig, highPsig, superheat, subcooling].every(Number.isFinite)) {
      return NextResponse.json({ error: "Preencha as pressões, o superaquecimento e o sub-resfriamento." }, { status: 400 });
    }

    const lowPressure = psigToPa(lowPsig);
    const highPressure = psigToPa(highPsig);
    if (lowPressure <= 0 || highPressure <= 0) {
      return NextResponse.json({ error: "A pressão absoluta precisa ser maior que zero." }, { status: 400 });
    }
    if (highPressure <= lowPressure) {
      return NextResponse.json({ error: "A pressão de alta deve ser maior que a pressão de baixa." }, { status: 400 });
    }
    if (superheat < 0 || subcooling < 0) {
      return NextResponse.json({ error: "Superaquecimento e sub-resfriamento não podem ser negativos." }, { status: 400 });
    }

    const coolProp = await getCoolProp();
    const props = (
      output: string,
      input1: string,
      value1: number,
      input2: string,
      value2: number,
    ) => coolProp.PropsSI(output, input1, value1, input2, value2, fluidNames[fluid]);

    const evaporatingDewK = props("T", "P", lowPressure, "Q", 1);
    const evaporatingBubbleK = props("T", "P", lowPressure, "Q", 0);
    const condensingDewK = props("T", "P", highPressure, "Q", 1);
    const condensingBubbleK = props("T", "P", highPressure, "Q", 0);

    const suctionTemperatureK = evaporatingDewK + superheat;
    const liquidTemperatureK = condensingBubbleK - subcooling;

    const h1 = superheat === 0
      ? props("H", "P", lowPressure, "Q", 1)
      : props("H", "P", lowPressure, "T", suctionTemperatureK);
    const s1 = superheat === 0
      ? props("S", "P", lowPressure, "Q", 1)
      : props("S", "P", lowPressure, "T", suctionTemperatureK);
    const rho1 = superheat === 0
      ? props("D", "P", lowPressure, "Q", 1)
      : props("D", "P", lowPressure, "T", suctionTemperatureK);

    const h2s = props("H", "P", highPressure, "S", s1);
    const h2 = h1 + (h2s - h1) / isentropicEfficiency;
    const dischargeTemperatureK = props("T", "P", highPressure, "H", h2);

    const h3 = subcooling === 0
      ? props("H", "P", highPressure, "Q", 0)
      : props("H", "P", highPressure, "T", liquidTemperatureK);
    const h4 = h3;
    const rawQuality4 = props("Q", "P", lowPressure, "H", h4);
    const quality4 = rawQuality4 >= 0 && rawQuality4 <= 1 ? rawQuality4 : null;

    const refrigerationEffect = (h1 - h4) / 1000;
    const compressorWorkIdeal = (h2s - h1) / 1000;
    const compressorWork = (h2 - h1) / 1000;
    const condenserHeat = (h2 - h3) / 1000;
    const cop = refrigerationEffect / compressorWork;
    const copIdeal = refrigerationEffect / compressorWorkIdeal;
    const eer = cop * 3.412142;
    const specificVolume = 1 / rho1;
    const displacementFlow = displacement * 1e-6 * rpm * 60;
    const suctionFlow = displacementFlow * volumetricEfficiency;
    const massFlowKgH = suctionFlow / specificVolume;
    const massFlowKgS = massFlowKgH / 3600;
    const evaporatorCapacityKw = refrigerationEffect * massFlowKgS;
    const compressorPowerKw = compressorWork * massFlowKgS;
    const condenserCapacityKw = condenserHeat * massFlowKgS;

    const criticalK = coolProp.PropsSI("Tcrit", "", 0, "", 0, fluidNames[fluid]);
    const minimumK = Math.max(toK(-60), coolProp.PropsSI("Tmin", "", 0, "", 0, fluidNames[fluid]) + .2);
    const maximumK = Math.min(criticalK - .35, toK(80));
    const dome: Array<{ liquidH: number; vaporH: number; pressureBar: number }> = [];
    const domeSteps = 56;
    for (let index = 0; index <= domeSteps; index += 1) {
      const temperature = minimumK + (maximumK - minimumK) * index / domeSteps;
      try {
        const pressure = props("P", "T", temperature, "Q", 0);
        dome.push({
          liquidH: props("H", "T", temperature, "Q", 0) / 1000,
          vaporH: props("H", "T", temperature, "Q", 1) / 1000,
          pressureBar: pressure / 100000,
        });
      } catch {
        // Some mixture states close to the critical point are intentionally skipped.
      }
    }

    const hasCompressorEstimate = displacement > 0 && rpm > 0;
    const point = (id: string, label: string, pressure: number, enthalpy: number, temperature: number) => ({
      id,
      label,
      pressureBar: pressure / 100000,
      enthalpy: enthalpy / 1000,
      temperature: toC(temperature),
    });

    return NextResponse.json({
      fluid,
      pressures: {
        lowPsig,
        highPsig,
        lowBarAbsolute: lowPressure / 100000,
        highBarAbsolute: highPressure / 100000,
        ratio: highPressure / lowPressure,
      },
      temperatures: {
        evaporatingDew: toC(evaporatingDewK),
        evaporatingBubble: toC(evaporatingBubbleK),
        condensingDew: toC(condensingDewK),
        condensingBubble: toC(condensingBubbleK),
        suction: toC(suctionTemperatureK),
        discharge: toC(dischargeTemperatureK),
        liquidLine: toC(liquidTemperatureK),
      },
      points: [
        point("1", "Sucção do compressor", lowPressure, h1, suctionTemperatureK),
        point("2", "Descarga do compressor", highPressure, h2, dischargeTemperatureK),
        point("3", "Saída do condensador", highPressure, h3, liquidTemperatureK),
        point("4", "Entrada do evaporador", lowPressure, h4, evaporatingBubbleK),
      ],
      idealDischarge: {
        enthalpy: h2s / 1000,
        temperature: toC(props("T", "P", highPressure, "H", h2s)),
      },
      properties: {
        qualityAtEvaporatorInlet: quality4,
        specificVolume,
        suctionDensity: rho1,
        suctionEntropy: s1 / 1000,
        refrigerationEffect,
        compressorWorkIdeal,
        compressorWork,
        condenserHeat,
        cop,
        copIdeal,
        eer,
      },
      compressor: {
        hasEstimate: hasCompressorEstimate,
        rpm,
        displacement,
        volumetricEfficiency: volumetricEfficiency * 100,
        isentropicEfficiency: isentropicEfficiency * 100,
        theoreticalFlowM3H: displacementFlow,
        suctionFlowM3H: suctionFlow,
        massFlowKgH: hasCompressorEstimate ? massFlowKgH : null,
        evaporatorCapacityKw: hasCompressorEstimate ? evaporatorCapacityKw : null,
        compressorPowerKw: hasCompressorEstimate ? compressorPowerKw : null,
        condenserCapacityKw: hasCompressorEstimate ? condenserCapacityKw : null,
      },
      dome,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no cálculo termodinâmico.";
    return NextResponse.json(
      { error: `Não foi possível calcular este ponto do ciclo. ${message}` },
      { status: 422 },
    );
  }
}
