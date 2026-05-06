// js/modes/explore.js — Explore mode: free element browsing, minimal UI

import { closePanel } from '../components/panel.js';

const NON_TABLE_PANEL_CLASSES = [
  "pi-panel-minerals", "pi-panel-operations", "pi-panel-timeline",
  "pi-panel-capital",  "pi-panel-countries",  "pi-panel-iea",
  "pi-panel-topology", "pi-panel-stats",      "pi-panel-cross-capital"
];

export function applyExploreMode() {
  document.body.classList.remove("pi-mode-analysis", "pi-mode-mission", "mode-analysis", "mode-mission");
  document.body.classList.add("pi-mode-explore", "mode-explore");
  closePanel();
  NON_TABLE_PANEL_CLASSES.forEach(c => document.body.classList.remove(c));
  document.body.classList.add("pi-panel-table");
}
