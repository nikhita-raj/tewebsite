import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Users, DollarSign, TrendingUp, Sparkles, Target, Shield, Zap, Globe as GlobeIcon, Grid3x3, CalendarRange } from "lucide-react";
import { NeuralHero } from "@/components/hero/NeuralHero";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Globe } from "@/components/Globe";
import { formatShort } from "@/components/ProjectCard";
import { CyberParticles } from "@/components/CyberParticles";
import { projects, portfolioStats, parseProjectDate, type ProjectRegion } from "@/data/projects";



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

        
        

        

      {/* IMPLEMENTATION ROADMAP */}
      <section className="rounded-3xl border border-border bg-card p-8 shadow-elev-md">
        <SectionHeader
          eyebrow="Strategic Planning"
          title="Implementation Roadmap"
          action={
            <Link to="/roadmap" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-sub font-semibold hover:opacity-90">
              <CalendarRange className="w-4 h-4" /> View Full Roadmap
            </Link>
          }
        />

        <p className="text-muted-foreground mt-2 mb-6">44 initiatives mapped across fiscal years with strategic alignment</p>

        {/* Fiscal Year Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <RoadmapFYCard fy="FY25" status="Deployed" color="bg-success/10 border-success/30" />
          <RoadmapFYCard fy="FY26" status="In Progress" color="bg-warning/10 border-warning/30" />
          <RoadmapFYCard fy="FY27" status="In Progress" color="bg-warning/10 border-warning/30" />
          <RoadmapFYCard fy="FY28" status="Pipeline" color="bg-muted border-border" />
          <RoadmapFYCard fy="FY29" status="Pipeline" color="bg-muted border-border" />
          <RoadmapFYCard fy="FY30" status="Pipeline" color="bg-muted border-border" />
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Explore the comprehensive timeline with all 44 projects, detailed Gantt visualization, and business metrics</p>
        </div>
      </section>
{/* ABOUT TE AI HUB */}
<section className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elev-md">
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
    <div className={`relative rounded-2xl p-4 border ${accent ? "border-primary/30 bg-ember-soft" : "border-border bg-card"} shadow-elev-sm overflow-hidden`}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span><span className="text-primary">{icon}</span>
      </div>
      <div className="mt-2 font-display font-bold text-2xl lg:text-3xl text-foreground">{value}</div>
    </div>
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
function RoadmapFYCard({ fy, status, color }: { fy: string; status: string; color: string }) {
  return (
    <div className={`rounded-xl border p-4 text-center ${color} shadow-elev-sm`}>
      <h3 className="font-display font-bold text-lg">{fy}</h3>
      <p className="text-xs text-muted-foreground mt-1">{status}</p>
    </div>
  );
}
