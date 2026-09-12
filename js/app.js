// קוד משותף לכל הדפים: בניית ה-header/footer, קישור דילוג לתוכן, וסימון
// הקישור הפעיל בתפריט. כולל גם את תפריט הנגישות הצף (renderA11yWidget).

function renderChrome(activePage) {
  // קישור דילוג - הפריט הראשון בעמוד, מיועד למשתמשי מקלדת/קוראי מסך
  // כדי לדלג ישר לתוכן המרכזי בלי לעבור על כל התפריט בכל פעם.
  const skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = "#main-content";
  skipLink.textContent = "דלג לתוכן המרכזי";
  document.body.prepend(skipLink);

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="OADictionary - לעמוד הבית">
      <img src="img/logo.jpg" alt="OADictionary" class="brand-logo" />
    </a>
    <nav class="main-nav" aria-label="ניווט ראשי">
      <a href="index.html" data-page="home">חיפוש אסוציאציה</a>
      <a href="practice.html" data-page="practice">תרגול</a>
      <a href="browse.html" data-page="browse">מילון</a>
      <a href="add.html" data-page="add">שיתוף אסוציאציה</a>
    </nav>
  `;
  document.body.insertBefore(header, skipLink.nextSibling);
  header.querySelectorAll("nav a").forEach((a) => {
    if (a.dataset.page === activePage) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // ודאו שיש למרכז התוכן יעד למיקוד (עבור קישור הדילוג ולמעברי SPA-ish)
  const main = document.querySelector("main");
  if (main) {
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  }

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    בהשראת OADICTIONARY.com &middot; נבנה מחדש עם Firebase &middot; ${new Date().getFullYear()}
    &middot; <a href="accessibility.html">הצהרת נגישות</a>
  `;
  document.body.appendChild(footer);

  renderA11yWidget();
}

// עזר: escape קטן למניעת הזרקת HTML כשמציגים טקסט ממשתמשים
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ===== תפריט נגישות צף =====
// מאפשר הגדלה/הקטנה של הטקסט, מצב ניגודיות גבוהה, הדגשת קישורים ועצירת
// אנימציות - בנוסף על התאמות הנגישות המובנות בעיצוב עצמו. ההעדפות נשמרות
// ב-localStorage כדי שיישמרו גם במעבר בין דפי האתר ובביקורים הבאים.
function renderA11yWidget() {
  const STORAGE_KEY = "oadict_a11y_prefs";

  function loadPrefs() {
    try {
      return Object.assign(
        { fontStep: 0, contrast: false, underline: false, reduceMotion: false },
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
      );
    } catch (e) {
      return { fontStep: 0, contrast: false, underline: false, reduceMotion: false };
    }
  }

  function savePrefs(p) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
      /* לא קריטי אם האחסון המקומי חסום */
    }
  }

  let prefs = loadPrefs();

  function applyPrefs() {
    document.documentElement.style.fontSize = prefs.fontStep
      ? 100 + prefs.fontStep * 12 + "%"
      : "";
    document.body.classList.toggle("a11y-contrast", !!prefs.contrast);
    document.body.classList.toggle("a11y-underline-links", !!prefs.underline);
    document.body.classList.toggle("a11y-reduce-motion", !!prefs.reduceMotion);
  }
  applyPrefs();

  const wrap = document.createElement("div");
  wrap.className = "a11y-widget";
  wrap.innerHTML = `
    <button type="button" class="a11y-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="a11yPanel" aria-label="פתיחת תפריט נגישות">
      <span aria-hidden="true">&#9855;</span>
    </button>
    <div class="a11y-panel" id="a11yPanel" hidden>
      <div class="a11y-title" id="a11yPanelTitle">אפשרויות נגישות</div>
      <button type="button" data-action="inc">הגדלת טקסט (+)</button>
      <button type="button" data-action="dec">הקטנת טקסט (-)</button>
      <button type="button" data-action="contrast" aria-pressed="false">ניגודיות גבוהה</button>
      <button type="button" data-action="underline" aria-pressed="false">הדגשת קישורים</button>
      <button type="button" data-action="motion" aria-pressed="false">עצירת אנימציות</button>
      <button type="button" data-action="reset">איפוס הגדרות נגישות</button>
      <a href="accessibility.html" class="a11y-statement-link">הצהרת נגישות</a>
    </div>
  `;
  document.body.appendChild(wrap);

  const toggleBtn = wrap.querySelector(".a11y-toggle");
  const panel = wrap.querySelector(".a11y-panel");
  const titleId = "a11yPanelTitle";
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-labelledby", titleId);

  function syncButtons() {
    panel.querySelector('[data-action="contrast"]').setAttribute("aria-pressed", String(!!prefs.contrast));
    panel.querySelector('[data-action="underline"]').setAttribute("aria-pressed", String(!!prefs.underline));
    panel.querySelector('[data-action="motion"]').setAttribute("aria-pressed", String(!!prefs.reduceMotion));
  }
  syncButtons();

  function openPanel() {
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  }
  function closePanel(focusToggle) {
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    if (focusToggle) toggleBtn.focus();
  }

  toggleBtn.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel(false);
  });

  document.addEventListener("click", (e) => {
    if (!panel.hidden && !wrap.contains(e.target)) closePanel(false);
  });

  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closePanel(true);
  });

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "inc") prefs.fontStep = Math.min((prefs.fontStep || 0) + 1, 4);
    if (action === "dec") prefs.fontStep = Math.max((prefs.fontStep || 0) - 1, -2);
    if (action === "contrast") prefs.contrast = !prefs.contrast;
    if (action === "underline") prefs.underline = !prefs.underline;
    if (action === "motion") prefs.reduceMotion = !prefs.reduceMotion;
    if (action === "reset") prefs = { fontStep: 0, contrast: false, underline: false, reduceMotion: false };
    savePrefs(prefs);
    applyPrefs();
    syncButtons();
  });
}
