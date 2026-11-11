export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="nav-shell mx-auto flex items-center justify-between" aria-label="منوی اصلی">
        <button className="mobile-toggle" type="button" aria-label="باز کردن منو" aria-expanded="false" aria-controls="primary-links">
          <span /><span />
        </button>
        <div className="nav-links" id="primary-links">
          <a href="#about" data-fa="درباره من" data-en="About">درباره من</a>
          <a href="#courses" data-fa="دوره‌ها" data-en="Courses">دوره‌ها</a>
          <a href="#projects" data-fa="پروژه‌ها" data-en="Projects">پروژه‌ها</a>
          <a href="#experience" data-fa="سابقه" data-en="Experience">سابقه</a>
          <a href="#contact" data-fa="راه ارتباطی" data-en="Contact">راه ارتباطی</a>
        </div>
        <div className="nav-actions">
          <button className="language-button" id="languageToggle" type="button" aria-label="تغییر زبان به انگلیسی">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3.5 12h17M12 3c2.3 2.4 3.4 5.4 3.4 9s-1.1 6.6-3.4 9c-2.3-2.4-3.4-5.4-3.4-9S9.7 5.4 12 3Z" /></svg>
            <span id="languageLabel">EN</span>
          </button>
          <button className="palette-button" id="openTheme" type="button" aria-label="ساخت رنگ‌بندی" aria-haspopup="dialog" aria-controls="themeDialog">
            <span className="palette-icon" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
