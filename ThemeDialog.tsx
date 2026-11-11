const PRESETS = [
  ['glacier', 'یخ کیهانی', 'Glacier Nebula'],
  ['emerald', 'شفق زمردی', 'Emerald Aurora'],
  ['violet', 'ابرنواختر بنفش', 'Violet Supernova'],
  ['solar', 'شکاف خورشیدی', 'Solar Rift'],
  ['crimson', 'پلاسمای سرخ', 'Crimson Plasma']
] as const;

export function ThemeDialog() {
  return (
    <>
      <div className="dialog-backdrop" id="dialogBackdrop" hidden />
      <section className="theme-dialog" id="themeDialog" role="dialog" aria-modal="true" aria-label="تنظیم رنگ‌بندی" hidden>
        <button className="dialog-close" id="closeTheme" type="button" aria-label="بستن پنجره">×</button>
        <div className="presets" role="group" aria-label="پالت‌های تیره">
          {PRESETS.map(([id, fa, en], index) => (
            <button className={`preset${index === 0 ? ' active' : ''}`} type="button" data-preset={id} aria-label={fa} key={id}>
              <span className="swatches" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} />)}</span>
              <span data-fa={fa} data-en={en}>{fa}</span>
            </button>
          ))}
        </div>
        <div className="color-controls">
          <label className="color-field"><span data-fa="پس‌زمینه" data-en="Background">پس‌زمینه</span><span className="color-input-wrap"><input type="color" id="bgColor" defaultValue="#020713" /><code id="bgHex">#020713</code></span></label>
          <label className="color-field"><span data-fa="رنگ تأکیدی" data-en="Accent">رنگ تأکیدی</span><span className="color-input-wrap"><input type="color" id="accentColor" defaultValue="#00eeff" /><code id="accentHex">#00EEFF</code></span></label>
          <label className="color-field"><span data-fa="رنگ متن" data-en="Text">رنگ متن</span><span className="color-input-wrap"><input type="color" id="textColor" defaultValue="#ffffff" /><code id="textHex">#FFFFFF</code></span></label>
        </div>
        <button className="apply-button" id="applyTheme" type="button"><span data-fa="اعمال رنگ‌ها" data-en="Apply colors">اعمال رنگ‌ها</span><span aria-hidden="true">↙</span></button>
      </section>
    </>
  );
}
