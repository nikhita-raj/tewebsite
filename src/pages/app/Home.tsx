import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, TrendingUp, Clock, Users, DollarSign, Cpu, Bot, BarChart3, Network, Sparkles, Target, Shield, Zap, Globe as GlobeIcon } from "lucide-react";
import { ParticleTitle } from "@/components/hero/ParticleTitle";
import { NeuralHero } from "@/components/hero/NeuralHero";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Globe } from "@/components/Globe";
import { ProjectCard, formatShort } from "@/components/ProjectCard";
import { CyberParticles } from "@/components/CyberParticles";
import { projects, portfolioStats, categories, type ProjectRegion } from "@/data/projects";

const catIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  AI: Cpu, Automation: Bot, Analytics: BarChart3, "Digital Transformation": Network,
};

export default function Home() {
  const [region, setRegion] = useState<ProjectRegion | "ALL">("ALL");

  const regionCounts = useMemo(() => {
    const r: Record<ProjectRegion, number> = { EMIA: 0, AMER: 0, Global: 0 };
    for (const p of projects) r[p.region]++;
    return r;
  }, []);

  const filtered = useMemo(
    () => (region === "ALL" ? projects : projects.filter((p) => p.region === region)),
    [region]
  );

  const featured = useMemo(
    () => [...filtered].sort((a, b) => b.annualSavings - a.annualSavings).slice(0, 6),
    [filtered]
  );

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto space-y-16">
      {/* TOP CONTROL BAR — classified OS strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 backdrop-blur px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
      >
        <span className="flex items-center gap-2 text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ember" />
          SYS://TE-AI-HUB · ONLINE
        </span>
        <span className="opacity-40">│</span>
        <span>FY26 · {portfolioStats.activeProjects} INIT</span>
        <span className="opacity-40">│</span>
        <span className="hidden md:inline">UPLINK · EMIA ↔ AMER</span>
        <div className="ml-auto flex items-center gap-1.5">
          {(["ALL", "EMIA", "AMER", "Global"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r as ProjectRegion | "ALL")}
              className={`px-2.5 py-1 rounded-md border transition ${region === r ? "border-primary/60 text-primary bg-primary/10" : "border-border hover:border-primary/40 hover:text-foreground"}`}
            >
              {r}
            </button>
          ))}
          <Link to="/library" className="px-2.5 py-1 rounded-md border border-border hover:border-primary/40 hover:text-primary transition inline-flex items-center gap-1">
            LIBRARY <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/galaxy" className="px-2.5 py-1 rounded-md border border-border hover:border-primary/40 hover:text-primary transition">
            GALAXY
          </Link>
        </div>
      </motion.div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elev-lg noise scanlines">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <CyberParticles density={100} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
        <NeuralHero />
        <div className="relative z-10 px-8 pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-semibold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ember" />
            ▌ LIVE · FY26 PORTFOLIO · EXECUTIVE VIEW
          </motion.div>

          <h1 className="glitch font-display font-black text-4xl lg:text-6xl mt-4 leading-[0.95] tracking-tight" data-text="TE AI Transformation Hub">
            TE AI Transformation Hub
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground max-w-2xl">
            &gt; the operating system for global AI, automation &amp; digital transformation_
            <span className="inline-block w-2 h-4 align-middle bg-primary ml-1 flicker" />
          </p>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
          >
            <Kpi icon={<Sparkles className="w-4 h-4" />} label="Active Projects" value={<AnimatedCounter value={portfolioStats.activeProjects} />} />
            <Kpi icon={<Clock className="w-4 h-4" />} label="Weekly Hours Saved" value={<AnimatedCounter value={portfolioStats.weeklyHoursSaved} />} />
            <Kpi icon={<Users className="w-4 h-4" />} label="FTE Savings" value={<AnimatedCounter value={portfolioStats.fteSavings} decimals={1} />} accent />
            <Kpi icon={<DollarSign className="w-4 h-4" />} label="Estimated Value / yr" value={<AnimatedCounter value={portfolioStats.estimatedAnnualValue / 1_000_000} decimals={2} prefix="$" suffix="M" />} accent />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link to="/library" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ember text-white text-sm font-mono uppercase tracking-wider font-semibold shadow-ember magnetic">
              ► Explore Portfolio
            </Link>
            <Link to="/galaxy" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 bg-card text-sm font-mono uppercase tracking-wider font-semibold magnetic hover:bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" /> Transformation Galaxy
            </Link>
          </motion.div>
        </div>
      </section>

      {/* HEALTH SCORE + GLOBE */}
      <section className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border p-6 shadow-elev-md">
          <SectionHeader eyebrow="Executive Pulse" title="AI Transformation Score" />
          <div className="mt-6 flex items-center gap-6">
            <ScoreRing value={94} />
            <div className="space-y-2 text-sm">
              <PulseRow label="Portfolio Growth" value="+18% QoQ" tone="up" />
              <PulseRow label="Value Generated" value={`$${formatShort(portfolioStats.estimatedAnnualValue)} / yr`} tone="up" />
              <PulseRow label="Active Programs" value={`${portfolioStats.activeProjects} live`} tone="neutral" />
              <PulseRow label="Upcoming Milestones" value="12 next 30d" tone="neutral" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-3xl bg-card border border-border p-6 shadow-elev-md">
          <SectionHeader eyebrow="Geography" title="Global Coverage" action={
            <span className="text-xs text-muted-foreground">Click a region to filter the portfolio</span>
          } />
          <div className="mt-4 grid md:grid-cols-2 gap-6 items-center">
            <Globe counts={regionCounts} active={region} onSelect={setRegion} />
            <div className="space-y-3">
              {(["EMIA", "AMER", "Global"] as ProjectRegion[]).map((r) => {
                const c = projects.filter((p) => p.region === r);
                const value = c.reduce((a, b) => a + b.annualSavings, 0);
                return (
                  <button
                    key={r} onClick={() => setRegion(region === r ? "ALL" : r)}
                    className={`w-full text-left rounded-2xl border p-4 transition ${region === r ? "border-primary/40 bg-ember-soft shadow-elev-sm" : "border-border bg-muted/40 hover:bg-muted"}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display font-bold">{r}</span>
                      <span className="text-xs text-muted-foreground">{c.length} initiatives</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-ember" style={{ width: `${Math.min(100, (c.length / projects.length) * 100 * 2)}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Annual value <span className="font-num font-semibold text-foreground">${formatShort(value)}</span></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <SectionHeader eyebrow="Capabilities" title="Transformation Categories" />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => {
            const list = projects.filter((p) => p.category === c);
            const value = list.reduce((a, b) => a + b.annualSavings, 0);
            const Icon = catIcons[c] ?? Sparkles;
            return (
              <Link
                to={`/library?category=${encodeURIComponent(c)}`}
                key={c}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-elev-sm hover:shadow-elev-lg transition"
              >
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-ember opacity-10 blur-2xl group-hover:opacity-20 transition" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-ember-soft flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-4 font-display font-bold">{c}</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-num text-2xl font-bold text-gradient">{list.length}</span>
                    <span className="text-xs text-muted-foreground">initiatives</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">~ <span className="font-num font-semibold text-foreground">${formatShort(value)}</span> / yr</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section>
        <SectionHeader eyebrow="Spotlight" title="Featured Initiatives" action={
          <Link to="/library" className="text-sm text-primary font-semibold inline-flex items-center gap-1">View library <ArrowRight className="w-4 h-4" /></Link>
        } />
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="rounded-3xl border border-border bg-card p-8 shadow-elev-md relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-ember opacity-20 blur-3xl" />
        <div className="relative grid lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Executive Insight · Week 23
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
              The portfolio is now recovering <span className="text-gradient">{portfolioStats.weeklyHoursSaved.toLocaleString()} hours every week</span> — equivalent to {portfolioStats.fteSavings} FTE.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              AI-led initiatives in EMIA continue to drive the largest share of value, while Automation in AMER is scaling fastest QoQ. Recommend reviewing top-5 high-priority programs for cross-regional rollout in FY27.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/strategic" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ember text-white text-xs font-semibold shadow-ember">
                Open Strategic Roadmap <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/gantt" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold">
                Portfolio Gantt
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <InsightStat label="On Plan" value="38" unit="initiatives" tone="up" />
            <InsightStat label="In Discovery" value={`${projects.filter((p) => p.status === "In Discovery").length}`} unit="initiatives" />
            <InsightStat label="Live" value={`${projects.filter((p) => p.status === "Live").length}`} unit="delivered" tone="up" />
            <InsightStat label="Scalable" value={`${projects.filter((p) => p.scalable).length}`} unit="cross-region" />
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elev-md relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <SectionHeader eyebrow="Who We Are" title="About TE AI Transformation Hub" />
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <div className="w-10 h-10 rounded-xl bg-ember-soft flex items-center justify-center text-primary mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">Our Mission</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Accelerate enterprise-wide AI, Automation, and Digital Transformation by providing a single operating system for global executives to discover, track, and scale high-impact initiatives across EMIA and AMER.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <div className="w-10 h-10 rounded-xl bg-ember-soft flex items-center justify-center text-primary mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">What We Do</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                We unify portfolio intelligence across SAP BTP, Process Mining, Planning, Analytics, and AI — giving leadership real-time visibility into value, risk, and readiness with boardroom-grade reporting.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <div className="w-10 h-10 rounded-xl bg-ember-soft flex items-center justify-center text-primary mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">Why It Matters</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Decisions at the speed of insight. The Hub transforms scattered project data into a strategic asset — enabling faster funding, smarter staffing, and transparent governance for every transformation dollar.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 text-primary" />
              <span>Global · EMIA & AMER</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Multi-functional Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-First Culture</span>
            </div>
          </div>
        </div>
      </section>
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

function ScoreRing({ value }: { value: number }) {
  const r = 54; const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF6B00" />
            <stop offset="1" stopColor="#FFA94D" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-num font-bold text-3xl text-gradient"><AnimatedCounter value={value} /></span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Health</span>
      </div>
    </div>
  );
}

function PulseRow({ label, value, tone }: { label: string; value: string; tone?: "up" | "neutral" }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-num font-semibold ${tone === "up" ? "text-emerald-600" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function InsightStat({ label, value, unit, tone }: { label: string; value: string; unit: string; tone?: "up" }) {
  return (
    <div className="rounded-2xl bg-muted/50 border border-border p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-num font-bold text-2xl ${tone === "up" ? "text-emerald-600" : "text-foreground"}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{unit}</div>
      {tone === "up" && <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-1" />}
    </div>
  );
}
