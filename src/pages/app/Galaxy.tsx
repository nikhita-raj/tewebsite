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
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold flex items-center gap-2">
            <Grid3x3 className="w-3.5 h-3.5" /> Gartner Quadrant
          </div>
          <h1 className="font-display font-bold text-3xl mt-1">Magic Quadrant — Portfolio Positioning</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Each initiative plotted against its Ability to Execute and Completeness of Vision. Leaders sit top-right.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(catColor).map(([k, c]) => (
            <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-card">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${c})` }} /> {k}
            </span>
          ))}
        </div>
      </header>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-elev-md">
        <div className="relative aspect-[16/11] w-full">
          {/* axes */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <Quadrant title="Challengers" subtitle="Strong execution · Less vision" align="tl" />
            <Quadrant title="Leaders" subtitle="Execute well · Bold vision" align="tr" highlight />
            <Quadrant title="Niche Players" subtitle="Limited execution & vision" align="bl" />
            <Quadrant title="Visionaries" subtitle="Bold vision · Building execution" align="br" />
          </div>

          {/* axis arrows */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          <div className="absolute left-2 right-2 bottom-2 h-px bg-border" />
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-border/60 border-l border-dashed border-border" />
          <div className="absolute left-2 right-2 top-1/2 h-px bg-border/60 border-t border-dashed border-border" />
          <div className="absolute -left-1 top-0 text-[10px] uppercase tracking-widest text-muted-foreground font-mono rotate-180" style={{ writingMode: "vertical-rl" }}>↑ Completeness of Vision</div>
          <div className="absolute right-2 -bottom-6 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Ability to Execute →</div>

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
                  className="block rounded-full ring-2 ring-card transition group-hover:scale-150"
                  style={{
                    width: 10 + Math.min(20, Math.log10(p.annualSavings + 10) * 3),
                    height: 10 + Math.min(20, Math.log10(p.annualSavings + 10) * 3),
                    background: `hsl(${catColor[p.category] ?? "var(--primary)"})`,
                    boxShadow: `0 0 12px hsl(${catColor[p.category] ?? "var(--primary)"} / 0.5)`,
                  }}
                />
              </Link>
            </motion.button>
          ))}
        </div>

        {/* tooltip / detail */}
        <div className="mt-6 min-h-[72px] rounded-xl border border-border bg-muted/30 p-4 flex items-center gap-4">
          {hover ? (
            <>
              <span className="w-3 h-3 rounded-full" style={{ background: `hsl(${catColor[hover.category]})` }} />
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold truncate">{hover.name}</div>
                <div className="text-xs text-muted-foreground">{hover.category} · {hover.region} · {hover.status} · {hover.pm}</div>
              </div>
              <div className="text-right">
                <div className="font-num font-bold">${formatShort(hover.annualSavings)}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">value / yr</div>
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground inline-flex items-center gap-2"><Info className="w-4 h-4" /> Hover any point to inspect; click to open the project.</span>
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
    <div className={`relative border border-border/60 ${pad} flex ${pos} ${highlight ? "bg-ember-soft" : "bg-muted/20"}`}>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{title}</div>
        <div className="text-[11px] text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}
