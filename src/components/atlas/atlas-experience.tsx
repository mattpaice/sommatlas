"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  CircleHelp,
  MapPinned,
  Palette,
  Scale,
  ShieldCheck,
  Sparkles,
  Wine,
} from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { demoFallbacks } from "@/data/demo-fallback";
import { mapContextPoints, type MapContextPoint } from "@/data/map-context";
import { baroloMolecularSignals, type MolecularLayer } from "@/data/molecular-signals";
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
  { id: "place", label: "Place", icon: MapPinned, colour: "var(--ponca)" },
  { id: "chemistry", label: "Chemistry", icon: Atom, colour: "var(--oxidised-gold)" },
  { id: "structure", label: "Structure", icon: Wine, colour: "var(--garnet)" },
  { id: "rules", label: "Rules", icon: ShieldCheck, colour: "var(--limestone)" },
] as const;

type ProfileTabId = (typeof profileTabs)[number]["id"];

const themes = [
  { id: "harvest", label: "Harvest", note: "Plum & saffron", swatches: ["#dc6d55", "#e0ae48", "#98aa6f"] },
  { id: "cellar", label: "Cellar", note: "Garnet & copper", swatches: ["#ad4058", "#c57b48", "#8c9a70"] },
  { id: "atlas", label: "Atlas", note: "Ink & mineral", swatches: ["#3ea8a0", "#e27d58", "#d9b85f"] },
] as const;

type ThemeId = (typeof themes)[number]["id"];

const countryLabel = { IT: "Italy", FR: "France" } as const;

function confidenceTone(confidence: Claim["confidence"]) {
  return confidence === "high"
    ? "border-[color:var(--sage)]/40 bg-[color:var(--sage)]/10 text-[color:var(--sage)]"
    : confidence === "medium"
      ? "border-[color:var(--oxidised-gold)]/40 bg-[color:var(--oxidised-gold)]/10 text-[color:var(--oxidised-gold)]"
      : "border-white/15 bg-white/5 text-[color:var(--muted)]";
}

