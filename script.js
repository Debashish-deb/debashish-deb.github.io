// Skill progress animation
window.addEventListener('scroll', function() {
    const skills = document.querySelectorAll('.progress');
    skills.forEach(skill => {
      const skillTop = skill.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
  
      if (skillTop < windowHeight) {
        skill.style.width = skill.dataset.skillLevel;
      }
    });
  });
  