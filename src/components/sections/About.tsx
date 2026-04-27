import { profile, aboutLines, stats } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export function About() {
  return (
    <section id="about" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 01 / about">
          Engineer of systems that <span className="text-primary">don't get to crash</span>.
        </SectionHeader>

        <div className="grid gap-8 md:grid-cols-3">
          <Reveal as="article" variant="left" className="md:col-span-2">
            <div className="code-frame">
              <div className="code-frame-header">
                <span>~ / README.md</span>
                <span className="text-primary">● live</span>
              </div>
              <Reveal stagger={90} className="space-y-4 p-6 font-body text-base leading-relaxed text-foreground/90 sm:p-8">
                {aboutLines.map((line, i) => (
                  <p key={i} data-stagger>
                    <span className="mr-3 select-none font-mono text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {line}
                  </p>
                ))}
                <p data-stagger className="pt-2 font-mono text-sm text-muted-foreground">
                  $ ping {profile.email} <span className="cursor-blink" />
                </p>
              </Reveal>
            </div>
          </Reveal>

          <Reveal as="aside" variant="right" delay={120} className="space-y-3">
            <p className="kicker">// stats.json</p>
            <Reveal stagger={80} className="panel divide-y divide-border">
              {stats.map((s) => (
                <div
                  key={s.label}
                  data-stagger
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
            </Reveal>
            <p className="font-mono text-[11px] text-muted-foreground">
              // updated {new Date().toISOString().slice(0, 10)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
