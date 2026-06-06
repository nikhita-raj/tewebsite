import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { projects, categories, regions, type ProjectCategory, type ProjectRegion, type ProjectStatus, type ProjectPriority } from "@/data/projects";
import { ProjectCard, CATEGORY_COLOR } from "@/components/ProjectCard";

const statuses: ProjectStatus[] = ["Live", "In Progress", "In Discovery", "Planned"];
const priorities: ProjectPriority[] = ["Critical", "High", "Medium", "Standard"];

type AnyFilter = string;

export default function Library() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const initialCat = params.get("category") as ProjectCategory | null;

  const [cats, setCats] = useState<Set<ProjectCategory>>(new Set(initialCat ? [initialCat] : []));
  const [regs, setRegs] = useState<Set<ProjectRegion>>(new Set());
  const [stats, setStats] = useState<Set<ProjectStatus>>(new Set());
  const [prios, setPrios] = useState<Set<ProjectPriority>>(new Set());

  const toggle = <T extends AnyFilter>(set: Set<T>, val: T, setFn: (s: Set<T>) => void) => {
    const n = new Set(set);
    n.has(val) ? n.delete(val) : n.add(val);
    setFn(n);
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (cats.size && !cats.has(p.category)) return false;
      if (regs.size && !regs.has(p.region)) return false;
      if (stats.size && !stats.has(p.status)) return false;
      if (prios.size && !prios.has(p.priority)) return false;
      if (q && !(`${p.name} ${p.pm} ${p.team} ${p.bu}`).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cats, regs, stats, prios, q]);

  const activeCount = cats.size + regs.size + stats.size + prios.size;

  const clearAll = () => {
    setCats(new Set()); setRegs(new Set()); setStats(new Set()); setPrios(new Set()); setParams({});
  };

  const counts = useMemo(() => {
    const acc = { cat: {} as Record<string, number>, reg: {} as Record<string, number>, st: {} as Record<string, number>, pr: {} as Record<string, number> };
    projects.forEach((p) => {
      acc.cat[p.category] = (acc.cat[p.category] ?? 0) + 1;
      acc.reg[p.region] = (acc.reg[p.region] ?? 0) + 1;
      acc.st[p.status] = (acc.st[p.status] ?? 0) + 1;
      acc.pr[p.priority] = (acc.pr[p.priority] ?? 0) + 1;
    });
    return acc;
  }, []);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1500px] mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Portfolio</div>
          <h1 className="font-display font-bold text-3xl mt-1">Project Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse every initiative in motion across the enterprise.</p>
        </div>
        <div className="text-right">
          <div className="font-num font-bold text-2xl text-gradient">{filtered.length}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">showing of {projects.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
        {/* LEFT FILTER SIDEBAR */}
        <aside className="lg:sticky lg:top-20 lg:self-start glass rounded-2xl p-5 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-sm">Filters</span>
              {activeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">{activeCount}</span>
              )}
            </div>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search initiatives…"
              className="w-full bg-muted/60 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:bg-card focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <FilterGroup label="Category">
            {categories.map((c) => (
              <CheckRow key={c} checked={cats.has(c)} onClick={() => toggle(cats, c, setCats)} count={counts.cat[c]} dot={`hsl(var(--${CATEGORY_COLOR[c]}))`}>{c}</CheckRow>
            ))}
          </FilterGroup>

          <FilterGroup label="Region">
            {regions.map((r) => (
              <CheckRow key={r} checked={regs.has(r)} onClick={() => toggle(regs, r, setRegs)} count={counts.reg[r]}>{r}</CheckRow>
            ))}
          </FilterGroup>

          <FilterGroup label="Status">
            {statuses.map((s) => {
              const dot = s === "Live" ? "hsl(var(--success))" : s === "In Progress" ? "hsl(var(--warning))" : s === "In Discovery" ? "hsl(var(--info))" : "hsl(var(--muted-foreground))";
              return <CheckRow key={s} checked={stats.has(s)} onClick={() => toggle(stats, s, setStats)} count={counts.st[s]} dot={dot}>{s}</CheckRow>;
            })}
          </FilterGroup>

          <FilterGroup label="Priority">
            {priorities.map((p) => (
              <CheckRow key={p} checked={prios.has(p)} onClick={() => toggle(prios, p, setPrios)} count={counts.pr[p]}>{p}</CheckRow>
            ))}
          </FilterGroup>
        </aside>

        {/* GRID */}
        <div>
          <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No initiatives match these filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">{label}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CheckRow({ checked, onClick, count, dot, children }: { checked: boolean; onClick: () => void; count?: number; dot?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition group ${
        checked ? "bg-ember-soft text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition ${checked ? "bg-primary border-primary" : "border-border bg-card"}`}>
          {checked && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 4.5L3.5 7L8 1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </span>
        {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />}
        <span className="truncate font-medium">{children}</span>
      </span>
      {count !== undefined && <span className="font-num text-[10px] text-muted-foreground tabular-nums">{count}</span>}
    </button>
  );
}
