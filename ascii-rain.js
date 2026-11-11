export function initAsciiRain() {
  const canvas = document.getElementById('asciiRain');
  const header = document.getElementById('home');
  const context = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !header || !context) return;

  const glyphs = 'ｱｲｳｴｵｶｷｸ0123456789ABCDEFｸｿﾝ';
  const settings = { glyphSize: 22, trail: 18, density: 34, speed: 5, angle: 0, shuffle: true, head: '#9DEBFF', tail: '#367BFF' };
  let width = 0, height = 0, dpr = 1, streams = [];
  let lastFrame = 0, lastDraw = 0, visible = true, inViewport = true, running = false, startPending = false, resizeFrame = 0;
  const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
  function readPalette() {
    const styles = getComputedStyle(document.documentElement);
    settings.head = styles.getPropertyValue('--crystal').trim() || '#9DEBFF';
    settings.tail = styles.getPropertyValue('--visual-accent').trim() || '#367BFF';
  }

  function reset() {
    const rect = header.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const columnCount = Math.max(8, Math.round((width / settings.glyphSize) * settings.density / 100));
    const spacing = width / columnCount;
    streams = Array.from({ length: columnCount }, (_, index) => {
      const length = settings.trail + 1;
      return {
        x: index * spacing + Math.random() * spacing,
        y: Math.random() * (height + length * settings.glyphSize) - length * settings.glyphSize,
        speed: settings.glyphSize * (2.6 + settings.speed * .45) * (.65 + Math.random() * .7),
        length,
        characters: Array.from({ length }, randomGlyph),
        nextShuffle: 0
      };
    });
    start();
  }

  function start() {
    if (running || startPending || !visible) return;
    startPending = true;
    const begin = () => {
      startPending = false;
      if (!visible) return;
      running = true;
      lastFrame = 0;
      lastDraw = 0;
      requestAnimationFrame(draw);
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(begin, { timeout: 450 });
    else window.setTimeout(begin, 120);
  }

  function draw(now) {
    if (!visible) { running = false; return; }
    if (now - lastDraw < 40) { requestAnimationFrame(draw); return; }
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, .06) : .033;
    lastFrame = now;
    lastDraw = now;
    context.clearRect(0, 0, width, height);
    const radians = settings.angle * Math.PI / 180;
    const directionX = Math.sin(radians), directionY = Math.cos(radians);
    const stepX = directionX * settings.glyphSize, stepY = directionY * settings.glyphSize;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `${settings.glyphSize}px monospace`;

    for (const stream of streams) {
      stream.x += directionX * stream.speed * delta;
      stream.y += directionY * stream.speed * delta;
      if (settings.shuffle && now >= stream.nextShuffle) {
        const changes = Math.max(1, Math.round(stream.length * .18));
        for (let index = 0; index < changes; index++) {
          stream.characters[Math.floor(Math.random() * stream.length)] = randomGlyph();
        }
        stream.nextShuffle = now + 90 + Math.random() * 180;
      }
      for (let index = stream.length - 1; index >= 0; index--) {
        const x = stream.x - stepX * index;
        const y = stream.y - stepY * index;
        if (x < -settings.glyphSize || x > width + settings.glyphSize || y < -settings.glyphSize || y > height + settings.glyphSize) continue;
        if (index === 0) {
          context.globalAlpha = .98;
          context.fillStyle = settings.head;
          context.shadowColor = settings.head;
          context.shadowBlur = 8;
        } else {
          context.globalAlpha = Math.pow(1 - index / stream.length, 1.35) * .76;
          context.fillStyle = settings.tail;
          context.shadowColor = settings.tail;
          context.shadowBlur = 0;
        }
        context.fillText(stream.characters[index], x, y);
      }
      if (stream.y - settings.trail * settings.glyphSize * directionY > height + settings.trail * settings.glyphSize || stream.x < -settings.trail * settings.glyphSize || stream.x > width + settings.trail * settings.glyphSize) {
        stream.x = Math.random() * width;
        stream.y = -Math.random() * height * .65 - settings.trail * settings.glyphSize;
        stream.speed = settings.glyphSize * (2.6 + settings.speed * .45) * (.65 + Math.random() * .7);
      }
    }
    context.globalAlpha = 1;
    context.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver(entries => {
    inViewport = entries[0].isIntersecting;
    visible = inViewport && !document.hidden;
    if (visible) start();
    else running = false;
  }, { threshold: 0 });
  const scheduleReset = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; reset(); });
  };
  observer.observe(header);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleReset).observe(header);
  else window.addEventListener('resize', scheduleReset, { passive: true });
  document.addEventListener('visibilitychange', () => {
    visible = inViewport && !document.hidden;
    if (visible) start();
    else running = false;
  });
  document.addEventListener('portfolio:themechange', readPalette);
  readPalette();
  reset();
}
