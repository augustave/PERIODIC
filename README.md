# Periodic & Pictorial

**A chromatic catalog of the elements, with critical-minerals appendices.**

An interactive periodic table layered with three operational appendices — rare-earth minerals, allied operations, and lithium — colored after a Take Nakano poster of four Japanese designers (Nagai, Tanaka, Fukuda, Ishioka). Built as a single HTML artifact, it functions simultaneously as a design exercise, a critical-minerals data viewer, and a research tool for the American Dynamism / strategic minerals thesis space.

ANP STUDIO · New York · Issue No. 01 · Q1 2026

---

## 1 · Goal

Make complex critical-minerals supply-chain data readable in the same act of looking that lets you read a poster. Two things should be true at once when someone opens the page:

1. **It should look like an editorial object.** A document worth printing, framing, or carrying. Not a dashboard.
2. **It should answer real strategic questions.** Where does dysprosium come from? What's funded? What's online? What changed when China announced export controls?

Most data tools force a choice between these. They are either pretty and dumb, or smart and ugly. The bet here is that the highest-density information visualization is itself an aesthetic object — that legibility is a design problem, not a UX-checklist problem, and that the editorial register (Fraunces serif, parchment background, asymmetric grid, designer attribution) actually *helps* people read complex datasets because it sets expectations of patience and density.

The artifact is a portfolio piece, a prototype, and a usable research tool — in that order of priority but with no clear hierarchy in the actual code, which is the point.

---

## 2 · Intent

Three intents stack:

### 2a · Editorial intent

The visual language traces back to a Take Nakano (中野豪雄) tribute poster celebrating four legendary Japanese graphic designers — Kazumasa Nagai, Ikko Tanaka, Shigeo Fukuda, and Eiko Ishioka. A 178-sample palette was extracted from that poster; ten dominant hues were mapped to the periodic table's element categories.

The mapping is not arbitrary. **Fukuda's crimson goes to the alkali metals** because both are the most reactive things in their domain. **Tanaka's sage goes to the organic non-metals** because both are quiet, foundational, life-bearing. **Ishioka's terracotta goes to the lanthanides** because rare earths and Ishioka's costume work share an earthy, blood-red gravity. **Nagai's signature orange goes to alkaline earths** because Nagai's posters never met a warm tone they couldn't structure around.

The intent is to honor the four through the act of cataloging — periodic tables are themselves catalogs of nature; this catalog of nature is colored by the discipline of cataloging poster history.

### 2b · Educational intent

Most periodic tables show category and atomic data. This one extends the read in two ways:

- **Reverse element-to-source lookup.** Click any element; see which minerals contain it and which operations produce it. The chemistry expands into a supply chain in one click.
- **Scenario filters.** Magnet-critical (Nd, Pr, Dy, Tb) and China-restricted (the April 2025 + October 2025 MOFCOM lists) cross-cut every grid simultaneously. Activating a scenario tells you what's at risk *and* what's being built to address it, in the same view.

A high schooler can use it as a periodic table. A policy analyst can use it as a critical-minerals dossier. A graphic designer can use it as a study in editorial color theory. The same artifact, three readings.

### 2c · Strategic intent

The dataset is curated, not exhaustive. Every operation included was chosen because it tells part of a coherent story about Western critical-minerals build-out post-2020 — the strategic infrastructure response to Chinese supply concentration. The artifact is implicitly an argument: that the supply-chain story is more legible than the headline-driven discourse around it suggests, and that the visible patterns (DoD bets downstream, DOE bets upstream, magnet REEs are the chokepoint, lithium has multiple geological paths but REEs have few) become obvious when the data is given a chance to be looked at.

The American Dynamism thesis — that defense, energy, and critical materials infrastructure are converging into a single investment surface — is not stated anywhere on the page. It's encoded in what's included, what's adjacent, and what each click reveals.

---

## 3 · Architecture

The artifact is **a single HTML file** with no build step, no framework, no external assets except Google Fonts (Fraunces + DM Mono + DM Sans). All data, all logic, all styling lives in one document.

### 3a · Why one file

- It travels. Email, USB stick, Slack drop, archive.org — all work.
- It runs offline after first font load.
- It is its own deployment artifact.
- It can be diffed, versioned, and source-archived as a single primary document.
- It honors a constraint from the broader DEADLIGHT design system Ven works in: **portable IP**. The artifact ships as a thing, not a service.

### 3b · Layers

The document has roughly seven concentric layers, in this order of dependency:

