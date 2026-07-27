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
  { id: "saturacao", title: "Régua de saturação", description: "Pressão em psig × temperatura do refrigerante.", category: "Refrigeração", icon: "↔", accent: "amber" },
  { id: "diagnostico-termico", title: "Superaquecimento e sub-resfriamento", description: "Calcule superaquecimento útil, total e sub-resfriamento.", category: "Refrigeração", icon: "∆", accent: "amber" },
  { id: "solucoes-anticongelantes", title: "Soluções anticongelantes", description: "Proporção, congelamento e densidade da solução.", category: "Refrigeração", icon: "◒", accent: "amber" },
  { id: "congelamento-cerveja", title: "Congelamento da cerveja", description: "Estime o início do congelamento por estilo, álcool e densidade.", category: "Refrigeração", icon: "◐", accent: "amber" },
  { id: "orvalho", title: "Ponto de orvalho", description: "Temperatura, umidade e condensação.", category: "Refrigeração", icon: "◌", accent: "amber" },
  { id: "carga-termica", title: "Carga térmica / vazão", description: "Relação Q = m · c · ΔT.", category: "Refrigeração", icon: "⌂", accent: "amber" },
  { id: "orificio", title: "Cálculo de orifício", description: "Seleção para válvula de expansão.", category: "Refrigeração", icon: "◎", accent: "amber" },
  { id: "selecao-vazao", title: "Cálculo de vazão", description: "Vazão de ar ou de líquido.", category: "Vazão", icon: "≋" },
  { id: "ferramentas", title: "Ferramentas de campo", description: "Strobo e acesso rápido ao cálculo de orifício.", category: "Ferramentas", icon: "▣", accent: "coral" },
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
    saturacao: <SaturationRuler />,
    "diagnostico-termico": <ThermalDiagnostics />,
    "solucoes-anticongelantes": <AntifreezeMixture />,
    "congelamento-cerveja": <BeerFreezingPoint />,
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
    <Calculator result={Number.isFinite(dew) ? <ResultLine label="Ponto de orvalho" value={fmt(dew, 1)} unit="°C" /> : undefined} note="Cálculo pela aproximação de Magnus. Superfícies abaixo do ponto de orvalho podem apresentar condensação.">
      <h2>Condições do ambiente</h2><div className="form-grid"><Field label="Temperatura ambiente" unit="°C" value={temperature} onChange={setTemperature} /><Field label="Umidade relativa" unit="%" value={humidity} onChange={setHumidity} /></div>
    </Calculator>
  );
}

const refrigerantPressureTable = {
  R134a: [[-50,-10.42],[-45,-9.02],[-40,-7.27],[-35,-5.1],[-30,-2.46],[-25,0.74],[-20,4.56],[-15,9.08],[-10,14.4],[-5,20.6],[0,27.77],[5,36.02],[10,45.44],[15,56.14],[20,68.22],[25,81.81],[30,97.01],[35,113.95],[40,132.75],[45,153.54],[50,176.45],[55,201.63],[60,229.23],[65,259.4],[70,292.32]],
  R410A: [[-50,1.05],[-45,5.41],[-40,10.66],[-35,16.94],[-30,24.37],[-25,33.08],[-20,43.22],[-15,54.93],[-10,68.36],[-5,83.68],[0,101.06],[5,120.65],[10,142.64],[15,167.22],[20,194.58],[25,224.93],[30,258.47],[35,295.44],[40,336.09],[45,380.7],[50,429.55],[55,483.02],[60,541.5],[65,605.54],[70,675.93]],
  R32: [[-50,1.28],[-45,5.7],[-40,11.04],[-35,17.41],[-30,24.96],[-25,33.83],[-20,44.15],[-15,56.09],[-10,69.81],[-5,85.46],[0,103.23],[5,123.3],[10,145.85],[15,171.07],[20,199.17],[25,230.36],[30,264.87],[35,302.91],[40,344.75],[45,390.65],[50,440.9],[55,495.82],[60,555.77],[65,621.19],[70,692.63]],
  R22: [[-50,-5.34],[-45,-2.67],[-40,0.57],[-35,4.45],[-30,9.07],[-25,14.52],[-20,20.88],[-15,28.26],[-10,36.76],[-5,46.48],[0,57.53],[5,70.02],[10,84.07],[15,99.78],[20,117.29],[25,136.71],[30,158.17],[35,181.8],[40,207.73],[45,236.1],[50,267.07],[55,300.77],[60,337.38],[65,377.07],[70,420.04]],
  R404A: [[-50,-2.95],[-45,0.34],[-40,4.3],[-35,9.04],[-30,14.64],[-25,21.2],[-20,28.84],[-15,37.66],[-10,47.78],[-5,59.3],[0,72.37],[5,87.09],[10,103.61],[15,122.06],[20,142.58],[25,165.33],[30,190.46],[35,218.14],[40,248.54],[45,281.87],[50,318.33],[55,358.19],[60,401.74],[65,449.43],[70,502.11]],
  R290: [[-50,-4.46],[-45,-1.78],[-40,1.42],[-35,5.21],[-30,9.65],[-25,14.81],[-20,20.77],[-15,27.6],[-10,35.38],[-5,44.19],[0,54.12],[5,65.24],[10,77.64],[15,91.4],[20,106.62],[25,123.39],[30,141.8],[35,161.94],[40,183.92],[45,207.84],[50,233.8],[55,261.92],[60,292.31],[65,325.12],[70,360.48]],
} as const;

