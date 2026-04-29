/* =========================================================
   CTA Enrique Alfaro – JavaScript
   ========================================================= */

/* ---------- Mobile Menu Toggle ---------- */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

/* ---------- Scroll to Registration Form ---------- */
function scrollToForm() {
  document.getElementById('unete').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Animated Counters (Stats Band) ---------- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-item__number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const step = Math.ceil(target / (duration / 16));
    let current = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      counter.textContent = current >= 1000
        ? (current >= 1000000
            ? (current / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
            : current.toLocaleString('es-MX'))
        : current;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- Intersection Observer for Fade-in + Counters ---------- */
(function initObservers() {
  // Fade-in elements
  document.querySelectorAll(
    '.card, .timeline__item, .team-card, .section__title, .section__subtitle, .hero__content > *'
  ).forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // Counter animation – trigger once when stats band is in view
  const statsBand = document.querySelector('.stats-band');
  if (statsBand) {
    let counted = false;
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          animateCounters();
          statsObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsBand);
  }
})();

/* ---------- Navbar: shrink on scroll ---------- */
(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(29, 53, 87, 0.99)';
    } else {
      navbar.style.background = 'rgba(29, 53, 87, 0.96)';
    }
  }, { passive: true });
})();

/* ---------- CTA Form Validation & Submission ---------- */
(function initForm() {
  const form = document.getElementById('ctaForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    let valid = true;

    // Reset error state
    form.querySelectorAll('input').forEach(i => i.classList.remove('error'));

    if (!nombre) {
      form.nombre.classList.add('error');
      form.nombre.focus();
      valid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      form.email.classList.add('error');
      if (valid) form.email.focus();
      valid = false;
    }

    if (!valid) return;

    // Simulate async submission
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Quiero participar';
      submitBtn.disabled = false;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 900);
  });
})();

/* ---------- Smooth close mobile menu on outside click ---------- */
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.navbar__toggle');
  if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('open');
  }
}, { passive: true });
