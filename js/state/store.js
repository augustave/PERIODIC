// js/state/store.js — Central FSM state and renderer registry

export const state = {
  mode: "explore",       // "explore" | "analysis" | "mission"
  dataset: "ree",        // "ree" | "lithium" | "cobalt"
  selection: null,       // { type: "element"|"mineral"|"operation"|"country", id: any } | null
  mission: null,         // mission key string | null
  lens: "",              // "" | "risk" | "capital" | "geopolitics" | "substitution"
  panel: "table",        // active panel key
  panelOpen: false       // whether the detail drawer is open
};

// Renderer callbacks are registered externally to avoid circular imports.
// index.html registers the coordinator that calls the real setters (setPiMode etc.).
const _renderers = [];

export function registerRenderer(fn) {
  _renderers.push(fn);
}

export function setState(patch) {
  Object.assign(state, patch);
  _renderers.forEach(fn => fn(state));
}
