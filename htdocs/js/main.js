/* ============================================
   HRS Engineers & Builders - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => loader.classList.add('done'), 2000);
  }

  // ── NAV SCROLL ──
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── HAMBURGER ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── ACTIVE NAV LINK ──
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // ── PARALLAX ──
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  counters.forEach(el => countObserver.observe(el));

  // ── PROJECT FILTER TABS ──
  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card[data-cat]');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        projectCards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = '';
            setTimeout(() => card.style.opacity = '1', 10);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // ── CONTACT FORM ──
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#25D366';
        form.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ── SMOOTH SCROLL FOR ANCHORS ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── HERO BG PARALLAX ──
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }

  // ── TILT EFFECT ON CARDS ──
  document.querySelectorAll('.service-card, .project-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── FLOATING ELEMENTS ──
  document.querySelectorAll('.float-anim').forEach((el, i) => {
    el.style.animation = `floatAnim ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite alternate`;
  });

});

// ── CSS ANIMATION KEYFRAMES ──
const style = document.createElement('style');
style.textContent = `
  @keyframes floatAnim {
    from { transform: translateY(0); }
    to { transform: translateY(-12px); }
  }
  .project-card { transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94); }
`;
document.head.appendChild(style);
