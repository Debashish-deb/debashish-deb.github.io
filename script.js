document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // =============================================
  // --- Header Section ---
  // =============================================
  const header = document.createElement('header');
  header.classList.add('header');
  header.innerHTML = `
      <button class="theme-toggle-button" id="theme-toggle">Dark / Light</button>
      <nav>
          <ul class="nav-links">
              <li><a href="#home" data-section="home">Home</a></li>
              <li><a href="#about" data-section="about">About</a></li>
              <li><a href="#experience" data-section="experience">Experience</a></li>
              <li><a href="#projects" data-section="projects">Projects</a></li>
              <li><a href="#skills" data-section="skills">Skills</a></li>
              <li><a href="#education" data-section="education">Education</a></li>
              <li><a href="#contact" data-section="contact">Contact</a></li>
          </ul>
      </nav>
      <button class="nav-btn" data-section="resume">Resume</button>
  `;
  app.appendChild(header); // Add the header *once* to the app container

  // =============================================
  // --- Main Content Section ---
  // =============================================
  const mainContent = document.createElement('div');
  mainContent.classList.add('main-content');
  app.appendChild(mainContent); // Add mainContent *once*

  // =============================================
  // --- Theme Toggle Setup Function ---
  // =============================================
  function setupThemeToggle() {
      const themeToggle = document.getElementById('theme-toggle');
      if (!themeToggle) {
          console.error("Theme toggle button not found!");
          return;
      }

      themeToggle.addEventListener('click', () => {
          if (localStorage.getItem('theme') === 'light-theme') {
              setTheme('dark-theme');
          } else {
              setTheme('light-theme');
          }
      });

      // Initialize theme based on saved preference or default to dark
      if (localStorage.getItem('theme') === 'light-theme') {
          setTheme('light-theme');
      } else {
          setTheme('dark-theme'); // Default to dark theme
      }
  }

  // =============================================
  // --- Function to Set the Theme ---
  // =============================================
  function setTheme(themeName) {
      localStorage.setItem('theme', themeName); // Store the preference
      document.body.className = themeName; // Set the class on the body
  }

  // =============================================
  // --- Helper Function to Create Sections ---
  // =============================================
  function createSection(title, iconClass, content) {
      const sectionElement = document.createElement('section');
      sectionElement.classList.add('section');
      sectionElement.innerHTML = `
          <h2><i class="${iconClass}"></i> ${title}</h2>
          ${content}
      `;
      return sectionElement;
  }

  // =============================================
  // --- Format Resume Function ---
  // =============================================
  function formatResumeContent(data) {
      if (!data) {
          return '<p>Resume data not available.</p>';
      }
      return `
          <div class="resume-container" data-aos="fade-up">
              <div>
                  <img src="${data.profileImage || ''}" alt="Profile Image" class="resume-img" />
              </div>
              <div>
                  <div class="resume-section">
                      <h3><i class="fas fa-address-card"></i> Contact</h3>
                      <p>${data.email || ''}</p>
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-graduation-cap"></i> Education</h3>
                      ${(data.education || []).map(e => `<p>${e.degree || ''}, ${e.institution || ''}</p>`).join('')}
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-briefcase"></i> Work Experience</h3>
                      ${(data.experience || []).map(exp => `<p>${exp.title || ''}, ${exp.company || ''}</p>`).join('')}
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-newspaper"></i> Publications</h3>
                      <ul>${(data.achievements || []).map(a => `<li>${a.achievement || ''}</li>`).join('')}</ul>
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-certificate"></i> Courses & Achievements</h3>
                      <ul>${(data.certificates || []).map(c => `<li>${c.title || ''} - ${c.organization || ''}</li>`).join('')}</ul>
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-tools"></i> General Skills</h3>
                      <p>${(data.generalSkills || []).map(skill => `<span>${skill || ''}</span>`).join(', ')}</p>
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-code"></i> Programming Skills</h3>
                      <ul>
                          ${(data.skills || []).filter(s => s.includeInResume)
                              .map(s => `
                                  <li>
                                      <span>${s.name || ''}</span>
                                      <div class='progress'><div style='width:${s.level || 0}%'></div></div>
                                  </li>
                              `).join('')}
                      </ul>
                  </div>
                  <div class="resume-section">
                      <h3><i class="fas fa-user-check"></i> References</h3>
                      ${(data.references || []).map(ref => `
                          <p><strong>${ref.name || ''}</strong> - ${ref.title || ''}, ${ref.company || ''} <br>
                              📧 <a href="mailto:${ref.email || ''}">${ref.email || ''}</a>
                              ${ref.phone ? `<br>📞 ${ref.phone}` : ''}
                          </p>
                      `).join('')}
                  </div>
              </div>
          </div>`;
  }

  // =============================================
  // --- Format Experience Section ---
  // =============================================
  function formatExperience(experience) {
      if (!experience) {
          return '<p>Experience data not available.</p>';
      }
      return experience.map(exp => `
          <div class="experience-item" data-aos="fade-up">
              <h3 class="job-title">${exp.title || ''}</h3>
              <div class="company-info">
                  <span class="company">${exp.company || ''}</span>,
                  <span class="location">${exp.location || ''}</span>
              </div>
              <p class="time">${exp.time || ''}</p>
              <ul class="responsibilities">
                  ${(exp.responsibilities || []).map(res => `<li>${res || ''}</li>`).join('')}
              </ul>
              ${exp.technologies && exp.technologies.length > 0 ? `
                  <div class="technologies">
                      <strong>Technologies:</strong> ${(exp.technologies || []).join(', ')}
                  </div>
              ` : ''}
          </div>
      `).join('');
  }

  // =============================================
  // --- Format About Section ---
  // =============================================
  function formatAbout(aboutText) {
      if (!aboutText) {
          return '<p>About information not available.</p>';
      }
      return `<p class="about-text" data-aos="fade-up">${aboutText}</p>`;
  }

  // =============================================
  // --- Format Projects Section ---
  // =============================================
  function formatProjects(projects) {
      if (!projects) {
          return '<p>Project data not available.</p>';
      }
      return projects.map(proj => `
          <div class="project-item" data-aos="fade-up">
              <div class="project-image-container">
                  <img src="${proj.image || ''}" alt="${proj.name || ''}" class="project-image">
              </div>
              <h3 class="project-title">${proj.name || ''}</h3>
              <p class="project-description">${proj.description || ''}</p>
              ${proj.link ? `<a href="${proj.link}" target="_blank" class="project-link">View Project</a>` : ''}
              ${proj.github ? `<a href="${proj.github}" target="_blank" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
          </div>
      `).join('');
  }

  // =============================================
  // --- Format Contact Section ---
  // =============================================
  function formatContact(data) {
      if (!data) {
          return '<p>Contact data not available.</p>';
      }
      return `
          <div data-aos="fade-up">
              <p><a href="mailto:${data.email}" class="contact-link"><i class="fas fa-envelope"></i> Gmail</a></p>
              <p><a href="${data.linkedin || ''}" target="_blank" class="contact-link"><i class="fab fa-linkedin"></i> LinkedIn</a></p>
              <p><a href="${data.github || ''}" target="_blank" class="contact-link"><i class="fab fa-github"></i> GitHub</a></p>
              <form id="contact-form" class="contact-form" action="https://formspree.io/f/mvgzegkz" method="POST">
                  <div class="form-group">
                      <label for="name">Name:</label>
                      <input type="text" id="name" name="name" class="form-control" required>
                  </div>
                  <div class="form-group">
                      <label for="email">Email:</label>
                      <input type="email" id="email" name="email" class="form-control" required>
                  </div>
                  <div class="form-group">
                      <label for="message">Message:</label>
                      <textarea id="message" name="message" class="form-control" required></textarea>
                  </div>
                  <button type="submit" class="form-submit">Send Message</button>
              </form>
              <p id="form-status" class="form-status"></p>
          </div>
      `;
  }

  // =============================================
  // --- Format Skills Section ---
  // =============================================
  function formatSkills(skills) {
      if (!skills) {
          return '<p>Skills data not available.</p>';
      }
      return `
          <div class="skills-grid" data-aos="fade-up">
              ${skills.map(skill => `
                  <div class="skill">
                      <div class="skill-name">
                          ${skill.icon ? `<i class="fab fa-${skill.icon}"></i>` : ''}
                          <span>${skill.name || ''}</span>
                      </div>
                      <div class="skill-bar">
                          <div class="skill-level" data-level="${skill.level || 0}" style="width: 0%;"></div>
                      </div>
                  </div>
              `).join('')}
          </div>
      `;
  }

  // =============================================
  // --- Format Testimonials Section ---
  // =============================================
  function formatTestimonials(testimonials) {
      if (!testimonials || testimonials.length === 0) {
          return '<p>No testimonials available.</p>';
      }
      return `<div class="testimonials-list" data-aos="fade-up">
          ${testimonials.map(testimonial => `
              <div class="testimonial-item">
                  <p class="testimonial-text">"${testimonial.text || ''}"</p>
                  <p class="testimonial-author">- ${testimonial.author || ''}, ${testimonial.role || ''}</p>
              </div>
          `).join('')}
      </div>`;
  }

  // =============================================
  // --- Format Education Section ---
  // =============================================
  function formatEducation(education) {
      return education.map(edu => `
          <div class="education-item" data-aos="fade-up">
              <h3 class="education-degree">${edu.degree}</h3>
              <div class="education-institution">${edu.institution}</div>
              <p class="education-time">${edu.time}</p>
              <p class="education-location">${edu.location}</p>
          </div>
      `).join('');
  }

  // =============================================
  // --- Alpana SVG and Animation ---
  // =============================================
  function createAndAnimateAlpana() {
      // --- Utility Functions ---
  
      /**
       * Creates an SVG element with the specified attributes.
       * @param {string} tag - The SVG element tag (e.g., 'svg', 'g', 'path').
       * @param {Object} attributes - Key-value pairs of attributes to set.
       * @returns {SVGElement} The created SVG element.
       */
      function createSVGElement(tag, attributes = {}) {
          const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
          for (const [key, value] of Object.entries(attributes)) {
              element.setAttribute(key, value);
          }
          return element;
      }
  
      /**
       * Creates a gradient for a petal.
       * @param {string} id - The unique ID for the gradient.
       * @param {string} color1 - The starting color.
       * @param {string} color2 - The ending color.
       * @param {number} angle - The angle for the gradient rotation.
       * @returns {SVGLinearGradientElement} The created gradient element.
       */
      function createPetalGradient(id, color1, color2, angle) {
          const gradient = createSVGElement("linearGradient", {
              id,
              x1: "0%",
              y1: "0%",
              x2: "100%",
              y2: "0%",
              gradientTransform: `rotate(${angle}, 50, 70)`,
          });
  
          const stop1 = createSVGElement("stop", { offset: "0%", "stop-color": color1 });
          const stop2 = createSVGElement("stop", { offset: "100%", "stop-color": color2 });
  
          gradient.appendChild(stop1);
          gradient.appendChild(stop2);
          return gradient;
      }
  
      /**
       * Darkens or lightens a hex color.
       * @param {string} color - The hex color (e.g., "#e74c3c").
       * @param {number} percent - The percentage to adjust the color (-100 to 100).
       * @returns {string} The adjusted hex color.
       */
      function shadeColor(color, percent) {
          const num = parseInt(color.slice(1), 16);
          const amt = Math.round(2.55 * percent);
          const R = (num >> 16) + amt;
          const G = ((num >> 8) & 0x00ff) + amt;
          const B = (num & 0x0000ff) + amt;
          return `#${(
              0x1000000 +
              (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
              (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
              (B < 255 ? (B < 1 ? 0 : B) : 255)
          )
              .toString(16)
              .slice(1)}`;
      }
  
      // --- Core Functions ---
  
      /**
       * Creates the main SVG container.
       * @returns {SVGSVGElement} The SVG container.
       */
      function createAlpanaSVG() {
          return createSVGElement("svg", {
              id: "alpana",
              width: "200",
              height: "200",
              viewBox: "0 0 200 200",
              xmlns: "http://www.w3.org/2000/svg",
          });
      }
  
      /**
       * Creates the central star.
       * @returns {SVGGElement} The star group element.
       */
      function createCenterStar() {
          const starGroup = createSVGElement("g", { "transform-origin": "100 100" });
  
          function createStarPoints(cx, cy, outerRadius, innerRadius, numPoints) {
              const points = [];
              const angleStep = (Math.PI * 2) / numPoints;
  
              for (let i = 0; i < numPoints * 2; i++) {
                  const radius = i % 2 === 0 ? outerRadius : innerRadius;
                  const angle = i * angleStep - Math.PI / 2; // Start from the top
                  const x = cx + radius * Math.cos(angle);
                  const y = cy + radius * Math.sin(angle);
                  points.push(`${x},${y}`);
              }
  
              return points.join(" ");
          }
  
          const star = createSVGElement("polygon", {
              points: createStarPoints(100, 100, 30, 12, 5),
              fill: "#e8b543",
          });
  
          starGroup.appendChild(star);
          starGroup.style.animation = "spin 4s linear infinite";
          return starGroup;
      }
  
      /**
       * Creates the style element for CSS animations.
       * @returns {SVGStyleElement} The style element.
       */
      function createStyleElement() {
          const style = createSVGElement("style");
          style.textContent = `
              @keyframes spin {
                  from { transform: rotateZ(0deg); }
                  to { transform: rotateZ(360deg); }
              }
              .pulse {
                  animation: pulseAnimation 1.5s infinite ease-in-out;
              }
              @keyframes pulseAnimation {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                  100% { transform: scale(1); }
              }
          `;
          return style;
      }
  
      /**
       * Creates the group element for petals.
       * @returns {SVGGElement} The petals group element.
       */
      function createPetalsGroup() {
          return createSVGElement("g", { id: "petals" });
      }
  
      /**
       * Generates and appends petals.
       * @param {SVGGElement} petalsGroup - The group to append petals to.
       * @param {number} numPetals - The number of petals.
       * @param {number} centerRadius - The distance from the center.
       * @param {string[]} petalColors - The array of colors for petals.
       */
      function generatePetals(petalsGroup, numPetals, centerRadius, petalColors) {
          const petalPath = "M0,0 Q20,-50 50,-70 Q80,-50 100,0 Z";
  
          for (let i = 0; i < numPetals; i++) {
              const angle = (i / numPetals) * 360;
              const rad = (angle * Math.PI) / 180;
  
              const x = 100 + centerRadius * Math.cos(rad);
              const y = 100 + centerRadius * Math.sin(rad);
  
              const gradientId = `petalGradient-${i}`;
              const gradient = createPetalGradient(
                  gradientId,
                  petalColors[i % petalColors.length],
                  shadeColor(petalColors[i % petalColors.length], -20),
                  angle
              );
  
              defs.appendChild(gradient);
  
              const petal = createSVGElement("path", {
                  d: petalPath,
                  fill: `url(#${gradientId})`,
                  transform: `translate(${x}, ${y}) rotate(${angle}) translate(-50, -70)`,
                  class: "petal",
              });
  
              petalsGroup.appendChild(petal);
          }
      }
  
      /**
       * Sets up rotation animation for the petals.
       * @param {SVGGElement} petalsGroup - The petals group to animate.
       */
      function setupRotation(petalsGroup) {
          let angle = 0;
          const rotationSpeed = 0.5;
  
          function rotatePetals() {
              angle += rotationSpeed;
              petalsGroup.setAttribute("transform", `rotate(${angle}, 100, 100)`);
              requestAnimationFrame(rotatePetals);
          }
  
          rotatePetals();
      }
  
      /**
       * Creates and configures the Alpana container.
       * @returns {HTMLDivElement} The container element.
       */
      function createContainer() {
          const container = document.createElement("div");
          container.id = "alpana-container";
          container.style.textAlign = "center";
          container.style.marginTop = "20px";
          return container;
      }
  
      // --- Main Execution ---
      const svg = createAlpanaSVG();
      const centerStar = createCenterStar();
      const styleElement = createStyleElement();
      const petalsGroup = createPetalsGroup();
  
      // Definitions for gradients, patterns, etc.
      const defs = createSVGElement("defs");
      svg.appendChild(defs);
  
      const numPetals = 8;
      const centerRadius = 50;
      const petalColors = [
          "#e74c3c", // Red
          "#f39c12", // Orange
          "#f1c40f", // Yellow
          "#2ecc71", // Green
          "#3498db", // Blue
          "#9b59b6", // Purple
          "#e67e22", // Dark Orange
          "#1abc9c", // Turquoise
      ];
  
      generatePetals(petalsGroup, numPetals, centerRadius, petalColors);
  
      svg.appendChild(styleElement);
      svg.appendChild(centerStar);
      svg.appendChild(petalsGroup);
  
      const container = createContainer();
      container.appendChild(svg);
  
      setupRotation(petalsGroup);
  
      return container;
  }

  // =============================================
  // --- Function to Load Sections ---
  // =============================================
  function loadSection(section, data) {
      mainContent.innerHTML = '';
      let sectionContent = '';
      let sectionTitle = '';
      let sectionIcon = '';

      switch (section) {
          case 'home':
              sectionTitle = 'Home';
              sectionIcon = 'fas fa-home';
              sectionContent = `
                  <div class="home-container">
                      <div class="alpana-wrapper">
                          ${createAndAnimateAlpana().outerHTML}
                      </div>
                      <div>
                          <p class="greeting">Hi, my name is</p>
                          <h1 class="home-title" data-aos="fade-up">${data.name}.</h1>
                          <h2 class="home-subtitle" data-aos="fade-up">${data.tagline}</h2>
                          ${formatAbout(data.about)}
                          <a href="#about" class="cta-button" data-section="about">Check out my Bio!</a>
                      </div>
                  </div>
              `;
              break;
          case 'about':
              sectionTitle = 'About Me';
              sectionIcon = 'fas fa-user about-icon';
              sectionContent = formatAbout(data.aboutOptions);
              break;
          case 'experience':
              sectionTitle = 'Experience';
              sectionIcon = 'fas fa-briefcase experience-icon';
              sectionContent = formatExperience(data.experience);
              break;
          case 'projects':
              sectionTitle = 'Projects';
              sectionIcon = 'fas fa-code projects-icon';
              sectionContent = formatProjects(data.projects);
              break;
          case 'skills':
              sectionTitle = 'Skills';
              sectionIcon = 'fas fa-tools';
              sectionContent = formatSkills(data.skills);
              break;
          case 'testimonials':
              sectionTitle = 'Testimonials';
              sectionIcon = 'fas fa-comments';
              sectionContent = formatTestimonials(data.testimonials);
              break;
          case 'education':
              sectionTitle = 'Education';
              sectionIcon = 'fas fa-graduation-cap';
              sectionContent = formatEducation(data.education);
              break;
          case 'contact':
              sectionTitle = 'Contact';
              sectionIcon = 'fas fa-envelope contact-icon';
              sectionContent = formatContact(data);
              break;
          case 'resume':
              sectionTitle = 'Resume';
              sectionIcon = 'fas fa-file-alt';
              sectionContent = formatResumeContent(data);
              break;
          default:
              sectionContent = `<h2>Error</h2><p>Section not found.</p>`;
      }

      const sectionElement = createSection(sectionTitle, sectionIcon, sectionContent);
      sectionElement.classList.add(`${section}-section`);

      if (section !== 'home') {
          mainContent.appendChild(sectionElement);
      } else {
          mainContent.innerHTML = sectionContent;
      }

      // Handle CTA button in Home section
      if (section === 'home') {
          const ctaButton = mainContent.querySelector('.cta-button');
          if (ctaButton) {
              ctaButton.addEventListener('click', (event) => {
                  event.preventDefault();
                  loadSection('about', data);
                  window.location.hash = `#about`;
              });
          }
      }

      // Handle contact form submission
      if (section === 'contact') {
          const form = document.getElementById('contact-form');
          form.addEventListener('submit', function (event) {
              event.preventDefault();
              fetch(form.action, {
                  method: 'POST',
                  body: new FormData(form),
                  headers: {
                      'Accept': 'application/json'
                  }
              })
              .then(response => {
                  if (response.ok) {
                      form.reset();
                      alert('Thanks for your submission!');
                  } else {
                      throw new Error('Network response was not ok.');
                  }
              })
              .catch(error => {
                  console.error('Error submitting form:', error);
                  alert('There was a problem submitting your form. Please try again later.');
              });
          });
      }

      // Animate skills bars
      if (section === 'skills') {
          setTimeout(() => {
              const skillLevels = document.querySelectorAll('.skill-level');
              skillLevels.forEach(skillLevel => {
                  const level = skillLevel.dataset.level;
                  const validLevel = isNaN(parseInt(level)) ? 0 : parseInt(level);
                  skillLevel.style.width = validLevel + '%';
              });
          }, 100);
      }

      // Initialize AOS animations
      AOS.init({
          duration: 800,
          once: true,
      });
  }

  // =============================================
  // --- Fetch Data and Initialize App ---
  // =============================================
  fetch('data.json')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          loadSection('home', data); // Load the initial section

          // Handle navigation clicks
          header.addEventListener('click', (event) => {
              const target = event.target;
              const navElement = target.closest('a, button');

              if (navElement) {
                  event.preventDefault();
                  const section = navElement.getAttribute('data-section');
                  if (section) {
                      if (data.hasOwnProperty(section) || ['home', 'resume', 'contact'].includes(section)) {
                          loadSection(section, data);
                          window.location.hash = `#${section}`;
                      } else {
                          console.error(`Section "${section}" not found in data.json`);
                          mainContent.innerHTML = `<div class="error-message">Section "${section}" not found.</div>`;
                      }
                  }
              }
          });

          // Handle initial hash on page load
          if (window.location.hash) {
              const initialSection = window.location.hash.substring(1);
              if (data.hasOwnProperty(initialSection) || ['home', 'resume', 'contact'].includes(initialSection)) {
                  loadSection(initialSection, data);
              } else {
                  console.error(`Section "${initialSection}" not found in data.json`);
                  mainContent.innerHTML = `<div class="error-message">Section "${initialSection}" not found.</div>`;
              }
          }
      })
      .catch(error => {
          console.error('Error loading data:', error);
          mainContent.innerHTML = `<div class="error-message">Failed to load portfolio data. Please try again later.</div>`;
      });

  // Setup theme toggle
  setupThemeToggle();
});