1. **Color palette + typography tokens** — CSS variables defining the Nakano poster colors, type scale, and ink/paper relationships
2. **Element data** — 118 elements with category, period, group, configuration, discovery year
3. **Periodic table render** — chromatic catalog, the visual hero
4. **Mineral dataset (REE + Lithium)** — formulas, tier, country origins, production data, primary REEs/elements, host of operations
5. **Operations dataset (REE + Lithium)** — operator, region, country, status, capacity, funding, segment, temporal data (firstYear / firstAnnounced / FID)
6. **Derived views** — capital allocation chart, country accordion, timeline (3-mode + compare), sparkline, stats summary
7. **Cross-cutting controls** — scenario filters (magnet / China), category filters, dataset toggle, deep-link routing, export tools, sticky utility bar, print modes

Each layer reads from the layer below; mutations flow upward through `renderXxx()` functions. The architecture is plain JavaScript (`let` / `const`, function declarations, event listeners) — no reactive framework, no virtual DOM, no compilation. The state machine is small enough to hold in a single mental model.

### 3c · Routing

Every meaningful state change writes to `location.hash`. URL grammar:

```
#scenario=china&op=12&tlmode=fid&dataset=ree&filter=alkali&mineral=2
```

Six addressable axes. Loading a URL with a hash applies state in dependency order — dataset first (so subsequent op lookups hit the right array), then timeline mode, filter pill, scenario, then selection. This makes every view shareable as a stable link. Citations in research notes, screenshots in pitch decks, links in Slack — all reproduce the exact view.

### 3d · Print

Two print modes. The default `@media print` rule produces an A4 portrait document with one section per page, source attribution footer, all interactive UI hidden, accordions force-expanded. Shift-clicking the Print button triggers `body.print-compact` which packs minerals and ops into 3-column grids, tightens type, and roughly halves the page count for distribution-ready PDFs.

The artifact is therefore *also* a publishable document. Not a print-friendly version of a web app — a digital surface that happens to print as a book.

---

## 4 · Art direction & design system

### 4a · Source palette

Ten dominant hues extracted from a 178-sample analysis of the Nakano tribute poster, mapped to element categories:

| Category | Hex | Designer source |
|---|---|---|
| Alkali metal | `#B51A21` | Fukuda — crimson |
| Alkaline earth | `#EE8E42` | Nagai — orange |
| Transition metal | `#574737` | Ishioka — umber |
| Post-transition | `#BAB4A2` | Tanaka — warm gray |
| Metalloid | `#ADA967` | Nagai — olive |
| Reactive nonmetal | `#2C312A` | Tanaka — sage |
| Halogen | `#7E2365` | Fukuda — magenta |
| Noble gas | `#D5D6D4` | Fukuda — pale gray |
| Lanthanide | `#925539` | Ishioka — terracotta |
| Actinide | `#2F261D` | Ishioka — near-black brown |

Plus environmental tokens — Fukuda's vellum cream `#ECE9CF` for paper, Ishioka's warmer cream `#E4D7C3` for elevated surfaces, Nagai's deep black `#0B0404` for ink, and a series of grays and khakis for secondary type.

The mineral and operations sections introduce additional palette assignments derived from the same source, applied to **tier** (mineral primary/secondary/minor) and **status** (operations online/build/project). The mineral tiers use Ishioka's earth tones; operations status uses Nagai's industrial blue `#235597` for online (the only deviation from strict poster-derivation, chosen for color distinction from REE earth tones), Nagai orange for build, and Tanaka warm gray for project.

### 4b · Typography

Three families, each with a job:

- **Fraunces** — variable serif. Used for display (`<h1>`, mineral/operation names, statistics). Italic by default with `opsz` adjusted to size context (14 for body italic, 36–144 for display). The choice is deliberate: Fraunces has a "work serif" feel — soft enough to feel editorial, contrasty enough to hold at small sizes, with optical sizing that lets the same family handle a 78-point title and a 12-point caption without compromise.
- **DM Mono** — monospace. All metadata, atomic data, country codes, button labels, eyebrows, technical readings. Mono signals "data" without slipping into engineering-aesthetic clichés (Inconsolata, JetBrains Mono); DM Mono has enough warmth to coexist with Fraunces.
- **DM Sans** — body sans. Used sparingly — descriptive prose only, never for navigation or labels.

The typographic system is editorial, not interface-y. Headings are italic. Body copy is justified by feeling, not by algorithm. Captions are mono. The gestalt is "art-book inside a research document."

### 4c · Layout grammar

