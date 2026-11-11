const CODE_SAMPLES = [
  `export async function verifyBlock(
  chainId: number,
  hash: Hex
): Promise<boolean> {
  const block = await client.getBlock({ hash });
  return isFinalized(block, chainId);
}` ,
  `const response = await fetch('/v1/blocks');
if (!response.ok) {
  throw new Error('Request failed');
}
const blocks = await response.json();
return blocks.filter(isVerified);`,
  `export function commit(state: State) {
  const next = applyRules(state);
  const digest = hash(next);
  return ledger.append({ digest, next });
}`
];

export function initCodeWindow() {
  const codeText = document.getElementById('codeText');
  const lineNumbers = document.getElementById('lineNumbers');
  const panel = document.getElementById('codePanel');
  if (!codeText || !lineNumbers || !panel) return;

  let sampleIndex = 0;
  let charPosition = 0;
  let deleting = false;
  let currentLineCount = 0, pointerFrame = 0, pointerX = 0, pointerY = 0, panelRect = null;

  function escapeHTML(value) {
    return value.replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character]));
  }

  function paintCode(value) {
    const lines = value.split('\n');
    if (lines.length !== currentLineCount) {
      currentLineCount = lines.length;
      lineNumbers.innerHTML = lines.map((_, index) => `<span>${String(index + 1).padStart(2, '0')}</span>`).join('');
    }
    codeText.innerHTML = lines.map(line => escapeHTML(line).replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*$|\b(?:export|async|function|const|return|if|throw|new|await|true|false)\b|\b\d+\b)/g, token => {
      const className = token.startsWith('//') ? 'token-comment' : (/^["']/.test(token) ? 'token-string' : (/^\d/.test(token) ? 'token-number' : 'token-keyword'));
      return `<span class="${className}">${token}</span>`;
    })).join('\n');
  }

  function typeCode() {
    const target = CODE_SAMPLES[sampleIndex];
    if (!deleting && charPosition < target.length) {
      charPosition++;
      paintCode(target.slice(0, charPosition));
      window.setTimeout(typeCode, 40);
    } else if (!deleting) {
      deleting = true;
      window.setTimeout(typeCode, 1650);
    } else if (charPosition > 0) {
      charPosition = Math.max(0, charPosition - 2);
      paintCode(target.slice(0, charPosition));
      window.setTimeout(typeCode, 20);
    } else {
      deleting = false;
      sampleIndex = (sampleIndex + 1) % CODE_SAMPLES.length;
      window.setTimeout(typeCode, 350);
    }
  }

  function paintPointer() {
    pointerFrame = 0;
    if (!panelRect) return;
    const x = (pointerX - panelRect.left) / panelRect.width;
    const y = (pointerY - panelRect.top) / panelRect.height;
    panel.style.setProperty('--mouse-x', `${x * 100}%`);
    panel.style.setProperty('--mouse-y', `${y * 100}%`);
    panel.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * -7}deg) translateZ(-34px) scale(.965)`;
  }

  typeCode();
  panel.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    panelRect = panel.getBoundingClientRect();
    panel.classList.add('is-hovered');
  });
  panel.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    if (!panelRect) panelRect = panel.getBoundingClientRect();
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
  });
  panel.addEventListener('pointerleave', () => {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    panelRect = null;
    panel.classList.remove('is-hovered');
    panel.style.transform = '';
    panel.style.setProperty('--mouse-x', '50%');
    panel.style.setProperty('--mouse-y', '45%');
  });
  window.addEventListener('resize', () => {
    if (panel.matches(':hover')) panelRect = panel.getBoundingClientRect();
  }, { passive: true });
}
