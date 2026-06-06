import { useEffect, useRef } from "react";

/**
 * Lightweight Canvas 2D neural network: nodes drift, lines connect nearby
 * nodes, gentle parallax follows the cursor. Cheap and "alive".
 */
export function NeuralHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5 };

    const N = 70;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 1 + Math.random() * 2,
    }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const px = (mouse.x - 0.5) * 30;
      const py = (mouse.y - 0.5) * 30;

      // links
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = (a.x - b.x), dy = (a.y - b.y);
          const d = Math.hypot(dx, dy);
          if (d < 0.14) {
            const alpha = (1 - d / 0.14) * 0.5;
            const grad = ctx.createLinearGradient(a.x * w, a.y * h, b.x * w, b.y * h);
            grad.addColorStop(0, `rgba(255,107,0,${alpha * 0.9})`);
            grad.addColorStop(1, `rgba(255,169,77,${alpha * 0.4})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x * w + px * a.r * 0.4, a.y * h + py * a.r * 0.4);
            ctx.lineTo(b.x * w + px * b.r * 0.4, b.y * h + py * b.r * 0.4);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        const cx = n.x * w + px * n.r * 0.4;
        const cy = n.y * h + py * n.r * 0.4;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r * 6);
        glow.addColorStop(0, "rgba(255,107,0,0.9)");
        glow.addColorStop(1, "rgba(255,107,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(cx, cy, n.r * 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,140,66,1)";
        ctx.beginPath(); ctx.arc(cx, cy, n.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}
