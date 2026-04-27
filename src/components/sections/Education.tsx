import { education } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export function Education() {
  return (
    <section id="education" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 06 / education">
          Foundations. <span className="text-muted-foreground">Where the curiosity got serious.</span>
        </SectionHeader>

        <Reveal stagger={120} className="grid gap-px bg-border md:grid-cols-2">
          {education.map((e) => (
            <div
              key={e.school}
              data-stagger
              className="space-y-3 bg-background p-6 transition-colors duration-300 hover:bg-surface sm:p-8"
            >
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
        </Reveal>
      </div>
    </section>
  );
}
