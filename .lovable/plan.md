## The Engine Room — Senior Backend Engineer Portfolio

A single-page, dark-mode, brutalist portfolio with amber neon accents, a 3D B-Tree hero animation, and sections that treat code, diagrams, and logs as the primary visual language.

---

### Design system

- **Theme**: Dark mode only. Slate/Zinc base (`#0A0A0B` background, `#18181B` surfaces, `#27272A` borders).
- **Accent**: Amber `#F59E0B` (primary) with a softer amber-300 for hover states. Used sparingly — borders, single words, status dots, graph highlights.
- **Typography**: JetBrains Mono for code/labels/numbers, Space Grotesk for display headings, Inter for body. Tight tracking, oversized headlines, lowercase brutalist labels (`// experience`, `> projects`).
- **Layout**: Hard 12-col grid, visible hairline dividers, no rounded cards (1–2px radius max), generous whitespace, offset/asymmetric blocks, ASCII-style separators.
- **Motion**: Restrained — fade/slide on scroll, monospace number counters, subtle cursor blink, no bouncy easing.

### Hero — 3D B-Tree visualization

- React Three Fiber + drei scene rendered behind the headline.
- A multi-level B-Tree (root → ~3 internal → ~9 leaf) built from instanced cubes/wireframes with amber edges on slate nodes.
- **Mouse interaction**: tree slowly rotates toward cursor; hovering a node "highlights a search path" from root to that leaf with a glowing amber traversal pulse.
- Idle behavior: occasional auto-traversal pulses simulating queries; node values flicker as monospace overlays.
- Performance: instanced meshes, capped DPR, paused when offscreen, reduced-motion fallback to a static SVG B-Tree.
- Foreground: huge headline ("BACKEND. DISTRIBUTED. CORRECT."), name, role, and three CTAs (`./resume.pdf`, `./contact`, `gh: javed-ali-khan`).

### Sections (single page, in order)

1. **Hero + B-Tree animation** — name, role, one-line tagline, CTAs, scroll hint.
2. **About** — short bio in a "README.md" framed block, with a side panel of live-feel stats (years shipping, services owned, p99 wins). Monospace, no avatar bloat.
3. **Skills matrix** — brutalist grid grouped by *Languages / Datastores / Infra / Messaging / Observability*. Each cell is a label + proficiency bar rendered as monospace blocks (`█████░░░`).
4. **Experience timeline** — vertical timeline with company, role, dates, and 2–3 impact bullets formatted as commit-log entries (`feat(payments): cut p99 by 62%`).
5. **Articles** — pulled live from an RSS feed via `rss2json` (you'll provide the feed URL — Medium, dev.to, personal blog, etc.). Cards show title, date, reading time, excerpt; cached in React Query, graceful empty/error states.
6. **Education** — institution, degree, dates, brief notes. Compact two-column brutalist list.
7. **Certifications** — grid of certs with issuer, date, credential ID/link, and a small verified badge.
8. **Contact — terminal CLI** — interactive prompt accepting `help`, `email`, `github`, `linkedin`, `resume`, `clear`. Typed commands write to a fake stdout. Real `mailto:` and link launches under the hood.
9. **Footer** — minimal: build hash, last-deployed timestamp, theme line, socials.

### Navigation

- Fixed top nav: `JAK::engine-room` wordmark left, section anchors right (`about`, `skills`, `work`, `articles`, `contact`), all monospace lowercase. Active section highlighted with an amber underline driven by IntersectionObserver.

### Data & integrations

- **RSS articles**: client-side fetch to `https://api.rss2json.com/v1/api.json?rss_url=<FEED>` wrapped in React Query (no key needed for public usage; we can swap to an edge function later if you want server caching or hit rate limits).
- **Resume**: served as a static PDF from `/public/resume.pdf` (placeholder until you supply one).
- **All other content** (bio, projects, experience, education, certs, skills) lives in typed TypeScript data files for easy editing.

### Tech choices

- Vite + React + TypeScript (existing stack).
- Tailwind tokens extended with the new amber/slate palette and mono/display fonts.
- `@react-three/fiber@^8.18` + `@react-three/drei@^9.122` + `three` for the B-Tree.
- `@tanstack/react-query` (already installed) for the RSS feed.
- Framer Motion for scroll/section transitions.

### What I need from you (can be added after build)

- RSS feed URL for the Articles section
- Real bio copy, role title, location
- Experience entries
- Education + certifications list
- Resume PDF
- Social links (GitHub, LinkedIn, email, X)

I'll seed everything with high-quality backend-engineer placeholders so the site looks complete on first load, and you can swap content in any text editor.

### Out of scope for v1

- Light mode (dark only, by design)
- CMS / blog hosting (articles come from RSS)
- Per-project detail pages
- Backend / auth / database