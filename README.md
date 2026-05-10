# Periodic Intelligence

**A mineral-first intelligence instrument for the rare-earth, lithium, and cobalt supply chains. The periodic table is the persistent reference layer.**

🔗 **Live:** https://augustave.github.io/PERIODIC/
📦 **Repo:** https://github.com/augustave/PERIODIC
🇺🇸 **ANP Studio · New York · Issue No. 01 · Q1 2026**

---

## What it is

An interactive single-file webapp that treats critical minerals — not chemistry — as the primary object. The periodic table sits as a docked reference layer at the bottom of the viewport across every panel; mineral cards, operations, capital allocations, country sovereignty, IEA policy framework, and a knowledge-graph topology float above it. Three datasets, two modes, six analytical surfaces, four guided missions, and a knowledge graph with seven cited sources.

**Coloured after Take Nakano** — a tribute poster's 178-sample palette mapped category→designer (Kazumasa Nagai · Ikko Tanaka · Shigeo Fukuda · Eiko Ishioka). The editorial register (Fraunces italic serif, parchment background, asymmetric grid, designer attribution) is load-bearing: it signals patience and density, not dashboard-quickness.

---

## Doctrine (PRD 1.1)

The interface enforces four hard rules:

| | Rule | Why |
|---|---|---|
| **D1** | Elements are global. The periodic table renders **once and only once**. | A reference layer can't be torn down between modes — that's not how reference layers work. |
| **D2** | Minerals are primary. Elements respond to minerals, not the reverse. | The 2020s strategic question is about ores, refineries, and capital — not about electron configurations. |
| **D3** | No nested rendering. Element cells never live inside a mineral or operation card. | Prevents N×118 DOM duplication and decouples mineral-card layout from element-grid layout. |
| **D4** | State drives highlight only. Class toggles, never re-render. | A click on a mineral changes the *appearance* of element cells, not their existence. |

This translates to a layered render model — `mineral-layer` (z-20) over `element-layer` (z-10, fixed-bottom dock) under `overlay-layer` (z-30, mission/lens highlights). Switching panels, datasets, or missions never destroys, moves, or remounts the periodic table.

---

## Interface

### Top bar
**Periodic Intelligence** · Analysis | Mission · Strategic Lens dropdown · Clear

### Left panel
**Dataset** — Rare Earths · Lithium · Cobalt
**Navigate** — Substrate · Operations · Countries · Capital · Policy · Topology
**Missions** — Magnet Supply Chain · China Dependency · EV Bottleneck · Heavy REE Access

### Six panels

| Panel | What it shows |
|---|---|
| **Substrate** *(default landing)* | Mineral cards as the primary surface + the persistent docked periodic table beneath. The fused element-mineral surface. |
| **Operations** | Twenty-plus operations per dataset (online · build · project) with capacity, FID, first-year, country, federal-funding badges. Sortable by status. |
| **Countries** | Sovereign breakdown: capital-by-country accordion, supply-risk tiers (low / medium / high), op chips. |
| **Capital** | Federal/sovereign capital deployed by supply-chain segment (mining · separation · refining · magnets · recycling). Bars normalized within and across datasets. |
| **Policy** | The IEA's 8 critical-mineral recommendations (R1 Data → R8 Price Transparency), each card pairing the policy with the operations in the active dataset that exemplify it. |
| **Topology** | Six-cluster knowledge graph (REE classifications · mineralogy · technology · geographies · geopolitical frameworks · IEA framework) with hover/pin/cross-link interactivity, edge-type filters, and 47/67 source-tagged edges. |

### Modes
- **Analysis** *(default)* — full editorial chrome, free navigation, click anything for a dossier.
- **Mission** — guided thread (e.g. *Heavy REE Access* highlights Y, Tb, Dy, Ho, Er, Tm, Yb, Lu in the table; filters mineral cards to HREE-bearing only; scrolls the viewport to the element layer where the action lives).

### Datasets
- **Rare Earths** — 17 elements covered · 21 mineral hosts · 21 operations (incl. Niron iron-nitride magnet substitution).
- **Lithium** — 1 element · 10 minerals · 20 operations (spodumene, brine, hectorite, geothermal, jadarite).
- **Cobalt** — 1 element · 10 minerals · 21 operations (incl. LFP-cathode demand-displacement).

---

## Architecture

**Single-file vanilla JS application** — `index.html` (~9 100 lines) holds all CSS + HTML + the inline script. ES modules in `js/` (state store, mode flippers, components, dataset definitions, mission threads) are imported by inline `<script type="module">` glue. No build step, no framework, no dependency tree.

```
/index.html                        ← served single-file app
/periodic-table.html               ← legacy mirror
/js/
  state/store.js                   ← tiny setState + registerRenderer
  modes/{analysis,mission}.js      ← body-class flippers
  components/{panel,elements,lens,mission}.js
  data/minerals-operations.js      ← all three datasets
  data/mission-threads.js          ← mission filter sets
/PER-GRAPH/                        ← Gemini knowledge-graph exports (integrated)
/Docs/                             ← FPRI 2021 + supporting source documents
/HANDOFF.md                        ← session-continuity doc for the next agent
/.claude/launch.json               ← preview server config (python3 http.server :8081)
```

**State is body-class-driven.** Mode (`pi-mode-analysis | pi-mode-mission`), panel (`pi-panel-{substrate|operations|countries|capital|iea|topology}`), and overlays (`pi-mission-*`, `pi-lens-*`, `pi-focus`) all live as `<body>` classes. URL hash + `localStorage` mirror persistence, with cold-start dataset stripping to enforce the Rare Earths default.

