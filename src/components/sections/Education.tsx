import { ExternalLink, FileBadge } from "lucide-react";
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
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                  {e.range}
                </p>
                {e.certificateUrl && (
                  <a
                    href={e.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${e.school} certificate`}
                    title="View certificate"
                    className="group inline-flex items-center gap-1.5 border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                  >
                    <FileBadge className="h-3.5 w-3.5" />
                    <span>certificate</span>
                    <ExternalLink className="h-3 w-3 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
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
