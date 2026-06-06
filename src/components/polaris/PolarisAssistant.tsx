import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { projects, portfolioStats } from "@/data/projects";
import { formatShort } from "../ProjectCard";

type Msg = { role: "user" | "polaris"; content: React.ReactNode };

const suggestions = [
  "Which projects generate the highest value?",
  "Show AI projects",
  "Show EMIA projects",
  "Which projects finish this quarter?",
  "Summarize the portfolio",
];

function answer(q: string): React.ReactNode {
  const ql = q.toLowerCase();
  if (ql.includes("highest") || ql.includes("top") || ql.includes("value")) {
    const top = [...projects].sort((a, b) => b.annualSavings - a.annualSavings).slice(0, 5);
    return (
      <div>
        <p className="mb-2">Top 5 by estimated annual value:</p>
        <ul className="space-y-1.5">
          {top.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 text-xs">
              <Link to={`/projects/${p.id}`} className="hover:text-primary truncate">{p.name}</Link>
              <span className="font-num font-bold text-foreground">${formatShort(p.annualSavings)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (ql.includes("ai")) {
    const list = projects.filter((p) => p.category === "AI");
    return <ChipList title={`${list.length} AI initiatives`} ids={list.slice(0, 8)} />;
  }
  if (ql.includes("emia")) {
    const list = projects.filter((p) => p.region === "EMIA");
    return <ChipList title={`${list.length} EMIA projects`} ids={list.slice(0, 8)} />;
  }
  if (ql.includes("amer")) {
    const list = projects.filter((p) => p.region === "AMER");
    return <ChipList title={`${list.length} AMER projects`} ids={list.slice(0, 8)} />;
  }
  if (ql.includes("quarter") || ql.includes("finish") || ql.includes("delayed")) {
    const live = projects.filter((p) => p.status === "Live");
    const wip = projects.filter((p) => p.status === "In Progress");
    return (
      <div className="space-y-2">
        <p>{live.length} initiatives are live. {wip.length} are in delivery this fiscal year.</p>
        <p className="text-xs text-muted-foreground">Open the <Link to="/gantt" className="text-primary underline">Portfolio Gantt</Link> for the full quarterly view.</p>
      </div>
    );
  }
  if (ql.includes("summar") || ql.includes("portfolio") || ql.includes("update")) {
    return (
      <div className="space-y-1.5 text-sm">
        <p><strong className="font-num">{portfolioStats.activeProjects}</strong> active initiatives across AI, Automation, Analytics and Digital Transformation.</p>
        <p>Recovering <strong className="font-num">{portfolioStats.weeklyHoursSaved.toLocaleString()}</strong> hours / week ({portfolioStats.fteSavings} FTE) and generating ~<strong className="font-num">${formatShort(portfolioStats.estimatedAnnualValue)}</strong> in annualized value.</p>
        <p className="text-xs text-muted-foreground">Health score 94/100. Portfolio is on plan.</p>
      </div>
    );
  }
  return <p>I can summarize the portfolio, filter by region or category, or surface delayed initiatives. Try one of the suggestions below.</p>;
}

function ChipList({ title, ids }: { title: string; ids: typeof projects }) {
  return (
    <div>
      <p className="mb-2">{title}:</p>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`} className="text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-ember-soft hover:text-primary transition truncate max-w-[180px]">
            {p.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PolarisAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "polaris", content: "I'm Polaris — your portfolio copilot. Ask anything about the 44 active initiatives." },
  ]);
  const send = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", content: q }, { role: "polaris", content: answer(q) }]);
    setInput("");
  };
  const _ = useMemo(() => projects.length, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-ember blur-2xl opacity-50 group-hover:opacity-80 transition" />
        <span className="relative flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-ember text-white shadow-ember">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">Polaris AI</span>
          <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-24 right-6 z-40 w-[min(420px,calc(100vw-2rem))] h-[560px] max-h-[80vh] glass-strong rounded-3xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ember flex items-center justify-center shadow-ember">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="font-display font-bold text-sm">Polaris AI</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Portfolio Copilot</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "bg-ember text-white" : "bg-muted/70 text-foreground"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-border">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-ember-soft hover:text-primary transition">{s}</button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="px-4 py-3 border-t border-border flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Polaris…"
                className="flex-1 bg-muted/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:bg-card focus:ring-1 focus:ring-primary/40"
              />
              <button type="submit" className="p-2 rounded-xl bg-ember text-white shadow-ember"><ArrowUp className="w-4 h-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
