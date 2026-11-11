export function initCourseSearch() {
  const trigger = document.getElementById('openCourseSearch');
  const dialog = document.getElementById('courseSearchDialog');
  const backdrop = document.getElementById('courseSearchBackdrop');
  const closeButton = document.getElementById('closeCourseSearch');
  const input = document.getElementById('courseSearchInput');
  const results = document.getElementById('courseSearchResults');
  const root = document.documentElement;
  if (!trigger || !dialog || !backdrop || !closeButton || !input || !results) return;

  let previousFocus = null;
  let english = root.lang === 'en';

  function setStatus(message) {
    results.replaceChildren();
    const status = document.createElement('p');
    status.className = 'course-search-empty';
    status.id = 'courseSearchStatus';
    status.textContent = message;
    results.append(status);
    dialog.setAttribute('aria-describedby', status.id);
  }

  function search(query = '') {
    const normalized = query.trim().toLocaleLowerCase(english ? 'en' : 'fa');
    const courses = [...document.querySelectorAll('#courses .course-card')]
      .map((element, index) => ({
        element,
        index,
        title: (element.dataset.courseTitle || element.querySelector('[data-course-title]')?.textContent || '').trim(),
        keywords: (element.dataset.search || '').trim(),
        text: (element.innerText || element.textContent || '').trim()
      }))
      .filter(course => course.title || course.keywords || course.text);

    if (!courses.length) {
      setStatus(english ? 'No course titles have been added for search yet.' : 'عنوان دوره‌ای برای جستجو ثبت نشده است.');
      return;
    }
    if (!normalized) {
      setStatus(english ? 'Type a course name or keyword to search.' : 'نام یا کلیدواژهٔ دوره را برای جستجو بنویسید.');
      return;
    }

    const matches = courses.filter(course => `${course.title} ${course.keywords} ${course.text}`.toLocaleLowerCase(english ? 'en' : 'fa').includes(normalized));
    if (!matches.length) {
      setStatus(english ? 'No matching courses found.' : 'دوره‌ای با این عبارت پیدا نشد.');
      return;
    }

    results.replaceChildren();
    dialog.setAttribute('aria-describedby', 'courseSearchResults');
    for (const course of matches) {
      const title = course.title || course.text;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'course-search-result';
      button.setAttribute('role', 'listitem');
      button.textContent = title;
      button.addEventListener('click', () => {
        close();
        course.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      results.append(button);
    }
  }

  function updateLanguage() {
    english = root.lang === 'en';
    input.placeholder = english ? 'Type a course name…' : 'نام دوره را بنویسید…';
    input.setAttribute('aria-label', english ? 'Search course titles' : 'جستجوی نام دوره‌ها');
    closeButton.setAttribute('aria-label', english ? 'Close search' : 'بستن جستجو');
    if (!input.value.trim()) search('');
  }

  function open() {
    previousFocus = document.activeElement;
    dialog.hidden = false;
    backdrop.hidden = false;
    input.value = '';
    updateLanguage();
    window.requestAnimationFrame(() => input.focus());
  }
  function close() {
    dialog.hidden = true;
    backdrop.hidden = true;
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  input.addEventListener('input', () => search(input.value));
  document.addEventListener('portfolio:languagechange', updateLanguage);
  document.addEventListener('keydown', event => {
    if (dialog.hidden) return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled])')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  updateLanguage();
}
