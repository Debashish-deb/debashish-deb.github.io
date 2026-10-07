# Debashish Deb — Portfolio & Engineering Showcase

A personal portfolio and software engineering showcase for **Debashish Deb** (Full-Stack Software Developer & Biotechnologist based in Finland).

Deployed live at: [https://debashish-deb.github.io](https://debashish-deb.github.io)

---

## 🌟 Highlights & Features

- **Apple / Linear Design System**: Refined aesthetic featuring dynamic ambient mesh radial glows, glassmorphism (`backdrop-filter`), 3D perspective mouse tilt, dynamic focus area typing, and a 4px tokenized layout scale.
- **Executive Leadership & Biotech Profile**: Showcases dual expertise as Chief Executive Officer of Infinite IT and IT Specialist at Färkkilä Laboratory (Biomedicum Helsinki, University of Helsinki).
- **Interactive Command Palette (`Cmd+K`)**: Modal keyboard-driven command palette allowing rapid search, section jumps, theme toggle, and external portal shortcuts.
- **Projects Showcase with Category Filtering & Architecture Modal**: Instant filtering (Enterprise, Mobile, Biomedical, Algorithms, Web) and a dedicated Architecture Specs drawer detailing system design highlights and trade-offs.
- **Real-Time Skill Search**: Instant search input filtering categorized technical, executive, and scientific capabilities.
- **1-Click APA Citation Copying**: High-impact peer-reviewed cancer publications (*Haematologica*, *Blood*) with instant citation copying to clipboard.
- **Direct Connectivity**: 1-click email and phone copying, direct WhatsApp chat, and Formspree async contact form.
- **Responsive & Accessible**: Strict mobile-first architecture, scroll reading progress bar, floating back-to-top button, skip navigation links, high-contrast dark/light modes, keyboard-navigable dialogs, and minimum 44px touch targets.
- **Dynamic Content Architecture**: Zero-build runtime powered by pure Vanilla ES6+ and `data.json` for lightning-fast loading (<0.3s) and 100/100 Lighthouse performance.
- **Print-Ready Curriculum Vitae Modal**: In-browser resume viewer with instant print / save-to-PDF formatting.

---

## 🛠️ Tech Stack

- **Core**: Semantic HTML5, Modern CSS3 Custom Properties, Vanilla JavaScript (ES6+)
- **Typography**: Outfit & Plus Jakarta Sans via Google Fonts, Font Awesome 6 Icons
- **Deployment**: GitHub Pages (Static hosting)

---

## 📂 Project Structure

```text
├── index.html                 # Semantic application entrypoint & meta tags
├── styles.css                 # Comprehensive design system & responsive rules
├── script.js                  # Dynamic controller, modal, theme, and animations
├── data.json                  # Single source of truth for projects, bio & history
├── MASTERPLAN.md              # System topology and architectural specifications
├── docs/
│   ├── adr/
│   │   └── 0001-premium-redesign-architecture.md
│   └── traceability.md       # Function-to-caller traceability matrix
└── assets/images/             # Project screenshots & profile images
```

---

## 🚀 Local Development

To run locally without build tools:

```bash
# Python 3
python3 -m http.server 8000

# or Node.js npx
npx serve .
```

Then open `http://localhost:8000` in your browser.
