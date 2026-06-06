import { useEffect, useRef } from "react";

interface Props { text: string; subText?: string; }

/** Particles assemble into the provided text using offscreen canvas sampling. */
export function ParticleTitle({ text, subText }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0; let started = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // sample text mask
    const sample = () => {
      const r = canvas.getBoundingClientRect();
      const off = document.createElement("canvas");
      off.width = r.width; off.height = r.height;
      const o = off.getContext("2d")!;
      o.fillStyle = "#000";
      o.textBaseline = "middle";
      o.textAlign = "center";
      const size = Math.min(r.width / (text.length * 0.55), r.height * 0.45);
      o.font = `800 ${size}px "Space Grotesk", sans-serif`;
      o.fillText(text, r.width / 2, r.height / 2 - (subText ? size * 0.25 : 0));
      if (subText) {
        o.font = `500 ${size * 0.25}px "Sora", sans-serif`;
        o.fillStyle = "rgba(0,0,0,0.55)";
        o.fillText(subText, r.width / 2, r.height / 2 + size * 0.55);
      }
      const data = o.getImageData(0, 0, r.width, r.height).data;
      const points: { x: number; y: number }[] = [];
      const step = Math.max(3, Math.floor(r.width / 320));
      for (let y = 0; y < r.height; y += step) {
        for (let x = 0; x < r.width; x += step) {
          const a = data[(y * r.width + x) * 4 + 3];
          if (a > 128) points.push({ x, y });
        }
      }
      return points;
    };

    type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number };
    let particles: P[] = [];
    const init = () => {
      const targets = sample();
      const r = canvas.getBoundingClientRect();
      particles = targets.map((t) => ({
        x: Math.random() * r.width,
        y: Math.random() * r.height,
        tx: t.x, ty: t.y, vx: 0, vy: 0,
      }));
    };
    init();
    const onResize = () => { resize(); init(); started = performance.now(); };
    window.addEventListener("resize", onResize);

    const render = () => {
      const r = canvas.getBoundingClientRect();
      const t = (performance.now() - started) / 1000;
      ctx.clearRect(0, 0, r.width, r.height);
      const ease = Math.min(1, t / 1.6);
      for (const p of particles) {
        const dx = p.tx - p.x; const dy = p.ty - p.y;
        p.vx = (p.vx + dx * 0.02) * 0.86;
        p.vy = (p.vy + dy * 0.02) * 0.86;
        p.x += p.vx; p.y += p.vy;
        const wob = Math.sin(t * 2 + p.tx * 0.05) * (1 - ease) * 2;
        ctx.fillStyle = `rgba(255, ${107 + Math.floor(60 * ease)}, ${Math.floor(40 + 30 * ease)}, ${0.55 + 0.35 * ease})`;
        ctx.fillRect(p.x + wob, p.y, 1.6, 1.6);
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [text, subText]);

  return (
    <div className="relative w-full h-[34vh] min-h-[260px] max-h-[420px]">
      <canvas ref={canvasRef} className="w-full h-full" />
      <span className="sr-only">{text}</span>
    </div>
  );
}
