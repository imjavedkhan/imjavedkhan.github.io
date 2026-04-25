import { education } from "@/data/portfolio";

export function Education() {
  return (
    <section id="education" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 grid gap-4 md:grid-cols-[200px,1fr] md:items-baseline">
          <p className="kicker-amber">// 06 / education</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Foundations. <span className="text-muted-foreground">Where the curiosity got serious.</span>
          </h2>
        </header>

        <div className="grid gap-px bg-border md:grid-cols-2">
          {education.map((e) => (
            <div key={e.school} className="space-y-3 bg-background p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                {e.range}
              </p>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {e.school}
              </h3>
              <p className="font-mono text-sm text-foreground/90">{e.degree}</p>
              {e.notes && (
                <p className="text-sm text-muted-foreground">{e.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
