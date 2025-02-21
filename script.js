fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load data.json');
    }
    return response.json();
  })
  .then(data => {
    const app = document.getElementById('app');

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    sidebar.innerHTML = `
        <h2>${data.name}</h2>
        <nav>
          <a href="#about">About Me</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#achievements">Achievements</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <div class="contact-icons">
          <a href="mailto:${data.email}" title="Send Email"><i class="fas fa-envelope"></i></a>
          <a href="${data.github}" target="_blank" title="GitHub Profile"><i class="fab fa-github"></i></a>
          <a href="${data.linkedin}" target="_blank" title="LinkedIn Profile"><i class="fab fa-linkedin"></i></a>
        </div>
      `;
    app.appendChild(sidebar);

    // Main Content
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    // Cover Section
    const coverSection = document.createElement('div');
    coverSection.classList.add('cover-section');
    coverSection.innerHTML = `<img src="${data.profileImage}" alt="${data.name}" class="profile-image"><h1>${data.title}</h1>`;
    mainContent.appendChild(coverSection);

    // About Section
    const aboutSection = document.createElement('section');
    aboutSection.classList.add('section');
    aboutSection.id = 'about';
    aboutSection.innerHTML = `<h2>About Me</h2><p>${data.about}</p>`;
    mainContent.appendChild(aboutSection);

    // Skills Section
    const skillsSection = document.createElement('section');
    skillsSection.classList.add('section');
    skillsSection.id = 'skills';
    skillsSection.innerHTML = `
        <h2>Skills</h2>
        <ul>
          ${data.skills.map(skill => `
            <li>
              <span class="icon"><i class="fab fa-${skill.icon || 'code'}"></i></span>
              ${skill.name}
              <div class="progress-bar" data-width="${skill.level}">
                <div class="progress"></div>
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    mainContent.appendChild(skillsSection);

    // Projects Section
    const projectsSection = document.createElement('section');
    projectsSection.classList.add('section');
    projectsSection.id = 'projects';
    projectsSection.innerHTML = `
        <h2>Projects</h2>
        <div class="projects-grid">
          ${data.projects.map(project => `
            <a href="${project.link}" target="_blank" class="project-item">
              <i class="fab fa-${project.icon || 'github'}"></i>
              <p>${project.name}</p>
            </a>
          `).join('')}
        </div>
      `;
    mainContent.appendChild(projectsSection);

    // Experience Section
    const experienceSection = document.createElement('section');
    experienceSection.classList.add('section');
    experienceSection.id = 'experience';
    experienceSection.innerHTML = `
        <h2>Experience</h2>
        <div class="experiences">
          ${data.experience.map(exp => `
            <div class="experience-item">
              <h3>${exp.title}</h3>
              <p><strong>${exp.company}</strong> | ${exp.time}</p>
              <p>${exp.location}</p>
              <ul>
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      `;
    mainContent.appendChild(experienceSection);

    // Achievements Section
    const achievementsSection = document.createElement('section');
    achievementsSection.classList.add('section');
    achievementsSection.id = 'achievements';
    achievementsSection.innerHTML = `<h2>Achievements</h2><ul>${data.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>`;
    mainContent.appendChild(achievementsSection);

    // Testimonials Section
    const testimonialsSection = document.createElement('section');
    testimonialsSection.classList.add('section');
    testimonialsSection.id = 'testimonials';
    testimonialsSection.innerHTML = `<h2>Testimonials</h2><div class="testimonials">${data.testimonials.map(test => `<div class="testimonial-item"><p>${test.quote}</p><p><em>${test.author}</em></p></div>`).join('')}</div>`;
    mainContent.appendChild(testimonialsSection);

    app.appendChild(mainContent);

    // Animate Progress Bars
    const progressBars = document.querySelectorAll('.progress');
    function animateProgressBars() {
      progressBars.forEach(progressBar => {
        const width = progressBar.parentElement.getAttribute('data-width');
        progressBar.style.width = width + '%';
      });
    }
    window.addEventListener('scroll', animateProgressBars);

    // Theme Toggle with Local Storage
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Theme';
    themeToggle.classList.add('theme-toggle');
    document.body.appendChild(themeToggle);

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  })
  .catch(error => console.error('Error loading data:', error));
