import { ArrowDown } from "lucide-react";
import { BTreeHero } from "../BTreeHero";
import { profile } from "@/data/portfolio";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden border-b border-border"
    >
      {/* 3D background */}
      <div className="pointer-events-auto absolute inset-0 -z-10">
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
        <p className="kicker-amber animate-fade-in">// senior backend engineer</p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-7xl md:text-[8.5rem] animate-fade-in">
          <span className="block">BACKEND.</span>
          <span className="block">DISTRIBUTED.</span>
          <span className="block text-primary">CORRECT<span className="text-foreground">.</span></span>
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-[2fr,1fr] md:items-end">
          <p className="max-w-xl font-body text-base text-muted-foreground sm:text-lg text-pretty animate-fade-in">
            <span className="font-mono text-primary">{profile.name}</span> — {profile.tagline}
          </p>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href={profile.resumeUrl}
              className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary-glow"
            >
              <span>./resume.pdf</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <span className="text-primary">$</span> ./contact
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
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
