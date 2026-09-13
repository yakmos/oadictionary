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
    <div class="header-right">
      <nav class="main-nav" aria-label="ניווט ראשי">
        <a href="index.html" data-page="home">חיפוש אסוציאציה</a>
        <a href="practice.html" data-page="practice">תרגול</a>
        <a href="browse.html" data-page="browse">מילון</a>
        <a href="add.html" data-page="add">שיתוף אסוציאציה</a>
        <a href="leaderboard.html" data-page="leaderboard">תורמים מובילים</a>
        <a href="my-words.html" data-page="my-words">המילים שלי</a>
        <a href="premium.html" data-page="premium">קובץ PDF מלא</a>
      </nav>
      <div class="header-actions" id="headerActions"></div>
    </div>
  `;
  document.body.insertBefore(header, skipLink.nextSibling);
  header.querySelectorAll("nav a").forEach((a) => {
    if (a.dataset.page === activePage) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  renderThemeToggle(document.getElementById("headerActions"));
  if (activePage !== "admin") {
    renderAccountWidget(document.getElementById("headerActions"));
  }

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

// ===== מצב כהה =====
// טוגל נפרד לגמרי מתפריט הנגישות (שם יש "ניגודיות גבוהה" - העדפה שונה
// לגמרי). ברירת המחדל היא לפי העדפת מערכת ההפעלה של המשתמש, אלא אם הוא
// כבר בחר במפורש פעם קודמת - הבחירה נשמרת ב-localStorage.
function renderThemeToggle(container) {
  if (!container) return;
  const STORAGE_KEY = "oadict_theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY); // "dark" | "light" | null
    } catch (e) {
      return null;
    }
  }
  function storeTheme(v) {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch (e) {
      /* לא קריטי אם האחסון המקומי חסום */
    }
  }

  function isDark() {
    const stored = getStoredTheme();
    if (stored) return stored === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";

  function apply() {
    const dark = isDark();
    document.body.classList.toggle("dark-mode", dark);
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "מעבר למצב בהיר" : "מעבר למצב כהה");
    btn.innerHTML = dark ? "&#9728;" : "&#9789;"; // ☀ / ☾
  }
  apply();

  btn.addEventListener("click", () => {
    storeTheme(isDark() ? "light" : "dark");
    apply();
  });

  container.appendChild(btn);
}

// ===== חשבון משתמש (התחברות עם גוגל) =====
// מוצג בכל עמוד חוץ מ-admin.html (שם יש טופס התחברות ייעודי משלו למנהל).
// נכתב באופן מגונן - אם Firebase Auth לא נטען בעמוד מסוים, פשוט לא מוצג
// כלום, במקום לזרוק שגיאה ולשבור את שאר התפריט.
function renderAccountWidget(container) {
  if (!container) return;
  if (typeof firebase === "undefined" || !firebase.auth) return;

  const wrap = document.createElement("div");
  wrap.className = "account-widget";
  container.appendChild(wrap);

  function renderSignedOut() {
    wrap.innerHTML = `
      <button type="button" class="btn-google" id="googleSignInBtn">
        <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"/>
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
        </svg>
        <span>התחברות עם גוגל</span>
      </button>
    `;
    document.getElementById("googleSignInBtn").addEventListener("click", async () => {
      try {
        await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
      } catch (err) {
        console.error(err);
        if (err && err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
          alert("ההתחברות נכשלה - נסו שוב.");
        }
      }
    });
  }

  function renderSignedIn(user) {
    const name = user.displayName || user.email || "משתמש";
    wrap.innerHTML = `
      <div class="account-chip">
        ${user.photoURL
          ? `<img src="${escapeHtml(user.photoURL)}" alt="" class="account-avatar" />`
          : `<span class="account-avatar account-avatar-fallback" aria-hidden="true">${escapeHtml(name.charAt(0))}</span>`}
        <span class="account-name">${escapeHtml(name)}</span>
      </div>
      <button type="button" class="account-signout" id="accountSignOutBtn">התנתקות</button>
    `;
    document.getElementById("accountSignOutBtn").addEventListener("click", () => {
      firebase.auth().signOut();
    });
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) renderSignedIn(user);
    else renderSignedOut();
  });
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
