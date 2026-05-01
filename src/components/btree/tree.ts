// ============================================================
// Shared B-Tree definition. Used by both the 3D hero scene and
// the interactive query playground panel so they stay in sync.
// ============================================================

export type NodeDef = {
  id: string;
  pos: [number, number, number];
  parent?: string;
  label: string;
};

export function buildTree(): NodeDef[] {
  const nodes: NodeDef[] = [];
  nodes.push({ id: "r", pos: [0, 2.4, 0], label: "42|97" });

  const internalY = 0.4;
  const internalSpread = 4.2;
  const internalCount = 3;
  for (let i = 0; i < internalCount; i++) {
    const x = (i - (internalCount - 1) / 2) * internalSpread;
    nodes.push({
      id: `i${i}`,
      pos: [x, internalY, 0],
      parent: "r",
      label: `${10 + i * 30}|${20 + i * 30}`,
    });
  }

  const leafY = -1.8;
  const leafSpread = 1.55;
  const leafPerInternal = 3;
  for (let i = 0; i < internalCount; i++) {
    const baseX = (i - (internalCount - 1) / 2) * internalSpread;
    for (let j = 0; j < leafPerInternal; j++) {
      const x = baseX + (j - 1) * leafSpread;
      const v = i * 30 + j * 7 + 3;
      nodes.push({
        id: `l${i}_${j}`,
        pos: [x, leafY, (j - 1) * 0.4],
        parent: `i${i}`,
        label: `${v}|${v + 11}`,
      });
    }
  }
  return nodes;
}

export function pathTo(nodes: NodeDef[], id: string | null): Set<string> {
  const set = new Set<string>();
  if (!id) return set;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  let cur: NodeDef | undefined = byId.get(id);
  while (cur) {
    set.add(cur.id);
    cur = cur.parent ? byId.get(cur.parent) : undefined;
  }
  return set;
}

function parseRange(label: string): [number, number] {
  const [lo, hi] = label.split("|").map((s) => Number(s));
  return [lo, hi];
}

function midpoint(label: string): number {
  const [lo, hi] = parseRange(label);
  return (lo + hi) / 2;
}

export type QueryStep = {
  id: string;
  label: string;
  note: string;
};

export type QueryResult = {
  key: number;
  path: string[];     // ordered: root → internal → leaf
  steps: QueryStep[]; // same order, with human-readable notes
  hit: boolean;
  leafId: string;
  hops: number;
  latencyMs: number;
};

// Walk: root → child internal whose midpoint is closest to key
//       → leaf whose [lo, hi] window contains key (HIT)
//         else closest leaf in that internal (MISS).
export function findKey(nodes: NodeDef[], key: number): QueryResult {
  const root = nodes.find((n) => n.id === "r")!;
  const internals = nodes.filter((n) => n.parent === "r");
  const closestInternal = internals.reduce((best, n) =>
    Math.abs(midpoint(n.label) - key) < Math.abs(midpoint(best.label) - key) ? n : best,
  );
  const leaves = nodes.filter((n) => n.parent === closestInternal.id);
  const hitLeaf = leaves.find((n) => {
    const [lo, hi] = parseRange(n.label);
    return key >= lo && key <= hi;
  });
  const leaf =
    hitLeaf ??
    leaves.reduce((best, n) =>
      Math.abs(midpoint(n.label) - key) < Math.abs(midpoint(best.label) - key) ? n : best,
    );
  const hit = !!hitLeaf;

  const path = [root.id, closestInternal.id, leaf.id];
  const steps: QueryStep[] = [
    { id: root.id, label: root.label, note: "matched range" },
    { id: closestInternal.id, label: closestInternal.label, note: "descend" },
    {
      id: leaf.id,
      label: leaf.label,
      note: hit ? "HIT ✓" : "MISS ✗",
    },
  ];

  // Deterministic-but-jittery latency: depends only on the key.
  const noise = (Math.sin(key * 12.9898) * 43758.5453) % 1;
  const jitter = (Math.abs(noise) - Math.floor(Math.abs(noise))) * 0.08;
  const latencyMs = +(0.3 + path.length * 0.05 + jitter).toFixed(2);

  return {
    key,
    path,
    steps,
    hit,
    leafId: leaf.id,
    hops: path.length,
    latencyMs,
  };
}
