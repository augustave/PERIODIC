// js/modes/mission.js — Mission mode: guided, constrained strategic exploration

import { runMission } from '../components/mission.js';

export function applyMissionMode(missionId) {
  document.body.classList.remove("pi-mode-explore", "pi-mode-analysis", "mode-explore", "mode-analysis");
  document.body.classList.add("pi-mode-mission", "mode-mission");
  if (missionId) runMission(missionId);
}
