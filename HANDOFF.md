# Periodic Intelligence — Session Handoff

> Last updated: 2026-05-09 · main @ `066b7f7` · Pages: https://augustave.github.io/PERIODIC/

---

## 1. Project Overview

**"Periodic Intelligence"** (formerly *Periodic & Pictorial*) is an editorial-grade interactive periodic-table application focused on **rare-earth, lithium, and cobalt critical-mineral supply chains**. The site doubles as an intelligence instrument: minerals as the primary surface, periodic-table elements as a persistent reference layer, and operations / countries / capital / policy / topology as analytical lenses on top.

**Doctrine (PRD v1.1, just landed):**
- D1 Elements are **global** — periodic table renders once and only once.
- D2 Minerals are **primary** — elements respond to minerals, not the reverse.
- D3 **No nested rendering** — element cells never live inside a mineral or op card.
- D4 **State drives highlight only** — class toggles, never re-render.

**Default landing:** `pi-shell pi-mode-analysis pi-panel-substrate` on the Rare Earths dataset; URL hash always wins.

---

## 2. Tech Stack & Environment

| Layer | What it is |
|---|---|
| **App shell** | Single-file `index.html` (~9 100 lines) — vanilla JS, no React/Vue/build step. |
| **Modular JS** | `js/state/store.js`, `js/modes/{analysis,explore,mission}.js`, `js/components/{panel,elements,lens,mission}.js`, `js/data/minerals-operations.js`, `js/data/mission-threads.js`. ES modules, imported by inline `<script type="module">` glue. |
| **Styling** | Inline `<style>` in `index.html`. CSS custom properties for the Nakano palette (`--ink`, `--bg-paper`, `--c-lanthanide`, etc.), CSS Grid + Flexbox, fixed-position dock for the element layer. |
| **Type** | Google Fonts: **Fraunces** (italic serif headings) + **DM Mono** (mono labels). |
| **Persistence** | URL hash + `localStorage` mirror (`LS_KEY = "periodic_pictorial_state"`); cold-start strips persisted dataset to enforce the Rare Earths default. |
| **Local preview** | Python `http.server` on port 8081 — config: `.claude/launch.json` → name `periodic`. |
| **Verification** | MCP Claude Preview tools (`preview_start`, `preview_eval`, `preview_screenshot`, `preview_resize`, `preview_console_logs`). Chromium-based. |
| **Deploy** | GitHub Pages on `main` (auto-rebuild ~30–90 s after push). Repo: `augustave/PERIODIC`. |
| **CI/auth** | `gh` CLI authenticated as `augustave` (keyring). HTTPS protocol. |

> ⚠️ **Path quirk:** the project root contains a literal space — `/Users/taoconrad/Dev/Lightweight /PERIODIC/`. Always quote the path in shell commands.

---

## 3. Architecture & Patterns

### 3.1 Body class state machine
The entire UI mode is driven by `<body>` classes:
- `pi-shell` (always present in shell mode)
- `pi-mode-{analysis | mission}` — Explore was retired in PRD 1.0; legacy `setPiMode("explore")` silently rewrites to `analysis`.
- `pi-panel-{substrate | operations | countries | capital | iea | topology}` — six primary surfaces.
- `pi-mission-*`, `pi-lens-*`, `pi-focus` — overlays.

Registries: `PI_PANEL_LABELS`, `PI_PANEL_TARGETS`, `PI_PANEL_ALIASES` (legacy `table` and `minerals` keys both alias to `substrate`).

### 3.2 Layered rendering (PRD 1.1)
```
z-30   overlay-layer    (mission / lens overlays — pointer-events: none)
z-20   mineral-layer    (.minerals-section, .ops-section, .iea-section, .kg-section …)
z-10   element-layer    (.table-wrap — fixed at viewport bottom, 35vh, persistent)
```
- `.table-wrap`: `position: fixed; bottom: 0; left: 292px; right: 16px; height: 35vh; min-height: 240px; display: block !important`.
- Mineral / section content scrolls in document flow above the dock.
- `body { padding-bottom: calc(35vh + 24px) }` so content can scroll past the dock.
- Compact cell sizing inside the dock: `repeat(18, minmax(36px, 1fr))`, font 9px, `.name` and `.mass` hidden.
- Responsive: dock collapses to `left: 8px; right: 8px; height: 32vh` at ≤900px viewport, `30vh` at ≤720px.

