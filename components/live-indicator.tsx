"use client";

import { motion } from "framer-motion";

export function LiveIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      className="flex items-center gap-2 rounded-full border border-whisper-border bg-surface-slate px-3 py-1.5"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-text">
        swarm online
      </span>
    </motion.div>
  );
}
