/* ============================================================
   GIFT MATRIX — INTERACTIVE BROCHURE JAVASCRIPT
   Handles: Navigation, Reveal animations, Photo Reel,
            FAQ accordion, Scroll effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAVIGATION ===== */
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  // Sticky nav on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    const isOpen = navMobile.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const topPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    });
  });

  /* ===== REVEAL ANIMATIONS (Intersection Observer) ===== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children).filter(el => el.classList.contains('reveal'))
          : [];
        const sibIndex = siblings.indexOf(entry.target);
        const delay = Math.min(sibIndex * 0.1, 0.5);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ===== HORIZONTAL PHOTO REEL ===== */
  const reelTrack = document.getElementById('reelTrack');
  const reelPauseBtn = document.getElementById('reelPause');
  const reelPlayBtn = document.getElementById('reelPlay');

  let isReelPaused = false;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  // Pause / Play buttons
  if (reelPauseBtn) {
    reelPauseBtn.addEventListener('click', () => {
      isReelPaused = true;
      reelTrack.classList.add('paused');
      reelPauseBtn.style.display = 'none';
      reelPlayBtn.style.display = 'inline-block';
    });
  }

  if (reelPlayBtn) {
    reelPlayBtn.addEventListener('click', () => {
      isReelPaused = false;
      reelTrack.classList.remove('paused');
      reelPlayBtn.style.display = 'none';
      reelPauseBtn.style.display = 'inline-block';
    });
  }

  // Draggable reel (mouse)
  if (reelTrack) {
    const wrapper = reelTrack.parentElement;

    wrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
      reelTrack.classList.add('paused');
      wrapper.style.cursor = 'grabbing';
    });

    wrapper.addEventListener('mouseleave', () => {
      isDragging = false;
      wrapper.style.cursor = 'grab';
      if (!isReelPaused) reelTrack.classList.remove('paused');
    });

    wrapper.addEventListener('mouseup', () => {
      isDragging = false;
      wrapper.style.cursor = 'grab';
      if (!isReelPaused) {
        setTimeout(() => {
          if (!isDragging && !isReelPaused) {
            reelTrack.classList.remove('paused');
          }
        }, 1000);
      }
    });

    wrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 2;
      wrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch support for mobile
    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      scrollLeft = wrapper.scrollLeft;
      reelTrack.classList.add('paused');
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      if (!isReelPaused) {
        setTimeout(() => {
          reelTrack.classList.remove('paused');
        }, 1500);
      }
    });

    wrapper.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const walk = (startX - x) * 2;
      wrapper.scrollLeft = scrollLeft + walk;
    }, { passive: true });
  }

  /* ===== FAQ ACCORDION ===== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(other => {
        const otherQ = other.querySelector('.faq-question');
        const otherA = other.querySelector('.faq-answer');
        otherQ.setAttribute('aria-expanded', 'false');
        otherA.classList.remove('open');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  /* ===== OCCASIONS WHEEL — HOVER LINES ===== */
  const wheelItems = document.querySelectorAll('.wheel-item');
  const wheelCenter = document.querySelector('.wheel-center');

  wheelItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (wheelCenter) {
        wheelCenter.style.borderColor = 'var(--gold)';
        wheelCenter.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.3)';
      }
    });

    item.addEventListener('mouseleave', () => {
      if (wheelCenter) {
        wheelCenter.style.borderColor = 'var(--gold)';
        wheelCenter.style.boxShadow = 'none';
      }
    });
  });

  /* ===== PARALLAX SUBTLE EFFECT on Hero ===== */
  const heroSection = document.querySelector('.page-hero');
  const heroContent = document.querySelector('.hero-content');

  if (heroSection && heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.2;
      }
    }, { passive: true });
  }

  /* ===== ACTIVE NAV LINK HIGHLIGHTING ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });

  sections.forEach(section => highlightObserver.observe(section));

  /* ===== COMPARE TABLE ROW HOVER ===== */
  const compareRows = document.querySelectorAll('.compare-row');

  compareRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const giftMatrixCol = row.querySelector('.giftmatrix');
      if (giftMatrixCol) {
        giftMatrixCol.style.background = 'rgba(201,168,76,0.04)';
      }
    });

    row.addEventListener('mouseleave', () => {
      const giftMatrixCol = row.querySelector('.giftmatrix');
      if (giftMatrixCol) {
        giftMatrixCol.style.background = '';
      }
    });
  });

  /* ===== GOLD PARTICLE EFFECT on CTA section ===== */
  const ctaSection = document.querySelector('.page-cta');

  if (ctaSection) {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    `;
    ctaSection.appendChild(particleContainer);

    function createParticle() {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 5;

      p.style.cssText = `
        position: absolute;
        bottom: -10px;
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        background: rgba(201,168,76,${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        animation: floatUp ${duration}s ease-in ${delay}s infinite;
      `;

      particleContainer.appendChild(p);

      // Clean up after several cycles
      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, (duration + delay) * 1000 * 3);
    }

    // Add keyframe for particle animation
    if (!document.getElementById('particleStyle')) {
      const style = document.createElement('style');
      style.id = 'particleStyle';
      style.textContent = `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 1; transform: translateY(-20px) scale(1); }
          90% { opacity: 0.3; }
          100% { transform: translateY(-${window.innerHeight}px) scale(0.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Create initial particles
    for (let i = 0; i < 12; i++) createParticle();

    // Create more periodically
    const particleInterval = setInterval(() => {
      if (document.visibilityState !== 'hidden') {
        createParticle();
      }
    }, 800);

    // Stop when navigated away
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          clearInterval(particleInterval);
        }
      });
    });
    ctaObserver.observe(ctaSection);
  }

  /* ===== PAGE LOAD ANIMATION ===== */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s ease';

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
  }

  /* ===== REEL SECTION — Enter viewport trigger ===== */
  const reelSection = document.querySelector('.reel-section');

  if (reelSection && reelTrack) {
    const reelVisibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reelTrack.style.animationPlayState = 'running';
        } else {
          if (!isReelPaused) {
            reelTrack.style.animationPlayState = 'paused';
          }
        }
      });
    }, { threshold: 0.1 });

    reelVisibilityObserver.observe(reelSection);
  }

  /* ===== BELIEF CARDS — stagger ===== */
  const beliefCards = document.querySelectorAll('.belief-card');
  beliefCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });

  /* ===== SERVICE CARDS — stagger ===== */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ===== SERVE CARDS — stagger ===== */
  const serveCards = document.querySelectorAll('.serve-card');
  serveCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  /* ===== APPROACH CARDS — stagger ===== */
  const approachCards = document.querySelectorAll('.approach-card');
  approachCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

  /* ===== ACTIVE NAV LINK STYLE ===== */
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    .nav-links a.active {
      color: var(--gold);
    }
    .nav-links a.active::after {
      width: 100%;
    }
  `;
  document.head.appendChild(navStyle);

});
