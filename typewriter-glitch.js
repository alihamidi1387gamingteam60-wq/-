const PHRASES = {
  fa: [
    'بلاکچین و بک اند دولوپر !',
    'فراتر از هر افق قابل تعریف !',
    'علی تر از همیشه !',
    'بهترین کیفیت و سرعت !'
  ],
  en: [
    'Blockchain & Backend Developer!',
    'Beyond every defined horizon!',
    'Ali Tar Az Hamishe!',
    'Quality at speed!'
  ]
};

export function initTypewriterGlitch() {
  const root = document.documentElement;
  const typed = document.getElementById('typedText');
  const headline = document.querySelector('.typed-heading');
  let english = root.lang === 'en';
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let fittedPhrase = '';
  let typingTimer = 0;
  let resizeTimer = 0;

  function fitPhrase(phrase) {
    if (phrase === fittedPhrase) return;
    fittedPhrase = phrase;
    const previous = typed.textContent;
    headline.style.fontSize = '';
    typed.textContent = phrase;
    const range = document.createRange();
    range.selectNodeContents(typed);
    let size = parseFloat(getComputedStyle(headline).fontSize);
    const hasRoomForCaret = () => {
      const rects = Array.from(range.getClientRects());
      if (rects.length > 2) return false;
      const lastLine = rects[rects.length - 1];
      if (!lastLine) return true;
      const headingRect = headline.getBoundingClientRect();
      const remaining = root.dir === 'rtl' ? lastLine.left - headingRect.left : headingRect.right - lastLine.right;
      return remaining >= 16;
    };
    while (!hasRoomForCaret() && size > 22) {
      size -= 1;
      headline.style.fontSize = `${size}px`;
    }
    typed.textContent = previous;
  }

  function typeNext() {
    const phrases = PHRASES[english ? 'en' : 'fa'];
    const phrase = phrases[phraseIndex % phrases.length];
    fitPhrase(phrase);
    typed.textContent = phrase.slice(0, charIndex);
    if (!deleting && charIndex < phrase.length) {
      charIndex++;
      typingTimer = window.setTimeout(typeNext, 78);
    } else if (!deleting) {
      deleting = true;
      typingTimer = window.setTimeout(typeNext, 1750);
    } else if (charIndex > 0) {
      charIndex--;
      typingTimer = window.setTimeout(typeNext, 38);
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      fittedPhrase = '';
      typingTimer = window.setTimeout(typeNext, 320);
    }
  }

  function playGlitch() {
    headline.classList.remove('glitching');
    void headline.offsetWidth;
    headline.classList.add('glitching');
  }

  typeNext();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(playGlitch, 2000);
  }
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      window.clearTimeout(typingTimer);
      fittedPhrase = '';
      charIndex = 0;
      deleting = false;
      typeNext();
    }, 120);
  }, { passive: true });
  document.addEventListener('portfolio:languagechange', event => {
    english = event.detail.english;
    phraseIndex = 0;
    charIndex = 0;
    deleting = false;
    fittedPhrase = '';
    window.clearTimeout(typingTimer);
    typeNext();
    typed.setAttribute('aria-label', PHRASES[english ? 'en' : 'fa'][0]);
  });
}
