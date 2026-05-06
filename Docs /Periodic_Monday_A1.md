repo\_structure:  
  current\_assumption:  
    \- "periodic-table.html"  
    \- "styles.css"  
    \- "script.js"

  target\_structure:  
    \- "index.html"  
    \- "css/"  
    \- "js/"  
    \- "js/state/"  
    \- "js/components/"  
    \- "js/modes/"  
    \- "js/data/"  
    \- "js/panels/"

\# \----------------------------------  
\# 1\. HTML REFACTOR  
\# \----------------------------------

files:

  \- path: "index.html"  
    action: "refactor"  
    goals:  
      \- "Separate layout regions"  
      \- "Remove inline content blocks"  
      \- "Introduce panel container"

    changes:

      \- find: "\<body\>"  
        replace\_with: |  
          \<body\>  
            \<div id="app"\>  
              \<header id="top-bar"\>\</header\>

              \<aside id="left-panel"\>\</aside\>

              \<main id="center-canvas"\>\</main\>

              \<aside id="right-panel" class="hidden"\>\</aside\>

              \<footer id="bottom-strip"\>\</footer\>  
            \</div\>

      \- extract:  
          from: "button blocks containing large content"  
          move\_to: "panel templates"  
          rule: "no button contains \> 2 lines"

      \- wrap:  
          target: "periodic table buttons"  
          container: "\#center-canvas"

      \- remove:  
          \- "Appendix inline blocks"  
          \- "Inline mineral descriptions"  
          \- "Inline operation descriptions"

      \- add:  
          \- "data-id attributes to all elements"  
          \- "data-type attributes: element | mineral | operation"

\# \----------------------------------  
\# 2\. STATE MANAGEMENT  
\# \----------------------------------

  \- path: "js/state/store.js"  
    action: "create"  
    content: |  
      export const state \= {  
        mode: "explore",  
        dataset: "lithium",  
        selection: null,  
        mission: null,  
        lens: null,  
        panelOpen: false  
      };

      export function setState(patch) {  
        Object.assign(state, patch);  
        render();  
      }

\# \----------------------------------  
\# 3\. MODE CONTROLLERS  
\# \----------------------------------

  \- path: "js/modes/explore.js"  
    action: "create"  
    content: |  
      import { state } from "../state/store.js";

      export function applyExploreMode() {  
        document.body.classList.add("mode-explore");  
        document.body.classList.remove("mode-analysis", "mode-mission");

        hideAllPanels();  
        showMinimalUI();  
      }

  \- path: "js/modes/analysis.js"  
    action: "create"

  \- path: "js/modes/mission.js"  
    action: "create"

    rules:  
      \- "Mission mode must dim non-relevant nodes"  
      \- "Mission must auto-open narrative panel"

\# \----------------------------------  
\# 4\. PANEL SYSTEM (CRITICAL FIX)  
\# \----------------------------------

  \- path: "js/components/panel.js"  
    action: "create"  
    content: |  
      export function openPanel(content) {  
        const panel \= document.getElementById("right-panel");  
        panel.innerHTML \= content;  
        panel.classList.remove("hidden");

        document.body.classList.add("panel-open");  
      }

      export function closePanel() {  
        const panel \= document.getElementById("right-panel");  
        panel.classList.add("hidden");  
        panel.innerHTML \= "";

        document.body.classList.remove("panel-open");  
      }

