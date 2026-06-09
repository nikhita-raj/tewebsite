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
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Strategic Execution</div>
            <h1 className="font-display font-bold text-3xl mt-1">Implementation Roadmap</h1>
            <p className="text-sm text-muted-foreground mt-2">44 initiatives mapped across fiscal years with strategic alignment and execution timeline</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Projects" value={String(stats.total)} icon={<CalendarRange className="w-4 h-4" />} />
          <StatCard label="Deployed" value={String(stats.live)} accent />
          <StatCard label="In Progress" value={String(stats.inProgress)} />
          <StatCard label="Business Value" value={`$${formatShort(stats.value)}`} icon={<TrendingUp className="w-4 h-4" />} accent />
        </div>
      </div>

      {/* FISCAL YEAR TIMELINE */}
      <div className="rounded-3xl border border-border bg-card p-6 mb-8 shadow-elev-md">
        <div className="mb-4">
          <h2 className="font-display font-bold text-xl mb-2">Fiscal Year Timeline</h2>
          <p className="text-sm text-muted-foreground">Projects mapped by implementation year and category</p>
        </div>

        <div className="space-y-8">
          {FISCAL_YEARS.map((fy) => {
            const categories = Object.entries(groupedProjects[fy]);
            const projectCount = categories.reduce((acc, [, projects]) => acc + projects.length, 0);

            return (
              <div key={fy} className="border-b border-border last:border-b-0 pb-8 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
                      <span className="font-display font-bold text-lg text-primary">{fy}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg">{fy}</h3>
                      <p className="text-xs text-muted-foreground">{projectCount} projects</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {fy === 'FY25' && '20{25} - Deployed'}
                    {fy === 'FY26' && '2026 - In Progress'}
                    {fy === 'FY27' && '2027 - In Progress'}
                    {fy === 'FY28' && '2028 - Pipeline'}
                    {fy === 'FY29' && '2029 - Pipeline'}
                    {fy === 'FY30' && '2030 - Pipeline'}
                  </div>
                </div>

                {/* Projects by category */}
                <div className="space-y-6">
                  {categories.map(([category, prjs]) => (
                    prjs.length > 0 && (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: CATEGORY_COLORS[category as ProjectCategory] }}
                          />
                          <h4 className="text-sm font-semibold text-foreground">{category}</h4>
                          <span className="text-xs text-muted-foreground ml-auto">{prjs.length} projects</span>
                        </div>

                        <div className="space-y-2">
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

                            return (
                              <div key={pwd.project.id} className="flex items-center gap-3">
                                <div className="w-48 flex-shrink-0">
                                  <p className="text-xs font-medium text-foreground truncate" title={pwd.project.name}>
                                    {pwd.project.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">{pwd.project.region}</p>
                                </div>

                                {/* Gantt bar */}
                                <div className="flex-1 min-h-[28px] relative bg-muted/30 rounded-md overflow-hidden">
                                  <div
                                    className="h-full rounded-md transition-all hover:opacity-80 cursor-pointer group"
                                    style={{
                                      background: `linear-gradient(90deg, ${CATEGORY_COLORS[pwd.project.category]}, ${CATEGORY_COLORS[pwd.project.category]}dd)`,
                                      left: `${left}%`,
                                      width: `${width}%`,
                                      borderLeft: `3px solid ${statusColor}`,
                                    }}
                                    title={`${pwd.project.name} - ${pwd.project.status}`}
                                  >
                                    <div className="h-full flex items-center px-2 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">
                                      {pwd.project.status}
                                    </div>
                                  </div>
                                </div>

                                <div className="w-20 flex-shrink-0 text-right">
                                  <p className="text-xs font-semibold text-foreground">${formatShort(pwd.project.annualSavings)}</p>
                                  <p className="text-[10px] text-muted-foreground">{pwd.project.priority}</p>
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
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Timeline Scale</p>
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>2025</span>
            <span>2026</span>
            <span>2027</span>
            <span>2028</span>
            <span>2029</span>
            <span>2030</span>
          </div>
        </div>
      </div>

      {/* CATEGORY LEGEND */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-elev-md">
        <h2 className="font-display font-bold text-xl mb-4">Project Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <div key={category} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-4 h-4 rounded-full" style={{ background: color }} />
              <div>
                <p className="text-sm font-semibold">{category}</p>
                <p className="text-[10px] text-muted-foreground">
                  {projectsWithDates.filter((p) => p.project.category === category).length} projects
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'} shadow-elev-sm`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</p>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
    </div>
  );
}
