/* ============================================================
   BRONCES REY — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- NAVBAR: scroll shadow + sticky tras topbar --- */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- HAMBURGER / MENÚ MÓVIL --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Cierra menú al hacer clic en un enlace
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // Cierra menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
    }
  });

  /* --- GOLD DIVIDER ANIMADO --- */
  const goldDivider = document.getElementById('gold-divider');

  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        goldDivider.classList.add('visible');
        dividerObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (goldDivider) dividerObserver.observe(goldDivider);

  /* --- ANIMACIONES DE ENTRADA (data-animate) --- */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Escalonado suave si hay varios en el mismo contenedor
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedEls.forEach((el, i) => {
    // Asigna pequeño delay escalonado a cards dentro de grids
    const parent = el.parentElement;
    if (parent?.classList.contains('services-grid') ||
        parent?.classList.contains('stats-container') ||
        parent?.classList.contains('about-values')) {
      el.dataset.delay = i * 80;
    }
    animObserver.observe(el);
  });

  /* --- CONTADOR ANIMADO DE STATS --- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* --- SMOOTH SCROLL para anclas internas --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navH = navbar?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --- FORMULARIO DE CONTACTO --- */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    // Simula envío (reemplazar con fetch real a backend/formspree/etc.)
    setTimeout(() => {
      formSuccess?.classList.add('show');
      form.reset();
      btn.textContent = 'Enviar consulta';
      btn.disabled = false;

      // Oculta el mensaje de éxito tras 5 segundos
      setTimeout(() => formSuccess?.classList.remove('show'), 5000);
    }, 1000);
  });

  /* --- ACTIVE NAV LINK según sección visible --- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links > a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

});
