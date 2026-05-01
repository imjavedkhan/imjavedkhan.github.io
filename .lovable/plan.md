# Live B-Tree Query Playground

Turn the hero's 3D B-Tree from a passive background into an interactive demo. Visitors type a number, watch the tree light up the exact search path root → internal → leaf, and see a backend-engineer-style readout: hop count, complexity, and a fake latency number that feels real.

## What the user sees

A small, terminal-styled panel sitting near the hero (bottom-left of the canvas, above the log ticker). It looks like:

```text
┌─ btree.find(key) ──────────────────────────┐
│  $ search >  [  73       ]  ↵             │
│                                            │
│  → root[42|97]    matched range            │
│  → i1[40|70]      descend                  │
│  → l1_2[73|84]    HIT  ✓                   │
│                                            │
│  3 hops · O(log n) · 0.41ms                │
└────────────────────────────────────────────┘
```

As each step appears, the corresponding node and edge in the 3D scene pulse amber in sequence (not all at once like the current hover behavior). When the path completes, the leaf does a stronger flash to indicate "hit" or "miss."

## Behavior details

- **Input:** numeric, 1–3 digits. Enter or click `▶` to run.
- **Hit vs miss:** each leaf already has a `v|v+11` label (a 2-key range). If the typed number falls inside *any* leaf's range → HIT on that leaf. Otherwise → MISS on the closest leaf.
- **Animation:** path nodes light up one at a time with a ~250ms stagger. Edges along the path animate in sync (color ramp from slate → amber, opacity boost). Total reveal ~1s for a depth-3 tree.
- **Latency readout:** deterministic-but-jittery — `0.3ms + hops * 0.05ms + small noise`. Sells the "real query" feel without lying.
- **Try-me hints:** small "try: 17, 73, 105" chips below the input so visitors don't stare at an empty box.
- **Pause idle traversal:** the existing 2.4s random-leaf auto-traversal pauses while the user is interacting (last query stays highlighted), then resumes after ~6s of inactivity.

## Responsive & accessibility

- **Mobile:** panel collapses into a single-line compact form (`[input] [▶] · 3 hops 0.41ms`) docked above the log ticker. The result list shows only the final line.
- **Reduced motion:** path nodes still highlight, but instantly (no stagger). The static SVG fallback for `prefers-reduced-motion` gets a simple non-3D version of the same input that highlights SVG rects.
- **Keyboard:** input is reachable via Tab, Enter submits, Esc clears.
- **A11y:** `aria-live="polite"` region announces `"Found 73 in leaf l1_2 after 3 hops"`.

## Visual style

Reuses the existing design system — no new colors. Mono font, hairline border, `bg-background/70 backdrop-blur-sm`, amber `--primary` accents. Matches the bottom log ticker's aesthetic so it feels like part of the same "engine room" UI rather than bolted on.

## Files to change

- `src/components/BTreeHero.tsx`
  - Lift the highlighted-path concept out of `Scene`'s local state into a small store (plain `useState` + a context, or a ref-based event emitter) so the new panel can drive it.
  - Add `queryPath: string[]` and `queryStep: number` props to `Scene`. When set, override the `hovered`/`autoLeaf` highlight with a stepped reveal (only the first `queryStep` ids are active).
  - Pause auto-traversal `setInterval` while a query is active.
- `src/components/BTreeQueryPanel.tsx` *(new)*
  - The terminal-styled UI: input, run button, hint chips, step list, latency readout.
  - Owns the search algorithm: walks the same `buildTree()` structure, returns `{ path, hit, leafId }`.
  - Drives the stepped reveal via a small `setTimeout` chain (or `requestAnimationFrame` loop) and exposes the current step to the 3D scene.
- `src/components/sections/Hero.tsx`
  - Mount `<BTreeQueryPanel />` inside the hero, positioned `absolute bottom-24 left-4` on desktop, full-width strip on mobile, with proper z-index above the gradient veil but below the log ticker.

## Technical notes

- The tree definition currently lives inside `BTreeHero.tsx` as a local `buildTree()` closure. Extract it to a tiny module (e.g. `src/components/btree/tree.ts`) exporting `buildTree()`, `pathTo()`, and a new `findKey(nodes, key)` so both the panel and the scene share one source of truth.
- `findKey` walks parent → children using each node's label range. Since the tree is built deterministically, this is straightforward array filtering by `parent` id at each level, picking the child whose `[lo, hi]` window contains the key (or the nearest one for miss).
- The panel ↔ scene bridge can be a lightweight `useSyncExternalStore` or just lifted state inside `BTreeHero`. Lifted state is simpler and fine here — only one consumer pair.
- Frame budget: the existing `FrameLimiter` and visibility pausing already cap GPU work; adding stepped highlights costs essentially nothing extra.
- The fake latency formula stays deterministic per `(key, depth)` so the same query always shows the same number — feels honest, not random.

## Out of scope

- Real persistence / saving recent queries.
- Insert/delete operations on the tree (kept read-only — keeps the demo focused).
- Sound effects (covered separately under idea #11 if you ever want it).
