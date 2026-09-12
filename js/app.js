// קוד משותף לכל הדפים: בניית ה-header/footer וסימון הקישור הפעיל בתפריט.

function renderChrome(activePage) {
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="brand" href="index.html">
      <img src="img/logo.jpg" alt="OADictionary" class="brand-logo" />
    </a>
    <nav class="main-nav">
      <a href="index.html" data-page="home">חיפוש אסוציאציה</a>
      <a href="practice.html" data-page="practice">תרגול</a>
      <a href="browse.html" data-page="browse">מילון</a>
      <a href="add.html" data-page="add">שיתוף אסוציאציה</a>
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
