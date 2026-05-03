# Periodic & Pictorial

**A chromatic catalog of the elements, with critical-minerals appendices.**

An interactive periodic table layered with operational appendices for the three minerals most strategically contested in the 2020s — rare earths, lithium, and cobalt — plus an IEA policy framework and an interactive supply-chain topology graph. Colored after a Take Nakano poster of four Japanese designers (Kazumasa Nagai, Ikko Tanaka, Shigeo Fukuda, Eiko Ishioka). Built as a single HTML artifact, it functions simultaneously as a design exercise, a critical-minerals data viewer, and a research tool for the American Dynamism / strategic minerals thesis space.

🔗 **Live site:** https://augustave.github.io/PERIODIC/
📦 **Repo:** https://github.com/augustave/PERIODIC

ANP STUDIO · New York · Issue No. 01 · Q1 2026

---

## 1 · Goal

Make complex critical-minerals supply-chain data readable in the same act of looking that lets you read a poster. Two things should be true at once when someone opens the page:

1. **It should look like an editorial object.** A document worth printing, framing, or carrying. Not a dashboard.
2. **It should answer real strategic questions.** Where does dysprosium come from? What's funded? What's online? What changed when China announced export controls? Which projects exemplify each IEA recommendation?

Most data tools force a choice between these. They are either pretty and dumb, or smart and ugly. The bet here is that the highest-density information visualization is itself an aesthetic object — that legibility is a design problem, not a UX-checklist problem, and that the editorial register (Fraunces serif, parchment background, asymmetric grid, designer attribution) actually *helps* people read complex datasets because it sets expectations of patience and density.

The artifact is a portfolio piece, a prototype, and a usable research tool — in that order of priority but with no clear hierarchy in the actual code, which is the point.

---

## 2 · Intent

Three intents stack.

### 2a · Editorial intent

The visual language traces back to a Take Nakano (中野豪雄) tribute poster celebrating four legendary Japanese graphic designers — Nagai, Tanaka, Fukuda, Ishioka. A 178-sample palette was extracted from that poster; ten dominant hues were mapped to the periodic table's element categories.

The mapping is not arbitrary. **Fukuda's crimson goes to the alkali metals** because both are the most reactive things in their domain. **Tanaka's sage goes to the organic non-metals** because both are quiet, foundational, life-bearing. **Ishioka's terracotta goes to the lanthanides** because rare earths and Ishioka's costume work share an earthy, blood-red gravity. **Nagai's signature orange goes to alkaline earths** because Nagai's posters never met a warm tone they couldn't structure around.

The intent is to honor the four through the act of cataloging — periodic tables are themselves catalogs of nature; this catalog of nature is colored by the discipline of cataloging poster history.

### 2b · Educational intent

Most periodic tables show category and atomic data. This one extends the read in five ways:

