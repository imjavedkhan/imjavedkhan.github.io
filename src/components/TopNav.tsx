import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";

const sections = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "experience", label: "experience" },
  { id: "work", label: "work" },
  { id: "articles", label: "articles" },
  { id: "education", label: "education" },
  { id: "certifications", label: "certs" },
  { id: "contact", label: "contact" },
];

export function TopNav() {
  const [active, setActive] = useState<string>("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2 font-mono text-sm">
          <span className="inline-block h-2 w-2 animate-pulse-amber rounded-sm bg-primary" aria-hidden="true" />
          <span className="text-foreground">{profile.initials}</span>
          <span className="text-muted-foreground">::</span>
          <span className="text-muted-foreground transition-colors group-hover:text-primary">engine-room</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`relative px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  active === s.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
                {active === s.id && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-primary" aria-hidden="true" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.resumeUrl}
          className="hidden items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex"
        >
          <span className="text-primary">$</span> resume.pdf
        </a>
      </div>
    </nav>
  );
}
