# MASTERPLAN.md

## System Overview
High-end, modern portfolio website for **Debashish Deb** (Full-Stack Web Developer & Biotechnologist).
The application is a client-side, zero-dependency static web application designed for deployment directly onto GitHub Pages (`debashish-deb.github.io`).

## Design Architecture & Philosophy
- **Aesthetic**: Apple & Linear grade luxury minimalist aesthetic. Deep dark mode by default (`#0a0d14` / `#0f1420`), luminous ambient radial glows, glassmorphism (`backdrop-filter: blur(16px)`), sophisticated modern typography (`Plus Jakarta Sans` / `Outfit` / `Inter`), crisp micro-interactions, subtle mesh gradients, and silky transitions.
- **Single Page Architecture (Seamless Smooth Flow)**:
  - Sticky glass header with brand monogram, smooth nav links, dynamic interactive indicator, Quick Command Palette trigger (`Cmd+K`), Quick Resume trigger, and theme switcher.
  - **Scroll Progress Bar & Back to Top**: Real-time reading progress indicator and smooth return-to-top button.
  - **Hero Section**: Atmospheric glowing gradient backdrop, animated dynamic focus area typing, bio highlighting dual identity (CEO @ Infinite IT × IT Specialist @ Färkkilä Lab UH), 3D perspective mouse tilt portrait, CTA buttons ("Freelance & Services", "Explore Projects", "View Full CV", "Book / Contact"), social badges with live indicator, and direct WhatsApp connectivity.
  - **Current Key Positions**: Dual flagship cards spotlighting CEO at Infinite IT and IT Specialist at Färkkilä Laboratory (Biomedicum Helsinki, University of Helsinki).
  - **Freelance & Client Services (`#services`)**: Comprehensive service offerings (Full-Stack Web & SaaS, Flutter Mobile Apps, Biomedical Data Platforms, Fractional CTO Advisory) with deliverables checklists and flexible engagement models (MVP Sprint, Monthly Retainer, Architecture Audit).
  - **Delivery Methodology & Guarantees (`#process`)**: 4-step transparent roadmap (Discovery & Blueprint, Agile Sprints, Rigorous QA under Finnish industrial zero-defect standards, Handover & 30-Day Warranty).
  - **About & Philosophy**: Dual-discipline spotlight (Tech & Biotech), quick metrics/stats counters (Years exp, scientific publications, tech stack depth).
  - **Featured Projects & Category Filtering**: Interactive category filter tabs (All, Enterprise, Mobile, Biomedical Systems, Algorithms, Web), media previews with graceful fallbacks, tag pills, GitHub / live preview links, and Architecture Specifications drawer/modal.
  - **Experience & Timeline**: Clean vertical timeline with company badge, role, achievements, and tech badges.
  - **Skills Matrix & Live Search**: Real-time search bar + categorized grid (Executive Leadership, Software Engineering, Scientific Computing, Industrial Quality) with animated level bars.
  - **Education & Scientific Publications**: Dedicated academic card layout spotlighting PubMed / peer-reviewed haematology and oncology publications (University of Helsinki, Heckman group) with 1-click APA citation copy.
  - **Certificates & Honors**: Interactive grid of LinkedIn certifications and recognitions.
  - **Interactive Resume Viewer / Modal**: Instant clean overlay allowing visitors to read and download the complete resume cleanly formatted with print stylesheet.
  - **Command Palette (`Cmd+K`)**: Modal search allowing rapid keyboard-driven navigation across sections, freelance services, external portals, and actions.
  - **Contact & Project Inquiry Section**: Interactive glass card with direct mailto, 1-click email/phone copy pills, direct WhatsApp link, LinkedIn, GitHub, and functional message form with project type and timeline selectors.
  - **Footer**: Refined signature, copyright, status indicator, and quick links.

## Services / Modules and Boundaries
- `index.html`: Semantic HTML5 skeleton, modern web font imports, OpenGraph / Twitter meta tags, accessible landmark structure, scroll progress bar, and modal overlays.
- `styles.css`: Complete modern design system using CSS variables, 4px grid tokens, mobile-first responsive media queries, dark/light themes, animations, command palette styling, safe area handling, and print styles for resume.
- `script.js`: Clean vanilla JS engine for data loading (`data.json`), dynamic rendering, smooth scrolling, active section observer, theme persistence, interactive resume modal, command palette (`Cmd+K`), live skill search, category filtering, architecture modals, and toast notifications.
- `data.json`: Canonical content data source containing all projects with architecture highlights and category tags, career history, biotech research, publications with APA citations, and references.

## Key Architectural Decisions
- Linked in `docs/adr/0001-premium-redesign-architecture.md`
  - Zero heavy external runtime frameworks to ensure 100/100 Lighthouse performance, instant GitHub Pages loading, and zero build tool fragility.
  - Dynamic content rendering backed by structured `data.json` so updates to career, publications, or projects are effortless.

## Known Constraints
- Static GitHub Pages hosting (no Node/server runtime on host; form handling powered by Formspree or mailto).
