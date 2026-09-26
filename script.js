/* ══════════════════════════════════════════════
   Abdul Malik — Portfolio v2 · script.js
   1. Navbar + drawer + scroll progress
   2. Typed hero roles
   3. Animated stat counters
   4. Skill bars
   5. Reveal on scroll
   6. Project filters
   7. Lightbox
   8. Contact form (validation + email delivery + WhatsApp + toast)
   9. Back to top + footer year
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTyped();
  initCounters();
  initSkillBars();
  initReveal();
  initFilters();
  initLightbox();
  initContactForm();
  initBackToTop();
  initYear();
});

/* ── 1. Navbar / drawer / progress ────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  const progress = document.getElementById('scroll-progress');
  const links = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );

  const sections = document.querySelectorAll('main section[id]');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));
}

/* ── 2. Typed roles ───────────────────────── */
function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;
  const roles = ['Frontend Developer.', 'React Developer.', 'UI Designer.'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);

    let delay = deleting ? 38 : 68;
    if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ── 3. Stat counters ─────────────────────── */
function initCounters() {
  const nums = document.querySelectorAll('.count');
  if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = Number(el.dataset.count) || 0;
      const dur = 1400, t0 = performance.now();
      (function step(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

/* ── 4. Skill bars ────────────────────────── */
function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card = e.target;
      const level = Math.max(0, Math.min(100, Number(card.dataset.level) || 0));
      requestAnimationFrame(() => {
        card.querySelector('.skill-bar span').style.width = level + '%';
      });
      obs.unobserve(card);
    });
  }, { threshold: 0.35 });
  cards.forEach(c => obs.observe(c));
}

/* ── 5. Reveal on scroll ──────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── 6. Project filters ───────────────────── */
function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const f = btn.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('is-hidden', !show);
    });
  }));
}

/* ── 7. Lightbox ──────────────────────────── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbTech = document.getElementById('lb-tech');
  const lbGithub = document.getElementById('lb-github');

  const cards = Array.from(document.querySelectorAll('.project-card'));
  const data = cards.map(c => ({
    img: c.querySelector('.project-media img').getAttribute('src'),
    alt: c.querySelector('.project-media img').getAttribute('alt'),
    title: c.querySelector('.project-info h3').textContent.trim(),
    desc: c.querySelector('.project-info p').textContent.trim(),
    tech: Array.from(c.querySelectorAll('.project-tech span')).map(s => s.textContent.trim()),
    github: c.querySelector('.code-btn').getAttribute('href'),
  }));

  let idx = -1;
  function open(i) {
    if (i < 0 || i >= data.length) return;
    idx = i;
    const d = data[i];
    lbImg.src = d.img; lbImg.alt = d.alt;
    lbTitle.textContent = d.title;
    lbDesc.textContent = d.desc;
    lbTech.innerHTML = d.tech.map(t => '<span>' + t + '</span>').join('');
    lbGithub.href = d.github;
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  }
  function close() {
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('projects-grid').addEventListener('click', e => {
    const btn = e.target.closest('.js-view-btn');
    if (!btn) return;
    const i = cards.indexOf(btn.closest('.project-card'));
    if (i !== -1) open(i);
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', () => open((idx - 1 + data.length) % data.length));
  document.getElementById('lb-next').addEventListener('click', () => open((idx + 1) % data.length));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') document.getElementById('lb-prev').click();
    if (e.key === 'ArrowRight') document.getElementById('lb-next').click();
  });
}

/* ── 8. Contact form ──────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const waBtn = document.getElementById('whatsapp-btn');
  if (!form || !btn) return;

  const fields = {
    name: document.getElementById('contact-name'),
    email: document.getElementById('contact-email'),
    message: document.getElementById('contact-message'),
  };

  function setError(key, msg) {
    const group = document.getElementById('group-' + key);
    group.classList.toggle('has-error', !!msg);
    group.querySelector('.field-error').textContent = msg || '';
  }

  function readFields() {
    return {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim(),
    };
  }

  function validate(v) {
    let ok = true;
    if (v.name.length < 2) { setError('name', 'Please enter your name.'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) { setError('email', 'Please enter a valid email address.'); ok = false; }
    if (v.message.length < 10) { setError('message', 'Please write at least 10 characters.'); ok = false; }
    return ok;
  }

  Object.entries(fields).forEach(([key, el]) =>
    el.addEventListener('input', () => setError(key, ''))
  );

  // Send straight to Abdul's email via FormSubmit (no backend needed)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = readFields();
    if (!validate(v)) { showToast('error', 'Please fix the highlighted fields.'); return; }

    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Sending…';

    fetch('https://formsubmit.co/ajax/abdulmalik032212@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: v.name,
        email: v.email,
        message: v.message,
        _subject: 'New portfolio message from ' + v.name,
        _template: 'table',
        _captcha: 'false',
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success === 'true') {
          showToast('success', 'Message sent! I\'ll get back to you soon.');
          form.reset();
        } else if (data && /html files/i.test(data.message || '')) {
          // FormSubmit blocks local file:// testing — the site must be hosted
          showToast('error', 'Email needs the site hosted — please use WhatsApp for now.');
        } else {
          throw new Error('send failed');
        }
      })
      .catch(() => {
        showToast('error', 'Could not send right now — try WhatsApp instead.');
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = original;
      });
  });

  // Send the same message straight into Abdul's WhatsApp inbox
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const v = readFields();
      let text;
      if (validate(v)) {
        text = 'Hi Abdul! I\'m ' + v.name + ' (' + v.email + ').\n\n' + v.message;
      } else {
        text = 'Hi Abdul! I saw your portfolio and would like to talk.';
      }
      window.open('https://wa.me/923221241827?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
}

/* ── Toasts ───────────────────────────────── */
function showToast(type, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.setAttribute('role', 'alert');
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';
  toast.innerHTML = '<i class="fa-solid ' + icon + '"></i><span></span>';
  toast.querySelector('span').textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 4500);
}

/* ── 9. Back to top + year ────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
