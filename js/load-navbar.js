// Load navbar component into every page
document.addEventListener('DOMContentLoaded', function() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      // Insert navbar into the navbar-container div
      const navbarContainer = document.getElementById('navbar-container');
      if (navbarContainer) {
        navbarContainer.innerHTML = html;
      }
    })
    .catch(error => console.error('Error loading navbar:', error));
});

