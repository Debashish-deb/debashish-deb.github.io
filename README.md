# Debashish Deb — Scholarly & Systems Engineering Portfolio

A personal academic portfolio and software engineering showcase for **Debashish Deb** (Molecular Biotechnologist turned Software Developer & Computational Systems Specialist at Färkkilä Laboratory, University of Helsinki).

Deployed live at: [https://debashish-deb.github.io](https://debashish-deb.github.io)

---

## 🌟 Highlights & Features

- **Sidebar Navigation Architecture**: Fixed desktop sidebar (`290px`) featuring academic monogram, identity, institutional affiliations, status indicator, active scroll-spy navigation, ⌘K search trigger, theme switcher, and direct scholar links. On mobile, transitions seamlessly into an off-canvas sliding drawer with darkened backdrop.
- **Card-Free Editorial Layout**: Moved away from heavy boxed card envelopes and bulky shadows to an elegant, typography-driven Swiss/academic aesthetic with crisp hairline dividers and generous whitespace.
- **In-Page Detailed System Architecture Dossiers**: Deep dive into system architecture, concurrency models, data persistence, and engineering governance directly in-page beneath project showcases with smooth scroll and collapse controls. Zero floating modal popups.
- **In-Page Academic Curriculum Vitae (CV)**: Full academic curriculum vitae embedded natively in the page flow (`#cv`), formatted with print stylesheet for high-precision PDF exports (`window.print()`).
- **Scholar-Technologist Narrative**: Molecular biotechnologist managing CSC supercomputing workflows, scientific databases, and precision oncology platforms at Färkkilä Laboratory (Biomedicum Helsinki).
- **Collaborations & Technical Appointments**: Structured 3-column editorial prospectus for Full-Stack Web & Scientific Architectures, Flutter Mobile Engineering, and Supercomputing/Data Infrastructure.
- **Accurate Project Links**: Real-world projects with dedicated GitHub source repositories, external live demos, and laboratory portals.
- **Interactive Command Palette (`Cmd+K`)**: Rapid keyboard-driven search and in-page navigation launcher.
- **Real-Time Skill Search**: Instant search filtering across computational, software, and laboratory capabilities.
- **1-Click Academic Citation Copying**: Peer-reviewed oncological publications (*Haematologica*, *Blood*) with instant citation copying.
- **Responsive & Accessible (Apple/Linear Grade)**: Strict mobile-first architecture, reading progress indicator, floating back-to-top button, skip links, high-contrast dark/light modes, and keyboard navigation.

---

## 🛠️ Tech Stack

- **Core**: Semantic HTML5, Modern CSS3 Custom Properties (4px grid scale), Vanilla JavaScript (ES6+)
- **Typography**: Outfit, Plus Jakarta Sans, and JetBrains Mono via Google Fonts, Font Awesome 6
- **Hosting**: GitHub Pages (Static hosting)

---

## 📂 Project Structure

```text
├── index.html                 # Semantic application entrypoint & meta tags
├── styles.css                 # Sidebar architecture, editorial card-free styles & print rules
├── script.js                  # Dynamic controller, sidebar drawer, in-page dossier & CV
├── data.json                  # Single source of truth for systems, bio & history
├── MASTERPLAN.md              # System topology and architectural specifications
├── docs/
│   ├── adr/
│   │   └── 0001-premium-redesign-architecture.md
│   └── traceability.md       # Function-to-caller traceability matrix
└── *.webp, *.png              # Project previews and scholar profile portrait
```

---

## 🚀 Local Development

```bash
# Serve locally
python3 -m http.server 8080
# Open http://localhost:8080
```

## Cover photograph

The [Biomedicum Helsinki atrium photograph](https://commons.wikimedia.org/wiki/File:Biomedicum_Helsinki_inside_view.jpg) by Mjeltsch is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The site uses a resized WebP under the same license, with a responsive crop and dark overlay applied in CSS.

## CV download

After changing the CV or publications, open `/#cv` from the local server and select **Print or save PDF**. Check the two A4 pages and replace `Debashish-Deb-CV.pdf` before publishing.