const refrigerantLiquidPressureTable = {
  R410A: [[-50,1.11],[-45,5.48],[-40,10.76],[-35,17.06],[-30,24.51],[-25,33.25],[-20,43.42],[-15,55.17],[-10,68.64],[-5,84.01],[0,101.44],[5,121.09],[10,143.15],[15,167.8],[20,195.24],[25,225.67],[30,259.3],[35,296.37],[40,337.11],[45,381.8],[50,430.73],[55,484.21],[60,542.63],[65,606.45],[70,676.25]],
  R404A: [[-50,-2.48],[-45,0.88],[-40,4.93],[-35,9.75],[-30,15.44],[-25,22.1],[-20,29.85],[-15,38.77],[-10,48.99],[-5,60.63],[0,73.8],[5,88.64],[10,105.26],[15,123.81],[20,144.43],[25,167.27],[30,192.47],[35,220.21],[40,250.66],[45,284.01],[50,320.47],[55,360.28],[60,403.74],[65,451.23],[70,503.39]],
} as const;

type Refrigerant = keyof typeof refrigerantPressureTable;
type PressurePoint = readonly [temperature: number, pressure: number];

function interpolateSaturationTemperature(table: ReadonlyArray<PressurePoint>, pressure: number) {
  if (pressure <= table[0][1]) return table[0][0];
  if (pressure >= table[table.length - 1][1]) return table[table.length - 1][0];
  const upperIndex = table.findIndex((point) => point[1] >= pressure);
  const lower = table[upperIndex - 1];
  const upper = table[upperIndex];
  return lower[0] + ((pressure - lower[1]) / (upper[1] - lower[1])) * (upper[0] - lower[0]);
}

function SaturationRuler() {
  const [fluid, setFluid] = useState<Refrigerant>("R134a");
  const [pressure, setPressure] = useState("27.8");
  const table = refrigerantPressureTable[fluid] as ReadonlyArray<PressurePoint>;
  const minimum = table[0][1];
  const maximum = table[table.length - 1][1];
  const pressureValue = Math.min(maximum, Math.max(minimum, n(pressure)));
  const temperature = interpolateSaturationTemperature(table, pressureValue);

  function changeFluid(nextFluid: string) {
    const selected = nextFluid as Refrigerant;
    const nextTable = refrigerantPressureTable[selected] as ReadonlyArray<PressurePoint>;
    setFluid(selected);
    setPressure(String(Math.round((nextTable[0][1] + nextTable[nextTable.length - 1][1]) / 2)));
  }

  return (
    <Calculator
      result={<><ResultLine label="Temperatura de saturação" value={fmt(temperature, 1)} unit="°C" /><ResultLine label="Pressão manométrica" value={fmt(pressureValue, 1)} unit="psig" /></>}
      note="Curva de vapor saturado (dew), indicada para superaquecimento. Valores interpolados entre −50 °C e 70 °C; confirme a tabela do fabricante em aplicações críticas."
    >
      <h2>Régua pressão × temperatura</h2>
      <p className="calc-intro">Selecione o fluido e mova a régua ou digite a pressão lida no manômetro.</p>
      <div className="form-grid">
        <SelectField label="Fluido refrigerante" value={fluid} onChange={changeFluid} options={Object.keys(refrigerantPressureTable)} />
        <Field label="Pressão" unit="psig" value={pressure} onChange={setPressure} />
      </div>
      <label className="pressure-ruler">
        <span>PRESSÃO NA RÉGUA</span>
        <input type="range" min={minimum} max={maximum} step="0.1" value={pressureValue} onChange={(event) => setPressure(event.target.value)} />
        <div><small>{fmt(minimum, 1)} psig</small><strong>{fmt(pressureValue, 1)} psig</strong><small>{fmt(maximum, 1)} psig</small></div>
      </label>
    </Calculator>
  );
}

