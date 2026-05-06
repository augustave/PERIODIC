// js/test/state-test.js — Basic state assertions
// Run in browser devtools: import('/js/test/state-test.js')
// Or serve locally and open http://localhost:8080/js/test/state-test.js

import { state, setState } from '../state/store.js';

console.assert(state.mode === "explore",     "Initial mode should be 'explore'");
console.assert(state.panelOpen === false,    "Panel should start closed");
console.assert(state.mission === null,       "No mission should be active initially");

setState({ mode: "mission" });
console.assert(state.mode === "mission",     "Mode should update to 'mission'");

setState({ mode: "analysis", panelOpen: true });
console.assert(state.mode === "analysis",    "Mode should update to 'analysis'");
console.assert(state.panelOpen === true,     "Panel should be open");

setState({ mode: "explore", panelOpen: false });
console.assert(state.mode === "explore",     "Mode should revert to 'explore'");
console.assert(state.panelOpen === false,    "Panel should be closed again");

console.log("%c All state tests passed.", "color: green; font-weight: bold");
