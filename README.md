# Debashish Deb — Portfolio & Engineering Showcase

A personal portfolio and software engineering showcase for **Debashish Deb** (Full-Stack Software Developer & Biotechnologist based in Finland).

Deployed live at: [https://debashish-deb.github.io](https://debashish-deb.github.io)

---

## 🌟 Highlights & Features

- **Apple / Linear Design System**: Refined aesthetic featuring dynamic ambient mesh radial glows, glassmorphism (`backdrop-filter`), and a 4px tokenized layout scale.
- **Multidisciplinary Storytelling**: Showcases dual expertise across Full-Stack Web Development (Go, React, Node.js, Flutter) and Molecular Biotechnology (University of Helsinki M.Sc. and published cancer oncology researcher at FIMM).
- **Responsive & Accessible**: Strict mobile-first architecture, skip navigation links, high-contrast dark/light modes, keyboard-navigable dialogs, and minimum 44px touch targets.
- **Dynamic Content Architecture**: Zero-build runtime powered by pure Vanilla ES6+ and `data.json` for lightning-fast loading and instant updates.
- **Print-Ready Curriculum Vitae Modal**: In-browser resume viewer with instant print / save-to-PDF formatting.
- **Interactive Contact Form**: Direct integration with Formspree and social connectivity badges.

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
