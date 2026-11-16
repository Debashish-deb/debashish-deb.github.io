# Traceability Matrix

| Function / Component | File | Callers / Triggers | Description |
| :--- | :--- | :--- | :--- |
| `initApp()` | `script.js` | `DOMContentLoaded` | Loads `data.json?v=7` and orchestrates DOM rendering with sidebar layout and in-page panels |
| `applyTheme(theme)` | `script.js` | `initApp()`, `setupThemeToggle()`, `setupCommandPalette()` | Applies and persists theme class to `document.body` across sidebar and mobile controls |
| `setupThemeToggle()` | `script.js` | `initApp()` | Listens for clicks on `#theme-toggle-btn` and `#mobile-theme-toggle` to alternate theme |
| `renderMobileTopBar(data)` | `script.js` | `initApp()` | Builds sticky mobile navigation header with drawer toggle, monogram badge, and theme switcher |
| `renderSidebar(data)` | `script.js` | `initApp()` | Builds fixed desktop sidebar and mobile off-canvas drawer with brand, status pulse, vertical nav menu, utility dock, and scholar links |
| `renderHero(data)` | `script.js` | `initApp()` | Renders hero showcase with status pill, dynamic focus area typing, vertically-aligned 3D portrait, and social links |
| `renderMarquee()` | `script.js` | `initApp()` | Generates infinite horizontal ticker of core disciplines and computing competencies |
| `renderCurrentRoles(data)` | `script.js` | `initApp()` | Renders ongoing appointments at Färkkilä Laboratory (University of Helsinki) in card-free editorial columns |
| `renderCollaboration(data)` | `script.js` | `initApp()` | Generates scholarly collaboration and professional appointment offerings in a 3-column editorial prospectus |
| `renderAbout(data)` | `script.js` | `initApp()` | Renders comprehensive scholar-technologist bio narrative and 3 multidisciplinary pillars |
| `renderProjects(data)` | `script.js` | `initApp()` | Renders editorial project showcase with category tabs, highlights, links, and in-page `#project-dossier` container |
| `setupProjectDossier(data)` | `script.js` | `initApp()` | Handles Details button clicks and displays in-page architectural deep dive dossier without floating modals |
| `renderSkills(data)` | `script.js` | `initApp()` | Renders categorized skill groups with real-time search bar and animated level bars |
| `renderExperience(data)` | `script.js` | `initApp()` | Renders career appointments timeline with role tags, locations, duties, and tech badges |
| `renderEducationAndResearch(data)` | `script.js` | `initApp()` | Renders academic degrees and peer-reviewed oncological publications with 1-click citation copy |
| `renderCurriculumVitae(data)` | `script.js` | `initApp()`, nav CTA | Builds comprehensive in-page Academic Curriculum Vitae (CV) section with `@media print` stylesheet |
| `renderTestimonials(data)` | `script.js` | `initApp()` | Renders institutional endorsements and supervisor references |
| `renderContact(data)` | `script.js` | `initApp()` | Renders academic correspondence form and verified institutional channels |
| `renderFooter(data)` | `script.js` | `initApp()` | Renders refined footer with copyright, affiliations, and status |
| `setupNavigationEvents()` | `script.js` | `initApp()` | Configures smooth anchor scrolling, mobile sidebar drawer toggle, and keyboard accessibility |
| `setupScrollProgressBar()` | `script.js` | `initApp()` | Listens to window scroll events to update top reading progress bar |
| `setupBackToTop()` | `script.js` | `initApp()` | Shows/hides floating back-to-top button and executes smooth scroll |
| `setupProjectFilters()` | `script.js` | `initApp()` | Manages interactive category filtering for project items |
| `setupSkillSearch()` | `script.js` | `initApp()` | Performs real-time filtering on skill groups as user types |
| `setupCommandPalette(data)` | `script.js` | `initApp()` | Implements `Cmd+K` / `Ctrl+K` interactive search and in-page jump launcher |
| `setupTypewriterCycling()` | `script.js` | `initApp()` | Manages typing and deleting animation for focus area titles in hero section |
| `setup3DTilt()` | `script.js` | `initApp()` | Provides subtle 3D perspective mouse tilt on hero portrait wrapper |
| `setupCitationButtons()` | `script.js` | `initApp()` | Copies formatted academic citations to clipboard with instant toast feedback |
| `setupContactCopyButtons()` | `script.js` | `initApp()` | Handles 1-click copy for academic email and contact channels |
| `setupServiceSelectButtons()` | `script.js` | `initApp()` | Auto-populates correspondence form and scrolls smoothly when inquiring regarding a scope |
| `copyToClipboard(text, message)` | `script.js` | Multiple callers | Copies string to navigator.clipboard with fallback and toast feedback |
| `setupScrollSpy()` | `script.js` | `initApp()` | Uses IntersectionObserver to update active navigation links in sidebar during scroll |
| `setupSkillsObserver()` | `script.js` | `initApp()` | Animates skill level bars when scrolled into viewport |
| `setupFormHandler()` | `script.js` | `initApp()` | Submits correspondence form with validation, button spinner, and toast notification |
| `showToast(message)` | `script.js` | Multiple callers | Displays temporary notification toast with auto-dismiss |
