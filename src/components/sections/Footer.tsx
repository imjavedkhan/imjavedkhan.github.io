import { profile } from "@/data/portfolio";

export function Footer() {
  const buildHash = (Math.random().toString(16).slice(2, 9)).padEnd(7, "0");
  const ts = new Date().toISOString();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:grid-cols-3 sm:px-6">
        <div className="space-y-1">
          <p>
            <span className="text-primary">{profile.initials}</span>::engine-room
          </p>
          <p>build: {buildHash}</p>
          <p>deployed: {ts}</p>
        </div>
        <div className="space-y-1 sm:text-center">
          <p>theme: dark / amber / brutalist</p>
          <p>fonts: jetbrains mono · space grotesk · inter</p>
          <p>render: react · vite · r3f</p>
        </div>
        <div className="space-y-1 sm:text-right">
          <a href={profile.github} target="_blank" rel="noreferrer" className="link-amber">github ↗</a>
          <p>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-amber">linkedin ↗</a>
          </p>
          <p>
            <a href={`mailto:${profile.email}`} className="link-amber">{profile.email}</a>
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-4 font-mono text-[10px] text-muted-foreground sm:px-6">
          // © {new Date().getFullYear()} {profile.name}. all rights reserved.
        </p>
      </div>
    </footer>
  );
}
