/* ═══════════════════════════════════════════════════
   JONATHAN HUENUANCA — PORTFOLIO JS
   ═══════════════════════════════════════════════════ */

'use strict';

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Cerrar menú al hacer clic en un link
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Reveal on scroll (IntersectionObserver) ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Solo una vez
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ── Skill bars: animar al entrar en pantalla ──
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const targetWidth = el.dataset.width + '%';
      // Pequeño delay para que la animación CSS se vea
      setTimeout(() => {
        el.style.width = targetWidth;
      }, 150);
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ── Counter animado en stats del Hero ──
function animateCounter(el, target, duration = 1800) {
  const start     = performance.now();
  const isYear    = target >= 2000;  // para el año no hace falta efecto dramático
  const startVal  = isYear ? target - 4 : 0;

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing out cubic
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (target - startVal) * ease);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Activar contadores cuando el hero es visible
const statsBlock = document.querySelector('.hero-stats');
if (statsBlock) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          if (!isNaN(target)) animateCounter(el, target);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(statsBlock);
}

// ── Active nav link según scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => link.classList.remove('active'));
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      activeLink?.classList.add('active');
    }
  });
}, {
  threshold: 0.35
});

sections.forEach(sec => sectionObserver.observe(sec));

// ── Smooth hover en project cards: efecto de luz ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = ((e.clientX - rect.left) / rect.width)  * 100;
    const y      = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// ── Año actual en footer ──
const footerYear = document.querySelector('.footer-copy');
if (footerYear) {
  const currentYear = new Date().getFullYear();
  footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}

// ── Accesibilidad: scroll suave en todos los links ancla ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
