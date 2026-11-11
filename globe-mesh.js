const FACE_INDEXES = [
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
];
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTICES = [
  [-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],
  [0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],
  [PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]
];
const normalize = vector => {
  const length = Math.hypot(...vector) || 1;
  return vector.map(value => value / length);
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function initGlobeMesh() {
  const canvas = document.getElementById('aboutGlobe');
  const host = canvas?.parentElement;
  const context = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !host || !context) return;

  const root = document.documentElement;
  const pointCount = 440;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const points = Array.from({ length: pointCount }, (_, index) => {
    const y = 1 - 2 * (index + .5) / pointCount;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, seed: Math.random() * Math.PI * 2, jelly: 0, jellyVelocity: 0, pullX: 0, pullY: 0, pullVX: 0, pullVY: 0 };
  });
  const vertices = RAW_VERTICES.map((vertex, index) => {
    const [x, y, z] = normalize(vertex);
    return { x, y, z, seed: index * 1.7, jelly: 0, jellyVelocity: 0, pullX: 0, pullY: 0, pullVX: 0, pullVY: 0 };
  });
  const edgeSet = new Set();
  FACE_INDEXES.forEach(face => face.forEach((vertex, index) => {
    const next = face[(index + 1) % 3];
    edgeSet.add([Math.min(vertex, next), Math.max(vertex, next)].join(':'));
  }));
  const edges = [...edgeSet].map(edge => edge.split(':').map(Number));
  const colorSources = [
    normalize([.2, .8, .55]), normalize([-.75, .12, .65]), normalize([.75, -.55, .35])
  ];
  let width = 0, height = 0, dpr = 1, rotationX = -.24, rotationY = .18;
  let drag = false, lastPointer = null, hover = null, visible = false, raf = 0, lastFrame = 0, resizeRaf = 0;
  let angularVelocityX = 0, angularVelocityY = 0;
  let dotColor = [135,197,181], netColor = [76,129,120], waveColor = [194,233,203];
  let pointer = { x: 0, y: 0 };

  function parseColor(value, fallback) {
    let hex = (value || '').trim().replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
    const parsed = parseInt(hex.slice(0, 6), 16);
    return Number.isFinite(parsed) ? [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255] : fallback;
  }
  function readColors() {
    const styles = getComputedStyle(root);
    dotColor = parseColor(styles.getPropertyValue('--accent'), [0,238,255]);
    netColor = parseColor(styles.getPropertyValue('--visual-accent'), [54,123,255]);
    waveColor = parseColor(styles.getPropertyValue('--crystal'), [157,235,255]);
  }
  function resize() {
    const rect = host.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.1);
    const pixelWidth = Math.max(1, Math.round(width * dpr));
    const pixelHeight = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
  function scheduleResize() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; resize(); });
  }
  function rotate(point, scale = 1) {
    const cy = Math.cos(rotationY), sy = Math.sin(rotationY);
    const cx = Math.cos(rotationX), sx = Math.sin(rotationX);
    const x = point.x * scale * cy + point.z * scale * sy;
    const z1 = -point.x * scale * sy + point.z * scale * cy;
    return { x, y: point.y * scale * cx - z1 * sx, z: point.y * scale * sx + z1 * cx };
  }
  function project(point, scale = 1) {
    const rotated = rotate(point, scale);
    const radius = Math.min(width, height) * .335;
    const perspective = 3.6 / (3.6 - rotated.z);
    return { x: width / 2 + rotated.x * radius * perspective, y: height / 2 + rotated.y * radius * perspective, z: rotated.z, rotated };
  }
  function deform(point, time, dt) {
    const base = project(point, 1 + point.jelly);
    const dx = hover ? pointer.x - base.x : 0;
    const dy = hover ? pointer.y - base.y : 0;
    const distance = hover ? Math.hypot(dx, dy) : Infinity;
    const influence = hover ? Math.exp(-Math.pow(distance / 72, 2)) : 0;
    const pulse = .14 + .1 * Math.sin(time * 10 + point.seed);
    const targetJelly = influence * pulse;
    point.jellyVelocity += ((targetJelly - point.jelly) * 48 - point.jellyVelocity * 12) * dt;
    point.jelly += point.jellyVelocity * dt;
    point.jelly = clamp(point.jelly, -.04, .3);

    const pullStrength = 2.6 * influence;
    const targetX = dx * pullStrength;
    const targetY = dy * pullStrength;
    point.pullVX += ((targetX - point.pullX) * 56 - point.pullVX * 15) * dt;
    point.pullVY += ((targetY - point.pullY) * 56 - point.pullVY * 15) * dt;
    point.pullX += point.pullVX * dt;
    point.pullY += point.pullVY * dt;
    const projected = project(point, 1 + point.jelly);
    projected.x += point.pullX;
    projected.y += point.pullY;
    return { projected, influence };
  }
  function draw(now) {
    raf = 0;
    if (!visible) return;
    if (lastFrame && now - lastFrame < 40) { raf = requestAnimationFrame(draw); return; }
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : .033;
    lastFrame = now;
    if (!drag) {
      rotationY += (.085 + angularVelocityY) * dt;
      rotationX += angularVelocityX * dt;
      angularVelocityY *= Math.pow(.90, dt * 60);
      angularVelocityX *= Math.pow(.90, dt * 60);
    }
    const time = now * .001;
    context.clearRect(0, 0, width, height);
    const centerX = width / 2, centerY = height / 2;
    const glow = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.min(width,height) * .49);
    glow.addColorStop(0, `rgba(${dotColor.join(',')},.11)`);
    glow.addColorStop(.55, `rgba(${netColor.join(',')},.035)`);
    glow.addColorStop(1, `rgba(${netColor.join(',')},0)`);
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    const projectedVertices = vertices.map(vertex => deform(vertex, time, dt).projected);
    context.save();
    context.globalCompositeOperation = 'lighter';
    edges.forEach(([from, to], index) => {
      const a = projectedVertices[from], b = projectedVertices[to];
      const midX = (a.x + b.x) * .5, midY = (a.y + b.y) * .5;
      const distance = hover ? Math.hypot(midX - pointer.x, midY - pointer.y) : 1000;
      const localLight = hover ? Math.exp(-Math.pow(distance / 48, 2)) : 0;
      const facing = clamp((a.z + b.z + 2) * .25, 0, 1);
      const color = netColor.map((channel, channelIndex) => Math.round(channel * (1 - localLight * .62) + dotColor[channelIndex] * localLight * .62));
      context.beginPath();
      context.moveTo(a.x, a.y); context.lineTo(b.x, b.y);
      context.strokeStyle = `rgba(${color.join(',')},${.09 + facing * .19 + localLight * .4})`;
      context.lineWidth = .65 + localLight * .8;
      context.shadowColor = `rgba(${dotColor.join(',')},.55)`;
      context.shadowBlur = localLight > .25 ? 3 + localLight * 5 : 0;
      context.stroke();
      const travel = (time * .22 + index * .137) % 1;
      const glint = Math.max(0, Math.sin(time * 2 + index)) ** 12 * .5 + localLight * .8;
      if (glint > .08) {
        context.beginPath();
        context.arc(a.x + (b.x - a.x) * travel, a.y + (b.y - a.y) * travel, 1 + glint, 0, Math.PI * 2);
        context.fillStyle = `rgba(${waveColor.join(',')},${glint})`;
        context.fill();
      }
    });
    context.shadowBlur = 0;

    const waveSources = colorSources.map((source, index) => {
      const phase = time * .34 + index * 2.1;
      const dynamic = normalize([source[0] + .22 * Math.sin(phase), source[1] + .2 * Math.cos(phase * .83), source[2]]);
      const radius = (phase * .62) % 3.25;
      return { direction: rotate({ x: dynamic[0], y: dynamic[1], z: dynamic[2] }), cosRadius: Math.cos(radius), bandWidth: Math.max(.025, Math.sin(radius) * .12) };
    });
    points.forEach(point => {
      const { projected: p, influence: jellyInfluence } = deform(point, time, dt);
      const front = (p.z + 1) * .5;
      let wave = 0;
      for (const source of waveSources) {
        const scale = 1 + point.jelly;
        const dot = clamp((p.rotated.x * source.direction.x + p.rotated.y * source.direction.y + p.rotated.z * source.direction.z) / scale, -1, 1);
        const normalizedArc = (dot - source.cosRadius) / source.bandWidth;
        wave = Math.max(wave, Math.exp(-(normalizedArc * normalizedArc)));
      }
      const distance = hover ? Math.hypot(p.x - pointer.x, p.y - pointer.y) : 1000;
      const hoverLight = hover ? Math.min(1, Math.exp(-Math.pow(distance / 32, 2)) + jellyInfluence * .7) : 0;
      const shimmer = Math.pow(Math.max(0, Math.sin(time * 2.4 + point.seed)), 14) * .6;
      const light = Math.min(1, wave * .92 + hoverLight * .95 + shimmer * .5);
      const mix = Math.min(.92, light * .78);
      const color = dotColor.map((channel, channelIndex) => Math.round(channel * (1 - mix) + waveColor[channelIndex] * mix));
      const alpha = .14 + front * .28 + light * .58;
      const size = .75 + front * 1.05 + light * 1.5;
      context.beginPath();
      context.arc(p.x, p.y, size, 0, Math.PI * 2);
      context.fillStyle = `rgba(${color.join(',')},${alpha})`;
      context.shadowColor = `rgba(${dotColor.join(',')},${light * .9})`;
      context.shadowBlur = light > .38 ? 4 + light * 9 : 0;
      context.fill();
    });
    context.restore();

    raf = requestAnimationFrame(draw);
  }
  function start() { if (visible && !raf) raf = requestAnimationFrame(draw); }
  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener('pointerenter', event => { hover = true; canvasPoint(event); start(); });
  canvas.addEventListener('pointermove', event => {
    canvasPoint(event);
    if (drag && lastPointer) {
      const dx = event.clientX - lastPointer.x, dy = event.clientY - lastPointer.y;
      rotationY += dx * .008;
      rotationX = clamp(rotationX + dy * .006, -1.1, 1.1);
      angularVelocityY = dx * .0008;
      angularVelocityX = dy * .0006;
    }
    lastPointer = { x: event.clientX, y: event.clientY };
    start();
  });
  canvas.addEventListener('pointerdown', event => {
    drag = true; hover = true; canvasPoint(event);
    lastPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture?.(event.pointerId);
    start();
  });
  const release = () => {
    drag = false;
    lastPointer = null;
    if (!canvas.matches(':hover')) hover = false;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { if (!drag) hover = false; });
  window.addEventListener('resize', scheduleResize, { passive: true });
  document.addEventListener('portfolio:themechange', readColors);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && !document.hidden;
    if (visible) start();
    else { cancelAnimationFrame(raf); raf = 0; lastFrame = 0; }
  }, { threshold: .05 });
  observer.observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { visible = false; cancelAnimationFrame(raf); raf = 0; lastFrame = 0; }
    else {
      const rect = host.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (visible) start();
    }
  });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleResize).observe(host);
  resize();
  readColors();
}
