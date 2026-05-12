# Periodic Intelligence — Session Handoff

> Last updated: 2026-05-09 · `main @ b549330` · in sync with `origin/main`
> Live: https://augustave.github.io/PERIODIC/ · Repo: https://github.com/augustave/PERIODIC

---

## 1. Project Overview

**"Periodic Intelligence"** *(masthead register: "Periodic & Pictorial")* is a single-file, editorial-grade interactive periodic-table application built around a **mineral-first doctrine** for rare-earth, lithium, and cobalt supply-chain analysis. The periodic table sits as a **persistent docked reference layer** at the bottom of the viewport across every panel; mineral cards, operations, capital flows, country sovereignty, IEA policy, and a knowledge-graph topology render above it.

**Doctrine (PRD 1.1):**
- **D1** Elements are global — periodic table renders once and only once.
- **D2** Minerals are primary — elements respond to minerals, not the reverse.
- **D3** No nested rendering — element cells never live inside a mineral or op card.
- **D4** State drives highlight only — class toggles, never re-render.

**Default landing:** `<body class="pi-shell pi-mode-analysis pi-panel-substrate">` on the Rare Earths dataset. URL hash always wins; localStorage replays strip persisted `dataset=` to enforce the Rare-Earths default.

---

## 2. Tech Stack & Environment

| Layer | What it is |
|---|---|
| **App shell** | Single-file `index.html` (~9 100 lines). Vanilla JS, no React/Vue, no build step. Inline `<style>` + `<script type="module">`. |
| **ES modules** | `js/state/store.js` (tiny setState/registerRenderer) · `js/modes/{analysis,explore,mission}.js` (body-class flippers) · `js/components/{panel,elements,lens,mission}.js` · `js/data/{minerals-operations,mission-threads}.js`. Imported by inline `<script type="module">` glue in `index.html`. |
| **Typography** | Google Fonts: **Fraunces** (italic serif, masthead + dossier) and **DM Mono** (monospace labels). |
| **Styling** | Inline CSS with custom properties (`--ink`, `--bg-paper`, `--c-lanthanide`…). CSS Grid for periodic table + minerals grid, Flexbox for body-class state machine, **`position: fixed` for the element-layer dock**. CSS `:has()` for rest-state dimming. |
| **Persistence** | URL hash + `localStorage` mirror (`LS_KEY = "periodic_pictorial_state"`). Cold-start strips persisted dataset to enforce Rare Earths default. |
| **Local preview** | Python `http.server` on port 8081. Config at `.claude/launch.json` → name `periodic`. |
| **Verification** | MCP Claude Preview tools: `preview_start`, `preview_eval`, `preview_screenshot`, `preview_resize`, `preview_console_logs`. Chromium-based. |
| **Deploy** | GitHub Pages, `main` branch root, auto-build ~30–90 s after push. |
| **CI/auth** | `gh` CLI authenticated as `augustave` (keyring), HTTPS protocol. |

> ⚠️ **Path quirk:** repo root path contains a literal space — `/Users/taoconrad/Dev/Lightweight /PERIODIC/`. Always quote in shell commands.

---

## 3. Architecture & Patterns

### 3.1 Body-class state machine
All UI mode is driven by `<body>` classes — no React state, no virtual DOM, no reactivity framework.

| Family | Values |
|---|---|
| Shell | `pi-shell` (always present in shell mode) |
| Mode | `pi-mode-analysis` *(default)* · `pi-mode-mission` *(Explore is retired; `setPiMode("explore")` silently rewrites to analysis)* |
| Panel | `pi-panel-{substrate \| operations \| countries \| capital \| iea \| topology}` |
| Overlays | `pi-mission-*` · `pi-lens-*` · `pi-focus` |
| Lens | `pi-lens-risk \| pi-lens-capital \| pi-lens-geopolitics \| pi-lens-substitution` |

Registries: `PI_PANEL_LABELS` · `PI_PANEL_TARGETS` · `PI_PANEL_ALIASES` (legacy `table` + `minerals` panel keys alias to `substrate`).

### 3.2 Layered rendering (PRD 1.1 — load-bearing)

