import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ChevronRight, ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
import { MermaidDiagram } from "../MermaidDiagram";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

// Engine Room — custom Prism theme (amber on slate)
const theme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "#E4E4E7",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "13px",
    lineHeight: "1.6",
    background: "transparent",
  },
  'pre[class*="language-"]': {
    color: "#E4E4E7",
    background: "transparent",
    padding: "1rem 1.25rem",
    margin: 0,
    overflow: "auto",
  },
  comment: { color: "#52525B", fontStyle: "italic" },
  punctuation: { color: "#71717A" },
  property: { color: "#F59E0B" },
  keyword: { color: "#F59E0B" },
  "class-name": { color: "#FCD34D" },
  function: { color: "#FCD34D" },
  string: { color: "#A1A1AA" },
  number: { color: "#FBBF24" },
  operator: { color: "#A1A1AA" },
  builtin: { color: "#F59E0B" },
  boolean: { color: "#F59E0B" },
};

export function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="work" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 04 / work">
          Selected work. <span className="text-muted-foreground">Diagrams + the interesting bit.</span>
        </SectionHeader>

        <div className="space-y-12">
          {projects.map((p, i) => (
            <Reveal
              as="article"
              key={p.slug}
              variant="up"
              delay={i * 60}
              className="panel-strong lift-card"
            >
              {/* Header bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`p-${p.slug}-body`}
                  className="flex items-center gap-2 text-left transition-colors hover:text-primary"
                >
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${openIndex === i ? "rotate-90" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="text-primary">project/{String(i + 1).padStart(2, "0")}</span>
                  <span>· {p.slug}</span>
                </button>
                <span className="flex items-center gap-3">
                  {p.metrics.map((m) => (
                    <span key={m.label}>
                      <span className="text-foreground">{m.value}</span>
                      <span className="ml-1 text-muted-foreground">{m.label}</span>
                    </span>
                  ))}
                </span>
              </div>

              {openIndex === i && (
              <div id={`p-${p.slug}-body`} className="grid gap-px bg-border md:grid-cols-2">
                {/* Left: title + summary + stack + links */}
                <div className="space-y-5 bg-background p-6 sm:p-8">
                  <div>
                    <h3
                      id={`p-${p.slug}-title`}
                      className="font-display text-3xl font-semibold tracking-tight"
                    >
                      {p.title}
                    </h3>
                    <p className="mt-3 text-pretty text-base text-muted-foreground">
                      {p.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="code-frame">
                    <div className="code-frame-header">
                      <span>{p.code.title}</span>
                      <span className="text-primary">{p.code.lang}</span>
                    </div>
                    <SyntaxHighlighter language={p.code.lang} style={theme} wrapLongLines>
                      {p.code.body}
                    </SyntaxHighlighter>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                      >
                        <Github className="h-3.5 w-3.5" /> repo
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> demo
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: mermaid diagram */}
                <div className="relative bg-background">
                  <div className="absolute left-3 top-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    // architecture.mmd
                  </div>
                  <div className="bg-grid">
                    <MermaidDiagram chart={p.diagram} />
                  </div>
                </div>
              </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
