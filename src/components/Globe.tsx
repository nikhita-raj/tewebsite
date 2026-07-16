import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import type { ProjectRegion } from "@/data/projects";

interface Props {
  counts: Record<ProjectRegion, number>;
  active: ProjectRegion | "ALL";
  onSelect: (r: ProjectRegion | "ALL") => void;
}

/** Interactive 3D SVG globe with mouse tracking and vibrant gradients */
export function Globe({ counts, active, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = (e.clientY - rect.top - centerY) / (rect.height / 2) * 15;
      const y = (e.clientX - rect.left - centerX) / (rect.width / 2) * 15;
      setRotation({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);
  const regions: { id: ProjectRegion; label: string; x: number; y: number }[] = [
    { id: "EMIA", label: "EMIA", x: 180, y: 90 },
    { id: "AMER", label: "AMER", x: 60,  y: 120 },
    { id: "APAC", label: "APAC", x: 240, y: 130 },
    { id: "Global", label: "GLOBAL", x: 150, y: 220 },
  ];

  return (
    <div ref={containerRef} className="relative aspect-square w-full max-w-[460px] mx-auto perspective-1000" style={{ perspective: "1200px" }}>
      {/* orbit rings with gradients */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent orbit"
        style={{
          backgroundImage: "conic-gradient(from 0deg, rgba(59,182,255,0.3), rgba(139,92,246,0.3), rgba(59,182,255,0.3))",
          backgroundClip: "border-box"
        }}
      />
      <div className="absolute inset-6 rounded-full border-2 border-transparent orbit"
        style={{
          animationDuration: "60s",
          animationDirection: "reverse",
          backgroundImage: "conic-gradient(from 0deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
          backgroundClip: "border-box"
        }}
      />
      <div className="absolute inset-12 rounded-full border-2 border-transparent orbit"
        style={{
          animationDuration: "90s",
          backgroundImage: "conic-gradient(from 0deg, rgba(251,146,60,0.2), rgba(251,146,60,0.2))",
          backgroundClip: "border-box"
        }}
      />

      <motion.svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <radialGradient id="globeGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFD4A3" />
            <stop offset="60%" stopColor="#FFB566" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
          <radialGradient id="atmos" cx="50%" cy="50%">
            <stop offset="60%" stopColor="rgba(245, 158, 11, 0)" />
            <stop offset="100%" stopColor="rgba(251, 146, 60, 0.35)" />
          </radialGradient>
          <filter id="globeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="150" cy="150" r="118" fill="url(#atmos)" />
        <circle cx="150" cy="150" r="100" fill="url(#globeGrad)" filter="url(#globeGlow)" />
        {/* Glow effect */}
        <circle cx="150" cy="150" r="102" fill="none" stroke="rgba(251, 146, 60, 0.2)" strokeWidth="1" />
        {/* latitude lines */}
        {[0.35, 0.5, 0.65, 0.8].map((t, i) => (
          <ellipse key={i} cx="150" cy={150 + (t - 0.5) * 60} rx={100 * Math.sin(Math.acos(t - 0.5))} ry="6" fill="none" stroke="rgba(30,41,59,0.12)" />
        ))}
        {/* longitude */}
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <ellipse key={a} cx="150" cy="150" rx="100" ry={100 * Math.abs(Math.cos((a * Math.PI) / 180))} fill="none" stroke="rgba(30,41,59,0.1)" transform={`rotate(${a} 150 150)`} />
        ))}
        {/* region pins with vibrant colors */}
        {regions.map((r, idx) => {
          const isActive = active === r.id;
          const colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];
          const color = colors[idx % colors.length];
          return (
            <g key={r.id} className="cursor-pointer transition-all" onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)} onClick={() => onSelect(isActive ? "ALL" : r.id)}>
              {/* outer glow */}
              <circle cx={r.x} cy={r.y} r={isActive ? 16 : 12} fill={color} opacity={isActive ? 0.3 : 0.15} className="transition-all" style={{ filter: `drop-shadow(0 0 ${isActive ? "12px" : "8px"} ${color}40)` }} />
              {/* pulse ring */}
              <circle cx={r.x} cy={r.y} r={isActive ? 14 : 10} fill="none" stroke={color} strokeWidth="1.5" opacity={isActive ? 0.8 : 0} className="animate-pulse" />
              {/* main pin */}
              <circle cx={r.x} cy={r.y} r={isActive ? 7 : 5} fill={color} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
              {/* label background */}
              <rect x={r.x + 10} y={r.y - 16} width="72" height="28" rx="4" fill="rgba(255,255,255,0.95)" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }} />
              <text x={r.x + 14} y={r.y - 4} className="font-display" fontSize="10" fill="#1E293B" fontWeight={700}>{r.label}</text>
              <text x={r.x + 14} y={r.y + 8} fontSize="9" fill="#64748B" className="font-num">{counts[r.id]} projects</text>
            </g>
          );
        })}
      </motion.svg>

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
