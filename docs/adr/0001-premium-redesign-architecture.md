# ADR 0001: Premium Modern Architecture Redesign

## Status
Accepted

## Context
The existing portfolio for Debashish Deb on `debashish-deb.github.io` used an older single-section-swapping JS pattern with heavy box styles, harsh contrast, and fragmented page switching where sections like about, skills, and projects were hidden until clicked. Modern web expectations require a cohesive, storytelling narrative landing experience (scrolling single-page showcase) combined with fast direct navigation, responsive mobile-first elegance, sleek typography, micro-interactions, dark/light themes, and spotlighting Debashish's unique dual profile: Full-Stack Web Development + Molecular Biotechnology (University of Helsinki published researcher).

## Decision
1. Retain pure modern Vanilla ES6+ and CSS3 Custom Properties without bulky external build steps, ensuring lightning-fast load times on GitHub Pages (<0.5s) and 100/100 Lighthouse performance.
2. Structure the site as a cohesive, flowing single-page presentation with a floating glass navigation bar, active scroll-spy, and an instant full-screen Resume Modal.
3. Enhance `data.json` integration so all content (projects, publications, experience, education, skills, references) is rendered seamlessly with rich interactive states and fallback handling.
4. Upgrade visual design to Apple/Linear-grade: typography (Plus Jakarta Sans + Outfit), subtle ambient mesh gradients, 4px grid system, 44px+ touch targets, dark/light semantic palette, accessible contrast ratios.

## Consequences
- Fast deployment directly via git push to GitHub Pages without dependency installation or build pipeline failures.
- Highly maintainable and extensible.
- Superior mobile and desktop user experience.
