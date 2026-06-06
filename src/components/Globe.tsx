import { motion } from "framer-motion";
import { useState } from "react";
import type { ProjectRegion } from "@/data/projects";

interface Props {
  counts: Record<ProjectRegion, number>;
  active: ProjectRegion | "ALL";
  onSelect: (r: ProjectRegion | "ALL") => void;
}

/** Stylized SVG globe with orbiting region nodes — light, premium, no Three.js. */
export function Globe({ counts, active, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const regions: { id: ProjectRegion; label: string; x: number; y: number }[] = [
    { id: "EMIA", label: "EMIA", x: 180, y: 90 },
    { id: "AMER", label: "AMER", x: 60,  y: 120 },
    { id: "Global", label: "GLOBAL", x: 230, y: 170 },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[460px] mx-auto">
      {/* orbit rings */}
      <div className="absolute inset-0 rounded-full border border-primary/15 orbit" />
      <div className="absolute inset-6 rounded-full border border-primary/10 orbit" style={{ animationDuration: "60s", animationDirection: "reverse" }} />
      <div className="absolute inset-12 rounded-full border border-primary/10 orbit" style={{ animationDuration: "90s" }} />

      <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="globeGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFE7D2" />
            <stop offset="100%" stopColor="#FFB37A" />
          </radialGradient>
          <radialGradient id="atmos" cx="50%" cy="50%">
            <stop offset="70%" stopColor="rgba(255,107,0,0)" />
            <stop offset="100%" stopColor="rgba(255,107,0,0.25)" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="118" fill="url(#atmos)" />
        <circle cx="150" cy="150" r="100" fill="url(#globeGrad)" />
        {/* latitude lines */}
        {[0.35, 0.5, 0.65, 0.8].map((t, i) => (
          <ellipse key={i} cx="150" cy={150 + (t - 0.5) * 60} rx={100 * Math.sin(Math.acos(t - 0.5))} ry="6" fill="none" stroke="rgba(30,41,59,0.12)" />
        ))}
        {/* longitude */}
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <ellipse key={a} cx="150" cy="150" rx="100" ry={100 * Math.abs(Math.cos((a * Math.PI) / 180))} fill="none" stroke="rgba(30,41,59,0.1)" transform={`rotate(${a} 150 150)`} />
        ))}
        {/* region pins */}
        {regions.map((r) => {
          const isActive = active === r.id;
          return (
            <g key={r.id} className="cursor-pointer" onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)} onClick={() => onSelect(isActive ? "ALL" : r.id)}>
              <circle cx={r.x} cy={r.y} r={isActive ? 14 : 10} fill="hsl(25 100% 50%)" opacity={0.18} className={isActive ? "" : ""} />
              <circle cx={r.x} cy={r.y} r={isActive ? 6 : 4} fill="hsl(25 100% 50%)" />
              <text x={r.x + 12} y={r.y - 8} className="font-display" fontSize="11" fill="#1E293B" fontWeight={700}>{r.label}</text>
              <text x={r.x + 12} y={r.y + 6} fontSize="10" fill="#64748B" className="font-num">{counts[r.id]} projects</text>
            </g>
          );
        })}
      </svg>

      <motion.button
        onClick={() => onSelect("ALL")}
        whileHover={{ scale: 1.04 }}
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-full border transition ${
          active === "ALL" ? "bg-ember text-white border-transparent shadow-ember" : "bg-card border-border text-muted-foreground"
        }`}
      >
        All Regions
      </motion.button>
      {hover && <div className="sr-only">{hover}</div>}
    </div>
  );
}
