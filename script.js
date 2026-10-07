/**
 * @traceability
 * Main client-side application controller for Debashish Deb's Portfolio.
 * Implements data-driven rendering, theme management, scroll-spy navigation,
 * and interactive modal workflows.
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
      const response = await fetch('data.json?v=3');
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
      main.appendChild(renderAbout(portfolioData));
      main.appendChild(renderProjects(portfolioData));
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
      setupFormHandler();
      setupResumeModal();
      setupSkillsObserver();

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
   * Generates sticky glass navigation with brand monogram, responsive nav menu, resume CTA, and theme toggle.
   */
  function renderHeader(data) {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="nav-container">
        <a href="#hero" class="brand-link" aria-label="Debashish Deb Home">
          <div class="brand-badge">${data.shortName || 'DD'}</div>
          <div class="brand-text">
            <span class="brand-name">${data.name}</span>
            <span class="brand-sub">CEO & Biotech Specialist</span>
          </div>
        </a>

        <nav aria-label="Primary Navigation">
          <ul class="nav-menu" id="nav-menu">
            <li><a href="#leadership" class="nav-link">Current Roles</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
            <li><a href="#projects" class="nav-link">Projects</a></li>
            <li><a href="#skills" class="nav-link">Skills</a></li>
            <li><a href="#experience" class="nav-link">Experience</a></li>
            <li><a href="#publications" class="nav-link">Research</a></li>
            <li><a href="#contact" class="nav-link">Contact</a></li>
          </ul>
        </nav>

        <div class="nav-actions">
          <button id="theme-toggle-btn" class="theme-toggle-btn" aria-label="Toggle theme">
            ${activeTheme === 'dark-theme' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>'}
          </button>
          <button id="nav-resume-btn" class="btn-resume">
            <i class="fas fa-file-lines" aria-hidden="true"></i>
            <span>Resume</span>
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
   * Generates hero showcase spotlighting dual leadership & scientific expertise, call-to-actions, and updated portrait.
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
              <span>${data.status || 'CEO @ Infinite IT • IT Specialist @ Färkkilä Lab'}</span>
            </div>
            <h1 class="hero-title">
              Hi, I'm <span class="gradient-text">${data.name}.</span>
            </h1>
            <h2 class="hero-tagline">${data.tagline}</h2>
            <p class="hero-description">${data.about}</p>

            <div class="hero-cta-group">
              <a href="#leadership" class="btn btn-primary">
                <span>View Leadership Roles</span>
                <i class="fas fa-arrow-down" aria-hidden="true"></i>
              </a>
              <button class="btn btn-secondary trigger-resume-btn">
                <i class="fas fa-file-invoice" aria-hidden="true"></i>
                <span>View Full Resume</span>
              </button>
              <a href="#contact" class="btn btn-secondary">
                <span>Get in Touch</span>
              </a>
            </div>

            <div class="hero-socials">
              <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="hero-social-link" aria-label="LinkedIn Profile">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
              </a>
              <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="hero-social-link" aria-label="GitHub Profile">
                <i class="fab fa-github" aria-hidden="true"></i>
              </a>
              <a href="mailto:${data.email}" class="hero-social-link" aria-label="Executive Email">
                <i class="fas fa-envelope" aria-hidden="true"></i>
              </a>
              <a href="https://infiniteitbd.com" target="_blank" rel="noopener noreferrer" class="hero-social-link" aria-label="Infinite IT">
                <i class="fas fa-globe" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <div class="hero-visual-card">
            <div class="avatar-wrapper">
              <img src="${data.profileImage}" alt="Debashish Deb portrait" class="avatar-image" loading="eager" />
              <div class="floating-chip chip-tech">
                <div class="chip-icon"><i class="fas fa-briefcase"></i></div>
                <span>CEO Infinite IT</span>
              </div>
              <div class="floating-chip chip-bio">
                <div class="chip-icon"><i class="fas fa-dna"></i></div>
                <span>Färkkilä Lab UH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    return heroSection;
  }

  /**
   * @traceability renderMarquee
   * Renders an infinitely scrolling accent strip of key disciplines.
   */
  function renderMarquee() {
    const items = ['CEO · Infinite IT', 'Full-Stack Engineering', 'Precision Oncology Data', 'Go · React · Flutter', 'University of Helsinki', 'CSC Scientific Computing'];
    const row = items.map(t => `<span>${t}</span><span aria-hidden="true">✦</span>`).join('');
    const el = document.createElement('div');
    el.className = 'marquee';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="marquee-track">${row}${row}</div>`;
    return el;
  }

  /**
   * @traceability renderCurrentRoles
   * Generates a spotlight card section showcasing current primary roles: CEO at Infinite IT & IT Specialist at Farkkila Lab.
   */
  function renderCurrentRoles(data) {
    const section = document.createElement('section');
    section.id = 'leadership';
    section.className = 'section leadership-section';
    
    const rolesHtml = (data.currentRoles || []).map(role => `
      <div class="glass-card role-card" style="display:flex; flex-direction:column; justify-content:space-between; border-top: 3px solid var(--accent-primary);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <span class="section-tag" style="margin-bottom:0;"><i class="fas fa-certificate"></i> ${role.period}</span>
            <a href="${role.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="padding:4px 14px; font-size:0.8rem;">
              <span>Visit Official Site</span> <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
          <h3 style="font-size:1.45rem; margin-bottom:6px;">${role.role}</h3>
          <h4 style="font-size:1.05rem; color:var(--accent-primary); margin-bottom:14px; font-weight:600;">${role.organization}</h4>
          <p style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary);">${role.summary}</p>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-star"></i> Current Key Positions</span>
          <h2 class="section-title">Leadership & Institutional Affiliations</h2>
          <p class="section-subtitle">Driving enterprise software development globally and powering translational precision oncology systems at University of Helsinki.</p>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:28px;">
          ${rolesHtml}
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
          <h2 class="section-title">Where Executive Leadership Meets Scientific Computing</h2>
          <p class="section-subtitle">A multidisciplinary background uniting corporate vision, software craftsmanship, and biomedical research data.</p>
        </div>

        <div class="about-grid">
          <div class="glass-card about-card-left">
            <div>
              <p class="about-story">${data.aboutExtended.replace(/\n\n/g, '</p><p class="about-story">')}</p>
            </div>
            <ul class="about-highlights">
              <li class="highlight-row">
                <i class="fas fa-check-circle highlight-icon"></i>
                <span><strong>Executive Vision:</strong> Leading Infinite IT to engineer enterprise-ready Next.js, Flutter, and AI products with transparent written delivery standards.</span>
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
                <div class="pillar-icon-box"><i class="fas fa-briefcase"></i></div>
                <div>
                  <h3 class="pillar-title">Corporate Leadership & Delivery</h3>
                  <p class="stat-label">Chief Executive Officer — Infinite IT</p>
                </div>
              </div>
              <p class="pillar-desc">
                Leading software architecture and global partnerships across Bangladesh, Finland, and Western markets. Specializing in high-trust offshore engineering, Next.js web applications, and Flutter mobile apps.
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
   * Generates interactive project cards with media previews, tag badges, and live GitHub links.
   */
  function renderProjects(data) {
    const section = document.createElement('section');
    section.id = 'projects';
    section.className = 'section projects-section';

    const projectCards = (data.projects || []).map(p => {
      const mediaMarkup = p.image 
        ? `<img src="${p.image}" alt="${p.name} preview" class="project-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="project-media-fallback" style="display:none;"><i class="fas fa-code-branch fa-2x"></i><span>${p.name}</span></div>`
        : `<div class="project-media-fallback"><i class="fas fa-laptop-code fa-2x"></i><span>${p.name}</span></div>`;

      const tags = (p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

      return `
        <article class="glass-card project-card">
          <div class="project-media">
            ${mediaMarkup}
            <span class="project-badge-pill">${p.badge || 'Engineering'}</span>
          </div>
          <div class="project-content">
            <h3 class="project-title">${p.name}</h3>
            <p class="project-desc">${p.description}</p>
            <div class="tech-tags">${tags}</div>
            <div class="project-links">
              ${p.github ? `
                <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
                  <i class="fab fa-github" aria-hidden="true"></i>
                  <span>Source Code</span>
                </a>
              ` : ''}
              ${p.link && p.link !== '#' ? `
                <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
                  <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  <span>Live App / Site</span>
                </a>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-folder-open"></i> Portfolio</span>
          <h2 class="section-title">Featured Projects & Systems</h2>
          <p class="section-subtitle">Real-world systems spanning enterprise offshore delivery, scientific platforms, concurrent graph algorithms, and mobile applications.</p>
        </div>
        <div class="projects-grid">
          ${projectCards}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderSkills
   * Generates categorized skills matrix (Executive Leadership, Software Engineering, Scientific Computing, Industrial Quality).
   */
  function renderSkills(data) {
    const section = document.createElement('section');
    section.id = 'skills';
    section.className = 'section skills-section';

    const categoriesHtml = (data.skillCategories || []).map(cat => {
      const itemsHtml = cat.items.map(item => `
        <div class="skill-item">
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
        <div class="glass-card skill-category-card">
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
          <h2 class="section-title">Technical & Executive Skills Matrix</h2>
          <p class="section-subtitle">A multidisciplinary toolkit combining executive governance, modern web engineering, and high-throughput biomedical computing.</p>
        </div>
        <div class="skills-container">
          ${categoriesHtml}
        </div>
      </div>
    `;
    return section;
  }

  /**
   * @traceability renderExperience
   * Generates professional timeline detailing career history in Finland and executive leadership.
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
   * Generates education credentials and scientific peer-reviewed publications.
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

    const pubHtml = (data.achievements || []).map(pub => `
      <div class="glass-card pub-card">
        <h3 class="pub-title">${pub.title}</h3>
        <div class="pub-journal">${pub.journal}</div>
        <div class="pub-authors">${pub.authors}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span class="pub-badge"><i class="fas fa-award"></i> ${pub.highlight}</span>
          ${pub.link ? `
            <a href="${pub.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="padding:4px 12px; font-size:0.8rem;">
              <i class="fas fa-external-link-alt"></i> View Paper
            </a>
          ` : ''}
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
   * Generates contact methods and functional message form.
   */
  function renderContact(data) {
    const section = document.createElement('section');
    section.id = 'contact';
    section.className = 'section contact-section';
    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-paper-plane"></i> Connect</span>
          <h2 class="section-title">Let's Collaborate</h2>
          <p class="section-subtitle">Whether exploring custom software development, offshore team partnerships via Infinite IT, or scientific collaborations, reach out directly.</p>
        </div>

        <div class="contact-grid">
          <div class="glass-card">
            <h3 style="font-size: 1.4rem; margin-bottom: 8px;">Direct Connectivity</h3>
            <p>Based in Helsinki & Kuopio, Finland. Serving international clients and research partners.</p>

            <div class="contact-info-list">
              <a href="mailto:${data.email}" class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-building"></i></div>
                <div>
                  <div class="contact-label">Corporate Email (Infinite IT)</div>
                  <div class="contact-val">${data.email}</div>
                </div>
              </a>

              <a href="mailto:${data.academicEmail}" class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-university"></i></div>
                <div>
                  <div class="contact-label">Academic Email (University of Helsinki)</div>
                  <div class="contact-val">${data.academicEmail}</div>
                </div>
              </a>

              <a href="tel:${data.phone}" class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-phone"></i></div>
                <div>
                  <div class="contact-label">Direct Phone / WhatsApp</div>
                  <div class="contact-val">${data.phone}</div>
                </div>
              </a>

              <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-item">
                <div class="contact-icon-box"><i class="fab fa-linkedin-in"></i></div>
                <div>
                  <div class="contact-label">LinkedIn</div>
                  <div class="contact-val">debashish-deb</div>
                </div>
              </a>

              <a href="${data.companyWebsite}" target="_blank" rel="noopener noreferrer" class="contact-item">
                <div class="contact-icon-box"><i class="fas fa-globe"></i></div>
                <div>
                  <div class="contact-label">Infinite IT Official</div>
                  <div class="contact-val">infiniteitbd.com</div>
                </div>
              </a>
            </div>
          </div>

          <div class="glass-card">
            <h3 style="font-size: 1.4rem; margin-bottom: 16px;">Send a Direct Message</h3>
            <form id="contact-form" action="https://formspree.io/f/mvgzegkz" method="POST">
              <div class="form-group">
                <label for="contact-name" class="form-label">Your Name</label>
                <input type="text" id="contact-name" name="name" class="form-control" placeholder="John Doe" required>
              </div>

              <div class="form-group">
                <label for="contact-email" class="form-label">Your Email</label>
                <input type="email" id="contact-email" name="email" class="form-control" placeholder="john@example.com" required>
              </div>

              <div class="form-group">
                <label for="contact-message" class="form-label">Message</label>
                <textarea id="contact-message" name="message" class="form-control" placeholder="Tell me about your software project, enterprise scope, or research inquiry..." required></textarea>
              </div>

              <button type="submit" id="submit-btn" class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
                <span>Send Message</span>
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
   * Generates clean modern footer with credits and back-to-top button.
   */
  function renderFooter(data) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <p class="footer-copy">
          Designed & Engineered with scientific precision by <strong>${data.name}</strong> • ${new Date().getFullYear()}
        </p>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">
          CEO at <a href="https://infiniteitbd.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);">Infinite IT</a> • IT Specialist at <a href="https://farkkilab.org" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);">Färkkilä Laboratory, University of Helsinki</a>
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
                  ${data.location} • <a href="mailto:${data.email}">${data.email}</a> • Phone: ${data.phone} • <a href="${data.linkedin}" target="_blank">LinkedIn</a> • <a href="${data.companyWebsite}" target="_blank">Infinite IT</a>
                </p>
              </div>
            </div>

            <div class="resume-block">
              <h4 class="resume-block-title">Executive & Professional Summary</h4>
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
   * Hooks up triggers and esc keys for resume modal preview.
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
   * @traceability setupScrollSpy
   * Uses IntersectionObserver to highlight current section in navigation bar.
   */
  function setupScrollSpy() {
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
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          showToast('Thank you! Your message was sent successfully.');
        } else {
          throw new Error('Form submission failed.');
        }
      } catch (err) {
        showToast('Message could not be sent. Please email directly at debashish.deb@infiniteitbd.com');
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