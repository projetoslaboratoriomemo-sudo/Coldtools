"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "Início" | "Elétrica" | "Refrigeração" | "Vazão" | "Geometria";

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
  { id: "consumo-eletrico", title: "Consumo elétrico", description: "Energia e custo por hora, dia e mês.", category: "Elétrica", icon: "▤" },
  { id: "selecao-cabo", title: "Bitola de cabo", description: "Corrente admissível ou seção recomendada.", category: "Elétrica", icon: "⌁" },
  { id: "conversor", title: "Conversor de refrigeração", description: "kW, kcal/h, BTU/h e TR.", category: "Refrigeração", icon: "❄", accent: "amber" },
  { id: "saturacao", title: "Régua de saturação", description: "Pressão em psig × temperatura do refrigerante.", category: "Refrigeração", icon: "↔", accent: "amber" },
  { id: "diagnostico-termico", title: "Superaquecimento e sub-resfriamento", description: "Calcule superaquecimento útil, total e sub-resfriamento.", category: "Refrigeração", icon: "∆", accent: "amber" },
  { id: "ciclo-frigorifico", title: "Ciclo frigorífico e gráfico P-h", description: "Entalpias, capacidade, COP e diagrama completo do sistema.", category: "Refrigeração", icon: "ℎ", accent: "amber" },
  { id: "trocadores-calor", title: "Evaporadores e condensadores", description: "Volume interno, áreas de troca e estimativa de líquido e vapor.", category: "Refrigeração", icon: "▦", accent: "amber" },
  { id: "solucoes-anticongelantes", title: "Soluções anticongelantes", description: "Proporção, congelamento e densidade da solução.", category: "Refrigeração", icon: "◒", accent: "amber" },
  { id: "congelamento-cerveja", title: "Congelamento da cerveja", description: "Estime o início do congelamento por estilo, álcool e densidade.", category: "Refrigeração", icon: "◐", accent: "amber" },
  { id: "orvalho", title: "Ponto de orvalho", description: "Temperatura, umidade e condensação.", category: "Refrigeração", icon: "◌", accent: "amber" },
  { id: "carga-termica", title: "Carga térmica / vazão", description: "Relação Q = m · c · ΔT.", category: "Refrigeração", icon: "⌂", accent: "amber" },
  { id: "orificio", title: "Cálculo de orifício", description: "Seleção para válvula de expansão.", category: "Refrigeração", icon: "◎", accent: "amber" },
  { id: "selecao-vazao", title: "Cálculo de vazão", description: "Vazão de ar ou de líquido.", category: "Vazão", icon: "≋" },
  { id: "geometria-area", title: "Cálculo de área", description: "Área de círculos, retângulos, triângulos e outras formas.", category: "Geometria", icon: "▱" },
  { id: "geometria-perimetro", title: "Cálculo de perímetro", description: "Perímetro e circunferência de diversas formas.", category: "Geometria", icon: "⬡" },
  { id: "geometria-volume", title: "Cálculo de volume", description: "Volume de sólidos geométricos e recipientes.", category: "Geometria", icon: "▣" },
];

const nav: { label: Category; icon: string }[] = [
  { label: "Início", icon: "⌂" },
  { label: "Elétrica", icon: "ϟ" },
  { label: "Refrigeração", icon: "❄" },
  { label: "Vazão", icon: "◉" },
  { label: "Geometria", icon: "◇" },
];

