import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Standard section header with kicker + title + drawn amber underline.
 */
export function SectionHeader({
  kicker,
  children,
}: {
  kicker: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="header" className="mb-12 grid gap-4 md:grid-cols-[200px,1fr] md:items-baseline">
      <p className="kicker-amber">{kicker}</p>
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          {children}
        </h2>
        <span className="reveal-underline mt-3 block h-px w-24 origin-left bg-primary" aria-hidden="true" />
      </div>
    </Reveal>
  );
}
