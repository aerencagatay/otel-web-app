/* ============================================================
   ASSOS KARADUT TAŞ OTEL – App JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Online rezervasyon linkleri (Next.js; GitHub Pages’de değil) ===== */
  var bookingUrl = typeof window.KARADUT_BOOKING_URL === 'string'
    ? window.KARADUT_BOOKING_URL.trim()
    : '';
  if (bookingUrl) {
    document.querySelectorAll('a[data-karadut-booking]').forEach(function (a) {
      a.setAttribute('href', bookingUrl);
    });
  }

  /* ===== AOS INIT ===== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* ===== STICKY NAVBAR ===== */
  const nav = document.getElementById('mainNav');
  const topbarHeight = document.querySelector('.topbar') ? 38 : 0;

  function handleScroll() {
    if (nav) {
      if (window.scrollY > topbarHeight + 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Back to top
    const btt = document.getElementById('backToTop');
    if (btt) {
      if (window.scrollY > 400) {
        btt.classList.add('show');
      } else {
        btt.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ===== BACK TO TOP ===== */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== NAVBAR ACTIVE LINK ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  /* ===== COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();
    const originalText = el.textContent;
    const suffix = originalText.replace(/[\d.,]/g, ''); // keep "+", etc.

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      if (isDecimal) {
        el.textContent = current.toFixed(1) + (suffix || '');
      } else {
        el.textContent = Math.floor(current) + (suffix || '');
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = originalText; // restore original
      }
    }
    requestAnimationFrame(step);
  }

  if (counters.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target && this.getAttribute('href') !== '#') {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== CLOSE MOBILE MENU ON LINK CLICK ===== */
  document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarMain');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  /* ===== CONTACT FORM (prevent default) ===== */
  const contactForm = document.querySelector('form[action="#"]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Mesajınız İletildi';
      btn.style.background = '#28a745';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        this.reset();
      }, 3000);
    });
  }

});
