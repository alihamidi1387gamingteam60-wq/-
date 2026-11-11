function AboutSection() {
  return (
    <section className="mock-section" id="about">
      <div className="section-inner about-layout">
        <div className="globe-wrap"><canvas id="aboutGlobe" role="img" aria-label="کرهٔ شبکه‌ای تعاملی" /></div>
        <div className="about-copy">
          <h2 data-fa="درباره من" data-en="About">درباره من</h2>
          <div className="spotlight-area" data-spotlight data-spotlight-radius="110">
            <div className="spotlight-base">
              <p data-fa="من Ali Voryn هستم؛ یک مهندس نرم‌افزار خودآموخته در مسیر تخصص در Backend Engineering، Web3 و فناوری‌های غیرمتمرکز. باور دارم مهندسی فراتر از نوشتن کد است؛ یعنی درک عمیق، تفکر سیستمی و تبدیل ایده‌های پیچیده به راهکارهای واقعی. مسیر من بر پایه یادگیری مستقل، ساختن، عبور از محدودیت‌ها و خلق آینده‌ای فراتر از افق‌های تعریف‌شده شکل گرفته است." data-en="I’m Ali Voryn, a self-taught software engineer specializing in Backend Engineering, Web3, and decentralized technologies. I believe engineering goes beyond writing code; it means deep understanding, systems thinking, and turning complex ideas into practical solutions. My path is shaped by independent learning, building, pushing past limits, and creating a future beyond defined horizons.">من Ali Voryn هستم؛ یک مهندس نرم‌افزار خودآموخته در مسیر تخصص در Backend Engineering، Web3 و فناوری‌های غیرمتمرکز. باور دارم مهندسی فراتر از نوشتن کد است؛ یعنی درک عمیق، تفکر سیستمی و تبدیل ایده‌های پیچیده به راهکارهای واقعی. مسیر من بر پایه یادگیری مستقل، ساختن، عبور از محدودیت‌ها و خلق آینده‌ای فراتر از افق‌های تعریف‌شده شکل گرفته است.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section className="mock-section" id="courses">
      <div className="section-inner">
        <h2 data-fa="دوره‌ها" data-en="Courses">دوره‌ها</h2>
        <div className="course-grid" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => <div className="course-card" key={index}><i /><span className="mock-lines"><i /><i /></span></div>)}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="mock-section" id="projects">
      <div className="section-inner">
        <h2 data-fa="پروژه‌ها" data-en="Projects">پروژه‌ها</h2>
        <div className="project-grid" aria-hidden="true">
          <article className="mock-project"><i className="project-art art-one" /><span className="mock-lines"><i /><i /></span></article>
          <article className="mock-project"><i className="project-art art-two" /><span className="mock-lines"><i /><i /></span></article>
          <article className="mock-project"><i className="project-art art-three" /><span className="mock-lines"><i /><i /></span></article>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="mock-section" id="experience">
      <div className="section-inner">
        <h2 data-fa="سابقه" data-en="Experience">سابقه</h2>
        <div className="timeline-skeleton" aria-hidden="true">
          <i className="timeline-track" />
          {Array.from({ length: 3 }, (_, index) => <div className="timeline-item" key={index}><i className="timeline-dot" /><span className="mock-lines"><i /><i /><i /></span></div>)}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="mock-section" id="contact">
      <div className="section-inner">
        <h2 data-fa="راه ارتباطی" data-en="Contact">راه ارتباطی</h2>
        <div className="contact-skeleton" aria-hidden="true"><i /><i /><i /><i className="contact-send" /></div>
      </div>
    </section>
  );
}

export function PortfolioSections() {
  return <main className="mock-sections"><AboutSection /><CoursesSection /><ProjectsSection /><ExperienceSection /><ContactSection /></main>;
}
