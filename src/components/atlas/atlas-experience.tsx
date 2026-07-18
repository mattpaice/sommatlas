"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  CircleHelp,
  MapPinned,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Wine,
} from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { chiantiClassicoComplementaryRedGrapes } from "@/data/appellation-rules";
import { demoFallbacks } from "@/data/demo-fallback";
import { mapContextPoints, type MapContextPoint } from "@/data/map-context";
import { mapMountainRanges } from "@/data/map-terrain";
import { baroloMolecularSignals, chiantiMolecularSignals, collioMolecularSignals, juraMolecularSignals, type MolecularLayer, type MolecularSignal } from "@/data/molecular-signals";
import { referenceProducers } from "@/data/reference-producers";
import { wineExpressions, type WineExpression } from "@/data/wine-expressions";
import { projectCountryPoint, type MapCountry } from "@/lib/map-projection";
import type { Challenge, Claim, Region, RegionId, Source } from "@/lib/schemas";

type AtlasExperienceProps = {
  regions: Region[];
  claims: Claim[];
  sources: Source[];
  challenges: Challenge[];
};

const profileTabs = [
  { id: "chemistry", label: "Chemistry", icon: Atom, colour: "var(--oxidised-gold)" },
  { id: "structure", label: "Structure", icon: Wine, colour: "var(--garnet)" },
  { id: "place", label: "Place", icon: MapPinned, colour: "var(--ponca)" },
  { id: "rules", label: "Rules", icon: ShieldCheck, colour: "var(--limestone)" },
  { id: "producers", label: "Producers", icon: Users, colour: "var(--sage)" },
] as const;

const glossary: Record<string, string> = {
  MGA: "Menzione Geografica Aggiuntiva: Barolo's official additional geographical unit, used to identify a delimited named place.",
  Tortonian: "A geological age/stage within the Miocene. In Barolo shorthand it is often used for younger sedimentary material; it is not itself a soil type or a style guarantee.",
  Serravallian: "An older Miocene geological age/stage. In Barolo shorthand it is often contrasted with Tortonian material; it is not itself a soil type or a style guarantee.",
  formation: "A named body of rock defined by its origin and characteristics. A formation is underlying geology, not a complete description of the vineyard soil.",
  monoterpene: "A family of volatile aroma compounds; linalool and geraniol are examples. Their sensory effect depends on concentration and the wine matrix.",
  norisoprenoid: "A family of aroma compounds derived from carotenoid breakdown. Some occur first as bound grape precursors and can be released or transformed later.",
  "glycosidic precursor": "A non-volatile grape compound in which an aroma-related molecule is bound to sugar. Fermentation, acid or ageing can help release or transform it.",
  anthocyanin: "A family of red-blue grape-skin pigments. Their amount and form influence colour, but colour evolution continues during winemaking and ageing.",
  proanthocyanidin: "A condensed tannin made from flavan-3-ol building blocks. Chain length and composition help shape astringency.",
};

type ProfileTabId = (typeof profileTabs)[number]["id"];

const themes = [
  { id: "harvest", label: "Harvest", note: "Plum & saffron", swatches: ["#dc6d55", "#e0ae48", "#98aa6f"] },
  { id: "cellar", label: "Cellar", note: "Garnet & copper", swatches: ["#ad4058", "#c57b48", "#8c9a70"] },
  { id: "atlas", label: "Atlas", note: "Ink & mineral", swatches: ["#3ea8a0", "#e27d58", "#d9b85f"] },
] as const;

type ThemeId = (typeof themes)[number]["id"];

const countryLabel = { IT: "Italy", FR: "France" } as const;
const chiantiClassicoGranSelezioneGrapes = ["Colorino", "Canaiolo", "Ciliegiolo", "Mammolo", "Pugnitello", "Malvasia Nera", "Foglia Tonda", "Sanforte"] as const;

function confidenceTone(confidence: Claim["confidence"]) {
  return confidence === "high"
    ? "border-[color:var(--sage)]/40 bg-[color:var(--sage)]/10 text-[color:var(--sage)]"
    : confidence === "medium"
      ? "border-[color:var(--oxidised-gold)]/40 bg-[color:var(--oxidised-gold)]/10 text-[color:var(--oxidised-gold)]"
      : "border-white/15 bg-white/5 text-[color:var(--muted)]";
}

function claimMatchesTab(claim: Claim, tab: ProfileTabId) {
  if (tab === "producers") return false;
  if (tab === "rules") return claim.claimType === "legal";
  if (tab === "place") {
    return claim.claimType === "geology" || claim.id === "barolo-site-before-style";
  }
  if (tab === "structure") {
    if (claim.subjectId === "barolo") {
      return ["nebbiolo-pigment-tannin-pattern", "nebbiolo-anthocyanin-profile", "nebbiolo-named-anthocyanins", "nebbiolo-proanthocyanidin-building-blocks"].includes(claim.id);
    }
    return ["editorial_interpretation", "common_practice", "historical_practice"].includes(claim.claimType);
  }
  if (claim.subjectId === "barolo" && tab === "chemistry") {
    return ["nebbiolo-norisoprenoid-precursors", "nebbiolo-terpenoid-wine-profile", "nebbiolo-aroma-not-one-to-one", "nebbiolo-oxygen-ageing-network"].includes(claim.id);
  }
  return claim.claimType === "measured" || claim.claimType === "published_association";
}

