import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================
// 3D B-Tree visualization for the hero background.
// Mouse rotates the scene; hovering a node highlights the
// search path from root → leaf with a pulsing amber glow.
// ============================================================

const AMBER = new THREE.Color("#F59E0B");
const SLATE = new THREE.Color("#3F3F46");
const SURFACE = new THREE.Color("#18181B");

type NodeDef = {
  id: string;
  pos: [number, number, number];
  parent?: string;
  label: string;
};

// Build a B-Tree-ish layout (3 levels: root, 3 internal, 9 leaf)
function buildTree(): NodeDef[] {
  const nodes: NodeDef[] = [];
  // Root
  nodes.push({ id: "r", pos: [0, 2.4, 0], label: "42|97" });

  const internalY = 0.4;
  const internalSpread = 4.2;
  const internalCount = 3;
  for (let i = 0; i < internalCount; i++) {
    const x = (i - (internalCount - 1) / 2) * internalSpread;
    const id = `i${i}`;
    nodes.push({
      id,
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
      const id = `l${i}_${j}`;
      const v = i * 30 + j * 7 + 3;
      nodes.push({
        id,
        pos: [x, leafY, (j - 1) * 0.4],
        parent: `i${i}`,
        label: `${v}|${v + 11}`,
      });
    }
  }
  return nodes;
}

function pathTo(nodes: NodeDef[], id: string | null): Set<string> {
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

function NodeMesh({
  node,
  active,
  onHover,
  pulse,
}: {
  node: NodeDef;
  active: boolean;
  onHover: (id: string | null) => void;
  pulse: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();
    const breath = 0.5 + 0.5 * Math.sin(t * 1.2 + node.pos[0]);
    const target = active ? 0.9 + pulse * 0.4 : 0.05 + breath * 0.05;
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      target,
      0.1,
    );
    if (ref.current) {
      const s = active ? 1.15 : 1;
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, s, 0.1);
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, s, 0.1);
      ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, s, 0.1);
    }
  });

  return (
    <group position={node.pos}>
      <mesh
        ref={ref}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
      >
        <boxGeometry args={[0.9, 0.5, 0.5]} />
        <meshStandardMaterial
          ref={matRef}
          color={SURFACE}
          emissive={active ? AMBER : SLATE}
          emissiveIntensity={0.05}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
      {/* wireframe shell */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.92, 0.52, 0.52)]} />
        <lineBasicMaterial color={active ? AMBER : SLATE} transparent opacity={active ? 1 : 0.5} />
      </lineSegments>
    </group>
  );
}

function Edge({
  from,
  to,
  active,
  pulse,
}: {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
  pulse: number;
}) {
  const ref = useRef<THREE.Line>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    return g;
  }, [from, to]);

  useFrame(() => {
    const mat = ref.current?.material as THREE.LineBasicMaterial | undefined;
    if (!mat) return;
    const target = active ? 0.95 + pulse * 0.05 : 0.18;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 0.2, target, 0.1);
    mat.color.lerp(active ? AMBER : SLATE, 0.1);
  });

  return (
    // @ts-expect-error - r3f line primitive types
    <line ref={ref} geometry={geo}>
      <lineBasicMaterial color={SLATE} transparent opacity={0.2} />
    </line>
  );
}

function Scene({ tilt }: { tilt: { x: number; y: number } }) {
  const nodes = useMemo(buildTree, []);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [autoLeaf, setAutoLeaf] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Idle auto-traversal: pick a random leaf every ~2.4s
  useEffect(() => {
    const leaves = nodes.filter((n) => n.id.startsWith("l"));
    const id = setInterval(() => {
      const pick = leaves[Math.floor(Math.random() * leaves.length)];
      setAutoLeaf(pick.id);
    }, 2400);
    return () => clearInterval(id);
  }, [nodes]);

  const highlight = pathTo(nodes, hovered ?? autoLeaf);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // base slow rotation + cursor tilt
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      tilt.x * 0.4 + Math.sin(t * 0.15) * 0.1,
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -tilt.y * 0.25 + Math.sin(t * 0.1) * 0.04,
      0.05,
    );
  });

  // pulse value used by both nodes and edges, oscillates 0..1
  const pulseRef = useRef(0);
  useFrame(({ clock }) => {
    pulseRef.current = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 4);
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* edges first */}
      {nodes.map((n) => {
        if (!n.parent) return null;
        const p = byId.get(n.parent)!;
        const active = highlight.has(n.id) && highlight.has(n.parent);
        return (
          <Edge
            key={`e-${n.id}`}
            from={p.pos}
            to={n.pos}
            active={active}
            pulse={pulseRef.current}
          />
        );
      })}
      {nodes.map((n) => (
        <NodeMesh
          key={n.id}
          node={n}
          active={highlight.has(n.id)}
          onHover={setHovered}
          pulse={pulseRef.current}
        />
      ))}
    </group>
  );
}

export function BTreeHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);

  if (reduced) {
    return <StaticTree />;
  }

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setTilt({ x, y });
      }}
    >
      <Canvas
        camera={{ position: [0, 0.4, 9.5], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 5]} intensity={0.6} color="#F59E0B" />
        <directionalLight position={[-4, -3, 4]} intensity={0.25} color="#ffffff" />
        <Suspense fallback={null}>
          <Scene tilt={tilt} />
        </Suspense>
        <fog attach="fog" args={["#0A0A0B", 8, 16]} />
      </Canvas>
    </div>
  );
}

// SVG fallback for reduced motion
function StaticTree() {
  return (
    <svg
      viewBox="0 0 800 400"
      className="absolute inset-0 h-full w-full opacity-50"
      aria-hidden="true"
    >
      <g fill="none" stroke="hsl(var(--border-strong))" strokeWidth="1">
        <line x1="400" y1="80" x2="200" y2="200" />
        <line x1="400" y1="80" x2="400" y2="200" />
        <line x1="400" y1="80" x2="600" y2="200" />
        <line x1="200" y1="200" x2="120" y2="320" />
        <line x1="200" y1="200" x2="200" y2="320" />
        <line x1="200" y1="200" x2="280" y2="320" />
        <line x1="400" y1="200" x2="320" y2="320" />
        <line x1="400" y1="200" x2="400" y2="320" />
        <line x1="400" y1="200" x2="480" y2="320" />
        <line x1="600" y1="200" x2="520" y2="320" />
        <line x1="600" y1="200" x2="600" y2="320" />
        <line x1="600" y1="200" x2="680" y2="320" />
      </g>
      {[
        [400, 80],
        [200, 200],
        [400, 200],
        [600, 200],
        [120, 320],
        [200, 320],
        [280, 320],
        [320, 320],
        [400, 320],
        [480, 320],
        [520, 320],
        [600, 320],
        [680, 320],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x - 22}
          y={y - 12}
          width={44}
          height={24}
          fill="hsl(var(--surface))"
          stroke="hsl(var(--border-strong))"
        />
      ))}
    </svg>
  );
}
