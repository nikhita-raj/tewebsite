import { Search, Bell, FileDown, Globe2, Activity, Home, Library, Compass, GanttChartSquare, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const nav = [
  { to: "/", label: "Command Center", icon: Home },
  { to: "/library", label: "Project Library", icon: Library },
  { to: "/strategic", label: "Strategic View", icon: Compass },
  { to: "/gantt", label: "Portfolio Gantt", icon: GanttChartSquare },
  { to: "/galaxy", label: "Transformation Galaxy", icon: Sparkles },
];

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      {/* Primary bar */}
      <div className="flex items-center gap-4 px-6 py-3">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 mr-2">
          <div className="relative w-9 h-9 rounded-xl bg-ember shadow-ember flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl pulse-ember pointer-events-none" />
          </div>
          <div className="leading-tight hidden lg:block">
            <div className="font-display font-bold text-sm">TE AI Hub</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Transformation OS</div>
          </div>
        </NavLink>

        <div className="flex items-center gap-2 text-xs text-muted-foreground hidden md:flex">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="font-sub">Global Operations</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">FY26 Portfolio</span>
        </div>

        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:outline-none text-sm transition"
              placeholder="Search 44 initiatives, owners, regions…"
            />
            <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground font-num">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-card border border-border hover:border-primary/40 transition"
          >
            <FileDown className="w-3.5 h-3.5" /> Generate VP Deck
          </motion.button>
          <button className="relative p-2 rounded-xl hover:bg-muted transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <div className="h-9 w-9 rounded-full bg-ember shadow-ember flex items-center justify-center text-white text-xs font-semibold font-num">EX</div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="border-t border-border/60 px-6 py-2">
        <nav className="flex items-center gap-1 overflow-x-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
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
                      layoutId="topbar-active"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-ember"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <n.icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : ""}`} />
                  <span>{n.label}</span>
                  {isActive && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary pulse-ember" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
