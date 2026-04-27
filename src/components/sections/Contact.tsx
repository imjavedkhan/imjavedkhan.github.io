import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { profile } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const banner: Line[] = [
  { kind: "out", text: "engine-room // contact terminal v1.0.0" },
  { kind: "out", text: `connected as guest@${profile.initials.toLowerCase()}.dev — type 'help' for commands` },
];

const helpText = [
  "available commands:",
  "  help        — show this message",
  "  whoami      — about me",
  "  email       — open mail client",
  "  github      — open GitHub profile",
  "  linkedin    — open LinkedIn",
  "  twitter     — open X / Twitter",
  "  resume      — download CV",
  "  clear       — clear screen",
];

export function Contact() {
  const [history, setHistory] = useState<Line[]>(banner);
  const [input, setInput] = useState("");
  const [cmdIdx, setCmdIdx] = useState<number>(-1);
  const [past, setPast] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    wrapRef.current?.scrollTo({ top: wrapRef.current.scrollHeight });
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const next: Line[] = [{ kind: "in", text: raw }];

    switch (cmd) {
      case "":
        break;
      case "help":
        helpText.forEach((t) => next.push({ kind: "out", text: t }));
        break;
      case "whoami":
        next.push({ kind: "ok", text: `${profile.name} — ${profile.role}` });
        next.push({ kind: "out", text: profile.tagline });
        next.push({ kind: "out", text: `loc: ${profile.location}` });
        break;
      case "email":
        next.push({ kind: "ok", text: `opening mailto:${profile.email}` });
        window.location.href = `mailto:${profile.email}`;
        break;
      case "github":
        next.push({ kind: "ok", text: `opening ${profile.github}` });
        window.open(profile.github, "_blank", "noreferrer");
        break;
      case "linkedin":
        next.push({ kind: "ok", text: `opening ${profile.linkedin}` });
        window.open(profile.linkedin, "_blank", "noreferrer");
        break;
      case "twitter":
      case "x":
        next.push({ kind: "ok", text: `opening ${profile.twitter}` });
        window.open(profile.twitter, "_blank", "noreferrer");
        break;
      case "resume":
        next.push({ kind: "ok", text: `fetching ${profile.resumeUrl}` });
        window.open(profile.resumeUrl, "_blank", "noreferrer");
        break;
      case "clear":
        setHistory(banner);
        return;
      default:
        next.push({ kind: "err", text: `command not found: ${cmd}` });
        next.push({ kind: "out", text: "type 'help' to see options" });
    }

    setHistory((h) => [...h, ...next]);
    if (cmd) setPast((p) => [...p, raw]);
    setCmdIdx(-1);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = cmdIdx === -1 ? past.length - 1 : Math.max(0, cmdIdx - 1);
      setCmdIdx(next);
      setInput(past[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIdx === -1) return;
      const next = cmdIdx + 1;
      if (next >= past.length) {
        setCmdIdx(-1);
        setInput("");
      } else {
        setCmdIdx(next);
        setInput(past[next]);
      }
    }
  };

  return (
    <section id="contact" className="border-b border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader kicker="// 08 / contact">
          Open a connection.
        </SectionHeader>

        <Reveal
          variant="scale"
          className="code-frame glow-amber cursor-text"
          {...({ onClick: () => inputRef.current?.focus() } as object)}
        >
          <div className="code-frame-header">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 border border-border" />
              <span className="h-2.5 w-2.5 border border-border" />
              <span className="h-2.5 w-2.5 border border-primary bg-primary" />
              <span className="ml-3">guest@{profile.initials.toLowerCase()}:~$</span>
            </div>
            <span className="text-primary">● connected</span>
          </div>

          <div
            ref={wrapRef}
            className="h-[420px] overflow-auto p-5 font-mono text-sm leading-relaxed"
          >
            {history.map((l, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {l.kind === "in" && (
                  <span>
                    <span className="text-primary">guest@{profile.initials.toLowerCase()}</span>
                    <span className="text-muted-foreground">:~$ </span>
                    <span className="text-foreground">{l.text}</span>
                  </span>
                )}
                {l.kind === "out" && <span className="text-foreground/85">{l.text}</span>}
                {l.kind === "ok" && (
                  <span>
                    <span className="text-primary">[OK] </span>
                    <span className="text-foreground/85">{l.text}</span>
                  </span>
                )}
                {l.kind === "err" && (
                  <span>
                    <span className="text-destructive">[ERR] </span>
                    <span className="text-foreground/85">{l.text}</span>
                  </span>
                )}
              </div>
            ))}

            <div className="mt-1 flex items-center">
              <span className="text-primary">guest@{profile.initials.toLowerCase()}</span>
              <span className="text-muted-foreground">:~$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
                className="flex-1 border-0 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                placeholder="type 'help'"
              />
              <span className="cursor-blink" />
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-3 font-mono text-xs text-muted-foreground sm:grid-cols-3">
          <a href={`mailto:${profile.email}`} className="link-amber">{profile.email}</a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="link-amber">
            {profile.github.replace("https://", "")}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-amber">
            {profile.linkedin.replace("https://", "")}
          </a>
        </div>
      </div>
    </section>
  );
}
