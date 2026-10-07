# Traceability Matrix

| Function / Component | File | Callers / Triggers | Description |
| :--- | :--- | :--- | :--- |
| `initApp()` | `script.js` | `DOMContentLoaded` | Loads `data.json` and orchestrates rendering |
| `renderNavbar()` | `script.js` | `initApp()` | Builds responsive sticky glass navigation & mobile menu |
| `renderHero()` | `script.js` | `initApp()` | Renders hero section with dual-specialty badges & CTA |
| `renderAbout()` | `script.js` | `initApp()` | Renders comprehensive bio and stats highlights |
| `renderProjects()` | `script.js` | `initApp()` | Renders featured projects grid with tech chips & action links |
| `renderExperience()` | `script.js` | `initApp()` | Renders interactive career timeline |
| `renderSkills()` | `script.js` | `initApp()` | Renders categorized skill matrix with level indicators |
| `renderEducation()` | `script.js` | `initApp()` | Renders education milestones |
| `renderPublications()` | `script.js` | `initApp()` | Renders peer-reviewed scientific publications |
| `renderCertificates()` | `script.js` | `initApp()` | Renders certifications & credentials |
| `renderReferences()` | `script.js` | `initApp()` | Renders professional references |
| `renderContact()` | `script.js` | `initApp()` | Renders contact form and social connectivity cards |
| `renderResumeModal()` | `script.js` | `initApp()`, Resume CTA buttons | Renders interactive print-ready full resume view |
| `setupTheme()` | `script.js` | `initApp()`, Theme button click | Toggles and persists dark/light theme |
| `setupScrollSpy()` | `script.js` | Post-render | Observes sections to update active navigation links |
| `setupContactForm()` | `script.js` | Post-render | Handles async form submission with feedback notifications |
