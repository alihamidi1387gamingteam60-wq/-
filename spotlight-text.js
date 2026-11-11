export function initSpotlightText(selector = '[data-spotlight]') {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll(selector).forEach(container => {
    if (container.dataset.spotlightReady === 'true') return;
    const base = container.querySelector(':scope > .spotlight-base');
    if (!base) return;
    container.dataset.spotlightReady = 'true';

    const mirror = base.cloneNode(true);
    mirror.classList.add('spotlight-bright');
    mirror.setAttribute('aria-hidden', 'true');
    mirror.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    container.append(mirror);

    if (reducedMotion) {
      container.classList.add('spotlight-static');
      return;
    }

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0, active = false;
    const radius = Number(container.dataset.spotlightRadius) || 165;
    container.style.setProperty('--spotlight-radius', `${radius}px`);

    function move(event) {
      const rect = container.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!active) {
        currentX = targetX;
        currentY = targetY;
        active = true;
        container.classList.add('spotlight-active');
      }
      if (!frame) frame = requestAnimationFrame(easeSpotlight);
    }
    function easeSpotlight() {
      currentX += (targetX - currentX) * .24;
      currentY += (targetY - currentY) * .24;
      container.style.setProperty('--spotlight-x', `${currentX}px`);
      container.style.setProperty('--spotlight-y', `${currentY}px`);
      if (Math.abs(targetX - currentX) > .35 || Math.abs(targetY - currentY) > .35) {
        frame = requestAnimationFrame(easeSpotlight);
      } else {
        frame = 0;
      }
    }
    function leave() {
      active = false;
      container.classList.remove('spotlight-active');
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    container.addEventListener('pointerenter', move, { passive: true });
    container.addEventListener('pointermove', move, { passive: true });
    container.addEventListener('pointerleave', leave, { passive: true });
    container.addEventListener('pointercancel', leave, { passive: true });
  });
}
