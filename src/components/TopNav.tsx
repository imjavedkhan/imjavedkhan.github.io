import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/portfolio";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [open, setOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
        scrolled || open
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

        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group relative px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  active === s.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px h-px origin-center bg-primary transition-transform duration-300 ${
                    active === s.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={profile.resumeUrl}
            className="hidden items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary lg:inline-flex"
          >
            <span className="text-primary">$</span> resume.pdf
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-4 py-3 sm:px-6">
          {sections.map((s, idx) => (
            <li
              key={s.id}
              className={`transition-all duration-300 ${
                open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
            >
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-border/50 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  active === s.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>
                  <span className="text-primary">/</span> {s.label}
                </span>
                {active === s.id && (
                  <span className="h-1.5 w-1.5 rounded-sm bg-primary" aria-hidden="true" />
                )}
              </a>
            </li>
          ))}
          <li className="pt-3">
            <a
              href={profile.resumeUrl}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <span className="text-primary">$</span> resume.pdf
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
