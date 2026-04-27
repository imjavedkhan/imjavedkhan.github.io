import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

type Rss2JsonResponse = {
  status: string;
  feed?: { title?: string; link?: string };
  items?: {
    title: string;
    pubDate: string;
    link: string;
    description: string;
    content?: string;
    thumbnail?: string;
    enclosure?: { link?: string; type?: string };
    categories?: string[];
  }[];
};

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extractImage(it: {
  thumbnail?: string;
  enclosure?: { link?: string };
  content?: string;
  description?: string;
}): string | null {
  if (it.thumbnail && /^https?:\/\//.test(it.thumbnail)) return it.thumbnail;
  if (it.enclosure?.link && /^https?:\/\//.test(it.enclosure.link)) return it.enclosure.link;
  const html = `${it.content ?? ""} ${it.description ?? ""}`;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function readingTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

async function fetchFeed(): Promise<Rss2JsonResponse> {
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(profile.rssFeedUrl)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`rss2json ${res.status}`);
  return res.json();
}

export function Articles() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rss-feed", profile.rssFeedUrl],
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const items = data?.items ?? [];
  const hasError = !!error || (data && data.status !== "ok");

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons, items.length]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-article-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 1.5, behavior: "smooth" });
  };

  return (
    <section id="articles" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 05 / articles">
          Writing. <span className="text-muted-foreground">Notes from production.</span>
          <a
            href={profile.rssFeedUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-4 align-middle font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            rss ↗
          </a>
        </SectionHeader>

        {isLoading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 w-[320px] shrink-0 animate-pulse-amber bg-surface p-6"
              >
                <div className="h-3 w-24 bg-surface-3" />
                <div className="mt-4 h-5 w-3/4 bg-surface-3" />
                <div className="mt-2 h-5 w-2/3 bg-surface-3" />
              </div>
            ))}
          </div>
        )}

        {hasError && !isLoading && (
          <div className="panel p-8 text-center font-mono text-sm text-muted-foreground">
            <p>
              <span className="text-destructive">[ERR]</span> could not fetch feed
            </p>
            <p className="mt-2 text-xs">
              update <code className="text-primary">profile.rssFeedUrl</code> in{" "}
              <code className="text-primary">src/data/portfolio.ts</code> to a valid RSS feed.
            </p>
          </div>
        )}

        {!isLoading && !hasError && items.length > 0 && (
          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {items.length} {items.length === 1 ? "post" : "posts"} — scroll →
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollByCards(-1)}
                  disabled={!canPrev}
                  aria-label="Scroll left"
                  className="flex h-9 w-9 items-center justify-center border border-border bg-surface text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCards(1)}
                  disabled={!canNext}
                  aria-label="Scroll right"
                  className="flex h-9 w-9 items-center justify-center border border-border bg-surface text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="edge-fade-x">
              <div
                ref={scrollerRef}
                className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-color:hsl(var(--primary))_transparent] [scrollbar-width:thin] sm:-mx-6 sm:px-6"
              >
                {items.map((it, idx) => {
                  const desc = stripHtml(it.description);
                  const img = extractImage(it);
                  return (
                    <a
                      key={it.link}
                      data-article-card
                      href={it.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ animationDelay: `${idx * 80}ms` }}
                      className="lift-card animate-fade-in group flex w-[300px] shrink-0 snap-start flex-col border border-border bg-background transition-colors hover:border-primary hover:bg-surface sm:w-[360px]"
                    >
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-surface-3">
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          // no image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          <time dateTime={it.pubDate}>
                            {new Date(it.pubDate).toISOString().slice(0, 10)}
                          </time>
                          <span>{readingTime(desc)} min</span>
                        </div>
                        <h3 className="mt-3 line-clamp-3 font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {it.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <span>read</span>
                        <ExternalLink className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                  </a>
                );
                })}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !hasError && items.length === 0 && (
          <p className="font-mono text-sm text-muted-foreground">// no items in feed yet</p>
        )}
      </div>
    </section>
  );
}
