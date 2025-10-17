// Main UI interactions for portfolio
// - Accessible mobile menu
// - Smooth scroll
// - Project modals with focus trap
// - Contact form validation
// - Scroll-to-top button
// - Theme toggle with persistence

(function () {
  const root = document.documentElement;

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme persistence
  const THEME_KEY = 'theme-preference';
  const themeToggle = document.getElementById('themeToggle');
  const getStoredTheme = () => localStorage.getItem(THEME_KEY);
  const setStoredTheme = (val) => localStorage.setItem(THEME_KEY, val);
  const applyTheme = (val) => {
    if (!val) return root.removeAttribute('data-theme');
    root.setAttribute('data-theme', val);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(val === 'dark'));
  };
  applyTheme(getStoredTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    const closeMenu = () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu on link click (mobile)
    primaryNav.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') closeMenu();
    });
    // Close on escape when open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Smooth scroll for internal links
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const section = document.querySelector(id);
    if (!section) return;
    e.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus for accessibility
    if (section instanceof HTMLElement) section.focus({ preventScroll: true });
  });

  // Modals
  const openButtons = document.querySelectorAll('[data-modal-open]');
  const closeSelectors = '[data-modal-close]';
  let lastFocusedBeforeModal = null;

  function trapFocus(modal) {
    const selectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(modal.querySelectorAll(selectors)).filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    function handle(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    modal.addEventListener('keydown', handle);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocusedBeforeModal = document.activeElement;
    modal.hidden = false;
    const doc = modal.querySelector('[role="document"]');
    if (doc) doc.setAttribute('tabindex', '-1');
    (doc || modal).focus();
    trapFocus(modal);
  }

  function closeModal(modal) {
    modal.hidden = true;
    if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) {
      lastFocusedBeforeModal.focus();
    }
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-modal-open');
      if (id) openModal(id);
    });
  });

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches(closeSelectors)) {
      const modal = target.closest('.modal');
      if (modal) closeModal(modal);
    }
    if (target.classList.contains('modal-backdrop')) {
      const modal = target.closest('.modal');
      if (modal) closeModal(modal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal:not([hidden])').forEach((m) => closeModal(m));
    }
  });

  // Contact form validation (client-side enhancement)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      let valid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const nameErr = document.getElementById('name-error');
      const emailErr = document.getElementById('email-error');
      const messageErr = document.getElementById('message-error');

      const setError = (field, el, msg) => {
        if (el) el.textContent = msg || '';
        field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      };

      if (name && nameErr) {
        const v = name.value.trim();
        if (v.length < 2) { setError(name, nameErr, 'Please enter your name.'); valid = false; }
        else setError(name, nameErr, '');
      }
      if (email && emailErr) {
        const v = email.value.trim();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if (!ok) { setError(email, emailErr, 'Please enter a valid email.'); valid = false; }
        else setError(email, emailErr, '');
      }
      if (message && messageErr) {
        const v = message.value.trim();
        if (v.length < 10) { setError(message, messageErr, 'Please enter a longer message.'); valid = false; }
        else setError(message, messageErr, '');
      }

      if (!valid) {
        e.preventDefault();
      }
      // For Formspree/EmailJS integration, see README.
    });
  }

  // Scroll to top button
  const scrollTopBtn = document.getElementById('scrollTop');
  const onScroll = () => {
    const threshold = 200;
    if (!scrollTopBtn) return;
    if (window.scrollY > threshold) scrollTopBtn.hidden = false; else scrollTopBtn.hidden = true;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Intersection Observer for reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Slideshow functionality
  const slideshows = document.querySelectorAll('.slideshow');
  slideshows.forEach((slideshow) => {
    const container = slideshow.querySelector('.slideshow-container');
    const images = container.querySelectorAll('img');
    const prevBtn = slideshow.querySelector('.slideshow-prev');
    const nextBtn = slideshow.querySelector('.slideshow-next');
    const dots = slideshow.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % images.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + images.length) % images.length;
      showSlide(prev);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });

    // Keyboard navigation
    slideshow.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Auto-advance (optional, uncomment to enable)
    // setInterval(nextSlide, 5000);
  });
})();


