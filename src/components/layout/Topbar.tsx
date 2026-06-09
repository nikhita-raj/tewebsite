import { Search, Bell, FileDown, Globe2, Activity, Home, Library, Compass, GanttChartSquare, Grid3x3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/library", label: "Project Library", icon: Library },
  { to: "/strategic", label: "Strategic View", icon: Compass },
  { to: "/gantt", label: "Portfolio Gantt", icon: GanttChartSquare },
  { to: "/galaxy", label: "Gartner Quadrant", icon: Grid3x3 },
];

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      {/* Primary bar */}
      <div className="flex items-center gap-4 px-6 py-3">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 mr-2">
          <div className="relative w-9 h-9 rounded-xl bg-ember shadow-ember flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl pulse-ember pointer-events-none" />
          </div>
          <div className="leading-tight hidden lg:block">
            <div className="font-display font-bold text-lg text-gray-900">
  TE AI Hub
</div>

<div className="text-xs uppercase tracking-widest text-gray-800 font-semibold">
  Transformation OS
</div>
          </div>
        </NavLink>

        <div className="flex items-center gap-2 text-base text-gray-900 font-medium hidden md:flex">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="font-sub text-sm">Global Operations</span>
          <span className="hidden md:inline text-sm">·</span>
          <span className="hidden md:inline text-sm">FY26 Portfolio</span>
        </div>

      
        <div className="flex items-center gap-2 ml-auto">
          <NavLink
            to="/vp-portal"
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            Generate VP Deck
          </NavLink>
          
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
  `group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
    isActive
      ? "bg-ember-soft text-black shadow-elev-sm"
      : "text-gray-700 hover:text-black hover:bg-muted/60"
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
