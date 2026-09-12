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
