/* ============================================================
   BRONCES REY — script.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL SHADOW ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── HAMBURGER / MENÚ MÓVIL ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks?.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    })
  );

  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) && !hamburger?.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
    }
  });

  /* ── HERO SLIDER ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let sliderTimer;

  function goTo(idx) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = idx;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }

  function nextSlide() { goTo((current + 1) % slides.length); }

  function startSlider() {
    sliderTimer = setInterval(nextSlide, 4500);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(sliderTimer);
      goTo(Number(dot.dataset.idx));
      startSlider();
    });
  });

  if (slides.length > 1) startSlider();

  /* ── ANIMACIONES DE ENTRADA ── */
  const animEls = document.querySelectorAll('[data-animate]');
  const animObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const parent = entry.target.parentElement;
      const isBulk = parent?.classList.contains('products-grid') ||
                     parent?.classList.contains('srv-grid') ||
                     parent?.classList.contains('cat-grid');
      const siblings = isBulk ? [...parent.children].indexOf(entry.target) : 0;
      setTimeout(() => entry.target.classList.add('visible'), siblings * 70);
      animObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  animEls.forEach(el => animObs.observe(el));

  /* ── CONTADORES ANIMADOS ── */
  function animCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1600;
    const start  = performance.now();
    const step   = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.floor(e * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.ns-n[data-target]');
  const cntObs   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animCount(entry.target);
      cntObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => cntObs.observe(el));

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (navbar?.offsetHeight || 68) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links > a');
  const secObs     = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a =>
        a.classList.toggle('active-link', a.getAttribute('href') === `#${entry.target.id}`)
      );
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => secObs.observe(s));

  /* ── FORMULARIO ── */
  const form   = document.getElementById('contact-form');
  const formOk = document.getElementById('form-ok');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando…';
    btn.disabled    = true;

    // Reemplazar con fetch real a backend / Formspree / EmailJS
    setTimeout(() => {
      formOk?.classList.add('show');
      form.reset();
      btn.textContent = 'Enviar consulta';
      btn.disabled    = false;
      setTimeout(() => formOk?.classList.remove('show'), 5000);
    }, 1000);
  });

});
