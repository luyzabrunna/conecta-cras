// Mobile menu (drawer) toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const navClose = document.getElementById('navClose');

  function openMenu(){
    mainNav.classList.add('open');
    navBackdrop.classList.add('show');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-locked');
  }
  function closeMenu(){
    mainNav.classList.remove('open');
    navBackdrop.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
  }
  menuToggle.addEventListener('click', () => {
    mainNav.classList.contains('open') ? closeMenu() : openMenu();
  });
  navClose && navClose.addEventListener('click', closeMenu);
  navBackdrop && navBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeMenu();
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  // If the viewport grows past the drawer breakpoint while open, reset state
  window.addEventListener('resize', () => {
    if(window.innerWidth > 880) closeMenu();
  });

  // Accordion for documents (recalculates height so it stays correct
  // across resizes and font-size changes, keeping every device in sync)
  const openPanels = new Set();
  function refreshOpenPanels(){
    openPanels.forEach(panel => {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  }
  document.querySelectorAll('.docs-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if(expanded){
        panel.style.maxHeight = '0px';
        openPanels.delete(panel);
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        openPanels.add(panel);
      }
    });
  });
  window.addEventListener('resize', refreshOpenPanels);

  // Font size controls
  const root = document.documentElement;
  let fontStep = 0;
  const MIN = -1, MAX = 3;
  function applyFontStep(){
    root.style.fontSize = (100 + fontStep * 12) + '%';
    refreshOpenPanels();
  }
  document.getElementById('fontInc').addEventListener('click', () => {
    fontStep = Math.min(MAX, fontStep + 1);
    applyFontStep();
  });
  document.getElementById('fontDec').addEventListener('click', () => {
    fontStep = Math.max(MIN, fontStep - 1);
    applyFontStep();
  });
  document.getElementById('fontReset').addEventListener('click', () => {
    fontStep = 0;
    applyFontStep();
  });

  // High contrast toggle
  const contrastBtn = document.getElementById('contrastToggle');
  contrastBtn.addEventListener('click', () => {
    const on = document.body.classList.toggle('contrast');
    contrastBtn.setAttribute('aria-pressed', String(on));
  });

  // Active nav link on scroll
  const sections = ['inicio','servicos','eventos','contato'].map(id => document.getElementById(id));
  const navLinks = Array.from(document.querySelectorAll('nav.main-nav a[href^="#"]'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => s && observer.observe(s));