import { Suspense, useMemo, useRef, useState, useEffect, type ElementType } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { buildTree, pathTo, type NodeDef } from "./btree/tree";
import { subscribeQuery, getQueryState } from "./btree/queryStore";

// ============================================================
// 3D B-Tree visualization for the hero background.
// Mouse rotates the scene; hovering a node highlights the
// search path from root → leaf with a pulsing amber glow.
// ============================================================

const AMBER = new THREE.Color("#F59E0B");

function readThemeColors() {
  if (typeof window === "undefined") {
    return { slate: new THREE.Color("#3F3F46"), surface: new THREE.Color("#18181B"), fog: "#0A0A0B" };
  }
  const isLight = document.documentElement.classList.contains("light");
  return isLight
    ? { slate: new THREE.Color("#A1A1AA"), surface: new THREE.Color("#FFFFFF"), fog: "#F5F2EC" }
    : { slate: new THREE.Color("#3F3F46"), surface: new THREE.Color("#18181B"), fog: "#0A0A0B" };
}

let themeColors = readThemeColors();
const SLATE = themeColors.slate;
const SURFACE = themeColors.surface;

// ============================================================
// Shared GPU resources — created once, reused by every node/edge.
// This minimizes GPU uploads, draw-call setup, and memory usage,
// which matters most on mobile devices.
// ============================================================
const SHARED_NODE_GEOMETRY = new THREE.BoxGeometry(0.9, 0.5, 0.5);
const SHARED_EDGES_GEOMETRY = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.92, 0.52, 0.52));
// Single unit-length line geometry; per-edge transforms position/scale/rotate it.
const SHARED_EDGE_LINE_GEOMETRY = (() => {
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3),
  );
  return g;
})();

// (NodeDef, buildTree, pathTo are imported from ./btree/tree)


function NodeMesh({
  node,
  active,
  onHover,
  pulse,
  buildDelay,
  buildStart,
}: {
  node: NodeDef;
  active: boolean;
  onHover: (id: string | null) => void;
  pulse: number;
  buildDelay: number;
  buildStart: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const buildDuration = 0.7;

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();
    const elapsed = Math.max(0, t - buildStart - buildDelay);
    const p = Math.min(1, elapsed / buildDuration);
    // ease-out cubic
    const ease = 1 - Math.pow(1 - p, 3);

    if (groupRef.current) {
      groupRef.current.position.y = node.pos[1] + (1 - ease) * 3.5;
      const s = ease;
      groupRef.current.scale.setScalar(0.001 + s * 0.999);
    }

    const breath = 0.5 + 0.5 * Math.sin(t * 1.2 + node.pos[0]);
    const baseEm = 0.05 + breath * 0.05;
    // amber flash on land
    const flash = p > 0 && p < 1 ? (1 - p) * 0.8 : 0;
    const target = active ? 0.9 + pulse * 0.4 : baseEm + flash;
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      target,
      0.1,
    );
    matRef.current.opacity = ease;
    if (ref.current) {
      const s = active ? 1.15 : 1;
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, s, 0.1);
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, s, 0.1);
      ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, s, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={node.pos}>
      <mesh
        ref={ref}
        geometry={SHARED_NODE_GEOMETRY}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial
          ref={matRef}
          color={SURFACE}
          emissive={active ? AMBER : SLATE}
          emissiveIntensity={0.05}
          metalness={0.2}
          roughness={0.6}
          transparent
          opacity={0}
        />
      </mesh>
      {/* wireframe shell — shared edges geometry */}
      <lineSegments geometry={SHARED_EDGES_GEOMETRY}>
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
  buildDelay,
  buildStart,
}: {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
  pulse: number;
  buildDelay: number;
  buildStart: number;
}) {
  const ref = useRef<THREE.Line>(null);

  // Compute tuples once so a single shared unit-length line geometry
  // can be reused across every edge (saves one BufferGeometry per edge).
  const transform = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const length = dir.length() || 1;
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return {
      position: [a.x, a.y, a.z] as [number, number, number],
      quaternion: [quat.x, quat.y, quat.z, quat.w] as [number, number, number, number],
      scale: [1, length, 1] as [number, number, number],
    };
  }, [from, to]);

  useFrame(({ clock }) => {
    const mat = ref.current?.material as THREE.LineBasicMaterial | undefined;
    if (!mat) return;
    const t = clock.getElapsedTime();
    const elapsed = Math.max(0, t - buildStart - buildDelay);
    const p = Math.min(1, elapsed / 0.5);
    const baseTarget = active ? 0.95 + pulse * 0.05 : 0.18;
    const target = baseTarget * p;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 0, target, 0.15);
    mat.color.lerp(active ? AMBER : SLATE, 0.1);
  });

  const LineEl = "line" as unknown as ElementType;
  return (
    <LineEl
      ref={ref}
      geometry={SHARED_EDGE_LINE_GEOMETRY}
      position={transform.position}
      quaternion={transform.quaternion}
      scale={transform.scale}
    >
      <lineBasicMaterial color={SLATE} transparent opacity={0} />
    </LineEl>
  );
}

