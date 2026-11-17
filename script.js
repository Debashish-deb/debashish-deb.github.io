/**
 * @traceability
 * Main client-side application controller for Debashish Deb's Scholarly & Systems Portfolio.
 * Implements sidebar navigation architecture, mobile off-canvas drawer, in-page detailed system dossiers,
 * in-page academic curriculum vitae (CV), card-free editorial design, theme management, scroll-spy,
 * live skill search, and quick keyboard command palette (Cmd+K).
 */

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Application State
  let portfolioData = null;
  let activeTheme = localStorage.getItem('theme') || 'dark-theme';

  /**
   * @traceability initApp
   * Entry point: Fetches portfolio data, sets up theme, and orchestrates DOM layout with sidebar and in-page detailed panels.
   */
  async function initApp() {
    try {
      applyTheme(activeTheme);
      const response = await fetch('data.json?v=25');
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      portfolioData = await response.json();

      // Clear loader and mount layout
      app.innerHTML = '';

      const layout = document.createElement('div');
      layout.className = 'app-layout';

      // 1. Mobile top bar (visible only on <= 1023px)
      const mobileTopBar = renderMobileTopBar(portfolioData);

      // 2. Stylish sidebar (fixed desktop, off-canvas drawer on mobile)
      const sidebar = renderSidebar(portfolioData);

      // 3. Mobile backdrop overlay
      const backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');

      // 4. Main content column
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'main-content-wrapper';

      const main = document.createElement('main');
      main.id = 'main-content';
      main.appendChild(renderHero(portfolioData));
      main.appendChild(renderMarquee());
      main.appendChild(renderCurrentRoles(portfolioData));
      main.appendChild(renderProjects(portfolioData));
      main.appendChild(renderCollaboration(portfolioData));
      main.appendChild(renderAbout(portfolioData));
      main.appendChild(renderSkills(portfolioData));
      main.appendChild(renderExperience(portfolioData));
      main.appendChild(renderEducationAndResearch(portfolioData));
      main.appendChild(renderCurriculumVitae(portfolioData)); // In-page CV
      main.appendChild(renderTestimonials(portfolioData));
      main.appendChild(renderContact(portfolioData));

      const footer = renderFooter(portfolioData);
      contentWrapper.appendChild(main);
      contentWrapper.appendChild(footer);

      layout.appendChild(mobileTopBar);
      layout.appendChild(sidebar);
      layout.appendChild(backdrop);
      layout.appendChild(contentWrapper);

      app.appendChild(layout);

      // Initialize interactions & observers
      setupNavigationEvents();
      setupThemeToggle();
      setupScrollSpy();
      setupScrollProgressBar();
      setupBackToTop();
      setupFormHandler();
      setupProjectFilters();
      setupProjectDossier(portfolioData);
      setupSkillSearch();
      setupCommandPalette(portfolioData);
      setupTypewriterCycling();
      setup3DTilt();
      setupCitationButtons();
      setupContactCopyButtons();
      setupServiceSelectButtons();

      document.body.classList.add('app-loaded');
    } catch (error) {
      console.error('Initialization error:', error);
      app.innerHTML = `
        <div class="container" style="padding: 100px 24px; text-align: center;">
          <h2 style="font-size: 2rem; margin-bottom: 16px;">Unable to load portfolio</h2>
          <p style="margin-bottom: 24px;">Failed to load data source. Please verify connectivity or check data.json.</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  /**
   * @traceability applyTheme
   * Applies and persists theme class on body, updating button icons across desktop sidebar and mobile top bar.
   */
  function applyTheme(theme) {
    activeTheme = theme;
    localStorage.setItem('theme', theme);
    document.body.className = theme;

    const sidebarThemeBtn = document.getElementById('theme-toggle-btn');
    if (sidebarThemeBtn) {
      const icon = theme === 'dark-theme' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
      const label = theme === 'dark-theme' ? 'Light Theme' : 'Dark Theme';
      sidebarThemeBtn.innerHTML = `${icon} <span class="util-label">${label}</span>`;
      sidebarThemeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark-theme' ? 'light' : 'dark'} mode`);
    }

    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    if (mobileThemeBtn) {
      mobileThemeBtn.innerHTML = theme === 'dark-theme' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
      mobileThemeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark-theme' ? 'light' : 'dark'} mode`);
    }
  }

  /**
   * @traceability setupThemeToggle
   * Wires click listeners on sidebar and mobile theme buttons.
   */
  function setupThemeToggle() {
    const sidebarThemeBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');

    function handleToggle() {
      applyTheme(activeTheme === 'dark-theme' ? 'light-theme' : 'dark-theme');
      showToast(`Switched to ${activeTheme === 'dark-theme' ? 'Dark' : 'Light'} theme`);
    }

    if (sidebarThemeBtn) sidebarThemeBtn.addEventListener('click', handleToggle);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', handleToggle);
  }

  /**
   * @traceability renderMobileTopBar
   * Generates sticky mobile header with drawer toggle, brand monogram, theme switch, and quick CV anchor.
   */
  function renderMobileTopBar(data) {
    const topBar = document.createElement('header');
    topBar.className = 'mobile-top-bar';
    topBar.innerHTML = `
      <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation drawer" aria-expanded="false">
        <i class="fas fa-bars" aria-hidden="true"></i>
      </button>

      <a href="#hero" class="mobile-brand" aria-label="Debashish Deb Home">
        <span class="brand-badge">${data.shortName || 'DD'}</span>
        <span class="mobile-brand-name">${data.name}</span>
      </a>

      <div class="mobile-top-actions">
        <button id="mobile-theme-toggle" class="mobile-icon-btn" aria-label="Toggle theme">
          ${activeTheme === 'dark-theme' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>'}
        </button>
        <a href="#cv" class="mobile-cv-pill" aria-label="Curriculum Vitae">CV</a>
      </div>
    `;
    return topBar;
  }

  /**
   * @traceability renderSidebar
   * Generates fixed desktop sidebar & off-canvas drawer navigation featuring academic identity, status pulse, vertical nav menu, utility dock, and scholar links.
   */
  function renderSidebar(data) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'site-sidebar';
    sidebar.id = 'site-sidebar';
    sidebar.setAttribute('aria-label', 'Main Sidebar Navigation');

    sidebar.innerHTML = `
      <div class="sidebar-top">
        <div class="sidebar-brand-wrapper">
          <a href="#hero" class="sidebar-brand-link" aria-label="Debashish Deb Home">
            <span class="sidebar-brand-badge">${data.shortName || 'DD'}</span>
            <div class="sidebar-identity">
              <span class="sidebar-name">${data.name}</span>
              <span class="sidebar-role">Research IT</span>
            </div>
          </a>
        </div>

        <div class="sidebar-status-box">
          <span class="status-dot"></span>
          <span class="sidebar-status-label">Open to roles and collaboration</span>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Primary Navigation">
        <ul class="sidebar-menu" id="sidebar-menu">
          <li>
            <a href="#hero" class="sidebar-link active" data-section="hero">
              <i class="fas fa-compass" aria-hidden="true"></i>
              <span>Overview</span>
            </a>
          </li>
          <li>
            <a href="#projects" class="sidebar-link" data-section="projects">
              <i class="fas fa-layer-group" aria-hidden="true"></i>
              <span>Projects</span>
            </a>
          </li>
          <li>
            <a href="#collaboration" class="sidebar-link" data-section="collaboration">
              <i class="fas fa-handshake" aria-hidden="true"></i>
              <span>Collaboration</span>
            </a>
          </li>
          <li>
            <a href="#about" class="sidebar-link" data-section="about">
              <i class="fas fa-user-graduate" aria-hidden="true"></i>
              <span>About</span>
            </a>
          </li>
          <li>
            <a href="#skills" class="sidebar-link" data-section="skills">
              <i class="fas fa-microchip" aria-hidden="true"></i>
              <span>Tools I Use</span>
            </a>
          </li>
          <li>
            <a href="#experience" class="sidebar-link" data-section="experience">
              <i class="fas fa-briefcase" aria-hidden="true"></i>
              <span>Experience</span>
            </a>
          </li>
          <li>
            <a href="#publications" class="sidebar-link" data-section="publications">
              <i class="fas fa-book-open" aria-hidden="true"></i>
              <span>Education &amp; Publications</span>
            </a>
          </li>
          <li>
            <a href="#contact" class="sidebar-link" data-section="contact">
              <i class="fas fa-envelope-open-text" aria-hidden="true"></i>
              <span>Contact</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-utility-controls">
          <button id="cmd-palette-btn" class="sidebar-util-btn" aria-label="Search and command palette (Cmd+K)" title="Command Palette (Cmd+K)">
            <i class="fas fa-search" aria-hidden="true"></i>
            <span class="util-label">Quick Jump</span>
            <span class="kbd-badge">⌘K</span>
          </button>
          <button id="theme-toggle-btn" class="sidebar-util-btn" aria-label="Toggle theme">
            ${activeTheme === 'dark-theme' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>'}
            <span class="util-label">${activeTheme === 'dark-theme' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
          <a href="#cv" class="sidebar-cv-btn" id="nav-resume-btn">
            <i class="fas fa-file-lines" aria-hidden="true"></i>
            <span>View CV</span>
          </a>
        </div>

        <div class="sidebar-socials">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="sidebar-social-link" aria-label="GitHub Profile" title="GitHub">
            <i class="fab fa-github" aria-hidden="true"></i>
          </a>
          <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="sidebar-social-link" aria-label="LinkedIn Profile" title="LinkedIn">
            <i class="fab fa-linkedin-in" aria-hidden="true"></i>
          </a>
          <a href="mailto:${data.email}" class="sidebar-social-link" aria-label="Primary Academic Email" title="Email Debashish Deb">
            <i class="fas fa-envelope" aria-hidden="true"></i>
          </a>
          <a href="${data.labWebsite}" target="_blank" rel="noopener noreferrer" class="sidebar-social-link" aria-label="Färkkilä Laboratory Website" title="Färkkilä Laboratory">
            <i class="fas fa-dna" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    `;

    return sidebar;
  }

  /**
   * @traceability renderHero
   * Generates hero showcase spotlighting scientific computing expertise, clean CTAs, and vertically aligned portrait.
   */
  function renderHero(data) {
    const heroSection = document.createElement('section');
    heroSection.id = 'hero';
    heroSection.className = 'section hero-section';
    heroSection.innerHTML = `
      <div class="container">
        <div class="hero-cover-card">
          <div class="hero-cover-backdrop" aria-hidden="true"></div>

          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-status-pill">
                <span class="status-dot"></span>
                <span>Helsinki, Finland • Biomedicum Helsinki • University of Helsinki</span>
              </div>
              <h1 class="hero-title">
                Hi, I'm <span class="gradient-text">${data.name}.</span>
              </h1>
              <div class="hero-focus-line">
                <span class="focus-label">Working in </span>
                <span class="hero-cycle-wrapper">
                  <span class="hero-cycle-text" id="hero-cycle-text">Research IT at Färkkilä Lab</span>
                  <span class="cursor-blink">|</span>
                </span>
              </div>
              <p class="hero-description">${data.tagline}</p>

              <div class="hero-cta-group">
                <a href="#projects" class="btn btn-primary">
                  <span>Explore Works</span>
                  <i class="fas fa-arrow-down" aria-hidden="true"></i>
                </a>
                <a href="#collaboration" class="btn btn-secondary">
                  <span>Collaboration &amp; Hiring</span>
                  <i class="fas fa-handshake" aria-hidden="true"></i>
                </a>
              </div>

              <div class="hero-socials">
                <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="hero-social-link" aria-label="LinkedIn Profile" title="LinkedIn">
                  <i class="fab fa-linkedin-in" aria-hidden="true"></i>
                </a>
                <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="hero-social-link" aria-label="GitHub Profile" title="GitHub">
                  <i class="fab fa-github" aria-hidden="true"></i>
                </a>
                <a href="mailto:${data.email}" class="hero-social-link" aria-label="Primary Email" title="Email Debashish Deb">
                  <i class="fas fa-envelope" aria-hidden="true"></i>
                </a>
                <a href="https://wa.me/358451600007" target="_blank" rel="noopener noreferrer" class="hero-social-link" aria-label="WhatsApp Direct" title="WhatsApp Chat">
                  <i class="fab fa-whatsapp" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            <div class="hero-visual-card">
              <div class="avatar-wrapper" id="hero-avatar-wrapper">
                <img src="${data.profileImage}" alt="Debashish Deb portrait" class="avatar-image" loading="eager" />
              </div>
              <div class="hero-portrait-badges">
                <span class="portrait-badge">
                  <span class="badge-dot dot-cyan"></span>
                  <span>CSC &bull; Scientific computing</span>
                </span>
                <span class="portrait-badge">
                  <span class="badge-dot dot-amber"></span>
                  <span>Research data &bull; M.Sc.</span>
                </span>
              </div>
            </div>
          </div>
          <small class="hero-cover-credit">
            Photo by <a href="https://commons.wikimedia.org/wiki/File:Biomedicum_Helsinki_inside_view.jpg">Mjeltsch</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
          </small>
        </div>
      </div>
    `;
    return heroSection;
  }

  /**
   * @traceability renderMarquee
   * Renders an infinitely scrolling accent strip of key technical disciplines.
   */
  function renderMarquee() {
    const items = [
      'CSC Supercomputing (Puhti)', 'Go Distributed Systems', 'TypeScript & React',
      'Flutter & Dart', 'Precision Oncology Infrastructure', 'Relational Schema Design',
      'High-Throughput Drug Profiling', 'Docker & CI/CD Pipelines', 'Oncological Data Registries'
    ];

    const marquee = document.createElement('div');
    marquee.className = 'marquee-strip';
    marquee.setAttribute('aria-hidden', 'true');

    const trackContent = items.map(item => `
      <span class="marquee-item">
        <span class="marquee-bullet">•</span>
        <span>${item}</span>
      </span>
    `).join('');

    marquee.innerHTML = `
      <div class="marquee-track">
        ${trackContent}
        ${trackContent}
      </div>
    `;
    return marquee;
  }

  /**
   * @traceability renderCurrentRoles
   * Renders primary ongoing appointments and studies in clean card-free editorial columns.
   */
  function renderCurrentRoles(data) {
    const section = document.createElement('section');
    section.id = 'leadership';
    section.className = 'section roles-section';

    const rolesMarkup = (data.currentRoles || []).map(r => `
      <div class="editorial-role-col">
        <div class="role-org-badge">
          <i class="fas ${r.icon || 'fa-building-columns'}" aria-hidden="true"></i>
          <span>${r.org || r.organization || 'Färkkilä Laboratory (University of Helsinki)'}</span>
        </div>
        <h3 class="role-title">${r.title || r.role || 'IT & Systems Specialist'}</h3>
        <div class="role-meta">
          <span class="role-location">${r.location || 'Biomedicum Helsinki, Finland'}</span>
          <span class="role-period">${r.period || 'Current'}</span>
        </div>
        <p class="role-desc">${r.desc || r.summary || ''}</p>
        <div class="tech-tags">
          ${(r.tags || ['CSC Supercomputing', 'Research Databases', 'Spatial Multi-omics', 'Snakemake']).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-building-columns"></i> APPOINTMENTS</span>
          <h2 class="section-title">Current Institutional Appointments</h2>
          <p class="section-subtitle">Current work in research data infrastructure, scientific computing and image processing.</p>
        </div>
        <div class="editorial-roles-grid">
          ${rolesMarkup}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderProjects
   * Generates card-free editorial project showcase with category filtering, highlights, and in-page detailed system dossier container.
   */
  function renderProjects(data) {
    const section = document.createElement('section');
    section.id = 'projects';
    section.className = 'section projects-section';

    const projectCards = (data.projects || []).map((p, index) => {
      const catIcon = p.category === 'systems' ? 'fa-dna' : (p.category === 'algorithms' ? 'fa-diagram-project' : 'fa-laptop-code');
      const mediaMarkup = p.image 
        ? `<img src="${p.image}" alt="${p.name} preview" class="project-img" loading="lazy" onerror="this.style.display='none';" />`
        : `<div class="project-media-fallback"><i class="fas ${catIcon} fa-2x"></i><span>${p.name}</span></div>`;

      const tags = (p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');
      
      const highlightsHtml = (p.highlights || []).slice(0, 2).map(h => `
        <li class="project-highlight-item">
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
          <span>${h}</span>
        </li>
      `).join('');

      return `
        <article class="editorial-project-item" data-category="${p.category || 'all'}" data-index="${index}">
          <div class="project-editorial-main">
            <div class="project-editorial-meta">
              <span class="project-badge-pill">${p.badge || 'Engineering'}</span>
              <span class="project-category-tag">${p.category || 'System'}</span>
            </div>
            <h3 class="project-title">${p.name}</h3>
            <p class="project-desc">${p.description}</p>
            ${highlightsHtml ? `<ul class="project-highlights-list">${highlightsHtml}</ul>` : ''}
            <div class="tech-tags">${tags}</div>
            <div class="project-links">
              ${p.github ? `
                <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Source on GitHub">
                  <i class="fab fa-github" aria-hidden="true"></i>
                  <span>GitHub Source</span>
                </a>
              ` : ''}
              ${p.link && !p.link.includes('github.com') ? `
                <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn project-link-accent" title="${p.linkLabel || 'Visit Website'}">
                  <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  <span>${p.linkLabel || 'Visit Website'}</span>
                </a>
              ` : ''}
              <button class="btn-specs trigger-project-specs" data-index="${index}" aria-label="View architecture specifications for ${p.name}">
                <i class="fas fa-layer-group" aria-hidden="true"></i>
                <span>Architecture &amp; Details</span>
              </button>
            </div>
          </div>
          ${p.image ? `
            <div class="project-editorial-media">
              ${mediaMarkup}
            </div>
          ` : ''}
        </article>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-folder-open"></i> PORTFOLIO</span>
          <h2 class="section-title">Featured Projects &amp; Software Systems</h2>
          <p class="section-subtitle">Selected research IT, web, mobile and QA projects.</p>
        </div>

        <!-- Category Filter Tabs -->
        <div class="project-filters" id="project-filters" role="tablist" aria-label="Filter projects by category">
          <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">All Systems (${data.projects.length})</button>
          <button class="filter-btn" data-filter="enterprise" role="tab" aria-selected="false">Enterprise &amp; Cloud</button>
          <button class="filter-btn" data-filter="mobile" role="tab" aria-selected="false">Mobile &amp; Flutter</button>
          <button class="filter-btn" data-filter="systems" role="tab" aria-selected="false">Biomedical Systems</button>
          <button class="filter-btn" data-filter="algorithms" role="tab" aria-selected="false">Algorithms &amp; Go</button>
          <button class="filter-btn" data-filter="web" role="tab" aria-selected="false">Web &amp; Apps</button>
        </div>

        <div class="editorial-projects-list" id="projects-grid">
          ${projectCards}
        </div>

        <!-- In-Page Detailed System Architecture Dossier (No Floating Modal Window) -->
        <div id="project-dossier" class="project-dossier-panel" style="display:none;" aria-live="polite"></div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability setupProjectDossier
   * Displays in-page architectural dossier with full technical specifications and highlights when Details button is clicked. No floating modal window.
   */
  function setupProjectDossier(data) {
    const dossier = document.getElementById('project-dossier');
    if (!dossier) return;

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.trigger-project-specs');
      if (trigger) {
        const index = parseInt(trigger.getAttribute('data-index'), 10);
        const project = data.projects[index];
        if (!project) return;

        // Highlight active item
        document.querySelectorAll('.editorial-project-item').forEach(c => c.classList.remove('active-dossier'));
        const activeItem = trigger.closest('.editorial-project-item');
        if (activeItem) activeItem.classList.add('active-dossier');

        const highlightsList = (project.highlights || []).map(h => `
          <li class="dossier-spec-item">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <span>${h}</span>
          </li>
        `).join('');

        const techTags = (project.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

        dossier.innerHTML = `
          <div class="dossier-inner">
            <div class="dossier-header">
              <div class="dossier-meta">
                <span class="dossier-tag"><i class="fas fa-layer-group"></i> IN-PAGE ARCHITECTURE DOSSIER</span>
                <span class="project-badge-pill" style="margin-left:8px;">${project.badge || 'Engineering'}</span>
                <h3 class="dossier-title">${project.name}</h3>
                <p class="dossier-desc">${project.description}</p>
              </div>
              <button class="dossier-close-btn" id="dossier-close-btn" aria-label="Collapse project dossier">
                <i class="fas fa-times"></i>
                <span>Close Dossier</span>
              </button>
            </div>

            <div class="dossier-body">
              <div class="dossier-grid">
                <div class="dossier-col">
                  <h4 class="dossier-subtitle"><i class="fas fa-microchip"></i> Architectural Specifications</h4>
                  <ul class="dossier-list">
                    ${highlightsList}
                  </ul>
                </div>
                <div class="dossier-col">
                  <h4 class="dossier-subtitle"><i class="fas fa-code"></i> Computational &amp; Runtime Stack</h4>
                  <div class="tech-tags">${techTags}</div>

                  <h4 class="dossier-subtitle" style="margin-top:20px;"><i class="fas fa-shield-halved"></i> Engineering Governance</h4>
                  <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.65; margin-bottom:16px;">
                    The notes on this project describe what I worked on and what was checked.
                  </p>
                </div>
              </div>

              <div class="dossier-actions">
                ${project.github ? `
                  <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    <i class="fab fa-github"></i>
                    <span>Inspect GitHub Repository</span>
                  </a>
                ` : ''}
                ${project.link && !project.link.includes('github.com') ? `
                  <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                    <i class="fas fa-arrow-up-right-from-square"></i>
                    <span>${project.linkLabel || 'Launch External Interface'}</span>
                  </a>
                ` : ''}
                <button class="btn btn-secondary btn-sm" id="dossier-collapse-action">
                  <i class="fas fa-compress"></i>
                  <span>Collapse Detailed View</span>
                </button>
              </div>
            </div>
          </div>
        `;

        dossier.style.display = 'block';
        if (typeof dossier.scrollIntoView === 'function') dossier.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const closeBtn = document.getElementById('dossier-close-btn');
        const collapseAction = document.getElementById('dossier-collapse-action');
        const handleClose = () => {
          dossier.style.display = 'none';
          document.querySelectorAll('.editorial-project-item').forEach(c => c.classList.remove('active-dossier'));
          if (activeItem && typeof activeItem.scrollIntoView === 'function') activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        if (closeBtn) closeBtn.addEventListener('click', handleClose);
        if (collapseAction) collapseAction.addEventListener('click', handleClose);
      }
    });
  }

  /**
   * @traceability renderCollaboration
   * Generates card-free editorial 3-column prospectus layout for collaboration and technical appointments.
   */
  function renderCollaboration(data) {
    const section = document.createElement('section');
    section.id = 'collaboration';
    section.className = 'section collaboration-section';

    const servicesHtml = (data.collaborationServices || []).map((srv, idx) => `
      <div class="editorial-service-col" data-service-index="${idx}">
        <div class="service-col-head">
          <div class="service-top-row">
            <div class="service-icon-wrapper">
              <i class="fas ${srv.icon}" aria-hidden="true"></i>
            </div>
            <span class="service-badge-pill">${srv.badge}</span>
          </div>
          <h3 class="service-title">${srv.title}</h3>
        </div>
        <p class="service-desc">${srv.description}</p>
        <div class="service-deliverables">
          <h4 class="service-subhead">Key Capabilities:</h4>
          <ul class="service-bullets">
            ${srv.deliverables.map(d => `<li><i class="fas fa-angle-right" aria-hidden="true"></i> <span>${d}</span></li>`).join('')}
          </ul>
        </div>
        <div class="service-tech-stack">
          <div class="tech-tags">
            ${srv.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="service-col-action">
          <button class="btn btn-secondary btn-sm select-service-btn" data-service-name="${srv.title}">
            <span>Inquire regarding this scope</span>
            <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-handshake"></i> COLLABORATION &amp; HIRING</span>
          <h2 class="section-title">Scholarly Collaboration &amp; Technical Appointments</h2>
          <p class="section-subtitle">I’m interested in research computing and software roles that help people work with data and build tools they use every day.</p>
        </div>

        <div class="editorial-services-grid">
          ${servicesHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderAbout
   * Generates scholarly trajectory narrative and empirical pillars in clean editorial layout.
   */
  function renderAbout(data) {
    const section = document.createElement('section');
    section.id = 'about';
    section.className = 'section about-section';

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-user-graduate"></i> SCHOLAR PROFILE</span>
          <h2 class="section-title">Bridging Life Sciences &amp; Systems Engineering</h2>
          <p class="section-subtitle">Academic grounding in molecular biotechnology coupled with empirical software craft.</p>
        </div>

        <div class="editorial-about-grid">
          <div class="about-narrative">
            <h3 class="narrative-heading">Scholar-Technologist Trajectory</h3>
            <p class="narrative-text">${data.about}</p>
            <p class="narrative-text" style="margin-top:14px;">${data.aboutExtended.split('\n\n')[1] || ''}</p>
            
            <div class="about-credentials-box">
              <div class="credential-item">
                <span class="cred-label">Highest Degree</span>
                <span class="cred-val">M.Sc. Molecular Biotechnology (Univ. of Helsinki)</span>
              </div>
              <div class="credential-item">
                <span class="cred-label">Laboratory Affiliation</span>
                <span class="cred-val">Färkkilä Lab • Faculty of Medicine • Biomedicum Helsinki</span>
              </div>
              <div class="credential-item">
                <span class="cred-label">Computing Infrastructure</span>
                <span class="cred-val">CSC IT Center for Science (Puhti / Allas Supercomputing)</span>
              </div>
            </div>
          </div>

          <div class="editorial-pillars-col">
            <div class="editorial-pillar-item">
              <div class="pillar-icon-box"><i class="fas fa-microscope"></i></div>
              <div class="pillar-text">
                <h4 class="pillar-title">Empirical Precision</h4>
                <p class="pillar-desc">Disciplined methodologies honed in Finnish high-precision engineering (ABB) and biomedical research laboratories.</p>
              </div>
            </div>
            <div class="editorial-pillar-item">
              <div class="pillar-icon-box"><i class="fas fa-dna"></i></div>
              <div class="pillar-text">
                <h4 class="pillar-title">Domain Synthesis</h4>
                <p class="pillar-desc">Fluent translation between molecular biology hypotheses and concurrent software architectures in Go and TypeScript.</p>
              </div>
            </div>
            <div class="editorial-pillar-item">
              <div class="pillar-icon-box"><i class="fas fa-server"></i></div>
              <div class="pillar-text">
                <h4 class="pillar-title">Resilient Infrastructure</h4>
                <p class="pillar-desc">Continuous deployment of reproducible containers, normalized registries, and supercomputing workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderSkills
   * Lists tools and their uses, grouped by type of work.
   */
  function renderSkills(data) {
    const section = document.createElement('section');
    section.id = 'skills';
    section.className = 'section skills-section';

    const categoriesHtml = (data.skillCategories || []).map(cat => {
      const itemsHtml = cat.items.map(item => `
        <div class="skill-item" data-skill="${item.name.toLowerCase()}">
          <div class="skill-meta"><strong>${item.name}</strong></div>
          <p><small>${item.use}</small></p>
        </div>
      `).join('');

      return `
        <div class="editorial-skill-group" data-category-title="${cat.category.toLowerCase()}">
          <h3 class="category-title">
            <i class="fas ${cat.icon} category-icon" aria-hidden="true"></i>
            <span>${cat.category}</span>
          </h3>
          <div class="skills-list">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-microchip"></i> TOOLS</span>
          <h2 class="section-title">Tools I Use</h2>
          <p class="section-subtitle">How I use these tools at Färkkilä Lab and in a few independent projects.</p>
          
          <div class="skill-search-wrapper" style="margin-top:20px;">
            <i class="fas fa-search" aria-hidden="true"></i>
            <input type="text" id="skill-search-input" class="skill-search-input" placeholder="Filter tools (e.g., CSC, React, Flutter)" aria-label="Filter tools" />
          </div>
        </div>

        <div class="editorial-skills-grid" id="skills-categories-grid">
          ${categoriesHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderExperience
   * Generates scholarly appointments timeline with institutional roles and responsibilities.
   */
  function renderExperience(data) {
    const section = document.createElement('section');
    section.id = 'experience';
    section.className = 'section experience-section';

    const expItems = (data.experience || []).map(exp => `
      <div class="editorial-timeline-item">
        <div class="timeline-meta-col">
          <span class="timeline-period-badge">${exp.time}</span>
          <span class="timeline-location">${exp.location}</span>
        </div>
        <div class="timeline-content-col">
          <h3 class="timeline-role-title">${exp.title}</h3>
          <h4 class="timeline-company">${exp.company}</h4>
          <ul class="timeline-responsibilities">
            ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-briefcase"></i> APPOINTMENTS TIMELINE</span>
          <h2 class="section-title">Professional &amp; Laboratory Appointments</h2>
          <p class="section-subtitle">History of technical appointments across biomedical research, high-precision manufacturing, and software engineering.</p>
        </div>

        <div class="editorial-timeline-list">
          ${expItems}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderEducationAndResearch
   * Generates higher education qualifications and peer-reviewed scientific publications with copy-citation functionality.
   */
  function renderEducationAndResearch(data) {
    const section = document.createElement('section');
    section.id = 'publications';
    section.className = 'section education-section';

    const eduMarkup = (data.education || []).map(edu => `
      <div class="editorial-edu-item">
        <div class="edu-head">
          <h3 class="edu-degree">${edu.degree}</h3>
          <span class="edu-time">${edu.time}</span>
        </div>
        <div class="edu-institution">${edu.institution} — ${edu.location}</div>
        <div class="edu-thesis"><em>Focus:</em> ${edu.thesis}</div>
      </div>
    `).join('');

    const pubMarkup = (data.achievements || []).map(pub => `
      <div class="editorial-pub-item">
        <div class="pub-journal-badge">${pub.journal}${pub.publicationType ? ` · ${pub.publicationType}` : ''}</div>
        <h3 class="pub-title">${pub.title}</h3>
        ${pub.description ? `<p class="pub-desc">${pub.description}</p>` : ''}
        <div class="pub-actions">
          <a href="${pub.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <i class="fas fa-external-link-alt"></i>
            <span>View Publication</span>
          </a>
          <button class="btn btn-secondary btn-sm copy-citation-btn" data-citation="${pub.title}. ${pub.journal}.">
            <i class="fas fa-quote-right"></i>
            <span>Copy Citation</span>
          </button>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-book-open"></i> SCHOLARSHIP</span>
          <h2 class="section-title">Education &amp; Publications</h2>
          <p class="section-subtitle">My education, co-authored journal articles and conference abstracts.</p>
        </div>

        <div class="editorial-scholarship-grid">
          <div class="scholarship-col">
            <h3 class="scholarship-col-heading"><i class="fas fa-graduation-cap"></i> Higher Education</h3>
            <div class="editorial-edu-list">${eduMarkup}</div>
          </div>
          <div class="scholarship-col">
            <h3 class="scholarship-col-heading"><i class="fas fa-scroll"></i> Publications</h3>
            <div class="editorial-pub-list">${pubMarkup}</div>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderCurriculumVitae
   * Renders the public CV and its print layout from the same portfolio data.
   */
  function renderCurriculumVitae(data) {
    const section = document.createElement('section');
    section.id = 'cv';
    section.className = 'section cv-section';

    const cv = data.cv;
    const experience = data.experience.filter(role => role.cv).map(role => ({
      title: role.title,
      organization: role.company,
      period: role.time,
      responsibilities: role.responsibilities,
      ...role.cv
    }));
    const research = [...experience.filter(role => role.group === 'research'), cv.independentWork];
    const additional = experience.filter(role => role.group === 'additional');
    const education = data.education.filter(record => !record.cvTraining).map(record => ({
      title: record.degree,
      organization: record.institution,
      period: record.time
    }));
    const training = [
      ...data.education.filter(record => record.cvTraining).map(record => `${record.degree} studies at ${record.institution}`),
      ...data.certificates.map(record => record.title.trim())
    ];

    const renderRecords = records => records.map(record => `
      <div class="cv-record-item">
        <div class="cv-record-head">
          <strong class="cv-record-title">${record.title}</strong>
          <span class="cv-record-period">${record.period}</span>
        </div>
        <div class="cv-record-affiliation">${record.organization}</div>
        ${record.responsibilities?.length ? `
          <ul class="cv-record-bullets">
            ${record.responsibilities.map(duty => `<li>${duty}</li>`).join('')}
          </ul>` : ''}
      </div>
    `).join('');

    const renderList = items => `<ul class="cv-rail-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

    const pubMarkup = data.achievements.map(pub => `
      <div class="cv-pub-item">
        <div class="cv-pub-title">
          <strong><a href="${pub.link}" target="_blank" rel="noopener noreferrer">${pub.title}</a></strong>
        </div>
        <div class="cv-pub-journal">${pub.journal}${pub.publicationType ? ` · ${pub.publicationType}` : ''}</div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Curriculum Vitae</h2>
          <div class="cv-action-bar">
            <button class="btn btn-primary btn-sm" onclick="window.print()" id="btn-print-cv">
              <i class="fas fa-print" aria-hidden="true"></i>
              <span>Print or save PDF</span>
            </button>
            <a class="btn btn-secondary btn-sm" href="Debashish-Deb-CV.pdf" download="Debashish-Deb-CV.pdf">
              <i class="fas fa-download" aria-hidden="true"></i>
              <span>Download CV</span>
            </a>
          </div>
        </div>

        <div class="cv-paper">
          <div class="cv-sheet">
            <header class="cv-paper-header">
              <div class="cv-portrait">
                <img src="${data.profileImage}" alt="" loading="lazy" />
              </div>
              <div class="cv-paper-identity">
                <h3 class="cv-name">${data.name}</h3>
                <p class="cv-title">Research IT at Färkkilä Lab</p>
              </div>
            </header>

            <div class="cv-sheet-main">
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Profile</h4>
                <p class="cv-summary-text">${cv.profile}</p>
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Research and IT experience</h4>
                <div class="cv-records-list">${renderRecords(research)}</div>
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Education</h4>
                <div class="cv-records-list">${renderRecords(education)}</div>
              </div>
            </div>

            <aside class="cv-sheet-rail" aria-label="Contact, skills and languages">
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Contact</h4>
                ${renderList([
                  'Helsinki, Finland',
                  `<a href="mailto:${data.email}">${data.email}</a>`,
                  `<a href="${data.website}">Portfolio</a>`,
                  `<a href="${data.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`,
                  `<a href="${data.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
                  `<a href="${data.labWebsite}" target="_blank" rel="noopener noreferrer">Färkkilä Lab</a>`
                ])}
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Core skills</h4>
                ${renderList(cv.coreSkills)}
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Languages</h4>
                ${renderList(cv.languages.map(language => `${language.name} · ${language.level}`))}
              </div>
            </aside>
          </div>

          <div class="cv-sheet cv-second-sheet">
            <header class="cv-print-header" aria-hidden="true">
              <span class="cv-name">${data.name}</span>
              <span class="cv-title">Research IT</span>
            </header>

            <div class="cv-sheet-main">
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Additional experience</h4>
                <div class="cv-records-list">${renderRecords(additional)}</div>
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Selected publications</h4>
                <div class="cv-pub-list">${pubMarkup}</div>
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">References</h4>
                <p class="cv-summary-text">Available on request.</p>
              </div>
            </div>

            <aside class="cv-sheet-rail" aria-label="Development, training and laboratory methods">
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Development</h4>
                ${renderList(cv.development)}
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Training</h4>
                ${renderList(training)}
              </div>
              <div class="cv-section-block">
                <h4 class="cv-section-heading">Lab methods</h4>
                ${renderList(cv.labMethods)}
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;

    return section;
  }

  /**
   * @traceability renderTestimonials
   * Renders testimonials from research mentors and colleagues in clean editorial quotes.
   */
  function renderTestimonials(data) {
    const section = document.createElement('section');
    section.className = 'section testimonials-section';

    const testItems = (data.testimonials || []).map(t => `
      <div class="editorial-quote-col">
        <p class="quote-text">"${t.quote}"</p>
        <div class="quote-author-meta">
          <div class="author-name">${t.author}</div>
          <div class="author-title">${t.title}</div>
          <div class="author-org">${t.institution}</div>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-quote-left"></i> ENDORSEMENTS</span>
          <h2 class="section-title">Colleague &amp; Advisor Perspectives</h2>
          <p class="section-subtitle">Feedback from laboratory supervisors, engineering peers, and collaborators.</p>
        </div>
        <div class="editorial-quotes-grid">
          ${testItems}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderContact
   * Generates direct institutional correspondence form and verified contact channels.
   */
  function renderContact(data) {
    const section = document.createElement('section');
    section.id = 'contact';
    section.className = 'section contact-section';

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-envelope-open-text"></i> CORRESPONDENCE</span>
          <h2 class="section-title">Initiate Academic Inquiry</h2>
          <p class="section-subtitle">Reach out regarding research collaboration, systems development appointments, or supercomputing inquiries.</p>
        </div>

        <div class="editorial-contact-grid">
          <div class="contact-info-col">
            <h3 class="contact-col-heading">Institutional &amp; Direct Channels</h3>
            <p class="contact-col-desc">Based at Biomedicum Helsinki, University of Helsinki. Welcoming inquiries regarding computational infrastructure and engineering appointments.</p>
            
            <div class="contact-channels-list">
              <div class="channel-item">
                <i class="fas fa-envelope"></i>
                <div class="channel-text">
                  <span class="channel-label">Primary Academic Email</span>
                  <a href="mailto:${data.email}" class="channel-val">${data.email}</a>
                </div>
                <button class="copy-channel-btn" data-copy="${data.email}" aria-label="Copy primary email"><i class="fas fa-copy"></i></button>
              </div>

              <div class="channel-item">
                <i class="fas fa-building-columns"></i>
                <div class="channel-text">
                  <span class="channel-label">Institutional Affiliation</span>
                  <a href="${data.labWebsite}" target="_blank" rel="noopener noreferrer" class="channel-val">Färkkilä Lab • Univ. of Helsinki</a>
                </div>
              </div>

              <div class="channel-item">
                <i class="fas fa-location-dot"></i>
                <div class="channel-text">
                  <span class="channel-label">Physical Laboratory</span>
                  <span class="channel-val">${data.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form-col">
            <form id="contact-form" class="editorial-form" aria-labelledby="contact-form-title" novalidate>
              <h3 id="contact-form-title">Write a message</h3>
              <div class="form-group">
                <label class="form-label" for="contact-name">Your name</label>
                <input class="form-control" type="text" id="contact-name" name="name" autocomplete="name" aria-describedby="name-error" required />
                <span class="field-error" id="name-error"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-email">Your email</label>
                <input class="form-control" type="email" id="contact-email" name="email" autocomplete="email" aria-describedby="email-error" required />
                <span class="field-error" id="email-error"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-subject">Topic</label>
                <select class="form-control" id="contact-subject" name="subject" aria-describedby="subject-error" required>
                  <option value="">Choose a topic</option>
                  <option value="research">Research collaboration</option>
                  <option value="appointment">Job opportunity</option>
                  <option value="supercomputing">Research computing</option>
                  <option value="general">General inquiry</option>
                </select>
                <span class="field-error" id="subject-error"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-message">Message</label>
                <textarea class="form-control" id="contact-message" name="message" rows="4" aria-describedby="message-error" minlength="10" required placeholder="What would you like to discuss?"></textarea>
                <span class="field-error" id="message-error"></span>
              </div>

              <button type="submit" class="btn btn-primary btn-block" id="contact-submit-btn" aria-describedby="contact-form-note">
                <span>Open email draft</span>
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
              </button>
              <p id="contact-form-note" class="contact-form-note">Review and send the draft in your email app.</p>
              <p id="contact-draft-status" class="contact-form-note" role="status" hidden>
                Draft ready. <a id="contact-draft-link" href="mailto:${data.email}">Open it again</a> if your email app didn’t open.
              </p>
            </form>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderFooter
   * Generates academic footer with institutional notice and copyright.
   */
  function renderFooter(data) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container footer-container">
        <div class="footer-top">
          <div class="footer-identity">
            <span class="footer-brand">${data.name}</span>
            <p class="footer-role">Research IT at Färkkilä Lab, University of Helsinki</p>
          </div>
          <div class="footer-links">
            <a href="#hero">Overview</a>
            <a href="#projects">Projects</a>
            <a href="#collaboration">Collaboration</a>
            <a href="#cv">View CV</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${data.name}. Engineered with rigorous empirical precision in Helsinki, Finland.</p>
          <p class="footer-license">All scholarly methodologies &amp; code repositories licensed under standard academic &amp; MIT frameworks.</p>
        </div>
      </div>
    `;
    return footer;
  }

  /**
   * @traceability setupNavigationEvents
   * Handles smooth scrolling for all internal anchors, mobile sidebar drawer toggle, and keyboard accessibility.
   */
  function setupNavigationEvents() {
    const sidebar = document.getElementById('site-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('mobile-nav-toggle');

    function openDrawer() {
      if (sidebar) sidebar.classList.add('drawer-open');
      if (backdrop) backdrop.classList.add('active');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
      }
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (sidebar) sidebar.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('active');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
      }
      document.body.style.overflow = '';
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (sidebar && sidebar.classList.contains('drawer-open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('drawer-open')) {
        closeDrawer();
      }
    });

    // Smooth scroll for all hash links with appropriate mobile header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          closeDrawer();
          const isMobile = window.innerWidth < 1024;
          const offset = isMobile ? 64 : 16;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = target.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Focus target element for screen reader accessibility
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /**
   * @traceability setupScrollProgressBar
   * Animates top progress bar according to scroll offset.
   */
  function setupScrollProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    }, { passive: true });
  }

  /**
   * @traceability setupBackToTop
   * Manages back-to-top button visibility and smooth scroll interaction.
   */
  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * @traceability setupProjectFilters
   * Filters project cards based on selected category tab.
   */
  function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.editorial-project-item');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'grid';
            card.style.animation = 'fadeIn 0.3s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * @traceability setupSkillSearch
   * Filters the tools by name.
   */
  function setupSkillSearch() {
    const input = document.getElementById('skill-search-input');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const groups = document.querySelectorAll('.editorial-skill-group');

      groups.forEach(group => {
        const items = group.querySelectorAll('.skill-item');
        let groupHasMatch = false;

        items.forEach(item => {
          const name = item.getAttribute('data-skill') || '';
          if (term === '' || name.includes(term)) {
            item.style.display = '';
            groupHasMatch = true;
          } else {
            item.style.display = 'none';
          }
        });

        group.style.display = groupHasMatch ? 'block' : 'none';
      });
    });
  }

  /**
   * @traceability setupCommandPalette
   * Keyboard-accessible command palette (Cmd+K) supporting fast navigation across all in-page sections and actions.
   */
  function setupCommandPalette(data) {
    const modal = document.getElementById('cmd-palette');
    const triggerBtn = document.getElementById('cmd-palette-btn');
    if (!modal) return;

    const commands = [
      { title: 'Overview', icon: 'fa-compass', type: 'Section', action: () => scrollToSection('hero') },
      { title: 'Institutional Affiliation (Färkkilä Laboratory, UH)', icon: 'fa-university', type: 'Section', action: () => scrollToSection('leadership') },
      { title: 'Projects', icon: 'fa-folder', type: 'Section', action: () => scrollToSection('projects') },
      { title: 'Collaboration', icon: 'fa-handshake', type: 'Section', action: () => scrollToSection('collaboration') },
      { title: 'About', icon: 'fa-user-graduate', type: 'Section', action: () => scrollToSection('about') },
      { title: 'Tools I Use', icon: 'fa-microchip', type: 'Section', action: () => scrollToSection('skills') },
      { title: 'Experience', icon: 'fa-briefcase', type: 'Section', action: () => scrollToSection('experience') },
      { title: 'Education & Publications', icon: 'fa-book-open', type: 'Section', action: () => scrollToSection('publications') },
      { title: 'View CV', icon: 'fa-file-invoice', type: 'Section', action: () => scrollToSection('cv') },
      { title: 'Contact', icon: 'fa-envelope-open-text', type: 'Contact', action: () => scrollToSection('contact') },
      { title: 'Toggle Theme (Dark / Light)', icon: 'fa-circle-half-stroke', type: 'Action', action: () => {
        applyTheme(activeTheme === 'dark-theme' ? 'light-theme' : 'dark-theme');
        showToast(`Switched to ${activeTheme === 'dark-theme' ? 'Dark' : 'Light'} mode`);
      }},
      { title: 'Copy Primary Academic Email', icon: 'fa-copy', type: 'Copy', action: () => copyToClipboard(data.email, 'Copied primary email!') },
      { title: 'Visit GitHub Profile', icon: 'fa-code-branch', type: 'External', action: () => window.open(data.github, '_blank') },
      { title: 'Visit Färkkilä Laboratory (UH)', icon: 'fa-dna', type: 'External', action: () => window.open(data.labWebsite, '_blank') }
    ];

    function openCmd() {
      modal.innerHTML = `
        <div class="cmd-palette-window">
          <div class="cmd-search-box">
            <i class="fas fa-search" aria-hidden="true"></i>
            <input type="text" class="cmd-input" id="cmd-input-field" placeholder="Type a command or jump to section..." autocomplete="off" />
            <span class="kbd-badge">ESC to close</span>
          </div>
          <ul class="cmd-list" id="cmd-list"></ul>
          <div class="cmd-footer">
            <span>Navigation: ↑ ↓ to select, ENTER to run</span>
            <span>Empirical Systems</span>
          </div>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const input = document.getElementById('cmd-input-field');
      const list = document.getElementById('cmd-list');

      function renderItems(filter = '') {
        const filtered = commands.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));
        list.innerHTML = filtered.map((c, i) => `
          <li class="cmd-item ${i === 0 ? 'selected' : ''}" data-cmd-index="${i}">
            <div class="cmd-item-left">
              <i class="fas ${c.icon}" aria-hidden="true"></i>
              <span>${c.title}</span>
            </div>
            <span class="cmd-badge">${c.type}</span>
          </li>
        `).join('');

        list.querySelectorAll('.cmd-item').forEach((item, i) => {
          item.addEventListener('click', () => {
            filtered[i].action();
            closeCmd();
          });
        });
      }

      renderItems();
      input.focus();

      input.addEventListener('input', (e) => {
        renderItems(e.target.value);
      });

      input.addEventListener('keydown', (e) => {
        const items = list.querySelectorAll('.cmd-item');
        const selected = list.querySelector('.cmd-item.selected');
        let index = Array.from(items).indexOf(selected);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (items.length > 0) {
            if (selected) selected.classList.remove('selected');
            index = (index + 1) % items.length;
            items[index].classList.add('selected');
            items[index].scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (items.length > 0) {
            if (selected) selected.classList.remove('selected');
            index = (index - 1 + items.length) % items.length;
            items[index].classList.add('selected');
            items[index].scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selected) {
            const query = input.value;
            const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
            if (filtered[index]) {
              filtered[index].action();
              closeCmd();
            }
          }
        }
      });
    }

    function closeCmd() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function scrollToSection(id) {
      closeCmd();
      const el = document.getElementById(id);
      if (el) {
        const isMobile = window.innerWidth < 1024;
        const offset = isMobile ? 64 : 16;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }

    if (triggerBtn) {
      triggerBtn.addEventListener('click', openCmd);
    }

    // Global Cmd+K / Ctrl+K keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('active')) {
          closeCmd();
        } else {
          openCmd();
        }
      } else if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeCmd();
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCmd();
    });
  }

  /**
   * @traceability setupTypewriterCycling
   * Cycles dynamically through core scientific & engineering focus areas in hero section.
   */
  function setupTypewriterCycling() {
    const el = document.getElementById('hero-cycle-text');
    if (!el) return;

    const phrases = [
      'Research IT at Färkkilä Lab',
      'Scientific Computing',
      'Research Data Infrastructure',
      'Image Processing',
      'Research Web Development'
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;

    function tick() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delta = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        delta = 2200; // Pause at full phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delta = 400; // Pause before typing next
      }

      setTimeout(tick, delta);
    }

    setTimeout(tick, 2500);
  }

  /**
   * @traceability setup3DTilt
   * Subtle perspective tilt interaction for avatar image.
   */
  function setup3DTilt() {
    const avatar = document.getElementById('hero-avatar-wrapper');
    if (!avatar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    avatar.addEventListener('mousemove', (e) => {
      const rect = avatar.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;
      avatar.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    avatar.addEventListener('mouseleave', () => {
      avatar.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /**
   * @traceability setupCitationButtons
   * Handles copying formatted academic citations from publications section.
   */
  function setupCitationButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-citation-btn');
      if (btn) {
        const citation = btn.getAttribute('data-citation');
        if (citation) copyToClipboard(citation, 'Citation copied to clipboard!');
      }
    });
  }

  /**
   * @traceability setupContactCopyButtons
   * Handles copying contact channel values.
   */
  function setupContactCopyButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-channel-btn');
      if (btn) {
        const text = btn.getAttribute('data-copy');
        if (text) copyToClipboard(text, 'Copied to clipboard!');
      }
    });
  }

  /**
   * @traceability setupServiceSelectButtons
   * Automatically pre-selects the requested inquiry scope and scrolls to correspondence form.
   */
  function setupServiceSelectButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-service-btn');
      if (btn) {
        const serviceName = btn.getAttribute('data-service-name');
        const select = document.getElementById('contact-subject');
        const contactSection = document.getElementById('contact');
        if (select) {
          if (serviceName.includes('Web')) select.value = 'appointment';
          else if (serviceName.includes('Mobile')) select.value = 'appointment';
          else if (serviceName.includes('Scientific')) select.value = 'supercomputing';
          else select.value = 'research';
        }
        if (contactSection) {
          const isMobile = window.innerWidth < 1024;
          const offset = isMobile ? 64 : 16;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = contactSection.getBoundingClientRect().top;
          const offsetPosition = elementRect - bodyRect - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    });
  }

  /**
   * @traceability copyToClipboard
   * Copies text using navigator.clipboard with fallback for older environments.
   */
  function copyToClipboard(text, message) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(message || 'Copied to clipboard!');
      }).catch(() => fallbackCopy(text, message));
    } else {
      fallbackCopy(text, message);
    }
  }

  function fallbackCopy(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(message || 'Copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy text.');
    }
    document.body.removeChild(textArea);
  }

  /**
   * @traceability setupScrollSpy
   * Observes visible sections and updates active class on sidebar navigation links.
   */
  function setupScrollSpy() {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-link, .nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }

  /**
   * @traceability setupFormHandler
   * Validates the form and prepares an email draft for the visitor to send.
   */
  function setupFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = [...form.querySelectorAll('.form-control')];
    const draftLink = document.getElementById('contact-draft-link');
    const draftStatus = document.getElementById('contact-draft-status');

    form.addEventListener('input', () => {
      draftStatus.hidden = true;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      draftStatus.hidden = true;

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const topic = form.elements.subject;
      const message = form.elements.message.value.trim();
      const errors = {
        name: name ? '' : 'Enter your name.',
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.',
        subject: topic.value ? '' : 'Choose a topic.',
        message: message.length >= 10 ? '' : 'Enter a message of at least 10 characters.'
      };

      fields.forEach(field => {
        const error = errors[field.name];
        field.setAttribute('aria-invalid', String(Boolean(error)));
        document.getElementById(`${field.name}-error`).textContent = error;
      });

      const firstInvalid = fields.find(field => errors[field.name]);
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const subject = topic.selectedOptions[0].textContent.trim();
      const body = [message, '', `From: ${name}`, `Reply email: ${email}`].join('\r\n');
      draftLink.href = `mailto:${portfolioData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      draftStatus.hidden = false;
      draftLink.click();
    });
  }

  /**
   * @traceability showToast
   * Renders non-blocking toast notifications with auto-dismiss.
   */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <i class="fas fa-info-circle toast-icon"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  }

  // Initialize Portfolio Application
  initApp();
});
