import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Play, Target, TrendingUp, Calendar, MapPin, Users, Building2, ShieldCheck } from "lucide-react";
import { projects } from "@/data/projects";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { formatShort } from "@/components/ProjectCard";
import { ExecutiveBriefPanel } from "@/components/ExecutiveBriefPanel";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = useMemo(() => projects.find((p) => p.id === id), [id]);
  const [brief, setBrief] = useState(false);

  if (!project) {
    return <div className="p-10">Project not found. <Link to="/library" className="text-primary">Back to library</Link></div>;
  }

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1200px] mx-auto space-y-12">
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to library
      </Link>

      {/* OVERVIEW */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-elev-lg"
      >
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="relative grid lg:grid-cols-5 gap-8 p-8">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ember" /> {project.category} · {project.priority} Priority
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-5xl mt-3 leading-tight">{project.name}</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl">
              A {project.category.toLowerCase()} initiative led by {project.pm} for {project.bu} ({project.area}) in {project.region}.
              Designed to transform {project.team} operations and generate measurable enterprise value.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setBrief(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ember text-white text-sm font-semibold shadow-ember magnetic">
                <Sparkles className="w-4 h-4" /> Generate Executive Brief
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold magnetic">
                <Play className="w-4 h-4 text-primary" /> Watch Demo
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Meta icon={<MapPin className="w-3.5 h-3.5" />} label="Region" value={project.region} />
              <Meta icon={<Building2 className="w-3.5 h-3.5" />} label="BU" value={project.bu} />
              <Meta icon={<Users className="w-3.5 h-3.5" />} label="Owner" value={project.pm} />
              <Meta icon={<Calendar className="w-3.5 h-3.5" />} label="Go-Live" value={project.endDate} />
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <Kpi label="Annual Value" value={<AnimatedCounter value={project.annualSavings} prefix="$" />} accent />
            <Kpi label="Hours / wk" value={<AnimatedCounter value={project.weeklyHours} />} />
          </div>
        </div>
      </motion.section>

      {/* SCROLL STORY */}
      <Story icon={<Target className="w-5 h-5" />} eyebrow="Business Challenge" title={`Why ${project.area} needs a step change`}>
        Today, {project.team} relies on manual, repetitive processes that consume thousands of analyst hours every quarter and limit the throughput required for the FY26 growth plan in {project.region}. Without intervention, scaling further would require linear headcount growth.
      </Story>

      <Story icon={<TrendingUp className="w-5 h-5" />} eyebrow="Current State" title="Friction across the value chain" reverse>
        Decision cycles are bottlenecked by data fragmentation across SAP, planning systems and operational tools. {project.weeklyHours ? `Approximately ${project.weeklyHours.toLocaleString()} hours / week` : "A significant share of analyst capacity"} is consumed by tasks that could be augmented by intelligent automation.
      </Story>

      <Story icon={<Sparkles className="w-5 h-5" />} eyebrow="Future State" title={`An ${project.category}-powered operating model`}>
        Deliver a production-grade {project.category} capability embedded in the existing workflow, with an enterprise-ready data foundation and a clear path to scale across regions and business units.
      </Story>

      <Story icon={<ShieldCheck className="w-5 h-5" />} eyebrow="Business Impact" title="Measurable executive value" reverse>
        <ul className="space-y-1.5">
          <li>• Annualized value: <strong className="font-num">${project.annualSavings.toLocaleString()}</strong></li>
          {project.weeklyHours > 0 && <li>• Capacity recovered: <strong className="font-num">{(project.weeklyHours * 52).toLocaleString()} hours / yr</strong></li>}
        </ul>
      </Story>

      {/* VIDEO DEMO */}
      <section className="rounded-3xl overflow-hidden border border-border bg-card shadow-elev-md">
        <div className="relative aspect-video bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <button className="relative z-10 group">
            <span className="absolute inset-0 rounded-full bg-ember blur-2xl opacity-50 group-hover:opacity-80 transition" />
            <span className="relative w-20 h-20 rounded-full bg-ember text-white flex items-center justify-center shadow-ember">
              <Play className="w-7 h-7 ml-1" />
            </span>
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Executive Walkthrough</div>
              <div className="font-display font-bold">{project.name} — 90-second demo</div>
            </div>
            <div className="text-xs font-num text-muted-foreground">1080p · Auto-preview</div>
          </div>
        </div>
      </section>

      {/* HEALTH */}
      <section className="rounded-3xl bg-card border border-border p-6 shadow-elev-md">
        <h3 className="font-display font-bold text-xl">Project Health</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <Health label="BRD" value={project.brdStatus} />
          <Health label="FDD" value={project.fddStatus} />
          <Health label="Delivery" value={project.status} />
        </div>
        <div className="mt-6 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-ember" style={{ width: `${project.status === "Live" ? 100 : project.status === "In Progress" ? 65 : project.status === "In Discovery" ? 35 : 10}%` }} />
        </div>
      </section>

      <ExecutiveBriefPanel project={brief ? project : null} onClose={() => setBrief(false)} />
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/60 border border-border px-3 py-2 backdrop-blur">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1">{icon}{label}</div>
      <div className="font-sub font-semibold text-sm mt-0.5 truncate">{value}</div>
    </div>
  );
}
function Kpi({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? "border-primary/30 bg-ember-soft" : "border-border bg-card/70 backdrop-blur"}`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display font-bold text-xl mt-1">{value}</div>
    </div>
  );
}
function Health({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border px-4 py-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-sub font-semibold text-sm mt-1">{value}</div>
    </div>
  );
}
function Story({ icon, eyebrow, title, children, reverse }: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode; reverse?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className={`grid lg:grid-cols-5 gap-8 items-center ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}
    >
      <div className="lg:col-span-2">
        <div className="w-12 h-12 rounded-2xl bg-ember-soft text-primary flex items-center justify-center">{icon}</div>
        <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{eyebrow}</div>
        <h2 className="font-display font-bold text-3xl mt-1 leading-tight">{title}</h2>
      </div>
      <div className="lg:col-span-3 text-base text-muted-foreground leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}
