export function initHeroStats() {
  const container = document.getElementById('heroStats');
  const counters = [...(container?.querySelectorAll('[data-counter]') || [])];
  if (!container || !counters.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = 1800;
  let started = false;
  let progress = 0;
  let english = document.documentElement.lang === 'en';
  let numberFormat = new Intl.NumberFormat(english ? 'en-US' : 'fa-IR');

  function paint(counter, value, complete = false) {
    const output = counter.querySelector('.hero-stat-number');
    if (!output) return;
    const prefix = counter.dataset.prefix || '';
    output.textContent = `${prefix}${numberFormat.format(Math.max(0, Math.floor(value)))}`;
    if (complete) output.dataset.complete = 'true';
  }

  function paintAll(ratio, complete = false) {
    for (const counter of counters) {
      const target = Number(counter.dataset.target) || 0;
      paint(counter, target * ratio, complete);
    }
  }

  function animate(startTime) {
    const tick = now => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      progress = 1 - Math.pow(1 - elapsed, 4);
      paintAll(progress, elapsed >= 1);
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function start() {
    if (started) return;
    started = true;
    if (reducedMotion) {
      progress = 1;
      paintAll(1, true);
      return;
    }
    paintAll(0);
    animate(performance.now());
  }

  document.addEventListener('portfolio:languagechange', event => {
    english = event.detail.english;
    numberFormat = new Intl.NumberFormat(english ? 'en-US' : 'fa-IR');
    container.setAttribute('aria-label', english ? 'Training statistics' : 'آمار آموزشی');
    paintAll(progress, progress >= 1);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      start();
      observer.disconnect();
    }, { threshold: .2 });
    observer.observe(container);
  } else {
    start();
  }
}
