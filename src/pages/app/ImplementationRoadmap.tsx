'use client';

import { useMemo } from 'react';
import { projects, parseProjectDate, type ProjectCategory } from '@/data/projects';
import { formatShort } from '@/components/ProjectCard';
import { CalendarRange, TrendingUp } from 'lucide-react';

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  AI: 'hsl(var(--viz-ai))',
  Automation: 'hsl(var(--viz-automation))',
  Analytics: 'hsl(var(--viz-analytics))',
  'Digital Transformation': 'hsl(var(--viz-digital))',
};

const FISCAL_YEARS = ['FY25', 'FY26', 'FY27', 'FY28', 'FY29', 'FY30'];

interface ProjectWithDates {
  project: typeof projects[0];
  startYear: number;
  endYear: number;
  startMonth: number;
  endMonth: number;
}

export default function ImplementationRoadmap() {
  const projectsWithDates = useMemo(() => {
    return projects
      .filter((p) => p.startDate || p.endDate)
      .map((project) => {
        const startDate = parseProjectDate(project.startDate);
        const endDate = parseProjectDate(project.endDate);

        if (!startDate && !endDate) return null;

        const start = startDate || endDate!;
        const end = endDate || startDate!;

        return {
          project,
          startYear: start.getFullYear(),
          endYear: end.getFullYear(),
          startMonth: start.getMonth(),
          endMonth: end.getMonth(),
        } as ProjectWithDates;
      })
      .filter(Boolean) as ProjectWithDates[];
  }, []);

  // Group projects by fiscal year and category
  const groupedProjects = useMemo(() => {
    const grouped: Record<string, Record<ProjectCategory, ProjectWithDates[]>> = {};

    FISCAL_YEARS.forEach((fy) => {
      grouped[fy] = {
        AI: [],
        Automation: [],
        Analytics: [],
        'Digital Transformation': [],
      };
    });

    projectsWithDates.forEach((pwd) => {
      const startFY = `FY${pwd.startYear % 100}`;
      if (grouped[startFY]) {
        grouped[startFY][pwd.project.category].push(pwd);
      }
    });

    return grouped;
  }, [projectsWithDates]);

  // Calculate gantt bar position and width
  const getGanttPosition = (pwd: ProjectWithDates) => {
    const yearRange = 2025 - 2030;
    const monthStart = (pwd.startYear - 2025) * 12 + pwd.startMonth;
    const monthEnd = (pwd.endYear - 2025) * 12 + pwd.endMonth;
    const totalMonths = Math.abs(2030 - 2025) * 12;

    const left = (monthStart / totalMonths) * 100;
    const width = ((monthEnd - monthStart) / totalMonths) * 100;

    return { left: Math.max(0, left), width: Math.max(2, width) };
  };

  const stats = useMemo(() => {
    return {
      total: projectsWithDates.length,
      value: projectsWithDates.reduce((acc, pwd) => acc + pwd.project.annualSavings, 0),
      live: projectsWithDates.filter((pwd) => pwd.project.status === 'Live').length,
      inProgress: projectsWithDates.filter((pwd) => pwd.project.status === 'In Progress').length,
    };
  }, [projectsWithDates]);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      {/* HERO HEADER */}
      <div className="mb-10 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-primary/20 p-8 lg:p-10">
        <div className="flex items-end justify-between gap-6 flex-col lg:flex-row">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Strategic Execution Plan</span>
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-5xl mt-2 leading-tight text-balance">
              Transformation in Motion
            </h1>
            <p className="text-base text-muted-foreground mt-3 max-w-2xl">
              A comprehensive portfolio of {stats.total} strategic initiatives spanning fiscal years 2025 through 2030, delivering $2.3M+ in annual value across four key capability areas.
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-6xl font-display font-bold text-primary/20 mb-2">{stats.total}</div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Strategic Initiatives</p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Projects" value={String(stats.total)} icon={<CalendarRange className="w-4 h-4" />} />
        <StatCard label="Deployed" value={String(stats.live)} accent />
        <StatCard label="In Progress" value={String(stats.inProgress)} />
        <StatCard label="Business Value" value={`$${formatShort(stats.value)}`} icon={<TrendingUp className="w-4 h-4" />} accent />
      </div>

      {/* FISCAL YEAR TIMELINE */}
      <div className="rounded-3xl border border-border bg-card shadow-elev-md overflow-hidden mb-10">
        {/* Timeline Header */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border p-6">
          <h2 className="font-display font-bold text-2xl mb-1">Execution Timeline</h2>
          <p className="text-sm text-muted-foreground">Strategic initiatives across six fiscal years with category distribution</p>
        </div>

        <div className="p-6 space-y-10">
          {FISCAL_YEARS.map((fy, idx) => {
            const categories = Object.entries(groupedProjects[fy]);
            const projectCount = categories.reduce((acc, [, projects]) => acc + projects.length, 0);
            const fyProjects = projectsWithDates.filter((pwd) => `FY${pwd.startYear % 100}` === fy);
            const deployedInFY = fyProjects.filter((pwd) => pwd.project.status === 'Live').length;
            const progressPercent = projectCount > 0 ? (deployedInFY / projectCount) * 100 : 0;
            const fyStatus = fy === 'FY25' ? 'Deployed' : fy === 'FY26' || fy === 'FY27' ? 'In Progress' : 'Pipeline';
            const bgClass = fy === 'FY25' ? 'bg-success/5 border-success/20' : fy === 'FY26' || fy === 'FY27' ? 'bg-warning/5 border-warning/20' : 'bg-muted/20 border-border';

            return (
              <div key={fy} className={`rounded-2xl border p-6 transition-all hover:shadow-md ${bgClass}`}>
                <div className="flex items-start justify-between gap-6 mb-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex-shrink-0">
                      <span className="font-display font-bold text-xl text-primary">{fy.replace('FY', '')}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg leading-tight">{fy}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-medium text-muted-foreground">{projectCount} initiatives</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                          fyStatus === 'Deployed' ? 'bg-success/15 text-success' :
                          fyStatus === 'In Progress' ? 'bg-warning/15 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {fyStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-bold text-2xl text-primary">{deployedInFY}</div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Deployed</p>
                  </div>
                </div>

                {/* Progress bar */}
                {projectCount > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Execution Progress</p>
                      <span className="text-[11px] font-semibold text-foreground">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Projects by category */}
                <div className="space-y-5 border-t border-border/50 pt-5">
                  {categories.map(([category, prjs]) => (
                    prjs.length > 0 && (
                      <div key={category} className="rounded-lg bg-muted/20 p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: CATEGORY_COLORS[category as ProjectCategory] }}
                          />
                          <h4 className="text-sm font-semibold text-foreground flex-1">{category}</h4>
                          <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-muted text-[10px] font-bold text-foreground">
                            {prjs.length}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {prjs.map((pwd) => {
                            const { left, width } = getGanttPosition(pwd);
                            const statusColor =
                              pwd.project.status === 'Live'
                                ? 'hsl(var(--success))'
                                : pwd.project.status === 'In Progress'
                                  ? 'hsl(var(--warning))'
                                  : pwd.project.status === 'In Discovery'
                                    ? 'hsl(var(--info))'
                                    : 'hsl(var(--muted-foreground))';

                            // Priority color mapping
                            const priorityColor = 
                              pwd.project.priority === 'Critical' ? '#ef4444' :
                              pwd.project.priority === 'High' ? '#f59e0b' :
                              pwd.project.priority === 'Medium' ? '#3b82f6' :
                              '#9ca3af';

                            // Max value for scaling bar width (find from all projects in this category)
                            const maxValue = Math.max(...prjs.map(p => p.project.annualSavings), 100000);
                            const barWidthPercent = (pwd.project.annualSavings / maxValue) * 100;

                            return (
                              <div key={pwd.project.id} className="flex items-center gap-2 group/item">
                                <div className="w-40 flex-shrink-0">
                                  <p className="text-[11px] font-semibold text-foreground truncate group-hover/item:text-primary transition-colors" title={pwd.project.name}>
                                    {pwd.project.name}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground truncate">{pwd.project.region}</p>
                                </div>

                                {/* Value Bar Graph - Priority-colored */}
                                <div className="w-32 flex-shrink-0 relative h-[28px] bg-muted/30 rounded-md overflow-hidden group/valuebar">
                                  <div
                                    className="h-full rounded-md transition-all duration-300 hover:shadow-lg"
                                    style={{
                                      background: `linear-gradient(90deg, ${priorityColor}, ${priorityColor}dd)`,
                                      width: `${barWidthPercent}%`,
                                      boxShadow: `0 0 8px ${priorityColor}50`,
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-start px-2">
                                    <p className="text-[10px] font-bold text-white opacity-0 group-hover/valuebar:opacity-100 transition-opacity whitespace-nowrap">
                                      ${formatShort(pwd.project.annualSavings)}
                                    </p>
                                  </div>
                                </div>

                                {/* Gantt bar */}
                                <div className="flex-1 min-h-[24px] relative bg-muted/40 rounded-md overflow-hidden group/bar">
                                  <div
                                    className="h-full rounded-md transition-all duration-300 hover:scale-y-125 hover:shadow-lg cursor-pointer origin-left"
                                    style={{
                                      background: `linear-gradient(90deg, ${CATEGORY_COLORS[pwd.project.category]}, ${CATEGORY_COLORS[pwd.project.category]}cc)`,
                                      left: `${left}%`,
                                      width: `${width}%`,
                                      borderLeft: `2.5px solid ${statusColor}`,
                                      boxShadow: `0 0 12px ${CATEGORY_COLORS[pwd.project.category]}40`,
                                    }}
                                    title={`${pwd.project.name} - ${pwd.project.status}`}
                                  >
                                    <div className="h-full flex items-center px-2 text-[9px] font-semibold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">
                                      {pwd.project.status}
                                    </div>
                                  </div>
                                </div>

                                <div className="w-20 flex-shrink-0 text-right">
                                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold" style={{ color: priorityColor }}>
                                    {pwd.project.priority}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline scale reference */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-4">Timeline Reference</p>
          <div className="flex justify-between items-end gap-2">
            {['2025', '2026', '2027', '2028', '2029', '2030'].map((year) => (
              <div key={year} className="flex-1 text-center">
                <div className="h-8 bg-gradient-to-t from-primary/10 to-transparent rounded-t mb-2" />
                <span className="text-[10px] font-semibold text-foreground">{year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRIORITY LEGEND */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elev-md mb-8">
        <h2 className="font-display font-bold text-2xl mb-1">Priority Levels</h2>
        <p className="text-sm text-muted-foreground mb-6">Bar graph colors indicate project priority level</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { priority: 'Critical', color: '#ef4444', description: 'Highest priority initiatives' },
            { priority: 'High', color: '#f59e0b', description: 'Strategic importance' },
            { priority: 'Medium', color: '#3b82f6', description: 'Important initiatives' },
            { priority: 'Standard', color: '#9ca3af', description: 'Routine projects' },
          ].map(({ priority, color, description }) => (
            <div key={priority} className="group rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-primary/5 transition-all">
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-lg flex-shrink-0 mt-0.5 shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    boxShadow: `0 0 12px ${color}50`
                  }} 
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{priority}</p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY LEGEND */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elev-md">
        <h2 className="font-display font-bold text-2xl mb-1">Project Categories</h2>
        <p className="text-sm text-muted-foreground mb-6">Timeline colors indicate project category</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => {
            const count = projectsWithDates.filter((p) => p.project.category === category).length;
            return (
              <div key={category} className="group rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:bg-primary/5 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-5 h-5 rounded-lg flex-shrink-0 mt-0.5 shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                      boxShadow: `0 0 12px ${color}40`
                    }} 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-primary/40" />
                      <p className="text-[11px] text-muted-foreground font-medium">{count} initiatives</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 transition-all hover:shadow-md group ${
      accent 
        ? 'border-primary/40 bg-gradient-to-br from-primary/8 to-accent/5 hover:border-primary/60' 
        : 'border-border bg-gradient-to-br from-card to-muted/10 hover:border-primary/30'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-bold">{label}</p>
        {icon && <span className={`transition-transform group-hover:scale-110 ${accent ? 'text-primary' : 'text-primary/60'}`}>{icon}</span>}
      </div>
      <p className="font-display font-bold text-3xl text-foreground group-hover:text-primary transition-colors">{value}</p>
    </div>
  );
}
