# MASTERPLAN.md

## System Overview
High-end, modern portfolio website for **Debashish Deb** (Full-Stack Web Developer & Biotechnologist).
The application is a client-side, zero-dependency static web application designed for deployment directly onto GitHub Pages (`debashish-deb.github.io`).

## Design Architecture & Philosophy
- **Aesthetic**: Apple & Linear grade luxury minimalist aesthetic. Deep dark mode by default (`#0a0d14` / `#0f1420`), luminous ambient radial glows, glassmorphism (`backdrop-filter: blur(16px)`), sophisticated modern typography (`Plus Jakarta Sans` / `Outfit` / `Inter`), crisp micro-interactions, subtle mesh gradients, and silky transitions.
- **Single Page Architecture (Seamless Smooth Flow)**:
  - Sticky glass header with brand monogram, smooth nav links, dynamic interactive indicator, Quick Resume trigger, and theme switcher.
  - **Hero Section**: Atmospheric glowing gradient backdrop, animated dynamic role tags, bio highlighting dual identity (Biotechnology × Full-Stack Software Engineering), CTA buttons ("Explore Projects", "View Resume", "Get in Touch"), social badges with live indicator, and an interactive modern canvas / SVG accent.
  - **About & Philosophy**: Dual-discipline spotlight (Tech & Biotech), quick metrics/stats counters (Years exp, scientific publications, tech stack depth).
  - **Featured Projects**: Premium cards with tag pills, GitHub / live preview links, glass hover effects, image previews with fallbacks.
  - **Experience & Timeline**: Clean vertical timeline with company badge, role, achievements, and tech badges.
  - **Skills Matrix**: Categorized tabbed or grid view (Frontend, Backend & Systems, Biotech & Scientific Tools, Leadership & Management) with proficiency indicators and interactive hover details.
  - **Education & Scientific Publications**: Dedicated academic card layout spotlighting PubMed / peer-reviewed haematology and oncology publications (University of Helsinki, Heckman group).
  - **Certificates & Honors**: Interactive grid of LinkedIn certifications and recognitions.
  - **Interactive Interactive Resume Viewer / Modal**: Instant clean overlay allowing visitors to read and download the complete resume cleanly formatted.
  - **Contact Section**: Interactive glass card with direct mailto, LinkedIn, GitHub, and functional message form.
  - **Footer**: Refined signature, copyright, status indicator, and quick links.

## Services / Modules and Boundaries
- `index.html`: Semantic HTML5 skeleton, modern web font imports, OpenGraph / Twitter meta tags, accessible landmark structure.
- `styles.css`: Complete modern design system using CSS variables, 4px grid tokens, mobile-first responsive media queries, dark/light themes, animations, safe area handling, and print styles for resume.
- `script.js`: Clean vanilla JS engine for data loading (`data.json`), dynamic rendering, smooth scrolling, active section observer, theme persistence, interactive resume modal, and toast notifications.
- `data.json`: Canonical content data source containing all projects, career history, biotech research, publications, and references.

## Key Architectural Decisions
- Linked in `docs/adr/0001-premium-redesign-architecture.md`
  - Zero heavy external runtime frameworks to ensure 100/100 Lighthouse performance, instant GitHub Pages loading, and zero build tool fragility.
  - Dynamic content rendering backed by structured `data.json` so updates to career, publications, or projects are effortless.

## Known Constraints
- Static GitHub Pages hosting (no Node/server runtime on host; form handling powered by Formspree or mailto).
