# OADictionary (גרסה חדשה)

אתר מודרני ללימוד אנגלית באמצעות אסוציאציות, בהשראת האתר המקורי [OADictionary.com](https://oadictionary.com/). נבנה מחדש עם:

- **Frontend**: HTML/CSS/JS רגילים (ללא build step), כדי שיעבוד ישירות על GitHub Pages.
- **Backend/DB**: [Firebase Firestore](https://firebase.google.com/docs/firestore).
- **דאטה**: 3,650 המילים והאסוציאציות ששוחזרו מקובץ `words.ibd` (טבלת ה-`words` המקורית).

## מבנה הפרויקט

```
index.html          דף בית
practice.html        תרגול אסוציאציות (מילה אקראית + חשיפה + דירוג)
browse.html          עיון וחיפוש בכל המילון
add.html             טופס להוספת מילה/אסוציאציה חדשה
css/style.css        עיצוב
js/firebase-config.js  הגדרות Firebase (למלא!)
js/app.js             קוד משותף (תפריט/פוטר)
firestore.rules       כללי אבטחה ל-Firestore
firestore.indexes.json  אינדקס דרוש לשאילתת "מילה אקראית"
scripts/import-words.js  סקריפט לייבוא הנתונים ל-Firestore
data/words_recovered.csv  הנתונים המשוחזרים (3,650 מילים)
```

## שלב 1: יצירת פרויקט Firebase

1. גשו ל-<https://console.firebase.google.com/> ולחצו **Add project**.
2. תנו שם לפרויקט (למשל `oadictionary-v2`), אפשר לכבות Google Analytics (לא נחוץ).
3. בתוך הפרויקט: **Build -> Firestore Database -> Create database**. בחרו מיקום (למשל `eur3` / `me-west1`), ולכתחילה תוכלו לבחור **Start in test mode** (נחמיר את הכללים בהמשך).
4. **Project settings** (גלגל השיניים למעלה) -> גללו ל-**Your apps** -> לחצו על סמל ה-Web `</>` -> תנו שם לאפליקציה -> **Register app**.
5. Firebase יציג לכם קטע קוד עם אובייקט `firebaseConfig`. העתיקו אותו לתוך `js/firebase-config.js` (במקום הערכים `"REPLACE_ME"`).
6. צרו גם קובץ `scripts/import-config.js` (העתק של `scripts/import-config.example.js`) עם אותם ערכים בדיוק - הוא משמש את סקריפט הייבוא. **קובץ זה נמצא ב-.gitignore ולא יעלה ל-GitHub** (זה בסדר, ה-config עצמו אינו סוד, אבל אין סיבה לשכפל אותו).

## שלב 2: ייבוא 3,650 המילים

1. ודאו ש-Node.js מותקן אצלכם (`node -v`).
2. בתיקיית הפרויקט: `npm install`.
3. **חשוב**: לפני הייבוא, ב-Firestore console -> **Rules**, הדביקו זמנית:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   ולחצו **Publish**. (הסקריפט משתמש ב-SDK הרגיל של הלקוח ולא ב-Admin SDK, כדי שלא תצטרכו להוריד/לשמור מפתח שירות רגיש - אז הוא צריך הרשאת כתיבה פתוחה זמנית.)
4. הריצו: `npm run import`. אמורות להופיע הודעות התקדמות עד "הייבוא הושלם בהצלחה!".
5. **מיד אחרי הייבוא**, חזרו ל-Firestore console -> Rules, ומחקו את מה שהדבקתם - במקום זה **הדביקו את התוכן של `firestore.rules` מהפרויקט הזה** ולחצו Publish. זה נועל את מי שיכול לכתוב/למחוק מילים של אחרים.
6. אופציונלי אבל מומלץ - אם יש לכם [Firebase CLI](https://firebase.google.com/docs/cli) מותקן: `firebase deploy --only firestore:indexes` ייצור אוטומטית את האינדקס הדרוש לדף התרגול (שליפת מילה אקראית). אם לא - בפעם הראשונה שתפתחו את `practice.html` תקבלו שגיאה בקונסול של הדפדפן עם קישור "Create index" - פשוט תלחצו עליו, תחכו דקה, ותרעננו.

## שלב 3: העלאה ל-GitHub Pages

```bash
cd oadictionary
git init
git add .
git commit -m "OADictionary v2 - modern rebuild on Firebase"
gh repo create oadictionary --public --source=. --push
```

לאחר מכן: בעמוד ה-repo ב-GitHub -> **Settings -> Pages** -> Source: **Deploy from a branch**, Branch: `main` / `(root)` -> Save. אחרי דקה-שתיים האתר יהיה זמין בכתובת `https://<your-username>.github.io/oadictionary/`.

## איך המידע שוחזר?

`data/words_recovered.csv` הופק ישירות מקובץ ה-`words.ibd` (קובץ tablespace גולמי של InnoDB/MySQL) בפירוק בינארי ידני ברמת העמוד/רשומה - לא היה זמין קובץ סכימה (.frm/SDI). מבנה הטבלה אומת מול קוד המקור האמיתי (`save.php`, `rating.php`) שנמצא ב-`newoadictionary.zip` בדרייב שלכם: `words(name, mean, asco, username, confirm, likes, rating, total_rate)`. כל 3,650 הרשומות נבדקו (rating = total_rate/likes בכל שורה) ונטענו בהצלחה.

## מה אפשר להוסיף בהמשך

- פאנל ניהול קטן לאישור מילים חדשות (`confirm == 0`) בלי להיכנס ל-Firestore console.
- התחברות עם Google/Firebase Auth כדי לדעת מי הוסיף/דירג מה.
- מסך "הכי פופולריות" ממוין לפי `rating`/`likes`.