```
z-30  overlay-layer      mission / lens overlays (pointer-events: none)
z-20  mineral-layer      .minerals-section, .ops-section, .iea-section, .kg-section …
z-10  element-layer      .table-wrap (fixed-bottom dock, 35vh, persistent)
```

- `.table-wrap` is `position: fixed; bottom: 0; left: 292px; right: 16px; height: 35vh; min-height: 240px; display: block !important` — never hidden, never moved.
- Cells inside the dock use **compact sizing** (`grid-template-columns: repeat(18, minmax(36px, 1fr))`, `font-size: 9px`, `.name` + `.mass` hidden) so the full 9-row table fits 35vh.
- Body has `padding-bottom: calc(35vh + 24px)` so document content scrolls past the dock.
- Responsive: dock collapses to `left: 8px; right: 8px; height: 32vh` at ≤900px, `30vh` at ≤720px.

### 3.3 Knowledge graph
- `KG_CLUSTERS` × `KG_EDGES` × `SOURCES` registry.
- 6 clusters: REE classifications · mineralogy · technology · geographies · geopolitical frameworks · IEA framework.
- ~67 edges, **47 source-tagged** (FPRI 2021 · USGS MCS 2025 · IEA CMO 2024 · CFR CSR101 2026 · MOFCOM 18 + 61 · DOE LPO).
- `NODE_TO_OP_RANK` cross-links tech-cluster nodes to operation cards (e.g. `ironnitride → 21`).

### 3.4 Mission threads
`MISSION_THREADS = { id: { dataset, scenario, panel, elements: () => Set, kg: [], narrative } }`.
`activatePiMission(id)` flips dataset → mode → panel → `applyMissionHighlight()`, then **scrolls to `.table-wrap`** (the focal element layer) instead of opening a modal.

### 3.5 Detail panels
Two static modal panels with mutually-exclusive open semantics:
- `#detailPanel` (`#closeBtn`) — element / mineral / operation dossier.
- `#sectionDetailPanel` (`#sectionCloseBtn`) — section-title "About this section" meta panel.

Both use `body.pi-focus` to dim background. `openPanel()` calls `closeSectionDetail({preserveFocus: true})`; `openSectionDetail()` calls `closeDetail()`.

### 3.6 Animation override watch-list (load-bearing fix)
```css
.el { animation: fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) backwards; }
```
**Must remain `backwards`**, never `both`/`forwards`. With `both`, the `to { opacity: 1 }` keyframe persists post-animation with animation priority that beats every dim rule (mission filter, substrate rest-state, lens overlay). This was the root cause of the "Heavy REE Access pipeline not fixed" regression — entire dim cascade was silently overridden.

---

## 4. Session State (Critical)

### 4.1 Today's commits (newest first)

| Commit | Subject |
|---|---|
| `b549330` | **README: rewrite for current state (PRD 1.0 + 1.1 doctrine)** |
| `e06abf2` | Add HANDOFF.md for session continuity |
| `066b7f7` | **PRD 1.1: Persistent docked periodic-table layer (D1–D4 doctrine)** |
| `36ca702` | Fix mission flow: scroll to periodic table on activation |
| `da63d7e` | Fix Heavy REE Access (and all mission filters): unlock cell opacity |
| `120650b` | Fix: scope periodic table to substrate panel only *(reverted by `066b7f7`)* |
| `c1282e5` | Fix: pin legacy color-legend footer to bottom of substrate canvas |
| `286815d` | Fix landing regression: stop hiding masthead + drop modal auto-open |
| `cfa89f0` | Substrate visual hierarchy: minerals first, table as reference |
| `afaeab2` | **PRD: Mineral-First doctrine refactor (P0 batch)** |
| `36af322` | Footer: add US flag chip ("Made in USA") |
| `b092719` | Remove the bottom sticky breadcrumb strip |

### 4.2 What shipped (cumulative across today)