function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const snowflakes = [
    [82,118,1.1],[154,214,.8],[696,126,1],[635,242,.7],[92,498,.8],[716,530,1.1],
    [210,92,.65],[588,78,.75],[194,604,.9],[620,626,.7],[62,316,.6],[744,352,.7],
  ];

  return (
    <main className="intro-screen cold-beer-electric">
      <div className="cold-vignette" />
      <svg className="beer-machine" viewBox="0 0 800 760" aria-label="Chope sendo servido com gelo, refrigeração e energia elétrica">
        <defs>
          <linearGradient id="beerGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd766" />
            <stop offset=".48" stopColor="#e9a329" />
            <stop offset="1" stopColor="#aa5a0d" />
          </linearGradient>
          <linearGradient id="iceBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e6fbff" />
            <stop offset=".5" stopColor="#70d9ff" />
            <stop offset="1" stopColor="#278bc4" />
          </linearGradient>
          <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#65757a" />
            <stop offset=".45" stopColor="#eef8f5" />
            <stop offset="1" stopColor="#56666b" />
          </linearGradient>
          <filter id="coldGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="mugClip">
            <path d="M278 326 H504 V650 Q504 688 466 692 H316 Q278 688 278 650 Z" />
          </clipPath>
        </defs>

        <g className="snow-field">
          {snowflakes.map(([x,y,scale], index) => (
            <g key={index} transform={`translate(${x} ${y}) scale(${scale})`} style={{ animationDelay: `-${index * .37}s` }}>
              <path d="M0 -14 V14 M-12 -7 L12 7 M-12 7 L12 -7" />
            </g>
          ))}
        </g>

        <g className="electric-feed electric-left" filter="url(#coldGlow)">
          <path className="power-cable" d="M18 380 H140 C174 380 175 300 220 300 H275" />
          <path className="electric-arc" d="M24 354 L64 384 L100 344 L139 382 L177 337 L218 373 L270 316" />
          <circle cx="20" cy="380" r="12" />
        </g>
        <g className="electric-feed electric-right" filter="url(#coldGlow)">
          <path className="power-cable" d="M782 380 H660 C626 380 625 300 580 300 H525" />
          <path className="electric-arc" d="M776 354 L736 384 L700 344 L661 382 L623 337 L582 373 L530 316" />
          <circle cx="780" cy="380" r="12" />
        </g>

        <g className="cooling-coil" filter="url(#coldGlow)">
          <path d="M244 302 C214 330 214 366 244 394 C274 422 274 458 244 486 C214 514 214 550 254 578" />
          <path d="M556 302 C586 330 586 366 556 394 C526 422 526 458 556 486 C586 514 586 550 546 578" />
          <circle cx="244" cy="302" r="8" />
          <circle cx="556" cy="302" r="8" />
        </g>

        <g className="draft-tower">
          <path className="tower-body" d="M330 44 H470 V220 H430 V98 H370 V260 H330 Z" />
          <rect className="tower-cap" x="315" y="32" width="170" height="40" rx="16" />
          <path className="tap-body" d="M370 134 H548 V184 H478 V216 H430 V174 H370 Z" />
          <rect className="tap-handle" x="494" y="72" width="34" height="94" rx="15" />
          <circle className="tap-badge" cx="511" cy="86" r="29" />
          <path className="tap-spout" d="M444 182 H494 V230 Q494 252 472 252 H446" />
        </g>

        <g className="beer-stream">
          <path d="M467 249 C466 281 468 312 465 358" />
          <circle cx="467" cy="274" r="5" />
          <circle cx="467" cy="310" r="4" />
        </g>

        <g className="beer-mug">
          <path className="mug-handle" d="M500 390 H552 Q586 390 586 425 V548 Q586 585 548 585 H502 V535 H536 V440 H502" />
          <path className="glass-body mug-body" d="M278 326 H504 V650 Q504 688 466 692 H316 Q278 688 278 650 Z" />
          <g clipPath="url(#mugClip)">
            <rect className="beer-fill-large" x="276" y="354" width="232" height="340" fill="url(#beerGold)" />
            <path className="beer-wave" d="M260 396 Q315 372 370 396 T480 396 T590 396 V440 H260 Z" />
            <g className="beer-bubbles-large">
              {[314,344,376,410,444,478].map((x,index) => <circle key={x} cx={x} cy={620-index*34} r={index%2 ? 5 : 8} style={{ animationDelay: `${index * .28}s` }} />)}
            </g>
          </g>
          <g className="mug-ribs">
            <path d="M308 344 V650" /><path d="M350 344 V668" /><path d="M450 344 V668" /><path d="M492 344 V650" />
          </g>
          <g className="foam-head">
            <circle cx="300" cy="368" r="29" />
            <circle cx="340" cy="354" r="37" />
            <circle cx="388" cy="358" r="43" />
            <circle cx="438" cy="352" r="36" />
            <circle cx="484" cy="369" r="30" />
            <path d="M284 374 H500 V414 H284 Z" />
          </g>
          <path className="glass-shine" d="M302 350 L318 620" />
          <path className="mug-base" d="M294 650 H488 Q484 684 456 686 H326 Q298 682 294 650 Z" />
          <g className="laser-engraving" filter="url(#coldGlow)">
            <text className="laser-rf-letters" y="545">
              <tspan className="laser-letter rf-letter" x="342" style={{ animationDelay: "4.7s" }}>R</tspan>
              <tspan className="laser-letter rf-letter" x="408" style={{ animationDelay: "5.35s" }}>F</tspan>
            </text>
            <g className="laser-scanner">
              <line x1="306" y1="0" x2="494" y2="0" />
              <circle cx="400" cy="0" r="6" />
              <circle className="laser-spark spark-one" cx="382" cy="-3" r="3" />
              <circle className="laser-spark spark-two" cx="418" cy="4" r="2.5" />
              <circle className="laser-spark spark-three" cx="399" cy="-9" r="2" />
            </g>
          </g>
        </g>

        <g className="frost-layer">
          <path d="M290 596 C314 573 332 607 351 584 C370 561 389 608 410 585 C431 562 453 604 475 580 C491 564 510 590 493 651 C486 688 462 711 421 714 H366 C326 708 301 681 297 648 Z" />
          <path d="M305 610 l-34 18 35 8 -23 29 43 -5" />
          <path d="M490 608 l38 17 -34 10 24 27 -40 -3" />
        </g>

        <g className="cold-fog">
          <ellipse cx="400" cy="698" rx="270" ry="34" />
          <ellipse cx="400" cy="690" rx="190" ry="24" />
        </g>

        <g className="big-bolts" filter="url(#coldGlow)">
          <path d="M144 120 L94 224 H135 L88 326 L188 202 H148 L198 120 Z" />
          <path d="M656 120 L706 224 H665 L712 326 L612 202 H652 L602 120 Z" />
        </g>
      </svg>

      <div className="beer-intro-copy">
        <span>FRIO • CERVEJA • ENERGIA</span>
        <h1>Coldtools</h1>
        <p>Idealizado por <strong>Rafael Fabiani</strong></p>
        <button onClick={onEnter}><b>Entrar nas ferramentas</b><i>→</i></button>
      </div>
    </main>
  );
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
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

  if (showIntro) return <IntroScreen onEnter={() => setShowIntro(false)} />;

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
}: {
  tool: Tool;
  onBack: () => void;
}) {
  const content: Record<string, React.ReactNode> = {
    potencia: <PowerCalculator />,
    capacitor: <CapacitorCalculator />,
    "consumo-eletrico": <ElectricalConsumption />,
    "selecao-cabo": <CableHub />,
    conversor: <RefrigerationConverter />,
    saturacao: <SaturationRuler />,
    "diagnostico-termico": <ThermalDiagnostics />,
    "ciclo-frigorifico": <RefrigerationCycle />,
    "trocadores-calor": <FinnedCoilCalculator />,
    "solucoes-anticongelantes": <AntifreezeMixture />,
    "congelamento-cerveja": <BeerFreezingPoint />,
    orvalho: <DewPoint />,
    "carga-termica": <ThermalLoad />,
    orificio: <OrificeCalculator />,
    "selecao-vazao": <FlowHub />,
    "geometria-area": <GeometryCalculator mode="area" />,
    "geometria-perimetro": <GeometryCalculator mode="perimeter" />,
    "geometria-volume": <GeometryCalculator mode="volume" />,
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
  allowNegative = false,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowNegative?: boolean;
}) {
  function toggleSign() {
    if (value.startsWith("-")) onChange(value.slice(1));
    else onChange(value ? `-${value}` : "-");
  }

  return (
    <label className="field">
      <span>{label}</span>
      <div>
        {allowNegative && <button type="button" className={value.startsWith("-") ? "sign-toggle negative" : "sign-toggle"} onClick={toggleSign} aria-label={value.startsWith("-") ? "Remover sinal negativo" : "Adicionar sinal negativo"}>{value.startsWith("-") ? "−" : "±"}</button>}
        <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        {unit && <b>{unit}</b>}
      </div>
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

function ElectricalConsumption() {
  const [power, setPower] = useState("1000");
  const [powerUnit, setPowerUnit] = useState("W");
  const [cycleMode, setCycleMode] = useState("Percentual de funcionamento");
  const [dutyPercent, setDutyPercent] = useState("50");
  const [onMinutes, setOnMinutes] = useState("10");
  const [offMinutes, setOffMinutes] = useState("10");
  const [hoursPerDay, setHoursPerDay] = useState("24");
  const [daysPerMonth, setDaysPerMonth] = useState("30");
  const [tariff, setTariff] = useState("1");
  const nominalKw = powerUnit === "kW" ? n(power) : n(power) / 1000;
  const cycleMinutes = Math.max(0, n(onMinutes)) + Math.max(0, n(offMinutes));
  const calculatedDuty = cycleMode === "Percentual de funcionamento"
    ? Math.min(100, Math.max(0, n(dutyPercent))) / 100
    : cycleMinutes > 0 ? Math.max(0, n(onMinutes)) / cycleMinutes : 0;
  const averageKw = nominalKw * calculatedDuty;
  const dailyHours = Math.min(24, Math.max(0, n(hoursPerDay)));
  const monthlyDays = Math.min(31, Math.max(0, n(daysPerMonth)));
  const energyPerHour = averageKw;
  const dailyEnergy = averageKw * dailyHours;
  const monthlyEnergy = dailyEnergy * monthlyDays;
  const rate = Math.max(0, n(tariff));
  const costPerHour = energyPerHour * rate;
  const dailyCost = dailyEnergy * rate;
  const monthlyCost = monthlyEnergy * rate;
  const equivalentHoursDay = dailyHours * calculatedDuty;
  const complete = power.trim() !== "" && nominalKw >= 0 && hoursPerDay.trim() !== ""
    && daysPerMonth.trim() !== "" && tariff.trim() !== ""
    && (cycleMode === "Percentual de funcionamento"
      ? dutyPercent.trim() !== ""
      : onMinutes.trim() !== "" && offMinutes.trim() !== "" && cycleMinutes > 0);

  return (
    <Calculator
      result={complete ? <>
        <div className="result-badge">R$ {fmt(monthlyCost, 2)} / mês</div>
        <ResultLine label="Potência média" value={fmt(averageKw, 3)} unit="kW" />
        <ResultLine label="Consumo por hora" value={fmt(energyPerHour, 3)} unit="kWh" />
        <ResultLine label="Consumo diário" value={fmt(dailyEnergy, 2)} unit="kWh" />
        <ResultLine label="Consumo mensal" value={fmt(monthlyEnergy, 2)} unit="kWh" />
        <ResultLine label="Custo por hora" value={`R$ ${fmt(costPerHour, 2)}`} />
        <ResultLine label="Custo diário" value={`R$ ${fmt(dailyCost, 2)}`} />
        <ResultLine label="Custo mensal" value={`R$ ${fmt(monthlyCost, 2)}`} />
        <ResultLine label="Tempo equivalente ligado/dia" value={fmt(equivalentHoursDay, 2)} unit="h" />
      </> : undefined}
      note="Estimativa baseada na potência nominal e no ciclo de funcionamento. Equipamentos inverter ou com potência variável podem apresentar consumo diferente; para maior precisão, compare com um medidor de energia."
    >
      <h2>Consumo e custo de energia</h2>
      <p className="calc-intro">Informe a potência, o comportamento ligado/desligado e o valor médio da energia.</p>
      <div className="form-grid">
        <Field label="Potência nominal" value={power} onChange={setPower} />
        <SelectField label="Unidade da potência" value={powerUnit} onChange={setPowerUnit} options={["W", "kW"]} />
        <SelectField label="Modo do ciclo" value={cycleMode} onChange={setCycleMode} options={["Percentual de funcionamento", "Tempo ligado/desligado"]} />
        {cycleMode === "Percentual de funcionamento" ? (
          <Field label="Tempo ligado no período" unit="%" value={dutyPercent} onChange={setDutyPercent} />
        ) : <>
          <Field label="Tempo ligado no ciclo" unit="min" value={onMinutes} onChange={setOnMinutes} />
          <Field label="Tempo desligado no ciclo" unit="min" value={offMinutes} onChange={setOffMinutes} />
        </>}
        <Field label="Horas disponíveis por dia" unit="h/dia" value={hoursPerDay} onChange={setHoursPerDay} />
        <Field label="Dias de operação no mês" unit="dias" value={daysPerMonth} onChange={setDaysPerMonth} />
        <Field label="Tarifa média de energia" unit="R$/kWh" value={tariff} onChange={setTariff} />
      </div>
      <div className="conditions">
        <span>Ciclo ligado: {fmt(calculatedDuty * 100, 1)}%</span>
        <span>Potência nominal: {fmt(nominalKw, 3)} kW</span>
        <span>{fmt(equivalentHoursDay, 2)} h ligadas por dia</span>
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
        <Field label="Pressão de baixa" unit="psig" value={values.lowPressure} onChange={change("lowPressure")} allowNegative />
        <Field label="Pressão de alta" unit="psig" value={values.highPressure} onChange={change("highPressure")} allowNegative />
        <Field label="Saída do evaporador" unit="°C" value={values.evaporatorOutlet} onChange={change("evaporatorOutlet")} allowNegative />
        <Field label="Temperatura de sucção" unit="°C" value={values.suction} onChange={change("suction")} allowNegative />
        <Field label="Saída do condensador" unit="°C" value={values.condenserOutlet} onChange={change("condenserOutlet")} allowNegative />
      </div>
      <button className="secondary" onClick={() => setValues({ lowPressure: "", highPressure: "", evaporatorOutlet: "", suction: "", condenserOutlet: "" })}>Limpar medições</button>
    </Calculator>
  );
}

type CyclePoint = {
  id: string;
  label: string;
  pressureBar: number;
  enthalpy: number;
  temperature: number;
};

type CycleResponse = {
  fluid: Refrigerant;
  pressures: {
    lowPsig: number;
    highPsig: number;
    lowBarAbsolute: number;
    highBarAbsolute: number;
    ratio: number;
  };
  temperatures: {
    evaporatingDew: number;
    evaporatingBubble: number;
    condensingDew: number;
    condensingBubble: number;
    suction: number;
    discharge: number;
    liquidLine: number;
  };
  points: CyclePoint[];
  idealDischarge: { enthalpy: number; temperature: number };
  properties: {
    qualityAtEvaporatorInlet: number | null;
    specificVolume: number;
    suctionDensity: number;
    suctionEntropy: number;
    refrigerationEffect: number;
    compressorWorkIdeal: number;
    compressorWork: number;
    condenserHeat: number;
    cop: number;
    copIdeal: number;
    eer: number;
  };
  compressor: {
    hasEstimate: boolean;
    rpm: number;
    displacement: number;
    volumetricEfficiency: number;
    isentropicEfficiency: number;
    theoreticalFlowM3H: number;
    suctionFlowM3H: number;
    massFlowKgH: number | null;
    evaporatorCapacityKw: number | null;
    compressorPowerKw: number | null;
    condenserCapacityKw: number | null;
  };
  dome: Array<{ liquidH: number; vaporH: number; pressureBar: number }>;
};

function RefrigerationCycle() {
  const [fluid, setFluid] = useState<Refrigerant>("R134a");
  const [rotationMode, setRotationMode] = useState("Frequência e polos");
  const [values, setValues] = useState<Values>({
    lowPressure: "27,8",
    highPressure: "153,5",
    superheat: "7,4",
    subcooling: "6,2",
    displacement: "11,14",
    frequency: "60",
    poles: "2",
    rpm: "3600",
    volumetricEfficiency: "70",
    isentropicEfficiency: "65",
  });
  const [cycle, setCycle] = useState<CycleResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const change = (key: string) => (value: string) =>
    setValues((old) => ({ ...old, [key]: value }));
  const calculatedRpm = rotationMode === "RPM manual"
    ? n(values.rpm)
    : (120 * n(values.frequency)) / Math.max(1, n(values.poles));

  useEffect(() => {
    const required = [
      values.lowPressure,
      values.highPressure,
      values.superheat,
      values.subcooling,
    ];
    if (!required.every((value) => value.trim() !== "" && Number.isFinite(n(value)))) {
      setCycle(null);
      setStatus("error");
      setError("Preencha os quatro dados de operação para calcular o ciclo.");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch("/api/cycle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            fluid,
            lowPressure: n(values.lowPressure),
            highPressure: n(values.highPressure),
            superheat: n(values.superheat),
            subcooling: n(values.subcooling),
            displacement: n(values.displacement),
            rpm: calculatedRpm,
            volumetricEfficiency: n(values.volumetricEfficiency),
            isentropicEfficiency: n(values.isentropicEfficiency),
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Não foi possível calcular este ciclo.");
        setCycle(data);
        setStatus("ready");
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setCycle(null);
        setStatus("error");
        setError(requestError instanceof Error ? requestError.message : "Falha no cálculo.");
      }
    }, 420);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [calculatedRpm, fluid, values]);

  const result = status === "loading" ? (
    <div className="result-badge warning">Calculando propriedades…</div>
  ) : status === "error" ? (
    <div className="cycle-error">{error}</div>
  ) : cycle ? (
    <>
      <div className="result-badge">
        {cycle.compressor.hasEstimate
          ? `${fmt(cycle.compressor.evaporatorCapacityKw ?? 0, 3)} kW no evaporador`
          : `${fmt(cycle.properties.refrigerationEffect, 2)} kJ/kg`}
      </div>
      <ResultLine label="Efeito frigorífico" value={fmt(cycle.properties.refrigerationEffect, 2)} unit="kJ/kg" />
      <ResultLine label="Trabalho do compressor" value={fmt(cycle.properties.compressorWork, 2)} unit="kJ/kg" />
      <ResultLine label="Calor no condensador" value={fmt(cycle.properties.condenserHeat, 2)} unit="kJ/kg" />
      <ResultLine label="COP ideal" value={fmt(cycle.properties.copIdeal, 3)} />
      <ResultLine label="COP estimado" value={fmt(cycle.properties.cop, 3)} />
      <ResultLine label="EER estimado" value={fmt(cycle.properties.eer, 2)} unit="BTU/Wh" />
      {cycle.compressor.hasEstimate && <>
        <ResultLine label="Vazão de refrigerante" value={fmt(cycle.compressor.massFlowKgH ?? 0, 2)} unit="kg/h" />
        <ResultLine label="Capacidade do evaporador" value={fmt(cycle.compressor.evaporatorCapacityKw ?? 0, 3)} unit="kW" />
        <ResultLine label="Capacidade em kcal/h" value={fmt((cycle.compressor.evaporatorCapacityKw ?? 0) * 859.845)} unit="kcal/h" />
        <ResultLine label="Capacidade em BTU/h" value={fmt((cycle.compressor.evaporatorCapacityKw ?? 0) * 3412.142)} unit="BTU/h" />
        <ResultLine label="Capacidade em TR" value={fmt((cycle.compressor.evaporatorCapacityKw ?? 0) / 3.516853, 3)} unit="TR" />
        <ResultLine label="Potência do compressor" value={fmt(cycle.compressor.compressorPowerKw ?? 0, 3)} unit="kW" />
        <ResultLine label="Capacidade do condensador" value={fmt(cycle.compressor.condenserCapacityKw ?? 0, 3)} unit="kW" />
      </>}
    </>
  ) : undefined;

  return (
    <>
      <Calculator
        result={result}
        note="As propriedades são calculadas por equações de estado do CoolProp. A capacidade baseada no deslocamento é uma estimativa; mapas do fabricante continuam sendo a referência para seleção final."
      >
        <h2>Ciclo de compressão de vapor</h2>
        <p className="calc-intro">Informe as condições medidas. O deslocamento é opcional: sem ele, o sistema calcula normalmente todas as propriedades por kg de refrigerante.</p>

        <h3>1. Condições de operação</h3>
        <div className="form-grid">
          <SelectField label="Fluido refrigerante" value={fluid} onChange={(value) => setFluid(value as Refrigerant)} options={Object.keys(refrigerantPressureTable)} />
          <Field label="Pressão de baixa" unit="psig" value={values.lowPressure} onChange={change("lowPressure")} allowNegative />
          <Field label="Pressão de alta" unit="psig" value={values.highPressure} onChange={change("highPressure")} allowNegative />
          <Field label="Superaquecimento total" unit="K" value={values.superheat} onChange={change("superheat")} />
          <Field label="Sub-resfriamento" unit="K" value={values.subcooling} onChange={change("subcooling")} />
        </div>

        <h3>2. Compressor</h3>
        <p className="calc-intro">Se você não tiver as eficiências, mantenha os valores sugeridos e interprete a capacidade como estimativa.</p>
        <div className="form-grid">
          <Field label="Deslocamento do compressor" unit="cm³/rev" value={values.displacement} onChange={change("displacement")} />
          <SelectField label="Definir rotação por" value={rotationMode} onChange={setRotationMode} options={["Frequência e polos", "RPM manual"]} />
          {rotationMode === "Frequência e polos" ? <>
            <SelectField label="Frequência" value={values.frequency} onChange={change("frequency")} options={["50", "60"]} />
            <SelectField label="Número de polos" value={values.poles} onChange={change("poles")} options={["2", "4", "6"]} />
          </> : (
            <Field label="Rotação informada" unit="RPM" value={values.rpm} onChange={change("rpm")} />
          )}
          <Field label="Eficiência volumétrica estimada" unit="%" value={values.volumetricEfficiency} onChange={change("volumetricEfficiency")} />
          <Field label="Eficiência isentrópica estimada" unit="%" value={values.isentropicEfficiency} onChange={change("isentropicEfficiency")} />
        </div>
        <div className="conditions">
          <span>Rotação usada: {fmt(calculatedRpm, 0)} RPM</span>
          <span>Pressões informadas em psig</span>
          <span>Entalpias em kJ/kg</span>
        </div>
      </Calculator>

      {cycle && status === "ready" && (
        <section className="cycle-report">
          <div className="cycle-report-head">
            <div>
              <span>DIAGRAMA TERMODINÂMICO</span>
              <h2>Gráfico pressão × entalpia</h2>
              <p>O traçado mostra o ciclo calculado e a região de saturação do {cycle.fluid}.</p>
            </div>
            <div className="cycle-kpis">
              <span><small>Evaporação</small><strong>{fmt(cycle.temperatures.evaporatingDew, 1)} °C</strong></span>
              <span><small>Condensação</small><strong>{fmt(cycle.temperatures.condensingBubble, 1)} °C</strong></span>
              <span><small>Relação de compressão</small><strong>{fmt(cycle.pressures.ratio, 2)}:1</strong></span>
            </div>
          </div>

          <div className="cycle-visual-grid">
            <PhChart cycle={cycle} />
            <div className="cycle-side">
              <h3>Leitura dos pontos</h3>
              <div className="cycle-point-list">
                {cycle.points.map((point) => (
                  <div key={point.id}>
                    <b>{point.id}</b>
                    <span><strong>{point.label}</strong><small>{fmt(point.temperature, 1)} °C · {fmt(point.pressureBar, 2)} bar(a)</small></span>
                    <em>h{point.id} = {fmt(point.enthalpy, 2)} kJ/kg</em>
                  </div>
                ))}
              </div>
              <ResultLine label="Descarga isentrópica h2s" value={fmt(cycle.idealDischarge.enthalpy, 2)} unit="kJ/kg" />
              <ResultLine label="Título na entrada do evaporador" value={cycle.properties.qualityAtEvaporatorInlet === null ? "Fora da região bifásica" : fmt(cycle.properties.qualityAtEvaporatorInlet * 100, 1)} unit={cycle.properties.qualityAtEvaporatorInlet === null ? undefined : "% vapor"} />
              <ResultLine label="Volume específico na sucção" value={fmt(cycle.properties.specificVolume, 5)} unit="m³/kg" />
              <ResultLine label="Densidade na sucção" value={fmt(cycle.properties.suctionDensity, 3)} unit="kg/m³" />
            </div>
          </div>

          <div className="cycle-balance">
            <span><small>Evaporador</small><strong>{fmt(cycle.properties.refrigerationEffect, 2)} kJ/kg</strong><i>h1 − h4</i></span>
            <span><small>Compressor</small><strong>{fmt(cycle.properties.compressorWork, 2)} kJ/kg</strong><i>h2 − h1</i></span>
            <span><small>Condensador</small><strong>{fmt(cycle.properties.condenserHeat, 2)} kJ/kg</strong><i>h2 − h3</i></span>
          </div>
        </section>
      )}
    </>
  );
}

function PhChart({ cycle }: { cycle: CycleResponse }) {
  const width = 820;
  const height = 500;
  const margin = { left: 76, right: 32, top: 30, bottom: 62 };
  const enthalpies = [
    ...cycle.dome.flatMap((point) => [point.liquidH, point.vaporH]),
    ...cycle.points.map((point) => point.enthalpy),
  ];
  const pressures = [
    ...cycle.dome.map((point) => point.pressureBar),
    ...cycle.points.map((point) => point.pressureBar),
  ].filter((value) => value > 0);
  const rawMinH = Math.min(...enthalpies);
  const rawMaxH = Math.max(...enthalpies);
  const hPadding = Math.max(18, (rawMaxH - rawMinH) * .08);
  const minH = rawMinH - hPadding;
  const maxH = rawMaxH + hPadding;
  const minLogP = Math.log10(Math.min(...pressures) * .82);
  const maxLogP = Math.log10(Math.max(...pressures) * 1.18);
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (enthalpy: number) => margin.left + (enthalpy - minH) / (maxH - minH) * plotWidth;
  const y = (pressure: number) => margin.top + (maxLogP - Math.log10(pressure)) / (maxLogP - minLogP) * plotHeight;
  const path = (points: Array<{ h: number; p: number }>) =>
    points.map((point, index) => `${index ? "L" : "M"} ${x(point.h).toFixed(1)} ${y(point.p).toFixed(1)}`).join(" ");
  const liquidCurve = cycle.dome.map((point) => ({ h: point.liquidH, p: point.pressureBar }));
  const vaporCurve = cycle.dome.map((point) => ({ h: point.vaporH, p: point.pressureBar }));
  const domeFill = `${path(liquidCurve)} ${path([...vaporCurve].reverse()).replace(/^M/, "L")} Z`;
  const cyclePath = path([...cycle.points.map((point) => ({ h: point.enthalpy, p: point.pressureBar })), { h: cycle.points[0].enthalpy, p: cycle.points[0].pressureBar }]);
  const xTicks = Array.from({ length: 6 }, (_, index) => minH + (maxH - minH) * index / 5);
  const pressureTicks = [.2, .5, 1, 2, 5, 10, 20, 50, 100].filter((pressure) =>
    Math.log10(pressure) >= minLogP && Math.log10(pressure) <= maxLogP
  );
  const labelOffsets: Record<string, { x: number; y: number; anchor: "start" | "end" }> = {
    "1": { x: 12, y: -13, anchor: "start" },
    "2": { x: 12, y: 24, anchor: "start" },
    "3": { x: -12, y: -13, anchor: "end" },
    "4": { x: -12, y: 25, anchor: "end" },
  };

  return (
    <div className="ph-chart-wrap">
      <svg className="ph-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Gráfico P-h do ciclo com ${cycle.fluid}`}>
        <defs>
          <linearGradient id="domeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#70d9ff" stopOpacity=".22" />
            <stop offset="1" stopColor="#70d9ff" stopOpacity=".035" />
          </linearGradient>
          <filter id="cycleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} className="ph-plot-bg" />
        {xTicks.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={margin.top} y2={height - margin.bottom} className="ph-grid" />
            <text x={x(tick)} y={height - margin.bottom + 25} textAnchor="middle" className="ph-axis-text">{fmt(tick, 0)}</text>
          </g>
        ))}
        {pressureTicks.map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} className="ph-grid" />
            <text x={margin.left - 12} y={y(tick) + 4} textAnchor="end" className="ph-axis-text">{fmt(tick, 1)}</text>
          </g>
        ))}

        <path d={domeFill} fill="url(#domeFill)" />
        <path d={path(liquidCurve)} className="ph-dome-line" />
        <path d={path(vaporCurve)} className="ph-dome-line" />
        <text x={x((Math.min(...enthalpies) + Math.max(...enthalpies)) / 2)} y={margin.top + 34} textAnchor="middle" className="ph-dome-label">REGIÃO DE SATURAÇÃO</text>

        <path d={cyclePath} className="ph-cycle-line" filter="url(#cycleGlow)" />
        {cycle.points.map((point) => {
          const offset = labelOffsets[point.id];
          return (
            <g key={point.id} className="ph-point">
              <circle cx={x(point.enthalpy)} cy={y(point.pressureBar)} r="8" />
              <text x={x(point.enthalpy)} y={y(point.pressureBar) + 4} textAnchor="middle">{point.id}</text>
              <text x={x(point.enthalpy) + offset.x} y={y(point.pressureBar) + offset.y} textAnchor={offset.anchor} className="ph-point-label">
                h{point.id} = {fmt(point.enthalpy, 1)}
              </text>
            </g>
          );
        })}

        <text x={margin.left + plotWidth / 2} y={height - 13} textAnchor="middle" className="ph-axis-title">Entalpia específica (kJ/kg)</text>
        <text transform={`translate(18 ${margin.top + plotHeight / 2}) rotate(-90)`} textAnchor="middle" className="ph-axis-title">Pressão absoluta (bar)</text>
      </svg>
      <div className="ph-legend">
        <span><i className="dome" /> Curva de saturação</span>
        <span><i className="cycle" /> Ciclo calculado</span>
      </div>
    </div>
  );
}

