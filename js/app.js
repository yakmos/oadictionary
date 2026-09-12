// קוד משותף לכל הדפים: בניית ה-header/footer וסימון הקישור הפעיל בתפריט.

function renderChrome(activePage) {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="brand" href="index.html">
      <span class="eng">OA</span><span class="dot">•</span>Dictionary
    </a>
    <nav class="main-nav">
      <a href="index.html" data-page="home">בית</a>
      <a href="practice.html" data-page="practice">תרגול אסוציאציות</a>
      <a href="browse.html" data-page="browse">מילון</a>
      <a href="add.html" data-page="add">הוספת מילה</a>
    </nav>
  `;
  document.body.prepend(header);
  header.querySelectorAll("nav a").forEach((a) => {
    if (a.dataset.page === activePage) a.classList.add("active");
  });

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `בהשראת OADICTIONARY.com &middot; נבנה מחדש עם Firebase &middot; ${new Date().getFullYear()}`;
  document.body.appendChild(footer);
}

// עזר: escape קטן למניעת הזרקת HTML כשמציגים טקסט ממשתמשים
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
