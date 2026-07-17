import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Users, DollarSign, TrendingUp, Sparkles, Target, Shield, Zap, Globe as GlobeIcon, Grid3x3, CalendarRange } from "lucide-react";
import { NeuralHero } from "@/components/hero/NeuralHero";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Globe } from "@/components/Globe";
import { formatShort } from "@/components/ProjectCard";
import { CyberParticles } from "@/components/CyberParticles";
import { GartnerQuadrant } from "@/components/GartnerQuadrant";
import { projects, portfolioStats, parseProjectDate, type ProjectRegion, type ProjectStatus } from "@/data/projects";

type PipelineStatus = "Pipeline" | "Planned" | "Progress" | "UAT";

const STATUS_MAPPING: Record<PipelineStatus, ProjectStatus[]> = {
  Pipeline: ["Planned"],
  Planned: ["In Discovery"],
  Progress: ["In Progress"],
  UAT: ["Live"],
};

const STATUS_CONFIG: Record<PipelineStatus, { color: string; icon: string; bg: string; border: string; gradientClass: string }> = {
  Pipeline: { color: "#3b82f6", icon: "📋", bg: "from-blue-600/15 to-cyan-500/10", border: "border-blue-400/50", gradientClass: "from-blue-500 to-cyan-400" },
  Planned: { color: "#8b5cf6", icon: "📝", bg: "from-purple-600/15 to-pink-500/10", border: "border-purple-400/50", gradientClass: "from-purple-500 to-pink-400" },
  Progress: { color: "#f59e0b", icon: "⚙️", bg: "from-amber-600/15 to-orange-500/10", border: "border-amber-400/50", gradientClass: "from-amber-500 to-orange-400" },
  UAT: { color: "#10b981", icon: "✓", bg: "from-emerald-600/15 to-teal-500/10", border: "border-emerald-400/50", gradientClass: "from-emerald-500 to-teal-400" },
};



