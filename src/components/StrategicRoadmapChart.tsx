import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

/**
 * Strategic Roadmap — Q1-Q2 FY26 → Q3-Q4 FY26 → FY27 & Beyond
 * Multi-curve flow with milestone dots and right-side captioned cards.
 * Stylistic match to the reference: pill column headers, dashed primary curve, calm grey context curves.
 */

type Milestone = { x: number; y: number; label?: string; primary?: boolean };
type Curve = { id: string; color: string; dashed?: boolean; points: { x: number; y: number }[] };

const COLUMNS = ["Q1–Q2 FY26", "Q3–Q4 FY26", "FY27 & Beyond"];

const milestones: Milestone[] = [
  { x: 0.06, y: 0.78, label: "Prioritize ION use case for O", primary: true },
  { x: 0.10, y: 0.62, label: "AWS Supply Chain & Safety", primary: true },
  { x: 0.16, y: 0.46, label: "Finalize IT assets and AI gov", primary: true },
  { x: 0.22, y: 0.71, label: "Supplier Inbound data repos", primary: true },
  { x: 0.27, y: 0.85, label: "Deploy Schedule Attainment", primary: true },
  { x: 0.31, y: 0.38, primary: true },
  { x: 0.38, y: 0.50, primary: true },
  { x: 0.44, y: 0.30 },
  { x: 0.50, y: 0.55 },
  { x: 0.52, y: 0.43 },
  { x: 0.55, y: 0.66 },
  { x: 0.60, y: 0.86 },
  { x: 0.66, y: 0.38 },
  { x: 0.70, y: 0.58 },
  { x: 0.76, y: 0.45 },
  { x: 0.78, y: 0.72 },
  { x: 0.84, y: 0.36 },
  { x: 0.88, y: 0.62 },
];

const curves: Curve[] = [
  { id: "primary", color: "hsl(var(--primary))", dashed: true, points: [
    { x: 0.06, y: 0.78 }, { x: 0.18, y: 0.42 }, { x: 0.34, y: 0.32 },
    { x: 0.50, y: 0.36 }, { x: 0.66, y: 0.34 }, { x: 0.86, y: 0.40 },
  ] },
  { id: "ctx1", color: "hsl(var(--border))", points: [
    { x: 0.08, y: 0.62 }, { x: 0.26, y: 0.58 }, { x: 0.46, y: 0.55 },
    { x: 0.62, y: 0.58 }, { x: 0.82, y: 0.55 },
  ] },
  { id: "ctx2", color: "hsl(var(--border))", points: [
    { x: 0.10, y: 0.82 }, { x: 0.30, y: 0.75 }, { x: 0.52, y: 0.70 },
    { x: 0.72, y: 0.68 }, { x: 0.92, y: 0.65 },
  ] },
];

const captions = [
  { title: "Digital Transformation", body: "Collaborate seamlessly with TEIS to enhance digital infrastructure." },
  { title: "AI Program", body: "Strategy established. Move quickly on vendor scale outs in identified use cases." },
  { title: "BI for Corporate Planning II", body: "Roadmap defined. Plan for building upstream planning cockpit." },
  { title: "BI for Corporate Planning I", body: "Foundation established for downstream planning. Focus on stability, performance & scale out." },
  { title: "BI for Global Logistics", body: "Forms baseline for entire analytics framework built in IT defined infrastructure." },
];

function smoothPath(pts: { x: number; y: number }[], W: number, H: number) {
  if (pts.length < 2) return "";
  const P = pts.map((p) => ({ x: p.x * W, y: p.y * H }));
  let d = `M ${P[0].x} ${P[0].y}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] ?? P[i];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function StrategicRoadmapChart() {
  const W = 900, H = 460;

  return (
    <div className="rounded-3xl bg-card border border-border p-6 lg:p-8 shadow-elev-md">
      <div className="flex items-center gap-2 text-sm font-medium mb-6">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>Completed or In-Process</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div className="relative">
          {/* column pills */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {COLUMNS.map((c) => (
              <div key={c} className="mx-auto px-4 py-1.5 rounded-full border border-border bg-muted/40 text-xs font-medium inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" /> {c}
              </div>
            ))}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* column dividers */}
            <line x1={W / 3} y1={0} x2={W / 3} y2={H} stroke="hsl(var(--border))" strokeDasharray="4 6" />
            <line x1={(2 * W) / 3} y1={0} x2={(2 * W) / 3} y2={H} stroke="hsl(var(--border))" strokeDasharray="4 6" />

            {/* curves */}
            {curves.map((c, idx) => (
              <motion.path
                key={c.id}
                d={smoothPath(c.points, W, H)}
                fill="none"
                stroke={c.color}
                strokeWidth={c.dashed ? 2.5 : 1.5}
                strokeDasharray={c.dashed ? "6 8" : ""}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: idx * 0.2, ease: "easeOut" }}
              />
            ))}

            {/* milestones */}
            {milestones.map((m, i) => {
              const cx = m.x * W; const cy = m.y * H;
              const color = m.primary ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)";
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.04, type: "spring", stiffness: 220, damping: 18 }}
                >
                  <circle cx={cx} cy={cy} r={m.primary ? 10 : 8} fill={color} opacity={m.primary ? 0.18 : 0.4} />
                  <circle cx={cx} cy={cy} r={m.primary ? 6 : 5} fill={m.primary ? "hsl(var(--primary))" : "hsl(var(--muted))"} stroke="white" strokeWidth={1.5} />
                  {m.label && (
                    <text x={cx} y={cy + 22} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{m.label}</text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* right captions */}
        <div className="space-y-3">
          {captions.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-muted/30 p-3"
            >
              <div className="text-xs font-bold">{c.title}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{c.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
