// js/components/panel.js — Primary detail panel open/close
// Spec names this #right-panel; keep #detailPanel as a legacy fallback.

function getPanel() {
  return document.getElementById("right-panel") || document.getElementById("detailPanel");
}

export function openPanel(content) {
  const panel   = getPanel();
  const overlay = document.getElementById("overlay");
  if (!panel || !overlay) return;
  if (content != null) {
    const body = panel.querySelector("#dBody");
    if (body) body.innerHTML = content;
  }
  overlay.classList.add("open");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("pi-focus", "panel-open");
}

export function closePanel() {
  const panel   = getPanel();
  const overlay = document.getElementById("overlay");
  if (!panel || !overlay) return;
  overlay.classList.remove("open");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pi-focus", "panel-open");
}
