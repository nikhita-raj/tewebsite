import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Download, AlertTriangle, Target, TrendingUp, Calendar } from "lucide-react";
import type { Project } from "@/data/projects";
import { formatShort } from "./ProjectCard";

interface Props { project: Project | null; onClose: () => void; }

export function ExecutiveBriefPanel({ project, onClose }: Props) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-card border-l border-border shadow-elev-lg overflow-y-auto"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <header className="sticky top-0 z-10 bg-card/90 backdrop-blur border-b border-border px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Polaris AI · Executive Brief
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold leading-tight">{project.name}</h2>
                  <div className="mt-1 text-xs text-muted-foreground">{project.region} · {project.bu} · Owner {project.pm}</div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition"><X className="w-4 h-4" /></button>
              </div>
            </header>

            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <BriefStat label="Annual Value" value={`$${formatShort(project.annualSavings)}`} />
                <BriefStat label="Hours / wk" value={project.weeklyHours ? project.weeklyHours.toLocaleString() : "—"} />
                <BriefStat label="FTE Savings" value={project.fteSavings.toString()} />
              </div>

              <Section icon={<Target className="w-4 h-4" />} title="Business Problem">
                {project.area} operations in {project.region} are constrained by manual, repetitive workflows across {project.team}. Cycle times and analyst hours limit the throughput needed for the FY26 growth plan.
              </Section>

              <Section icon={<Sparkles className="w-4 h-4" />} title="Solution">
                A {project.category} initiative delivering an intelligent, scalable capability embedded in the existing operating model. Designed to be regionally deployed and globally reusable.
              </Section>

              <Section icon={<TrendingUp className="w-4 h-4" />} title="Value Generated">
                Recovers <strong className="text-foreground">{project.weeklyHours ? `${(project.weeklyHours * 52).toLocaleString()} hours / yr` : "significant analyst capacity"}</strong>, equivalent to <strong className="text-foreground">{project.fteSavings} FTE</strong>, with an estimated annualized value of <strong className="text-foreground">${project.annualSavings.toLocaleString()}</strong>.
              </Section>

              <Section icon={<Calendar className="w-4 h-4" />} title="Status & Next Milestones">
                <ul className="space-y-1.5 mt-1">
                  <li>• BRD: <span className="text-foreground">{project.brdStatus}</span></li>
                  <li>• FDD: <span className="text-foreground">{project.fddStatus}</span></li>
                  <li>• Live target: <span className="text-foreground font-num">{project.endDate}</span></li>
                </ul>
              </Section>

              <Section icon={<AlertTriangle className="w-4 h-4" />} title="Risks">
                Adoption alignment with regional teams, data quality from upstream SAP processes, and prioritization against parallel {project.category} initiatives.
              </Section>

              <div className="rounded-2xl bg-ember-soft border border-primary/20 p-5">
                <div className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">Leadership Recommendation</div>
                <p className="text-sm leading-relaxed">
                  <strong>Continue investment.</strong> {project.scalable ? "High potential to scale to additional regions — recommend including in the global FY26 portfolio review." : "Maintain regional focus and re-evaluate scaling once steady-state value is measured."}
                </p>
              </div>

              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ember text-white font-semibold shadow-ember hover:brightness-105 transition">
                <Download className="w-4 h-4" /> Export Brief as PDF
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function BriefStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-num font-bold text-base">{value}</div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-sub font-semibold text-foreground mb-1.5">
        <span className="text-primary">{icon}</span> {title}
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
