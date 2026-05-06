// js/components/elements.js — Element grid delegation and panel opening
// The grid is built imperatively in index.html; this module handles click routing.

import { setState } from '../state/store.js';

export function initElementClicks() {
  const table = document.getElementById("ptable");
  if (!table) return;
  table.addEventListener("click", e => {
    const cell = e.target.closest("[data-n]");
    if (!cell) return;
    const n = parseInt(cell.dataset.n, 10);
    setState({ selection: { type: "element", id: n }, panelOpen: true });
    // openDetail is defined in the main script and handles the full panel build
    if (typeof openDetail === "function") {
      // find the element object and delegate
      const el = (typeof ELEMENTS !== "undefined") ? ELEMENTS.find(e => e.n === n) : null;
      if (el) openDetail(el);
    }
  });
}

export function openElementPanel(n) {
  setState({ selection: { type: "element", id: n }, panelOpen: true });
  if (typeof ELEMENTS !== "undefined" && typeof openDetail === "function") {
    const el = ELEMENTS.find(e => e.n === n);
    if (el) openDetail(el);
  }
}
