import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 grid gap-4 md:grid-cols-[200px,1fr] md:items-baseline">
          <p className="kicker-amber">// 03 / experience</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Commit log. <span className="text-muted-foreground">Reverse-chronological.</span>
          </h2>
        </header>

        <ol className="relative space-y-px border-l border-border">
          {experience.map((job, idx) => (
            <li key={job.company} className="relative grid gap-6 bg-background p-6 md:grid-cols-[200px,1fr] md:p-8">
              {/* node dot */}
              <span
                className="absolute -left-[5px] top-8 h-2.5 w-2.5 border border-primary bg-background"
                aria-hidden="true"
              />
              <div className="font-mono text-xs">
                <p className="text-primary">{job.range}</p>
                <p className="mt-1 text-muted-foreground">{job.location}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  // commit {String(experience.length - idx).padStart(3, "0")}
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {job.role}{" "}
                  <span className="text-muted-foreground">@ {job.company}</span>
                </h3>
                <ul className="mt-4 space-y-2 font-mono text-sm">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="select-none text-primary">›</span>
                      <span className="text-foreground/90">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