**Knowledge graph** — `KG_CLUSTERS` × `KG_EDGES` × `SOURCES` registry. Six clusters, ~67 edges, 47 source-tagged (FPRI 2021 · USGS MCS 2025 · IEA CMO 2024 · CFR CSR101 2026 · MOFCOM 18 + 61 · DOE LPO). Hover any node to see its connections drawn live; click to pin; tech-cluster nodes that map to operations show a `→ Op` cross-link badge.

---

## Quick start

### Local preview
```bash
cd "/Users/taoconrad/Dev/Lightweight /PERIODIC"
python3 -m http.server 8081
# open http://localhost:8081/
```

Or via the MCP preview workflow (config in `.claude/launch.json`):
```
preview_start { name: "periodic" }
preview_screenshot { serverId }
```

### Deploy
GitHub Pages auto-deploys on push to `main`. Rebuild takes ~30–90 seconds.
```bash
git push   # triggers Pages rebuild via gh-pages source on main branch root
```

### Validation harness
Paste in DevTools console (or `preview_eval`) to verify the four PRD 1.1 doctrine rules:
```js
({
  d1_single_table: document.querySelectorAll(".ptable").length,                    // expect 1
  d3_nested_elements: document.querySelectorAll(".mineral-card .el, .op-card .el").length,  // expect 0
  table_position: getComputedStyle(document.querySelector(".table-wrap")).position, // expect "fixed"
  table_z_index: getComputedStyle(document.querySelector(".table-wrap")).zIndex     // expect "10"
})
```

---

## Design tour

The landing renders top-to-bottom:

1. **Top bar** — Periodic Intelligence brand · mode chips · Strategic Lens · Clear.
2. **Left sidebar** — Dataset switcher (REE/Li/Co), six-panel navigation, four-mission launcher. Collapses to a compact scrollable strip at narrow viewports.
3. **Editorial masthead** — *A Chromatic Catalog of the Elements · Periodic & Pictorial · coloured after Nagai · Tanaka · Fukuda · Ishioka*.
4. **Dataset strip** — three editorial buttons, currently-active dataset highlighted.
5. **Filter pills + scenario buttons** (magnets · China · battery-critical).
6. **Mineral grid** — 20+ tier-coded cards (Primary terracotta, Secondary umber, Minor khaki). Click any card to open its dossier.
7. **Periodic table dock** — fixed at viewport bottom, 35vh tall, 118 cells, REE positions visually prominent in resting state, mission/lens highlights overlay on demand.
8. **Color-mapping legend footer** — designer attribution, only visible on the substrate panel as caption to the table.
9. **Site footer** — dark utility band: brand mark, GitHub link, MIT License, US flag SVG.

Click anything for a dossier panel. Click the periodic table to scope minerals to that element. Click a section title (e.g. "Twenty Rare Earth Minerals") to open a meta panel describing what the section is and how to read it. Hit `Esc` or click outside to close any panel. URL hash captures full state for shareable deep links.

---

## Print

The page paginates as a small editorial broadsheet. The colophon-bar prints as the document footer; the dark utility site-footer is hidden. Each section avoids page-break-inside.

```
Cmd+P                         standard A4 portrait
Shift+Cmd+P                   compact 2-up mode
```

---

## Provenance & sources

**Quantitative data**
- USGS Mineral Commodity Summaries 2025 — production, reserves, import reliance.
- DOE Loan Programs Office disclosures — federal capital allocations.
- Company filings — MP Materials FY25, Lynas FY25, Albemarle, SQM, Glencore FY24.
- IEA Critical Minerals Outlook 2024 — R1–R8 framework + global production trends.

**Geopolitical analysis**
- FPRI (Foreign Policy Research Institute) 2021 — *America's Critical Strategic Vulnerability: Rare Earth Elements*. Source-tagged on the China-export-controls + leapfrog edges in the topology graph.
- CFR (Council on Foreign Relations) CSR101 2026 — Critical Minerals 101.
- MOFCOM Announcements 18 (Apr 2025) + 61 (Oct 2025) — China rare-earth export-control regime.

**Visual**
- Take Nakano (中野豪雄) tribute poster — 178-sample palette, four-designer category mapping.
- Fraunces (Phaedra Charles + Undercase Type) — italic serif for body and headlines.
- DM Mono (Colophon Foundry) — monospace for labels and metadata.

---

## Status & next

**Shipped (PRD 1.0 + 1.1 doctrine):**
- Mineral-first default landing on Rare Earths.
- Substrate panel as fused mineral + element surface.
- Persistent docked periodic table (D1–D4 doctrine).
- Mission flow scrolls to the element layer where filtered highlights live.
- 47/67 KG edges source-tagged.
- Heavy REE Access, Magnet Supply Chain, China Dependency, EV Bottleneck mission threads.
- US-flag site-footer.

**Future hooks** (not yet implemented):
- Right-drawer dossier (currently a centered modal).
- Mobile dock-collapse handle (peek-only state).
- LICENSE file at repo root (the site-footer link to `/blob/main/LICENSE` 404s until added).
- Dock fade-on-scroll for reading-focus mode.

See [HANDOFF.md](./HANDOFF.md) for full session-continuity context, the validation harness, and architectural watch-list.

---

## Credits

Design, code, doctrine — **ANP Studio**. Built iteratively with Claude Sonnet 4.6 as a coding pair. Source palette from a Take Nakano tribute poster honoring four Japanese designers. Knowledge-graph data ingested from Gemini structured exports plus the FPRI 2021 paper. All data citations preserved as inline source chips on the topology edges.

```
ANP STUDIO · NEW YORK · 2026
made in USA 🇺🇸
```