**PRD 1.0 (Mineral-First Doctrine):**
- Rare Earths forced as default dataset (URL hash overrides; localStorage replay strips persisted dataset).
- Recommended Starts / "Explore Elements" block deleted from left panel.
- Substrate nav merged from old Elements + Minerals tabs (legacy keys alias-routed).
- Nav reorder: Substrate · Operations · Countries · Capital · Policy · Topology.
- Explore mode chip removed (only Analysis + Mission; default = Analysis).
- `$NaNM` capital bug hardened with `Number.isFinite()` guard + "undisclosed" fallback.
- Soft-onboarding copy replaced ("Click for detail" → "Substrate · minerals first").

**PRD 1.1 (Layered Architecture):**
- `.table-wrap` made `position: fixed` bottom-dock at 35vh, z-index 10.
- Mineral/section content `position: relative; z-index: 20` in document flow above the dock.
- Mission/lens overlays at z-index 30 with `pointer-events: none`.
- Body `padding-bottom: calc(35vh + 24px)` for dock clearance.
- Compact cell sizing inside dock (`min-height: 34px`, font 9px, hidden name/mass).
- All four doctrine validation checks pass: single `.ptable` in DOM, no nested rendering, instance preserved across panel switches.

**Regression fixes (chronological):**
- Auto-open Bastnäsite modal covered substrate → dropped auto-open.
- Editorial masthead/dataset-strip/controls/legacy-footer hidden in analysis mode → restored, focused chrome rules now apply ONLY in mission mode.
- Legacy color-legend `<footer>` rendering in middle of page → pinned to `order: 3` in substrate flex.
- Periodic table visible on every panel ("element landing permanent on top") → first scoped to substrate, then properly restored as persistent dock per PRD 1.1.
- `.el` cell `animation: fadeUp ... both` locked opacity at 1, overriding all dim rules → changed `both` → `backwards`.
- Mission scroll target was mineral cards (1700+ px above the table) → now scrolls to `.table-wrap` on mission activation.
- `pi-bottom-strip` (state breadcrumbs) removed at user request.

