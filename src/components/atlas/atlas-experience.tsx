"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  CircleHelp,
  FlaskConical,
  MapPinned,
  Scale,
  ShieldCheck,
  Sparkles,
  Wine,
} from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { demoFallbacks } from "@/data/demo-fallback";
import type { Challenge, Claim, Region, RegionId, Source } from "@/lib/schemas";

type AtlasExperienceProps = {
  regions: Region[];
  claims: Claim[];
  sources: Source[];
  challenges: Challenge[];
};

const layers = [
  { id: "geology", label: "Geology", icon: MapPinned, colour: "var(--ponca)" },
  { id: "chemistry", label: "Chemistry", icon: Atom, colour: "var(--oxidised-gold)" },
  { id: "phenolics", label: "Phenolics", icon: FlaskConical, colour: "var(--garnet)" },
  { id: "palate", label: "Palate", icon: Wine, colour: "var(--sage)" },
  { id: "rules", label: "Rules", icon: ShieldCheck, colour: "var(--limestone)" },
] as const;

type LayerId = (typeof layers)[number]["id"];

const countryLabel = { IT: "Italy", FR: "France" } as const;

function confidenceTone(confidence: Claim["confidence"]) {
  return confidence === "high"
    ? "border-[color:var(--sage)]/40 bg-[color:var(--sage)]/10 text-[color:var(--sage)]"
    : confidence === "medium"
      ? "border-[color:var(--oxidised-gold)]/40 bg-[color:var(--oxidised-gold)]/10 text-[color:var(--oxidised-gold)]"
      : "border-white/15 bg-white/5 text-[color:var(--muted)]";
}

function claimMatchesLayer(claim: Claim, layer: LayerId) {
  if (layer === "rules") return claim.claimType === "legal";
  if (layer === "geology") {
    return claim.claimType === "geology" || claim.id === "barolo-site-before-style";
  }
  if (layer === "palate") {
    return ["editorial_interpretation", "common_practice", "historical_practice"].includes(claim.claimType);
  }
  return claim.claimType === "measured" || claim.claimType === "published_association";
}

