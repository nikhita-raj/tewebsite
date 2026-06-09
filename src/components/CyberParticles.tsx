import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number;
  size: number; alpha: number; targetAlpha: number;
}

/**
 * Cinematic particle field — slow drift, depth via size+speed,
 * subtle cursor parallax. Designed as ambient background, not focus.
 */
export function CyberParticles({ density = 90, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: density }, () => makeParticle(w, h));
    };

    const makeParticle = (W: number, H: number): Particle => {
      const z = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z,
        vx: (Math.random() - 0.5) * (0.12 + z * 0.25),
        vy: (Math.random() - 0.5) * (0.12 + z * 0.25),
        size: 0.4 + z * 2.2,
        alpha: 0,
        targetAlpha: 0.15 + z * 0.55,
      };
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      mouse.current.ty = (e.clientY - rect.top - rect.height / 2) / rect.height;
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

      // connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 110 * 110) {
            const a = (1 - Math.sqrt(d2) / 110) * 0.18 * Math.min(p.z, q.z);
            ctx.strokeStyle = `hsla(0, 84%, 55%, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        // cursor parallax based on depth
        const px = p.x + mouse.current.x * 30 * p.z;
        const py = p.y + mouse.current.y * 30 * p.z;

        p.x += p.vx; p.y += p.vy;
        // gentle alpha breathing
        p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        if (Math.random() < 0.004) p.targetAlpha = 0.1 + Math.random() * 0.7 * p.z;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // red core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 84%, 60%, ${p.alpha})`;
        ctx.fill();
        // soft glow halo
        if (p.z > 0.6) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0, 84%, 55%, ${p.alpha * 0.08})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [density]);

  return <canvas ref={ref} className={`absolute inset-0 w-full h-full ${className}`} aria-hidden />;
}
