export function HeroSection() {
  return (
    <header id="home" className="hero hero-header">
      <canvas id="asciiRain" aria-hidden="true" />
      <section className="hero-copy">
        <h1 className="typed-heading"><span id="typedText" aria-label="بلاکچین و بک اند دولوپر" /></h1>
        <button className="hero-search-trigger" id="openCourseSearch" type="button" aria-haspopup="dialog" aria-controls="courseSearchDialog">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          <span data-fa="جستجو در دوره‌ها" data-en="Search courses">جستجو در دوره‌ها</span>
        </button>
        <div className="hero-stats" id="heroStats" aria-label="آمار آموزشی">
          <div className="hero-stat" data-counter data-target="17" data-prefix="">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5c3.2-.8 6.1-.3 8.5 1.5v12c-2.4-1.8-5.3-2.3-8.5-1.5zM20.5 5.5c-3.2-.8-6.1-.3-8.5 1.5v12c2.4-1.8 5.3-2.3 8.5-1.5z" /><path d="M6.5 9h2.8M6.5 12h2.8M14.7 9h2.8M14.7 12h2.8" /></svg>
            <strong className="hero-stat-number">0</strong>
            <span className="hero-stat-label" data-fa="دوره فعال" data-en="Active courses">دوره فعال</span>
          </div>
          <div className="hero-stat" data-counter data-target="155000" data-prefix="">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2" /><path d="M2.8 19.5v-1.2a6.2 6.2 0 0 1 12.4 0v1.2zM16 5.2a3.1 3.1 0 0 1 0 5.8M17 13.5a5.2 5.2 0 0 1 4.2 5.1v.9h-4" /></svg>
            <strong className="hero-stat-number">0</strong>
            <span className="hero-stat-label" data-fa="دانشجو" data-en="Students">دانشجو</span>
          </div>
          <div className="hero-stat" data-counter data-target="1000" data-prefix="+">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.8" /><path d="M12 6.5v5.8l3.8 2.1M7.5 2.7 5.8 4.4M16.5 2.7l1.7 1.7" /></svg>
            <strong className="hero-stat-number">0</strong>
            <span className="hero-stat-label" data-fa="ساعت آموزش" data-en="Hours of learning">ساعت آموزش</span>
          </div>
        </div>
      </section>
      <section className="code-stage" aria-label="نمایش زنده کد">
        <div className="code-glow" aria-hidden="true" />
        <div className="code-panel" id="codePanel">
          <div className="editor-topbar"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div></div>
          <div className="editor-body">
            <div className="line-numbers" id="lineNumbers" aria-hidden="true" />
            <pre className="code-content"><code id="codeText" aria-live="off" /><span className="code-caret" aria-hidden="true" /></pre>
          </div>
        </div>
      </section>
    </header>
  );
}