### 3.3 Knowledge graph
- `KG_CLUSTERS` (6 clusters: REE classifications, mineralogy, technology, geographies, geopolitical frameworks, IEA R1–R8).
- `KG_EDGES` (~67 edges, 47 source-tagged) with optional `source: "<id>"` referencing `SOURCES` registry (FPRI 2021, USGS MCS 2025, IEA CMO 2024, CFR CSR101 2026, MOFCOM 18, MOFCOM 61, DOE LPO).
- `NODE_TO_OP_RANK` cross-links tech-cluster nodes to operation cards (e.g. `ironnitride → 21`).

### 3.4 Mission threads
`MISSION_THREADS` data structure: `{ id: { dataset, scenario, panel, elements: () => Set, kg: [], narrative } }`. `activatePiMission` flips dataset → mode → panel → highlight, then **scrolls to `.table-wrap`** (the focal element layer) instead of opening a modal.

### 3.5 Detail panels
Two static modal panels with mutually-exclusive open semantics:
- `#detailPanel` (`#closeBtn`) — element / mineral / operation dossier.
- `#sectionDetailPanel` (`#sectionCloseBtn`) — section title clicks (e.g. "Twenty Rare Earth Minerals" → meta panel).

Both use `body.pi-focus` to dim the page background. `openPanel()` calls `closeSectionDetail({preserveFocus: true})` and vice versa.

### 3.6 Animation override watch-list
- `.el { animation: fadeUp ... backwards }` — **must remain `backwards`**. With `both`/`forwards`, the keyframe `to { opacity: 1 }` locks opacity at 1 with animation priority that beats every dim rule (mission, substrate rest-state, lens). This was the root cause of the Heavy REE Access regression.

---

## 4. Session State (Critical)

### 4.1 Completed today (newest first)
| Commit | Subject |
|---|---|
| `066b7f7` | **PRD 1.1: Persistent docked periodic-table layer (D1–D4 doctrine)** |
| `36ca702` | Fix mission flow: scroll to periodic table on activation |
| `da63d7e` | Fix Heavy REE Access (and all mission filters): unlock cell opacity |
| `120650b` | Fix: scope periodic table to substrate panel only *(reverted by `066b7f7`)* |
| `c1282e5` | Fix: pin legacy color-legend footer to bottom of substrate canvas |
| `286815d` | Fix landing regression: stop hiding masthead + drop modal auto-open |
| `cfa89f0` | Substrate visual hierarchy: minerals first, table as reference |
| `afaeab2` | **PRD 1.0: Mineral-First doctrine refactor (P0/P1/P2 batch)** |
| `36af322` | Footer: add US flag chip ("Made in USA") |

**PRD 1.0 acceptance items shipped:** Rare Earths default · Recommended Starts removed · Substrate nav (merged from Elements + Minerals) · nav reorder (Substrate → Operations → Countries → Capital → Policy → Topology) · Explore mode chip removed (only Analysis + Mission) · `$NaNM` hardened with `Number.isFinite` guard · soft-onboarding copy replaced.

**PRD 1.1 acceptance items shipped:** all four doctrine validations pass —
- `document.querySelectorAll(".ptable").length === 1` ✓
- `document.querySelectorAll(".table-wrap").length === 1` ✓
- 0 element cells nested inside any mineral or op card ✓
- Same `.ptable` instance preserved across panel switches (substrate → ops → capital → countries → iea → topology) ✓

### 4.2 Current blockers
**None active.** Last push (`066b7f7`) is in sync with `origin/main`, working tree clean, JS syntax-checks clean, PRD 1.1 validation block all green. User has not yet acknowledged PRD 1.1 acceptance — watch the next message for either approval or a new follow-up.

### 4.3 Next immediate steps (for the agent picking up)
1. **Wait for user feedback** on the PRD 1.1 docked-layer architecture. Possible reactions:
   - **Acceptance** → no action.
   - **"Cells too small in the dock"** → increase `min-height` on `.table-wrap` from 240px or revisit the compact `.el` rules at `index.html:1100–1170`.
   - **"Dock covers content"** → increase `body { padding-bottom: calc(35vh + 24px) }` or reduce dock height.
   - **"Want the dock to collapse"** → add a click-to-toggle handle that animates `bottom: -calc(35vh - 40px)` for a peek-only state.
2. **Pages site rebuild check** — `gh run list -R augustave/PERIODIC -L 3` to confirm the latest deploy succeeded. Site URL: https://augustave.github.io/PERIODIC/
3. **PRD 1.1 spec page** mentions `right-panel` and `DossierPanel` as a future component. Currently the dossier opens as a centered modal (`#detailPanel`). If the user wants to convert it to a right-drawer, plan the CSS-only conversion: `position: fixed; right: 0; top: 84px; bottom: 35vh; width: 420px; transform: translateX(0)`.

