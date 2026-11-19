(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && window.Lenis) {
    const lenis = new Lenis({duration: 1.05, smoothWheel: true, wheelMultiplier: .85});
    window.__weddingLenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && !link.closest('.menu-overlay')) { event.preventDefault(); lenis.scrollTo(target, {offset: -16}); }
    }));
  }
  const sections = [...document.querySelectorAll('[data-section]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    }), {rootMargin: '-35% 0px -55% 0px'});
    sections.forEach(section => observer.observe(section));
  }
})();
