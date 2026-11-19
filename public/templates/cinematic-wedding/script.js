(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader = $('.preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader?.classList.add('hide');
      document.body.classList.remove('is-locked');
      if (!reducedMotion && window.gsap) {
        gsap.from('.invitation-intro > *, .card-stage', {y:24, opacity:0, duration:1, stagger:.13, ease:'power3.out', delay:.15});
      }
    }, 450);
  });

  // Scroll engine: Lenis + GSAP ScrollTrigger (single animation loop).
  let lenis = null;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  if (!reducedMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .85, touchMultiplier: 1.1 });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const lenisRaf = (time) => { lenis.raf(time); requestAnimationFrame(lenisRaf); };
      requestAnimationFrame(lenisRaf);
    }
  }

  // Add animation hooks to meaningful content automatically.
  chaptersForAnimation();
  function chaptersForAnimation() {
    $$('.chapter').forEach((chapter) => {
      const candidates = [
        ...chapter.querySelectorAll('.eyebrow, .section-title, .display-title, .body-copy, .event-description, .event-meta, .signature, .welcome-date, .story-stats, .proposal-small, .proposal-date, .family-card, .memory-layout figure, .memory-note, .gallery-item, .wedding-date, .countdown, .venue-name, .venue-address, .text-link, .rsvp-form > *, .finale-names, .finale-date, .thank-you, .back-top')
      ];
      candidates.forEach((el, index) => {
        if (!el.closest('.invitation') && !el.classList.contains('scroll-animated')) {
          el.classList.add('scroll-animated');
          el.dataset.scrollIndex = String(index);
        }
      });
    });
  }

  // Strong, visible scroll reveals and chapter-specific image movement.
  if (hasGSAP && !reducedMotion) {
    $$('.chapter').forEach((chapter, chapterIndex) => {
      const revealItems = $$('.scroll-animated', chapter);
      if (revealItems.length) {
        gsap.fromTo(revealItems,
          { y: 65, opacity: 0, rotateX: 3, filter: 'blur(5px)' },
          {
            y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
            duration: 1.05, stagger: { each: .075, from: 'start' },
            ease: 'power3.out', clearProps: 'filter,transform',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 68%',
              once: true
            }
          }
        );
      }

      const bg = $('.image-bg', chapter);
      if (bg) {
        gsap.fromTo(bg, { scale: 1.2, yPercent: -5 }, {
          scale: 1, yPercent: 5, ease: 'none',
          scrollTrigger: {
            trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 1.2
          }
        });
      }

      const photos = $$('figure img, .family-card img, .wedding-photo img, .gallery-item img', chapter);
      photos.forEach((img, i) => {
        gsap.fromTo(img,
          { scale: 1.16, clipPath: 'inset(10% 8% 10% 8%)' },
          {
            scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.35, ease: 'power3.out',
            scrollTrigger: { trigger: img, start: 'top 88%', once: true }
          }
        );
      });

      // A subtle chapter entrance wash, different timing for each chapter.
      const title = $('.display-title, .section-title', chapter);
      if (title) {
        gsap.fromTo(title, { y: 45, opacity: 0, skewY: chapterIndex % 2 ? 2 : -2 }, {
          y: 0, opacity: 1, skewY: 0, duration: 1.25,
          ease: 'power4.out',
          scrollTrigger: { trigger: title, start: 'top 86%', once: true }
        });
      }
    });

    // Editorial stagger for gallery images.
    const gallery = $('.gallery-grid');
    if (gallery) {
      gsap.fromTo($$('.gallery-item', gallery), { y: 90, opacity: 0, scale: .94 }, {
        y: 0, opacity: 1, scale: 1, duration: 1,
        stagger: .16, ease: 'power3.out',
        scrollTrigger: { trigger: gallery, start: 'top 78%', once: true }
      });
    }

    // The invitation card itself gently floats as the opening scene enters.
    gsap.to('.invite-card', {
      y: -14, rotateZ: .7, ease: 'sine.inOut', yoyo: true, repeat: -1, duration: 3.2
    });
  } else {
    // Fallback when animation CDNs are unavailable or reduced motion is enabled.
    const fallbackObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          fallbackObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    $$('.scroll-animated, .reveal, .gallery-item, .family-card').forEach(el => fallbackObserver.observe(el));
  }

  // Physical invitation cover opening.
  const openButton = $('#open-invitation');
  const inviteCard = $('#invite-card');
  let invitationOpened = false;
  function revealWeddingWebsite() {
    // Unlock the remaining chapters only after the invitation cover has opened.
    document.body.classList.add('invitation-open');
    openButton.style.visibility = 'hidden';
    document.body.classList.remove('is-locked');

    // Newly revealed chapters were hidden during initial setup; recalculate scroll positions.
    requestAnimationFrame(() => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      const welcome = document.querySelector('#chapter-02');
      if (lenis) lenis.scrollTo(welcome, { offset: 0, duration: 1.35 });
      else welcome.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  openButton?.addEventListener('click', () => {
    if (invitationOpened) return;
    invitationOpened = true;
    openButton.setAttribute('aria-label', 'Invitation opened');
    if (window.gsap && !reducedMotion) {
      gsap.to(openButton, {
        rotateY: -158,
        duration: 1.65,
        ease: 'power3.inOut',
        onComplete: revealWeddingWebsite
      });
      gsap.to(inviteCard, { y: -18, duration: 1.1, ease: 'power2.out' });
    } else {
      openButton.style.display = 'none';
      revealWeddingWebsite();
    }
  });

  // Full-screen chapter menu.
  const menu = $('.chapter-menu');
  const menuToggle = $('.menu-toggle');
  const menuClose = $('.menu-close');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }
  menuToggle?.addEventListener('click', () => {
    if (!document.body.classList.contains('invitation-open')) return;
    setMenu(!menu.classList.contains('open'));
  });
  menuClose?.addEventListener('click', () => setMenu(false));
  $$('.menu-links a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); closeLightbox(); } });

  // Chapter tracking and active chapter indicator.
  const chapters = $$('.chapter');
  const liveChapter = $('.live-chapter');
  const chapterLabel = $('.chapter-label');
  const menuLinks = $$('.menu-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const number = entry.target.dataset.chapter || '01';
      liveChapter.textContent = number;
      chapterLabel.textContent = entry.target.dataset.label || '';
      menuLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, {threshold:.45});
  chapters.forEach(chapter => observer.observe(chapter));

  // Countdown to wedding date (local browser time).
  const weddingDate = new Date('2027-02-18T16:00:00');
  function updateCountdown() {
    let diff = Math.max(0, weddingDate.getTime() - Date.now());
    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => { const node = document.getElementById(id); if (node) node.textContent = String(value).padStart(id === 'days' ? 3 : 2, '0'); });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Gallery lightbox with previous / next controls.
  const galleryItems = $$('.gallery-item');
  const lightbox = $('#lightbox');
  const lightboxImage = $('img', lightbox);
  const lightboxCount = $('.lightbox-count');
  let activeImage = 0;
  function showImage(index) {
    activeImage = (index + galleryItems.length) % galleryItems.length;
    lightboxImage.src = galleryItems[activeImage].dataset.full;
    lightboxImage.alt = $('img', galleryItems[activeImage]).alt;
    lightboxCount.textContent = `${String(activeImage+1).padStart(2,'0')} / ${String(galleryItems.length).padStart(2,'0')}`;
  }
  function openLightbox(index) {
    showImage(index); lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeLightbox() {
    lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden','true'); document.body.style.overflow='';
  }
  galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
  $('.lightbox-close')?.addEventListener('click', closeLightbox);
  $('.lightbox-prev')?.addEventListener('click', () => showImage(activeImage-1));
  $('.lightbox-next')?.addEventListener('click', () => showImage(activeImage+1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') showImage(activeImage+1);
    if (e.key === 'ArrowLeft') showImage(activeImage-1);
  });

  // RSVP front-end validation/demo. No response is stored until connected to a backend.
  $('#rsvp-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const note = $('#form-note');
    const button = $('.submit-button', form);
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span>SENDING…</span><b>· · ·</b>';
    note.textContent = 'THANK YOU — YOUR RSVP IS READY. CONNECT AN API ENDPOINT TO SAVE IT.';
    await new Promise(resolve => setTimeout(resolve, 550));
    button.innerHTML = '<span>THANK YOU</span><b>✓</b>';
    form.reset();
    setTimeout(() => { button.disabled = false; button.innerHTML = original; }, 2400);
  });

  // Smooth anchor navigation when Lenis is available.
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, {offset:0, duration:1.25});
      else target.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth'});
    });
  });
})();