function claimMatchesTab(claim: Claim, tab: ProfileTabId) {
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
  const [activeTab, setActiveTab] = useState<ProfileTabId>("place");
  const [theme, setTheme] = useState<ThemeId>("harvest");
  const [selectedId, setSelectedId] = useState<RegionId>("barolo");
  const [focusedContextId, setFocusedContextId] = useState<MapContextPoint["id"] | null>(null);
  const [activeMapTooltipId, setActiveMapTooltipId] = useState<string | null>(null);
  const [expressionId, setExpressionId] = useState("barolo-nebbiolo");
  const [comparisonOpen, setComparisonOpen] = useState(false);
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
      return;
    }
    setFocusedContextId(id as MapContextPoint["id"]);
    setActiveMapTooltipId(null);
  }

  function selectRegion(regionId: RegionId) {
    const firstExpression = wineExpressions.find((expression) => expression.regionId === regionId);
    setSelectedId(regionId);
    if (firstExpression) setExpressionId(firstExpression.id);
    setFocusedContextId(null);
    setActiveMapTooltipId(null);
    setChallengeAnswer(null);
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
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[.3em] text-[color:var(--brand-secondary)]">The interactive wine atlas</span>
              <span className="h-px min-w-6 flex-1 bg-[color:var(--line-strong)]" aria-hidden />
            </div>
            <p className="font-wordmark -mb-1 mt-[-2px] text-[3.45rem] leading-none text-[color:var(--foreground)] drop-shadow-[0_8px_18px_var(--brand-primary)] md:text-[4.15rem]">SommAtlas</p>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-secondary),transparent)]" aria-hidden />
              <h1 className="text-[10px] uppercase tracking-[.19em] text-[color:var(--muted)]">Bedrock to glass</h1>
              <span className="text-[color:var(--brand-secondary)]" aria-hidden>◆</span>
            </div>
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

      <div className="mx-auto grid max-w-[1500px] gap-4 px-5 pb-10 md:px-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="relative min-h-[580px] overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-[image:var(--map-background)] p-5 shadow-[0_24px_80px_-45px_var(--brand-primary)] md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(242,234,219,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(242,234,219,.06)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative flex items-start justify-between gap-4">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: active.colour }}>Geographic index</p><p className="mt-1 max-w-md text-sm text-[color:var(--muted)]">Select a place, then examine one wine expression at a time.</p></div>
            <button onClick={() => setComparisonOpen((open) => !open)} className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-black/10 px-3 py-2 text-xs transition hover:bg-white/5"><Scale size={14} className="text-[color:var(--oxidised-gold)]" /> Barolo / Chianti</button>
          </div>

          <div className="relative mx-auto mt-1 h-[450px] max-w-3xl">
            <CountryMap country="FR" className="left-[7%] top-[6%] w-[44%] aspect-square" maskClassName="bg-[color:var(--limestone)] opacity-20 [mask:url('/maps/france.svg')_center/100%_100%_no-repeat]" labelClassName="left-[25%] top-[17%] text-[color:var(--limestone)]/70" regions={regions} selectedId={selected.id} activeColour={active.colour} visibleTooltipId={activeMapTooltipId ?? (focusedContextId ? `context:${focusedContextId}` : null)} onTooltipChange={setActiveMapTooltipId} focusedContextId={focusedContextId} onContextFocus={setFocusedContextId} onSelect={selectRegion} />
            <CountryMap country="IT" className="right-[7%] top-[1%] h-[94%] aspect-[500/620]" maskClassName="bg-[color:var(--ponca)] opacity-25 [mask:url('/maps/italy.svg')_center/100%_100%_no-repeat]" labelClassName="right-[8%] top-[16%] text-[color:var(--ponca)]/70" regions={regions} selectedId={selected.id} activeColour={active.colour} visibleTooltipId={activeMapTooltipId ?? (focusedContextId ? `context:${focusedContextId}` : null)} onTooltipChange={setActiveMapTooltipId} focusedContextId={focusedContextId} onContextFocus={setFocusedContextId} onSelect={selectRegion} />
          </div>
          <div className="relative mt-auto flex flex-col gap-3 border-t border-[color:var(--line)] pt-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.14em] text-[color:var(--muted)]">
              Appellation index
              <select aria-label="Find an appellation on the map" value={mapIndexValue} onChange={(event) => navigateMapIndex(event.target.value)} className="max-w-[220px] rounded-md border border-[color:var(--line)] bg-[color:var(--panel)] px-2 py-1.5 font-sans text-xs normal-case tracking-normal text-[color:var(--foreground)] outline-none focus:border-[color:var(--oxidised-gold)]">
                <optgroup label="Featured studies">{regions.map((region) => <option key={region.id} value={`study:${region.id}`}>{region.name}</option>)}</optgroup>
                <optgroup label="Context appellations">{mapContextPoints.map((point) => <option key={point.id} value={`context:${point.id}`}>{point.label}</option>)}</optgroup>
              </select>
            </label>
            <span className="text-[10px] text-[color:var(--muted)]">Hover or focus a dot to identify it · representative points</span>
          </div>
        </section>

        <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6 xl:row-span-2">
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-3xl tracking-tight">{selected.name}</h2><p className="mt-1 text-sm text-[color:var(--muted)]">{selected.location} · {countryLabel[selected.country]}</p></div><span className="rounded-full border border-[color:var(--line)] px-2 py-1 font-mono text-[9px] tracking-wider text-[color:var(--muted)]">{selected.entityType.replace("_", " ")}</span></div>

          <ExpressionSelector region={selected} expressions={availableExpressions} selected={selectedExpression} onSelect={setExpressionId} />
          <ProfileTabs activeTab={activeTab} onSelect={setActiveTab} />
          <ProfilePanel region={selected} activeTab={activeTab} expression={selectedExpression} claims={claims} sources={sources} />
          {tabClaims.length > 0 ? <Evidence claims={tabClaims.slice(0, 2)} sources={selectedSources} /> : <EvidenceGap tab={activeTab} expression={selectedExpression} />}
        </aside>

        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[color:var(--oxidised-gold)]">Guided synthesis</p><h2 className="mt-1 font-serif text-2xl">Ask a better wine question.</h2></div><div className="flex rounded-lg border border-[color:var(--line)] p-1"><ModeButton active={mode === "sol"} onClick={() => setMode("sol")} label="Deep synthesis · Sol" /><ModeButton active={mode === "terra"} onClick={() => setMode("terra")} label="Quick tutor · Terra" /></div></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]"><div className="rounded-xl border border-dashed border-[color:var(--line)] bg-black/10 p-4"><p className="text-sm leading-6 text-[color:var(--muted)]">{synthesisPrompt}</p><p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted)]">Grounded in selected corpus · citations shown in result</p></div><button disabled={isGenerating} onClick={() => sendMessage({ text: synthesisPrompt })} className="flex items-center justify-center gap-2 rounded-xl bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--background)] transition hover:bg-[color:var(--limestone)] disabled:cursor-wait disabled:opacity-60"><Sparkles size={15} className={isGenerating ? "animate-pulse" : ""} /> {isGenerating ? "Tracing evidence…" : "Synthesize"}</button></div>
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
};