function Scene({ tilt }: { tilt: { x: number; y: number } }) {
  const nodes = useMemo(buildTree, []);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [autoLeaf, setAutoLeaf] = useState<string | null>(null);
  const [query, setQuery] = useState(getQueryState);
  const groupRef = useRef<THREE.Group>(null);
  const buildStartRef = useRef<number>(0);
  const startedRef = useRef(false);

  // Subscribe to external query store (driven by BTreeQueryPanel).
  useEffect(() => {
    const unsub = subscribeQuery(setQuery);
    return () => { unsub(); };
  }, []);

  // Compute build delays by depth (root → internal → leaf)
  const buildDelays = useMemo(() => {
    const map = new Map<string, number>();
    nodes.forEach((n) => {
      if (n.id === "r") map.set(n.id, 0);
      else if (n.id.startsWith("i")) {
        const i = Number(n.id.slice(1));
        map.set(n.id, 0.35 + i * 0.12);
      } else {
        // l{i}_{j}
        const [, i, j] = n.id.match(/l(\d+)_(\d+)/) ?? [];
        map.set(n.id, 0.9 + Number(i) * 0.18 + Number(j) * 0.08);
      }
    });
    return map;
  }, [nodes]);

  // Idle auto-traversal: pick a random leaf every ~2.4s.
  // Suspended while the user is interacting via the query panel.
  const queryActive = query.path.length > 0;
  useEffect(() => {
    if (queryActive) return;
    const leaves = nodes.filter((n) => n.id.startsWith("l"));
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        const pick = leaves[Math.floor(Math.random() * leaves.length)];
        setAutoLeaf(pick.id);
      }, 2400);
    }, 2800);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [nodes, queryActive]);

  // Query takes precedence: only the first `step` nodes of the query path
  // are highlighted, producing a stepped reveal in sync with the panel.
  const highlight = queryActive
    ? new Set(query.path.slice(0, query.step))
    : pathTo(nodes, hovered ?? autoLeaf);

  useFrame(({ clock }) => {
    if (!startedRef.current) {
      buildStartRef.current = clock.getElapsedTime();
      startedRef.current = true;
    }
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
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
      {/* edges first - delayed slightly after both endpoints land */}
      {nodes.map((n) => {
        if (!n.parent) return null;
        const p = byId.get(n.parent)!;
        const active = highlight.has(n.id) && highlight.has(n.parent);
        const edgeDelay = (buildDelays.get(n.id) ?? 0) + 0.25;
        return (
          <Edge
            key={`e-${n.id}`}
            from={p.pos}
            to={n.pos}
            active={active}
            pulse={pulseRef.current}
            buildDelay={edgeDelay}
            buildStart={buildStartRef.current}
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
          buildDelay={buildDelays.get(n.id) ?? 0}
          buildStart={buildStartRef.current}
        />
      ))}
    </group>
  );
}

// Throttles render loop to a target FPS and pauses entirely when invisible.
function FrameLimiter({ fps, active }: { fps: number; active: boolean }) {
  const { invalidate, advance } = useThree((s) => ({ invalidate: s.invalidate, advance: s.advance }));
  const lastRef = useRef(0);
  useEffect(() => {
    let raf = 0;
    const interval = 1000 / fps;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!active) return;
      if (t - lastRef.current >= interval) {
        lastRef.current = t;
        advance(t / 1000, true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, active, advance, invalidate]);
  return null;
}

export function BTreeHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeKey, setThemeKey] = useState<string>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("light") ? "light" : "dark",
  );

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener("change", fn);
    const mq = window.matchMedia("(max-width: 767px)");
    const onMobile = () => setIsMobile(mq.matches);
    onMobile();
    mq.addEventListener("change", onMobile);
    return () => {
      m.removeEventListener("change", fn);
      mq.removeEventListener("change", onMobile);
    };
  }, []);

  // Pause rendering when hero is off-screen or tab is hidden.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.05),
      { threshold: [0, 0.05, 0.5] },
    );
    io.observe(el);
    const onVis = () => {
      if (document.hidden) setVisible(false);
      else {
        const rect = el.getBoundingClientRect();
        setVisible(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const next = document.documentElement.classList.contains("light") ? "light" : "dark";
      setThemeKey(next);
      const c = readThemeColors();
      themeColors = c;
      SLATE.copy(c.slate);
      SURFACE.copy(c.surface);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (reduced) {
    return <StaticTree />;
  }

  // Mobile: lower DPR, cap FPS at 30, no antialias. Desktop: 60fps, AA on.
  const dpr: [number, number] = isMobile ? [1, 1.25] : [1, 1.6];
  const targetFps = isMobile ? 30 : 60;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setTilt({ x, y });
      }}
    >
      <Canvas
        key={themeKey}
        camera={{ position: [0, 0.4, 9.5], fov: 42 }}
        dpr={dpr}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        frameloop="never"
      >
        <FrameLimiter fps={targetFps} active={visible} />
        <ambientLight intensity={themeKey === "light" ? 0.7 : 0.35} />
        <directionalLight position={[5, 6, 5]} intensity={0.6} color="#F59E0B" />
        <directionalLight position={[-4, -3, 4]} intensity={themeKey === "light" ? 0.5 : 0.25} color="#ffffff" />
        <Suspense fallback={null}>
          <Scene tilt={tilt} />
        </Suspense>
        <fog attach="fog" args={[themeColors.fog, 8, 16]} />
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
