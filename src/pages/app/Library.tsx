import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { projects, categories, regions, type ProjectCategory, type ProjectRegion, type ProjectStatus, type ProjectPriority } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

const statuses: ProjectStatus[] = ["Live", "In Progress", "In Discovery", "Planned"];
const priorities: ProjectPriority[] = ["Critical", "High", "Medium", "Standard"];

export default function Library() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const initialCat = params.get("category") as ProjectCategory | null;

  const [cat, setCat] = useState<ProjectCategory | "ALL">(initialCat ?? "ALL");
  const [region, setRegion] = useState<ProjectRegion | "ALL">("ALL");
  const [status, setStatus] = useState<ProjectStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<ProjectPriority | "ALL">("ALL");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (cat !== "ALL" && p.category !== cat) return false;
      if (region !== "ALL" && p.region !== region) return false;
      if (status !== "ALL" && p.status !== status) return false;
      if (priority !== "ALL" && p.priority !== priority) return false;
      if (q && !(`${p.name} ${p.pm} ${p.team} ${p.bu}`).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cat, region, status, priority, q]);

  const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${active ? "bg-ember text-white shadow-ember" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
    >{children}</button>
  );

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Portfolio</div>
          <h1 className="font-display font-bold text-3xl mt-1">Project Library</h1>
          <p className="text-sm text-muted-foreground mt-1">A Netflix-style catalogue of every initiative in motion.</p>
        </div>
        <div className="text-right">
          <div className="font-num font-bold text-2xl text-gradient">{filtered.length}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">showing of {projects.length}</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sticky top-16 z-20 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-4 h-4 text-primary" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search initiatives, owners, teams…"
            className="flex-1 bg-muted/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:bg-card focus:ring-1 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <FilterRow label="Category">
            <Chip active={cat === "ALL"} onClick={() => { setCat("ALL"); setParams({}); }}>All</Chip>
            {categories.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => { setCat(c); setParams({ category: c }); }}>{c}</Chip>
            ))}
          </FilterRow>
          <FilterRow label="Region">
            <Chip active={region === "ALL"} onClick={() => setRegion("ALL")}>All</Chip>
            {regions.map((r) => <Chip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</Chip>)}
          </FilterRow>
          <FilterRow label="Status">
            <Chip active={status === "ALL"} onClick={() => setStatus("ALL")}>All</Chip>
            {statuses.map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>)}
          </FilterRow>
          <FilterRow label="Priority">
            <Chip active={priority === "ALL"} onClick={() => setPriority("ALL")}>All</Chip>
            {priorities.map((p) => <Chip key={p} active={priority === p} onClick={() => setPriority(p)}>{p}</Chip>)}
          </FilterRow>
        </div>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No initiatives match these filters.</div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">{label}</span>
      {children}
    </div>
  );
}