---

## 5. Actionable Items

### 5.1 CLI / shell commands
```bash
# Always cd into the quoted path — note the space
cd "/Users/taoconrad/Dev/Lightweight /PERIODIC"

# Git workflow
git status
git log --oneline -10
git push                                   # auto-deploys to Pages

# JS syntax check (extract inline <script> from index.html, run node --check)
awk '/<script>/{flag=1;next} /<\/script>/{flag=0} flag{print}' index.html > /tmp/idx.js
node --check /tmp/idx.js

# gh CLI (already authenticated as augustave)
gh run list -R augustave/PERIODIC -L 5    # Pages deploy status
gh repo view augustave/PERIODIC --web
```

### 5.2 MCP preview workflow
```
mcp__Claude_Preview__preview_start         { name: "periodic" }                # spins up python3 http.server on :8081
mcp__Claude_Preview__preview_eval          { serverId, expression }             # JS in page context
mcp__Claude_Preview__preview_screenshot    { serverId }                         # visual snapshot
mcp__Claude_Preview__preview_console_logs  { serverId, level: "error" }         # client-side errors
mcp__Claude_Preview__preview_resize        { serverId, preset: "desktop" }      # viewport test
```
Use `preview_eval` to run the **PRD 1.1 validation harness**:
```js
({
  d1: document.querySelectorAll(".ptable").length,                // expect 1
  d3: document.querySelectorAll(".mineral-card .el").length,      // expect 0
  fixed: getComputedStyle(document.querySelector(".table-wrap")).position  // expect "fixed"
})
```

### 5.3 Repo checks the next agent should run
```bash
# Doctrine spot-checks (each prints a number; 1 = healthy)
grep -c 'id="ptable"' index.html                                 # 1
grep -c '<div class="table-wrap"' index.html                     # 1
grep -c 'position: fixed' index.html | head                       # nonzero (dock + topbar)

# Confirm the FPRI source layer is intact (47 source-tagged edges)
grep -c 'source: "' index.html                                    # ~47

# Confirm the animation fill-mode is `backwards` not `both`/`forwards`
grep '\.el { animation: fadeUp' index.html                        # must end with "backwards;"
```

### 5.4 Critical files
| Path | Role |
|---|---|
| `index.html` | The served single-file app. **All UI changes go here.** |
| `periodic-table.html` | Legacy mirror — kept in sync for ad-hoc viewing; not served by Pages. |
| `js/state/store.js` | Tiny state store with `setState` + `registerRenderer`. |
| `js/modes/{analysis,explore,mission}.js` | Body-class flippers. Note: `explore` is retired but module file still exists. |
| `js/data/minerals-operations.js` | Dataset definitions (REE, Lithium, Cobalt). |
| `js/data/mission-threads.js` | Mission filter sets. |
| `.claude/launch.json` | Preview server config (`name: "periodic"`, port 8081). |
| `PER-GRAPH/*.json` and `*.txt` | Gemini knowledge-graph exports (already integrated). |
| `Docs/Rare_Earth_Elements_*.json` | FPRI 2021 + supporting source documents. |

### 5.5 Footer anatomy
Two distinct footers — do **not** confuse them:
- `<footer>` (no class) at line ~4276: editorial **Color Mapping legend** + designer attribution. Visible only on the substrate panel as a caption to the periodic table.
- `<footer class="site-footer" role="contentinfo">` at line ~4541: **utility dark band** with brand mark, GitHub link, MIT License link, US flag SVG. Always visible.

---

## 6. Outstanding Future Hooks (not blocking)

- **Right-drawer dossier** — PRD 1.1 mentions `RightPanel > DossierPanel`; the modal could be converted (CSS-only refactor) when prioritized.
- **Mobile dock UX** — at viewports below 600px, the dock + responsive nav cap can leave very little vertical room for mineral content. Consider a click-to-collapse handle or mobile-only stacked view.
- **Dock fade-on-scroll** — could auto-fade the dock to 0.6 opacity when user is reading dense mineral content, restore to full on hover. PRD doesn't require it but improves reading focus.
- **LICENSE file** — site-footer links to `/blob/main/LICENSE` but the repo doesn't have one yet; 404 on click. Add a standard MIT LICENSE file when convenient.
