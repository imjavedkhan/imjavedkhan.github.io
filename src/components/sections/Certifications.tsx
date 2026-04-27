import { ShieldCheck } from "lucide-react";
import { certifications } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export function Certifications() {
  return (
    <section id="certifications" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 07 / certifications">
          Verified. <span className="text-muted-foreground">Receipts attached.</span>
        </SectionHeader>

        <Reveal stagger={90} className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-2">
          {certifications.map((c) => {
            const Wrap: React.ElementType = c.url ? "a" : "div";
            return (
              <Wrap
                key={c.name}
                data-stagger
                {...(c.url ? { href: c.url, target: "_blank", rel: "noreferrer" } : {})}
                className="group flex items-start gap-4 bg-background p-6 transition-colors hover:bg-surface"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-primary transition-all duration-300 group-hover:border-primary group-hover:rotate-[-6deg] group-hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.18)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {c.issuer} · {c.date}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {c.name}
                  </h3>
                  {c.credentialId && (
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      id: <span className="text-foreground/80">{c.credentialId}</span>
                    </p>
                  )}
                </div>
              </Wrap>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
