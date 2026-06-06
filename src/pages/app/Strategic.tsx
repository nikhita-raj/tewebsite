import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { formatShort } from "@/components/ProjectCard";

const stages = [
  { key: "Current State", year: "FY25", desc: "Manual, fragmented workflows across regions." },
  { key: "Automation", year: "FY26", desc: "Process automation at scale across SAP & operations." },
  { key: "AI Adoption", year: "FY27", desc: "Embedded AI in decision-making and forecasting." },
  { key: "Agentic AI", year: "FY28", desc: "Autonomous agents collaborating with experts." },
  { key: "Autonomous Enterprise", year: "Vision", desc: "Self-optimizing global operations." },
];

const stageAssign = (i: number) => {
  if (i === 0) return ["Automation"];
  if (i === 1) return ["Automation", "Analytics"];
  if (i === 2) return ["AI", "Analytics"];
  if (i === 3) return ["AI", "Digital Transformation"];
  return ["Digital Transformation", "AI"];
};

export default function Strategic() {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Strategic Roadmap</div>
        <h1 className="font-display font-bold text-3xl mt-1">Transformation Journey</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">A boardroom-grade view of how we move from today's operating model to an autonomous enterprise.</p>
      </header>

      <div className="relative">
        {/* spine */}
        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

        <div className="space-y-12">
          {stages.map((s, i) => {
            const cats = stageAssign(i);
            const items = projects.filter((p) => cats.includes(p.category)).slice(0, 4);
            const value = items.reduce((a, b) => a + b.annualSavings, 0);
            const left = i % 2 === 0;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`relative lg:grid lg:grid-cols-2 gap-12 items-center`}
              >
                {/* node */}
                <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-6 lg:top-1/2 lg:-translate-y-1/2 z-10">
                  <span className="block w-5 h-5 rounded-full bg-ember shadow-ember pulse-ember" />
                </div>

                <div className={`pl-16 lg:pl-0 ${left ? "lg:pr-12 lg:text-right" : "lg:col-start-2 lg:pl-12"}`}>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{s.year}</div>
                  <h3 className="font-display font-bold text-2xl mt-1">{s.key}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-num font-bold text-foreground">{items.length}</span> milestones · <span className="font-num font-bold text-foreground">${formatShort(value)}</span> value
                  </div>
                </div>

                <div className={`pl-16 lg:pl-0 ${left ? "lg:col-start-2 lg:pl-12" : "lg:pr-12 lg:row-start-1"}`}>
                  <div className="rounded-2xl bg-card border border-border p-4 shadow-elev-sm space-y-2">
                    {items.map((p) => (
                      <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-ember-soft transition group">
                        <span className="text-sm truncate group-hover:text-primary">{p.name}</span>
                        <span className="text-xs font-num text-muted-foreground">${formatShort(p.annualSavings)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