function ThermalDiagnostics() {
  const [fluid, setFluid] = useState<Refrigerant>("R134a");
  const [values, setValues] = useState<Values>({
    lowPressure: "",
    highPressure: "",
    evaporatorOutlet: "",
    suction: "",
    condenserOutlet: "",
  });
  const complete = Object.values(values).every((value) => value.trim() !== "" && Number.isFinite(n(value)));
  const vaporTable = refrigerantPressureTable[fluid] as ReadonlyArray<PressurePoint>;
  const liquidTable = (fluid === "R410A" || fluid === "R404A"
    ? refrigerantLiquidPressureTable[fluid]
    : vaporTable) as ReadonlyArray<PressurePoint>;
  const lowSaturation = interpolateSaturationTemperature(vaporTable, n(values.lowPressure));
  const highSaturation = interpolateSaturationTemperature(liquidTable, n(values.highPressure));
  const usefulSuperheat = n(values.evaporatorOutlet) - lowSaturation;
  const totalSuperheat = n(values.suction) - lowSaturation;
  const subcooling = highSaturation - n(values.condenserOutlet);
  const change = (key: string) => (value: string) => setValues((old) => ({ ...old, [key]: value }));

  return (
    <Calculator
      result={complete ? <>
        <ResultLine label="Superaquecimento útil" value={fmt(usefulSuperheat, 1)} unit="K" />
        <ResultLine label="Superaquecimento total" value={fmt(totalSuperheat, 1)} unit="K" />
        <ResultLine label="Sub-resfriamento" value={fmt(subcooling, 1)} unit="K" />
        <ResultLine label="Saturação na baixa" value={fmt(lowSaturation, 1)} unit="°C" />
        <ResultLine label="Saturação na alta" value={fmt(highSaturation, 1)} unit="°C" />
      </> : undefined}
      note="Baixa pressão convertida pela curva de vapor saturado (dew) e alta pressão pela curva de líquido saturado (bubble). Informe pressões manométricas em psig e temperaturas em °C."
    >
      <h2>Diagnóstico térmico do sistema</h2>
      <p className="calc-intro">Preencha as pressões de operação e as três temperaturas medidas no circuito.</p>
      <div className="form-grid">
        <SelectField label="Fluido refrigerante" value={fluid} onChange={(value) => setFluid(value as Refrigerant)} options={Object.keys(refrigerantPressureTable)} />
        <Field label="Pressão de baixa" unit="psig" value={values.lowPressure} onChange={change("lowPressure")} />
        <Field label="Pressão de alta" unit="psig" value={values.highPressure} onChange={change("highPressure")} />
        <Field label="Saída do evaporador" unit="°C" value={values.evaporatorOutlet} onChange={change("evaporatorOutlet")} />
        <Field label="Temperatura de sucção" unit="°C" value={values.suction} onChange={change("suction")} />
        <Field label="Saída do condensador" unit="°C" value={values.condenserOutlet} onChange={change("condenserOutlet")} />
      </div>
      <button className="secondary" onClick={() => setValues({ lowPressure: "", highPressure: "", evaporatorOutlet: "", suction: "", condenserOutlet: "" })}>Limpar medições</button>
    </Calculator>
  );
}

type AntifreezeType = "Propilenoglicol" | "Etanol" | "Álcool de cereais 96%";

const propyleneFreezing: ReadonlyArray<PressurePoint> = [[0,0],[10,-3],[20,-7],[30,-13],[40,-22],[50,-34],[60,-51]];
const ethanolFreezing: ReadonlyArray<PressurePoint> = [[0,0],[10,-4],[20,-9],[30,-15],[40,-23],[50,-32],[60,-44],[70,-58],[80,-76],[90,-103],[100,-114]];
const propyleneDensity25: ReadonlyArray<PressurePoint> = [[0,.997],[10,1.006],[20,1.015],[30,1.024],[40,1.033],[50,1.042],[60,1.05]];
const propyleneDensity0: ReadonlyArray<PressurePoint> = [[0,.9998],[10,1.011],[20,1.022],[30,1.033],[40,1.046],[50,1.058],[60,1.07]];
const ethanolDensity25: ReadonlyArray<PressurePoint> = [[0,.997],[10,.982],[20,.968],[30,.951],[40,.932],[50,.911],[60,.889],[70,.866],[80,.841],[90,.815],[100,.785]];
const ethanolDensity0: ReadonlyArray<PressurePoint> = [[0,.9998],[10,.990],[20,.979],[30,.965],[40,.949],[50,.930],[60,.909],[70,.886],[80,.860],[90,.833],[100,.806]];

