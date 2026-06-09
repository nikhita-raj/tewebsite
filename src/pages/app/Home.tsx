import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Users, DollarSign, Cpu, Bot, BarChart3, Network, Sparkles, Target, Shield, Zap, Globe as GlobeIcon, Grid3x3, CalendarRange } from "lucide-react";
import { NeuralHero } from "@/components/hero/NeuralHero";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Globe } from "@/components/Globe";
import { ProjectCard, formatShort } from "@/components/ProjectCard";
import { CyberParticles } from "@/components/CyberParticles";
import { projects, portfolioStats, categories, parseProjectDate, type ProjectRegion } from "@/data/projects";

const catIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  AI: Cpu, Automation: Bot, Analytics: BarChart3, "Digital Transformation": Network,
};

export default function Home() {
  const [region, setRegion] = useState<ProjectRegion | "ALL">("ALL");
  const navigate = useNavigate();

  const regionCounts = useMemo(() => {
    const r: Record<ProjectRegion, number> = { EMIA: 0, AMER: 0, APAC: 0, Global: 0 };
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
      <div className="dark-zone bg-background">
        <div className="px-6 lg:px-10 pt-8 pb-10 max-w-[1400px] mx-auto space-y-6">
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
            <div className="ml-auto flex items-center gap-1.5">
              {(["ALL", "EMIA", "AMER", "APAC", "Global"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r as ProjectRegion | "ALL")}
                  className={`px-2.5 py-1 rounded-md border transition ${region === r ? "border-primary/60 text-primary bg-primary/10" : "border-border hover:border-primary/40 hover:text-foreground"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </motion.div>

          <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elev-lg noise scanlines">
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

              <h1 className="glitch font-display font-black text-4xl lg:text-6xl mt-4 leading-[0.95]" data-text="TE AI Transformation Hub">
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
      <div className="px-6 lg:px-10 max-w-[1400px] mx-auto space-y-16 pb-16">

        {/* GLOBAL COVERAGE — region cards, no score */}
        <section className="rounded-3xl bg-card border border-border p-6 shadow-elev-md">
          <SectionHeader eyebrow="Geography" title="Global Coverage" action={
            <span className="text-xs text-muted-foreground">Click a region to filter the portfolio</span>
          } />
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
                      <span className="text-xs text-muted-foreground">{c.length}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-ember" style={{ width: `${Math.min(100, (c.length / Math.max(projects.length, 1)) * 100 * 2)}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">~ <span className="font-num font-semibold text-foreground">${formatShort(value)}</span> / yr</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* YEAR-WISE INSIGHTS + MINI GANTT — clickable → library */}
        <section>
          <SectionHeader eyebrow="Project Insights" title="Year-Wise Portfolio + Timeline" action={
            <Link to="/gantt" className="text-sm text-primary font-semibold inline-flex items-center gap-1">Full Gantt <ArrowRight className="w-4 h-4" /></Link>
          } />
          <div className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {yearInsights.map((y) => (
                <button
                  key={y.year}
                  onClick={() => navigate(`/library?year=${y.year}`)}
                  className="text-left rounded-2xl border border-border bg-card p-5 shadow-elev-sm hover:shadow-elev-lg hover:border-primary/40 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Fiscal Year</div>
                    <CalendarRange className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                  </div>
                  <div className="mt-1 font-display font-bold text-3xl text-gradient">{y.year}</div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <Stat label="Projects" value={`${y.count}`} />
                    <Stat label="Value / yr" value={`$${formatShort(y.value)}`} />
                    <Stat label="Live" value={`${y.live}`} />
                    <Stat label="In Progress" value={`${y.inProgress}`} />
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1 group-hover:text-primary transition">
                    Open in library <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>

            {/* Mini Gantt — monthly active project density for 2026 */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elev-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">FY26 Timeline</div>
                  <h3 className="font-display font-bold text-lg mt-1">Active Projects per Month</h3>
                </div>
                <Link to="/gantt" className="text-xs text-primary font-semibold">Open</Link>
              </div>
              <div className="mt-5 flex items-end gap-1.5 h-40">
                {ganttBars.map((b) => (
                  <button
                    key={b.m}
                    onClick={() => navigate(`/library?year=2026`)}
                    className="group flex-1 flex flex-col items-center justify-end gap-1"
                    title={`${b.active} active`}
                  >
                    <span className="text-[10px] font-num text-muted-foreground opacity-0 group-hover:opacity-100">{b.active}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary/90 hover:from-primary hover:to-primary transition"
                      style={{ height: `${(b.active / maxBar) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">{["J","F","M","A","M","J","J","A","S","O","N","D"][b.m]}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Click any bar to open the library filtered for 2026.</div>
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

        {/* ABOUT */}
        <section className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elev-md relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <SectionHeader eyebrow="Who We Are" title="About TE AI Transformation Hub" />
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <AboutCard icon={<Target className="w-5 h-5" />} title="Our Mission" body="Accelerate enterprise-wide AI, Automation, and Digital Transformation by providing a single operating system for global executives to discover, track, and scale high-impact initiatives across EMIA, AMER and APAC." />
              <AboutCard icon={<Zap className="w-5 h-5" />} title="What We Do" body="We unify portfolio intelligence across SAP BTP, Process Mining, Planning, Analytics, and AI — giving leadership real-time visibility into value, risk, and readiness with boardroom-grade reporting." />
              <AboutCard icon={<Shield className="w-5 h-5" />} title="Why It Matters" body="Decisions at the speed of insight. The Hub transforms scattered project data into a strategic asset — enabling faster funding, smarter staffing, and transparent governance for every transformation dollar." />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><GlobeIcon className="w-4 h-4 text-primary" />Global · EMIA · AMER · APAC</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Multi-functional Teams</span>
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />AI-First Culture</span>
            </div>
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
