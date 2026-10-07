# Traceability Matrix

| Function / Component | File | Callers / Triggers | Description |
| :--- | :--- | :--- | :--- |
| `initApp()` | `script.js` | `DOMContentLoaded` | Loads `data.json` and orchestrates DOM rendering & event registration |
| `applyTheme(theme)` | `script.js` | `initApp()`, `setupThemeToggle()`, `setupCommandPalette()` | Applies and persists theme class to `document.body` |
| `setupThemeToggle()` | `script.js` | `initApp()` | Listens for clicks on `#theme-toggle-btn` to alternate theme |
| `renderHeader(data)` | `script.js` | `initApp()` | Builds responsive sticky glass navigation, brand monogram, command palette button, and theme switcher |
| `renderHero(data)` | `script.js` | `initApp()` | Renders hero showcase with status pill, dynamic focus area typing, 3D interactive tilt avatar, and social links |
| `renderMarquee()` | `script.js` | `initApp()` | Generates infinite horizontal ticker of core disciplines and institutions |
| `renderCurrentRoles(data)` | `script.js` | `initApp()` | Spotlights current executive roles at Infinite IT and Färkkilä Laboratory (University of Helsinki) |
| `renderFreelanceServices(data)` | `script.js` | `initApp()` | Generates freelance and consulting service offerings with deliverables checklist and engagement packages |
| `renderFreelanceProcess(data)` | `script.js` | `initApp()` | Generates 4-step transparent delivery methodology & quality guarantee roadmap |
| `renderAbout(data)` | `script.js` | `initApp()` | Renders comprehensive bio narrative, metric counters, and 3 multidisciplinary pillars |
| `renderProjects(data)` | `script.js` | `initApp()` | Renders project cards with category tabs, highlights, links, and Architecture Specs triggers |
| `renderSkills(data)` | `script.js` | `initApp()` | Renders categorized skill matrix with real-time search bar and animated level bars |
| `renderExperience(data)` | `script.js` | `initApp()` | Renders career timeline with role tags, locations, duties, and tech badges |
| `renderEducationAndResearch(data)` | `script.js` | `initApp()` | Renders academic degrees, high-impact publications with 1-click APA citation copy, and certificates |
| `renderTestimonials(data)` | `script.js` | `initApp()` | Renders institutional endorsements and supervisor references |
| `renderContact(data)` | `script.js` | `initApp()` | Renders contact info with quick copy buttons for email/phone, WhatsApp link, and message form |
| `renderFooter(data)` | `script.js` | `initApp()` | Renders refined footer with copyright, affiliations, and status |
| `renderResumeModal(data)` | `script.js` | `initApp()`, CTA buttons | Builds full print-ready Curriculum Vitae dialog |
| `setupNavigationEvents()` | `script.js` | `initApp()` | Configures smooth anchor scrolling and mobile hamburger menu toggling |
| `setupResumeModal()` | `script.js` | `initApp()` | Handles open/close triggers, backdrop click, and Escape key for resume modal |
| `setupScrollProgressBar()` | `script.js` | `initApp()` | Listens to window scroll events to update top gradient reading progress bar |
| `setupBackToTop()` | `script.js` | `initApp()` | Shows/hides floating back-to-top button and executes smooth scroll |
| `setupProjectFilters()` | `script.js` | `initApp()` | Manages interactive category filtering for project cards |
| `setupProjectModal(data)` | `script.js` | `initApp()` | Handles Architecture Specs button clicks and displays deep-dive system design modal |
| `setupSkillSearch()` | `script.js` | `initApp()` | Performs real-time filtering on skill cards and items as user types |
| `setupCommandPalette(data)` | `script.js` | `initApp()` | Implements `Cmd+K` / `Ctrl+K` interactive search and navigation modal |
| `setupTypewriterCycling()` | `script.js` | `initApp()` | Manages typing and deleting animation for focus area titles in hero section |
| `setup3DTilt()` | `script.js` | `initApp()` | Provides subtle 3D perspective mouse tilt on hero portrait wrapper |
| `setupCitationButtons()` | `script.js` | `initApp()` | Copies formatted APA research paper citations to clipboard with instant toast |
| `setupContactCopyButtons()` | `script.js` | `initApp()` | Handles 1-click copy for corporate email, academic email, and phone number |
| `setupServiceSelectButtons()` | `script.js` | `initApp()` | Auto-populates contact form and scrolls smoothly when inquiring for a service or package |
| `copyToClipboard(text, message)` | `script.js` | Multiple callers | Copies string to navigator.clipboard with fallback and toast feedback |
| `setupScrollSpy()` | `script.js` | `initApp()` | Uses IntersectionObserver to update active navigation links during scroll |
| `setupSkillsObserver()` | `script.js` | `initApp()` | Animates skill level bars when scrolled into viewport |
| `setupFormHandler()` | `script.js` | `initApp()` | Submits contact form asynchronously to Formspree with button spinner and toast |
| `showToast(message)` | `script.js` | Multiple callers | Displays temporary notification toast with auto-dismiss |
