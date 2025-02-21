
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
        </nav>
      </aside>
    `;
    app.appendChild(sidebar);

    // Create main content
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    // Create cover section
    const coverSection = document.createElement('div');
    coverSection.classList.add('cover-section');
    coverSection.innerHTML = `
      <img src="deb2.jpeg" alt="${data.name}" class="profile-image">
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

    //... create other sections (skills, projects, etc.)

    app.appendChild(mainContent);

    //... add dynamic styling and interactivity
  });
