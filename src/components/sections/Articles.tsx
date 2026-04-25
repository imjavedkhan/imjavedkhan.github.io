import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { profile } from "@/data/portfolio";

type Rss2JsonResponse = {
  status: string;
  feed?: { title?: string; link?: string };
  items?: {
    title: string;
    pubDate: string;
    link: string;
    description: string;
    categories?: string[];
  }[];
};

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
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

  const items = (data?.items ?? []).slice(0, 6);
  const hasError = !!error || (data && data.status !== "ok");

  return (
    <section id="articles" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 grid gap-4 md:grid-cols-[200px,1fr] md:items-baseline">
          <p className="kicker-amber">// 05 / articles</p>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Writing. <span className="text-muted-foreground">Notes from production.</span>
            </h2>
            <a
              href={profile.rssFeedUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
            >
              rss ↗
            </a>
          </div>
        </header>

        {isLoading && (
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse-amber bg-background p-6">
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
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => {
              const desc = stripHtml(it.description);
              return (
                <a
                  key={it.link}
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col justify-between bg-background p-6 transition-colors hover:bg-surface"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      <time dateTime={it.pubDate}>
                        {new Date(it.pubDate).toISOString().slice(0, 10)}
                      </time>
                      <span>{readingTime(desc)} min</span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {it.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>read</span>
                    <ExternalLink className="h-3.5 w-3.5 text-primary" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {!isLoading && !hasError && items.length === 0 && (
          <p className="font-mono text-sm text-muted-foreground">// no items in feed yet</p>
        )}
      </div>
    </section>
  );
}