\# \----------------------------------  
\# 5\. ELEMENT CLICK HANDLER  
\# \----------------------------------

  \- path: "js/components/elements.js"  
    action: "refactor"

    find\_pattern: "button onclick or inline handler"

    replace\_with: |  
      document.querySelectorAll("\[data-type='element'\]").forEach(el \=\> {  
        el.addEventListener("click", () \=\> {  
          openElementPanel(el.dataset.id);  
        });  
      });

    add\_function: |  
      function openElementPanel(id) {  
        const data \= getElementData(id);

        openPanel(\`  
          \<div class="panel"\>  
            \<h2\>${data.name}\</h2\>  
            \<div class="tabs"\>  
              \<button\>Overview\</button\>  
              \<button\>Minerals\</button\>  
              \<button\>Operations\</button\>  
            \</div\>  
            \<div class="content"\>${data.summary}\</div\>  
          \</div\>  
        \`);  
      }

\# \----------------------------------  
\# 6\. REMOVE BUTTON-AS-CONTENT ANTI-PATTERN  
\# \----------------------------------

  \- path: "index.html"  
    action: "search\_and\_replace"

    find: "\<button\> ... long text ... \</button\>"  
    replace:  
      rule: |  
        \- extract text  
        \- move to panel template  
        \- replace button with:  
          \<button data-action="open-panel" data-id="X"\>Short Label\</button\>

\# \----------------------------------  
\# 7\. MISSION ENGINE  
\# \----------------------------------

  \- path: "js/components/mission.js"  
    action: "create"  
    content: |  
      export function runMission(missionId) {  
        setState({ mode: "mission", mission: missionId });

        const relevant \= getMissionNodes(missionId);

        document.querySelectorAll(".element").forEach(el \=\> {  
          if (\!relevant.includes(el.dataset.id)) {  
            el.classList.add("dimmed");  
          }  
        });

        openPanel(getMissionNarrative(missionId));  
      }

\# \----------------------------------  
\# 8\. LENS SYSTEM  
\# \----------------------------------

  \- path: "js/components/lens.js"  
    action: "create"  
    content: |  
      export function applyLens(type) {  
        setState({ lens: type });

        document.body.dataset.lens \= type;  
      }

\# \----------------------------------  
\# 9\. CSS ENFORCEMENT  
\# \----------------------------------

  \- path: "css/layout.css"  
    action: "create"

    rules:  
      \- ".hidden { display: none }"  
      \- ".panel-open \#center-canvas { opacity: 0.3 }"  
      \- ".dimmed { opacity: 0.2 }"  
      \- ".mode-explore .appendix { display: none }"  
      \- ".mode-mission .non-relevant { opacity: 0.1 }"

\# \----------------------------------  
\# 10\. CLEANUP PASS  
\# \----------------------------------

  \- path: "global"  
    action: "cleanup"

    rules:  
      \- "Remove all inline onclick handlers"  
      \- "Remove all duplicated content blocks"  
      \- "Remove unused filters"  
      \- "Ensure max 1 panel open"

\# \----------------------------------  
\# 11\. TEST SCRIPT  
\# \----------------------------------

  \- path: "js/test/state-test.js"  
    action: "create"  
    content: |  
      console.assert(state.mode \=== "explore");  
      setState({ mode: "mission" });  
      console.assert(state.mode \=== "mission");

\# \----------------------------------  
\# 12\. ACCEPTANCE CHECKLIST  
\# \----------------------------------

acceptance:  
  \- "Click element → opens panel (never inline expansion)"  
  \- "Switch mode → UI visibly changes"  
  \- "Mission mode → irrelevant nodes dimmed"  
  \- "No button contains paragraphs"  
  \- "Only one panel visible at any time"  
  \- "Default screen shows minimal UI"

What this actually does (in plain terms)

This patch plan:

1\. Extracts the “brain” from the UI  
moves all heavy content → panels  
2\. Forces a state system  
no more free-floating UI  
3\. Introduces mode enforcement  
Explore ≠ Analysis ≠ Mission (real difference)  
4\. Fixes your biggest bug:

buttons pretending to be containers

What you should remember  
You don’t need to rebuild  
You need to re-route behavior

The key shift:

HTML → Layout  
JS → State  
UI → Controlled system

system:  
  name: "Periodic Intelligence Interface"  
  type: "Finite State Machine (FSM)"  
  principle: \>  
    At any given time, the interface must exist in a single dominant mode  
    with strictly enforced visibility, interaction rules, and transitions.

\# \-------------------------  
\# GLOBAL STATE MODEL  
\# \-------------------------

state:  
  mode: "explore | analysis | mission"  
  dataset: "REE | Lithium | Cobalt"  
  selection:  
    type: "none | element | mineral | operation | country"  
    id: "nullable"  
  mission: "nullable"  
  lens: "none | risk | capital | geopolitics | substitution"  
  filters: \[\]  
  panel\_open: true | false

\# \-------------------------  
\# GLOBAL INVARIANTS  
\# \-------------------------

invariants:  
  \- "Only ONE primary panel can be open at a time"  
  \- "Only ONE dominant mode is active"  
  \- "Non-relevant UI must be hidden or dimmed"  
  \- "No dense content rendered inline in canvas"  
  \- "All detailed content must live in panels"

\# \-------------------------  
\# MODE DEFINITIONS  
\# \-------------------------

modes:

  \# \=====================================  
  \# 1\. EXPLORE MODE  
  \# \=====================================  
  explore:  
    purpose: "Free exploration of elements as entry point"

    visible:  
      \- "periodic\_table"  
      \- "dataset\_selector"  
      \- "minimal\_filters (category \+ designer only)"  
      \- "recommended\_starts"

    hidden:  
      \- "appendices"  
      \- "operations"  
      \- "timeline"  
      \- "topology\_graph"  
      \- "policy\_framework"  
      \- "country\_view"  
      \- "capital\_view"

    behavior:  
      on\_element\_click:  
        action:  
          \- "selection.type \= element"  
          \- "open panel: element\_overview"  
          \- "panel\_open \= true"

      on\_filter\_apply:  
        action:  
          \- "apply filter to table only"  
          \- "no panel change"

      on\_mode\_switch:  
        action:  
          \- "clear selection"  
          \- "close panel"

    constraints:  
      \- "No more than 1 overlay layer active"  
      \- "No narrative injection"  
      \- "No mission highlighting"

  \# \=====================================  
  \# 2\. ANALYSIS MODE  
  \# \=====================================  
  analysis:  
    purpose: "Deep inspection of minerals, operations, and relationships"

    visible:  
      \- "periodic\_table (dimmed when panel open)"  
      \- "left\_navigation (full)"  
      \- "right\_panel"  
      \- "filters (full)"  
      \- "breadcrumb"

    hidden:  
      \- "recommended\_starts"  
      \- "mission\_overlay"

    behavior:  
      on\_element\_click:  
        action:  
          \- "selection.type \= element"  
          \- "open panel: element → minerals"  
          \- "panel\_open \= true"

      on\_mineral\_click:  
        action:  
          \- "selection.type \= mineral"  
          \- "open panel: mineral\_detail"

      on\_operation\_click:  
        action:  
          \- "selection.type \= operation"  
          \- "open panel: operation\_detail"

      on\_country\_click:  
        action:  
          \- "selection.type \= country"  
          \- "open panel: country\_view"

      on\_appendix\_select:  
        action:  
          \- "open panel: appendix\_module"  
          \- "hide other appendices"

      on\_panel\_open:  
        action:  
          \- "dim background canvas"  
          \- "lock scroll to panel"

    constraints:  
      \- "Panel must always contain structured content (tabs)"  
      \- "Max one hierarchy level jump per interaction"  
      \- "No full-system overlays"

  \# \=====================================  
  \# 3\. MISSION MODE  
  \# \=====================================  
  mission:  
    purpose: "Guided, constrained strategic exploration"

    visible:  
      \- "periodic\_table (filtered)"  
      \- "mission\_highlight\_layer"  
      \- "right\_panel (narrative \+ data)"  
      \- "breadcrumb"  
      \- "lens\_selector"

    hidden:  
      \- "recommended\_starts"  
      \- "non-relevant filters"  
      \- "appendices (unless mission-linked)"

    behavior:  
      on\_mission\_select:  
        action:  
          \- "state.mission \= selected"  
          \- "apply mission filter to dataset"  
          \- "highlight relevant nodes"  
          \- "dim non-relevant nodes"  
          \- "open panel: mission\_narrative"

      on\_element\_click:  
        condition: "element is relevant to mission"  
        action:  
          \- "open panel: contextual\_element\_view"

      on\_element\_click\_irrelevant:  
        action:  
          \- "ignore OR show 'out of scope' feedback"

      on\_lens\_apply:  
        action:  
          \- "overlay interpretation layer"  
          \- "update color / annotation only"

      on\_clear\_mission:  
        action:  
          \- "remove highlights"  
          \- "reset dataset visibility"  
          \- "close narrative panel"

    constraints:  
      \- "At least 50% of nodes must be dimmed"  
      \- "Only mission-relevant data is interactable"  
      \- "Narrative panel always present"

\# \-------------------------  
\# TRANSITIONS  
\# \-------------------------

transitions:

  \- from: "explore"  
    to: "analysis"  
    trigger: "user clicks Analysis"  
    actions:  
      \- "mode \= analysis"  
      \- "clear selection"  
      \- "enable panels"

  \- from: "explore"  
    to: "mission"  
    trigger: "user clicks Run Mission"  
    actions:  
      \- "mode \= mission"  
      \- "require mission selection"

  \- from: "analysis"  
    to: "explore"  
    trigger: "user clicks Explore"  
    actions:  
      \- "mode \= explore"  
      \- "close panels"  
      \- "clear selection"

  \- from: "analysis"  
    to: "mission"  
    trigger: "user selects mission"  
    actions:  
      \- "mode \= mission"  
      \- "apply mission filter"

  \- from: "mission"  
    to: "analysis"  
    trigger: "user exits mission"  
    actions:  
      \- "mode \= analysis"  
      \- "remove mission filters"

  \- from: "mission"  
    to: "explore"  
    trigger: "user clicks Explore"  
    actions:  
      \- "mode \= explore"  
      \- "clear mission \+ selection"

\# \-------------------------  
\# UI STATE FEEDBACK  
\# \-------------------------

feedback:  
  always\_visible:  
    \- "Mode"  
    \- "Dataset"  
    \- "Active Mission (if any)"  
    \- "Active Lens"  
    \- "Selection"

  example:  
    display: \>  
      Mode: Mission | Dataset: Cobalt | Mission: EV Bottleneck |  
      Lens: Supply Risk | Selection: Heterogenite

\# \-------------------------  
\# FAILURE STATES (MUST PREVENT)  
\# \-------------------------

invalid\_states:  
  \- "Multiple panels open simultaneously"  
  \- "Mission active with full dataset visible"  
  \- "Explore mode showing appendices"  
  \- "Buttons containing long-form content"  
  \- "User interacting with non-relevant nodes in mission mode"

\# \-------------------------  
\# TEST CONDITIONS  
\# \-------------------------

tests:  
  \- "Switch modes → UI visibly changes within 200ms"  
  \- "Mission mode → irrelevant nodes dimmed"  
  \- "Click element → always opens panel (never inline expansion)"  
  \- "Panel open → background interaction disabled"  
  \- "Clear → resets ALL state variables"