- **Asymmetric grids.** No section uses a clean centered layout. Every block has weight on one side balanced by metadata on the other. Editorial publications behave this way; interfaces typically don't.
- **Dashed rules separate non-equal information.** Solid rules separate sections; dashed rules separate fields within a section. The visual hierarchy follows print convention.
- **Eyebrows everywhere.** Each block has a small mono eyebrow above the heading — `Appendix · 二〇`, `— Closing tally · 結 —`, `Source · ...`. These act as visual anchors and as a low-grade Japanese-character watermark scattered through the document, paying respect to the source poster without quoting it.
- **Borders, not shadows.** Drop shadows appear only on interactive hover states (cards lifting, modal opening). Static layout uses borders, often hairline, sometimes 1.5–2px for emphasis. Shadows feel digital; borders feel printed.
- **The four poster designers as filter pills.** The masthead's filter row includes both element-category filters and individual designer filters. Filtering by "Tanaka" reveals which elements were colored after Tanaka — a small joke for the typography-aware reader.

### 4d · Interaction principles

- **State changes are felt, not announced.** Selecting a mineral doesn't fire a notification; it slowly highlights the relevant elements on the table and dims everything else. The user reads the change.
- **One filter at a time, with clear precedence.** Mineral selection clears scenario filter. Scenario filter clears mineral. Filter pills clear both. Conflicts resolve by replacement, not stacking — fewer modes mean less visual noise.
- **Animations communicate continuity.** The FLIP animation on the timeline mode toggle exists specifically because chips re-bucketing into a different temporal arrangement is the *content*, not a side effect of the toggle. Watching Mt Weld's chip slide from "First Production: pre-2024" all the way back to "First Announced: 2002" is the data narrative.
- **The sticky utility bar auto-collapses after 4 seconds of idle scroll** to stay out of the reading flow, but pops back on any movement. The bar is a tool, not a frame.

---

## 5 · Philosophy

A few stances the artifact takes, articulated:

### 5a · The dataset is the dossier

Every operation, every mineral, every funding figure, every country chip is curated for a reason. Bastnäsite isn't first because alphabetical order; it's first because Bayan Obo + Mountain Pass produce ~64% of global REO. Mountain Pass isn't operation #1 because we like California; it's #1 because the entire U.S. critical-minerals story currently runs through that ore body and its downstream Independence and 10X facilities.

This is **editorial curation as data design**. The user trusts the order. When they click rank 17 and find Bokan / Louisiana SMC at $22M DoD funding, they understand that's where the marginal capital sits in the strategic stack. The rank ordering carries information that algorithmic sorting would destroy.

### 5b · Color is information

Every hue in the artifact is doing work. The crimson on the alkali metals tells you "reactive." The terracotta on the lanthanides tells you "earth." The industrial blue on online operations tells you "running, robust, productive." The Fukuda crimson on the China filter button tells you "restricted, hot, watch." Color isn't decoration — it's a parallel encoding layer that lets the visual cortex pre-process the document before the linguistic cortex parses any text.

A consequence of this stance: dark mode is not coming. The light parchment is part of the editorial code. A dark inversion would say something different about the document's character (more terminal, less atelier), and that's not the right register for this material.

### 5c · The periodic table is a palette

The chromatic catalog is the visual hero, not because chemistry is the point but because the periodic table itself is one of the great information designs of the twentieth century — a 7×18 grid that encodes valence, period, family, and atomic mass simultaneously. Putting it at the top of the page anchors the rest of the document to a structure the reader already knows.

The minerals and operations grids below it are *appendices* that draw from the master grid. Click an element; see its appearances. Click a mineral; watch its REEs glow on the master grid. The hierarchy is intentional: the chemistry is foundational, the supply chain is derivative, the policy is consequence.

### 5d · Designing legibility for complex systems

This is the stated thesis of Ven's broader practice — designing legibility for systems that are too complex to be self-evident. The periodic-table-as-supply-chain-viewer is a specific instance of that thesis. Other instances in the broader portfolio include TAK-H (tactical mosaic C2 visualization), DEFENSE.OBSERVER (visual operating language for defense intelligence), the DEADLIGHT design system (master visual language for the work). The artifact is a portfolio piece for that thesis as much as a dataset.

The implicit claim: if you can make critical-minerals supply chains legible without dumbing them down, you can probably make sensor fusion legible, defense doctrine legible, RL training dynamics legible. The technique is general; the artifact is the proof.

### 5e · One-click insights, not one-click answers

The artifact does not summarize "DoD has bet $1.83B on the U.S. REE supply chain primarily downstream." It shows you the four bars (Mining $90M / Separation $430M / Magnets $1.40B / Recycling $0) and lets you draw the conclusion in two seconds of looking.

