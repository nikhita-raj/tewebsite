import { useMemo } from "react";
import { motion } from "framer-motion";
import { projects, type ProjectStatus } from "@/data/projects";
import { formatShort } from "@/components/ProjectCard";
import { TrendingUp, Zap } from "lucide-react";

type PipelineStatus = "Pipeline" | "Planned" | "Progress" | "UAT";

const STATUS_MAPPING: Record<PipelineStatus, ProjectStatus[]> = {
  Pipeline: ["Planned"],
  Planned: ["In Discovery"],
  Progress: ["In Progress"],
  UAT: ["Live"],
};

const STATUS_CONFIG: Record<PipelineStatus, { color: string; icon: string; bg: string; border: string }> = {
  Pipeline: { color: "#3b82f6", icon: "📋", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/30" },
  Planned: { color: "#8b5cf6", icon: "📝", bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/30" },
  Progress: { color: "#f59e0b", icon: "⚙️", bg: "from-amber-500/10 to-amber-500/5", border: "border-amber-500/30" },
  UAT: { color: "#10b981", icon: "✓", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/30" },
};

export default function Pipeline() {
  // Group projects by pipeline status
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
    <div className="px-6 lg:px-10 py-8 max-w-[1800px] mx-auto">
      {/* HERO HEADER */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Project Pipeline</span>
        </div>
        <h1 className="font-display font-bold text-4xl lg:text-5xl mt-3 leading-tight text-balance">
          Strategic Pipeline Overview
        </h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
          Track the progress of {projects.length} initiatives across four pipeline stages from planning through delivery
        </p>
      </div>

      {/* PIPELINE BOARD */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              {/* Column Header */}
              <div className={`rounded-t-2xl bg-gradient-to-r ${config.bg} ${config.border} border p-4 mb-1`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  <h2 className="font-display font-bold text-lg" style={{ color: config.color }}>
                    {stage}
                  </h2>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{stageProjects.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Projects</p>
              </div>

              {/* Column Content */}
              <div className={`rounded-b-2xl ${config.border} border-x border-b p-4 bg-card/50 min-h-[300px] space-y-3`}>
                {/* Sample Project Cards */}
                {stageProjects.slice(0, visibleCount).map((project, idx) => (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    whileHover="hover"
                    custom={idx}
                    className="rounded-lg border border-border bg-card p-3 cursor-pointer transition-all"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                      {project.category}
                    </p>
                    <p className="text-xs font-semibold text-foreground line-clamp-2 mb-2">{project.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">{project.region}</span>
                      <span className="text-xs font-bold text-primary">${formatShort(project.annualSavings)}</span>
                    </div>
                  </motion.div>
                ))}

                {/* Show More Button */}
                {remainingCount > 0 && (
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg border-2 border-dashed border-border p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <p className="text-sm font-bold text-foreground">+{remainingCount} More</p>
                  </motion.div>
                )}

                {/* Total Value */}
                <div className="mt-auto pt-3 border-t border-border/50">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Total Value
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
        className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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

      {/* SUMMARY STATS */}
      <motion.div
        className="mt-10 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Total Projects
            </p>
            <p className="text-3xl font-display font-bold text-foreground">{projects.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Total Pipeline Value
            </p>
            <p className="text-3xl font-display font-bold text-foreground">
              ${formatShort(projects.reduce((acc, p) => acc + p.annualSavings, 0))}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Completion Rate
            </p>
            <p className="text-3xl font-display font-bold text-success">
              {Math.round((pipelineData.UAT.length / projects.length) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              In Flight
            </p>
            <p className="text-3xl font-display font-bold text-warning">
              {pipelineData.Progress.length + pipelineData.Planned.length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
