/* FEBRIA MEDIA — Accessible interaction and motion */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const progress = document.createElement('div');
  progress.className = 'fm-progress';
  if (header) { header.style.position = 'sticky'; header.prepend(progress); }

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();

  // Reveal content as it enters the viewport.
  const revealTargets = document.querySelectorAll('.hero-copy,.hero-art,.section-head,.article-card,.pillar-grid>a,.newsletter');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fm-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -35px 0px'});
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('fm-visible'));
  }

  // Animate the existing editorial metrics without changing their displayed values.
  document.querySelectorAll('.hero-metrics b').forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = Number(match[1]), suffix = match[2];
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    el.textContent = '0' + suffix;
    const counter = new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;
      const start = performance.now(), duration = 1000;
      const tick = now => {
        const p = Math.min((now-start)/duration,1);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = String(Math.round(target*eased)).padStart(match[1].length,'0') + suffix;
        if (p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, {threshold:.7});
    counter.observe(el);
  });

  // Add a subtle light ripple to interactive calls-to-action.
  document.querySelectorAll('.btn,.nav-cta,.chip').forEach(control => {
    control.addEventListener('click', event => {
      if (reduceMotion) return;
      const rect = control.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.35;
      const ripple = document.createElement('span');
      ripple.className = 'fm-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (event.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (event.clientY - rect.top - size/2) + 'px';
      control.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
    });
  });

  // Keep mobile navigation state and accessibility attributes in sync.
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded','false');
    if (menuBtn) { menuBtn.textContent = '☰'; menuBtn.setAttribute('aria-label','Buka menu'); }
  };
  // The core app.js owns the menu toggle; this layer only closes it on outside click / Escape.
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!nav || !menuBtn || !nav.classList.contains('open')) return;
    if (!nav.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
  });
})();
