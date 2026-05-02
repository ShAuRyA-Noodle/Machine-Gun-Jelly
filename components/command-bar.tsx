"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Microphone } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const PROMPTS = [
  "plan my saturday in mumbai, foodie + chill, ₹3000",
  "best laptop for ML under ₹1.5L delivered to mumbai",
  "watch iphone 17 and buy under ₹89k",
  "reply to all unread emails in my voice",
  "weekend in goa for two, under ₹15k",
];

export function CommandBar() {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState(PROMPTS[0]);
  const [streaming, setStreaming] = useState(false);
  const [reply, setReply] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle the placeholder while idle.
  useEffect(() => {
    if (value || streaming) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PROMPTS.length;
      setPlaceholder(PROMPTS[i] ?? PROMPTS[0]);
    }, 2800);
    return () => clearInterval(id);
  }, [value, streaming]);

  // Cmd+K / Ctrl+K to focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function submit() {
    if (!value.trim() || streaming) return;
    setStreaming(true);
    setReply("");
    try {
      const res = await fetch("/api/echo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        setReply(acc);
      }
    } catch (err) {
      setReply(`error: ${(err as Error).message}`);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="w-full">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-2xl border bg-surface-slate px-5 py-4 shadow-diffusion transition-colors",
          "border-whisper-border focus-within:border-whisper-border-strong"
        )}
      >
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-subtle-text md:inline">
          ask
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder={placeholder}
          aria-label="Ask Machine Gun Jelly"
          className="flex-1 bg-transparent text-base text-charcoal-text placeholder:text-subtle-text outline-none md:text-lg"
        />
        <button
          type="button"
          aria-label="Voice input (coming soon)"
          className="grid h-9 w-9 place-items-center rounded-full border border-whisper-border text-muted-text transition-colors hover:border-whisper-border-strong hover:text-charcoal-text"
        >
          <Microphone size={16} weight="regular" />
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || streaming}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-all duration-200",
            "bg-charcoal-text text-canvas-ink",
            "hover:scale-[1.04] active:translate-y-[1px]",
            "disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-subtle-text"
          )}
          aria-label="Send"
        >
          <ArrowRight size={16} weight="bold" />
        </button>
      </motion.div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle-text">
          press <kbd className="rounded border border-whisper-border px-1.5 py-0.5 text-[10px] text-muted-text">⌘K</kbd>{" "}
          to focus · <kbd className="rounded border border-whisper-border px-1.5 py-0.5 text-[10px] text-muted-text">⏎</kbd> to send
        </span>
        {streaming && (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-status-live">
            streaming
          </span>
        )}
      </div>

      {reply && (
        <motion.pre
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mt-6 max-h-[40vh] overflow-auto rounded-2xl border border-whisper-border bg-surface-slate p-5 font-mono text-sm leading-relaxed text-charcoal-text shadow-diffusion whitespace-pre-wrap break-words"
        >
          {reply}
        </motion.pre>
      )}
    </div>
  );
}
