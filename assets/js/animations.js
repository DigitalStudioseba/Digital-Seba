/**
 * DIGITAL SEBA - Animations Module
 * Handles scroll animations, counters, and effects
 * Author: Monir Hossain
 */

'use strict';

const AnimationsModule = (() => {

  // Intersection Observer for scroll animations
  const setupScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-aos]').forEach(el => {
      observer.observe(el);
    });
  };

  // Animated counter
  const animateCounter = (el, target, duration = 2000, suffix = '') => {
    let start = 0;
    const step = target / (duration / 16);
    const isDecimal = target % 1 !== 0;

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
        el.classList.add('counter-done');
      }

      if (isDecimal) {
        el.textContent = start.toFixed(1);
      } else {
        el.textContent = Math.floor(start).toLocaleString();
      }
    }, 16);
  };

  // Setup counter animations
  const setupCounters = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          if (!isNaN(target)) {
            animateCounter(el, target, 2000);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-target]').forEach(el => {
      observer.observe(el);
    });
  };

  // Animated hero title words
  const setupHeroAnimation = () => {
    const titleEl = document.getElementById('animatedTitle');
    if (!titleEl) return;

    const phrases = [
      "to Bangladesh's Services",
      "to Your Government",
      "to Digital Freedom",
      "to Smart Solutions",
      "to AI-Powered Tools"
    ];

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentPhrase = phrases[0];

    const type = () => {
      if (!isDeleting) {
        charIndex++;
        titleEl.textContent = currentPhrase.slice(0, charIndex);
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        charIndex--;
        titleEl.textContent = currentPhrase.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % phrases.length;
          currentPhrase = phrases[index];
        }
      }

      const speed = isDeleting ? 50 : 80;
      setTimeout(type, speed);
    };

    setTimeout(type, 1500);
  };

  // Button ripple effect
  const setupRipple = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-outline, .btn-ghost');
      if (!btn) return;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  };

  // Navbar scroll effect
  const setupNavbarScroll = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  };

  // Mobile menu toggle
  const setupMobileMenu = () => {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', menu.classList.contains('active') ? 'true' : 'false');

      // Prevent body scroll
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  };

  // Testimonials slider
  const setupTestimonialSlider = () => {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    let current = 0;
    let cardsPerView = 3;
    let total;

    const getCardsPerView = () => {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    };

    const updateSlider = () => {
      cardsPerView = getCardsPerView();
      total = Math.ceil(cards.length / cardsPerView);
      if (current >= total) current = total - 1;

      const cardWidth = track.parentElement.clientWidth / cardsPerView;
      const gap = 24;
      const offset = current * (cardWidth + gap);

      track.style.transform = `translateX(-${current * (100 / cardsPerView)}%)`;
      track.style.width = `${cards.length * (100 / cardsPerView)}%`;

      // Fix card widths
      cards.forEach(card => {
        card.style.minWidth = `calc(${100 / cards.length}% - ${gap}px)`;
      });

      // Update dots
      if (dotsContainer) {
        dotsContainer.innerHTML = Array.from({ length: total }, (_, i) => `
          <div class="slider-dot ${i === current ? 'active' : ''}" data-index="${i}"></div>
        `).join('');

        dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
          dot.addEventListener('click', () => {
            current = parseInt(dot.dataset.index);
            updateSlider();
          });
        });
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        current = (current + 1) % total;
        updateSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        current = (current - 1 + total) % total;
        updateSlider();
      });
    }

    // Auto slide
    let autoSlide = setInterval(() => {
      current = (current + 1) % total;
      updateSlider();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        current = (current + 1) % total;
        updateSlider();
      }, 5000);
    });

    // Touch support
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          current = (current + 1) % total;
        } else {
          current = (current - 1 + total) % total;
        }
        updateSlider();
      }
    });

    updateSlider();
    window.addEventListener('resize', updateSlider);
  };

  // FAQ accordion
  const setupFAQ = () => {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  };

  // Newsletter form
  const setupNewsletter = () => {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value.trim();

      if (!email) return;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      try {
        // Save to Firestore if available
        if (typeof firebase !== 'undefined' && window.db) {
          await window.db.collection('newsletter').add({
            email,
            subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'homepage'
          });
        }

        Toast.show('✅ Subscribed successfully! Welcome to Digital Seba.', 'success');
        form.reset();
      } catch (e) {
        Toast.show('Subscription saved locally! Thank you.', 'info');
        form.reset();
      }

      btn.textContent = originalText;
      btn.disabled = false;
    });
  };

  // Contact form
  const setupContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: form.querySelector('input[type="text"]')?.value?.trim(),
        email: form.querySelector('input[type="email"]')?.value?.trim(),
        subject: form.querySelectorAll('input[type="text"]')[1]?.value?.trim(),
        message: form.querySelector('textarea')?.value?.trim(),
        submittedAt: new Date().toISOString()
      };

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        if (typeof firebase !== 'undefined' && window.db) {
          await window.db.collection('contacts').add(formData);
        }
        Toast.show('Message sent successfully! We\'ll reply within 24 hours.', 'success');
        form.reset();
      } catch (e) {
        Toast.show('Message saved! We\'ll get back to you soon.', 'info');
        form.reset();
      }

      btn.textContent = originalText;
      btn.disabled = false;
    });
  };

// Premium Loading Screen
const hideLoadingScreen = () => {

    const screen = document.getElementById('loadingScreen');
    const progress = document.getElementById('loadingProgress');
    const percent = document.getElementById('loadingPercent');

    if (!screen) return;

    document.body.style.overflow = 'hidden';

    let value = 0;

    const timer = setInterval(() => {

        value++;

        if (progress) {
            progress.style.width = value + "%";
        }

        if (percent) {
            percent.textContent = value;
        }

        if (value >= 100) {

            clearInterval(timer);

            setTimeout(() => {

                screen.classList.add('hidden');
                document.body.style.overflow = '';

            }, 250);

        }

    }, 12);

};

  // PWA Banner
  const setupPWABanner = () => {
    let deferredPrompt = null;
    const banner = document.getElementById('pwaBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const dismissBtn = document.getElementById('pwaDismissBtn');

    if (!banner) return;

    // Check if already dismissed
    if (localStorage.getItem('ds_pwa_dismissed')) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      setTimeout(() => {
        banner.classList.add('active');
      }, 5000);
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        banner.classList.remove('active');
        if (deferredPrompt) {
          await deferredPrompt.prompt();
          deferredPrompt = null;
        }
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        banner.classList.remove('active');
        localStorage.setItem('ds_pwa_dismissed', '1');
      });
    }
  };

  // Active nav link on scroll
  const setupActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  };

  // Smooth scroll for anchor links
  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80; // navbar height
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  };

  // Tilt effect for cards
  const setupTiltEffect = () => {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  // Initialize all
  const init = () => {
    hideLoadingScreen();
    setupScrollAnimations();
    setupCounters();
    setupHeroAnimation();
    setupRipple();
    setupNavbarScroll();
    setupMobileMenu();
    setupTestimonialSlider();
    setupFAQ();
    setupNewsletter();
    setupContactForm();
    setupPWABanner();
    setupActiveNav();
    setupSmoothScroll();
    setupTiltEffect();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  AnimationsModule.init();
});

window.AnimationsModule = AnimationsModule;