function FinnedCoilCalculator() {
  const [equipment, setEquipment] = useState("Evaporador");
  const [fluid, setFluid] = useState<Refrigerant>("R134a");
  const [geometry, setGeometry] = useState<Values>({
    outerDiameter: "9,52",
    wallThickness: "0,8",
    tubeLength: "",
    circuits: "1",
    finWidth: "",
    finHeight: "",
    finThickness: "0,12",
    finCount: "",
    holesPerFin: "",
  });
  const [operation, setOperation] = useState<Values>({
    pressure: "",
    superheat: "5",
    subcooling: "5",
    voidFraction: "80",
  });

  const changeGeometry = (key: string) => (value: string) =>
    setGeometry((old) => ({ ...old, [key]: value }));
  const changeOperation = (key: string) => (value: string) =>
    setOperation((old) => ({ ...old, [key]: value }));

  function changeEquipment(value: string) {
    setEquipment(value);
    setOperation((old) => ({
      ...old,
      voidFraction: value === "Evaporador" ? "80" : "55",
    }));
  }

  const outerDiameter = n(geometry.outerDiameter);
  const wallThickness = n(geometry.wallThickness);
  const innerDiameter = outerDiameter - 2 * wallThickness;
  const tubeLength = n(geometry.tubeLength);
  const circuits = Math.max(1, n(geometry.circuits));
  const finWidth = n(geometry.finWidth);
  const finHeight = n(geometry.finHeight);
  const finThickness = n(geometry.finThickness);
  const finCount = n(geometry.finCount);
  const holesPerFin = n(geometry.holesPerFin);
  const geometryComplete = [
    outerDiameter,
    wallThickness,
    tubeLength,
    circuits,
    finWidth,
    finHeight,
    finThickness,
    finCount,
    holesPerFin,
  ].every((value) => value > 0) && innerDiameter > 0;

  const outerDiameterM = outerDiameter / 1000;
  const innerDiameterM = innerDiameter / 1000;
  const internalVolumeLiters = Math.PI * innerDiameterM ** 2 / 4 * tubeLength * 1000;
  const coveredTubeLength = Math.min(tubeLength, finCount * holesPerFin * finThickness / 1000);
  const primaryArea = Math.PI * outerDiameterM * Math.max(0, tubeLength - coveredTubeLength);
  const grossFinFaceArea = finWidth / 1000 * (finHeight / 1000);
  const holesAreaPerFin = holesPerFin * Math.PI * outerDiameterM ** 2 / 4;
  const netFinFaceArea = Math.max(0, grossFinFaceArea - holesAreaPerFin);
  const secondaryArea = 2 * finCount * netFinFaceArea;
  const totalArea = primaryArea + secondaryArea;
  const areaRatio = primaryArea > 0 ? secondaryArea / primaryArea : 0;

  const vaporTable = refrigerantPressureTable[fluid] as ReadonlyArray<PressurePoint>;
  const liquidTable = (fluid === "R410A" || fluid === "R404A"
    ? refrigerantLiquidPressureTable[fluid]
    : vaporTable) as ReadonlyArray<PressurePoint>;
  const saturationTable = equipment === "Evaporador" ? vaporTable : liquidTable;
  const pressure = n(operation.pressure);
  const minimumPressure = saturationTable[0][1];
  const maximumPressure = saturationTable[saturationTable.length - 1][1];
  const pressureInRange = Math.min(maximumPressure, Math.max(minimumPressure, pressure));
  const saturationTemperature = interpolateSaturationTemperature(saturationTable, pressureInRange);
  const superheat = Math.max(0, n(operation.superheat));
  const subcooling = Math.max(0, n(operation.subcooling));
  const voidFraction = Math.min(.95, Math.max(.05, n(operation.voidFraction) / 100));
  const operationComplete = operation.pressure.trim() !== "" && Number.isFinite(pressure);

  const superheatedShare = equipment === "Evaporador"
    ? Math.min(.35, Math.max(.08, .08 + superheat / 100))
    : Math.min(.25, Math.max(.08, .08 + superheat / 200));
  const subcooledShare = equipment === "Condensador"
    ? Math.min(.30, Math.max(.05, .05 + subcooling / 100))
    : 0;
  const twoPhaseShare = Math.max(.20, 1 - superheatedShare - subcooledShare);

  function phaseVolumes(estimatedVoid: number) {
    const vapor = internalVolumeLiters * (
      superheatedShare + twoPhaseShare * estimatedVoid
    );
    return {
      vapor,
      liquid: Math.max(0, internalVolumeLiters - vapor),
    };
  }

  const centralPhase = phaseVolumes(voidFraction);
  const lowerVoidPhase = phaseVolumes(Math.max(.05, voidFraction - .10));
  const upperVoidPhase = phaseVolumes(Math.min(.95, voidFraction + .10));
  const liquidMinimum = Math.min(lowerVoidPhase.liquid, upperVoidPhase.liquid);
  const liquidMaximum = Math.max(lowerVoidPhase.liquid, upperVoidPhase.liquid);
  const vaporMinimum = Math.min(lowerVoidPhase.vapor, upperVoidPhase.vapor);
  const vaporMaximum = Math.max(lowerVoidPhase.vapor, upperVoidPhase.vapor);
  const outletTemperature = equipment === "Evaporador"
    ? saturationTemperature + superheat
    : saturationTemperature - subcooling;

  const result = geometryComplete ? (
    <>
      <div className="result-badge">{fmt(internalVolumeLiters, 3)} L internos</div>
      <ResultLine label="Diâmetro interno calculado" value={fmt(innerDiameter, 2)} unit="mm" />
      <ResultLine label="Volume interno total" value={fmt(internalVolumeLiters, 3)} unit="L" />
      <ResultLine label="Volume por circuito" value={fmt(internalVolumeLiters / circuits, 3)} unit="L" />
      <ResultLine label="Área primária dos tubos" value={fmt(primaryArea, 3)} unit="m²" />
      <ResultLine label="Área secundária das aletas" value={fmt(secondaryArea, 3)} unit="m²" />
      <ResultLine label="Área total de troca" value={fmt(totalArea, 3)} unit="m²" />
      <ResultLine label="Relação secundária / primária" value={fmt(areaRatio, 1)} unit="×" />
      {operationComplete && <>
        <ResultLine label="Temperatura de saturação" value={fmt(saturationTemperature, 1)} unit="°C" />
        <ResultLine label={equipment === "Evaporador" ? "Saída superaquecida estimada" : "Saída sub-resfriada estimada"} value={fmt(outletTemperature, 1)} unit="°C" />
        <ResultLine label="Líquido — estimativa central" value={fmt(centralPhase.liquid, 3)} unit="L" />
        <ResultLine label="Faixa provável de líquido" value={`${fmt(liquidMinimum, 3)} a ${fmt(liquidMaximum, 3)}`} unit="L" />
        <ResultLine label="Vapor — estimativa central" value={fmt(centralPhase.vapor, 3)} unit="L" />
        <ResultLine label="Faixa provável de vapor" value={`${fmt(vaporMinimum, 3)} a ${fmt(vaporMaximum, 3)}`} unit="L" />
      </>}
    </>
  ) : undefined;

  return (
    <Calculator
      result={result}
      note="O volume e as áreas são geométricos. A divisão líquido/vapor é uma estimativa de ocupação baseada nas zonas térmicas e na fração de vazio adotada; não substitui cálculo de carga por modelo validado ou dado do fabricante."
    >
      <h2>Serpentina de tubos com aletas</h2>
      <p className="calc-intro">Informe as dimensões construtivas. Use o comprimento total somando todos os tubos e retornos da serpentina.</p>

      <h3>1. Geometria dos tubos</h3>
      <div className="form-grid">
        <Field label="Diâmetro externo do tubo" unit="mm" value={geometry.outerDiameter} onChange={changeGeometry("outerDiameter")} />
        <Field label="Espessura da parede" unit="mm" value={geometry.wallThickness} onChange={changeGeometry("wallThickness")} />
        <Field label="Comprimento total dos tubos" unit="m" value={geometry.tubeLength} onChange={changeGeometry("tubeLength")} />
        <Field label="Número de circuitos" unit="circuitos" value={geometry.circuits} onChange={changeGeometry("circuits")} />
      </div>

      <h3>2. Geometria das aletas</h3>
      <div className="form-grid">
        <Field label="Largura de cada aleta" unit="mm" value={geometry.finWidth} onChange={changeGeometry("finWidth")} />
        <Field label="Altura de cada aleta" unit="mm" value={geometry.finHeight} onChange={changeGeometry("finHeight")} />
        <Field label="Espessura da aleta" unit="mm" value={geometry.finThickness} onChange={changeGeometry("finThickness")} />
        <Field label="Quantidade total de aletas" unit="aletas" value={geometry.finCount} onChange={changeGeometry("finCount")} />
        <Field label="Passagens de tubos por aleta" unit="furos" value={geometry.holesPerFin} onChange={changeGeometry("holesPerFin")} />
      </div>

      <h3>3. Estimativa de líquido e vapor</h3>
      <p className="calc-intro">A fração de vazio representa quanto da região bifásica é ocupada por vapor. O sistema sugere 80% para evaporador e 55% para condensador, mas permite ajuste.</p>
      <div className="form-grid">
        <SelectField label="Equipamento" value={equipment} onChange={changeEquipment} options={["Evaporador", "Condensador"]} />
        <SelectField label="Fluido refrigerante" value={fluid} onChange={(value) => setFluid(value as Refrigerant)} options={Object.keys(refrigerantPressureTable)} />
        <Field label="Pressão de operação" unit="psig" value={operation.pressure} onChange={changeOperation("pressure")} allowNegative />
        <Field label={equipment === "Evaporador" ? "Superaquecimento na saída" : "Superaquecimento na entrada"} unit="K" value={operation.superheat} onChange={changeOperation("superheat")} />
        {equipment === "Condensador" && <Field label="Sub-resfriamento na saída" unit="K" value={operation.subcooling} onChange={changeOperation("subcooling")} />}
        <Field label="Fração de vapor na região bifásica" unit="%" value={operation.voidFraction} onChange={changeOperation("voidFraction")} />
      </div>
      {geometryComplete && (
        <div className="conditions">
          <span>Região de vapor: {fmt(superheatedShare * 100, 0)}%</span>
          <span>Região bifásica: {fmt(twoPhaseShare * 100, 0)}%</span>
          {equipment === "Condensador" && <span>Região sub-resfriada: {fmt(subcooledShare * 100, 0)}%</span>}
        </div>
      )}
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

const beerStyleProperties: Record<BeerStyle, { residualPlato: number; co2Volumes: number }> = {
  "Lager leve": { residualPlato: 1.8, co2Volumes: 2.6 },
  "Pilsen / Lager": { residualPlato: 2.5, co2Volumes: 2.6 },
  "Weiss": { residualPlato: 3, co2Volumes: 3 },
  "Pale Ale": { residualPlato: 3.2, co2Volumes: 2.4 },
  "IPA": { residualPlato: 3.5, co2Volumes: 2.4 },
  "Porter": { residualPlato: 4, co2Volumes: 2.2 },
  "Stout": { residualPlato: 4.6, co2Volumes: 2.1 },
  "Belgian Ale": { residualPlato: 3, co2Volumes: 3 },
  "Sour": { residualPlato: 2, co2Volumes: 2.7 },
  "Barleywine / Imperial": { residualPlato: 6, co2Volumes: 2.1 },
};

function BeerFreezingPoint() {
  const [style, setStyle] = useState<BeerStyle>("Pilsen / Lager");
  const [abv, setAbv] = useState("5");
  const alcoholByVolume = Math.max(0, n(abv));
  const properties = beerStyleProperties[style];
  const alcoholDepression = .42 * alcoholByVolume;
  const extractDepression = .04 * properties.residualPlato;
  const carbonationDepression = .083 * properties.co2Volumes;
  const estimatedFreezing = -(alcoholDepression + extractDepression + carbonationDepression);
  const uncertainty = .4;
  const warmerLimit = estimatedFreezing + uncertainty;
  const colderLimit = estimatedFreezing - uncertainty;
  const operatingMargin = 1.5;
  const recommendedMinimum = estimatedFreezing + operatingMargin;
  const complete = abv.trim() !== "" && alcoholByVolume >= 0;

  return (
    <Calculator
      result={complete ? <>
        <div className="result-badge">{fmt(estimatedFreezing, 1)} °C</div>
        <ResultLine label="Início estimado do congelamento" value={fmt(estimatedFreezing, 1)} unit="°C" />
        <ResultLine label="Faixa provável" value={`${fmt(colderLimit, 1)} a ${fmt(warmerLimit, 1)}`} unit="°C" />
        <ResultLine label="Temperatura mínima recomendada" value={fmt(recommendedMinimum, 1)} unit="°C" />
        <ResultLine label="Margem operacional adotada" value={fmt(operatingMargin, 1)} unit="°C" />
      </> : undefined}
      note="Estimativa simplificada do início de formação de cristais. O sistema considera automaticamente açúcar residual e carbonatação típicos do estilo; equipamentos com pontos frios podem congelar antes da temperatura indicada pelo sensor."
    >
      <h2>Estimativa rápida de congelamento</h2>
      <p className="calc-intro">Escolha o estilo e informe apenas o teor alcoólico da cerveja.</p>
      <div className="form-grid">
        <SelectField label="Estilo da cerveja" value={style} onChange={(value) => setStyle(value as BeerStyle)} options={Object.keys(beerStyleProperties)} />
        <Field label="Teor alcoólico" unit="% ABV" value={abv} onChange={setAbv} />
      </div>
      <div className="conditions">
        <span>Extrato típico: {fmt(properties.residualPlato, 1)} °P</span>
        <span>Carbonatação típica: {fmt(properties.co2Volumes, 1)} vol. CO₂</span>
        <span>Margem operacional: 1,5 °C</span>
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

type GeometryMode = "area" | "perimeter" | "volume";

const geometryLengthUnits = [
  { symbol: "mm", toMeter: .001 },
  { symbol: "cm", toMeter: .01 },
  { symbol: "m", toMeter: 1 },
  { symbol: "km", toMeter: 1000 },
  { symbol: "pol", toMeter: .0254 },
  { symbol: "pés", toMeter: .3048 },
];

const geometryResultUnits: Record<GeometryMode, { symbol: string; toBase: number }[]> = {
  perimeter: geometryLengthUnits.map(({ symbol, toMeter }) => ({ symbol, toBase: toMeter })),
  area: [
    { symbol: "mm²", toBase: 1e-6 },
    { symbol: "cm²", toBase: 1e-4 },
    { symbol: "m²", toBase: 1 },
    { symbol: "km²", toBase: 1e6 },
    { symbol: "pol²", toBase: .0254 ** 2 },
    { symbol: "pés²", toBase: .3048 ** 2 },
  ],
  volume: [
    { symbol: "mm³", toBase: 1e-9 },
    { symbol: "cm³", toBase: 1e-6 },
    { symbol: "m³", toBase: 1 },
    { symbol: "mL", toBase: 1e-6 },
    { symbol: "L", toBase: .001 },
    { symbol: "pol³", toBase: .0254 ** 3 },
    { symbol: "pés³", toBase: .3048 ** 3 },
  ],
};

const geometryShapeFields: Record<string, string[]> = {
  "Quadrado": ["Lado"],
  "Retângulo": ["Comprimento", "Largura"],
  "Círculo": ["Diâmetro"],
  "Triângulo": ["Base", "Altura"],
  "Trapézio": ["Base maior", "Base menor", "Altura"],
  "Elipse": ["Eixo maior", "Eixo menor"],
  "Triângulo por lados": ["Lado A", "Lado B", "Lado C"],
  "Trapézio por lados": ["Lado A", "Lado B", "Lado C", "Lado D"],
  "Mola helicoidal": ["Diâmetro externo", "Diâmetro do arame", "Número de espiras", "Passo entre espiras"],
  "Cubo": ["Aresta"],
  "Paralelepípedo": ["Comprimento", "Largura", "Altura"],
  "Cilindro": ["Diâmetro", "Altura"],
  "Esfera": ["Diâmetro"],
  "Cone": ["Diâmetro", "Altura"],
  "Pirâmide retangular": ["Comprimento da base", "Largura da base", "Altura"],
};

function GeometryShapeIcon({ shape }: { shape: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 72" role="img" aria-label={`Desenho de ${shape}`}>
      {shape === "Quadrado" && <rect x="25" y="11" width="50" height="50" {...common} />}
      {shape === "Retângulo" && <rect x="13" y="19" width="74" height="38" {...common} />}
      {shape === "Círculo" && <circle cx="50" cy="36" r="27" {...common} />}
      {(shape === "Triângulo" || shape === "Triângulo por lados") && <polygon points="50,8 88,62 12,62" {...common} />}
      {(shape === "Trapézio" || shape === "Trapézio por lados") && <polygon points="30,12 70,12 89,61 11,61" {...common} />}
      {shape === "Elipse" && <ellipse cx="50" cy="36" rx="38" ry="23" {...common} />}
      {shape === "Mola helicoidal" && <>
        <path d="M10 37 C16 16 25 16 31 37 S46 58 52 37 S67 16 73 37 S88 58 94 37" {...common} />
        <line x1="8" y1="58" x2="96" y2="58" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 4" />
        <line x1="10" y1="52" x2="10" y2="64" {...common} />
        <line x1="94" y1="52" x2="94" y2="64" {...common} />
      </>}
      {shape === "Cubo" && <>
        <rect x="20" y="22" width="43" height="38" {...common} />
        <polyline points="20,22 37,10 80,10 63,22" {...common} />
        <polyline points="63,22 80,10 80,48 63,60" {...common} />
      </>}
      {shape === "Paralelepípedo" && <>
        <rect x="12" y="27" width="56" height="32" {...common} />
        <polyline points="12,27 31,12 87,12 68,27" {...common} />
        <polyline points="68,27 87,12 87,44 68,59" {...common} />
      </>}
      {shape === "Cilindro" && <>
        <ellipse cx="50" cy="16" rx="27" ry="9" {...common} />
        <path d="M23 16v39c0 5 12 9 27 9s27-4 27-9V16" {...common} />
        <path d="M23 55c0-5 12-9 27-9s27 4 27 9" {...common} />
      </>}
      {shape === "Esfera" && <>
        <circle cx="50" cy="36" r="28" {...common} />
        <ellipse cx="50" cy="36" rx="28" ry="10" {...common} />
        <ellipse cx="50" cy="36" rx="10" ry="28" {...common} />
      </>}
      {shape === "Cone" && <>
        <ellipse cx="50" cy="57" rx="28" ry="8" {...common} />
        <line x1="50" y1="7" x2="22" y2="57" {...common} />
        <line x1="50" y1="7" x2="78" y2="57" {...common} />
      </>}
      {shape === "Pirâmide retangular" && <>
        <polygon points="15,49 62,49 84,61 36,61" {...common} />
        <line x1="50" y1="7" x2="15" y2="49" {...common} />
        <line x1="50" y1="7" x2="62" y2="49" {...common} />
        <line x1="50" y1="7" x2="84" y2="61" {...common} />
        <line x1="50" y1="7" x2="36" y2="61" {...common} />
      </>}
    </svg>
  );
}

function GeometryCalculator({ mode }: { mode: GeometryMode }) {
  const shapes = mode === "area"
    ? ["Quadrado", "Retângulo", "Círculo", "Triângulo", "Trapézio", "Elipse"]
    : mode === "perimeter"
      ? ["Quadrado", "Retângulo", "Círculo", "Triângulo por lados", "Trapézio por lados", "Elipse", "Mola helicoidal"]
      : ["Cubo", "Paralelepípedo", "Cilindro", "Esfera", "Cone", "Pirâmide retangular"];
  const [shape, setShape] = useState(shapes[0]);
  const [inputUnit, setInputUnit] = useState("cm");
  const [outputUnit, setOutputUnit] = useState(
    mode === "area" ? "cm²" : mode === "volume" ? "cm³" : "cm",
  );
  const [dimensions, setDimensions] = useState(["", "", "", ""]);
  const labels = geometryShapeFields[shape];
  const values = labels.map((_, index) => n(dimensions[index]));
  const filledDimensions = values.every((value, index) => dimensions[index].trim() !== "" && value > 0);
  const validSpring = shape !== "Mola helicoidal" || values[0] > values[1];
  const complete = filledDimensions && validSpring;
  let rawResult = 0;
  let springTurnPerimeter = 0;

  if (complete && mode === "area") {
    if (shape === "Quadrado") rawResult = values[0] ** 2;
    else if (shape === "Retângulo") rawResult = values[0] * values[1];
    else if (shape === "Círculo") rawResult = Math.PI * (values[0] / 2) ** 2;
    else if (shape === "Triângulo") rawResult = values[0] * values[1] / 2;
    else if (shape === "Trapézio") rawResult = (values[0] + values[1]) * values[2] / 2;
    else if (shape === "Elipse") rawResult = Math.PI * (values[0] / 2) * (values[1] / 2);
  }

  if (complete && mode === "perimeter") {
    if (shape === "Quadrado") rawResult = 4 * values[0];
    else if (shape === "Retângulo") rawResult = 2 * (values[0] + values[1]);
    else if (shape === "Círculo") rawResult = Math.PI * values[0];
    else if (shape === "Triângulo por lados") rawResult = values[0] + values[1] + values[2];
    else if (shape === "Trapézio por lados") rawResult = values[0] + values[1] + values[2] + values[3];
    else if (shape === "Elipse") {
      const a = values[0] / 2, b = values[1] / 2;
      rawResult = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    } else if (shape === "Mola helicoidal") {
      const meanDiameter = values[0] - values[1];
      springTurnPerimeter = Math.PI * meanDiameter;
      const helicalLengthPerTurn = Math.sqrt(springTurnPerimeter ** 2 + values[3] ** 2);
      rawResult = helicalLengthPerTurn * values[2];
    }
  }

  if (complete && mode === "volume") {
    if (shape === "Cubo") rawResult = values[0] ** 3;
    else if (shape === "Paralelepípedo") rawResult = values[0] * values[1] * values[2];
    else if (shape === "Cilindro") rawResult = Math.PI * (values[0] / 2) ** 2 * values[1];
    else if (shape === "Esfera") rawResult = 4 / 3 * Math.PI * (values[0] / 2) ** 3;
    else if (shape === "Cone") rawResult = Math.PI * (values[0] / 2) ** 2 * values[1] / 3;
    else if (shape === "Pirâmide retangular") rawResult = values[0] * values[1] * values[2] / 3;
  }

  const title = mode === "area" ? "Área" : mode === "perimeter" ? "Perímetro" : "Volume";
  const dimensionPower = mode === "area" ? 2 : mode === "volume" ? 3 : 1;
  const inputFactor = geometryLengthUnits.find((item) => item.symbol === inputUnit)?.toMeter ?? 1;
  const outputFactor = geometryResultUnits[mode].find((item) => item.symbol === outputUnit)?.toBase ?? 1;
  const result = rawResult * inputFactor ** dimensionPower / outputFactor;
  const springTurnResult = springTurnPerimeter * inputFactor / outputFactor;
  const formattedResult = result > 0 && (result < .000001 || result >= 1e9)
    ? result.toExponential(4).replace(".", ",")
    : fmt(result, 6);
  const formattedSpringTurn = fmt(springTurnResult, 6);

  function changeShape(value: string) {
    setShape(value);
    setDimensions(["", "", "", ""]);
  }

  return (
    <Calculator
      result={complete ? <>
        <div className="result-badge">{formattedResult} {outputUnit}</div>
        <ResultLine label={shape === "Mola helicoidal" ? "Comprimento total do arame" : title} value={formattedResult} unit={outputUnit} />
        {shape === "Mola helicoidal" && <ResultLine label="Perímetro médio por espira" value={formattedSpringTurn} unit={outputUnit} />}
        <ResultLine label="Medidas informadas em" value={inputUnit} />
        <ResultLine label="Forma selecionada" value={shape} />
      </> : undefined}
      note={
        shape === "Elipse" && mode === "perimeter"
          ? "Perímetro da elipse calculado pela aproximação de Ramanujan."
          : shape === "Mola helicoidal"
            ? "O cálculo usa o diâmetro médio da mola e considera o avanço axial informado no passo."
            : undefined
      }
    >
      <h2>Cálculo de {title.toLocaleLowerCase("pt-BR")}</h2>
      <p className="calc-intro">Selecione a forma, informe a unidade usada nas medidas e escolha em qual unidade deseja receber o resultado.</p>
      <div className="shape-picker" aria-label="Escolha a forma geométrica">
        {shapes.map((item) => (
          <button key={item} className={shape === item ? "active" : ""} onClick={() => changeShape(item)}>
            <GeometryShapeIcon shape={item} />
            <span>{item}</span>
          </button>
        ))}
      </div>
      {shape === "Mola helicoidal" && (
        <p className="calc-intro">
          O passo é a distância axial entre duas espiras consecutivas. Em uma mola totalmente fechada, use aproximadamente o diâmetro do arame.
          {filledDimensions && !validSpring && " O diâmetro externo precisa ser maior que o diâmetro do arame."}
        </p>
      )}
      <div className="form-grid">
        <SelectField
          label="Unidade das medidas informadas"
          value={inputUnit}
          onChange={setInputUnit}
          options={geometryLengthUnits.map((item) => item.symbol)}
        />
        <SelectField
          label={`Unidade desejada para ${title.toLocaleLowerCase("pt-BR")}`}
          value={outputUnit}
          onChange={setOutputUnit}
          options={geometryResultUnits[mode].map((item) => item.symbol)}
        />
        {labels.map((label, index) => (
          <Field
            key={label}
            label={label}
            unit={shape === "Mola helicoidal" && label === "Número de espiras" ? "espiras" : inputUnit}
            value={dimensions[index]}
            onChange={(value) => setDimensions((old) => old.map((item, itemIndex) => itemIndex === index ? value : item))}
          />
        ))}
      </div>
      <button className="secondary" onClick={() => setDimensions(["", "", "", ""])}>Limpar medidas</button>
    </Calculator>
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
