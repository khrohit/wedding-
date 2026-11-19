(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduced) { document.querySelector('.loader')?.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js-ready');
  const loader = document.querySelector('.loader');
  const enter = gsap.timeline({defaults: {ease: 'power3.out'}, onComplete: () => loader?.classList.add('is-done')});
  if (!reduced && loader) {
    enter.to('.loader-line i', {scaleX: 1, duration: .65})
      .to('.loader', {yPercent: -100, duration: .85, ease: 'power4.inOut'}, '+=.15')
      .from('.hero-copy .eyebrow', {y: 14, opacity: 0, duration: .55}, '-=.35')
      .from('.hero .name-line', {yPercent: 110, opacity: 0, stagger: .14, duration: .95}, '-=.2')
      .from('.amp-line', {opacity: 0, scale: .7, duration: .55}, '-=.5')
      .from('.hero-subtitle', {y: 12, opacity: 0, duration: .6}, '-=.3')
      .from('.hero-topline,.hero-bottom', {opacity: 0, duration: .7, stagger: .1}, '-=.35');
  } else {
    loader?.remove();
    gsap.set('.hero-copy .eyebrow,.hero .name-line,.amp-line,.hero-subtitle,.hero-topline,.hero-bottom', {clearProps: 'all'});
  }
  gsap.utils.toArray('.section-pad').forEach(section => {
    const label = section.querySelector('.section-label');
    if (label) gsap.from(label, {opacity: 0, x: -12, duration: .7, scrollTrigger: {trigger: label, start: 'top 88%', once: true}});
  });
  gsap.utils.toArray('.reveal-image').forEach(el => {
    const img = el.querySelector('img');
    gsap.fromTo(el, {clipPath: 'inset(0 0 100% 0)'}, {clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'power3.inOut', scrollTrigger: {trigger: el, start: 'top 84%', once: true}});
    if (img && !reduced) gsap.to(img, {yPercent: 5, ease: 'none', scrollTrigger: {trigger: el, start: 'top bottom', end: 'bottom top', scrub: .6}});
  });
  gsap.utils.toArray('.schedule-row').forEach((row, index) => gsap.from(row, {opacity: 0, y: 24, duration: .65, delay: index * .035, scrollTrigger: {trigger: row, start: 'top 90%', once: true}}));
  gsap.utils.toArray('.form-section').forEach(row => gsap.from(row, {opacity: 0, y: 16, duration: .6, scrollTrigger: {trigger: row, start: 'top 90%', once: true}}));
  if (!reduced) gsap.to('.hero-photo img', {yPercent: 7, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh, {once: true});
  window.addEventListener('resize', () => { ScrollTrigger.refresh(); }, {passive: true});
  document.querySelectorAll('img[loading="lazy"]').forEach(img => img.addEventListener('load', refresh, {once: true}));
})();


