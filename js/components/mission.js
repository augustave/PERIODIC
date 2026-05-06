// js/components/mission.js — Mission activation, highlighting, and clearing

import { setState } from '../state/store.js';
import { MISSION_THREADS } from '../data/mission-threads.js';

export function runMission(missionId) {
  const mission = MISSION_THREADS[missionId];
  if (!mission) return;
  setState({ mode: "mission", mission: missionId });
  applyMissionHighlight(missionId);
}

export function applyMissionHighlight(missionId) {
  clearMissionHighlight();
  if (!missionId) return;
  const mission = MISSION_THREADS[missionId];
  if (!mission) return;

  const elementSet = mission.elements();

  document.querySelectorAll(".el:not(.placeholder)").forEach(cell => {
    const n = parseInt(cell.dataset.n, 10);
    if (elementSet.has(n)) {
      cell.classList.add("pi-mission-hit");
      cell.classList.remove("dimmed");
    } else {
      cell.classList.remove("pi-mission-hit");
      cell.classList.add("dimmed");
    }
  });

  // Also dim mineral and operation cards not in mission scope
  const missionPanel = mission.panel;
  document.querySelectorAll(".mineral-card").forEach(card => {
    const primary = card.dataset.primary ? card.dataset.primary.split(",").map(Number) : [];
    const relevant = primary.some(n => elementSet.has(n));
    card.classList.toggle("dimmed", !relevant);
  });

  document.querySelectorAll(".op-card").forEach(card => {
    const outputs = card.dataset.outputs ? card.dataset.outputs.split(",").map(Number) : [];
    const relevant = outputs.some(n => elementSet.has(n));
    card.classList.toggle("dimmed", !relevant);
  });
}

export function clearMissionHighlight() {
  document.querySelectorAll(".pi-mission-hit").forEach(el => el.classList.remove("pi-mission-hit"));
  document.querySelectorAll(".dimmed").forEach(el => el.classList.remove("dimmed"));
}
