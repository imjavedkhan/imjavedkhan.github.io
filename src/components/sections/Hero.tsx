import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { BTreeHero } from "../BTreeHero";
import { profile } from "@/data/portfolio";

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (bgRef.current) {
        // gentle parallax: background translates slower than scroll
        bgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + Math.min(y, 600) * 0.0002})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden border-b border-border"
    >
      {/* 3D background with parallax */}
      <div ref={bgRef} className="pointer-events-auto absolute inset-0 -z-10 will-change-transform">
        <BTreeHero />
        {/* gradient veil so foreground text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Top hairline meta strip */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-20 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground sm:px-6">
        <span>// engine-room/v1</span>
        <span className="hidden sm:inline">node://btree · depth=3 · fanout=3</span>
        <span>{profile.location}</span>
      </div>

      {/* Centerpiece */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        {profile.availableForHire && (
          <a
            href="#contact"
            className="group mb-5 inline-flex w-fit max-w-full animate-fade-in items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary/15 hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]"
            style={{ animationDelay: "50ms" }}
            aria-label={`${profile.availabilityText} — contact me`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            </span>
            <span className="truncate normal-case tracking-[0.12em]">{profile.availabilityText}</span>
            <span className="shrink-0 text-primary/60 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
        )}
        <p className="kicker-amber animate-fade-in" style={{ animationDelay: "100ms" }}>
          // senior backend engineer
        </p>
        <h1 className="word-fade mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-[8.5rem]">
          <span className="block" style={{ animationDelay: "200ms" }}>BACKEND.</span>
          <span className="block" style={{ animationDelay: "400ms" }}>DISTRIBUTED.</span>
          <span className="block text-primary" style={{ animationDelay: "600ms" }}>
            CORRECT<span className="text-foreground">.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-[2fr,1fr] md:items-end">
          <p
            className="max-w-xl animate-fade-in font-body text-base text-muted-foreground sm:text-lg text-pretty"
            style={{ animationDelay: "900ms" }}
          >
            <span className="font-mono text-primary">{profile.name}</span> — {profile.tagline}
          </p>

          <div
            className="flex animate-fade-in flex-wrap gap-3 md:justify-end"
            style={{ animationDelay: "1100ms" }}
          >
            <a
              href={profile.resumeUrl}
              className="group inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-primary-glow hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5"
            >
              <span>./resume.pdf</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <span className="text-primary">$</span> ./contact
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              gh: {profile.github.split("/").pop()}
            </a>
          </div>
        </div>
      </div>

      {/* bottom hairline log strip */}
      <div className="border-t border-border bg-background/70 backdrop-blur-sm">
        <LogTicker />
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute bottom-20 right-6 hidden flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex">
        <span>scroll</span>
        <ArrowDown className="h-3 w-3 animate-bounce text-primary" />
      </div>
    </section>
  );
}

const logLines = [
  "[INFO] gateway: accepted conn id=8a3f from 10.0.4.12",
  "[OK]   ledger: appended offset=42188317 dur=0.81ms",
  "[WARN] kafka: rebalance triggered, partitions=24",
  "[OK]   pg: vacuum complete, freed=1.2GB",
  "[INFO] otel: span exported trace=ab12.. parent=root",
  "[OK]   k8s: rollout 'payments-api' surge=1 unavail=0",
  "[INFO] redis: replication lag=4ms slaves=3",
  "[OK]   tls: handshake completed, cipher=TLS_AES_128_GCM",
];

function LogTicker() {
  const doubled = [...logLines, ...logLines];
  return (
    <div className="scanline-mask overflow-hidden">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap px-6 py-2 font-mono text-[11px] text-muted-foreground">
        {doubled.map((l, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
