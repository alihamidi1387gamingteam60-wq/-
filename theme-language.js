const EVENT_THEME = 'portfolio:themechange';
const EVENT_LANGUAGE = 'portfolio:languagechange';

const PALETTES = {
  glacier: { name: 'Glacier Nebula', bg: '#020713', accent: '#00EEFF', visual: '#367BFF', secondary: '#9B46FF', crystal: '#9DEBFF', energy: '#9B46FF', text: '#FFFFFF', gradient: 'linear-gradient(100deg,#00EEFF 0%,#367BFF 52%,#9B46FF 100%)' },
  emerald: { name: 'Emerald Aurora', bg: '#00110F', accent: '#00D3AD', visual: '#8CFFD8', secondary: '#2DA9FF', crystal: '#B8FFE9', energy: '#00D3AD', text: '#FFFFFF', gradient: 'linear-gradient(100deg,#8CFFD8 0%,#00D3AD 52%,#2DA9FF 100%)' },
  violet: { name: 'Violet Supernova', bg: '#090313', accent: '#FF55D2', visual: '#B34CFF', secondary: '#526BFF', crystal: '#FFD0F3', energy: '#00EEFF', text: '#FFFFFF', gradient: 'linear-gradient(100deg,#FF55D2 0%,#B34CFF 52%,#526BFF 100%)' },
  solar: { name: 'Solar Rift', bg: '#10070C', accent: '#FFF07B', visual: '#FFAA38', secondary: '#FF6A3D', crystal: '#FFF07B', energy: '#9D3DFF', text: '#FFFFFF', gradient: 'linear-gradient(100deg,#FFF07B 0%,#FFAA38 52%,#FF6A3D 100%)' },
  crimson: { name: 'Crimson Plasma', bg: '#08050E', accent: '#FF496E', visual: '#FF246B', secondary: '#8A4DFF', crystal: '#FF496E', energy: '#33D6FF', text: '#FFFFFF', gradient: 'linear-gradient(100deg,#FF496E 0%,#FF246B 52%,#8A4DFF 100%)' }
};

export function initThemeLanguage() {
  const root = document.documentElement;
  const dialog = document.getElementById('themeDialog');
  const backdrop = document.getElementById('dialogBackdrop');
  const openButton = document.getElementById('openTheme');
  const closeButton = document.getElementById('closeTheme');
  const languageButton = document.getElementById('languageToggle');
  const languageLabel = document.getElementById('languageLabel');
  const fields = {
    bg: document.getElementById('bgColor'),
    accent: document.getElementById('accentColor'),
    text: document.getElementById('textColor')
  };
  const hexLabels = {
    bg: document.getElementById('bgHex'),
    accent: document.getElementById('accentHex'),
    text: document.getElementById('textHex')
  };
  let english = root.lang === 'en';

  function updateHexLabels() {
    for (const key of Object.keys(fields)) hexLabels[key].textContent = fields[key].value.toUpperCase();
  }

  function announceThemeChange() {
    const css = getComputedStyle(root);
    document.dispatchEvent(new CustomEvent(EVENT_THEME, {
      detail: {
        background: css.getPropertyValue('--page-bg').trim(),
        accent: css.getPropertyValue('--accent').trim(),
        visual: css.getPropertyValue('--visual-accent').trim(),
        text: css.getPropertyValue('--text').trim()
      }
    }));
  }

  function applyPalette(name) {
    const palette = PALETTES[name];
    if (!palette) return;
    fields.bg.value = palette.bg;
    fields.accent.value = palette.accent;
    fields.text.value = palette.text;
    root.style.setProperty('--page-bg', palette.bg);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--visual-accent', palette.visual);
    root.style.setProperty('--accent-secondary', palette.secondary);
    root.style.setProperty('--crystal', palette.crystal);
    root.style.setProperty('--energy-accent', palette.energy);
    root.style.setProperty('--education-label', '#FFFFFF');
    root.style.setProperty('--title-gradient', palette.gradient);
    root.style.setProperty('--line', `color-mix(in srgb,${palette.crystal} 16%,transparent)`);
    root.style.setProperty('--text', palette.text);
    document.querySelectorAll('.preset').forEach(button => {
      button.classList.toggle('active', button.dataset.preset === name);
    });
    updateHexLabels();
    announceThemeChange();
  }

  function setLanguage(nextEnglish) {
    english = Boolean(nextEnglish);
    root.lang = english ? 'en' : 'fa';
    root.dir = english ? 'ltr' : 'rtl';
    document.querySelectorAll('[data-fa][data-en]').forEach(element => {
      element.textContent = english ? element.dataset.en : element.dataset.fa;
    });
    languageLabel.textContent = english ? 'فا' : 'EN';
    languageButton.setAttribute('aria-label', english ? 'Switch language to Persian' : 'تغییر زبان به انگلیسی');
    document.dispatchEvent(new CustomEvent(EVENT_LANGUAGE, {
      detail: { english, lang: root.lang, dir: root.dir }
    }));
  }

  function openDialog() {
    dialog.hidden = false;
    backdrop.hidden = false;
    closeButton.focus();
  }
  function closeDialog() {
    dialog.hidden = true;
    backdrop.hidden = true;
    openButton.focus();
  }

  openButton.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
  backdrop.addEventListener('click', closeDialog);
  document.getElementById('applyTheme').addEventListener('click', closeDialog);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dialog.hidden) closeDialog();
  });
  document.querySelectorAll('.preset').forEach(button => {
    button.addEventListener('click', () => applyPalette(button.dataset.preset));
  });
  Object.entries(fields).forEach(([key, input]) => {
    input.addEventListener('input', () => {
      updateHexLabels();
      const variable = key === 'bg' ? '--page-bg' : key === 'accent' ? '--accent' : '--text';
      root.style.setProperty(variable, input.value);
      if (key === 'accent') {
        root.style.setProperty('--visual-accent', input.value);
        root.style.setProperty('--accent-secondary', input.value);
        root.style.setProperty('--crystal', input.value);
        root.style.setProperty('--energy-accent', input.value);
        root.style.setProperty('--line', `color-mix(in srgb,${input.value} 16%,transparent)`);
        root.style.setProperty('--title-gradient', `linear-gradient(100deg,${input.value},${input.value})`);
      }
      document.querySelectorAll('.preset').forEach(button => button.classList.remove('active')); 
      announceThemeChange();
    });
  });
  languageButton.addEventListener('click', () => setLanguage(!english));
  const mobileButton = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  mobileButton.addEventListener('click', () => {
    const expanded = mobileButton.getAttribute('aria-expanded') === 'true';
    mobileButton.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('is-open', !expanded);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    mobileButton.setAttribute('aria-expanded', 'false');
  }));

  updateHexLabels();
  setLanguage(english);
  applyPalette('glacier');
}