- **Reverse element-to-source lookup.** Click any element; see which minerals contain it and which operations produce it. The chemistry expands into a supply chain in one click.
- **Scenario filters.** Magnet-critical (Nd, Pr, Dy, Tb), China-restricted (April + October 2025 MOFCOM lists), and Battery-critical (Li, C, Co, Ni, Mn, P, F) cross-cut every grid simultaneously. Activating a scenario tells you what's at risk *and* what's being built to address it, in the same view.
- **Section-level detail panels.** Every section title — Twenty-Nine Allied Operations, IEA Policy Compass, Supply-Chain Topology, Cross-dataset Capital, etc. — opens a card explaining what the section is, how to read it, and surfacing live counts from the active dataset.
- **Three swappable datasets.** Rare Earths (29 operations), Lithium (20 operations), Cobalt (21 operations). Same UI, swapped feedstock — the architecture treats critical minerals as the unit; the periodic table is shared.
- **Substitution-target semantics.** When an operation displaces demand for an element rather than producing it (Niron Magnetics' iron nitride magnets bypass NdFeB; LFP cathodes bypass Co/Ni/Mn), the operation is listed under the elements it could *replace*. Demand-side disruption gets first-class treatment in the data model.

A high schooler can use it as a periodic table. A policy analyst can use it as a critical-minerals dossier. A graphic designer can use it as a study in editorial color theory. The same artifact, three readings.

### 2c · Strategic intent

The dataset is curated, not exhaustive. Every operation included was chosen because it tells part of a coherent story about Western critical-minerals build-out post-2020 — the strategic infrastructure response to Chinese supply concentration. The artifact is implicitly an argument: that the supply-chain story is more legible than the headline-driven discourse around it suggests, and that the visible patterns become obvious when the data is given a chance to be looked at.

Specific patterns the curation surfaces:

- **DoD bets downstream, DOE bets upstream.** Federal capital flows reveal strategic priority — the magnet bottleneck (Vulcan Elements $620M, MP Materials $1B DoW partnership) gets dollars precisely because Western mining capacity exists but magnetization capacity doesn't.
- **Magnet REEs are the chokepoint.** The R3 ecosystem-bottleneck story — strip casters, alignment pressers, and the 5–12× capex penalty for non-Chinese equipment — is the structural reason Western magnet capacity has lagged mining and separation by a decade.
- **Lithium has multiple geological paths; REEs have few.** Hard rock, brine, clay, geothermal — lithium's diversification is geological. REEs need ionic clays (China + Brazil) or low-radiation eudialyte (Sweden, Greenland) to escape monazite/bastnäsite + thorium handling.
- **The leapfrog basket.** Bioengineered protein separation (Alta Resources / In-Q-Tel), phytomining (Genomines), microorganism bioleaching (Rio Tinto Nuton), LAD chromatography (ReElement), AI-driven separation (Aclara), iron nitride magnets (Niron) — these aren't six unrelated startups; they're a coordinated bet that out-innovating beats out-mining.
- **The IEA framework as policy compass.** Eight recommendations from R1 (data) to R8 (price transparency); each one binds to specific operations in the dataset. R5 Supply Innovation is exemplified by Aclara, ReElement, Alta, Genomines, Nuton; R6 Demand Innovation by Niron and Japan's motor redesign programs; R7 Recycling by Phoenix Tailings, Carester, Neo Performance Materials, Li-Cycle, Redwood.

The American Dynamism thesis — that defense, energy, and critical materials infrastructure are converging into a single investment surface — is not stated anywhere on the page. It's encoded in what's included, what's adjacent, and what each click reveals.

---

## 3 · Architecture

The artifact is **a single HTML file** with no build step, no framework, no external assets except Google Fonts (Fraunces + DM Mono + DM Sans). All data, all logic, all styling lives in one document.

### 3a · Why one file

- **It travels.** Email, USB stick, Slack drop, archive.org — all work.
- **It runs offline** after first font load.
- **It versions cleanly** in git.
- **It prints well** — both A4 portrait and a Shift+Print compact 2-up mode.
- **It teaches by example.** Every technique used is visible to anyone who views source.

### 3b · Why no framework

The codebase touches CSS Grid, vanilla DOM manipulation, hash-based routing, FLIP animations, SVG bezier curves, and a handful of small custom utilities. A framework would have absorbed 200KB to do less than the current ~270KB does. The single-file constraint is also a discipline: every feature must justify its weight.

### 3c · Data model

```
DATASETS = { ree, lithium, cobalt }
  → meta { titleSection2, deck2, titleSection3, deck3, capitalDeck }
  → minerals[]   { rank, name, formula, type, tier, primary[], other[],
                   countries[], production, note }
  → operations[] { rank, name, operator, region, country, status,
                   mineralType, outputs[], capacity, firstYear,
                   firstAnnounced, fid, funding, fundingAmount,
                   segment, iea[], substitutionTarget, note }

ELEMENTS[]      = the 118-element periodic-table data
KG_CLUSTERS[]   = supply-chain knowledge-graph nodes (6 clusters, ~50 nodes)
KG_EDGES[]      = relationships between nodes (~55 edges, 4 types)
IEA_RECS[]      = the eight IEA policy recommendations (R1–R8)

ELEMENT_TO_MINERALS, ELEMENT_TO_OPERATIONS = reverse indices
COUNTRY_RISK, COUNTRY_ISO = country-level metadata
SCENARIOS                  = magnet/china/battery scenario filter sets
```

Switching datasets swaps `MINERALS` and `OPERATIONS` globals, rebuilds the reverse indices, re-renders all DOM grids, and emits a brief staggered "scan" animation across the periodic table cells. State is persisted to `localStorage` and reflected in the URL hash so links round-trip cleanly.

---

## 4 · Current capabilities

### 4a · The periodic table

- 118 elements in a CSS Grid, color-coded by category and Nakano-poster designer.
- Click any cell to open a detail panel with element data, the minerals it appears in (clickable), and the operations that produce it (clickable).
- Hover for visible cell brightening; selected cells get a thick ink border.
- Scenario filters (Magnet / China / Battery) dim non-matching cells across the table simultaneously with the same dim across mineral grid, ops grid, and timeline.

### 4b · Section II — Critical-mineral catalog

20–21 ranked mineral hosts per dataset, tier-coded by commercial significance (Primary terracotta · Secondary umber · Minor khaki). Each card shows formula, type, sovereign-supply countries with risk-dot chips, REE/element chips, and a curated note. Click a card to highlight every element it contains across the periodic table with a staggered pulse.

Section title opens a detail panel showing live tier counts, country-chip key, and how-to-read context.

### 4c · Section III — Allied operations

20–29 operations per dataset, status-coded (online blue · build orange · project gray). Each card shows operator, region, country chip, capacity, FID and first-production years, federal funding badge, and the elements it produces or — for substitution-threat entries — could displace. The REE dataset spans the full IEA-aligned chain: mining → separation → refining → magnet finishing → recycling → leapfrog R&D.

### 4d · Section IV — Allied capital + by-country sovereignty view

Federal capital deployed by supply-chain segment (Mining · Separation · Refining · Magnets · Recycling), with bars normalized within the dataset. A country sub-panel groups by sovereign jurisdiction with color-dotted risk indicators. Click a row to expand its operations.

### 4e · Cross-dataset capital comparison

Side-by-side segment bars across REE / Lithium / Cobalt, normalized to the global maximum so magnitudes are directly comparable. Reveals that REE concentrates downstream, Lithium concentrates upstream, Cobalt concentrates in recycling.

### 4f · Timeline + 3-leg compare view

Operations plotted by First Production / First Announced / FID year. Compare mode renders three rows (Announced → FID → First Production) with SVG polylines tracing each project's full journey. Crimson segments flag FID → Production lags of 5+ years — the legacy slow-build pattern.

### 4g · IEA Policy Compass

The International Energy Agency's eight recommendations rendered as an 8-card grid (R1 Data → R8 Price Transparency). Each card pairs the policy with the operations in the active dataset that exemplify it; project chips click through to surface the operation card.

### 4h · Supply-Chain Topology — interactive knowledge graph

Six concept clusters (REE Classifications · Mineral Sources · Technology Vectors · Geographies · Geopolitical Frameworks · IEA R1–R8) with ~55 edges across four types (Threat · Enables · Source · Policy).

- **Hover a node** → live SVG bezier curves draw between the node and all its connections (solid for outgoing, dashed for incoming, color-coded by edge type, arrowheads pointing at targets).
- **Click a node** to pin its highlight; click again or click the canvas background to release.
- **Edge-type filter chips** with live counts at the top of the section.
- **Show full graph** toggle for a density read.
- **Tech-node → operation cross-link**: nodes that map to specific operations (Niron, ReElement, Aclara, Alta, Genomines, Rio Tinto Nuton, Phoenix Tailings) get a `→ Op` badge that selects the operation card.

### 4i · Sticky utility bar

Bottom-fixed glass bar with: dataset toggle (REE / Li / Co), context-aware scenario buttons (Magnets/China shown only on REE; Battery shown only on Li/Co), timeline mode shortcuts (Prod / Anno / FID / ⇅ Compare), selection-aware status group with color-dot indicator + ↑ Table jump button + ✕ Clear All, share-link button (deep-link copy), and back-to-top.

The bar auto-collapses 8 seconds after scrolling *down*, never on scroll-up, and pauses entirely while a selection is active.

### 4j · Section-detail panels

Every section title (Minerals, Operations, Allied Capital, Cross-dataset, IEA, Topology) is clickable — opens a card explaining the section with live counts (e.g., "Twenty-nine ops · 9 online · 7 build · 13 project · $5.4B federal"), how-to-read prose, and bullet-list interactivity hints. Same panel pattern as element detail; ESC / click-outside / × to close.

### 4k · Data export

JSON copies a complete snapshot of the active dataset (minerals + operations + element categories + reverse indices) to the clipboard. CSV downloads two flat tables. Both routes preserve enough provenance to drop into a separate analysis pipeline.

### 4l · Print modes

- **A4 portrait** (default Cmd+P): editorial layout, all sections paginate cleanly.
- **Compact 2-up** (Shift+Click the print button): tightens to a two-column compact mode for at-a-glance reference.

---

## 5 · Progression history

Issue No. 01 of *Periodic & Pictorial* shipped in waves. The build moved from a single-dataset REE viewer to a three-dataset / six-cluster / IEA-framework / interactive-topology platform across roughly fourteen public commits.

### Wave I — Foundations (initial commit `ba1d10d`)
The first ship: REE periodic table, mineral and operation catalogs, scenario filters (Magnet, China), capital allocation panel, FLIP-animated timeline with bucket modes, hash-based deep linking, A4 + compact print modes, and the Nakano-derived color system. Single HTML file, ~5,646 lines.

### Wave II — Lithium dataset + cross-dataset compare (initial PR work)
A second dataset was bolted on without forking the codebase. The architecture refactored into `DATASETS = { ree, lithium }`, with `switchDataset(key)` swapping the underlying arrays and re-rendering. The dataset strip entered the masthead. The cross-dataset capital panel landed alongside, normalizing federal capital across segments to make REE-vs-Lithium investment shape comparable.

### Wave III — Three-dataset complete: Cobalt + battery filter + topology v1
Cobalt joined as the third dataset (10 minerals, 20 operations covering DRC mines, European refineries, North American battery recycling, seafloor nodule projects). Battery-critical filter introduced (Li, C, Co, Ni, Mn, P, F). Dataset switch animation (staggered pulse sweep). 3-leg compare view (Announced → FID → Production polylines). First version of the supply-chain knowledge-graph appendix as a labeled grid + edge table.

### Wave IV — Selection cue overhaul (`e518478`)
Auto-scroll on selection was removed (it was hijacking scroll position). Replaced with a brief staggered pulse animation on highlighted element cells + a discreet floating jump-hint chip. Setting the precedent that *selection should add context, not teleport you*.

### Wave V — Gemini batches 2–5 integration (`a95e398`)
Eight new operations added to REE (Vulcan Elements, ReElement Technologies, Aclara Resources, Carester, Neo Performance Materials, Alta Resources, Genomines, Rio Tinto Nuton). The IEA R1–R8 Policy Compass section landed between Cross-dataset Capital and Topology. Knowledge graph expanded from 5 to 6 clusters with ~30 new edges including the full IEA → operations mapping. Eudialyte enriched as the EU's strategic non-Chinese HREE pathway. New tech and policy nodes: Metallization Bottleneck, Equipment Shortage, Leapfrog Strategy, Valleys of Death, NEDC, In-Q-Tel, G7 Innovation Fund, CRMA, Strategic Mineral Reserve, Baotou Index.

### Wave VI — Layout fixes (`6bbfb79`, `8528bba`, `04b398c`, `3d85c3a`, `ca3b2a5`)
Multiple iterations on a card-gap problem caused by row-stretch interacting with notes of wildly different lengths. The final pattern: row-stretching preserved (no paper gaps in the grid), `.note` uses `flex: 1 1 auto + overflow-y: auto + min-height: 60px` (no max cap), chip rows `flex-shrink: 0` so they pin at the bottom, no `margin-top: auto` (caused conflicts in earlier attempts).

### Wave VII — Sticky bar overhaul (`670b26b`, `0803bdd`)
Battery scenario added to sticky bar. Scenario group hides irrelevant buttons per dataset via `body[data-active-dataset]` CSS attribute. Selection-aware status group with color-dot indicator (orange op · blue mineral · gold magnet · red China · umber battery · purple filter). The standalone floating jump-hint dissolved into the status group, eliminating the two-floating-things problem. Auto-collapse softened (scroll-down only, 8s timer, paused during selections).

### Wave VIII — Topology interactivity (`892a478`)
The supply-chain knowledge graph went from labeled grid to genuinely interactive topology. Live SVG bezier curves drawn between cluster cards on hover or pin. Edge-type filter chips with live counts. Click-to-pin. Tech-node → operation cross-links via `→ Op` badge. ResizeObserver redraws curves on grid reflow. Mobile-aware: SVG overlay hides under 720px where curves get noisy.

### Wave IX — Section-title interactivity (`6afa7b4`)
Every section title became a clickable affordance with an `ⓘ` hover indicator. Each opens a dedicated section-detail panel with live counts, how-to-read prose, and bullet-list interactivity hints. Lazy getters in the SECTION_INFO registry mean the counts reflect the active dataset every time the panel opens.

### Wave X — GitHub Pages deploy
Repository created at `github.com/augustave/PERIODIC`. GitHub Pages enabled on main branch root with an index.html redirect to `periodic-table.html`. The artifact became publicly browsable at https://augustave.github.io/PERIODIC/ in early May 2026.

---

## 6 · Future features (roadmap)

The project is open-ended by design — each new mineral or geopolitical event provides natural insertion points. Candidates being weighed:

### 6a · Datasets
- **Nickel** — the fourth battery-critical metal; Indonesia HPAL, Russia Norilsk, Western project pipeline.
- **Graphite** — China's structural anode dominance + the Western synthetic-graphite buildout.
- **Uranium** — civilian (SMR demand) and defense intersection, with Project Vault parallels.
- **Gallium · Germanium · Antimony** — the secondary China-restricted basket from the August 2023 export-control wave.

### 6b · Operations data quality
- **Quarterly refresh cycle** with a CHANGELOG anchored to specific MOFCOM announcements, USGS MCS releases, and DoD/DOE LPO press releases.
- **Real fundingAmount data** for entries currently marked `null` (Phoenix Tailings, Albemarle Wodgina, etc.).
- **Geo-coordinate addition** for a future map view.

### 6c · Visualizations
- **Geographic map** as an alternative read alongside the periodic table — operations as pins on a Mercator/equal-area projection, color-coded by dataset and status.
- **Sankey diagram** of mineral → operation → end-use flows, derived from the existing edge data.
- **Time-slider scrubber** for the timeline section, animating which operations are online/build/project at any year between 2010 and 2030.
- **3-leg compare → 4-leg** to add a Sanctions / Ramp axis where applicable.

### 6d · Knowledge graph evolution
- **Persistent node-positioning** so the topology graph could optionally use a force-directed layout instead of cluster grid.
- **Path-finding mode** — click two nodes and highlight the shortest edge path between them (e.g., Iron Nitride → ? → Defense Systems).
- **Edge-weight visualization** where multiple edges connect the same two nodes (currently unused, but the data model supports it).
- **External knowledge graph export** in standard formats (RDF/Turtle or Cypher) so the graph can be plugged into Neo4j or graph-LLM tooling.

### 6e · Reading and search
- **Free-text search** across all minerals, operations, notes, and KG nodes — currently only category and scenario filters exist.
- **Print-tailored citation list** generation from the data references baked into deck strings.
- **Audio/voice narration** of the editorial decks (accessibility + commute reading).
- **Localization**: Japanese first (the design lineage), then Korean and Mandarin — both are heavy stakeholder languages in critical-mineral discourse.

### 6f · Interactivity
- **Keyboard shortcuts overlay** (`?` to summon) — 1/2/3 for datasets, m/c/b for scenarios, p/a/f/v for timeline, Esc clears all.
- **Selection history** — back/forward through the last 10 selections.
- **Section jumps** in the sticky bar — buttons for ↧Operations, ↧Capital, ↧IEA, ↧Topology rather than just back-to-top.
- **Card-as-image export** for the active op/mineral card.

### 6g · Authoring
- **Editor mode** (URL flag `?edit=1`) that lets a maintainer rewrite operation notes inline and emit a JSON patch — closes the loop on the per-quarter refresh cycle.
- **Source-document attachments**: link each operation note to its supporting press release, USGS row, or filing PDF stored in `PER-GRAPH/sources/`.

### 6h · Architecture
- **WebAssembly-based PDF generator** for higher-quality print output than browser print.
- **Service-worker offline cache** so the app works offline indefinitely after first load.
- **Embedded Mermaid renderer** as a fallback for mobile users where the SVG topology overlay is hidden.

None of these are committed. They are the candidate list — chosen, when chosen, by editorial coherence with what's already there.

---

## 7 · Running it

### Locally
```bash
git clone https://github.com/augustave/PERIODIC.git
cd PERIODIC
open periodic-table.html      # macOS
xdg-open periodic-table.html  # Linux
start periodic-table.html     # Windows
```
No build step. No npm install. No server required.

For development with auto-reload on file change, any static-server tool works:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000/periodic-table.html
```

### Hosted
- **GitHub Pages**: https://augustave.github.io/PERIODIC/
- The hosted version always reflects `main`. Pages typically rebuilds 30–90s after a push.

### Printing
- **A4 portrait**: standard Cmd+P / Ctrl+P from the browser.
- **Compact 2-up**: Shift+click the Print button in the colophon, or hold Shift while triggering Cmd+P from the keyboard shortcut.

---

## 8 · Sources and credits

### Data sources
- **USGS Mineral Commodity Summaries 2025** — global production tonnages, reserves, year-on-year deltas.
- **MP Materials FY25 filings · Lynas Rare Earths FY25 results · Albemarle FY24 · SQM Q4 2024** — operator-level production and capacity data.
- **DOE Loan Programs Office** announcements — federal capital allocations (Thacker Pass, Hell's Kitchen, Rhyolite Ridge, Vulcan Elements, etc.).
- **DoD DPA Title III** awards — Niron Magnetics, Jervois Idaho, ReElement Technologies, Tamarack Nickel.
- **MOFCOM Announcement No. 18** (April 2025) and **No. 61** (October 2025) — Chinese REE export-control regimes.
- **IEA Critical Minerals Outlook** — the R1–R8 policy framework taxonomy.
- **CFR CSR101 (2026)** — Council on Foreign Relations Critical Minerals report; sourced for the Leapfrog Strategy framing and Valleys of Death financing-gap concept.
- **Cobalt Institute** — global cobalt production data.
- **Gemini structured knowledge-graph exports** (`PER-GRAPH/`) — used to seed the topology graph nodes and edges.

### Design lineage
- **Take Nakano (中野豪雄)** tribute poster celebrating Kazumasa Nagai, Ikko Tanaka, Shigeo Fukuda, and Eiko Ishioka. The 178-color palette extracted from this poster is the chromatic basis for the entire artifact.

### Tools
- **Fonts**: Fraunces, DM Mono, DM Sans (Google Fonts).
- **No frameworks**, no build step, no external JS libraries. Pure HTML / CSS / vanilla JavaScript.

---

## 9 · License + contact

The code is open source under MIT. The data curation is a creative work — quote freely with attribution.

For corrections, additions, or to suggest a fourth dataset, open an issue on [GitHub](https://github.com/augustave/PERIODIC/issues).

ANP STUDIO · New York
*Periodic & Pictorial* · Issue No. 01 · Q1 2026

---

> *"A periodic table colored after a poster about posters about chemistry."*
