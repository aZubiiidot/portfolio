// Load shared components (head, navbar, sidebar) into every page
document.addEventListener('DOMContentLoaded', function() {
  function load(path) { return fetch(path).then(r => r.text()); }

  Promise.all([
    load('head.html'),
    load('navbar.html'),
    load('sidebar.html')
  ])
  .then(([headHtml, navHtml, sidebarHtml]) => {
    if (headHtml) {
      document.head.insertAdjacentHTML('beforeend', headHtml);
    }

    const navContainer = document.getElementById('navbar-container');
    if (navContainer && navHtml) navContainer.innerHTML = navHtml;

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer && sidebarHtml) sidebarContainer.innerHTML = sidebarHtml;
  })
  .catch(err => console.error('Error loading shared components:', err));
});

