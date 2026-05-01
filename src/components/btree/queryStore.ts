// ============================================================
// Tiny pub/sub store so the BTreeQueryPanel (DOM) can drive the
// 3D scene highlight without prop drilling through <Canvas>.
// ============================================================

type QueryState = {
  path: string[];   // empty = no active query
  step: number;     // how many of `path` are currently revealed
  active: boolean;  // true while a stepped reveal is in progress
};

let state: QueryState = { path: [], step: 0, active: false };
const listeners = new Set<(s: QueryState) => void>();

export function getQueryState(): QueryState {
  return state;
}

export function setQueryState(next: Partial<QueryState>) {
  state = { ...state, ...next };
  listeners.forEach((fn) => fn(state));
}

export function clearQueryState() {
  state = { path: [], step: 0, active: false };
  listeners.forEach((fn) => fn(state));
}

export function subscribeQuery(fn: (s: QueryState) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
