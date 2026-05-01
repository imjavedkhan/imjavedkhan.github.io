import { useEffect, useMemo, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { buildTree, findKey, type QueryResult } from "./btree/tree";
import { setQueryState, clearQueryState } from "./btree/queryStore";

// ============================================================
// Live B-Tree query playground.
// Type a number, watch the search path animate root → leaf in
// the 3D scene, with a hop count and faux latency readout.
// ============================================================

const HINTS = [17, 73, 105];

export function BTreeQueryPanel() {
  const nodes = useMemo(buildTree, []);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [step, setStep] = useState(0); // how many path entries are revealed
  const [reduced, setReduced] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);

  // Cleanup any pending timers on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (resumeRef.current) clearTimeout(resumeRef.current);
      clearQueryState();
    };
  }, []);

  function cancelTimers() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  }

  function runQuery(rawKey: number) {
    cancelTimers();
    const key = Math.max(0, Math.min(999, Math.round(rawKey)));
    const r = findKey(nodes, key);
    setResult(r);
    setStep(0);
    setQueryState({ path: r.path, step: 0, active: true });

    if (reduced) {
      setStep(r.path.length);
      setQueryState({ path: r.path, step: r.path.length, active: false });
    } else {
      const stagger = 250;
      r.path.forEach((_, i) => {
        const t = setTimeout(() => {
          setStep(i + 1);
          setQueryState({ path: r.path, step: i + 1, active: i + 1 < r.path.length });
        }, stagger * (i + 1));
        timeoutsRef.current.push(t);
      });
    }

    // Resume idle traversal after ~6s of inactivity.
    resumeRef.current = setTimeout(() => {
      clearQueryState();
      setResult(null);
      setStep(0);
    }, 6000);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(input);
    if (!Number.isFinite(n)) return;
    runQuery(n);
  }

  function onClear() {
    cancelTimers();
    clearQueryState();
    setInput("");
    setResult(null);
    setStep(0);
    inputRef.current?.focus();
  }

  return (
    <div
      className="pointer-events-auto w-full max-w-md rounded-md border border-border bg-background/75 font-mono text-[11px] text-muted-foreground shadow-[0_8px_32px_-12px_hsl(var(--background))] backdrop-blur-md sm:text-xs"
      role="region"
      aria-label="B-Tree query playground"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-1.5">
        <span className="uppercase tracking-[0.2em] text-primary">
          ─ btree.find(key)
        </span>
        {result && (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="Clear query"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Input row */}
      <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 py-2">
        <span className="text-primary">$ search &gt;</span>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          min={0}
          max={999}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 3))}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClear();
          }}
          placeholder="key"
          aria-label="Key to search for"
          className="w-20 border-b border-dashed border-border bg-transparent px-1 py-0.5 text-foreground outline-none transition-colors focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="submit"
          disabled={!input}
          className="inline-flex items-center gap-1 border border-primary/60 bg-primary/10 px-2 py-0.5 text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Run query"
        >
          <Play className="h-2.5 w-2.5" />
          <span>run</span>
        </button>
      </form>

      {/* Hint chips (only shown when no active result) */}
      {!result && (
        <div className="flex items-center gap-2 px-3 pb-2 text-[10px] text-muted-foreground/70">
          <span>try:</span>
          {HINTS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setInput(String(h));
                runQuery(h);
              }}
              className="rounded border border-border/60 px-1.5 py-0.5 transition-colors hover:border-primary hover:text-primary"
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {/* Result steps */}
      {result && (
        <div
          className="border-t border-border/70 px-3 py-2"
          aria-live="polite"
        >
          <ul className="space-y-0.5">
            {result.steps.map((s, i) => {
              const revealed = i < step;
              const isLast = i === result.steps.length - 1;
              return (
                <li
                  key={s.id}
                  className={`flex items-baseline gap-2 transition-opacity duration-200 ${
                    revealed ? "opacity-100" : "opacity-25"
                  }`}
                >
                  <span className="text-primary">→</span>
                  <span className="text-foreground">
                    {s.id}[{s.label}]
                  </span>
                  <span
                    className={
                      isLast && revealed
                        ? result.hit
                          ? "text-primary"
                          : "text-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {s.note}
                  </span>
                </li>
              );
            })}
          </ul>
          {step >= result.path.length && (
            <div className="mt-2 border-t border-border/40 pt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {result.hops} hops · O(log n) · {result.latencyMs.toFixed(2)}ms
            </div>
          )}
        </div>
      )}
    </div>
  );
}
