"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Category = "Início" | "Elétrica" | "Refrigeração" | "Vazão" | "Ferramentas";

type Tool = {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "Início">;
  icon: string;
  accent?: "amber" | "coral";
};

const tools: Tool[] = [
  { id: "potencia", title: "Cálculo de potência", description: "Potência, tensão, corrente e resistência.", category: "Elétrica", icon: "ϟ" },
  { id: "capacitor", title: "Cálculo de capacitor", description: "Dimensionamento de capacitor em circuito.", category: "Elétrica", icon: "▥" },
  { id: "selecao-cabo", title: "Bitola de cabo", description: "Corrente admissível ou seção recomendada.", category: "Elétrica", icon: "⌁" },
  { id: "conversor", title: "Conversor de refrigeração", description: "kW, kcal/h, BTU/h e TR.", category: "Refrigeração", icon: "❄", accent: "amber" },
  { id: "orvalho", title: "Ponto de orvalho", description: "Temperatura, umidade e condensação.", category: "Refrigeração", icon: "◌", accent: "amber" },
  { id: "carga-termica", title: "Carga térmica / vazão", description: "Relação Q = m · c · ΔT.", category: "Refrigeração", icon: "⌂", accent: "amber" },
  { id: "orificio", title: "Cálculo de orifício", description: "Seleção para válvula de expansão.", category: "Refrigeração", icon: "◎", accent: "amber" },
  { id: "selecao-vazao", title: "Cálculo de vazão", description: "Vazão de ar ou de líquido.", category: "Vazão", icon: "≋" },
  { id: "ferramentas", title: "Medições", description: "Luxímetro, sensor magnético e strobo.", category: "Ferramentas", icon: "▣", accent: "coral" },
];

const nav: { label: Category; icon: string }[] = [
  { label: "Início", icon: "⌂" },
  { label: "Elétrica", icon: "ϟ" },
  { label: "Refrigeração", icon: "❄" },
  { label: "Vazão", icon: "◉" },
  { label: "Ferramentas", icon: "⌕" },
];

