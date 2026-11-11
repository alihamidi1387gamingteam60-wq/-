export function CourseSearchDialog() {
  return (
    <>
      <div className="search-backdrop" id="courseSearchBackdrop" hidden />
      <section className="course-search-dialog" id="courseSearchDialog" role="dialog" aria-modal="true" aria-labelledby="courseSearchTitle" aria-describedby="courseSearchStatus" hidden>
        <div className="course-search-top">
          <h2 id="courseSearchTitle" data-fa="جستجوی دوره‌ها" data-en="Search courses">جستجوی دوره‌ها</h2>
          <button className="search-dialog-close" id="closeCourseSearch" type="button" aria-label="بستن جستجو">×</button>
        </div>
        <label className="visually-hidden" htmlFor="courseSearchInput" data-fa="نام دوره را جستجو کنید" data-en="Search course names">نام دوره را جستجو کنید</label>
        <div className="course-search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          <input id="courseSearchInput" type="search" autoComplete="off" spellCheck={false} aria-controls="courseSearchResults" placeholder="نام دوره را بنویسید…" />
        </div>
        <div id="courseSearchResults" className="course-search-results" role="list" aria-live="polite">
          <p id="courseSearchStatus" className="course-search-empty" data-fa="عنوان دوره‌ای برای جستجو ثبت نشده است." data-en="No course titles have been added for search yet.">عنوان دوره‌ای برای جستجو ثبت نشده است.</p>
        </div>
      </section>
    </>
  );
}