export function AtlasExperience({ regions, claims, sources, challenges }: AtlasExperienceProps) {
  const [activeLayer, setActiveLayer] = useState<LayerId>("geology");
  const [selectedId, setSelectedId] = useState<RegionId>("barolo");
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
  const layerClaims = useMemo(() => {
    const relevant = selectedClaims.filter((claim) => claimMatchesLayer(claim, activeLayer));
    return relevant.length > 0 ? relevant : selectedClaims;
  }, [activeLayer, selectedClaims]);
  const selectedSources = useMemo(() => {
    const ids = new Set(layerClaims.flatMap((claim) => claim.sourceIds));
    return sources.filter((source) => ids.has(source.id));
  }, [layerClaims, sources]);
  const activeChallenge = challenges.find((challenge) => challenge.regionId === selected?.id) ?? challenges[0];
  const barolo = regions.find((region) => region.id === "barolo");
  const chianti = regions.find((region) => region.id === "chianti-classico");

  if (!selected || !activeChallenge || !barolo || !chianti) return null;

  const active = layers.find((layer) => layer.id === activeLayer) ?? layers[0];
  const synthesisPrompt = mode === "sol"
    ? "How do Barolo and Chianti Classico diverge when colour, tannin, geology and legal constraints are considered together?"
    : "Explain why Barolo can look pale but feel so tannic.";
  const latestAnswer = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
  const fallbackAnswer = error
    ? demoFallbacks.find((fallback) => fallback.id === (mode === "sol" ? "compare-barolo-chianti" : "explain-anthocyanins"))?.answer
    : undefined;
  const isGenerating = status === "submitted" || status === "streaming";

  return (
    <main className="min-h-screen overflow-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 md:px-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--oxidised-gold)]">Somm Atlas / Field study 01</p>
          <h1 className="mt-1 font-serif text-2xl tracking-tight md:text-3xl">The chemistry of place.</h1>
        </div>
        <div className="hidden items-center gap-2 text-xs text-[color:var(--muted)] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[color:var(--sage)]" /> Cited learning corpus
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-4 px-5 pb-10 md:px-8 xl:grid-cols-[176px_minmax(0,1fr)_390px]">
        <nav aria-label="Atlas layers" className="flex gap-2 overflow-x-auto xl:flex-col xl:overflow-visible">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const selectedLayer = activeLayer === layer.id;
            return (
              <button key={layer.id} onClick={() => setActiveLayer(layer.id)} className={`group flex shrink-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${selectedLayer ? "border-[color:var(--line)] bg-[color:var(--panel-soft)]" : "border-transparent text-[color:var(--muted)] hover:bg-white/[0.035]"}`}>
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ backgroundColor: `${layer.colour}20`, color: layer.colour }}><Icon size={16} /></span>
                <span><span className="block text-sm font-medium text-[color:var(--foreground)]">{layer.label}</span><span className="hidden text-[10px] uppercase tracking-wider text-[color:var(--muted)] xl:block">Explore signals</span></span>
              </button>
            );
          })}
        </nav>

        <section className="relative min-h-[580px] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[radial-gradient(ellipse_at_50%_40%,#29251f_0%,#171713_45%,#11110f_77%)] p-5 md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(242,234,219,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(242,234,219,.06)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative flex items-start justify-between gap-4">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: active.colour }}>{active.label} layer</p><p className="mt-1 max-w-md text-sm text-[color:var(--muted)]">Select a region to trace the evidence from place to the glass.</p></div>
            <button onClick={() => setComparisonOpen((open) => !open)} className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-black/10 px-3 py-2 text-xs transition hover:bg-white/5"><Scale size={14} className="text-[color:var(--oxidised-gold)]" /> Barolo / Chianti</button>
          </div>

          <div className="relative mx-auto mt-2 h-[450px] max-w-3xl">
            <div aria-hidden className="absolute left-[7%] top-[3%] h-[84%] w-[44%] bg-[color:var(--limestone)] opacity-20 [mask:url('/maps/france.svg')_center/contain_no-repeat]" />
            <div aria-hidden className="absolute right-[7%] top-[1%] h-[94%] w-[45%] bg-[color:var(--ponca)] opacity-25 [mask:url('/maps/italy.svg')_center/contain_no-repeat]" />
            <div className="absolute left-[17%] top-[18%] font-mono text-[10px] tracking-[.24em] text-[color:var(--limestone)]/70">FRANCE</div>
            <div className="absolute right-[14%] top-[15%] font-mono text-[10px] tracking-[.24em] text-[color:var(--ponca)]/70">ITALY</div>
            {regions.map((region) => <Hotspot key={region.id} region={region} active={selected.id === region.id} colour={active.colour} onSelect={() => { setSelectedId(region.id); setChallengeAnswer(null); }} />)}
          </div>
          <div className="relative mt-auto flex items-center justify-between border-t border-[color:var(--line)] pt-4 text-[11px] text-[color:var(--muted)]"><span>Four study regions · {active.label.toLowerCase()} evidence</span><span>Not to scale</span></div>
        </section>

        <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6 xl:row-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: active.colour }}>{selected.eyebrow}</p>
          <div className="mt-2 flex items-start justify-between gap-3"><div><h2 className="font-serif text-3xl tracking-tight">{selected.name}</h2><p className="mt-1 text-sm text-[color:var(--muted)]">{selected.location} · {countryLabel[selected.country]}</p></div><span className="rounded-full border border-[color:var(--line)] px-2 py-1 font-mono text-[9px] tracking-wider text-[color:var(--muted)]">{selected.entityType.replace("_", " ")}</span></div>
          <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">{selected.summary}</p>

          <div className="mt-6 border-y border-[color:var(--line)] py-4"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--muted)]">{active.label} signal</p><p className="mt-2 text-sm leading-6">{selected.layerHighlights[activeLayer]}</p>{selected.id === "barolo" && activeLayer === "geology" && <BaroloSiteModel />}</div>
          <div className="mt-5"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--muted)]">Primary grapes</p><div className="mt-2 flex flex-wrap gap-2">{selected.grapes.map((grape) => <span key={grape} className="rounded-full bg-white/[.06] px-2.5 py-1 text-xs">{grape}</span>)}</div></div>

          <Evidence claims={layerClaims.slice(0, 2)} sources={selectedSources} />
        </aside>

        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6 xl:col-span-2">
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

