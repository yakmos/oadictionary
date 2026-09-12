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
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
