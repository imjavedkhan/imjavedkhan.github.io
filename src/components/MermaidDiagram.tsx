import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
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

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    mermaid
      .render(`m-${id}`, chart)
      .then(({ svg }) => {
        if (alive) setSvg(svg);
      })
      .catch((e) => {
        if (alive) setErr(String(e?.message ?? e));
      });
    return () => {
      alive = false;
    };
  }, [chart, id]);

  if (err) {
    return (
      <pre className="overflow-auto p-4 font-mono text-xs text-destructive">
        {err}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-host flex w-full items-center justify-center overflow-auto p-6 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
