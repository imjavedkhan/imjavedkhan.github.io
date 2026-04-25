import { skills } from "@/data/portfolio";

function Bar({ level }: { level: number }) {
  // 5 segments, brutalist mono blocks
  return (
    <div className="flex gap-0.5 font-mono text-[10px]" aria-label={`level ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-3 ${i < level ? "bg-primary" : "bg-surface-3"}`}
        />
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 grid gap-4 md:grid-cols-[200px,1fr] md:items-baseline">
          <p className="kicker-amber">// 02 / skills</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            The kit. <span className="text-muted-foreground">Sharp where it counts.</span>
          </h2>
        </header>

        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.label} className="bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  // {group.label}
                </h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {group.items.length} entries
                </span>
              </div>
              <ul className="space-y-3">
                {group.items.map((it) => (
                  <li
                    key={it.name}
                    className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0"
                  >
                    <span className="font-body text-sm">{it.name}</span>
                    <Bar level={it.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
