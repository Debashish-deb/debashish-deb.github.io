# MASTERPLAN.md

## System Overview
High-end, modern academic & systems portfolio website for **Debashish Deb** (Computational Systems Specialist & Software Engineer).
The application is a client-side, zero-dependency static web application designed for deployment directly onto GitHub Pages (`debashish-deb.github.io`).

## Design Architecture & Philosophy
- **Aesthetic**: Swiss-minimalist, academic editorial aesthetic. Calibrated dual-palette system:
  - **Dark Luxe (Default)**: Deep obsidian canvas (`#0a0d14` / `#0c0f17`), luminous Nordic emerald (`#10b981`) and cyber mint (`#34d399`) jewel-tone accents, subtle glassmorphism (`backdrop-filter: blur(20px)`), and delicate hairline dividers.
  - **Light Luxury**: Crisp porcelain canvas (`#fafafc` / `#ffffff`), authoritative British racing green & deep botanical emerald (`#047857` / `#059669`), deep obsidian typography (`#0f172a`), and delicate sage borders.
- **Sidebar Navigation Architecture**:
  - **Desktop (`>= 1024px`)**: Fixed left sidebar (`290px` width) featuring the scholar monogram ("DD"), academic title ("Computational Systems Specialist"), institutional affiliation (Färkkilä Laboratory, Biomedicum Helsinki, University of Helsinki), real-time status pulse ("Open to Collaboration & Hiring"), vertical navigation list with active scroll-spy indicators, utility controls (⌘K search, theme switcher, CV jump), and verified social/academic channels.
  - **Mobile (`< 1024px`)**: Sticky top bar (`56px` height) with hamburger button, brand monogram, theme toggle, and off-canvas sliding sidebar drawer with backdrop blur.
- **Card-Free Editorial Layout**:
  - Eliminated bulky card enclosures, heavy box shadows, and 28px card shells in favor of clean hairline rules, generous whitespace, and high-readability typographic hierarchies.
  - **Projects Showcase**: Editorial list format with category tags, prominent titles, academic summaries, architectural highlight bullets, and action links.
  - **In-Page System Architecture Dossier (`#project-dossier`)**: Dedicated in-page deep-dive panel that expands smoothly beneath projects when "Architecture & Details" is clicked. Zero floating modal popups.
  - **In-Page Academic Curriculum Vitae (`#cv`)**: Comprehensive, print-ready academic CV embedded directly in the document flow with `@media print` styling, publication citations, and career appointments.
  - **Collaborations & Professional Appointments (`#collaboration`)**: 3-column editorial prospectus separated by crisp hairline rules.
  - **Appointments Timeline (`#experience`)**: Chronological academic curriculum vitae format.
  - **Scholarship & Publications (`#publications`)**: Peer-reviewed oncological publication records with 1-click citation copy.
- **Tone & Persona**:
  - Elevated, posh academic voice. Scholar-technologist stewarding scientific computing environments and multi-omics registries at Färkkilä Laboratory. Strictly zero mentions of "freelance", "CEO", or "Infinite IT".

## Services / Modules and Boundaries
- `index.html`: Semantic HTML5 skeleton, modern web font imports, OpenGraph / Twitter meta tags, accessible landmark structure, scroll progress bar, and layout container.
- `styles.css`: Complete modern design system using CSS variables, 4px grid tokens, sidebar layout rules, mobile drawer system, editorial typography, card-free styling, in-page dossier and CV styling, and print stylesheets.
- `script.js`: Clean vanilla JS engine for data loading (`data.json?v=7`), dynamic rendering, sidebar navigation, drawer events, active section scroll-spy, theme persistence, in-page system dossier, in-page CV, command palette (`Cmd+K`), live skill search, and category filtering.
- `data.json`: Canonical content data source containing all projects with architecture highlights and category tags, career history, biotech research, publications with APA citations, and references.

## Key Architectural Decisions
- Linked in `docs/adr/0001-premium-redesign-architecture.md`
  - Zero heavy external runtime frameworks to ensure 100/100 Lighthouse performance, instant GitHub Pages loading, and zero build tool fragility.
  - Dynamic content rendering backed by structured `data.json` so updates to career, publications, or projects are effortless.
  - Replaced floating modal popups with in-page detailed panels (`#project-dossier` and `#cv`) to ensure unobstructed reading flow and mobile accessibility.

## Known Constraints
- Static GitHub Pages hosting (no Node/server runtime on host; form handling powered by Formspree or mailto).
