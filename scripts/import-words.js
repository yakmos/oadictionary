#!/usr/bin/env node
/**
 * import-words.js
 * -----------------
 * מייבא את הקובץ data/words_recovered.csv (המילים ששוחזרו מ-words.ibd) ל-Firestore.
 *
 * לפני הרצה:
 *   1. npm install            (מתקין firebase ו-csv-parse - ראו package.json בתיקייה זו)
 *   2. ודאו ש-js/firebase-config.js מולא בפרטי הפרויקט שלכם (מעתיקים את אותו
 *      אובייקט config גם ל-scripts/import-config.js - ראו קובץ לדוגמה).
 *   3. **חשוב**: לפני הייבוא, הגדירו זמנית ב-Firestore console כללים פתוחים
 *      (Rules -> "allow read, write: if true;") כי הסקריפט משתמש ב-SDK הרגיל
 *      (לא ב-Admin SDK, כדי שלא תצטרכו לטפל במפתח שירות רגיש). אחרי שהייבוא
 *      מסתיים בהצלחה, העתיקו בחזרה את התוכן של firestore.rules בפרויקט הזה.
 *
 * הרצה:
 *   node scripts/import-words.js
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  writeBatch,
  doc,
} = require("firebase/firestore");

const configPath = path.join(__dirname, "import-config.js");
if (!fs.existsSync(configPath)) {
  console.error(
    "\nחסר קובץ scripts/import-config.js.\n" +
    "העתיקו את scripts/import-config.example.js לשם ומלאו את פרטי ה-Firebase שלכם.\n"
  );
  process.exit(1);
}
const firebaseConfig = require("./import-config.js");

const CSV_PATH = path.join(__dirname, "..", "data", "words_recovered.csv");
const BATCH_SIZE = 400; // Firestore מגביל ל-500 פעולות בבאץ' אחד

async function main() {
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(raw, { columns: true, skip_empty_lines: true });
  console.log(`נמצאו ${records.length} מילים בקובץ ה-CSV. מתחיל ייבוא...`);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const wordsCol = collection(db, "words");

  let imported = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const row of chunk) {
      const ref = doc(wordsCol); // מזהה חדש שנוצר אוטומטית
      batch.set(ref, {
        legacyId: Number(row.id),
        name: row.name,
        mean: row.mean,
        asco: row.asco,
        username: row.username,
        confirm: Number(row.confirm ?? 1),
        likes: Number(row.likes ?? 0),
        rating: Number(row.rating ?? 0),
        total_rate: Number(row.total_rate ?? 0),
        rand: Math.random(), // לצורך שליפה אקראית בדף התרגול
      });
    }
    await batch.commit();
    imported += chunk.length;
    console.log(`יובאו ${imported}/${records.length}...`);
  }

  console.log("\nהייבוא הושלם בהצלחה!");
  console.log("אל תשכחו להחזיר את הכללים המחמירים מ-firestore.rules ב-Firestore console.");
  process.exit(0);
}

main().catch((err) => {
  console.error("הייבוא נכשל:", err);
  process.exit(1);
});
