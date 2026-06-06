import { motion } from "framer-motion";

/**
 * Strategic emphasis curves across transformation stages.
 * Inspired by Blue Ocean "competing factors" charts — categories rise/fall
 * across the journey from Current State -> Autonomous Enterprise.
 */

const stages = ["Current", "Automation", "AI Adoption", "Agentic AI", "Autonomous"];

// values 1..5 — "offering level" per category per stage
const series: { key: string; label: string; color: string; values: number[] }[] = [
  { key: "manual",      label: "Manual Work",       color: "var(--viz-5)",          values: [5, 4, 3, 2, 1] },
  { key: "automation",  label: "Automation",        color: "var(--viz-automation)", values: [1, 4, 4, 3, 2] },
  { key: "analytics",   label: "Analytics & Insight", color: "var(--viz-analytics)", values: [2, 3, 4, 4, 4] },
  { key: "ai",          label: "AI / ML",           color: "var(--viz-ai)",         values: [1, 2, 4, 5, 4] },
  { key: "agentic",     label: "Agentic AI",        color: "var(--viz-digital)",    values: [1, 1, 2, 4, 5] },
  { key: "human",       label: "Human Oversight",   color: "var(--viz-7))".replace("))",")"), values: [5, 4, 4, 3, 3] },
];

export function StrategyCurveChart() {
  const W = 880, H = 360;
  const padL = 70, padR = 160, padT = 30, padB = 50;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const stepX = innerW / (stages.length - 1);
  const yFor = (v: number) => padT + innerH - ((v - 1) / 4) * innerH;
  const xFor = (i: number) => padL + i * stepX;

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-elev-sm overflow-x-auto">
      <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Strategic Emphasis Curve</div>
          <h3 className="font-display font-bold text-xl mt-1">How capability investment shifts across the journey</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="inline-block w-4 h-0.5 bg-muted-foreground/40" /> Low → High investment
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[760px] font-num">
        {/* y axis labels */}
        {["High", "", "Med", "", "Low"].map((lbl, i) => {
          const y = padT + (i / 4) * innerH;
          return (
            <g key={i}>
              <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray={i === 0 || i === 4 ? "" : "3 4"} />
              <text x={padL - 12} y={y + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">{lbl}</text>
            </g>
          );
        })}
        <text x={20} y={padT + innerH / 2} fontSize="10" fill="hsl(var(--muted-foreground))" transform={`rotate(-90 20 ${padT + innerH / 2})`} textAnchor="middle" letterSpacing="2">OFFERING LEVEL</text>

        {/* x axis */}
        {stages.map((s, i) => (
          <g key={s}>
            <line x1={xFor(i)} x2={xFor(i)} y1={padT} y2={padT + innerH} stroke="hsl(var(--border))" opacity="0.5" />
            <text x={xFor(i)} y={padT + innerH + 22} textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))" fontWeight={600}>{s}</text>
          </g>
        ))}
        <text x={padL + innerW / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))" letterSpacing="2">TRANSFORMATION STAGE →</text>

        {/* series */}
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
          const color = `hsl(${s.color})`;
          return (
            <g key={s.key}>
              <motion.polyline
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: si * 0.15, ease: "easeOut" }}
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) => (
                <g key={i}>
                  <circle cx={xFor(i)} cy={yFor(v)} r={7} fill={color} opacity={0.18} />
                  <circle cx={xFor(i)} cy={yFor(v)} r={4} fill="white" stroke={color} strokeWidth={2.5} />
                </g>
              ))}
              {/* label at end */}
              <text x={xFor(stages.length - 1) + 12} y={yFor(s.values[s.values.length - 1]) + 4} fontSize="11" fill={color} fontWeight={700}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
