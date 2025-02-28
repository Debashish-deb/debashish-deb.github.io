document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
  
    // --- Header ---
    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML = `
          <div class="logo">D.D</div>
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
    app.appendChild(header);
  
    // --- Main Content ---
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');
    app.appendChild(mainContent);
  
    // --- Helper Function to Create Consistent Section Structure ---
    function createSection(title, iconClass, content) {
      const sectionElement = document.createElement('section');
      sectionElement.classList.add('section');
      sectionElement.innerHTML = `
              <h2><i class="${iconClass}"></i> ${title}</h2>
              ${content}
          `;
      return sectionElement;
    }
  
    // --- Format Resume Function ---
    function formatResumeContent(data) {
      return `
              <div class="resume-container" data-aos="fade-up">
                  <div>
                      <img src="${data.profileImage}" alt="Profile Image" class="resume-img" />
                  </div>
                  <div>
                      <div class="resume-section">
                          <h3><i class="fas fa-address-card"></i> Contact</h3>
                          <p>${data.email}</p>
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-graduation-cap"></i> Education</h3>
                          ${data.education.map(e => `<p>${e.degree}, ${e.institution}</p>`).join('')}
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-briefcase"></i> Work Experience</h3>
                          ${data.experience.map(exp => `<p>${exp.title}, ${exp.company}</p>`).join('')}
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-newspaper"></i> Publications</h3>
                          <ul>${data.achievements.map(a => `<li>${a.achievement}</li>`).join('')}</ul>
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-certificate"></i> Courses & Achievements</h3>
                          <ul>${data.certificates.map(c => `<li>${c.title} - ${c.organization}</li>`).join('')}</ul>
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-tools"></i> General Skills</h3>
                          <p>${data.generalSkills.map(skill => `<span>${skill}</span>`).join(', ')}</p>
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-code"></i> Programming Skills</h3>
                          <ul>
                              ${data.skills.filter(s => s.includeInResume)
          .map(s => `<li>${s.name} <div class='progress'><div style='width:${s.level}%'></div></div></li>`)
          .join('')}
                          </ul>
                      </div>
  
                      <div class="resume-section">
                          <h3><i class="fas fa-user-check"></i> References</h3>
                          ${data.references.map(ref => `
                              <p><strong>${ref.name}</strong> - ${ref.title}, ${ref.company} <br>
                              📧 <a href="mailto:${ref.email}">${ref.email}</a>
                              ${ref.phone ? `<br>📞 ${ref.phone}` : ''}
                              </p>
                          `).join('')}
                      </div>
                  </div>
              </div>`;
    }
  
    // --- Format Experience Section ---
    function formatExperience(experience) {
      return experience.map(exp => `
              <div class="experience-item" data-aos="fade-up">
                  <h3 class="job-title">${exp.title}</h3>
                  <div class="company-info">
                      <span class="company">${exp.company}</span>,
                      <span class="location">${exp.location}</span>
                  </div>
                  <p class="time">${exp.time}</p>
                  <ul class="responsibilities">
                      ${exp.responsibilities.map(res => `<li>${res}</li>`).join('')}
                  </ul>
                  ${exp.technologies && exp.technologies.length > 0 ? `
                      <div class="technologies">
                          <strong>Technologies:</strong> ${exp.technologies.join(', ')}
                      </div>
                  ` : ''}
              </div>
          `).join('');
    }
  
    // --- Format About Section ---
    function formatAbout(aboutText) {
      return `<p class="about-text" data-aos="fade-up">${aboutText}</p>`;
    }
  
    // --- Format Projects Section ---
    function formatProjects(projects) {
      return projects.map(proj => `
              <div class="project-item" data-aos="fade-up">
                  <div class="project-image-container">
                      <img src="${proj.image}" alt="${proj.name}" class="project-image">
                  </div>
                  <h3 class="project-title">${proj.name}</h3>
                  <p class="project-description">${proj.description}</p>
                  ${proj.link ? `<a href="${proj.link}" target="_blank" class="project-link">View Project</a>` : ''}
                  ${proj.github ? `<a href="${proj.github}" target="_blank" class="project-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
              </div>
          `).join('');
    }
  
    function formatContact(data) {
      return `
              <div data-aos="fade-up">
                  <p>Email: <a href="mailto:${data.email}">${data.email}</a></p>
                  <p><a href="${data.linkedin}" target="_blank" class="contact-link"><i class="fab fa-linkedin"></i> LinkedIn</a></p>
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
  
  
    // --- Format Skills Section ---
    function formatSkills(skills) {
      return `<div class="skills-list" data-aos="fade-up">
              ${skills.map(skill => `
                  <div class="skill-item">
                      <div class="skill-name">${skill.name}</div>
                      <div class="skill-bar-outer">
                          <div class="skill-bar" style="width: ${skill.level}%;"></div>
                      </div>
                  </div>
              `).join('')}
          </div>`;
    }
  
    // --- Format Testimonials Section ---
    function formatTestimonials(testimonials) {
      return `<div class="testimonials-list" data-aos="fade-up">
              ${testimonials.map(testimonial => `
                  <div class="testimonial-item">
                      <p class="testimonial-text">"${testimonial.text}"</p>
                      <p class="testimonial-author">- ${testimonial.author}, ${testimonial.role}</p>
                  </div>
              `).join('')}
          </div>`;
    }
  
    // --- Format Education Section ---
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
  
    // --- Function to load sections ---
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
                      <p class="greeting">Hi, my name is</p>
                      <h1 class="home-title" data-aos="fade-up">${data.name}.</h1>
                      <h2 class="home-subtitle" data-aos="fade-up">${data.tagline}</h2>
                      ${formatAbout(data.about)}
                      <a href="#about" class="cta-button" data-section="about">Check out my Bio!</a>
                  `;
          break;
        case 'about':
          sectionTitle = 'About Me';
          sectionIcon = 'fas fa-user about-icon';
          sectionContent = formatAbout(data.aboutOptions); // Corrected this line
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
  
  
      // Add specific section classes
      sectionElement.classList.add(`${section}-section`);
      mainContent.appendChild(sectionElement);
  
      // Add event listener to the CTA button *after* it's added to the DOM (Home section).
      if (section === 'home') {
        const ctaButton = sectionElement.querySelector('.cta-button');
        if (ctaButton) {
          ctaButton.addEventListener('click', (event) => {
            event.preventDefault();
            loadSection('about', data);
            window.location.hash = `#about`;
          });
        }
      }
  
      // Handle contact form submission (if on the contact page)
      if (section === 'contact') {
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', function (event) {
          event.preventDefault(); // Prevent default form submission
  
          // Use Fetch API to submit the form data
          fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
              'Accept': 'application/json'
            }
          })
            .then(response => {
              if (response.ok) {
                // Success!  Clear the form and show a success message.
                form.reset();
                alert('Thanks for your submission!');
              } else {
                // Error!  Show an error message.
                throw new Error('Network response was not ok.');
              }
            })
            .catch(error => {
              console.error('Error submitting form:', error);
              alert('There was a problem submitting your form.  Please try again later.');
            });
        });
      }
  
      // Initialize AOS *after* content is loaded
      AOS.init({
        duration: 800, // Animation duration
        once: true, // Only animate once
      });
    }
  
    // --- Fetch Data and Initial Load ---
    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        loadSection('home', data);
  
        header.addEventListener('click', event => {
          const target = event.target;
          const navElement = target.closest('a, button');
  
          if (navElement) {
            event.preventDefault();
            const section = navElement.getAttribute('data-section');
  
            if (section) {
              loadSection(section, data);
              window.location.hash = `#${section}`;
            }
          }
        });
  
        // Check for hash on initial load and navigate
        if (window.location.hash) {
          const initialSection = window.location.hash.substring(1);
          loadSection(initialSection, data);
        }
      })
      .catch(error => {
        console.error('Error loading data:', error);
        mainContent.innerHTML = `<div class="error-message">Failed to load portfolio data. Please try again later.</div>`;
      });
  });
