#!/usr/bin/env node
/**
 * import-words.js
 * -----------------
 * מייבא את הקובץ data/words_recovered.csv (המילים ששוחזרו מ-words.ibd) ל-Firestore.
 *
 * משתמש ב-Firebase Admin SDK + מפתח שירות (service account key), ולכן עוקף
 * את כללי האבטחה (firestore.rules) לגמרי - אין צורך לפתוח/לסגור כללים באופן זמני.
 *
 * לפני הרצה:
 *   1. npm install
 *   2. הורידו מפתח שירות: Firebase console -> Project settings -> Service accounts
 *      -> Generate new private key, ושמרו אותו כ- scripts/service-account-key.json
 *      (הקובץ הזה נמצא ב-.gitignore ולעולם לא יעלה ל-GitHub - אל תשתפו אותו!)
 *
 * הרצה:
 *   node scripts/import-words.js
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const admin = require("firebase-admin");

const keyPath = path.join(__dirname, "service-account-key.json");
if (!fs.existsSync(keyPath)) {
  console.error(
    "\nחסר קובץ scripts/service-account-key.json.\n" +
    "הורידו אותו מ-Firebase console -> Project settings -> Service accounts -> Generate new private key.\n"
  );
  process.exit(1);
}
const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const CSV_PATH = path.join(__dirname, "..", "data", "words_recovered.csv");
const BATCH_SIZE = 400; // Firestore מגביל ל-500 פעולות בבאץ' אחד

async function deleteExisting(wordsCol) {
  const snap = await wordsCol.get();
  if (snap.empty) return;
  console.log(`מוחק ${snap.size} מסמכים קיימים לפני ייבוא נקי מחדש...`);
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    for (const d of docs.slice(i, i + BATCH_SIZE)) batch.delete(d.ref);
    await batch.commit();
  }
}

async function main() {
  // bom: true מסיר BOM (Byte Order Mark) שמופיע בתחילת הקובץ, כדי ש-"id" לא
  // ייקרא בטעות "﻿id" (מה שהיה גורם ל-legacyId להיות NaN).
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const records = parse(raw, { columns: true, skip_empty_lines: true, bom: true });
  console.log(`נמצאו ${records.length} מילים בקובץ ה-CSV. מתחיל ייבוא...`);

  const wordsCol = db.collection("words");
  await deleteExisting(wordsCol);

  let imported = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const row of chunk) {
      const ref = wordsCol.doc(); // מזהה חדש שנוצר אוטומטית
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
  process.exit(0);
}

main().catch((err) => {
  console.error("הייבוא נכשל:", err);
  process.exit(1);
});
