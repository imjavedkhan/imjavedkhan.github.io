import { profile, aboutLines, stats } from "@/data/portfolio";

export function About() {
  return (
    <section id="about" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 grid gap-4 md:grid-cols-[200px,1fr] md:items-baseline">
          <p className="kicker-amber">// 01 / about</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Engineer of systems that <span className="text-primary">don't get to crash</span>.
          </h2>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="md:col-span-2">
            <div className="code-frame">
              <div className="code-frame-header">
                <span>~ / README.md</span>
                <span className="text-primary">● live</span>
              </div>
              <div className="space-y-4 p-6 font-body text-base leading-relaxed text-foreground/90 sm:p-8">
                {aboutLines.map((line, i) => (
                  <p key={i}>
                    <span className="mr-3 select-none font-mono text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {line}
                  </p>
                ))}
                <p className="pt-2 font-mono text-sm text-muted-foreground">
                  $ ping {profile.email} <span className="cursor-blink" />
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-3">
            <p className="kicker">// stats.json</p>
            <div className="panel divide-y divide-border">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between px-4 py-4"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="font-display text-3xl font-semibold tabular-nums text-primary">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              // updated {new Date().toISOString().slice(0, 10)}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
