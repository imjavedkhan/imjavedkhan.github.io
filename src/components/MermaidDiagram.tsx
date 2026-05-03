import { useEffect, useId, useState } from "react";
import { Maximize2, X } from "lucide-react";

// Cache rendered SVGs across mounts so re-opening a panel is instant.
const svgCache = new Map<string, string>();
let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        fontFamily: '"JetBrains Mono", monospace',
        themeVariables: {
          background: "#0A0A0B",
          primaryColor: "#18181B",
          primaryTextColor: "#E4E4E7",
          primaryBorderColor: "#F59E0B",
          lineColor: "#52525B",
          secondaryColor: "#27272A",
          tertiaryColor: "#18181B",
          fontSize: "13px",
        },
      });
      return m.default;
    });
  }
  return mermaidPromise;
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>(() => svgCache.get(chart) ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const cached = svgCache.get(chart);
    if (cached) {
      setSvg(cached);
      return;
    }
    let alive = true;
    loadMermaid()
      .then((m) => m.render(`m-${id}`, chart))
      .then(({ svg }) => {
        svgCache.set(chart, svg);
        if (alive) setSvg(svg);
      })
      .catch((e) => {
        if (alive) setErr(String(e?.message ?? e));
      });
    return () => {
      alive = false;
    };
  }, [chart, id]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

  if (err) {
    return (
      <pre className="overflow-auto p-4 font-mono text-xs text-destructive">
        {err}
      </pre>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Expand diagram to fullscreen"
          className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <Maximize2 className="h-3 w-3" aria-hidden="true" /> expand
        </button>
        {svg ? (
          <div
            className="mermaid-host flex w-full items-center justify-center overflow-auto p-6 [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center font-mono text-xs text-muted-foreground">
            rendering diagram…
          </div>
        )}
      </div>

      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Architecture diagram fullscreen"
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>// architecture.mmd</span>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen"
              className="inline-flex items-center gap-1 border border-border px-2 py-1 transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-3 w-3" aria-hidden="true" /> close
            </button>
          </div>
          <div
            className="mermaid-host flex flex-1 items-center justify-center overflow-auto p-8 [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      )}
    </>
  );
}
