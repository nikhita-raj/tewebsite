import { Search, Bell, FileDown, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="font-sub">Global Operations</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">FY26 Portfolio</span>
        </div>

        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:outline-none text-sm transition"
              placeholder="Search 44 initiatives, owners, regions…"
            />
            <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-card border border-border text-muted-foreground font-num">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-card border border-border hover:border-primary/40 transition"
          >
            <FileDown className="w-3.5 h-3.5" /> Generate VP Deck
          </motion.button>
          <button className="relative p-2 rounded-xl hover:bg-muted transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <div className="h-9 w-9 rounded-full bg-ember shadow-ember flex items-center justify-center text-white text-xs font-semibold font-num">EX</div>
        </div>
      </div>
    </header>
  );
}
