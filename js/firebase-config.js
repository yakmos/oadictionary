// === הגדרות Firebase ===
// 1. היכנס ל-https://console.firebase.google.com/ ולחץ "Add project" (הוסף פרויקט).
// 2. בתוך הפרויקט: Project settings (גלגל שיניים) -> Your apps -> Web (</>) -> רשום אפליקציה.
// 3. Firebase יציג לך אובייקט בשם firebaseConfig - העתק אותו לכאן במקום האובייקט הריק.
// 4. הפעל Firestore Database (Build -> Firestore Database -> Create database).
//
// שים לב: המפתחות האלו (apiKey וכו') הם ציבוריים מטבעם ב-Firebase (מוטמעים בכל אתר שמשתמש
// ב-Firebase JS SDK) - האבטחה האמיתית נשלטת דרך Firestore Security Rules (firestore.rules),
// לא דרך הסתרת המפתחות. עדיין, אין צורך לשתף אותם עם אף אחד שלא צריך גישה לפרויקט.

const firebaseConfig = {
  apiKey: "AIzaSyCd-fAaiYp-dy1LlgmEOcegJKo4pecdJ5M",
  authDomain: "oadictionary-c21fb.firebaseapp.com",
  projectId: "oadictionary-c21fb",
  storageBucket: "oadictionary-c21fb.firebasestorage.app",
  messagingSenderId: "585908436654",
  appId: "1:585908436654:web:a0fd366ea1b5713ce4773f",
  measurementId: "G-07DJXK1T01",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Analytics (Google Analytics 4 מוטמע ב-Firebase) - לא נטען בעמוד הניהול (admin.html),
// כדי שהביקורים שלנו כמנהלים לא יעוותו את הנתונים על משתמשים אמיתיים. חוסם-פרסומות
// או דפדפן עם הגנת פרטיות עלולים לחסום את זה - זה לא אמור לשבור שום דבר אחר באתר.
let analytics = null;
try {
  if (typeof firebase.analytics === "function") {
    analytics = firebase.analytics();
  }
} catch (err) {
  console.warn("Analytics לא הופעל (לא קריטי):", err);
}

// עוזר קטן לרישום אירועים בבטחה - לא מפיל שום דבר אם analytics לא זמין.
function trackEvent(name, params) {
  try {
    if (analytics) analytics.logEvent(name, params || {});
  } catch (err) {
    console.warn("trackEvent נכשל (לא קריטי):", err);
  }
}
