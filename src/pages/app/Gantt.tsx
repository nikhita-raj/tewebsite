import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects, type ProjectCategory, type ProjectRegion } from "@/data/projects";

type ViewMode = "Quarterly" | "Monthly" | "Yearly";

const catColor: Record<ProjectCategory, string> = {
  AI: "from-orange-500 to-pink-500",
  Automation: "from-amber-500 to-orange-500",
  Analytics: "from-sky-500 to-orange-400",
  "Digital Transformation": "from-violet-500 to-orange-400",
};

function parseDate(s: string) {
  const [y, m, d] = s.split("/").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export default function Gantt() {
  const [view, setView] = useState<ViewMode>("Quarterly");
  const [cat, setCat] = useState<ProjectCategory | "ALL">("ALL");
  const [region, setRegion] = useState<ProjectRegion | "ALL">("ALL");

  const filtered = useMemo(() => projects.filter((p) => {
    if (cat !== "ALL" && p.category !== cat) return false;
    if (region !== "ALL" && p.region !== region) return false;
    return true;
  }), [cat, region]);

  const { min, max, ticks } = useMemo(() => {
    const dates = filtered.flatMap((p) => [parseDate(p.startDate), parseDate(p.endDate)]);
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    min.setDate(1);
    max.setMonth(max.getMonth() + 1, 1);
    const ticks: { date: Date; label: string }[] = [];
    const cur = new Date(min);
    while (cur <= max) {
      if (view === "Yearly") {
        ticks.push({ date: new Date(cur), label: `${cur.getFullYear()}` });
        cur.setFullYear(cur.getFullYear() + 1);
      } else if (view === "Quarterly") {
        const q = Math.floor(cur.getMonth() / 3) + 1;
        ticks.push({ date: new Date(cur), label: `Q${q} ${cur.getFullYear()}` });
        cur.setMonth(cur.getMonth() + 3);
      } else {
        ticks.push({ date: new Date(cur), label: cur.toLocaleString(undefined, { month: "short" }) + " " + (cur.getMonth() === 0 ? cur.getFullYear() : "") });
        cur.setMonth(cur.getMonth() + 1);
      }
    }
    return { min, max, ticks };
  }, [filtered, view]);

  const span = max.getTime() - min.getTime();
  const posPct = (d: Date) => ((d.getTime() - min.getTime()) / span) * 100;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Timeline</div>
          <h1 className="font-display font-bold text-3xl mt-1">Portfolio Gantt</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["Quarterly", "Monthly", "Yearly"] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${view === v ? "bg-ember text-white shadow-ember" : "bg-card border border-border text-muted-foreground"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <FilterChip active={cat === "ALL"} onClick={() => setCat("ALL")}>All categories</FilterChip>
        {(["AI", "Automation", "Analytics", "Digital Transformation"] as ProjectCategory[]).map((c) => (
          <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterChip>
        ))}
        <span className="w-px bg-border mx-2" />
        <FilterChip active={region === "ALL"} onClick={() => setRegion("ALL")}>All regions</FilterChip>
        {(["EMIA", "AMER", "Global"] as ProjectRegion[]).map((r) => (
          <FilterChip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</FilterChip>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-elev-md overflow-hidden">
        {/* header ticks */}
        <div className="grid grid-cols-[260px_1fr] border-b border-border bg-muted/40">
          <div className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground">Initiative</div>
          <div className="relative h-10">
            {ticks.map((t, i) => (
              <div key={i} className="absolute top-0 bottom-0 flex items-center text-[10px] uppercase tracking-widest text-muted-foreground"
                style={{ left: `${posPct(t.date)}%` }}>
                <span className="border-l border-border h-full pl-2">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {filtered.map((p, i) => {
            const s = parseDate(p.startDate); const e = parseDate(p.endDate);
            const left = posPct(s); const width = Math.max(2, posPct(e) - left);
            return (
              <div key={p.id} className="grid grid-cols-[260px_1fr] border-b border-border/60 hover:bg-muted/30 transition">
                <Link to={`/projects/${p.id}`} className="px-4 py-3 truncate text-sm hover:text-primary">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground">{p.region} · {p.pm}</div>
                </Link>
                <div className="relative h-14">
                  {ticks.map((t, k) => (
                    <div key={k} className="absolute top-0 bottom-0 border-l border-border/40" style={{ left: `${posPct(t.date)}%` }} />
                  ))}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }} animate={{ width: `${width}%`, opacity: 1 }}
                    transition={{ duration: 0.6, delay: Math.min(i, 20) * 0.02 }}
                    className={`absolute top-3 h-8 rounded-lg bg-gradient-to-r ${catColor[p.category]} shadow-elev-sm flex items-center px-3 text-[11px] text-white font-medium`}
                    style={{ left: `${left}%` }}
                  >
                    <span className="truncate">{p.category}</span>
                    <span className="ml-auto opacity-80 font-num">{p.status}</span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${active ? "bg-ember text-white shadow-ember" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{children}</button>
  );
}
