/* ============================================================
   ASSOS KARADUT TAŞ OTEL – Quiet JS (index.html only)
   Hibrit hero video + reveal-on-scroll.
   Tüm seçiciler defensive: element yoksa sessizce no-op.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Hibrit hero video =====
     Poster foto anında görünür (CSS background / <img>).
     Video sayfa yüklendikten sonra orijinal kalitede yüklenir,
     oynatılabilir olunca .is-playing ile fade-in yapar. */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo && !reducedMotion) {
    var src = heroVideo.getAttribute('data-video-src');
    if (src) {
      var start = function () {
        heroVideo.src = src;
        heroVideo.muted = true; // autoplay garantisi
        heroVideo.load();
        heroVideo.addEventListener('canplaythrough', function onReady() {
          heroVideo.removeEventListener('canplaythrough', onReady);
          heroVideo.play().then(function () {
            heroVideo.classList.add('is-playing');
          }).catch(function () { /* autoplay engellendi: poster kalır */ });
        });
      };
      if (document.readyState === 'complete') { start(); }
      else { window.addEventListener('load', start, { once: true }); }
    }
  }

  /* ===== Reveal on scroll ===== */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }
});