This is a deliberate choice. Summaries collapse information; visualizations preserve it. The reader who notices the absence of recycling capital — and who therefore asks "wait, *why* is recycling at zero in a supply chain that's supposed to be circular?" — has done more useful thinking than they would have done by reading a paragraph that names the gap. The artifact respects the user's capacity for inference.

---

## 6 · Future plans

In rough order of likelihood and ease:

### 6a · Near-term (already-mapped)

- **Third dataset overlay: cobalt.** Same UI, swapped data. Would complete the "battery materials trifecta" and surface the DRC concentration risk most starkly. Cobalt operations are even more geographically concentrated than REEs.
- **Cross-dataset comparison view.** A "compare datasets" mode showing REE and Lithium capital allocation side-by-side. Would make the upstream-vs-downstream policy difference visible in one frame — DOE concentrates on lithium upstream + geothermal, DoD concentrates on REE downstream magnets.
- **localStorage state persistence.** Current deep links handle inter-session sharing; localStorage would let "last viewed state" persist across browser sessions for individual users.
- **Open Graph metadata + social previews.** If this becomes a real URL, og:image previews showing the active scenario state would make the deep links shareable on social. Requires a server (or a static screenshot-generator step), but the architecture is ready.

### 6b · Medium-term (architectural)

- **Animated periodic-table category transitions.** When switching between datasets, the periodic-table category coloring stays the same — but a subtle pulse/scan animation could sweep across the active dataset's primary elements (REEs glow on REE load, Li glows on Lithium load) for half a second as the dataset settles. Reinforces the dataset switch as a moment, not a swap.
- **Magnet-critical filter for lithium.** Currently the magnet/China filters are REE-specific and disable in lithium mode. The lithium analog — "battery-critical" elements (Li, Co, Ni, Mn, graphite, P, F) — would activate naturally in lithium mode and flag the same chokepoint pattern.
- **Funding amount overlays beyond the badge.** Per-segment bars currently use total $; alternative encodings include per-operation circles plotted on a $-vs-time axis, or sankey-style flow from funding agency to segment.
- **Side-by-side mode comparison enhancement.** The compare timeline shows FID → first production lag with crimson lines for ≥5-year lags. A useful extension: clicking a dot reveals the announcement-to-FID-to-production three-leg journey as a polyline rather than a single connection.

### 6c · Long-term (architectural rewrite)

- **Standalone microsite at periodic-pictorial.anpstudio.co (or similar).** The current artifact is a single HTML file; a real microsite with a stable URL, server-side OG previews, monthly dataset updates, and a methodology page would serve a wider audience.
- **Editor mode.** A separate page (or modal) where dataset changes can be made through a UI, not by editing the HTML. Would lower the maintenance cost of keeping the data current, and would open the door to community-contributed datasets.
- **Generalized "critical materials viewer" framework.** The architecture isn't perfectly material-agnostic; section labels, scenario filters, and segment categories are baked in. A real framework would parameterize all of this — the user defines `materialName`, `criticalElements`, `scenarios`, `segments`, and the entire viewer renders from that config. At which point the project becomes infrastructure, not artifact, and merits a different kind of work entirely.
- **Print-on-demand zine.** The print stylesheet already produces a usable PDF. A small print run as an actual paper zine — A4, French-fold cover, properly bound — would close the editorial loop. The artifact already behaves like a publication; making it physically real is the obvious next move for a portfolio piece.

### 6d · Speculative / philosophical