function CountryMap({ country, className, maskClassName, labelClassName, regions, selectedId, activeColour, visibleTooltipId, onTooltipChange, focusedContextId, onContextFocus, onSelect }: CountryMapProps) {
  const countryRegions = regions.filter((region) => region.country === country);

  return (
    <div className={`absolute overflow-visible ${className}`}>
      <div aria-hidden className={`absolute inset-0 ${maskClassName}`} />
      <div className={`pointer-events-none absolute font-mono text-[10px] tracking-[.24em] ${labelClassName}`}>{country === "FR" ? "FRANCE" : "ITALY"}</div>
      {country === "FR" && <ContextDots focusedId={focusedContextId} visibleTooltipId={visibleTooltipId} onTooltipChange={onTooltipChange} onFocus={onContextFocus} />}
      {countryRegions.map((region) => (
        <Hotspot key={region.id} region={region} active={selectedId === region.id} colour={activeColour} tooltipVisible={visibleTooltipId === `study:${region.id}`} onTooltipChange={onTooltipChange} onSelect={() => onSelect(region.id)} />
      ))}
    </div>
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
        <ExpressionField label="Place" value={region.name} />
        <ExpressionField label="Grape" value={selected.grape} database />
        <ExpressionField label="Vinification" value={selected.vinification} />
      </div>
    </section>
  );
}

