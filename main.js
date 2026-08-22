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

  // ── CONTACT FORM (Supabase save + Web3Forms email) ──
  const form = document.querySelector('.contact-form');
  if (form) {
    // Error banner shown above the form if something is misconfigured / fails
    let errorBox = form.querySelector('.form-error-box');
    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.className = 'form-error-box';
      errorBox.style.cssText = 'display:none;background:#fee2e2;color:#991b1b;padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:16px;';
      form.prepend(errorBox);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const originalBtnText = btn.textContent;
      errorBox.style.display = 'none';

      // Basic required-field check
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const data = {
        first_name: form.fname.value.trim(),
        last_name: form.lname.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        project_type: form.service.value,
        budget: form.budget.value,
        area_sqft: form.area.value.trim(),
        location: form.location.value.trim(),
        message: form.message.value.trim(),
      };

      const cfg = window.HRS_CONFIG || {};
      const supabaseConfigured =
        cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes('YOUR_') &&
        cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes('YOUR_');
      const web3formsConfigured =
        cfg.WEB3FORMS_ACCESS_KEY && !cfg.WEB3FORMS_ACCESS_KEY.includes('YOUR_');

      if (!supabaseConfigured && !web3formsConfigured) {
        console.error('HRS_CONFIG is not set up yet — edit js/config.js with your Supabase and Web3Forms keys.');
        errorBox.textContent = 'Form is not fully set up yet. Please call or WhatsApp us instead.';
        errorBox.style.display = 'block';
        btn.textContent = originalBtnText;
        btn.disabled = false;
        return;
      }

      let supabaseOk = false;
      let emailOk = false;

      // 1) Save to Supabase
      if (supabaseConfigured) {
        try {
          const res = await fetch(`${cfg.SUPABASE_URL}/rest/v1/contact_submissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': cfg.SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${cfg.SUPABASE_ANON_KEY}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify(data),
          });
          supabaseOk = res.ok;
          if (!res.ok) console.error('Supabase insert failed:', await res.text());
        } catch (err) {
          console.error('Supabase insert error:', err);
        }
      }

      // 2) Send email via Web3Forms
      if (web3formsConfigured) {
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: cfg.WEB3FORMS_ACCESS_KEY,
              subject: `New Enquiry from HRS Website – ${data.first_name} ${data.last_name}`,
              from_name: 'HRS Engineers & Builders Website',
              name: `${data.first_name} ${data.last_name}`,
              email: data.email || 'not provided',
              phone: data.phone,
              project_type: data.project_type,
              budget: data.budget,
              area_sqft: data.area_sqft,
              location: data.location,
              message: data.message,
            }),
          });
          const json = await res.json();
          emailOk = res.ok && json.success;
          if (!emailOk) console.error('Web3Forms send failed:', json);
        } catch (err) {
          console.error('Web3Forms send error:', err);
        }
      }

      if (supabaseOk || emailOk) {
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#25D366';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalBtnText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        errorBox.textContent = 'Something went wrong sending your message. Please call or WhatsApp us directly.';
        errorBox.style.display = 'block';
        btn.textContent = originalBtnText;
        btn.disabled = false;
      }
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