export default function Home() {
  const [region, setRegion] = useState<ProjectRegion | "ALL">("ALL");
  const navigate = useNavigate();

  const regionCounts = useMemo(() => {
    const r: Record<ProjectRegion, number> = { EMIA: 0, AMER: 0, APAC: 0, Global: 0 };
    for (const p of projects) r[p.region]++;
    return r;
  }, []);

  

  

  // Year-wise insights (by start date year, fallback to end date year)
  const yearInsights = useMemo(() => {
    const map = new Map<number, { count: number; value: number; hours: number; live: number; inProgress: number }>();
    for (const p of projects) {
      const d = parseProjectDate(p.startDate) ?? parseProjectDate(p.endDate);
      if (!d) continue;
      const y = d.getFullYear();
      const cur = map.get(y) ?? { count: 0, value: 0, hours: 0, live: 0, inProgress: 0 };
      cur.count++; cur.value += p.annualSavings; cur.hours += p.weeklyHours;
      if (p.status === "Live") cur.live++;
      if (p.status === "In Progress") cur.inProgress++;
      map.set(y, cur);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]).map(([year, v]) => ({ year, ...v }));
  }, []);

  // Gantt-style monthly distribution for current year
  const ganttBars = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return months.map((m) => {
      const active = projects.filter((p) => {
        const s = parseProjectDate(p.startDate); const e = parseProjectDate(p.endDate);
        if (!s || !e) return false;
        const date = new Date(2026, m, 15);
        return date >= s && date <= e;
      }).length;
      return { m, active };
    });
  }, []);
  const maxBar = Math.max(1, ...ganttBars.map(b => b.active));

  // Pipeline data grouping
  const pipelineData = useMemo(() => {
    const data: Record<PipelineStatus, typeof projects> = {
      Pipeline: [],
      Planned: [],
      Progress: [],
      UAT: [],
    };

    for (const project of projects) {
      for (const [pipeline, statuses] of Object.entries(STATUS_MAPPING)) {
        if (statuses.includes(project.status)) {
          data[pipeline as PipelineStatus].push(project);
        }
      }
    }

    return data;
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -4,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="space-y-16">
      {/* DARK HERO ZONE — only this part keeps the cyberpunk vibe */}
      <div className="bg-white">
        <div className="w-full px-6 lg:px-10">
          
            

          <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="absolute inset-0 cyber-grid opacity-30" />
            <CyberParticles density={100} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
            <NeuralHero />
            <div className="relative z-10 px-8 pt-10 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-semibold"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ember" />
                ▌ LIVE · FY26 PORTFOLIO · EXECUTIVE VIEW
              </motion.div>

              <motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="
    text-5xl
    lg:text-8xl
    font-black
    text-center
    tracking-tight
    text-white
    drop-shadow-[0_5px_15px_rgba(255,80,80,0.5)]
  "
  style={{
    textShadow: `
      0 1px 0 #ccc,
      0 2px 0 #c9c9c9,
      0 3px 0 #bbb,
      0 4px 0 #b9b9b9,
      0 5px 0 #aaa,
      0 6px 1px rgba(0,0,0,.1),
      0 0 20px rgba(255,70,70,.4),
      0 0 40px rgba(255,70,70,.3)
    `,
    transform: "perspective(500px) rotateX(10deg)",
  }}
>
  TE AI Transformation Hub
</motion.h1>
<motion.h1
  animate={{
    y: [0, -8, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
></motion.h1>
              <p className="mt-3 font-mono text-sm text-muted-foreground max-w-2xl">
                &gt; the operating system for global AI, automation &amp; digital transformation_
                <span className="inline-block w-2 h-4 align-middle bg-primary ml-1 flicker" />
              </p>

              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
              >
                <Kpi
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Total Projects"
                  value="44"
                />

                <Kpi
                  icon={<Clock className="w-4 h-4" />}
                  label="Weekly Hours Saved"
                  value={<AnimatedCounter value={portfolioStats.weeklyHoursSaved} />}
                />

                <Kpi
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="ROI"
                  value="327%"
                  accent
               />

                <Kpi
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Business Value"
                  value={
                    <AnimatedCounter
                      value={portfolioStats.estimatedAnnualValue / 1000000}
                      decimals={2}
                      prefix="$"
                      suffix="M"
                    />
                  }
                  accent
                />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 flex flex-wrap gap-3">
                <Link to="/library" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ember text-white text-sm font-mono uppercase tracking-wider font-semibold shadow-ember">
                  ► Explore Portfolio
                </Link>
                <Link to="/galaxy" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 bg-card text-sm font-mono uppercase tracking-wider font-semibold hover:bg-primary/10">
                  <Grid3x3 className="w-4 h-4 text-primary" /> Gartner Quadrant
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* LIGHT CONTENT ZONE */}
      <div className="w-full px-6 lg:px-10">

        {/* GLOBAL COVERAGE — region cards, no score */}
        <section className="rounded-3xl bg-card border border-border p-6 shadow-elev-md">

          <SectionHeader eyebrow="Geography" title="Global Coverage" action />
          <div className="mt-4 grid md:grid-cols-2 gap-6 items-center">
            <Globe counts={regionCounts} active={region} onSelect={setRegion} />
            
            <div className="grid grid-cols-2 gap-3">
              
              {(["EMIA", "AMER", "APAC", "Global"] as ProjectRegion[]).map((r) => {
                const c = projects.filter((p) => p.region === r);
                const value = c.reduce((a, b) => a + b.annualSavings, 0);
                return (
                  <button
                    key={r} onClick={() => setRegion(region === r ? "ALL" : r)}
                    className={`text-left rounded-2xl border p-4 transition ${region === r ? "border-primary/40 bg-ember-soft shadow-elev-sm" : "border-border bg-muted/40 hover:bg-muted"}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display font-bold">{r}</span>
                      <span className="text-2xl text-muted-foreground">{c.length}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-ember" style={{ width: `${Math.min(100, (c.length / Math.max(projects.length, 1)) * 100 * 2)}%` }} />
                    </div>
                    <div className="mt-2 text-2xl text-muted-foreground">~ <span className="font-num font-semibold text-foreground">${formatShort(value)}</span> / yr</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        
        

        

      {/* PROJECT PIPELINE - FULL KANBAN BOARD */}
      <section className="rounded-3xl border border-border bg-card p-8 shadow-elev-md">
        <SectionHeader
          eyebrow="Pipeline Management"
          title="Project Pipeline"
        />

        <p className="text-muted-foreground mt-2 mb-6">Track {projects.length} initiatives across four pipeline stages from planning through delivery</p>

        {/* PIPELINE BOARD */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(["Pipeline", "Planned", "Progress", "UAT"] as PipelineStatus[]).map((stage) => {
            const stageProjects = pipelineData[stage];
            const config = STATUS_CONFIG[stage];
            const visibleCount = Math.min(3, stageProjects.length);
            const remainingCount = Math.max(0, stageProjects.length - visibleCount);

            return (
              <motion.div key={stage} variants={columnVariants}>
                {/* Column Header - 3D Enhanced */}
                <div className={`rounded-t-2xl bg-gradient-to-br ${config.bg} ${config.border} border-2 p-5 mb-1 relative overflow-hidden group`}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl ${config.gradientClass} rounded-full blur-3xl opacity-30`} />
                  </div>
                  <div className="relative z-10 flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradientClass} flex items-center justify-center text-2xl shadow-lg`}>
                      {config.icon}
                    </div>
                    <h2 className="font-display font-bold text-xl" style={{ background: `linear-gradient(135deg, ${config.color}, #ffffff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {stage}
                    </h2>
                  </div>
                  <p className="text-3xl font-display font-black text-foreground">{stageProjects.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-semibold mt-1">Initiatives</p>
                </div>

                {/* Column Content - Scrollable */}
                <div className={`rounded-b-2xl ${config.border} border-x-2 border-b-2 p-4 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur flex flex-col max-h-[500px] shadow-lg`}>
                  {/* All Project Cards - Scrollable Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {stageProjects.length > 0 ? (
                      stageProjects.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          variants={cardVariants}
                          whileHover={{ y: -3, scale: 1.02 }}
                          custom={idx}
                          className={`relative rounded-lg border-2 ${config.border} bg-gradient-to-br from-white/60 to-white/30 backdrop-blur p-3 cursor-pointer transition-all group overflow-hidden flex-shrink-0`}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl ${config.gradientClass} rounded-full blur-2xl opacity-20`} />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[9px] uppercase tracking-widest font-bold text-foreground/60">{project.category}</p>
                              <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold text-white bg-gradient-to-r ${config.gradientClass}`}>
                                {project.priority[0]}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-foreground line-clamp-2 mb-2 leading-tight">{project.name}</p>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="text-[9px] font-mono text-muted-foreground/70 truncate flex-1">{project.region}</span>
                              <span className="text-xs font-bold text-foreground flex-shrink-0">${formatShort(project.annualSavings)}</span>
                            </div>
                            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${config.gradientClass}`} style={{ width: `${Math.min(100, (project.annualSavings / 500000) * 100)}%` }} />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-24 text-muted-foreground">
                        <p className="text-sm">No projects in this stage</p>
                      </div>
                    )}
                  </div>

                  {/* Total Value Footer */}
                  <div className="sticky bottom-0 mt-4 pt-3 border-t border-border/50 bg-gradient-to-t from-card/80 to-card/0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                      Stage Total
                    </p>
                    <p className="text-lg font-display font-bold text-foreground">
                      ${formatShort(stageProjects.reduce((acc, p) => acc + p.annualSavings, 0))}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* STAGE INSIGHTS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(["Pipeline", "Planned", "Progress", "UAT"] as PipelineStatus[]).map((stage) => {
            const stageProjects = pipelineData[stage];
            const totalValue = stageProjects.reduce((acc, p) => acc + p.annualSavings, 0);
            const avgValue = stageProjects.length > 0 ? totalValue / stageProjects.length : 0;
            const config = STATUS_CONFIG[stage];

            return (
              <motion.div
                key={`insight-${stage}`}
                variants={columnVariants}
                className={`rounded-2xl border ${config.border} bg-gradient-to-br ${config.bg} p-5`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      backgroundColor: `${config.color}20`,
                      color: config.color,
                    }}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                      {stage} Insights
                    </p>
                    <p className="text-lg font-display font-bold text-foreground">${formatShort(totalValue)}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Avg: ${formatShort(avgValue)} per project
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* GARTNER QUADRANT SECTION */}
      <section className="mt-10">
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-semibold flex items-center gap-2 mb-2">
            <Grid3x3 className="w-4 h-4" /> Portfolio Analysis
          </div>
          <h2 className="font-display font-bold text-3xl text-foreground">Magic Quadrant Positioning</h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl">Strategic positioning of all initiatives based on execution capability and vision completeness.</p>
        </div>
        <GartnerQuadrant compact={false} />
      </section>

{/* ABOUT TE AI HUB */}
<section className="mt-10 rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elev-md">
  <SectionHeader
    eyebrow="Who We Are"
    title="About TE AI Transformation Hub"
  />

  <div className="mt-6 grid md:grid-cols-3 gap-6">
    <AboutCard
      icon={<Target className="w-5 h-5" />}
      title="Our Mission"
      body="Accelerate enterprise-wide AI, Automation, and Digital Transformation across TE Connectivity."
    />

    <AboutCard
      icon={<Zap className="w-5 h-5" />}
      title="What We Do"
      body="Provide a centralized portfolio view of AI, Analytics, Automation and Digital Transformation initiatives."
    />

    <AboutCard
      icon={<Shield className="w-5 h-5" />}
      title="Why It Matters"
      body="Enable leadership to make faster decisions using real-time visibility into project progress, ROI and business value."
    />
  </div>

  <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
    <span className="flex items-center gap-2">
      <GlobeIcon className="w-4 h-4 text-primary" />
      Global · EMIA · AMER · APAC
    </span>

    <span className="flex items-center gap-2">
      <Users className="w-4 h-4 text-primary" />
      Multi-functional Teams
    </span>

    <span className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-primary" />
      AI-First Culture
    </span>
  </div>
</section>

      </div>
    </div>
  );
}

function Kpi({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl p-5 border backdrop-blur-sm transition-all duration-300 ${
        accent
          ? "bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-blue-400/40 shadow-glow-blue hover:shadow-glow-purple"
          : "bg-gradient-to-br from-white/40 to-white/20 border-white/30 shadow-lg hover:shadow-xl"
      } overflow-hidden group`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-foreground/70">{label}</span>
        <span className="text-xl text-blue-400 drop-shadow-lg">{icon}</span>
      </div>
      <div className="relative z-10 font-display font-bold text-3xl lg:text-4xl bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent">
        {value}
      </div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{eyebrow}</div>
        <h2 className="font-display font-bold text-2xl mt-1">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 border border-border/60 px-3 py-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-num font-bold text-sm mt-0.5">{value}</div>
    </div>
  );
}

function AboutCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-5">
      <div className="w-10 h-10 rounded-xl bg-ember-soft flex items-center justify-center text-primary mb-3">{icon}</div>
      <h4 className="font-display font-bold text-lg">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