**Documentation:**
- HANDOFF.md added (this file's predecessor at `e06abf2`).
- README.md rewritten to reflect PRD 1.0 + 1.1 state (`b549330`).

### 4.3 Current blockers
**None active.** Working tree clean. JS syntax-checks clean (`node --check`). All PRD 1.1 validation rules green. Last user message was the latest PRD spec; implementation complete and acknowledged. Awaiting next direction.

### 4.4 Next immediate steps

The next agent should **wait for the user's next message** before acting. Likely follow-up paths:

1. **PRD 1.1 acceptance feedback** — user may report visual issues with the docked table (cells too small, dock too tall/short, dock obscures content). Adjustments live at `index.html:1115–1170` (the `.table-wrap` + compact `.ptable` block).
2. **Right-drawer dossier conversion** — PRD 1.1 mentions `RightPanel > DossierPanel` as a future component. Currently `#detailPanel` is a centered modal. Plan: CSS-only refactor — `position: fixed; right: 0; top: 84px; bottom: 35vh; width: 420px; transform: translateX(0)`. Keep static markup, only restyle.
3. **LICENSE file missing** — site-footer links to `/blob/main/LICENSE` but the repo has no LICENSE. Add a standard MIT LICENSE file when convenient.
4. **Mobile dock UX** — at ≤600px viewports the dock + responsive nav cap leaves limited reading room. Consider a click-to-collapse handle for peek-only state.

---

## 5. Actionable Items

### 5.1 Custom CLI commands
```bash
# Always cd with quoted path — note the literal space
cd "/Users/taoconrad/Dev/Lightweight /PERIODIC"

# Git workflow (gh CLI authenticated as augustave)
git status
git log --oneline -10
git push                                                # auto-deploys to Pages

# JS syntax check (extract inline <script> from index.html, run node --check)
awk '/<script>/{flag=1;next} /<\/script>/{flag=0} flag{print}' index.html > /tmp/idx.js
node --check /tmp/idx.js

# Pages deploy status
gh run list -R augustave/PERIODIC -L 5
gh repo view augustave/PERIODIC --web
```

### 5.2 MCP preview workflow
```
mcp__Claude_Preview__preview_start         { name: "periodic" }                # python3 http.server on :8081
mcp__Claude_Preview__preview_eval          { serverId, expression }             # JS in page context
mcp__Claude_Preview__preview_screenshot    { serverId }                         # JPEG snapshot
mcp__Claude_Preview__preview_console_logs  { serverId, level: "error" }         # client-side errors
mcp__Claude_Preview__preview_resize        { serverId, preset: "desktop" }      # viewport test
```

### 5.3 PRD 1.1 validation harness (paste into `preview_eval`)
```js
({
  d1_single_table:      document.querySelectorAll(".ptable").length,           // expect 1
  d1_single_wrap:       document.querySelectorAll(".table-wrap").length,       // expect 1
  d3_nested_in_mineral: document.querySelectorAll(".mineral-card .el").length, // expect 0
  d3_nested_in_op:      document.querySelectorAll(".op-card .el").length,      // expect 0
  table_position:       getComputedStyle(document.querySelector(".table-wrap")).position,  // expect "fixed"
  table_zIndex:         getComputedStyle(document.querySelector(".table-wrap")).zIndex,    // expect "10"
  table_display:        getComputedStyle(document.querySelector(".table-wrap")).display,   // expect "block"
})
```

### 5.4 Repo spot-checks (run on a fresh clone)
```bash
# Doctrine guards — each should print exactly 1
grep -c 'id="ptable"' index.html                                # 1
grep -c '<div class="table-wrap"' index.html                    # 1

# Animation watch-list — MUST end with "backwards;"
grep '\.el { animation: fadeUp' index.html

# Source-tagged edges count — should be ~47
grep -c 'source: "' index.html

# Default body class — should be analysis + substrate
grep '<body class="pi-shell' index.html
```

### 5.5 Critical files

| Path | Role |
|---|---|
| `index.html` | The served single-file app. **All UI changes go here.** |
| `periodic-table.html` | Legacy mirror — kept in sync; not served by Pages. |
| `README.md` | Public-facing project doc; doctrine + interface tour + provenance. |
| `HANDOFF.md` | **This file.** Session-continuity for the next agent. |
| `js/state/store.js` | Tiny store: `setState` + `registerRenderer`. |
| `js/modes/{analysis,mission}.js` | Body-class flippers. `explore.js` is retired but file exists. |
| `js/components/{panel,elements,lens,mission}.js` | Click delegators, panel open/close, lens overlay, mission highlight. |
| `js/data/minerals-operations.js` | All three datasets (REE, Lithium, Cobalt). |
| `js/data/mission-threads.js` | Mission filter sets + narratives. |
| `.claude/launch.json` | Preview config (`name: "periodic"`, port 8081). |
| `PER-GRAPH/*.json` + `*.txt` | Gemini knowledge-graph exports (integrated). |
| `Docs/Rare_Earth_Elements_*.json` | FPRI 2021 + supporting source documents. |

### 5.6 Footer anatomy (don't confuse them)

| Element | Position | Visible on | Purpose |
|---|---|---|---|
| `<footer>` (no class, line ~4276) | Document flow (`order: 3` in substrate flex) | Substrate panel only | Editorial **Color Mapping legend** + designer attribution. Caption to the periodic table. |
| `<footer class="site-footer" role="contentinfo">` (line ~4541) | Document flow at end | All panels | Utility dark band: brand mark, © 2026 ANP STUDIO, GitHub link, MIT License link, US flag SVG. |

---

## 6. Outstanding Future Hooks (not blocking)

- **Right-drawer dossier** — PRD 1.1 references `RightPanel > DossierPanel`. Currently a centered modal. CSS-only refactor possible.
- **Mobile dock UX** — at ≤600px viewports, consider a click-to-collapse handle for peek-only state.
- **Dock fade-on-scroll** — could auto-fade dock to 0.6 opacity during dense mineral reading; restore on hover.
- **LICENSE file** — site-footer links to `/blob/main/LICENSE` which 404s. Add standard MIT LICENSE.
- **`js/modes/explore.js`** — file still exists but the mode is retired. Safe to delete in a cleanup pass.
- **Source-attribution coverage** — 20 of ~67 KG edges still un-tagged. Could be backfilled if more provenance is needed.
