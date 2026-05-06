// js/components/lens.js — Lens visual overlay (risk, capital, geopolitics, substitution)

import { setState } from '../state/store.js';

const LENS_CLASSES = ["pi-lens-high", "pi-lens-medium", "pi-lens-low", "pi-lens-capital", "pi-lens-substitution"];

function clearLensClasses() {
  document.querySelectorAll(LENS_CLASSES.map(c => `.${c}`).join(",")).forEach(el => {
    LENS_CLASSES.forEach(c => el.classList.remove(c));
  });
  document.body.classList.remove("pi-lens-active");
}

export function applyLens(type) {
  setState({ lens: type || "" });
  document.body.dataset.lens = type || "";
  clearLensClasses();
  if (!type) return;

  // Delegate to the main script's applyPiLens if available (it has full COUNTRY_RISK logic)
  if (typeof applyPiLens === "function") {
    applyPiLens(type);
  }
  document.body.classList.add("pi-lens-active");
}

export function clearLens() {
  applyLens("");
}
