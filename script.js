fetch('data.json')
.then(response => response.json())
.then(data => {
    const app = document.getElementById('app');

    // Create sidebar
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
          <a href="mailto:${data.email}" title="Send Email">
            <i class="fas fa-envelope"></i>
          </a>
          <a href="${data.github}" target="_blank" title="GitHub Profile">
            <i class="fab fa-github"></i>
          </a>
          <a href="${data.linkedin}" target="_blank" title="LinkedIn Profile">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      `;
    app.appendChild(sidebar);

    // Create main content
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    // Create cover section
    const coverSection = document.createElement('div');
    coverSection.classList.add('cover-section');
    coverSection.innerHTML = `
        <img src="${data.profileImage}" alt="${data.name}" class="profile-image">
        <h1>${data.title}</h1>
      `;
    mainContent.appendChild(coverSection);

    // Create about section
    const aboutSection = document.createElement('section');
    aboutSection.classList.add('section');
    aboutSection.id = 'about';
    aboutSection.innerHTML = `
        <h2>About Me</h2>
        <p>${data.about}</p>
      `;
    mainContent.appendChild(aboutSection);

    // Create skills section
    const skillsSection = document.createElement('section');
    skillsSection.classList.add('section');
    skillsSection.id = 'skills';
    skillsSection.innerHTML = `
        <h2>Skills</h2>
        <div class="skills-projects-container">
          <div class="skills">
            <ul>
              ${data.skills.map(skill => `
                <li>
                  <span class="icon"><i class="fab fa-${skill.icon || 'code'}"></i></span>
                  ${skill.name}
                  <div class="progress-bar">
                    <div class="progress" style="width: ${skill.level}%"></div>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    mainContent.appendChild(skillsSection);

    // Create projects section
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

    // Create experience section
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

    // Create achievements section
    const achievementsSection = document.createElement('section');
    achievementsSection.classList.add('section');
    achievementsSection.id = 'achievements';
    achievementsSection.innerHTML = `
        <h2>Achievements</h2>
        <ul>
          ${data.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
      `;
    mainContent.appendChild(achievementsSection);

    // Create testimonials section
    const testimonialsSection = document.createElement('section');
    testimonialsSection.classList.add('section');
    testimonialsSection.id = 'testimonials';
    testimonialsSection.innerHTML = `
        <h2>Testimonials</h2>
        <div class="testimonials">
          ${data.testimonials.map(test => `
            <div class="testimonial-item">
              <p>${test.quote}</p>
              <p><em>${test.author}</em></p>
            </div>
          `).join('')}
        </div>
      `;
    mainContent.appendChild(testimonialsSection);
    const progressBars = document.querySelectorAll('.progress');
    const skillsSection = document.getElementById('skills');

    function animateProgressBars() {
      const skillsSectionTop = skillsSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (skillsSectionTop < windowHeight) {
        progressBars.forEach(progressBar => {
          const width = progressBar.parentElement.dataset.width;
          progressBar.style.width = width + '%';
        });
      }
    }

    window.addEventListener('scroll', animateProgressBars);

    // 2. Add hover effect to project items
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
      item.addEventListener('mouseover', () => {
        item.style.transform = 'translateY(-5px) scale(1.05)';
        item.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
      });

      item.addEventListener('mouseout', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
      });
    });

    // 3. Theme switching (light/dark mode) - Example
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Theme';
    themeToggle.classList.add('theme-toggle');
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });


    app.appendChild(mainContent);

    //... add dynamic styling and interactivity
  });
