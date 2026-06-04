// backup of previous loader
// (kept in case of rollback)
// previous behavior: only loaded navbar.html into #navbar-container
document.addEventListener('DOMContentLoaded', function() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      const navbarContainer = document.getElementById('navbar-container');
      if (navbarContainer) navbarContainer.innerHTML = html;
    })
    .catch(error => console.error('Error loading navbar:', error));
});