function interpolateByConcentration(table: ReadonlyArray<PressurePoint>, concentration: number) {
  if (concentration <= table[0][0]) return table[0][1];
  if (concentration >= table[table.length - 1][0]) return table[table.length - 1][1];
  const upperIndex = table.findIndex((point) => point[0] >= concentration);
  const lower = table[upperIndex - 1];
  const upper = table[upperIndex];
  return lower[1] + ((concentration - lower[0]) / (upper[0] - lower[0])) * (upper[1] - lower[1]);
}

function concentrationForFreezingPoint(table: ReadonlyArray<PressurePoint>, targetTemperature: number) {
  if (targetTemperature >= table[0][1]) return table[0][0];
  if (targetTemperature <= table[table.length - 1][1]) return table[table.length - 1][0];
  const upperIndex = table.findIndex((point) => point[1] <= targetTemperature);
  const warmer = table[upperIndex - 1];
  const colder = table[upperIndex];
  return warmer[0] + ((targetTemperature - warmer[1]) / (colder[1] - warmer[1])) * (colder[0] - warmer[0]);
}

function AntifreezeMixture() {
  const [mode, setMode] = useState("Informar proporção");
  const [mixture, setMixture] = useState<AntifreezeType>("Propilenoglicol");
  const [concentration, setConcentration] = useState("30");
  const [operationTemperature, setOperationTemperature] = useState("-10");
  const [totalVolume, setTotalVolume] = useState("100");
  const [solutionTemperature, setSolutionTemperature] = useState("25");
  const safetyMargin = 3;
  const isPropylene = mixture === "Propilenoglicol";
  const maximum = isPropylene ? 60 : 100;
  const freezingTable = isPropylene ? propyleneFreezing : ethanolFreezing;
  const density25Table = isPropylene ? propyleneDensity25 : ethanolDensity25;
  const density0Table = isPropylene ? propyleneDensity0 : ethanolDensity0;
  const targetFreezing = n(operationTemperature) - safetyMargin;
  const requiredEffectiveConcentration = concentrationForFreezingPoint(freezingTable, targetFreezing);
  const requiredProductConcentration = mixture === "Álcool de cereais 96%"
    ? requiredEffectiveConcentration / .96
    : requiredEffectiveConcentration;
  const selectedConcentration = mode === "Informar temperatura de operação"
    ? requiredProductConcentration
    : n(concentration);
  const additivePercentage = Math.min(maximum, Math.max(0, selectedConcentration));
  const effectiveEthanol = mixture === "Álcool de cereais 96%" ? additivePercentage * .96 : additivePercentage;
  const propertyConcentration = isPropylene ? additivePercentage : effectiveEthanol;
  const freezing = interpolateByConcentration(freezingTable, propertyConcentration);
  const density25 = interpolateByConcentration(density25Table, propertyConcentration);
  const density0 = interpolateByConcentration(density0Table, propertyConcentration);
  const temperatureBeforeFreezing = Math.min(0, freezing + 1);
  const densitySlope = (density0 - density25) / 25;
  const densityBeforeFreezing = density0 + densitySlope * Math.abs(temperatureBeforeFreezing);
  const requestedTemperature = n(solutionTemperature);
  const densityAtRequestedTemperature = density0 - densitySlope * requestedTemperature;
  const volume = Math.max(0, n(totalVolume));
  const additiveLiters = volume * additivePercentage / 100;
  const waterLiters = volume - additiveLiters;
  const achievedMargin = n(operationTemperature) - freezing;
  const targetReachable = requiredProductConcentration <= maximum;
  const complete = totalVolume.trim() !== "" && solutionTemperature.trim() !== "" && volume > 0
    && (mode === "Informar proporção" ? concentration.trim() !== "" : operationTemperature.trim() !== "");

  function changeMixture(value: string) {
    const next = value as AntifreezeType;
    setMixture(next);
    if (next === "Propilenoglicol" && n(concentration) > 60) setConcentration("60");
  }

  return (
    <Calculator
      result={complete ? <>
        {mode === "Informar temperatura de operação" && <ResultLine label="Concentração necessária" value={fmt(additivePercentage, 1)} unit="% v/v" />}
        <ResultLine label={mixture} value={fmt(additiveLiters, 1)} unit="L" />
        <ResultLine label="Água" value={fmt(waterLiters, 1)} unit="L" />
        <ResultLine label="Ponto de congelamento" value={fmt(freezing, 1)} unit="°C" />
        {mode === "Informar temperatura de operação" && <ResultLine label="Margem de segurança adotada" value={fmt(safetyMargin, 1)} unit="°C" />}
        {mode === "Informar temperatura de operação" && <ResultLine label="Margem efetivamente obtida" value={fmt(achievedMargin, 1)} unit="°C" />}
        <ResultLine label={`Densidade a ${fmt(requestedTemperature, 1)} °C`} value={fmt(densityAtRequestedTemperature * 1000, 1)} unit="kg/m³" />
        <ResultLine label="Densidade a 25 °C" value={fmt(density25 * 1000, 1)} unit="kg/m³" />
        <ResultLine label="Densidade a 0 °C" value={fmt(density0 * 1000, 1)} unit="kg/m³" />
        <ResultLine label={`Densidade a ${fmt(temperatureBeforeFreezing, 1)} °C`} value={fmt(densityBeforeFreezing * 1000, 1)} unit="kg/m³" />
      </> : undefined}
      note={mode === "Informar temperatura de operação" && !targetReachable
        ? `A proteção solicitada ultrapassa o limite disponível de ${maximum}% v/v para este produto. O resultado foi limitado e a margem obtida ficou abaixo da adotada.`
        : isPropylene
          ? "Densidade estimada por interpolação térmica. Propilenoglicol limitado a 60% v/v; margem de segurança adotada: 3 °C."
          : "Densidade estimada por interpolação térmica. Misturas com etanol são inflamáveis; avalie ventilação, classificação da área e compatibilidade dos materiais."}
    >
      <h2>Proporção e proteção contra congelamento</h2>
      <p className="calc-intro">Calcule pelas proporções conhecidas ou informe a temperatura de operação para dimensionar a solução.</p>
      <div className="form-grid">
        <SelectField label="Modo de cálculo" value={mode} onChange={setMode} options={["Informar proporção","Informar temperatura de operação"]} />
        <SelectField label="Produto" value={mixture} onChange={changeMixture} options={["Propilenoglicol","Etanol","Álcool de cereais 96%"]} />
        {mode === "Informar proporção"
          ? <Field label="Concentração do produto" unit="% v/v" value={concentration} onChange={setConcentration} />
          : <Field label="Temperatura de operação desejada" unit="°C" value={operationTemperature} onChange={setOperationTemperature} />}
        <Field label="Volume final da solução" unit="L" value={totalVolume} onChange={setTotalVolume} />
        <Field label="Temperatura atual da solução" unit="°C" value={solutionTemperature} onChange={setSolutionTemperature} />
      </div>
      {mode === "Informar proporção" ? (
        <label className="pressure-ruler">
          <span>CONCENTRAÇÃO DO PRODUTO</span>
          <input type="range" min="0" max={maximum} step="1" value={additivePercentage} onChange={(event) => setConcentration(event.target.value)} />
          <div><small>0%</small><strong>{fmt(additivePercentage, 0)}%</strong><small>{maximum}%</small></div>
        </label>
      ) : (
        <div className={targetReachable ? "result-badge" : "result-badge warning"}>
          {targetReachable
            ? `Proteção dimensionada para ${fmt(targetFreezing, 1)} °C`
            : "Temperatura fora da faixa de proteção disponível"}
        </div>
      )}
      {mixture === "Álcool de cereais 96%" && <p className="calc-intro">Concentração efetiva de etanol na solução: {fmt(effectiveEthanol, 1)}% v/v.</p>}
    </Calculator>
  );
}