function ExpressionField({ label, value, database = false }: { label: string; value: string; database?: boolean }) {
  return <div className="min-w-0 border-l border-[color:var(--line)] pl-2 first:border-l-0 first:pl-0"><p className="font-mono text-[8px] uppercase tracking-[.12em] text-[color:var(--muted)]">{label}</p><p className="mt-1 truncate text-[10px] font-medium text-[color:var(--foreground)]" title={value}>{value}</p>{database && <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[.08em] text-[color:var(--sage)]">Grape database</p>}</div>;
}

function ProfileTabs({ activeTab, onSelect }: { activeTab: ProfileTabId; onSelect: (tab: ProfileTabId) => void }) {
  return (
    <nav aria-label="Appellation evidence" className="mt-5 grid grid-cols-4 gap-1 border-b border-[color:var(--line)]" role="tablist">
      {profileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => onSelect(tab.id)} className={`flex min-w-0 flex-col items-center gap-1 border-b-2 px-1 py-2 text-[10px] transition ${isActive ? "border-[color:var(--brand-primary)] text-[color:var(--foreground)]" : "border-transparent text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}><Icon size={14} style={{ color: isActive ? tab.colour : undefined }} /><span className="truncate">{tab.label}</span></button>;
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
      {activeTab === "place" && <><SignalText>{region.layerHighlights.geology}</SignalText>{region.id === "barolo" && <BaroloSiteModel />}{region.id === "collio" && <MineralDecoder />}</>}
      {activeTab === "chemistry" && <><SignalText>{chemistryText}</SignalText>{region.id === "barolo" && <MolecularFingerprint layer="chemistry" claims={claims} sources={sources} />}</>}
      {activeTab === "structure" && <><SignalText>{region.layerHighlights.phenolics}</SignalText><p className="mt-2 text-[11px] leading-5 text-[color:var(--muted)]">{region.layerHighlights.palate}</p>{region.id === "barolo" && <MolecularFingerprint layer="phenolics" claims={claims} sources={sources} />}<StructureProfile region={region} /></>}
      {activeTab === "rules" && <SignalText>{region.layerHighlights.rules}</SignalText>}
    </section>
  );
}

function SignalText({ children }: { children: string }) {
  return <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{children}</p>;
}

function StructureProfile({ region }: { region: Region }) {
  const metrics = region.archetype.metrics.filter((metric) => ["colour", "acidity", "tannin", "body"].includes(metric.id));
  return <div className="mt-4"><div className="flex items-center justify-between gap-2"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[color:var(--oxidised-gold)]">Organoleptic structure</p><span className="text-[8px] text-[color:var(--muted)]">Editorial range · 1—5</span></div><div className="mt-3 space-y-3">{metrics.map((metric) => <div key={metric.id}><div className="flex items-center justify-between gap-2 text-[10px]"><span>{metric.label}</span><span className="text-[color:var(--muted)]">{metric.min}—{metric.max}</span></div><div className="relative mt-1 h-1.5 rounded-full bg-white/[.07]"><span className="absolute top-0 h-1.5 rounded-full bg-[color:var(--garnet)]" style={{ left: `${(metric.min - 1) * 25}%`, width: `${Math.max((metric.max - metric.min) * 25, 6)}%` }} /></div><p className="mt-1 text-[9px] leading-4 text-[color:var(--muted)]">{metric.descriptor}</p></div>)}</div></div>;
}

function BaroloSiteModel() {
  const factors = ["Formation", "Soil properties", "Water + root environment", "Slope + microclimate", "Vine response + farming", "Bounded hypothesis"];
  return <div className="mt-4"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">Site before style</p><ol className="mt-2 grid grid-cols-2 gap-1.5">{factors.map((factor, index) => <li key={factor} className={`rounded-md border border-[color:var(--line)] bg-black/10 px-2 py-1.5 text-[10px] leading-4 ${index === factors.length - 1 ? "col-span-2 text-[color:var(--sage)]" : "text-[color:var(--muted)]"}`}><span className="mr-1.5 font-mono text-[color:var(--oxidised-gold)]">{index + 1}</span>{factor}</li>)}</ol></div>;
}

function MineralDecoder() {
  const meanings = [
    { label: "Geological", note: "Crystalline compounds in rock and soil" },
    { label: "Nutritional", note: "Bioavailable elements used by the vine" },
    { label: "Sensory", note: "A metaphor whose cause is not specified" },
  ];
  return <div className="mt-4"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">Three meanings of mineral</p><div className="mt-2 space-y-1.5">{meanings.map((meaning) => <div key={meaning.label} className="grid grid-cols-[76px_1fr] gap-2 rounded-md border border-[color:var(--line)] bg-black/10 px-2 py-1.5 text-[10px] leading-4"><span className="font-medium text-[color:var(--foreground)]">{meaning.label}</span><span className="text-[color:var(--muted)]">{meaning.note}</span></div>)}</div></div>;
}

function MolecularFingerprint({ layer, claims, sources }: { layer: MolecularLayer; claims: Claim[]; sources: Source[] }) {
  const signals = baroloMolecularSignals.filter((signal) => signal.layer === layer);
  const [selectedSignalId, setSelectedSignalId] = useState(signals[0]?.id);
  const selectedSignal = signals.find((signal) => signal.id === selectedSignalId) ?? signals[0];
  const claim = claims.find((candidate) => candidate.id === selectedSignal?.claimId);
  const source = sources.find((candidate) => claim?.sourceIds.includes(candidate.id));
  if (!selectedSignal) return null;

  return <div className="mt-4"><div className="flex items-center justify-between gap-2"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">{layer === "chemistry" ? "Volatile + precursor library" : "Pigment + tannin architecture"}</p><span className="font-mono text-[8px] text-[color:var(--muted)]">{signals.length} signals</span></div><div className="mt-2 grid grid-cols-2 gap-1.5">{signals.map((signal) => <button key={signal.id} onClick={() => setSelectedSignalId(signal.id)} className={`min-w-0 rounded-md border px-2 py-1.5 text-left transition ${signal.id === selectedSignal.id ? "border-[color:var(--oxidised-gold)]/60 bg-[color:var(--oxidised-gold)]/10" : "border-[color:var(--line)] bg-black/10 hover:bg-white/[.035]"}`}><span className="block truncate text-[10px] font-medium text-[color:var(--foreground)]">{signal.name}</span><span className="mt-0.5 block truncate font-mono text-[8px] uppercase tracking-[.06em] text-[color:var(--muted)]">{signal.family}</span></button>)}</div><div className="mt-2 rounded-lg border border-[color:var(--line)] bg-black/15 p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-medium">{selectedSignal.name}</p><p className="mt-0.5 font-mono text-[8px] uppercase tracking-[.08em] text-[color:var(--oxidised-gold)]">{selectedSignal.stage}</p></div>{claim && <span className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase ${confidenceTone(claim.confidence)}`}>{claim.confidence}</span>}</div><p className="mt-2 text-[10px] leading-4 text-[color:var(--muted)]">{selectedSignal.teachingRole}</p>{claim?.evidence.caveat && <p className="mt-2 border-l border-[color:var(--line)] pl-2 text-[9px] leading-4 text-[color:var(--muted)]">{claim.evidence.caveat}</p>}{source && <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[9px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={9} /></a>}</div></div>;
}

function Evidence({ claims, sources }: { claims: Claim[]; sources: Source[] }) {
  return <div className="mt-6"><div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--muted)]">Evidence trail</p><BookOpen size={14} className="text-[color:var(--oxidised-gold)]" /></div><div className="mt-3 space-y-2">{claims.map((claim) => <div key={claim.id} className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-5">{claim.title}</p><span className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase ${confidenceTone(claim.confidence)}`}>{claim.confidence}</span></div><p className="mt-1 text-[11px] leading-4 text-[color:var(--muted)]">{claim.learnerNote}</p></div>)}</div><div className="mt-3 flex flex-wrap gap-2">{sources.slice(0, 2).map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={10} /></a>)}</div></div>;
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

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) { return <button onClick={onClick} className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium transition sm:text-xs ${active ? "bg-[color:var(--foreground)] text-[color:var(--background)]" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}>{label}</button>; }
