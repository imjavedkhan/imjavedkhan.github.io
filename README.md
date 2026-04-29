# The Engine Room — Javed Ali Khan

A single-page, dark-mode, brutalist portfolio for a senior backend engineer. Code, diagrams, and logs are the primary visual language. Amber neon on slate, monospace everywhere, and a 3D B-Tree hero animation that responds to your cursor.

> **Live preview:** built and shipped on [Lovable](https://lovable.dev)
> **Author:** Javed Ali Khan — Senior Software Engineer (Java · Spring Boot · Microservices · Cloud)
> **Contact:** [javedalikhan50@gmail.com](mailto:javedalikhan50@gmail.com) · [LinkedIn](https://linkedin.com/in/javedalikhan) · [GitHub](https://github.com/imjavedkhan) · [Medium](https://medium.com/@javedalikhan50)

---

## ✦ Features

- **3D B-Tree hero** — React Three Fiber scene with mouse-driven rotation, search-path traversal pulses, and a reduced-motion SVG fallback.
- **Brutalist design system** — JetBrains Mono / Space Grotesk / Inter, hairline dividers, asymmetric grid, amber `#F59E0B` accents on a slate base. All colors are HSL semantic tokens defined in `src/index.css` and `tailwind.config.ts`.
- **"Available for hire" badge** — toggle via `profile.availableForHire` with a customisable `availabilityText` line.
- **Sections** — Hero · About (README block + live stats) · Skills matrix · Experience timeline (commit-log style) · Projects · Articles (live RSS) · Education · Certifications · Contact (interactive terminal CLI) · Footer.
- **Live articles** — pulled from a Medium RSS feed via `rss2json` and cached with React Query.
- **Education & Certifications** — each item supports an optional `certificateUrl` / `url` that opens the credential in a new tab.
- **SEO** — semantic HTML, single H1, meta description, Open Graph image, sitemap, robots.txt, JSON-LD person schema.
- **Polish** — scroll progress bar, back-to-top, IntersectionObserver active-section nav, framer-motion reveal animations.

---

## ✦ Tech stack

- **Framework:** Vite 5 + React 18 + TypeScript 5
- **Styling:** Tailwind CSS v3, semantic HSL design tokens, `tailwindcss-animate`, `@tailwindcss/typography`
- **UI primitives:** shadcn/ui (Radix), lucide-react icons
- **3D / motion:** `@react-three/fiber`, `@react-three/drei`, `three`, `framer-motion`
- **Data:** `@tanstack/react-query` (RSS feed), typed content in `src/data/portfolio.ts`
- **Diagrams / code:** `mermaid`, `react-syntax-highlighter`
- **Routing:** `react-router-dom`
- **Testing:** Vitest + Testing Library + jsdom

---

## ✦ Project structure

```
src/
├── components/
│   ├── BTreeHero.tsx          # R3F 3D B-Tree scene
│   ├── TopNav.tsx             # Active-section nav (IntersectionObserver)
│   ├── Reveal.tsx             # Scroll-reveal wrapper
│   ├── ScrollProgress.tsx     # Top progress bar
│   ├── BackToTop.tsx
│   ├── MermaidDiagram.tsx
│   ├── sections/              # Hero, About, Skills, Experience,
│   │                          # Projects, Articles, Education,
│   │                          # Certifications, Contact, Footer
│   └── ui/                    # shadcn/ui primitives
├── data/
│   └── portfolio.ts           # ⭐ All editable content lives here
├── pages/
│   ├── Index.tsx              # Single-page composition
│   └── NotFound.tsx
├── hooks/
├── lib/
└── index.css                  # Design tokens (HSL)
public/
├── og-image.jpg
├── sitemap.xml
├── robots.txt
└── resume.pdf                 # Drop your resume here
```

---

## ✦ Getting started

Requires Node 18+ and a package manager (npm / pnpm / bun).

```bash
# install
npm install

# dev server (http://localhost:8080)
npm run dev

# production build
npm run build

# preview the production build
npm run preview

# lint & test
npm run lint
npm run test
```

---

## ✦ Editing content

All copy, links, and toggles live in **`src/data/portfolio.ts`**. No component edits required.

```ts
export const profile = {
  name: "Javed Ali Khan",
  role: "Senior Software Engineer",
  email: "javedalikhan50@gmail.com",
  github: "https://github.com/imjavedkhan",
  linkedin: "https://linkedin.com/in/javedalikhan",
  resumeUrl: "/resume.pdf",
  rssFeedUrl: "https://medium.com/feed/@javedalikhan50",

  availableForHire: true,                                    // hero badge on/off
  availabilityText: "Open to new roles · remote or Noida",   // badge text
};
```

Other exports in the same file:

| Export | Drives |
|---|---|
| `stats` | About sidebar metrics |
| `aboutLines` | README-style bio paragraphs |
| `skills` | Skills matrix grid |
| `experience` | Vertical timeline |
| `projects` | Projects section |
| `education[].certificateUrl` | Clickable certificate badge |
| `certifications[].url` | Each cert opens in a new tab |

To swap the resume, replace `public/resume.pdf`. To change the articles feed, update `profile.rssFeedUrl`.

---

## ✦ Design system rules

- Dark mode only by design.
- Never hard-code colors in components — use the HSL semantic tokens from `index.css` (`--background`, `--foreground`, `--primary`, `--muted`, …).
- Monospace for labels/numbers/code, display font for headlines, body font for prose.
- Restrained motion: fades and slides only, no bouncy easing.

---

## ✦ Deploying

This project is built and hosted on [Lovable](https://lovable.dev). Open the project there and click **Publish**. Custom domains can be wired from the project settings.

For self-hosting, any static host works — `npm run build` produces a static bundle in `dist/`.

---

## ✦ License

Personal portfolio — content © Javed Ali Khan. Code scaffolding is free to learn from.
