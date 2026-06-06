import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, TrendingUp, MapPin, User2 } from "lucide-react";
import type { Project } from "@/data/projects";

const statusColor: Record<string, string> = {
  Live: "bg-emerald-500",
  "In Progress": "bg-amber-500",
  "In Discovery": "bg-sky-500",
  Planned: "bg-slate-400",
};

const priorityRing: Record<string, string> = {
  Critical: "ring-2 ring-primary/40",
  High: "ring-1 ring-primary/25",
  Medium: "",
  Standard: "",
};

const catGlow: Record<string, string> = {
  AI: "from-viz-ai/20 via-viz-ai/5 to-transparent",
  Automation: "from-viz-automation/20 via-viz-automation/5 to-transparent",
  Analytics: "from-viz-analytics/20 via-viz-analytics/5 to-transparent",
  "Digital Transformation": "from-viz-digital/20 via-viz-digital/5 to-transparent",
};

export const CATEGORY_COLOR: Record<string, string> = {
  AI: "viz-ai",
  Automation: "viz-automation",
  Analytics: "viz-analytics",
  "Digital Transformation": "viz-digital",
};

const catStrip: Record<string, string> = {
  AI: "bg-gradient-to-br from-viz-ai/15 via-background to-viz-5/10",
  Automation: "bg-gradient-to-br from-viz-automation/15 via-background to-viz-6/10",
  Analytics: "bg-gradient-to-br from-viz-analytics/15 via-background to-viz-7/10",
  "Digital Transformation": "bg-gradient-to-br from-viz-digital/15 via-background to-viz-analytics/10",
};


export function ProjectCard({ p, index = 0 }: { p: Project; index?: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 12) * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Link to={`/projects/${p.id}`} className="group block">
        <div className={`relative overflow-hidden rounded-2xl bg-card border border-border p-5 shadow-elev-sm hover:shadow-elev-lg transition-all duration-300 ${priorityRing[p.priority]}`}>
          {/* hover aurora */}
          <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${catGlow[p.category] ?? ""} pointer-events-none`} />
          {/* video-preview surrogate strip */}
          <div className="relative h-24 -mx-5 -mt-5 mb-4 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="absolute inset-0 grid-pattern opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${statusColor[p.status] ?? "bg-slate-400"}`} />
              {p.status}
            </div>
            <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-card/80 backdrop-blur border border-border text-foreground font-medium">
              {p.category}
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
              <div className="font-display text-xs text-muted-foreground">#{p.id.padStart(3, "0")} · {p.bu}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary font-semibold opacity-0 group-hover:opacity-100 transition">{p.priority}</div>
            </div>
          </div>

          <h3 className="font-display font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h3>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Metric icon={<TrendingUp className="w-3.5 h-3.5" />} label="Value / yr" value={`$${formatShort(p.annualSavings)}`} />
            <Metric icon={<Clock className="w-3.5 h-3.5" />} label="Hours / wk" value={p.weeklyHours ? p.weeklyHours.toLocaleString() : "—"} />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3 h-3" />{p.region}</span>
            <span className="inline-flex items-center gap-1.5"><User2 className="w-3 h-3" />{p.pm}</span>
            <span className="inline-flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 transition">
              Open <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border/60 px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">{icon}{label}</div>
      <div className="font-num font-bold text-sm text-foreground mt-0.5">{value}</div>
    </div>
  );
}

export function formatShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toFixed(0);
}
