import { skills } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

function Bar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 font-mono text-[10px]" aria-label={`level ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-3 transition-colors duration-500 ${i < level ? "bg-primary" : "bg-surface-3"}`}
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 02 / skills">
          The kit. <span className="text-muted-foreground">Sharp where it counts.</span>
        </SectionHeader>

        <Reveal stagger={90} className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div
              key={group.label}
              data-stagger
              className="group bg-background p-6 transition-colors duration-300 hover:bg-surface"
            >
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
                    className="flex items-center justify-between border-b border-border/60 pb-2 transition-transform duration-200 last:border-0 hover:translate-x-1"
                  >
                    <span className="font-body text-sm">{it.name}</span>
                    <Bar level={it.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