export default function Home() {
  const [category, setCategory] = useState<Category>("Início");
  const [query, setQuery] = useState("");
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const visibleTools = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return tools.filter((tool) => {
      const inCategory = category === "Início" || tool.category === category;
      const inSearch =
        !needle ||
        `${tool.title} ${tool.description} ${tool.category}`
          .toLocaleLowerCase("pt-BR")
          .includes(needle);
      return inCategory && inSearch;
    });
  }, [category, query]);

  function goTo(next: Category) {
    setCategory(next);
    setActiveTool(null);
    setQuery("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => goTo("Início")} aria-label="Ir para o início">
          <span className="brand-mark"><span>❄</span><b>ϟ</b></span>
          <span>Coldtools</span>
        </button>

        <nav className="side-nav" aria-label="Navegação principal">
          {nav.map((item) => (
            <button
              key={item.label}
              className={category === item.label && !activeTool ? "active" : ""}
              onClick={() => goTo(item.label)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="field-ready">
          <span className="toolbox">▣</span>
          <div><strong>Pronto para o campo</strong><small>Ferramentas técnicas confiáveis para o dia a dia.</small></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="status"><i /> Sistema operacional <b>Tudo em ordem</b></div>
          <div className="top-actions"><span>Modo offline disponível</span><button aria-label="Perfil do técnico">RF</button></div>
        </header>

        <section className="workspace">
          {activeTool ? (
            <ToolWorkspace
              tool={activeTool}
              onBack={() => setActiveTool(null)}
              openTool={(id) => setActiveTool(tools.find((item) => item.id === id) ?? activeTool)}
            />
          ) : (
            <>
              <div className="hero">
                <span className="eyebrow">Coldtools · Calculab</span>
                <h1>{category === "Início" ? "Ferramentas técnicas em um só lugar" : category}</h1>
                <p>
                  {category === "Início"
                    ? "Cálculos elétricos, refrigeração e medições para decisões rápidas em campo."
                    : `Ferramentas de ${category.toLocaleLowerCase("pt-BR")} reunidas em uma experiência prática.`}
                </p>
              </div>

              <label className="search">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Qual cálculo você precisa?"
                  aria-label="Buscar uma ferramenta"
                />
                {query && <button onClick={() => setQuery("")} aria-label="Limpar busca">×</button>}
              </label>

              <div className="section-heading">
                <h2>{query ? "Resultados" : category === "Início" ? "Acesso rápido" : `Ferramentas de ${category}`}</h2>
                <span><i /> {visibleTools.length} {visibleTools.length === 1 ? "ferramenta disponível" : "ferramentas disponíveis"}</span>
              </div>

              <div className="tool-grid">
                {visibleTools.map((tool, index) => (
                  <button
                    key={tool.id}
                    className={`tool-card ${index === 0 && category === "Início" && !query ? "featured" : ""} ${tool.accent ?? ""}`}
                    onClick={() => setActiveTool(tool)}
                  >
                    <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
                    <span className="tool-copy">
                      <small>{tool.category}</small>
                      <strong>{tool.title}</strong>
                      <p>{tool.description}</p>
                    </span>
                    <span className="open-arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>

              {!visibleTools.length && (
                <div className="empty">
                  <span>⌕</span>
                  <h2>Nenhuma ferramenta encontrada</h2>
                  <p>Tente buscar por potência, cabo, vazão, refrigeração ou medição.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <nav className="mobile-nav" aria-label="Navegação móvel">
        {nav.map((item) => (
          <button key={item.label} className={category === item.label && !activeTool ? "active" : ""} onClick={() => goTo(item.label)}>
            <span>{item.icon}</span><small>{item.label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}

type Values = Record<string, string>;

function n(value: string) {
  return Number(value.replace(",", "."));
}

function fmt(value: number, digits = 2) {
  return Number.isFinite(value)
    ? value.toLocaleString("pt-BR", { maximumFractionDigits: digits })
    : "—";
}

function ToolWorkspace({
  tool,
  onBack,
  openTool,
}: {
  tool: Tool;
  onBack: () => void;
  openTool: (id: string) => void;
}) {
  const content: Record<string, React.ReactNode> = {
    potencia: <PowerCalculator />,
    capacitor: <CapacitorCalculator />,
    "selecao-cabo": <CableHub />,
    conversor: <RefrigerationConverter />,
    orvalho: <DewPoint />,
    "carga-termica": <ThermalLoad />,
    orificio: <OrificeCalculator />,
    "selecao-vazao": <FlowHub />,
    ferramentas: <MeasurementHub openTool={openTool} />,
  };

  return (
    <div className="tool-page">
      <button className="back" onClick={onBack}>← Voltar</button>
      <div className="tool-title">
        <span className={`tool-icon ${tool.accent ?? ""}`}>{tool.icon}</span>
        <div><small>{tool.category}</small><h1>{tool.title}</h1><p>{tool.description}</p></div>
      </div>
      {content[tool.id]}
    </div>
  );
}

function Calculator({
  children,
  result,
  note,
}: {
  children: React.ReactNode;
  result?: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="calculator-layout">
      <section className="calc-card">{children}</section>
      <aside className="result-card">
        <span>Resultado</span>
        {result ?? <p>Preencha os dados para visualizar o resultado.</p>}
        {note && <small>{note}</small>}
      </aside>
    </div>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder = "0",
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div><input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />{unit && <b>{unit}</b>}</div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function ResultLine({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return <div className="result-line"><span>{label}</span><strong>{value} {unit}</strong></div>;
}

function PowerCalculator() {
  const [v, setV] = useState<Values>({ p: "", u: "", i: "", r: "" });
  const filled = Object.entries(v).filter(([, value]) => value !== "" && n(value) > 0);
  let result: Values | null = null;
  if (filled.length >= 2) {
    let p = n(v.p), u = n(v.u), i = n(v.i), r = n(v.r);
    if (p && u) { i = p / u; r = (u * u) / p; }
    else if (p && i) { u = p / i; r = p / (i * i); }
    else if (p && r) { i = Math.sqrt(p / r); u = Math.sqrt(p * r); }
    else if (u && i) { p = u * i; r = u / i; }
    else if (u && r) { i = u / r; p = (u * u) / r; }
    else if (i && r) { u = i * r; p = i * i * r; }
    result = { p: fmt(p), u: fmt(u), i: fmt(i), r: fmt(r) };
  }
  const change = (key: string) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  return (
    <Calculator
      result={result && <><ResultLine label="Potência" value={result.p} unit="W" /><ResultLine label="Tensão" value={result.u} unit="V" /><ResultLine label="Corrente" value={result.i} unit="A" /><ResultLine label="Resistência" value={result.r} unit="Ω" /></>}
      note="Informe apenas duas grandezas. O sistema calcula automaticamente as demais pela Lei de Ohm."
    >
      <h2>Insira duas variáveis</h2>
      <p className="calc-intro">Potência, tensão, corrente e resistência.</p>
      <div className="form-grid">
        <Field label="Potência" unit="W" value={v.p} onChange={change("p")} />
        <Field label="Tensão" unit="V" value={v.u} onChange={change("u")} />
        <Field label="Corrente" unit="A" value={v.i} onChange={change("i")} />
        <Field label="Resistência" unit="Ω" value={v.r} onChange={change("r")} />
      </div>
      <button className="secondary" onClick={() => setV({ p: "", u: "", i: "", r: "" })}>Limpar campos</button>
    </Calculator>
  );
}

function CapacitorCalculator() {
  const [v, setV] = useState<Values>({ vin: "220", vout: "", r: "", c: "", hz: "60" });
  const vin = n(v.vin), voutInput = n(v.vout), r = n(v.r), cInput = n(v.c), hz = n(v.hz);
  let output: { vout: number; c: number; current: number; power: number; xc: number } | null = null;
  if (vin > 0 && r > 0 && hz > 0 && (voutInput > 0 || cInput > 0)) {
    if (cInput > 0) {
      const xc = 1 / (2 * Math.PI * hz * cInput * 1e-6);
      const current = vin / Math.sqrt(r * r + xc * xc);
      output = { vout: current * r, c: cInput, current, power: current * current * r, xc };
    } else if (voutInput < vin) {
      const current = voutInput / r;
      const xc = Math.sqrt(Math.max(0, (vin / current) ** 2 - r ** 2));
      output = { vout: voutInput, c: 1e6 / (2 * Math.PI * hz * xc), current, power: voutInput * current, xc };
    }
  }
  const change = (key: string) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  return (
    <Calculator
      result={output && <><ResultLine label="Tensão de saída" value={fmt(output.vout)} unit="V" /><ResultLine label="Capacitor" value={fmt(output.c)} unit="µF" /><ResultLine label="Corrente" value={fmt(output.current, 3)} unit="A" /><ResultLine label="Potência na carga" value={fmt(output.power)} unit="W" /><ResultLine label="Reatância capacitiva" value={fmt(output.xc)} unit="Ω" /></>}
      note="Modelo para carga resistiva em série com capacitor. Confirme o dimensionamento e a classe de segurança do capacitor antes da aplicação."
    >
      <h2>Dimensionamento do capacitor</h2>
      <p className="calc-intro">Informe entrada, resistência e a tensão de saída desejada ou um capacitor conhecido.</p>
      <div className="form-grid">
        <Field label="Tensão de entrada" unit="V" value={v.vin} onChange={change("vin")} />
        <Field label="Tensão de saída" unit="V" value={v.vout} onChange={change("vout")} />
        <Field label="Resistência da carga" unit="Ω" value={v.r} onChange={change("r")} />
        <Field label="Capacitor" unit="µF" value={v.c} onChange={change("c")} />
        <Field label="Frequência" unit="Hz" value={v.hz} onChange={change("hz")} />
      </div>
    </Calculator>
  );
}

const cableSections = [0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500];
const ampacity: Record<string, number[]> = {
  B1: [9, 11, 14, 17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269, 309, 353, 415, 477, 571, 656],
  B2: [9, 11, 13.5, 16, 22, 30, 38, 52, 69, 90, 111, 133, 168, 201, 232, 265, 300, 351, 401, 477, 545],
  C: [10, 13, 15, 19.5, 27, 36, 46, 63, 85, 112, 138, 168, 213, 258, 299, 344, 392, 461, 530, 634, 729],
};
const circuitFactors = [1, 0.8, 0.7, 0.65, 0.6, 0.57, 0.54];

function CableHub() {
  const [screen, setScreen] = useState<"menu" | "ampacity" | "installation" | "sizing">("menu");
  const [installation, setInstallation] = useState("B1");
  if (screen === "menu") return <ChoiceGrid title="Selecione o método" choices={[
    { icon: "A", title: "Corrente pela seção", text: "Escolha uma bitola e veja a corrente máxima recomendada.", action: () => setScreen("ampacity") },
    { icon: "mm²", title: "Seção pela carga", text: "Dimensione o cabo por corrente, potência, comprimento e queda.", action: () => setScreen("installation") },
  ]} />;
  if (screen === "ampacity") return <InnerScreen title="Corrente máxima recomendada" onBack={() => setScreen("menu")}><CableAmpacity /></InnerScreen>;
  if (screen === "installation") return (
    <InnerScreen title="Tipo de instalação" onBack={() => setScreen("menu")}>
      <p className="calc-intro">Clique na imagem que corresponde ao método de instalação.</p>
      <div className="installation-grid">
        {[1,2,3,4,5,6,7].map((image, index) => {
          const type = [ "B1", "B2", "C", "C", "B1", "B2", "C" ][index];
          return <button key={image} onClick={() => { setInstallation(type); setScreen("sizing"); }}><img src={`/app-assets/${image}.png`} alt={`Método de instalação ${image}, categoria ${type}`} /><strong>{type}</strong><span>Método {image}</span></button>;
        })}
      </div>
      <details className="reference"><summary>Consultar tabela de métodos de instalação</summary><img src="/app-assets/Tabela_Metodo_Instalacao_2020.png" alt="Tabela de métodos de instalação elétrica" /></details>
    </InnerScreen>
  );
  return <InnerScreen title={`Dimensionamento — método ${installation}`} onBack={() => setScreen("installation")}><CableSizing installation={installation} /></InnerScreen>;
}

function CableAmpacity() {
  const [section, setSection] = useState("2.5");
  const [installation, setInstallation] = useState("B1");
  const [phase, setPhase] = useState("Monofásico");
  const [circuits, setCircuits] = useState("1");
  const [safety, setSafety] = useState("0");
  const index = cableSections.indexOf(Number(section));
  const phaseFactor = phase === "Trifásico" ? 0.87 : 1;
  const result = ampacity[installation][index] * circuitFactors[Math.min(6, Number(circuits) - 1)] * phaseFactor * (1 - n(safety) / 100);
  return (
    <Calculator result={<><ResultLine label="Corrente máxima sugerida" value={fmt(result, 1)} unit="A" /><ResultLine label="Seção selecionada" value={section} unit="mm²" /></>} note="Referência prática baseada em cabos de cobre e fatores de agrupamento. Verifique temperatura, isolação e norma aplicável.">
      <div className="form-grid">
        <SelectField label="Seção do cabo" value={section} onChange={setSection} options={cableSections.map(String)} />
        <SelectField label="Tipo de instalação" value={installation} onChange={setInstallation} options={["B1","B2","C"]} />
        <SelectField label="Circuito" value={phase} onChange={setPhase} options={["Monofásico","Trifásico"]} />
        <SelectField label="Circuitos no mesmo eletroduto" value={circuits} onChange={setCircuits} options={["1","2","3","4","5","6","7"]} />
        <Field label="Fator de segurança" unit="%" value={safety} onChange={setSafety} />
      </div>
    </Calculator>
  );
}

function CableSizing({ installation }: { installation: string }) {
  const [v, setV] = useState<Values>({ voltage: "220", load: "", length: "", circuits: "1", source: "Potência (W)", phase: "Monofásico" });
  const voltage = n(v.voltage), load = n(v.load), length = n(v.length);
  const current = v.source === "Potência (W)" ? load / Math.max(voltage * (v.phase === "Trifásico" ? Math.sqrt(3) : 1), 1) : load;
  const group = circuitFactors[Math.min(6, Number(v.circuits) - 1)];
  const maxDrop = voltage * 0.04;
  const sectionByDrop = current && length ? (2 * 0.0175 * length * current) / Math.max(maxDrop, .01) : 0;
  const recommended = cableSections.find((section, index) => section >= sectionByDrop && ampacity[installation][index] * group >= current) ?? 500;
  const drop = recommended && current ? (2 * 0.0175 * length * current) / recommended : 0;
  const change = (key: string) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  return (
    <Calculator result={current > 0 && length > 0 ? <><ResultLine label="Seção recomendada" value={fmt(recommended, 2)} unit="mm²" /><ResultLine label="Corrente calculada" value={fmt(current, 2)} unit="A" /><ResultLine label="Queda de tensão" value={fmt(drop, 2)} unit="V" /><ResultLine label="Queda percentual" value={fmt(drop / voltage * 100, 2)} unit="%" /></> : undefined} note="Critério combinado de capacidade de condução e queda máxima de 4%, para cobre. O projeto deve ser confirmado por profissional habilitado.">
      <div className="form-grid">
        <Field label="Tensão" unit="V" value={v.voltage} onChange={change("voltage")} />
        <SelectField label="Informar por" value={v.source} onChange={change("source")} options={["Potência (W)","Corrente (A)"]} />
        <Field label={v.source} value={v.load} onChange={change("load")} />
        <SelectField label="Circuito" value={v.phase} onChange={change("phase")} options={["Monofásico","Trifásico"]} />
        <Field label="Comprimento" unit="m" value={v.length} onChange={change("length")} />
        <SelectField label="Circuitos no eletroduto" value={v.circuits} onChange={change("circuits")} options={["1","2","3","4","5","6","7"]} />
      </div>
    </Calculator>
  );
}

function RefrigerationConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("kcal/h");
  const input = n(value);
  const kw = unit === "kW" ? input : unit === "kcal/h" ? input / 860 : unit === "BTU/h" ? input / 3412.142 : input * 3.517;
  return (
    <Calculator result={input > 0 ? <><ResultLine label="Quilowatt" value={fmt(kw, 3)} unit="kW" /><ResultLine label="Quilocaloria por hora" value={fmt(kw * 860)} unit="kcal/h" /><ResultLine label="BTU por hora" value={fmt(kw * 3412.142)} unit="BTU/h" /><ResultLine label="Tonelada de refrigeração" value={fmt(kw / 3.517, 3)} unit="TR" /></> : undefined}>
      <h2>Conversão de unidades</h2><p className="calc-intro">Digite um valor e selecione a unidade de origem.</p>
      <div className="form-grid"><Field label="Valor" value={value} onChange={setValue} /><SelectField label="Unidade" value={unit} onChange={setUnit} options={["kcal/h","kW","BTU/h","TR"]} /></div>
    </Calculator>
  );
}

function DewPoint() {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const t = n(temperature), rh = n(humidity);
  const a = 17.62, b = 243.12;
  const gamma = rh > 0 ? Math.log(rh / 100) + (a * t) / (b + t) : NaN;
  const dew = (b * gamma) / (a - gamma);
  return (
    <Calculator result={Number.isFinite(dew) ? <><ResultLine label="Ponto de orvalho" value={fmt(dew, 1)} unit="°C" /><ResultLine label="Margem até condensação" value={fmt(t - dew, 1)} unit="°C" /></> : undefined} note="Cálculo pela aproximação de Magnus. Superfícies abaixo do ponto de orvalho podem apresentar condensação.">
      <h2>Condições do ambiente</h2><div className="form-grid"><Field label="Temperatura ambiente" unit="°C" value={temperature} onChange={setTemperature} /><Field label="Umidade relativa" unit="%" value={humidity} onChange={setHumidity} /></div>
    </Calculator>
  );
}

function ThermalLoad() {
  const [mode, setMode] = useState("Carga térmica");
  const [liquid, setLiquid] = useState("Água");
  const [tin, setTin] = useState("");
  const [tout, setTout] = useState("");
  const [known, setKnown] = useState("");
  const delta = Math.abs(n(tout) - n(tin));
  const cp = liquid === "Água" ? 1 : .95;
  const result = mode === "Carga térmica" ? n(known) * cp * delta : n(known) / Math.max(cp * delta, .0001);
  return (
    <Calculator result={result > 0 ? <><ResultLine label={mode} value={fmt(result)} unit={mode === "Carga térmica" ? "kcal/h" : "L/h"} /><ResultLine label="ΔT" value={fmt(delta, 1)} unit="°C" /><ResultLine label="Calor específico adotado" value={fmt(cp, 2)} unit="kcal/kg°C" /></> : undefined} note="Para estimativa de água ou cerveja com densidade aproximada de 1 kg/L.">
      <h2>Q = m · c · ΔT</h2>
      <div className="form-grid">
        <SelectField label="O que deseja calcular" value={mode} onChange={setMode} options={["Carga térmica","Vazão"]} />
        <SelectField label="Líquido" value={liquid} onChange={setLiquid} options={["Água","Cerveja"]} />
        <Field label="Temperatura de entrada" unit="°C" value={tin} onChange={setTin} />
        <Field label="Temperatura de saída" unit="°C" value={tout} onChange={setTout} />
        <Field label={mode === "Carga térmica" ? "Vazão" : "Carga térmica"} unit={mode === "Carga térmica" ? "L/h" : "kcal/h"} value={known} onChange={setKnown} />
      </div>
    </Calculator>
  );
}

function OrificeCalculator() {
  const [fluid, setFluid] = useState("R22");
  const [evap, setEvap] = useState("-10");
  const [load, setLoad] = useState("");
  const [unit, setUnit] = useState("kcal/h");
  const [min, setMin] = useState("80");
  const [max, setMax] = useState("120");
  const kw = unit === "kW" ? n(load) : n(load) / 860;
  const fluidFactor = fluid === "R22" ? 1 : fluid === "R134a" ? .82 : 1.18;
  const tempFactor = 1 + (-10 - n(evap)) * .012;
  const nominal = kw / Math.max(fluidFactor * tempFactor, .1);
  const orifices = [0.5, 1, 1.7, 2.6, 3.8, 5.2, 7.0];
  const index = orifices.findIndex((capacity) => nominal <= capacity * n(max) / 100 && nominal >= capacity * n(min) / 100);
  const verdict = !load ? null : index < 0 ? (nominal < orifices[0] * n(min) / 100 ? "Carga muito baixa" : "Carga muito alta — divida em mais circuitos") : `Orifício ${index}`;
  return (
    <Calculator result={verdict ? <><div className={index < 0 ? "result-badge warning" : "result-badge"}>{verdict}</div><ResultLine label="Carga convertida" value={fmt(kw, 3)} unit="kW" /><ResultLine label="Índice de seleção" value={fmt(nominal, 2)} /></> : undefined} note="Seleção orientativa baseada nas condições do app: condensação 45 °C, superaquecimento 6 K e sub-resfriamento 2 K. Confirme na tabela do fabricante da válvula.">
      <div className="conditions"><span>Condensação 45 °C</span><span>Superaquecimento 6 K</span><span>Sub-resfriamento 2 K</span></div>
      <div className="form-grid">
        <SelectField label="Fluido refrigerante" value={fluid} onChange={setFluid} options={["R22","R134a","R404a"]} />
        <SelectField label="Temperatura de evaporação" value={evap} onChange={setEvap} options={["-30","-25","-20","-15","-10","-5","0"]} />
        <Field label="Carga térmica" value={load} onChange={setLoad} />
        <SelectField label="Unidade" value={unit} onChange={setUnit} options={["kcal/h","kW"]} />
        <Field label="Faixa mínima" unit="%" value={min} onChange={setMin} />
        <Field label="Faixa máxima" unit="%" value={max} onChange={setMax} />
      </div>
    </Calculator>
  );
}

function FlowHub() {
  const [screen, setScreen] = useState<"menu" | "duct" | "circular" | "rectangular" | "liquid">("menu");
  if (screen === "menu") return <ChoiceGrid title="Selecione o fluido" choices={[
    { icon: "≋", title: "Vazão de ar", text: "Calcule em duto circular ou retangular.", action: () => setScreen("duct"), image: "/app-assets/VENTO.png" },
    { icon: "◉", title: "Vazão de líquido", text: "Calcule por volume e tempo de coleta.", action: () => setScreen("liquid"), image: "/app-assets/TorneiraDesenhoParaColorir.png" },
  ]} />;
  if (screen === "duct") return <InnerScreen title="Modelo do duto" onBack={() => setScreen("menu")}><ChoiceGrid choices={[
    { icon: "○", title: "Duto circular", text: "Área pela medida do diâmetro.", action: () => setScreen("circular"), image: "/app-assets/dutocricular.png" },
    { icon: "▭", title: "Duto retangular", text: "Área pela altura e largura.", action: () => setScreen("rectangular"), image: "/app-assets/dutoretangular.png" },
  ]} /></InnerScreen>;
  if (screen === "circular") return <InnerScreen title="Vazão em duto circular" onBack={() => setScreen("duct")}><AirFlow shape="circular" /></InnerScreen>;
  if (screen === "rectangular") return <InnerScreen title="Vazão em duto retangular" onBack={() => setScreen("duct")}><AirFlow shape="rectangular" /></InnerScreen>;
  return <InnerScreen title="Vazão de líquido" onBack={() => setScreen("menu")}><LiquidFlow /></InnerScreen>;
}

function AirFlow({ shape }: { shape: "circular" | "rectangular" }) {
  const [points, setPoints] = useState("1");
  const [velocities, setVelocities] = useState(["","","","",""]);
  const [dimensionA, setDimensionA] = useState("");
  const [dimensionB, setDimensionB] = useState("");
  const [unit, setUnit] = useState("Metro");
  const count = Number(points);
  const valid = velocities.slice(0, count).map(n).filter((value) => value >= 0);
  const average = valid.length === count ? valid.reduce((a,b) => a+b,0) / count : 0;
  const factor = unit === "Polegada" ? .0254 : 1;
  const a = n(dimensionA) * factor, b = n(dimensionB) * factor;
  const area = shape === "circular" ? Math.PI * (a / 2) ** 2 : a * b;
  const m3s = area * average;
  return (
    <Calculator result={m3s > 0 ? <><ResultLine label="Velocidade média" value={fmt(average, 2)} unit="m/s" /><ResultLine label="Área do duto" value={fmt(area, 4)} unit="m²" /><ResultLine label="Vazão" value={fmt(m3s * 3600)} unit="m³/h" /><ResultLine label="Vazão" value={fmt(m3s * 60)} unit="m³/min" /><ResultLine label="Vazão" value={fmt(m3s * 60000)} unit="L/min" /></> : undefined}>
      <div className="form-grid">
        <SelectField label="Pontos de medição" value={points} onChange={setPoints} options={["1","5"]} />
        <SelectField label="Unidade do duto" value={unit} onChange={setUnit} options={["Metro","Polegada"]} />
        {Array.from({ length: count }).map((_, index) => <Field key={index} label={`Velocidade no ponto ${index + 1}`} unit="m/s" value={velocities[index]} onChange={(value) => setVelocities((old) => old.map((item,i) => i === index ? value : item))} />)}
        <Field label={shape === "circular" ? "Diâmetro" : "Altura"} unit={unit === "Polegada" ? "pol" : "m"} value={dimensionA} onChange={setDimensionA} />
        {shape === "rectangular" && <Field label="Largura" unit={unit === "Polegada" ? "pol" : "m"} value={dimensionB} onChange={setDimensionB} />}
      </div>
    </Calculator>
  );
}

function LiquidFlow() {
  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const lpm = n(volume) / Math.max(n(time), .0001) * 60;
  return (
    <Calculator result={lpm > 0 ? <><ResultLine label="Vazão" value={fmt(lpm, 2)} unit="L/min" /><ResultLine label="Vazão" value={fmt(lpm * 60, 2)} unit="L/h" /><ResultLine label="Vazão" value={fmt(lpm / 60, 4)} unit="L/s" /></> : undefined} note="Método volumétrico: meça o volume coletado e o tempo transcorrido.">
      <div className="form-grid"><Field label="Volume coletado" unit="L" value={volume} onChange={setVolume} /><Field label="Tempo de coleta" unit="s" value={time} onChange={setTime} /></div>
    </Calculator>
  );
}

function MeasurementHub({ openTool }: { openTool: (id: string) => void }) {
  const [screen, setScreen] = useState<"menu" | "lux" | "magnetic" | "strobe">("menu");
  if (screen === "menu") return <ChoiceGrid title="Ferramentas disponíveis" choices={[
    { icon: "◎", title: "Cálculo de orifício", text: "Dimensione o orifício da válvula.", action: () => openTool("orificio"), image: "/app-assets/VALVULA.png" },
    { icon: "☀", title: "Luxímetro", text: "Medições comparativas de luminosidade.", action: () => setScreen("lux"), image: "/app-assets/luximetro.png" },
    { icon: "⊙", title: "Sensor magnético", text: "Detecte campo de bobinas e solenoides.", action: () => setScreen("magnetic") },
    { icon: "✺", title: "Strobo", text: "Pulso visual ajustável por RPM.", action: () => setScreen("strobe") },
  ]} />;
  if (screen === "lux") return <InnerScreen title="Luxímetro comparativo" onBack={() => setScreen("menu")}><LuxMeter /></InnerScreen>;
  if (screen === "magnetic") return <InnerScreen title="Sensor magnético" onBack={() => setScreen("menu")}><MagneticMeter /></InnerScreen>;
  return <InnerScreen title="Strobo" onBack={() => setScreen("menu")}><Strobe /></InnerScreen>;
}

function LuxMeter() {
  const [lux, setLux] = useState("");
  const [message, setMessage] = useState("Verificando disponibilidade do sensor...");
  useEffect(() => {
    let sensor: { start?: () => void; stop?: () => void; illuminance?: number; addEventListener?: (name: string, cb: () => void) => void } | null = null;
    const Ambient = (window as unknown as { AmbientLightSensor?: new (options: { frequency: number }) => typeof sensor }).AmbientLightSensor;
    if (Ambient) {
      try {
        sensor = new Ambient({ frequency: 2 });
        sensor?.addEventListener?.("reading", () => setLux(String(Math.round(sensor?.illuminance ?? 0))));
        sensor?.start?.();
        setMessage("Sensor do dispositivo conectado.");
      } catch { setMessage("O navegador bloqueou o sensor. Use a entrada manual comparativa."); }
    } else setMessage("Sensor de luminosidade indisponível neste navegador. Use a entrada manual.");
    return () => sensor?.stop?.();
  }, []);
  return <Calculator result={lux ? <><div className="gauge"><strong>{fmt(n(lux),0)}</strong><span>lux</span></div><ResultLine label="Classificação" value={n(lux) < 100 ? "Baixa" : n(lux) < 500 ? "Moderada" : "Alta"} /></> : undefined} note={message}><Field label="Leitura manual / sensor" unit="lux" value={lux} onChange={setLux} /></Calculator>;
}

function MagneticMeter() {
  const [v, setV] = useState<Values>({ x: "", y: "", z: "" });
  const magnitude = Math.sqrt(n(v.x) ** 2 + n(v.y) ** 2 + n(v.z) ** 2);
  const change = (key: string) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  return (
    <Calculator result={magnitude > 0 ? <><div className={`coil-state ${magnitude > 50 ? "on" : ""}`}>{magnitude > 50 ? "BOBINA ATIVA" : "CAMPO BAIXO"}</div><ResultLine label="Campo resultante" value={fmt(magnitude, 1)} unit="µT" /></> : undefined} note="A maioria dos navegadores móveis não libera o magnetômetro diretamente. Insira leituras X, Y e Z de um medidor disponível para comparar o campo.">
      <div className="form-grid"><Field label="Eixo X" unit="µT" value={v.x} onChange={change("x")} /><Field label="Eixo Y" unit="µT" value={v.y} onChange={change("y")} /><Field label="Eixo Z" unit="µT" value={v.z} onChange={change("z")} /></div>
    </Calculator>
  );
}

function Strobe() {
  const [rpm, setRpm] = useState("600");
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (running) {
      const hz = Math.min(15, Math.max(1, n(rpm) / 60));
      timer.current = setInterval(() => setFlash((old) => !old), 500 / hz);
    } else setFlash(false);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running, rpm]);
  return (
    <div className={`strobe-card ${flash ? "flash" : ""}`}>
      <div className="strobe-warning">Atenção: luz intermitente. Não utilize se houver sensibilidade a flashes ou histórico de epilepsia.</div>
      <label>Valor atual</label><strong>{rpm} <small>RPM</small></strong>
      <input type="range" min="60" max="900" step="30" value={rpm} onChange={(e) => setRpm(e.target.value)} />
      <div className="strobe-actions"><button onClick={() => setRpm(String(Math.max(60,n(rpm)-30)))}>−</button><button className="primary" onClick={() => setRunning((old) => !old)}>{running ? "Parar" : "Iniciar"}</button><button onClick={() => setRpm(String(Math.min(900,n(rpm)+30)))}>+</button></div>
      <p>Frequência: {fmt(Math.min(15, Math.max(1, n(rpm) / 60)),1)} Hz. A versão web usa a tela; o flash da câmera depende de permissões que os navegadores normalmente não oferecem.</p>
    </div>
  );
}

function ChoiceGrid({
  title,
  choices,
}: {
  title?: string;
  choices: { icon: string; title: string; text: string; action: () => void; image?: string }[];
}) {
  return <section className="choice-section">{title && <h2>{title}</h2>}<div className="choice-grid">{choices.map((choice) => <button key={choice.title} onClick={choice.action}>{choice.image ? <img src={choice.image} alt="" /> : <span>{choice.icon}</span>}<div><strong>{choice.title}</strong><p>{choice.text}</p></div><b>→</b></button>)}</div></section>;
}

function InnerScreen({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return <div className="inner-screen"><div className="inner-head"><button onClick={onBack}>← Etapa anterior</button><h2>{title}</h2></div>{children}</div>;
}
