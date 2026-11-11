export function initCursorRing() {
  const canvas = document.getElementById('cursorField');
  const context = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !context) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, points = [], palette = [];
  let pointerActive = false;
  let pointerX = window.innerWidth / 2, pointerY = window.innerHeight / 2;
  let ringX = pointerX, ringY = pointerY, lastFrame = 0, lastDraw = 0, raf = 0;

  function toRGB(value) {
    let hex = value.trim().replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(character => character + character).join('');
    const number = parseInt(hex.slice(0, 6), 16);
    return Number.isFinite(number) ? [(number >> 16) & 255, (number >> 8) & 255, number & 255] : [135, 197, 181];
  }
  function readPalette() {
    const styles = getComputedStyle(root);
    palette = ['--visual-accent', '--accent', '--crystal'].map(name => toRGB(styles.getPropertyValue(name)));
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(150, Math.max(55, Math.round(width * height / 10000)));
    points = Array.from({ length: count }, (_, index) => {
      const x = Math.random() * width, y = Math.random() * height;
      return { x, y, homeX: x, homeY: y, vx: 0, vy: 0, size: .65 + Math.random() * 1.15, phase: Math.random() * Math.PI * 2, color: index % 3 };
    });
  }
  function scheduleDraw() {
    if (!raf && !document.hidden && (!reducedMotion || pointerActive)) raf = requestAnimationFrame(draw);
  }
  function draw(now) {
    raf = 0;
    if (document.hidden) return;
    if (now - lastDraw < 32) { raf = requestAnimationFrame(draw); return; }
    lastDraw = now;
    const dt = lastFrame ? Math.min(2, (now - lastFrame) / 16.667) : 1;
    lastFrame = now;
    const seconds = now * .001;
    if (!pointerActive) {
      pointerX = width * (.5 + .24 * Math.sin(seconds * .23) + .06 * Math.sin(seconds * .47));
      pointerY = height * (.5 + .24 * Math.cos(seconds * .19) + .06 * Math.cos(seconds * .39));
    }
    const ease = reducedMotion ? 1 : Math.min(.2 * dt, 1);
    ringX += (pointerX - ringX) * ease;
    ringY += (pointerY - ringY) * ease;
    context.clearRect(0, 0, width, height);

    const accent = palette[1] || [135, 197, 181];
    const radius = Math.min(58, Math.max(38, Math.min(width, height) * .085));
    context.save();
    context.globalCompositeOperation = 'lighter';
    const glow = context.createRadialGradient(ringX, ringY, Math.max(0, radius - 24), ringX, ringY, radius + 26);
    glow.addColorStop(0, `rgba(${accent.join(',')},0)`);
    glow.addColorStop(.42, `rgba(${accent.join(',')},${pointerActive ? '.025' : '.012'})`);
    glow.addColorStop(.62, `rgba(${accent.join(',')},${pointerActive ? '.16' : '.075'})`);
    glow.addColorStop(.78, `rgba(${accent.join(',')},${pointerActive ? '.075' : '.035'})`);
    glow.addColorStop(1, `rgba(${accent.join(',')},0)`);
    context.fillStyle = glow;
    context.fillRect(ringX - radius - 28, ringY - radius - 28, (radius + 28) * 2, (radius + 28) * 2);
    context.beginPath();
    context.arc(ringX, ringY, radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${accent.join(',')},${pointerActive ? '.23' : '.10'})`;
    context.lineWidth = 1;
    context.shadowColor = `rgba(${accent.join(',')},.62)`;
    context.shadowBlur = pointerActive ? 19 : 10;
    context.stroke();
    context.restore();

    for (const point of points) {
      const dx = point.x - ringX, dy = point.y - ringY;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const influence = Math.max(0, 1 - distance / (radius * 1.65));
      const impulse = influence * influence * (pointerActive ? 1.05 : .32) * dt;
      point.vx += dx / distance * impulse;
      point.vy += dy / distance * impulse;
      point.vx += (point.homeX - point.x) * .009 * dt;
      point.vy += (point.homeY - point.y) * .009 * dt;
      const damping = Math.pow(.91, dt);
      point.vx *= damping; point.vy *= damping;
      point.x += point.vx * dt; point.y += point.vy * dt;
      const band = Math.exp(-Math.pow((distance - radius) / 31, 2));
      const light = Math.min(1, Math.max(band, influence * .42));
      const base = palette[point.color] || accent;
      const blend = .78 * light;
      const color = base.map((channel, index) => Math.round(channel * (1 - blend) + accent[index] * blend));
      const angle = Math.atan2(dy, dx) + Math.PI + Math.sin(seconds * 1.4 + point.phase) * .18;
      context.beginPath();
      context.ellipse(point.x, point.y, point.size * (2.2 + light * 1.5), point.size * .72, angle, 0, Math.PI * 2);
      context.fillStyle = `rgba(${color.join(',')},${.16 + light * .75})`;
      context.shadowColor = `rgba(${accent.join(',')},.8)`;
      context.shadowBlur = light > .35 ? 3 + light * 7 : 0;
      context.fill();
    }
    context.shadowBlur = 0;
    if (!reducedMotion) scheduleDraw();
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    if (reducedMotion) scheduleDraw();
  }, { passive: true });
  window.addEventListener('pointerout', event => { if (!event.relatedTarget) pointerActive = false; });
  window.addEventListener('blur', () => { pointerActive = false; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else scheduleDraw();
  });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('portfolio:themechange', readPalette);
  resize();
  readPalette();
  scheduleDraw();
}