type BeerStyle = "Lager leve" | "Pilsen / Lager" | "Weiss" | "Pale Ale" | "IPA" | "Porter" | "Stout" | "Belgian Ale" | "Sour" | "Barleywine / Imperial";

const beerStyleResidualPlato: Record<BeerStyle, number> = {
  "Lager leve": 1.8,
  "Pilsen / Lager": 2.5,
  "Weiss": 3,
  "Pale Ale": 3.2,
  "IPA": 3.5,
  "Porter": 4,
  "Stout": 4.6,
  "Belgian Ale": 3,
  "Sour": 2,
  "Barleywine / Imperial": 6,
};

function gravityToPlato(gravity: number) {
  return -616.868 + 1111.14 * gravity - 630.272 * gravity ** 2 + 135.997 * gravity ** 3;
}

function BeerFreezingPoint() {
  const [mode, setMode] = useState("Estimativa rápida");
  const [style, setStyle] = useState<BeerStyle>("Pilsen / Lager");
  const [abv, setAbv] = useState("5");
  const [finalGravity, setFinalGravity] = useState("1.010");
  const alcoholByVolume = Math.max(0, n(abv));
  const gravity = Math.max(.98, n(finalGravity));
  const residualPlato = mode === "Estimativa técnica"
    ? Math.max(0, gravityToPlato(gravity))
    : beerStyleResidualPlato[style];
  const alcoholByWeight = alcoholByVolume * .789 / Math.max(gravity, .98);
  const estimatedFreezing = -(0.42 * alcoholByWeight + 0.04 * residualPlato);
  const uncertainty = mode === "Estimativa técnica" ? .3 : .6;
  const warmerLimit = estimatedFreezing + uncertainty;
  const colderLimit = estimatedFreezing - uncertainty;
  const operatingMargin = 1.5;
  const recommendedMinimum = estimatedFreezing + operatingMargin;
  const complete = abv.trim() !== "" && alcoholByVolume >= 0
    && (mode === "Estimativa rápida" || finalGravity.trim() !== "");

  return (
    <Calculator
      result={complete ? <>
        <div className="result-badge">{fmt(estimatedFreezing, 1)} °C</div>
        <ResultLine label="Início estimado do congelamento" value={fmt(estimatedFreezing, 1)} unit="°C" />
        <ResultLine label="Faixa provável" value={`${fmt(colderLimit, 1)} a ${fmt(warmerLimit, 1)}`} unit="°C" />
        <ResultLine label="Limite operacional recomendado" value={fmt(recommendedMinimum, 1)} unit="°C" />
        <ResultLine label="Margem operacional adotada" value={fmt(operatingMargin, 1)} unit="°C" />
        <ResultLine label="Álcool estimado em massa" value={fmt(alcoholByWeight, 2)} unit="% m/m" />
        <ResultLine label="Extrato residual considerado" value={fmt(residualPlato, 2)} unit="°P" />
      </> : undefined}
      note="Estimativa do início de formação de cristais, não do congelamento total. Açúcares, dextrinas, carbonatação e ingredientes especiais podem alterar o resultado; valide experimentalmente processos críticos."
    >
      <h2>Estimativa de congelamento da cerveja</h2>
      <p className="calc-intro">Use o estilo para uma estimativa rápida ou informe a densidade final para melhorar a precisão.</p>
      <div className="form-grid">
        <SelectField label="Modo de cálculo" value={mode} onChange={setMode} options={["Estimativa rápida","Estimativa técnica"]} />
        <SelectField label="Estilo da cerveja" value={style} onChange={(value) => setStyle(value as BeerStyle)} options={Object.keys(beerStyleResidualPlato)} />
        <Field label="Teor alcoólico" unit="% ABV" value={abv} onChange={setAbv} />
        {mode === "Estimativa técnica" && <Field label="Densidade final da cerveja" unit="SG" value={finalGravity} onChange={setFinalGravity} placeholder="1.010" />}
      </div>
      <div className="conditions">
        <span>Formação inicial de gelo</span>
        <span>Margem operacional: 1,5 °C</span>
        <span>{mode === "Estimativa técnica" ? "Cálculo com densidade final" : "Extrato típico pelo estilo"}</span>
      </div>
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
  const [screen, setScreen] = useState<"menu" | "strobe">("menu");
  if (screen === "menu") return <ChoiceGrid title="Ferramentas disponíveis" choices={[
    { icon: "◎", title: "Cálculo de orifício", text: "Dimensione o orifício da válvula.", action: () => openTool("orificio"), image: "/app-assets/VALVULA.png" },
    { icon: "✺", title: "Strobo", text: "Pulso visual ajustável por RPM.", action: () => setScreen("strobe") },
  ]} />;
  return <InnerScreen title="Strobo" onBack={() => setScreen("menu")}><Strobe /></InnerScreen>;
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
