// js/modes/analysis.js — Analysis mode: deep inspection with full navigation

export function applyAnalysisMode() {
  document.body.classList.remove("pi-mode-explore", "pi-mode-mission", "mode-explore", "mode-mission");
  document.body.classList.add("pi-mode-analysis", "mode-analysis");
  // Full navigation is revealed; panels are enabled via CSS on pi-mode-analysis
}
