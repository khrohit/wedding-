(() => {
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.menu-overlay');
  const close = document.querySelector('.menu-close');
  if (!toggle || !overlay) return;
  const links = [...overlay.querySelectorAll('nav a')];
  let menuTimeline;
  const openMenu = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      menuTimeline?.kill();
      menuTimeline = gsap.fromTo(links, {y: 28, opacity: 0}, {y: 0, opacity: 1, duration: .55, stagger: .075, ease: 'power3.out'});
    } else links.forEach(link => { link.style.opacity = '1'; });
    close?.focus();
  };
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    overlay.classList.remove('is-open');
    toggle.focus();
  };
  toggle.addEventListener('click', () => toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());
  close?.addEventListener('click', closeMenu);
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(); });
})();
