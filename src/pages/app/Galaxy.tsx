import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Grid3x3, Info } from "lucide-react";
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

export default function Galaxy() {
  const [hover, setHover] = useState<Project | null>(null);
  const points = useMemo(() => projects.map((p) => ({ p, ...score(p) })), []);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto dark-zone">
      <header className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold flex items-center gap-2">
          <Grid3x3 className="w-3.5 h-3.5" /> Gartner Quadrant
        </div>
        <h1 className="font-display font-bold text-3xl mt-1 text-white">Magic Quadrant — Portfolio Positioning</h1>
        <p className="text-cyan-200/70 mt-2 text-sm max-w-2xl">
          Each initiative plotted by Ability to Execute (X-axis) and Completeness of Vision (Y-axis). Leaders sit top-right.
        </p>
      </header>

      <div className="rounded-3xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur p-6 shadow-lg" style={{ boxShadow: "0 0 40px rgba(34, 211, 238, 0.2)" }}>
        <div className="flex items-center gap-3 mb-6 flex-wrap text-[11px]">
          {Object.entries(catColor).map(([k, c]) => (
            <span key={k} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${c})`, boxShadow: `0 0 8px hsl(${c})` }} /> <span className="font-semibold text-cyan-200">{k}</span>
            </span>
          ))}
        </div>
        
        <div className="relative aspect-[14/10] w-full">
          {/* axes */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <Quadrant title="Challengers" subtitle="Strong execution" align="tl" />
            <Quadrant title="Leaders" subtitle="Execute well + Bold vision" align="tr" highlight />
            <Quadrant title="Niche Players" subtitle="Limited execution" align="bl" />
            <Quadrant title="Visionaries" subtitle="Bold vision" align="br" />
          </div>

          {/* axis lines */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-cyan-500/40" />
          <div className="absolute left-2 right-2 bottom-2 h-px bg-cyan-500/40" />
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-purple-500/20 border-l border-dashed border-purple-500/30" />
          <div className="absolute left-2 right-2 top-1/2 h-px bg-purple-500/20 border-t border-dashed border-purple-500/30" />
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-cyan-300/70 font-mono -rotate-90 origin-right font-semibold" style={{ right: "100%", whiteSpace: "nowrap" }}>Vision</div>
          <div className="absolute bottom-1 left-1/2 text-[9px] uppercase tracking-widest text-cyan-300/70 font-mono font-semibold">Execution</div>

          {/* points */}
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
                  className="block rounded-full ring-2 ring-card/80 transition group-hover:scale-140"
                  style={{
                    width: 8 + Math.min(16, Math.log10(p.annualSavings + 10) * 2.5),
                    height: 8 + Math.min(16, Math.log10(p.annualSavings + 10) * 2.5),
                    background: `hsl(${catColor[p.category] ?? "var(--primary)"})`,
                    boxShadow: `0 0 8px hsl(${catColor[p.category] ?? "var(--primary)"} / 0.4)`,
                  }}
                />
              </Link>
            </motion.button>
          ))}
        </div>

        {/* tooltip / detail */}
        <div className="mt-6 min-h-[80px] rounded-xl border border-purple-500/40 bg-purple-900/30 backdrop-blur p-4 flex items-center gap-4" style={{ boxShadow: "0 0 20px rgba(168, 85, 247, 0.1)" }}>
          {hover ? (
            <>
              <span className="w-4 h-4 rounded-full" style={{ background: `hsl(${catColor[hover.category]})`, boxShadow: `0 0 12px hsl(${catColor[hover.category]})` }} />
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold truncate text-white text-lg">{hover.name}</div>
                <div className="text-xs text-cyan-200/70 mt-1">{hover.category} · {hover.region} · {hover.status} · {hover.pm}</div>
              </div>
              <div className="text-right">
                <div className="font-num font-bold text-white text-xl">${formatShort(hover.annualSavings)}</div>
                <div className="text-[10px] uppercase tracking-widest text-cyan-300/60 font-semibold">value / yr</div>
              </div>
            </>
          ) : (
            <span className="text-sm text-cyan-200/70 inline-flex items-center gap-2"><Info className="w-4 h-4" /> Hover any point to inspect; click to open the project.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Quadrant({ title, subtitle, align, highlight }: { title: string; subtitle: string; align: "tl" | "tr" | "bl" | "br"; highlight?: boolean }) {
  const pad = "p-4";
  const pos = align === "tl" ? "items-start justify-start text-left" :
              align === "tr" ? "items-start justify-end text-right" :
              align === "bl" ? "items-end justify-start text-left" :
                               "items-end justify-end text-right";
  return (
    <div className={`relative border ${pad} flex ${pos} ${highlight ? "border-green-500/60 bg-green-900/20" : "border-cyan-500/30 bg-slate-800/30"}`}>
      <div>
        <div className={`text-[10px] uppercase tracking-[0.15em] font-bold ${highlight ? "text-green-300" : "text-cyan-300"}`}>{title}</div>
        <div className={`text-[10px] leading-tight mt-1 ${highlight ? "text-green-200/70" : "text-cyan-200/60"}`}>{subtitle}</div>
      </div>
    </div>
  );
}