export function AtlasExperience({ regions, claims, sources, challenges }: AtlasExperienceProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabId>("chemistry");
  const [theme, setTheme] = useState<ThemeId>("harvest");
  const [selectedId, setSelectedId] = useState<RegionId>("barolo");
  const [focusedContextId, setFocusedContextId] = useState<MapContextPoint["id"] | null>(null);
  const [activeMapTooltipId, setActiveMapTooltipId] = useState<string | null>(null);
  const [expressionId, setExpressionId] = useState("barolo-nebbiolo");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"sol" | "terra">("sol");
  const transport = useMemo(
    () => new DefaultChatTransport({ api: `/api/synthesis/${mode === "sol" ? "deep" : "quick"}` }),
    [mode],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });

  const selected = regions.find((region) => region.id === selectedId) ?? regions[0];
  const selectedClaims = useMemo(
    () => claims.filter((claim) => claim.subjectId === selected?.id && claim.status === "verified"),
    [claims, selected],
  );
  const tabClaims = useMemo(() => {
    return selectedClaims.filter((claim) => claimMatchesTab(claim, activeTab));
  }, [activeTab, selectedClaims]);
  const selectedSources = useMemo(() => {
    const ids = new Set(tabClaims.flatMap((claim) => claim.sourceIds));
    return sources.filter((source) => ids.has(source.id));
  }, [tabClaims, sources]);
  const activeChallenge = challenges.find((challenge) => challenge.regionId === selected?.id) ?? challenges[0];
  const barolo = regions.find((region) => region.id === "barolo");
  const chianti = regions.find((region) => region.id === "chianti-classico");

  if (!selected || !activeChallenge || !barolo || !chianti) return null;

  const active = profileTabs.find((tab) => tab.id === activeTab) ?? profileTabs[0];
  const availableExpressions = wineExpressions.filter((expression) => expression.regionId === selected.id);
  const selectedExpression = availableExpressions.find((expression) => expression.id === expressionId) ?? availableExpressions[0];
  const synthesisPrompt = mode === "sol"
    ? `Build an evidence-bounded account of ${selected.name} as ${selectedExpression?.label ?? "the selected expression"}: separate geology, grape chemistry, vinification and legal rules.`
    : `Explain the most useful chemical and structural distinction in ${selected.name} as ${selectedExpression?.label ?? "the selected expression"}.`;
  const latestAnswer = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
  const fallbackAnswer = error && selected.id === "barolo"
    ? demoFallbacks.find((fallback) => fallback.id === (mode === "sol" ? "compare-barolo-chianti" : "explain-anthocyanins"))?.answer
    : undefined;
  const isGenerating = status === "submitted" || status === "streaming";
  const mapIndexValue = focusedContextId ? `context:${focusedContextId}` : `study:${selected.id}`;

  function navigateMapIndex(value: string) {
    const [kind, id] = value.split(":");
    if (kind === "study") {
      const nextRegionId = id as RegionId;
      const firstExpression = wineExpressions.find((expression) => expression.regionId === nextRegionId);
      setSelectedId(nextRegionId);
      if (firstExpression) setExpressionId(firstExpression.id);
      setFocusedContextId(null);
      setActiveMapTooltipId(null);
      setChallengeAnswer(null);
      setMapCollapsed(true);
      return;
    }
    setFocusedContextId(id as MapContextPoint["id"]);
    setActiveMapTooltipId(null);
    setMapCollapsed(false);
  }

  function selectRegion(regionId: RegionId) {
    const firstExpression = wineExpressions.find((expression) => expression.regionId === regionId);
    setSelectedId(regionId);
    if (firstExpression) setExpressionId(firstExpression.id);
    setFocusedContextId(null);
    setActiveMapTooltipId(null);
    setChallengeAnswer(null);
    setMapCollapsed(true);
  }

  return (
    <main data-theme={theme} className="atlas-shell min-h-screen overflow-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="relative border-b border-[color:var(--line)] bg-[color:var(--header-bg)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -right-24 -top-40 h-80 w-80 rounded-full bg-[color:var(--wash-one)] blur-3xl" />
          <div className="absolute left-[38%] top-[-8rem] h-64 w-64 rounded-full bg-[color:var(--wash-two)] blur-3xl" />
          <div className="absolute inset-0 opacity-[.11] [background-image:repeating-linear-gradient(118deg,transparent_0,transparent_42px,var(--foreground)_43px,transparent_44px)]" />
        </div>
        <div className="relative mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-6">
          <div className="wordmark-lockup min-w-[250px] py-1">
            <h1 aria-label="SommAtlas" className="font-wordmark flex items-baseline text-[2.9rem] leading-none tracking-[-.06em] text-[color:var(--foreground)] md:text-[3.5rem]">
              <span className="wordmark-peak">S</span><span className="wordmark-low">O</span><span className="wordmark-mid">M</span><span className="wordmark-low">M</span><span className="wordmark-peak ml-[.13em]">A</span><span className="wordmark-low">T</span><span className="wordmark-mid">L</span><span className="wordmark-low">A</span><span className="wordmark-peak">S</span>
            </h1>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[.28em] text-[color:var(--oxidised-gold)]">Wine · place · evidence</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--muted)] sm:mr-2">
              <Palette size={13} className="text-[color:var(--brand-secondary)]" /> Art direction
            </div>
            <div className="theme-picker flex gap-1 rounded-xl border border-[color:var(--line)] bg-black/15 p-1 backdrop-blur">
              {themes.map((option) => (
                <button
                  key={option.id}
                  aria-pressed={theme === option.id}
                  onClick={() => setTheme(option.id)}
                  className={`group flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition sm:min-w-[112px] ${theme === option.id ? "bg-[color:var(--theme-control)] shadow-sm" : "hover:bg-white/[.05]"}`}
                >
                  <span className="flex shrink-0 -space-x-1">
                    {option.swatches.map((swatch) => <span key={swatch} className="h-3 w-3 rounded-full border border-black/30" style={{ backgroundColor: swatch }} />)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold text-[color:var(--foreground)]">{option.label}</span>
                    <span className="hidden truncate text-[8px] text-[color:var(--muted)] xl:block">{option.note}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={`mx-auto grid max-w-[1500px] gap-4 px-5 pb-10 md:px-8 ${mapCollapsed ? "xl:grid-cols-[280px_minmax(0,1fr)]" : "xl:grid-cols-[minmax(0,1fr)_420px]"}`}>
        <section className={`relative overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-[image:var(--map-background)] p-5 shadow-[0_24px_80px_-45px_var(--oxidised-gold)] transition-[min-height] duration-300 ${mapCollapsed ? "min-h-[540px]" : "min-h-[580px] md:p-8"}`}>
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(242,234,219,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(242,234,219,.06)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative flex items-start justify-between gap-4">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: active.colour }}>{mapCollapsed ? "Map rail" : "Geographic index"}</p><p className="mt-1 max-w-md text-sm text-[color:var(--muted)]">{mapCollapsed ? selected.name : "Select a place, then examine one wine expression at a time."}</p></div>
            <div className="flex shrink-0 gap-2">
              {!mapCollapsed && <button onClick={() => setComparisonOpen((open) => !open)} className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-black/10 px-3 py-2 text-xs transition hover:bg-white/5"><Scale size={14} className="text-[color:var(--oxidised-gold)]" /> Barolo / Chianti</button>}
              <button aria-label={mapCollapsed ? "Expand map" : "Collapse map"} title={mapCollapsed ? "Expand map" : "Collapse map"} onClick={() => setMapCollapsed((collapsed) => !collapsed)} className="rounded-full border border-[color:var(--line)] bg-black/10 p-2 text-[color:var(--muted)] transition hover:bg-white/5 hover:text-[color:var(--foreground)]">{mapCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}</button>
            </div>
          </div>

          <div className={`relative mx-auto mt-1 ${mapCollapsed ? "h-[370px]" : "h-[450px] max-w-3xl"}`}>
            {mapCollapsed ? (
              <CountryMap country={selected.country} className={selected.country === "FR" ? "left-[4%] top-[8%] w-[92%] aspect-square" : "left-[18%] top-[2%] h-[94%] aspect-[500/620]"} maskClassName={selected.country === "FR" ? "bg-[color:var(--limestone)] opacity-20 [mask:url('/maps/france.svg')_center/100%_100%_no-repeat]" : "bg-[color:var(--ponca)] opacity-25 [mask:url('/maps/italy.svg')_center/100%_100%_no-repeat]"} labelClassName={selected.country === "FR" ? "left-[24%] top-[17%] text-[color:var(--limestone)]/70" : "right-[5%] top-[16%] text-[color:var(--ponca)]/70"} regions={regions} selectedId={selected.id} activeColour={active.colour} visibleTooltipId={activeMapTooltipId} onTooltipChange={setActiveMapTooltipId} focusedContextId={focusedContextId} onContextFocus={setFocusedContextId} onSelect={selectRegion} showContext={false} />
            ) : <>
              <CountryMap country="FR" className="left-[7%] top-[6%] w-[44%] aspect-square" maskClassName="bg-[color:var(--limestone)] opacity-20 [mask:url('/maps/france.svg')_center/100%_100%_no-repeat]" labelClassName="left-[25%] top-[17%] text-[color:var(--limestone)]/70" regions={regions} selectedId={selected.id} activeColour={active.colour} visibleTooltipId={activeMapTooltipId ?? (focusedContextId ? `context:${focusedContextId}` : null)} onTooltipChange={setActiveMapTooltipId} focusedContextId={focusedContextId} onContextFocus={setFocusedContextId} onSelect={selectRegion} showContext />
              <CountryMap country="IT" className="right-[7%] top-[1%] h-[94%] aspect-[500/620]" maskClassName="bg-[color:var(--ponca)] opacity-25 [mask:url('/maps/italy.svg')_center/100%_100%_no-repeat]" labelClassName="right-[8%] top-[16%] text-[color:var(--ponca)]/70" regions={regions} selectedId={selected.id} activeColour={active.colour} visibleTooltipId={activeMapTooltipId ?? (focusedContextId ? `context:${focusedContextId}` : null)} onTooltipChange={setActiveMapTooltipId} focusedContextId={focusedContextId} onContextFocus={setFocusedContextId} onSelect={selectRegion} showContext />
            </>}
          </div>
          <div className={`relative mt-auto flex flex-col gap-3 border-t border-[color:var(--line)] pt-3 ${mapCollapsed ? "items-stretch" : "sm:flex-row sm:items-center sm:justify-between"}`}>
            <label className={`flex font-mono text-[9px] uppercase tracking-[.14em] text-[color:var(--muted)] ${mapCollapsed ? "flex-col gap-2" : "items-center gap-2"}`}>
              Appellation index
              <select aria-label="Find an appellation on the map" value={mapIndexValue} onChange={(event) => navigateMapIndex(event.target.value)} className="w-full max-w-[220px] rounded-md border border-[color:var(--line)] bg-[color:var(--panel)] px-2 py-1.5 font-sans text-xs normal-case tracking-normal text-[color:var(--foreground)] outline-none focus:border-[color:var(--oxidised-gold)]">
                <optgroup label="Featured studies">{regions.map((region) => <option key={region.id} value={`study:${region.id}`}>{region.name}</option>)}</optgroup>
                <optgroup label="Context appellations">{mapContextPoints.map((point) => <option key={point.id} value={`context:${point.id}`}>{point.label}</option>)}</optgroup>
              </select>
            </label>
            {!mapCollapsed && <span className="text-[10px] text-[color:var(--muted)]">Hover or focus a dot to identify it · representative points</span>}
          </div>
        </section>

        <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6">
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-3xl tracking-tight">{selected.name}</h2><p className="mt-1 text-sm text-[color:var(--muted)]">{selected.location} · {countryLabel[selected.country]}</p></div><span className="rounded-full border border-[color:var(--line)] px-2 py-1 font-mono text-[9px] tracking-wider text-[color:var(--muted)]">{selected.entityType.replace("_", " ")}</span></div>
          <RegionalOverview region={selected} />

          <ExpressionSelector region={selected} expressions={availableExpressions} selected={selectedExpression} onSelect={setExpressionId} />
          <ProfileTabs activeTab={activeTab} onSelect={setActiveTab} />
          <ProfilePanel region={selected} activeTab={activeTab} expression={selectedExpression} claims={claims} sources={sources} />
          {activeTab !== "producers" && (tabClaims.length > 0 ? <Evidence claims={tabClaims.slice(0, 2)} sources={selectedSources} /> : <EvidenceGap tab={activeTab} expression={selectedExpression} />)}
        </aside>

        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[color:var(--oxidised-gold)]">Guided synthesis</p><h2 className="mt-1 font-serif text-2xl">Ask a better wine question.</h2></div><div className="flex rounded-lg border border-[color:var(--line)] p-1"><ModeButton active={mode === "sol"} onClick={() => setMode("sol")} label="Deep synthesis · Sol" /><ModeButton active={mode === "terra"} onClick={() => setMode("terra")} label="Quick tutor · Terra" /></div></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]"><div className="rounded-xl border border-dashed border-[color:var(--line)] bg-black/10 p-4"><p className="text-sm leading-6 text-[color:var(--muted)]">{synthesisPrompt}</p><p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Grounded in selected corpus · citations shown in result</p></div><button disabled={isGenerating} onClick={() => sendMessage({ text: synthesisPrompt })} className="flex items-center justify-center gap-2 rounded-xl bg-[color:var(--oxidised-gold)] px-5 py-3 text-sm font-semibold text-[color:var(--background)] transition hover:bg-[color:var(--limestone)] disabled:cursor-wait disabled:opacity-60"><Sparkles size={15} className={isGenerating ? "animate-pulse" : ""} /> {isGenerating ? "Tracing evidence…" : "Synthesize"}</button></div>
          {(latestAnswer || fallbackAnswer) && <div className="mt-5 rounded-xl border border-[color:var(--line)] bg-black/15 p-4"><div className="mb-3 flex items-center justify-between gap-3"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[color:var(--sage)]">{fallbackAnswer ? "Curated fallback" : mode === "sol" ? "Sol synthesis" : "Terra tutor"}</p>{fallbackAnswer && <span className="text-[10px] text-[color:var(--muted)]">Live model unavailable</span>}</div><MessageResponse className="text-sm leading-6 text-[color:var(--foreground)]">{latestAnswer ?? fallbackAnswer ?? ""}</MessageResponse></div>}
        </section>
      </div>

      {comparisonOpen && <ComparisonSheet barolo={barolo} chianti={chianti} onClose={() => setComparisonOpen(false)} />}
      <ChallengeCard challenge={activeChallenge} answer={challengeAnswer} onAnswer={setChallengeAnswer} claims={claims} sources={sources} />
    </main>
  );
}

type CountryMapProps = {
  country: MapCountry;
  className: string;
  maskClassName: string;
  labelClassName: string;
  regions: Region[];
  selectedId: RegionId;
  activeColour: string;
  visibleTooltipId: string | null;
  onTooltipChange: (pointId: string | null) => void;
  focusedContextId: MapContextPoint["id"] | null;
  onContextFocus: (pointId: MapContextPoint["id"]) => void;
  onSelect: (regionId: RegionId) => void;
  showContext: boolean;
};

function CountryMap({ country, className, maskClassName, labelClassName, regions, selectedId, activeColour, visibleTooltipId, onTooltipChange, focusedContextId, onContextFocus, onSelect, showContext }: CountryMapProps) {
  const countryRegions = regions.filter((region) => region.country === country);

  return (
    <div className={`absolute overflow-visible ${className}`}>
      <div aria-hidden className={`absolute inset-0 ${maskClassName}`} />
      <MountainOverlay country={country} />
      <div className={`pointer-events-none absolute font-mono text-[10px] tracking-[.24em] ${labelClassName}`}>{country === "FR" ? "FRANCE" : "ITALY"}</div>
      {country === "FR" && showContext && <ContextDots focusedId={focusedContextId} visibleTooltipId={visibleTooltipId} onTooltipChange={onTooltipChange} onFocus={onContextFocus} />}
      {countryRegions.map((region) => (
        <Hotspot key={region.id} region={region} active={selectedId === region.id} colour={activeColour} tooltipVisible={visibleTooltipId === `study:${region.id}`} onTooltipChange={onTooltipChange} onSelect={() => onSelect(region.id)} />
      ))}
    </div>
  );
}

function MountainOverlay({ country }: { country: MapCountry }) {
  const ranges = mapMountainRanges.filter((range) => range.country === country);
  const viewBox = country === "FR" ? "0 0 500 500" : "0 0 500 620";

  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox={viewBox} style={{ maskImage: `url('/maps/${country === "FR" ? "france" : "italy"}.svg')`, maskPosition: "center", maskRepeat: "no-repeat", maskSize: "100% 100%" }}>
      {ranges.map((range) => {
        const projected = range.points.map(([longitude, latitude]) => projectCountryPoint(country, { longitude, latitude }));
        const line = projected.map((point) => `${point.x},${point.y}`).join(" ");

        return (
          <g key={range.id}>
            <polyline points={line} fill="none" stroke="var(--terrain-ridge)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="7" />
            {projected.map((point, index) => (
              <g key={`${range.id}-${index}`} transform={`translate(${point.x} ${point.y}) scale(${range.scale})`}>
                <path d="M-12 6 -3 -8 3 0 8 -5 16 6Z" fill="var(--terrain-ridge)" fillOpacity="0.2" stroke="var(--terrain-ridge)" strokeLinejoin="round" strokeOpacity="0.62" strokeWidth="1.5" />
                <path d="M-6 -3 -3 -8 0 -3M5 -2 8 -5 11 -1" fill="none" stroke="var(--foreground)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" strokeWidth="1.2" />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function Hotspot({ region, active, colour, tooltipVisible, onTooltipChange, onSelect }: { region: Region; active: boolean; colour: string; tooltipVisible: boolean; onTooltipChange: (pointId: string | null) => void; onSelect: () => void }) {
  const projected = projectCountryPoint(region.country, region.map);
  const labelOnLeft = projected.xPercent > 52;

  return (
    <button aria-label={`Explore ${region.name}`} onPointerEnter={() => onTooltipChange(`study:${region.id}`)} onPointerLeave={() => onTooltipChange(null)} onFocus={() => onTooltipChange(`study:${region.id}`)} onBlur={() => onTooltipChange(null)} onClick={onSelect} className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: `${projected.xPercent}%`, top: `${projected.yPercent}%` }}>
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/40 bg-[#11110f] shadow-[0_0_0_5px_rgba(17,17,15,.7)]"><span className={`h-2 w-2 rounded-full ${active ? "animate-pulse" : ""}`} style={{ backgroundColor: colour }} /></span>
      <span className={`pointer-events-none absolute top-1/2 w-max -translate-y-1/2 rounded-md border border-[color:var(--line)] bg-[#171713]/95 px-2 py-1 font-mono text-[9px] uppercase tracking-wider shadow-lg transition ${labelOnLeft ? "right-7" : "left-7"} ${tooltipVisible ? "opacity-100" : "opacity-0"}`}>{region.name}</span>
    </button>
  );
}

function ContextDots({ focusedId, visibleTooltipId, onTooltipChange, onFocus }: { focusedId: MapContextPoint["id"] | null; visibleTooltipId: string | null; onTooltipChange: (pointId: string | null) => void; onFocus: (pointId: MapContextPoint["id"]) => void }) {
  return (
    <>
      {mapContextPoints.map((point) => {
        const position = projectCountryPoint(point.country, point.anchor);
        const labelOnLeft = position.xPercent > 58;
        const isFocused = focusedId === point.id;
        return (
          <button key={point.id} aria-label={`Locate ${point.label}`} onPointerEnter={() => onTooltipChange(`context:${point.id}`)} onPointerLeave={() => onTooltipChange(null)} onFocus={() => onTooltipChange(`context:${point.id}`)} onBlur={() => onTooltipChange(null)} onClick={() => onFocus(point.id)} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${position.xPercent}%`, top: `${position.yPercent}%` }}>
            <span className={`block rounded-full border bg-[color:var(--background)] transition ${isFocused ? "h-3 w-3 border-[color:var(--oxidised-gold)] shadow-[0_0_0_4px_rgba(224,174,72,.14)]" : "h-2.5 w-2.5 border-[color:var(--limestone)]/70 shadow-[0_0_0_3px_rgba(216,200,170,.08)]"}`} />
            <span className={`pointer-events-none absolute top-1/2 w-max -translate-y-1/2 rounded-md border border-[color:var(--line)] bg-[#171713]/95 px-2 py-1 font-mono text-[8px] uppercase tracking-[.08em] text-[color:var(--foreground)] shadow-lg transition ${labelOnLeft ? "right-5" : "left-5"} ${visibleTooltipId === `context:${point.id}` ? "opacity-100" : "opacity-0"}`}>{point.label}</span>
          </button>
        );
      })}
    </>
  );
}

function ExpressionSelector({ region, expressions, selected, onSelect }: { region: Region; expressions: readonly WineExpression[]; selected?: WineExpression; onSelect: (expressionId: string) => void }) {
  if (!selected) return null;

  return (
    <section className="mt-5 rounded-xl border border-[color:var(--line)] bg-black/10 p-3" aria-label="Wine expression">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">Wine expression</p>
        {expressions.length > 1 && <select aria-label={`Choose a ${region.name} wine expression`} value={selected.id} onChange={(event) => onSelect(event.target.value)} className="min-w-0 max-w-[220px] rounded-md border border-[color:var(--line)] bg-[color:var(--panel)] px-2 py-1 text-xs text-[color:var(--foreground)] outline-none focus:border-[color:var(--oxidised-gold)]">{expressions.map((expression) => <option key={expression.id} value={expression.id}>{expression.label}</option>)}</select>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <ExpressionField label="Grape" value={selected.grape} database />
        <ExpressionField label="Vinification" value={selected.vinification} />
        <ExpressionField label="Place" value={region.name} />
      </div>
    </section>
  );
}

function ExpressionField({ label, value, database = false }: { label: string; value: string; database?: boolean }) {
  return <div className="min-w-0 border-l border-[color:var(--line)] pl-2 first:border-l-0 first:pl-0"><p className="font-mono text-[8px] uppercase tracking-[.12em] text-[color:var(--muted)]">{label}</p><p className="mt-1 truncate text-[10px] font-medium text-[color:var(--foreground)]" title={value}>{value}</p>{database && <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[.08em] text-[color:var(--sage)]">Grape database</p>}</div>;
}

function GlossaryTerm({ term, children }: { term: string; children?: ReactNode }) {
  const definition = glossary[term.toLowerCase()] ?? glossary[term];
  if (!definition) return <>{children ?? term}</>;
  return <span tabIndex={0} aria-label={`${term}: ${definition}`} className="group relative inline-flex cursor-help outline-none"><span className="border-b border-dotted border-[color:var(--oxidised-gold)]/70">{children ?? term}</span><span role="tooltip" className="pointer-events-none absolute bottom-full left-0 z-40 mb-2 w-64 rounded-md border border-[color:var(--line-strong)] bg-[#161512] p-2.5 text-left font-sans text-[10px] normal-case leading-4 tracking-normal text-[color:var(--foreground)] opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus:opacity-100">{definition}</span></span>;
}

function RegionalOverview({ region }: { region: Region }) {
  if (region.id === "barolo") return <section className="mt-4 rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-[color:var(--oxidised-gold)]">Orientation</p><p className="mt-1 text-[11px] leading-5 text-[color:var(--foreground)]">The familiar broad-brush contrast is <GlossaryTerm term="Tortonian" /> material tending sandier and <GlossaryTerm term="Serravallian" /> material tending more clay-rich. Start there, then resolve it through named <GlossaryTerm term="formation" />s, slope and soil evolution.</p><p className="mt-2 text-[10px] leading-4 text-[color:var(--muted)]"><span className="font-medium text-[color:var(--foreground)]">Serralunga lens:</span> much of the commune sits on the Lequio Formation’s sandstone–marl sequence, shared with eastern Monforte; individual <GlossaryTerm term="MGA" />s still differ in exposure, soil depth and water behaviour.</p></section>;
  if (region.id === "chianti-classico") return <section className="mt-4 rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-[color:var(--oxidised-gold)]">Orientation</p><p className="mt-1 text-[11px] leading-5 text-[color:var(--foreground)]">Panzano is shaped by two opposed slope systems: a generally cooler eastern side in the Greve catchment and a western side that falls toward the Pesa.</p><p className="mt-2 text-[10px] leading-4 text-[color:var(--muted)]"><span className="font-medium text-[color:var(--foreground)]">Conca d’Oro lens:</span> the amphitheatre south of Panzano sits on the western side, where aspect, elevation and diurnal range give its Sangiovese a distinct site setting.</p></section>;
  return <p className="mt-3 text-[11px] leading-5 text-[color:var(--muted)]">{region.summary}</p>;
}

function ProfileTabs({ activeTab, onSelect }: { activeTab: ProfileTabId; onSelect: (tab: ProfileTabId) => void }) {
  return (
    <nav aria-label="Appellation evidence" className="mt-5 grid grid-cols-5 gap-1 border-b border-[color:var(--line)]" role="tablist">
      {profileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => onSelect(tab.id)} className={`flex min-w-0 flex-col items-center gap-1 border-b-2 px-1 py-2 text-[10px] transition ${isActive ? "border-[color:var(--oxidised-gold)] text-[color:var(--foreground)]" : "border-transparent text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}><Icon size={14} style={{ color: isActive ? tab.colour : undefined }} /><span className="truncate">{tab.label}</span></button>;
      })}
    </nav>
  );
}

function ProfilePanel({ region, activeTab, expression, claims, sources }: { region: Region; activeTab: ProfileTabId; expression?: WineExpression; claims: Claim[]; sources: Source[] }) {
  const chemistryText = region.id === "jura" && expression?.vinification === "Ouillé"
    ? "This expression excludes veil-derived sotolon as a defining shortcut; oxygen management, fermentation and élevage need their own evidence trail."
    : region.id === "collio" && expression?.id === "collio-ribolla-skin"
      ? region.layerHighlights.phenolics
      : region.layerHighlights.chemistry;

  return (
    <section role="tabpanel" className="border-b border-[color:var(--line)] py-5">
      {(activeTab === "chemistry" || activeTab === "structure") && expression && <p className="font-mono text-[8px] uppercase tracking-[.14em] text-[color:var(--muted)]">Scoped to {expression.label}</p>}
      {activeTab === "place" && <><PlaceBasics region={region} /><SignalText>{region.layerHighlights.geology}</SignalText>{region.id === "barolo" && <BaroloSiteModel />}{region.id === "collio" && <MineralDecoder />}</>}
      {activeTab === "chemistry" && <><SignalText featured>{chemistryText}</SignalText>{region.id === "barolo" && <MolecularFingerprint key="barolo-chemistry" layer="chemistry" signals={baroloMolecularSignals} claims={claims} sources={sources} />}{region.id === "chianti-classico" && <MolecularFingerprint key="chianti-chemistry" layer="chemistry" signals={chiantiMolecularSignals} claims={claims} sources={sources} />}{region.id === "jura" && <MolecularFingerprint key={expression?.id} layer="chemistry" signals={juraMolecularSignals} expressionId={expression?.id} claims={claims} sources={sources} />}{region.id === "collio" && <MolecularFingerprint key={expression?.id} layer="chemistry" signals={collioMolecularSignals} expressionId={expression?.id} claims={claims} sources={sources} />}</>}
      {activeTab === "structure" && <><SignalText>{region.layerHighlights.phenolics}</SignalText><p className="mt-2 text-[11px] leading-5 text-[color:var(--muted)]">{region.layerHighlights.palate}</p>{region.id === "barolo" && <MolecularFingerprint key="barolo-phenolics" layer="phenolics" signals={baroloMolecularSignals} claims={claims} sources={sources} />}<StructureProfile region={region} /></>}
      {activeTab === "rules" && <><SignalText>{region.layerHighlights.rules}</SignalText>{region.id === "chianti-classico" && <ChiantiClassicoRules />}</>}
      {activeTab === "producers" && <ReferenceProducers region={region} />}
    </section>
  );
}

function PlaceBasics({ region }: { region: Region }) {
  const basics: Partial<Record<RegionId, string>> = {
    barolo: "Barolo is a small red-wine DOCG in north-west Italy, made entirely from Nebbiolo. Its vineyard villages sit in the Langhe hills, where marl, sandstone, slope and exposure shape the growing conditions.",
    "chianti-classico": "Chianti Classico is the historic hillside zone between Florence and Siena. It is a Sangiovese-led red-wine DOCG, with villages and slopes that span sandstone, limestone, marl and schist.",
    jura: "Jura is a compact wine region in eastern France, built around marl-and-limestone slopes. Its winemakers make fresh topped-up whites alongside savoury wines raised under a yeast veil.",
    collio: "Collio is a hilly white-wine appellation on Italy's north-eastern border. Its distinctive ponca—alternating marl and sandstone—forms the well-drained hillside setting for aromatic and textural white wines.",
  };
  return <div className="mt-1 rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-[color:var(--oxidised-gold)]">Start here</p><p className="mt-1 text-[13px] leading-5 text-[color:var(--foreground)]">{basics[region.id] ?? region.summary}</p></div>;
}

function SignalText({ children, featured = false }: { children: string; featured?: boolean }) {
  return <p className={featured ? "mt-3 border-l-2 border-[color:var(--oxidised-gold)] pl-4 font-serif text-[1.08rem] leading-7 text-[color:var(--foreground)]" : "mt-2 text-sm leading-6 text-[color:var(--foreground)]"}>{children}</p>;
}

function StructureProfile({ region }: { region: Region }) {
  const metrics = region.archetype.metrics.filter((metric) => ["colour", "acidity", "tannin", "body"].includes(metric.id));
  return <div className="mt-4"><div className="flex items-center justify-between gap-2"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[color:var(--oxidised-gold)]">Organoleptic structure</p><span className="text-[8px] text-[color:var(--muted)]">Editorial range · 1—5</span></div><div className="mt-3 space-y-3">{metrics.map((metric) => <div key={metric.id}><div className="flex items-center justify-between gap-2 text-[10px]"><span>{metric.label}</span><span className="text-[color:var(--muted)]">{metric.min}—{metric.max}</span></div><div className="relative mt-1 h-1.5 rounded-full bg-white/[.07]"><span className="absolute top-0 h-1.5 rounded-full bg-[color:var(--garnet)]" style={{ left: `${(metric.min - 1) * 25}%`, width: `${Math.max((metric.max - metric.min) * 25, 6)}%` }} /></div><p className="mt-1 text-[9px] leading-4 text-[color:var(--muted)]">{metric.descriptor}</p></div>)}</div></div>;
}

function BaroloSiteModel() {
  const factors = ["Formation", "Soil properties", "Water + root environment", "Slope + microclimate", "Vine response + farming", "Bounded hypothesis"];
  return <div className="mt-4"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">Site before style</p><ol className="mt-2 grid grid-cols-2 gap-1.5">{factors.map((factor, index) => <li key={factor} className={`rounded-md border border-[color:var(--line)] bg-black/10 px-2 py-1.5 text-[10px] leading-4 ${index === factors.length - 1 ? "col-span-2 text-[color:var(--sage)]" : "text-[color:var(--muted)]"}`}><span className="mr-1.5 font-mono text-[color:var(--oxidised-gold)]">{index + 1}</span>{factor === "Formation" ? <GlossaryTerm term="formation">Formation</GlossaryTerm> : factor}</li>)}</ol></div>;
}

function MineralDecoder() {
  const meanings = [
    { label: "Geological", note: "Crystalline compounds in rock and soil" },
    { label: "Nutritional", note: "Bioavailable elements used by the vine" },
    { label: "Sensory", note: "A metaphor whose cause is not specified" },
  ];
  return <div className="mt-4"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">Three meanings of mineral</p><div className="mt-2 space-y-1.5">{meanings.map((meaning) => <div key={meaning.label} className="grid grid-cols-[76px_1fr] gap-2 rounded-md border border-[color:var(--line)] bg-black/10 px-2 py-1.5 text-[10px] leading-4"><span className="font-medium text-[color:var(--foreground)]">{meaning.label}</span><span className="text-[color:var(--muted)]">{meaning.note}</span></div>)}</div></div>;
}

function ChiantiClassicoRules() {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><p className="font-mono text-[8px] uppercase tracking-[.14em] text-[color:var(--oxidised-gold)]">Annata + Riserva</p><p className="mt-1 text-xs font-medium">80—100% Sangiovese</p><p className="mt-1 text-[10px] leading-4 text-[color:var(--muted)]">Up to 20% from the complete Attachment 1 list below.</p></div>
        <div className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><p className="font-mono text-[8px] uppercase tracking-[.14em] text-[color:var(--sage)]">Gran Selezione</p><p className="mt-1 text-xs font-medium">90—100% Sangiovese</p><p className="mt-1 text-[10px] leading-4 text-[color:var(--muted)]">Maximum 10% from: {chiantiClassicoGranSelezioneGrapes.join(", ")}.</p></div>
      </div>
      <div className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3">
        <div className="flex items-baseline justify-between gap-3"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-[color:var(--foreground)]">Permitted complementary red grapes</p><span className="shrink-0 font-mono text-[8px] text-[color:var(--muted)]">{chiantiClassicoComplementaryRedGrapes.length} varieties</span></div>
        <ul className="mt-3 grid max-h-64 grid-cols-2 gap-x-3 gap-y-1.5 overflow-y-auto pr-2 sm:grid-cols-3">
          {chiantiClassicoComplementaryRedGrapes.map((grape) => <li key={grape} className="border-b border-[color:var(--line)] pb-1 text-[9px] leading-4 text-[color:var(--muted)]">{grape}</li>)}
        </ul>
        <p className="mt-3 text-[9px] leading-4 text-[color:var(--muted)]">Legal permission is not evidence of common use. The list answers what may be planted and blended, not what is typical in the glass.</p>
      </div>
    </div>
  );
}

function ReferenceProducers({ region }: { region: Region }) {
  const producers = referenceProducers.filter((producer) => producer.regionId === region.id);

  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between gap-3"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[color:var(--sage)]">Three comparative anchors</p><span className="text-[8px] text-[color:var(--muted)]">Editorial selection · not a ranking</span></div>
      <div className="mt-3 space-y-2">
        {producers.map((producer, index) => (
          <article key={producer.name} className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3">
            <div className="flex items-start gap-3">
              <span className="font-mono text-[9px] text-[color:var(--oxidised-gold)]">0{index + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><a href={producer.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium hover:text-[color:var(--limestone)] hover:underline">{producer.name}<ArrowUpRight size={10} /></a><span className="font-mono text-[8px] uppercase tracking-[.08em] text-[color:var(--muted)]">{producer.lens}</span></div>
                <p className="mt-2 text-[10px] leading-4 text-[color:var(--muted)]">{producer.editorialNote}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MolecularFingerprint({ layer, signals: signalLibrary, expressionId, claims, sources }: { layer: MolecularLayer; signals: readonly MolecularSignal[]; expressionId?: string; claims: Claim[]; sources: Source[] }) {
  const signals = signalLibrary.filter((signal) => signal.layer === layer && (!expressionId || !signal.expressionIds || signal.expressionIds.includes(expressionId)));
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>(signals[0]?.id);
  const selectedSignal = signals.find((signal) => signal.id === selectedSignalId) ?? signals[0];
  const claim = claims.find((candidate) => candidate.id === selectedSignal?.claimId);
  const source = sources.find((candidate) => claim?.sourceIds.includes(candidate.id));
  if (!selectedSignal) return null;

  return <div className="mt-5"><div className="flex items-center justify-between gap-2"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">{layer === "chemistry" ? "Volatile + precursor library" : "Pigment + tannin architecture"}</p><span className="font-mono text-[9px] text-[color:var(--muted)]">{signals.length} signals</span></div><div className="mt-3 grid grid-cols-2 gap-2">{signals.map((signal) => <button key={signal.id} onClick={() => setSelectedSignalId(signal.id)} className={`min-w-0 rounded-md border px-3 py-2 text-left transition ${signal.id === selectedSignal.id ? "border-[color:var(--oxidised-gold)]/60 bg-[color:var(--oxidised-gold)]/10" : "border-[color:var(--line)] bg-black/10 hover:bg-white/[.035]"}`}><span className="block truncate text-[12px] font-medium text-[color:var(--foreground)]">{signal.name}</span><span className="mt-1 block truncate font-mono text-[8px] uppercase tracking-[.06em] text-[color:var(--muted)]"><TechnicalLabel label={signal.family} /></span></button>)}</div><div className="mt-3 rounded-lg border border-[color:var(--line)] bg-black/15 p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-[15px] font-medium">{selectedSignal.name}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[.08em] text-[color:var(--oxidised-gold)]"><TechnicalLabel label={selectedSignal.stage} /></p></div>{claim && <span className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase ${confidenceTone(claim.confidence)}`}>{claim.confidence}</span>}</div><p className="mt-3 text-[13px] leading-5 text-[color:var(--foreground)]/85">{selectedSignal.teachingRole}</p>{claim?.evidence.caveat && <p className="mt-3 border-l border-[color:var(--line)] pl-3 text-[11px] leading-5 text-[color:var(--muted)]">{claim.evidence.caveat}</p>}{source && <a href={source.url} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1 text-[10px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={10} /></a>}</div></div>;
}

function TechnicalLabel({ label }: { label: string }) {
  const matchingTerm = Object.keys(glossary).find((term) => label.toLowerCase().includes(term.toLowerCase()));
  return matchingTerm ? <GlossaryTerm term={matchingTerm}>{label}</GlossaryTerm> : <>{label}</>;
}

function Evidence({ claims, sources }: { claims: Claim[]; sources: Source[] }) {
  return <div className="mt-6"><div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--muted)]">Evidence trail</p><BookOpen size={14} className="text-[color:var(--oxidised-gold)]" /></div><div className="mt-3 space-y-2">{claims.map((claim) => <div key={claim.id} className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-5">{claim.title}</p><span className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase ${confidenceTone(claim.confidence)}`}>{claim.confidence}</span></div><p className="mt-1 text-[11px] leading-4 text-[color:var(--muted)]">{claim.statement}</p></div>)}</div><div className="mt-3 flex flex-wrap gap-2">{sources.slice(0, 2).map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={10} /></a>)}</div></div>;
}

function EvidenceGap({ tab, expression }: { tab: ProfileTabId; expression?: WineExpression }) {
  return <div className="mt-6 rounded-lg border border-dashed border-[color:var(--line)] p-3"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[color:var(--muted)]">Evidence gap</p><p className="mt-2 text-[11px] leading-5 text-[color:var(--muted)]">No verified {tab} claims are attached to {expression?.label ?? "this expression"} in the demo corpus yet. Place evidence is not substituted.</p></div>;
}

function ComparisonSheet({ barolo, chianti, onClose }: { barolo: Region; chianti: Region; onClose: () => void }) {
  const ids = ["colour", "acidity", "tannin", "body"] as const;
  return <section className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-5xl rounded-t-2xl border border-b-0 border-[color:var(--line)] bg-[#171713]/95 p-5 shadow-2xl backdrop-blur md:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[color:var(--garnet)]">Head to head</p><h2 className="mt-1 font-serif text-2xl">Barolo <span className="text-[color:var(--muted)]">vs</span> Chianti Classico</h2></div><button onClick={onClose} className="rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs text-[color:var(--muted)]">Close</button></div><p className="mt-2 text-sm text-[color:var(--muted)]">Archetypes, not laboratory measurements. Ranges make variation visible.</p><div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">{ids.map((id) => { const a = barolo.archetype.metrics.find((metric) => metric.id === id); const b = chianti.archetype.metrics.find((metric) => metric.id === id); if (!a || !b) return null; return <div key={id}><div className="flex justify-between text-xs"><span>{a.label}</span><span className="text-[color:var(--muted)]">1—5</span></div><Range label={barolo.name} range={a} colour="var(--garnet)" /><Range label={chianti.name} range={b} colour="var(--oxidised-gold)" /></div>; })}</div><div className="mt-5 grid gap-3 border-t border-[color:var(--line)] pt-4 md:grid-cols-2"><Insight region={barolo} /><Insight region={chianti} /></div></section>;
}

function Range({ label, range, colour }: { label: string; range: Region["archetype"]["metrics"][number]; colour: string }) { const left = (range.min - 1) * 25; const width = Math.max((range.max - range.min) * 25, 6); return <div className="mt-2 grid grid-cols-[92px_1fr] items-center gap-2"><span className="truncate text-[10px] text-[color:var(--muted)]">{label}</span><div className="relative h-2 rounded-full bg-white/[.08]"><span className="absolute top-0 h-2 rounded-full" style={{ left: `${left}%`, width: `${width}%`, backgroundColor: colour }} /></div></div>; }

function Insight({ region }: { region: Region }) { return <div className="rounded-lg bg-white/[.035] p-3"><p className="text-xs font-medium">{region.name}</p><p className="mt-1 text-[11px] leading-5 text-[color:var(--muted)]">{region.archetype.cues.slice(0, 2).join(" · ")}</p></div>; }

function ChallengeCard({ challenge, answer, onAnswer, claims, sources }: { challenge: Challenge; answer: boolean | null; onAnswer: (answer: boolean) => void; claims: Claim[]; sources: Source[] }) { const relevant = claims.filter((claim) => challenge.claimIds.includes(claim.id)); const sourceIds = new Set(relevant.flatMap((claim) => claim.sourceIds)); const relevantSources = sources.filter((source) => sourceIds.has(source.id)); const revealed = answer !== null; return <section className="mx-auto mb-12 max-w-[760px] px-5"><div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6"><div className="flex gap-3"><CircleHelp className="mt-0.5 shrink-0 text-[color:var(--oxidised-gold)]" size={20} /><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--oxidised-gold)]">Evidence challenge</p><h2 className="mt-2 font-serif text-xl">{challenge.question}</h2></div></div>{!revealed ? <div className="mt-5 flex gap-2"><button onClick={() => onAnswer(true)} className="rounded-lg border border-[color:var(--line)] px-4 py-2 text-sm hover:bg-white/5">Yes</button><button onClick={() => onAnswer(false)} className="rounded-lg border border-[color:var(--line)] px-4 py-2 text-sm hover:bg-white/5">No</button></div> : <div className="mt-5 rounded-xl border border-[color:var(--line)] bg-black/10 p-4"><p className="text-sm font-medium" style={{ color: answer === challenge.answer ? "var(--sage)" : "var(--garnet)" }}>{answer === challenge.answer ? "Correct." : `Not quite — ${challenge.answerLabel}.`}</p><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{challenge.explanation}</p>{relevant.map((claim) => <p key={claim.id} className="mt-3 border-l-2 border-[color:var(--oxidised-gold)] pl-3 text-xs text-[color:var(--limestone)]">{claim.evidence.locator}</p>)}<div className="mt-3 flex flex-wrap gap-2">{relevantSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={10} /></a>)}</div></div>}</div></section>; }

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) { return <button onClick={onClick} className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium transition sm:text-xs ${active ? "bg-[color:var(--oxidised-gold)] text-[color:var(--background)]" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}>{label}</button>; }
