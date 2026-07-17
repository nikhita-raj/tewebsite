import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { formatShort } from "@/components/ProjectCard";

/**
 * Gartner-style Magic Quadrant
 *  X axis — Ability to Execute  (derived from status + weeklyHours)
 *  Y axis — Completeness of Vision (derived from scalable + annualSavings + priority)
 */
function score(p: Project) {
  const statusWeight: Record<string, number> = { Live: 0.9, "In Progress": 0.6, "In Discovery": 0.35, Planned: 0.2 };
  const prioWeight: Record<string, number> = { Critical: 0.95, High: 0.75, Medium: 0.5, Standard: 0.3 };
  const maxHours = Math.max(...projects.map((x) => x.weeklyHours), 1);
  const maxVal = Math.max(...projects.map((x) => x.annualSavings), 1);
  const x = 0.15 + 0.55 * (statusWeight[p.status] ?? 0.3) + 0.30 * (p.weeklyHours / maxHours);
  const y = 0.15 + 0.50 * (p.annualSavings / maxVal) + 0.25 * (prioWeight[p.priority] ?? 0.3) + 0.10 * (p.scalable ? 1 : 0);
  return { x: Math.min(0.95, Math.max(0.05, x)), y: Math.min(0.95, Math.max(0.05, y)) };
}

const catColor: Record<string, string> = {
  AI: "var(--viz-ai)",
  Automation: "var(--viz-automation)",
  Analytics: "var(--viz-analytics)",
  "Digital Transformation": "var(--viz-digital)",
};

export function GartnerQuadrant({ compact = false }: { compact?: boolean }) {
  const [hover, setHover] = useState<Project | null>(null);
  const points = useMemo(() => projects.map((p) => ({ p, ...score(p) })), []);

  return (
    <div className={`rounded-3xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur ${compact ? "p-4" : "p-6"} shadow-lg` }
      style={{ boxShadow: "0 0 40px rgba(34, 211, 238, 0.2)" }}>
      {!compact && (
        <header className="mb-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300 font-semibold">Magic Quadrant</div>
          <h2 className="font-display font-bold text-2xl mt-1 text-white">Portfolio Positioning</h2>
          <p className="text-cyan-200/70 mt-2 text-xs max-w-2xl">Initiatives plotted by Ability to Execute vs. Completeness of Vision</p>
        </header>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap text-[10px]">
        {Object.entries(catColor).map(([k, c]) => (
          <span key={k} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${c})`, boxShadow: `0 0 6px hsl(${c})` }} />
            <span className="font-semibold text-cyan-200 text-[9px]">{k}</span>
          </span>
        ))}
      </div>

      <div className="relative aspect-[14/10] w-full">
        {/* Quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <Quadrant title="Challengers" subtitle="Strong execution" align="tl" />
          <Quadrant title="Leaders" subtitle="Execute + Vision" align="tr" highlight />
          <Quadrant title="Niche" subtitle="Limited execution" align="bl" />
          <Quadrant title="Visionaries" subtitle="Bold vision" align="br" />
        </div>

        {/* Axis lines */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-cyan-500/40" />
        <div className="absolute left-2 right-2 bottom-2 h-px bg-cyan-500/40" />
        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-purple-500/20 border-l border-dashed border-purple-500/30" />
        <div className="absolute left-2 right-2 top-1/2 h-px bg-purple-500/20 border-t border-dashed border-purple-500/30" />
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-widest text-cyan-300/70 font-semibold -rotate-90 origin-right" style={{ right: "100%", whiteSpace: "nowrap" }}>Vision</div>
        <div className="absolute bottom-1 left-1/2 text-[8px] uppercase tracking-widest text-cyan-300/70 font-semibold">Execution</div>

        {/* Points */}
        {points.map(({ p, x, y }, i) => (
          <motion.button
            key={p.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.min(i, 30) * 0.015, type: "spring", stiffness: 200, damping: 18 }}
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${x * 100}%`, top: `${(1 - y) * 100}%` }}
          >
            <Link to={`/projects/${p.id}`}>
              <span
                className="block rounded-full ring-2 ring-slate-900/80 transition group-hover:scale-140"
                style={{
                  width: 8 + Math.min(16, Math.log10(p.annualSavings + 10) * 2.5),
                  height: 8 + Math.min(16, Math.log10(p.annualSavings + 10) * 2.5),
                  background: `hsl(${catColor[p.category] ?? "var(--primary)"})`,
                  boxShadow: `0 0 12px hsl(${catColor[p.category] ?? "var(--primary)"} / 0.6)`,
                }}
              />
            </Link>
          </motion.button>
        ))}
      </div>

      {/* Tooltip */}
      <div className="mt-4 min-h-[64px] rounded-lg border border-purple-500/30 bg-purple-900/25 backdrop-blur px-4 py-3 flex items-center gap-4">
        {hover ? (
          <>
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${catColor[hover.category]})`, boxShadow: `0 0 10px hsl(${catColor[hover.category]})` }} />
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold truncate text-white text-sm">{hover.name}</div>
              <div className="text-[11px] text-cyan-200/70">{hover.category} · {hover.region} · {hover.status}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-num font-bold text-white">${formatShort(hover.annualSavings)}</div>
              <div className="text-[9px] uppercase text-cyan-300/60">value/yr</div>
            </div>
          </>
        ) : (
          <span className="text-[12px] text-cyan-200/70 inline-flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Hover to inspect</span>
        )}
      </div>
    </div>
  );
}

function Quadrant({ title, subtitle, align, highlight }: { title: string; subtitle: string; align: "tl" | "tr" | "bl" | "br"; highlight?: boolean }) {
  const pos = align === "tl" ? "items-start justify-start text-left" :
              align === "tr" ? "items-start justify-end text-right" :
              align === "bl" ? "items-end justify-start text-left" :
                               "items-end justify-end text-right";
  return (
    <div className={`relative border p-3 flex ${pos} ${highlight ? "border-green-500/50 bg-green-900/15" : "border-cyan-500/30 bg-slate-800/25"}`}>
      <div>
        <div className={`text-[9px] uppercase tracking-widest font-bold ${highlight ? "text-green-300" : "text-cyan-300"}`}>{title}</div>
        <div className={`text-[9px] leading-tight mt-0.5 ${highlight ? "text-green-200/70" : "text-cyan-200/60"}`}>{subtitle}</div>
      </div>
    </div>
  );
}
