import { experience } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { useReveal } from "@/hooks/useReveal";

export function Experience() {
  const { ref, shown } = useReveal<HTMLOListElement>({
    threshold: 0.05,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section id="experience" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 03 / experience">
          Commit log. <span className="text-muted-foreground">Reverse-chronological.</span>
        </SectionHeader>

        <ol ref={ref} className="relative space-y-px border-l border-border">
          {/* Animated draw-line over the static border */}
          <span
            aria-hidden="true"
            className="absolute -left-px top-0 w-px origin-top bg-primary transition-transform duration-[1400ms] ease-out"
            style={{
              height: "100%",
              transform: shown ? "scaleY(1)" : "scaleY(0)",
            }}
          />
          {experience.map((job, idx) => (
            <Reveal
              as="li"
              key={job.company}
              variant="up"
              delay={idx * 80}
              className="relative grid gap-6 bg-background p-6 md:grid-cols-[200px,1fr] md:p-8"
            >
              <span
                className="absolute -left-[5px] top-8 h-2.5 w-2.5 border border-primary bg-background transition-shadow duration-300 hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.25)]"
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
                    <li key={b} className="flex gap-3 transition-transform duration-200 hover:translate-x-1">
                      <span className="select-none text-primary">›</span>
                      <span className="text-foreground/90">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
