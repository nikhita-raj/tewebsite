import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import { ExecutiveBriefPanel } from "@/components/ExecutiveBriefPanel";
import { formatShort } from "@/components/ProjectCard";

interface Star { p: Project; x: number; y: number; r: number; brightness: number; }

export default function Galaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Star | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const stars: Star[] = useMemo(() => {
    const maxVal = Math.max(...projects.map((p) => p.annualSavings)) || 1;
    const maxHours = Math.max(...projects.map((p) => p.weeklyHours)) || 1;
    return projects.map((p, i) => {
      const golden = 2.39996; const t = i * golden;
      const radius = 0.05 + (1 - p.annualSavings / maxVal) * 0.45 + (i % 5) * 0.02;
      return {
        p,
        x: 0.5 + radius * Math.cos(t),
        y: 0.5 + radius * Math.sin(t),
        r: 2 + (p.annualSavings / maxVal) * 12,
        brightness: 0.35 + (p.weeklyHours / maxHours) * 0.65,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0; let t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    const render = () => {
      const r = canvas.getBoundingClientRect();
      const t = (performance.now() - t0) / 1000;
      // bg
      const g = ctx.createRadialGradient(r.width / 2, r.height / 2, 0, r.width / 2, r.height / 2, Math.max(r.width, r.height) / 1.2);
      g.addColorStop(0, "rgba(255,236,210,1)");
      g.addColorStop(0.6, "rgba(255,255,255,1)");
      g.addColorStop(1, "rgba(252,242,232,1)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
      // dust
      ctx.fillStyle = "rgba(255,107,0,0.04)";
      for (let i = 0; i < 220; i++) {
        const a = (i / 220) * Math.PI * 2 + t * 0.02;
        const rd = 80 + ((i * 37) % (Math.min(r.width, r.height) / 2 - 60));
        const x = r.width / 2 + Math.cos(a) * rd;
        const y = r.height / 2 + Math.sin(a) * rd;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      for (const s of stars) {
        const cx = s.x * r.width; const cy = s.y * r.height;
        const pulse = 1 + Math.sin(t * 1.5 + s.x * 12) * 0.08;
        const radius = s.r * pulse;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 4);
        glow.addColorStop(0, `rgba(255,107,0,${0.55 * s.brightness})`);
        glow.addColorStop(1, "rgba(255,107,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(cx, cy, radius * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,140,66,${0.6 + 0.4 * s.brightness})`;
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width;
      const my = (e.clientY - r.top) / r.height;
      let best: Star | null = null; let bd = 0.04;
      for (const s of stars) {
        const d = Math.hypot(s.x - mx, s.y - my);
        if (d < bd) { bd = d; best = s; }
      }
      setHover(best);
    };
    const onClick = () => { if (hover) setSelected(hover.p); };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [stars, hover]);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Signature</div>
        <h1 className="font-display font-bold text-3xl mt-1">Transformation Galaxy</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Every initiative is a star. Brighter stars save more hours. Bigger stars generate more value. Click to explore.</p>
      </header>

      <div ref={wrapRef} className="relative rounded-3xl border border-border overflow-hidden shadow-elev-lg" style={{ aspectRatio: "16/9" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute glass-strong rounded-xl px-3 py-2 text-xs"
            style={{ left: `calc(${hover.x * 100}% + 14px)`, top: `calc(${hover.y * 100}% - 10px)` }}
          >
            <div className="font-display font-bold truncate max-w-[260px]">{hover.p.name}</div>
            <div className="text-muted-foreground">{hover.p.region} · {hover.p.category}</div>
            <div className="font-num text-primary font-bold">${formatShort(hover.p.annualSavings)}</div>
          </motion.div>
        )}
        <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          {projects.length} initiatives mapped · scroll to explore
        </div>
      </div>

      <ExecutiveBriefPanel project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
