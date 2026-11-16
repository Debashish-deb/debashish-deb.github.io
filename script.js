/**
 * @traceability
 * Main client-side application controller for Debashish Deb's Scholarly & Systems Portfolio.
 * Implements data-driven rendering, theme management, scroll-spy navigation,
 * research collaboration workflows, project category filtering, architecture modals,
 * live skill search, command palette (Cmd+K), citation copying, and interactive modal workflows.
 */

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Application State
  let portfolioData = null;
  let activeTheme = localStorage.getItem('theme') || 'dark-theme';

  /**
   * @traceability initApp
   * Entry point: Fetches portfolio data, sets up theme, and orchestrates DOM rendering.
   */
  async function initApp() {
    try {
      applyTheme(activeTheme);
      const response = await fetch('data.json?v=6');
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      portfolioData = await response.json();

      // Clear loader and render the full seamless application
      app.innerHTML = '';

      const header = renderHeader(portfolioData);
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
      main.appendChild(renderTestimonials(portfolioData));
      main.appendChild(renderContact(portfolioData));

      const footer = renderFooter(portfolioData);
      const resumeModal = renderResumeModal(portfolioData);

      app.appendChild(header);
      app.appendChild(main);
      app.appendChild(footer);
      app.appendChild(resumeModal);

      // Initialize interactions & observers
      setupNavigationEvents();
      setupThemeToggle();
      setupScrollSpy();
      setupScrollProgressBar();
      setupBackToTop();
      setupFormHandler();
      setupResumeModal();
      setupSkillsObserver();
      setupProjectFilters();
      setupProjectModal(portfolioData);
      setupSkillSearch();
      setupCommandPalette(portfolioData);
      setupTypewriterCycling();
      setup3DTilt();
      setupCitationButtons();
      setupContactCopyButtons();
      setupServiceSelectButtons();

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
   * Applies and persists theme class on body.
   */
  function applyTheme(theme) {
    activeTheme = theme;
    localStorage.setItem('theme', theme);
    document.body.className = theme;
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark-theme' 
        ? '<i class="fas fa-sun" aria-hidden="true"></i>' 
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
      themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark-theme' ? 'light' : 'dark'} mode`);
    }
  }

  /**
   * @traceability setupThemeToggle
   * Sets up click listener on theme toggle button.
   */
  function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        applyTheme(activeTheme === 'dark-theme' ? 'light-theme' : 'dark-theme');
        showToast(`Switched to ${activeTheme === 'dark-theme' ? 'Dark' : 'Light'} theme`);
      });
    }
  }

  /**
   * @traceability renderHeader
   * Generates sticky glass navigation with brand monogram, responsive nav menu, command palette trigger, resume CTA, and theme toggle.
   */
  function renderHeader(data) {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="nav-container">
        <a href="#hero" class="brand-link" aria-label="Debashish Deb Home">
          <span class="brand-badge">${data.shortName || 'DD'}</span>
          <span class="brand-name">${data.name}</span>
        </a>

        <nav aria-label="Primary Navigation">
          <ul class="nav-menu" id="nav-menu">
            <li><a href="#projects" class="nav-link">Projects</a></li>
            <li><a href="#collaboration" class="nav-link">Collaboration</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
            <li><a href="#skills" class="nav-link">Capabilities</a></li>
            <li><a href="#experience" class="nav-link">Experience</a></li>
            <li><a href="#contact" class="nav-link">Contact</a></li>
          </ul>
        </nav>

        <div class="nav-actions">
          <button id="cmd-palette-btn" class="nav-icon-btn" aria-label="Search and command palette (Cmd+K)" title="Command Palette (Cmd+K)">
            <i class="fas fa-search" aria-hidden="true"></i>
            <span class="kbd-badge">⌘K</span>
          </button>
          <button id="theme-toggle-btn" class="theme-toggle-btn" aria-label="Toggle theme">
            ${activeTheme === 'dark-theme' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>'}
          </button>
          <button id="nav-resume-btn" class="btn-resume">
            <span>CV</span>
          </button>
          <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle menu" aria-expanded="false">
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
    return header;
  }

  /**
   * @traceability renderHero
   * Generates hero showcase spotlighting dual leadership & scientific expertise, clean CTAs, and dynamic focus area cycling.
   */
  function renderHero(data) {
    const heroSection = document.createElement('section');
    heroSection.id = 'hero';
    heroSection.className = 'section hero-section';
    heroSection.innerHTML = `
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-status-pill">
              <span class="status-dot"></span>
              <span>Helsinki, Finland • Biomedicum Helsinki • Open to Collaboration &amp; Appointments</span>
            </div>
            <h1 class="hero-title">
              Hi, I'm <span class="gradient-text">${data.name}.</span>
            </h1>
            <div style="font-size: clamp(1.15rem, 2.2vw, 1.45rem); margin-bottom: 14px; color: var(--text-primary); font-weight: 500;">
              <span>Focusing on </span>
              <span class="hero-cycle-wrapper">
                <span class="hero-cycle-text" id="hero-cycle-text">Computational Systems &amp; Supercomputing</span>
                <span class="cursor-blink">|</span>
              </span>
            </div>
            <p class="hero-description" style="font-size: 1.02rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 24px; max-width: 54ch;">
              Biotechnologist turned software engineer based in Helsinki. Managing scientific computing environments, multi-omics registries, and high-performance CSC supercomputing infrastructure at Färkkilä Laboratory (Biomedicum Helsinki, University of Helsinki). Fostering rigorous computational methodologies, pursuing continuous technical scholarship, and welcoming select research collaborations and professional appointments.
            </p>

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
          </div>
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
      'CSC Scientific Supercomputing',
      'Spatial Multi-Omics Data',
      'Go & Concurrent Microservices',
      'React & Modern TypeScript',
      'Flutter Cross-Platform Apps',
      'Biotechnology to Software',
      'Translational Cancer Oncology',
      'Open to Collaboration & Hiring'
    ];
    const row = items.map(t => `<span>${t}</span><span aria-hidden="true">✦</span>`).join('');
    const el = document.createElement('div');
    el.className = 'marquee';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="marquee-track">${row}${row}</div>`;
    return el;
  }

  /**
   * @traceability renderCurrentRoles
   * Generates spotlight card for current key institutional position: IT Specialist at Färkkilä Lab UH.
   */
  function renderCurrentRoles(data) {
    const section = document.createElement('section');
    section.id = 'leadership';
    section.className = 'section leadership-section';
    
    const rolesHtml = (data.currentRoles || []).map((role) => `
      <div class="glass-card role-card" style="display:flex; flex-direction:column; justify-content:space-between; border-top: 3px solid var(--accent-primary);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <span class="section-tag" style="margin-bottom:0;"><i class="fas fa-certificate"></i> ${role.period}</span>
            <a href="${role.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="padding:6px 14px; font-size:0.82rem;">
              <span>Visit Lab Portal</span> <i class="fas fa-external-link-alt" aria-hidden="true"></i>
            </a>
          </div>
          <h3 style="font-size:1.45rem; margin-bottom:6px; color:var(--text-primary);">${role.role}</h3>
          <h4 style="font-size:1.05rem; color:var(--accent-primary); margin-bottom:14px; font-weight:600;">${role.organization}</h4>
          <p style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary);">${role.summary}</p>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-star"></i> Current Institutional Affiliation</span>
          <h2 class="section-title">Research Systems &amp; Scientific Infrastructure</h2>
          <p class="section-subtitle">Powering translational precision oncology computing, spatial multi-omics databases, and CSC supercomputing workflows at University of Helsinki.</p>
        </div>
        <div style="max-width:760px; margin:0 auto;">
          ${rolesHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderCollaboration
   * Generates research collaboration and professional engineering appointment offerings with empirical rigor.
   */
  function renderCollaboration(data) {
    const section = document.createElement('section');
    section.id = 'collaboration';
    section.className = 'section services-section';

    const servicesHtml = (data.collaborationServices || []).map(s => {
      const deliverablesList = (s.deliverables || []).map(d => `
        <li class="service-deliverable-item">
          <i class="fas fa-check-circle" aria-hidden="true"></i>
          <span>${d}</span>
        </li>
      `).join('');

      const techTags = (s.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

      return `
        <div class="glass-card service-card">
          <div>
            <div class="service-header">
              <div class="service-icon-box"><i class="fas ${s.icon}"></i></div>
              <span class="service-badge">${s.badge}</span>
            </div>
            <h3 class="service-title">${s.title}</h3>
            <p class="service-description">${s.description}</p>
            <ul class="service-deliverables">${deliverablesList}</ul>
          </div>
          <div class="service-footer">
            <div class="tech-tags">${techTags}</div>
            <a href="#contact" class="btn btn-secondary btn-sm select-service-btn" data-service="${s.title}">
              <span>Initiate Collaboration</span>
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div class="collaboration-status-banner">
            <span class="status-dot"></span>
            <span>${data.collaborationAvailability || 'Available for Scholarly Collaboration, Advisory & Technical Appointments'}</span>
          </div>
          <h2 class="section-title">Collaborations &amp; Professional Appointments</h2>
          <p class="section-subtitle">Alongside institutional computational duties at the University of Helsinki, I engage in select interdisciplinary collaborations, scientific software architecture, and technical appointments.</p>
        </div>

        <div class="services-grid">
          ${servicesHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderAbout
   * Generates about narrative with dual technical & scientific pillar spotlights and key metric counters.
   */
  function renderAbout(data) {
    const aboutSection = document.createElement('section');
    aboutSection.id = 'about';
    aboutSection.className = 'section about-section';

    const statsHtml = (data.stats || []).map(stat => `
      <div class="glass-card stat-item">
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');

    aboutSection.innerHTML = `
      <div class="container">
        <div class="stats-grid">
          ${statsHtml}
        </div>

        <div class="section-header">
          <span class="section-tag"><i class="fas fa-user-circle"></i> Profile & Mindset</span>
          <h2 class="section-title">Where Software Craftsmanship Meets Scientific Computing</h2>
          <p class="section-subtitle">A multidisciplinary background uniting software engineering, distributed algorithms, and biomedical research data.</p>
        </div>

        <div class="about-grid">
          <div class="glass-card about-card-left">
            <div>
              <p class="about-story">${data.aboutExtended.replace(/\n\n/g, '</p><p class="about-story">')}</p>
            </div>
            <ul class="about-highlights">
              <li class="highlight-row">
                <i class="fas fa-check-circle highlight-icon"></i>
                <span><strong>Full-Stack Software Architecture:</strong> Developing robust Go, TypeScript, React, and Flutter applications with clean architectures and automated tests.</span>
              </li>
              <li class="highlight-row">
                <i class="fas fa-check-circle highlight-icon"></i>
                <span><strong>Supercomputing & Biomedical Data:</strong> Coordinating CSC supercomputing environments, databases, and digital platforms at University of Helsinki's Färkkilä Lab.</span>
              </li>
              <li class="highlight-row">
                <i class="fas fa-check-circle highlight-icon"></i>
                <span><strong>High-Impact Research:</strong> Co-authored peer-reviewed cancer oncology papers in <em>Haematologica</em> and <em>Blood</em>.</span>
              </li>
            </ul>
          </div>

          <div class="pillar-cards">
            <div class="pillar-card">
              <div class="pillar-head">
                <div class="pillar-icon-box"><i class="fas fa-code"></i></div>
                <div>
                  <h3 class="pillar-title">Full-Stack Software Engineering</h3>
                  <p class="stat-label">Go • React • Flutter • TypeScript</p>
                </div>
              </div>
              <p class="pillar-desc">
                Engineering performant web services, graph routing algorithms, and mobile apps with clean state management, type safety, and sub-second loading speeds.
              </p>
            </div>

            <div class="pillar-card">
              <div class="pillar-head">
                <div class="pillar-icon-box"><i class="fas fa-dna"></i></div>
                <div>
                  <h3 class="pillar-title">Precision Oncology Infrastructure</h3>
                  <p class="stat-label">IT Personnel — Färkkilä Laboratory (Biomedicum Helsinki)</p>
                </div>
              </div>
              <p class="pillar-desc">
                Managing CSC scientific computation, web portals, and spatial multi-omics clinical study databases (ONCOSYS-OVA trial) in a world-leading translational oncology research group.
              </p>
            </div>

            <div class="pillar-card">
              <div class="pillar-head">
                <div class="pillar-icon-box"><i class="fas fa-microchip"></i></div>
                <div>
                  <h3 class="pillar-title">Industrial Systems & Lean</h3>
                  <p class="stat-label">ABB & Swappie Experience</p>
                </div>
              </div>
              <p class="pillar-desc">
                Trained in industrial hardware standards, quality assurance, diagnostics, and team leadership in Finland where zero-defect precision is non-negotiable.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
    return aboutSection;
  }

  /**
   * @traceability renderProjects
   * Generates interactive project cards with category filtering, highlights, media previews, action links, and Architecture Specs modal trigger.
   */
  function renderProjects(data) {
    const section = document.createElement('section');
    section.id = 'projects';
    section.className = 'section projects-section';

    const projectCards = (data.projects || []).map((p, index) => {
      const catIcon = p.category === 'systems' ? 'fa-dna' : (p.category === 'algorithms' ? 'fa-diagram-project' : 'fa-laptop-code');
      const mediaMarkup = p.image 
        ? `<img src="${p.image}" alt="${p.name} preview" class="project-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="project-media-fallback" style="display:none;"><i class="fas ${catIcon} fa-2x"></i><span>${p.name}</span></div>`
        : `<div class="project-media-fallback"><i class="fas ${catIcon} fa-2x"></i><span>${p.name}</span></div>`;

      const tags = (p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');
      
      const highlightsHtml = (p.highlights || []).slice(0, 2).map(h => `
        <li class="project-highlight-item">
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
          <span>${h}</span>
        </li>
      `).join('');

      return `
        <article class="glass-card project-card" data-category="${p.category || 'all'}" data-index="${index}">
          <div class="project-media">
            ${mediaMarkup}
            <span class="project-badge-pill">${p.badge || 'Engineering'}</span>
          </div>
          <div class="project-content">
            <h3 class="project-title">${p.name}</h3>
            <p class="project-desc">${p.description}</p>
            ${highlightsHtml ? `<ul class="project-highlights-list">${highlightsHtml}</ul>` : ''}
            <div class="tech-tags">${tags}</div>
            <div class="project-links" style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:16px;">
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
                <span>Details</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-folder-open"></i> Portfolio</span>
          <h2 class="section-title">Featured Projects &amp; Software</h2>
          <p class="section-subtitle">Practical software spanning full-stack web applications, lab data systems, concurrent graph algorithms, and cross-platform mobile apps.</p>
        </div>

        <!-- Category Filter Tabs -->
        <div class="project-filters" id="project-filters" role="tablist" aria-label="Filter projects by category">
          <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">All Systems (${data.projects.length})</button>
          <button class="filter-btn" data-filter="enterprise" role="tab" aria-selected="false">Enterprise & Cloud</button>
          <button class="filter-btn" data-filter="mobile" role="tab" aria-selected="false">Mobile & Flutter</button>
          <button class="filter-btn" data-filter="systems" role="tab" aria-selected="false">Biomedical Systems</button>
          <button class="filter-btn" data-filter="algorithms" role="tab" aria-selected="false">Algorithms & Go</button>
          <button class="filter-btn" data-filter="web" role="tab" aria-selected="false">Web & Apps</button>
        </div>

        <div class="projects-grid" id="projects-grid">
          ${projectCards}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderSkills
   * Generates categorized skills matrix with live search bar and level indicators.
   */
  function renderSkills(data) {
    const section = document.createElement('section');
    section.id = 'skills';
    section.className = 'section skills-section';

    const categoriesHtml = (data.skillCategories || []).map(cat => {
      const itemsHtml = cat.items.map(item => `
        <div class="skill-item" data-skill="${item.name.toLowerCase()}">
          <div class="skill-meta">
            <span>${item.name}</span>
            <span>${item.level}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" data-level="${item.level}" style="width: 0%;"></div>
          </div>
        </div>
      `).join('');

      return `
        <div class="glass-card skill-category-card" data-category-title="${cat.category.toLowerCase()}">
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
          <span class="section-tag"><i class="fas fa-microchip"></i> Capabilities</span>
          <h2 class="section-title">Technical &amp; Core Engineering Skills</h2>
          <p class="section-subtitle">A practical toolkit combining software engineering, modern web &amp; mobile technologies, and biomedical research computing.</p>
        </div>

        <!-- Live Skill Search Bar -->
        <div class="skill-search-wrapper">
          <i class="fas fa-search skill-search-icon" aria-hidden="true"></i>
          <input type="text" id="skill-search-input" class="skill-search-input" placeholder="Search skills (e.g. Go, React, CSC, Flutter, Docker)..." aria-label="Search skills" />
        </div>

        <div class="skills-container" id="skills-container">
          ${categoriesHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderExperience
   * Generates professional timeline detailing career history in Finland and laboratory IT systems.
   */
  function renderExperience(data) {
    const section = document.createElement('section');
    section.id = 'experience';
    section.className = 'section experience-section';

    const timelineItems = (data.experience || []).map(exp => {
      const tasks = exp.responsibilities.map(r => `<li class="job-task">${r}</li>`).join('');
      const techTags = (exp.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

      return `
        <div class="timeline-item">
          <div class="timeline-dot" aria-hidden="true"></div>
          <div class="glass-card timeline-card">
            <div class="timeline-header">
              <div>
                <h3 class="job-title">${exp.title}</h3>
                <div class="job-company">
                  <strong>${exp.company}</strong> • <span>${exp.location}</span>
                </div>
              </div>
              <span class="job-period">${exp.time}</span>
            </div>
            <ul class="job-tasks">${tasks}</ul>
            ${techTags ? `<div class="tech-tags">${techTags}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-briefcase"></i> Track Record</span>
          <h2 class="section-title">Professional Experience</h2>
          <p class="section-subtitle">Leadership, scientific research, and engineering across international tech ventures and Finnish research institutions.</p>
        </div>
        <div class="timeline">
          ${timelineItems}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderEducationAndResearch
   * Generates education credentials and scientific peer-reviewed publications with 1-click citation copy.
   */
  function renderEducationAndResearch(data) {
    const section = document.createElement('section');
    section.id = 'publications';
    section.className = 'section education-section';

    const eduHtml = (data.education || []).map(edu => `
      <div class="glass-card edu-card">
        <h3 class="edu-degree">${edu.degree}</h3>
        <div class="edu-institution">${edu.institution}</div>
        <div class="edu-meta">${edu.time} • ${edu.location}</div>
        <p class="edu-desc">${edu.description}</p>
      </div>
    `).join('');

    const pubHtml = (data.achievements || []).map((pub, idx) => `
      <div class="glass-card pub-card">
        <h3 class="pub-title">${pub.title}</h3>
        <div class="pub-journal">${pub.journal}</div>
        <div class="pub-authors">${pub.authors}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-top:14px;">
          <span class="pub-badge"><i class="fas fa-award"></i> ${pub.highlight}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            ${pub.citation ? `
              <button class="btn-citation copy-citation-btn" data-citation="${encodeURIComponent(pub.citation)}" aria-label="Copy APA citation for ${pub.title}">
                <i class="fas fa-quote-left" aria-hidden="true"></i>
                <span>Copy Citation</span>
              </button>
            ` : ''}
            ${pub.link ? `
              <a href="${pub.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="padding:4px 12px; font-size:0.8rem;">
                <i class="fas fa-external-link-alt" aria-hidden="true"></i> View Paper
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    const certHtml = (data.certificates || []).map(c => `
      <span class="tech-tag" style="padding:6px 14px; font-size:0.85rem;">
        <i class="fab fa-linkedin" style="color:#0a66c2;"></i> ${c.title} (${c.organization})
      </span>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-graduation-cap"></i> Academic Foundation</span>
          <h2 class="section-title">Education & Scientific Publications</h2>
          <p class="section-subtitle">Rigorous biotechnology degrees and peer-reviewed cancer oncology contributions.</p>
        </div>

        <div class="education-grid">
          ${eduHtml}
        </div>

        <div class="section-header" style="margin-top: 60px; margin-bottom: 36px;">
          <h3 style="font-size: 1.8rem;">Peer-Reviewed Scientific Publications</h3>
        </div>

        <div class="publications-grid">
          ${pubHtml}
        </div>

        <div style="text-align: center; margin-top: 50px;">
          <h4 style="font-size: 1.15rem; margin-bottom: 16px;">Professional Certifications</h4>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 800px; margin: 0 auto;">
            ${certHtml}
          </div>
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderTestimonials
   * Generates testimonials & supervisor recommendations.
   */
  function renderTestimonials(data) {
    const section = document.createElement('section');
    section.className = 'section testimonials-section';

    const testHtml = (data.testimonials || []).map(t => `
      <div class="glass-card testimonial-card">
        <p class="testimonial-quote">"${t.text}"</p>
        <div class="testimonial-author">${t.author}</div>
        <div class="testimonial-role">${t.role}</div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-quote-left"></i> Endorsements</span>
          <h2 class="section-title">Institutional Endorsements & References</h2>
        </div>
        <div class="testimonials-grid">
          ${testHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderContact
   * Generates collaboration inquiry form with inquiry type and timeline selectors, alongside 1-click copy actions.
   */
  function renderContact(data) {
    const section = document.createElement('section');
    section.id = 'contact';
    section.className = 'section contact-section';
    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-envelope-open-text"></i> Correspondence &amp; Inquiries</span>
          <h2 class="section-title">Initiate Dialogue or Inquire for Appointment</h2>
          <p class="section-subtitle">Whether exploring an interdisciplinary research collaboration, specialized software architecture, or institutional appointment, I welcome your correspondence.</p>
        </div>

        <div class="contact-grid">
          <div class="glass-card">
            <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Academic &amp; Professional Contacts</h3>
            <p style="margin-bottom: 20px;">Based in Helsinki &amp; Kuopio, Finland. Engaging with international institutions, research consortia, and technical partners across Europe and globally.</p>

            <div class="contact-info-list">
              <div class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-envelope"></i></div>
                <div style="flex:1;">
                  <div class="contact-label">Primary Email</div>
                  <div class="contact-val">${data.email}</div>
                  <button class="copy-pill-btn copy-email-btn" data-email="${data.email}">
                    <i class="far fa-copy" aria-hidden="true"></i> Copy Email
                  </button>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-university"></i></div>
                <div style="flex:1;">
                  <div class="contact-label">Academic Email (University of Helsinki)</div>
                  <div class="contact-val">${data.academicEmail}</div>
                  <button class="copy-pill-btn copy-email-btn" data-email="${data.academicEmail}">
                    <i class="far fa-copy" aria-hidden="true"></i> Copy Academic
                  </button>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-phone"></i></div>
                <div style="flex:1;">
                  <div class="contact-label">Direct Phone / WhatsApp</div>
                  <div class="contact-val">${data.phone}</div>
                  <div style="display:flex; gap:8px; margin-top:6px;">
                    <button class="copy-pill-btn copy-phone-btn" data-phone="${data.phone}">
                      <i class="far fa-copy" aria-hidden="true"></i> Copy Phone
                    </button>
                    <a href="https://wa.me/358451600007" target="_blank" rel="noopener noreferrer" class="copy-pill-btn" style="text-decoration:none;">
                      <i class="fab fa-whatsapp" aria-hidden="true"></i> Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-item">
                <div class="contact-icon-box"><i class="fab fa-linkedin-in"></i></div>
                <div>
                  <div class="contact-label">LinkedIn Profile</div>
                  <div class="contact-val">debashish-deb</div>
                </div>
              </a>

              <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="contact-item">
                <div class="contact-icon-box"><i class="fab fa-github"></i></div>
                <div>
                  <div class="contact-label">GitHub Profile</div>
                  <div class="contact-val">Debashish-deb</div>
                </div>
              </a>
            </div>
          </div>

          <div class="glass-card">
            <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Collaboration &amp; Appointment Inquiry</h3>
            <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 20px;">
              Please outline the parameters of your technical project, research objectives, or institutional appointment timeline.
            </p>
            <form id="contact-form" action="https://formspree.io/f/mvgzegkz" method="POST">
              <div class="form-row">
                <div class="form-group" style="margin-bottom:0;">
                  <label for="contact-name" class="form-label">Full Name</label>
                  <input type="text" id="contact-name" name="name" class="form-control" placeholder="Dr. / Prof. / Full Name" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label for="contact-email" class="form-label">Email Address</label>
                  <input type="email" id="contact-email" name="email" class="form-control" placeholder="colleague@institution.org" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group" style="margin-bottom:0;">
                  <label for="contact-project-type" class="form-label">Inquiry / Appointment Focus</label>
                  <select id="contact-project-type" name="project_type" class="form-control" required>
                    <option value="Full-Stack Web & Scientific Architectures">Full-Stack Web & Scientific Architectures</option>
                    <option value="Cross-Platform Mobile Engineering (Flutter)">Cross-Platform Mobile Engineering (Flutter)</option>
                    <option value="Biomedical Data Systems & Workflows">Biomedical Data Systems & Computational Infrastructure</option>
                    <option value="Research Collaboration & Advisory">Research Collaboration & Technical Advisory</option>
                    <option value="General Scholarly Inquiry">General Scholarly Inquiry / Consultation</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label for="contact-timeline" class="form-label">Prospective Timeline</label>
                  <select id="contact-timeline" name="timeline" class="form-control">
                    <option value="Immediate (< 1 month)">Immediate (< 1 month)</option>
                    <option value="1 to 3 months" selected>1 to 3 months</option>
                    <option value="Semester / Extended Appointment">Semester / Extended Appointment</option>
                    <option value="Exploratory / Flexible">Exploratory / Flexible</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-top:18px;">
                <label for="contact-message" class="form-label">Scope &amp; Inquiry Details</label>
                <textarea id="contact-message" name="message" class="form-control" style="min-height:120px;" placeholder="Describe your scientific objectives, system specifications, technical challenges, or collaboration framework..." required></textarea>
              </div>

              <button type="submit" id="submit-btn" class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
                <span>Transmit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderFooter
   * Generates clean modern footer with credits, affiliation links, and back-to-top trigger.
   */
  function renderFooter(data) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <p class="footer-copy">
          Designed & Engineered with scientific precision by <strong>${data.name}</strong> • ${new Date().getFullYear()}
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">
          Full-Stack Software Engineer • IT &amp; Systems Specialist at <a href="https://farkkilab.org" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);">Färkkilä Laboratory, University of Helsinki</a>
        </p>
      </div>
    `;
    return footer;
  }

  /**
   * @traceability renderResumeModal
   * Generates high-fidelity modal dialog for previewing and printing complete resume.
   */
  function renderResumeModal(data) {
    const modal = document.createElement('div');
    modal.id = 'resume-modal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Full Resume Preview');

    const expMarkup = (data.experience || []).map(exp => `
      <div style="margin-bottom: 18px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span>${exp.title}</span>
          <span style="color:var(--text-muted); font-size:0.9rem;">${exp.time}</span>
        </div>
        <div style="color:var(--accent-primary); font-size:0.92rem; margin-bottom:6px;">${exp.company} — ${exp.location}</div>
        <ul style="padding-left:18px; font-size:0.9rem; color:var(--text-secondary);">
          ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const eduMarkup = (data.education || []).map(edu => `
      <div style="margin-bottom: 12px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span>${edu.degree}</span>
          <span style="color:var(--text-muted); font-size:0.9rem;">${edu.time}</span>
        </div>
        <div style="color:var(--accent-primary); font-size:0.92rem;">${edu.institution} — ${edu.location}</div>
      </div>
    `).join('');

    const pubMarkup = (data.achievements || []).map(pub => `
      <div style="margin-bottom: 12px; font-size:0.88rem;">
        <strong>${pub.title}</strong><br>
        <span style="color:var(--text-muted);">${pub.journal}</span>
      </div>
    `).join('');

    const refMarkup = (data.references || []).map(ref => `
      <div style="margin-bottom: 12px; font-size:0.88rem;">
        <strong>${ref.name}</strong> — ${ref.title}, ${ref.company}<br>
        <span>Email: <a href="mailto:${ref.email}">${ref.email}</a> ${ref.phone ? `• Phone: ${ref.phone}` : ''}</span>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-window">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <i class="fas fa-file-invoice" style="color:var(--accent-primary);"></i>
            <h3 class="modal-title">Curriculum Vitae — ${data.name}</h3>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <button class="btn btn-secondary btn-sm" onclick="window.print()">
              <i class="fas fa-print"></i> <span>Print / Save PDF</span>
            </button>
            <button class="modal-close-btn" id="modal-close-btn" aria-label="Close resume modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="modal-body">
          <div class="resume-paper">
            <div class="resume-paper-header">
              <div>
                <h1 style="font-size:1.8rem; margin-bottom:4px;">${data.name}</h1>
                <p style="color:var(--accent-primary); font-weight:600; font-size:1.05rem;">${data.title}</p>
                <p style="font-size:0.9rem; color:var(--text-muted);">
                  ${data.location} • <a href="mailto:${data.email}">${data.email}</a> • Phone: ${data.phone} • <a href="${data.linkedin}" target="_blank">LinkedIn</a> • <a href="${data.github}" target="_blank">GitHub</a>
                </p>
              </div>
            </div>

            <div class="resume-block">
              <h4 class="resume-block-title">Professional Summary</h4>
              <p style="font-size:0.95rem; line-height:1.7;">${data.aboutExtended}</p>
            </div>

            <div class="resume-block">
              <h4 class="resume-block-title">Current & Past Professional Experience</h4>
              ${expMarkup}
            </div>

            <div class="resume-block">
              <h4 class="resume-block-title">Education & Specialized Training</h4>
              ${eduMarkup}
            </div>

            <div class="resume-block">
              <h4 class="resume-block-title">Peer-Reviewed Publications</h4>
              ${pubMarkup}
            </div>

            <div class="resume-block">
              <h4 class="resume-block-title">Professional References</h4>
              ${refMarkup}
            </div>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  /**
   * @traceability setupNavigationEvents
   * Configures smooth scrolling, active states, and mobile menu toggling.
   */
  function setupNavigationEvents() {
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileToggle.innerHTML = isOpen 
          ? '<i class="fas fa-times" aria-hidden="true"></i>' 
          : '<i class="fas fa-bars" aria-hidden="true"></i>';
      });
    }

    // Close menu when nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
          }
        }
      });
    });
  }

  /**
   * @traceability setupResumeModal
   * Hooks up triggers and escape key for resume modal preview.
   */
  function setupResumeModal() {
    const modal = document.getElementById('resume-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const navResumeBtn = document.getElementById('nav-resume-btn');
    const triggers = document.querySelectorAll('.trigger-resume-btn');

    function openModal() {
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (navResumeBtn) navResumeBtn.addEventListener('click', openModal);
    triggers.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /**
   * @traceability setupScrollProgressBar
   * Tracks window scroll and updates the top gradient progress bar.
   */
  function setupScrollProgressBar() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  /**
   * @traceability setupBackToTop
   * Manages back-to-top button appearance and smooth click handler.
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
   * Enables interactive category filtering on the projects grid.
   */
  function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('#project-filters .filter-btn');
    const cards = document.querySelectorAll('#projects-grid .project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * @traceability setupProjectModal
   * Displays modal with architecture specifications and highlights when Architecture button is clicked.
   */
  function setupProjectModal(data) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.trigger-project-specs');
      if (trigger) {
        const index = parseInt(trigger.getAttribute('data-index'), 10);
        const project = data.projects[index];
        if (!project) return;

        const highlightsList = (project.highlights || []).map(h => `
          <li class="specs-list-item">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <span>${h}</span>
          </li>
        `).join('');

        const techTags = (project.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

        modal.innerHTML = `
          <div class="specs-modal-window">
            <div class="specs-header">
              <div>
                <span class="project-badge-pill" style="margin-bottom:8px; display:inline-block;">${project.badge || 'Engineering'}</span>
                <h3 class="specs-title">${project.name}</h3>
                <p style="font-size:0.92rem; color:var(--text-secondary);">${project.description}</p>
              </div>
              <button class="modal-close-btn" id="specs-close-btn" aria-label="Close specifications modal">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="specs-body">
              <h4 class="specs-section-title"><i class="fas fa-microchip"></i> System Architecture Highlights</h4>
              <ul class="specs-list">
                ${highlightsList}
              </ul>

              <h4 class="specs-section-title"><i class="fas fa-code"></i> Technology Stack</h4>
              <div class="tech-tags" style="margin-bottom:20px;">${techTags}</div>

              <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
                ${project.link && !project.link.includes('github.com') ? `
                  <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    <i class="fas fa-external-link-alt"></i> <span>${project.linkLabel || 'Visit Website'}</span>
                  </a>
                ` : ''}
                ${project.github ? `
                  <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                    <i class="fab fa-github"></i> <span>GitHub Source</span>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const closeBtn = document.getElementById('specs-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          });
        }
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * @traceability setupSkillSearch
   * Filters skill cards and items in real time as the user types.
   */
  function setupSkillSearch() {
    const input = document.getElementById('skill-search-input');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const categories = document.querySelectorAll('#skills-container .skill-category-card');

      categories.forEach(cat => {
        const items = cat.querySelectorAll('.skill-item');
        let hasMatch = false;

        items.forEach(item => {
          const skillName = item.getAttribute('data-skill') || '';
          if (!query || skillName.includes(query)) {
            item.style.display = 'block';
            hasMatch = true;
          } else {
            item.style.display = 'none';
          }
        });

        if (hasMatch) {
          cat.style.display = 'block';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  }

  /**
   * @traceability setupCommandPalette
   * Provides Cmd+K / Ctrl+K interactive command palette for lightning-fast site navigation and actions.
   */
  function setupCommandPalette(data) {
    const modal = document.getElementById('cmd-palette');
    const triggerBtn = document.getElementById('cmd-palette-btn');
    if (!modal) return;

    const commands = [
      { title: 'Institutional Affiliation (Färkkilä Laboratory, UH)', icon: 'fa-university', type: 'Section', action: () => scrollToSection('leadership') },
      { title: 'Curated Works & Systems Architecture', icon: 'fa-folder', type: 'Section', action: () => scrollToSection('projects') },
      { title: 'Collaborations & Professional Appointments', icon: 'fa-handshake', type: 'Section', action: () => scrollToSection('collaboration') },
      { title: 'Scholarly Trajectory & Profile', icon: 'fa-user-graduate', type: 'Section', action: () => scrollToSection('about') },
      { title: 'Technical & Computational Capabilities', icon: 'fa-microchip', type: 'Section', action: () => scrollToSection('skills') },
      { title: 'Professional Appointments Timeline', icon: 'fa-briefcase', type: 'Section', action: () => scrollToSection('experience') },
      { title: 'Peer-Reviewed Oncological Publications', icon: 'fa-book-open', type: 'Section', action: () => scrollToSection('publications') },
      { title: 'Initiate Inquiry / Academic Correspondence', icon: 'fa-envelope-open-text', type: 'Contact', action: () => scrollToSection('contact') },
      { title: 'View / Print Full Resume (CV)', icon: 'fa-file-lines', type: 'Action', action: () => {
        closeCmd();
        const resumeBtn = document.getElementById('nav-resume-btn');
        if (resumeBtn) resumeBtn.click();
      }},
      { title: 'Toggle Theme (Dark / Light)', icon: 'fa-circle-half-stroke', type: 'Action', action: () => {
        applyTheme(activeTheme === 'dark-theme' ? 'light-theme' : 'dark-theme');
        showToast(`Switched to ${activeTheme === 'dark-theme' ? 'Dark' : 'Light'} mode`);
      }},
      { title: 'Copy Primary Email', icon: 'fa-copy', type: 'Copy', action: () => copyToClipboard(data.email, 'Copied primary email!') },
      { title: 'Visit GitHub Profile', icon: 'fa-code-branch', type: 'External', action: () => window.open(data.github, '_blank') },
      { title: 'Visit Färkkilä Laboratory (UH)', icon: 'fa-dna', type: 'External', action: () => window.open(data.labWebsite, '_blank') }
    ];

    function openCmd() {
      modal.innerHTML = `
        <div class="cmd-palette-window">
          <div class="cmd-search-box">
            <i class="fas fa-search" aria-hidden="true"></i>
            <input type="text" class="cmd-input" id="cmd-input-field" placeholder="Type a command, jump to section, or search..." autocomplete="off" />
            <span class="kbd-badge">ESC to close</span>
          </div>
          <ul class="cmd-list" id="cmd-list"></ul>
          <div class="cmd-footer">
            <span>Navigation: ↑ ↓ to select, ENTER to run</span>
            <span>Antigravity Engine</span>
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
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    if (triggerBtn) triggerBtn.addEventListener('click', openCmd);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCmd();
    });

    window.addEventListener('keydown', (e) => {
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
  }

  /**
   * @traceability setupTypewriterCycling
   * Cycles key focus areas in the hero headline with smooth cursor animation.
   */
  function setupTypewriterCycling() {
    const el = document.getElementById('hero-cycle-text');
    if (!el) return;

    const phrases = [
      'Computational Systems & Supercomputing',
      'Full-Stack Architecture (Go, TypeScript, React)',
      'Cross-Platform Mobile Engineering (Flutter & Dart)',
      'From Molecular Biotechnology to Software Systems',
      'Interdisciplinary Collaboration & Technical Appointments'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function tick() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        charIdx--;
        el.textContent = current.substring(0, charIdx);
      } else {
        charIdx++;
        el.textContent = current.substring(0, charIdx);
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === current.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(tick, speed);
    }

    setTimeout(tick, 1000);
  }

  /**
   * @traceability setup3DTilt
   * Applies subtle 3D perspective tilt to the hero avatar card on mouse hover.
   */
  function setup3DTilt() {
    const card = document.getElementById('hero-avatar-wrapper');
    if (!card) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /**
   * @traceability setupCitationButtons
   * Enables 1-click citation copy for peer-reviewed research papers.
   */
  function setupCitationButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-citation-btn');
      if (btn) {
        const citation = decodeURIComponent(btn.getAttribute('data-citation') || '');
        if (citation) {
          copyToClipboard(citation, 'Citation copied in APA format!');
        }
      }
    });
  }

  /**
   * @traceability setupContactCopyButtons
   * Adds quick copy triggers for email and phone numbers in the contact section.
   */
  function setupContactCopyButtons() {
    document.addEventListener('click', (e) => {
      const emailBtn = e.target.closest('.copy-email-btn');
      if (emailBtn) {
        const email = emailBtn.getAttribute('data-email');
        if (email) copyToClipboard(email, `Copied email: ${email}`);
      }

      const phoneBtn = e.target.closest('.copy-phone-btn');
      if (phoneBtn) {
        const phone = phoneBtn.getAttribute('data-phone');
        if (phone) copyToClipboard(phone, `Copied phone: ${phone}`);
      }
    });
  }

  /**
   * @traceability setupServiceSelectButtons
   * Handles clicks on service/package inquiry buttons, auto-populating the contact form and scrolling smoothly.
   */
  function setupServiceSelectButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-service-btn, .select-package-btn');
      if (btn) {
        const serviceName = btn.getAttribute('data-service');
        const projectTypeSelect = document.getElementById('contact-project-type');
        const messageInput = document.getElementById('contact-message');

        if (projectTypeSelect && serviceName) {
          // Find closest matching option or set value
          let matched = false;
          for (let option of projectTypeSelect.options) {
            if (serviceName.toLowerCase().includes(option.value.toLowerCase()) || option.value.toLowerCase().includes(serviceName.toLowerCase())) {
              option.selected = true;
              matched = true;
              break;
            }
          }
          if (!matched) {
            projectTypeSelect.value = "General Consultation";
          }
        }

        if (messageInput && serviceName) {
          messageInput.value = `Hi Debashish, I would like to inquire about: "${serviceName}". `;
        }

        showToast(`Selected "${serviceName}". Redirecting to inquiry form...`);
      }
    });
  }

  /**
   * @traceability copyToClipboard
   * Helper that writes text to system clipboard with fallback and toast feedback.
   */
  function copyToClipboard(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(message || 'Copied to clipboard!');
      }).catch(() => {
        fallbackCopy(text, message);
      });
    } else {
      fallbackCopy(text, message);
    }
  }

  function fallbackCopy(text, message) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(message || 'Copied to clipboard!');
    } catch (e) {
      showToast('Could not copy automatically.');
    }
    document.body.removeChild(ta);
  }

  /**
   * @traceability setupScrollSpy
   * Uses IntersectionObserver to highlight current section in navigation bar.
   */
  function setupScrollSpy() {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }

  /**
   * @traceability setupSkillsObserver
   * Animates skill bars when scrolled into viewport.
   */
  function setupSkillsObserver() {
    if (typeof IntersectionObserver === 'undefined') return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = skillsSection.querySelectorAll('.skill-bar-fill');
          fills.forEach(fill => {
            const level = fill.getAttribute('data-level');
            fill.style.width = `${level}%`;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(skillsSection);
  }

  /**
   * @traceability setupFormHandler
   * Intercepts contact form submission for asynchronous post to Formspree with toast feedback.
   */
  function setupFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending Inquiry...</span>';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          showToast('Thank you! Your project inquiry has been received. I will reply within 24 hours.');
        } else {
          throw new Error('Form submission failed.');
        }
      } catch (err) {
        showToast('Inquiry could not be sent. Please email directly at debashish.deb101@outlook.com');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /**
   * @traceability showToast
   * Renders lightweight notification toast.
   */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Kickoff initialization
  initApp();
});