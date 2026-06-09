import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Library, Compass, GanttChartSquare, Sparkles, Activity, Calendar } from "lucide-react";

const nav = [
  { to: "/", label: "Command Center", icon: Home },
  { to: "/library", label: "Project Library", icon: Library },
  { to: "/strategic", label: "Strategic View", icon: Compass },
  { to: "/roadmap", label: "Implementation Roadmap", icon: Calendar },
  { to: "/gantt", label: "Portfolio Gantt", icon: GanttChartSquare },
  { to: "/galaxy", label: "Transformation Galaxy", icon: Sparkles },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/70 backdrop-blur-xl sticky top-0 h-screen">
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-ember shadow-ember flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl pulse-ember pointer-events-none" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-sm">TE AI Hub</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Transformation OS</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((n, i) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-ember-soft text-foreground shadow-elev-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r bg-ember"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <n.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                <span>{n.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary pulse-ember" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </div>
          <div className="font-display text-sm font-semibold">Portfolio Health</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="font-num text-2xl font-bold text-gradient">94</div>
            <div className="text-xs text-muted-foreground mb-1">/100</div>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-ember rounded-full" style={{ width: "94%" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