- **Generative palette discovery.** Each new dataset could be auto-colored by analyzing a poster, an album cover, a textile, a photograph — feeding a different visual source into the same chromatic-catalog process. The Nakano poster is the source for issue No. 01; issue No. 02 might pull from Saul Bass, issue No. 03 from Massimo Vignelli, issue No. 04 from a Rauschenberg combine. Each issue gets its own palette and its own dataset. The artifact becomes a *series*, not a single piece.
- **A second axis: time.** The periodic table is a snapshot of chemistry; the operations grid is a snapshot of supply. A historical version that lets the user scrub from 2010 to 2026 and watch operations enter/exit, capital deploy, scenario filters appear (China export controls didn't exist before April 2025), would let the document become a time-machine of strategic minerals policy.
- **A third axis: speculation.** A "forecast" overlay where users can model what the operations grid looks like in 2030 if Bokan reaches FID, Tanbreez reaches production, Manono's JV dispute resolves, etc. Lets the artifact handle counterfactuals — useful for policy analysis, terrible for journalism, perfect for venture pitching.

---

## 7 · Sources & methodology

### 7a · Primary sources

- **U.S. Geological Survey** — Mineral Commodity Summaries 2025 (rare earths, lithium, key country statistics)
- **Department of Energy Loan Programs Office** — Thacker Pass ($2.26B), Hell's Kitchen ($1.36B), Rhyolite Ridge ($996M) loan details
- **Department of Defense / Department of War** — Mountain Pass Samarium Project ($150M), Lynas Seadrift ($258M), Ucore Bokan/Louisiana SMC ($22.4M), MP Materials 10X partnership (July 2025), Albemarle Kings Mountain ($90M DPA Title III)
- **Company filings** — MP Materials FY25, Lynas Rare Earths FY25, Albemarle FY24, SQM Q4 2024, Pilbara Minerals FY24, Lithium Americas project releases
- **Operator announcements** — Arafura (Nolans financing), Iluka (Eneabba), Hastings (Yangibana), Critical Metals Corp (Tanbreez), Controlled Thermal Resources (Hell's Kitchen)
- **Regulatory** — MOFCOM Announcement No. 18 (April 2025) and No. 61 (October 2025) for Chinese REE export controls

### 7b · Curation criteria

Operations are curated for **strategic significance**, not exhaustiveness. Each entry meets at least two of:

- Scale (production volume, resource size, or capacity > 1% of global)
- Strategic position (sole-source for a critical element, or first-of-kind in a geography)
- Federal involvement (DoD/DoW/DOE/equivalent funding or offtake)
- Narrative weight (status as the type-locality, the headline project, or the contested asset)

Funding figures reflect **publicly disclosed federal awards**. Commercial debt and equity are recorded only where directly tied to a federal commitment (e.g., the 10X Facility's $1B JPM/GS loan is included because it's commercially backed by the DoW offtake guarantee). Magnet-critical and China-restricted lists track the April 2025 and October 2025 MOFCOM announcements precisely; the October additions are flagged as "suspended" per the November 7 2025 negotiation pause.

### 7c · Known approximations

- **`firstAnnounced` and `fid` years** for some operations are best-effort dates from public records. Mt Weld's 2002 announcement, Bear Lodge's 2010, and similar legacy ops have fuzzy public-record start dates. Defensible numbers, not ironclad.
- **`pre-2024` in the timeline** is a bucket for operations that have been producing since before the current build cycle. Silver Peak (1966), Mt Weld (2007), Lynas Malaysia (2014) all appear in this bucket with placement approximate to ~2020 for visualization purposes.
- **Per-mineral production tonnages for the top four REE minerals** are estimates compiled from country-level USGS data; mineral-by-mineral tonnages aren't published as a clean dataset.
- **The 10X Facility funding bar** scales the $1B JPM/GS loan rather than the DoD's marginal contribution. This is a slight stretch of "federal capital"; strictly speaking it's "federal-backed commercial capital."
- **Lithium dataset** includes 10 minerals (not 20) because the commercially or geologically meaningful set tops out around there. Adding more would be padding.

---

## 8 · Credits

- **Editorial direction & design** — Ebenz Augustave (Ven), ANP STUDIO, New York
- **Built with** — Claude (Anthropic), agentic UI development, January–April 2026
- **Source palette** — Take Nakano (中野豪雄), tribute poster of Kazumasa Nagai · Ikko Tanaka · Shigeo Fukuda · Eiko Ishioka
- **Typography** — Fraunces (variable serif by Phaedra Charles & Flavia Zimbardi), DM Mono and DM Sans (DeepMind / Indian Type Foundry)
- **Type and color tokens** — derived from the Nakano poster + the broader DEADLIGHT design system
- **Structural inspiration** — Edward Tufte's small multiples, Massimo Vignelli's grid, Yusaku Kamekura's posters, the persistent visual grammar of the Whole Earth Catalog

The artifact carries on the editorial tradition of treating information design as a craft — the line that runs from Tufte to Bret Victor to the Bloomberg Graphics team to the Visual Capitalist team to the people quietly making good docs at NYT and Reuters. The intent is to make a small contribution to that tradition, materials-and-defense flavored.

---

## 9 · License & contact

Dataset and visualization released for research and editorial reference. Source attributions retained as primary; verify operational figures against current filings before publication. Visualization design © ANP STUDIO 2026.

For the source HTML, dataset corrections, or commission inquiries:

> **ANP STUDIO**
> New York
> ven@anpstudio.co (or appropriate)

---

*二〇二六 · Coloured after Nagai · Tanaka · Fukuda · Ishioka*