function Hotspot({ region, active, colour, onSelect }: { region: Region; active: boolean; colour: string; onSelect: () => void }) {
  return <button aria-label={`Explore ${region.name}`} onClick={onSelect} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: `${region.map.countryX}%`, top: `${region.map.countryY}%` }}><span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/40 bg-[#11110f] shadow-[0_0_0_5px_rgba(17,17,15,.7)]"><span className={`h-2 w-2 rounded-full ${active ? "animate-pulse" : ""}`} style={{ backgroundColor: colour }} /></span><span className={`absolute left-4 top-1/2 w-max -translate-y-1/2 rounded-md border border-[color:var(--line)] bg-[#171713]/95 px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{region.name}</span></button>;
}

function BaroloSiteModel() {
  const factors = ["Formation", "Soil evolution", "Slope + elevation", "Exposure + microclimate", "Bounded hypothesis"];
  return <div className="mt-4"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[color:var(--oxidised-gold)]">Site before style</p><ol className="mt-2 grid grid-cols-2 gap-1.5">{factors.map((factor, index) => <li key={factor} className={`rounded-md border border-[color:var(--line)] bg-black/10 px-2 py-1.5 text-[10px] leading-4 ${index === factors.length - 1 ? "col-span-2 text-[color:var(--sage)]" : "text-[color:var(--muted)]"}`}><span className="mr-1.5 font-mono text-[color:var(--oxidised-gold)]">{index + 1}</span>{factor}</li>)}</ol></div>;
}

