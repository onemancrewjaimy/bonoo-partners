// ═══════════════════════════════════════════════
// HAMBURGER / NAV OVERLAY
// ═══════════════════════════════════════════════
const hamburger  = document.getElementById('hamburger');
const navOverlay = document.getElementById('nav-overlay');
const navClose   = document.getElementById('nav-close');
const backdrop   = document.getElementById('nav-backdrop');

function openNav() {
  navOverlay.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('visible');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  navClose.focus();
}

function closeNav() {
  navOverlay.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('visible');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus();
}

hamburger.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);
backdrop.addEventListener('click', closeNav);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOverlay.getAttribute('aria-hidden') === 'false') {
    closeNav();
  }
});

// ═══════════════════════════════════════════════
// SMOOTH SCROLL: all .nav-link anchors
// ═══════════════════════════════════════════════
document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    closeNav();
    // Small delay so the nav panel closes before scrolling
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without jumping
      history.pushState(null, '', `#${targetId}`);
    }, navOverlay.getAttribute('aria-hidden') === 'false' ? 350 : 0);
  });
});

// ═══════════════════════════════════════════════
// STICKY HEADER SHADOW
// ═══════════════════════════════════════════════
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ═══════════════════════════════════════════════
// FOOTER YEAR
// ═══════════════════════════════════════════════
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ═══════════════════════════════════════════════
// CONTACT FORM – client-side validation
// ═══════════════════════════════════════════════
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('[required]').forEach((field) => {
    field.classList.remove('invalid');
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    }
  });

  const emailField = form.querySelector('#email');
  if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.classList.add('invalid');
    valid = false;
  }

  if (!valid) {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // In a real deployment, replace this with a fetch() to your backend / form service.
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  form.reset();
});

// Remove invalid class on input
form.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => field.classList.remove('invalid'));
});

// ═══════════════════════════════════════════════
// SIMPLE INTERSECTION OBSERVER – fade-in on scroll
// ═══════════════════════════════════════════════
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
  .reveal.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);

const revealEls = document.querySelectorAll(
  '.stat-item, .expertise-card, .dienst-card, .step, .review-card, .trust-pillar, .visual-card'
);
revealEls.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => observer.observe(el));