function Evidence({ claims, sources }: { claims: Claim[]; sources: Source[] }) {
  return <div className="mt-6"><div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--muted)]">Evidence trail</p><BookOpen size={14} className="text-[color:var(--oxidised-gold)]" /></div><div className="mt-3 space-y-2">{claims.map((claim) => <div key={claim.id} className="rounded-lg border border-[color:var(--line)] bg-black/10 p-3"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-5">{claim.title}</p><span className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase ${confidenceTone(claim.confidence)}`}>{claim.confidence}</span></div><p className="mt-1 text-[11px] leading-4 text-[color:var(--muted)]">{claim.learnerNote}</p></div>)}</div><div className="mt-3 flex flex-wrap gap-2">{sources.slice(0, 2).map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={10} /></a>)}</div></div>;
}

function ComparisonSheet({ barolo, chianti, onClose }: { barolo: Region; chianti: Region; onClose: () => void }) {
  const ids = ["colour", "acidity", "tannin", "body"] as const;
  return <section className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-5xl rounded-t-2xl border border-b-0 border-[color:var(--line)] bg-[#171713]/95 p-5 shadow-2xl backdrop-blur md:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[color:var(--garnet)]">Head to head</p><h2 className="mt-1 font-serif text-2xl">Barolo <span className="text-[color:var(--muted)]">vs</span> Chianti Classico</h2></div><button onClick={onClose} className="rounded-full border border-[color:var(--line)] px-3 py-1.5 text-xs text-[color:var(--muted)]">Close</button></div><p className="mt-2 text-sm text-[color:var(--muted)]">Archetypes, not laboratory measurements. Ranges make variation visible.</p><div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">{ids.map((id) => { const a = barolo.archetype.metrics.find((metric) => metric.id === id); const b = chianti.archetype.metrics.find((metric) => metric.id === id); if (!a || !b) return null; return <div key={id}><div className="flex justify-between text-xs"><span>{a.label}</span><span className="text-[color:var(--muted)]">1—5</span></div><Range label={barolo.name} range={a} colour="var(--garnet)" /><Range label={chianti.name} range={b} colour="var(--oxidised-gold)" /></div>; })}</div><div className="mt-5 grid gap-3 border-t border-[color:var(--line)] pt-4 md:grid-cols-2"><Insight region={barolo} /><Insight region={chianti} /></div></section>;
}

function Range({ label, range, colour }: { label: string; range: Region["archetype"]["metrics"][number]; colour: string }) { const left = (range.min - 1) * 25; const width = Math.max((range.max - range.min) * 25, 6); return <div className="mt-2 grid grid-cols-[92px_1fr] items-center gap-2"><span className="truncate text-[10px] text-[color:var(--muted)]">{label}</span><div className="relative h-2 rounded-full bg-white/[.08]"><span className="absolute top-0 h-2 rounded-full" style={{ left: `${left}%`, width: `${width}%`, backgroundColor: colour }} /></div></div>; }

function Insight({ region }: { region: Region }) { return <div className="rounded-lg bg-white/[.035] p-3"><p className="text-xs font-medium">{region.name}</p><p className="mt-1 text-[11px] leading-5 text-[color:var(--muted)]">{region.archetype.cues.slice(0, 2).join(" · ")}</p></div>; }

function ChallengeCard({ challenge, answer, onAnswer, claims, sources }: { challenge: Challenge; answer: boolean | null; onAnswer: (answer: boolean) => void; claims: Claim[]; sources: Source[] }) { const relevant = claims.filter((claim) => challenge.claimIds.includes(claim.id)); const sourceIds = new Set(relevant.flatMap((claim) => claim.sourceIds)); const relevantSources = sources.filter((source) => sourceIds.has(source.id)); const revealed = answer !== null; return <section className="mx-auto mb-12 max-w-[760px] px-5"><div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 md:p-6"><div className="flex gap-3"><CircleHelp className="mt-0.5 shrink-0 text-[color:var(--oxidised-gold)]" size={20} /><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[color:var(--oxidised-gold)]">Evidence challenge</p><h2 className="mt-2 font-serif text-xl">{challenge.question}</h2></div></div>{!revealed ? <div className="mt-5 flex gap-2"><button onClick={() => onAnswer(true)} className="rounded-lg border border-[color:var(--line)] px-4 py-2 text-sm hover:bg-white/5">Yes</button><button onClick={() => onAnswer(false)} className="rounded-lg border border-[color:var(--line)] px-4 py-2 text-sm hover:bg-white/5">No</button></div> : <div className="mt-5 rounded-xl border border-[color:var(--line)] bg-black/10 p-4"><p className="text-sm font-medium" style={{ color: answer === challenge.answer ? "var(--sage)" : "var(--garnet)" }}>{answer === challenge.answer ? "Correct." : `Not quite — ${challenge.answerLabel}.`}</p><p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{challenge.explanation}</p>{relevant.map((claim) => <p key={claim.id} className="mt-3 border-l-2 border-[color:var(--oxidised-gold)] pl-3 text-xs text-[color:var(--limestone)]">{claim.evidence.locator}</p>)}<div className="mt-3 flex flex-wrap gap-2">{relevantSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-[color:var(--limestone)] hover:underline">{source.publisher}<ArrowUpRight size={10} /></a>)}</div></div>}</div></section>; }

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) { return <button onClick={onClick} className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium transition sm:text-xs ${active ? "bg-[color:var(--foreground)] text-[color:var(--background)]" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"}`}>{label}</button>; }
