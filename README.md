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

## שלב 1: פרויקט Firebase

✅ **כבר בוצע** - פרויקט Firebase בשם **Oadictionary** (מזהה `oadictionary-c21fb`) כבר קיים, עם:
- Firestore Database פעיל באזור `me-west1` (תל אביב).
- אפליקציית Web רשומה בשם "OADictionary Web", וה-config שלה כבר מוטמע ב-`js/firebase-config.js`.
- כללי אבטחה (`firestore.rules`) ואינדקס (`firestore.indexes.json`) פרוסים בפועל בפרויקט.

אם בכל זאת תרצו להקים פרויקט חדש משלכם בעתיד: **Project settings** (גלגל שיניים) -> **Your apps** -> Web `</>` -> Register app, ואת ה-config שיוצג להעתיק ל-`js/firebase-config.js`.

## שלב 2: ייבוא 3,650 המילים

הייבוא משתמש ב-**Firebase Admin SDK** עם מפתח שירות (service account key), כך שהוא עוקף את כללי האבטחה לגמרי - אין צורך לפתוח/לסגור כללים באופן זמני.

1. ודאו ש-Node.js מותקן אצלכם (`node -v`).
2. בתיקיית הפרויקט: `npm install`.
3. הורידו מפתח שירות: Firebase console -> **Project settings -> Service accounts** -> **Generate new private key**. שמרו את הקובץ שיורד בשם **`scripts/service-account-key.json`** (הקובץ ב-`.gitignore` - **לעולם אל תעלו אותו ל-GitHub ואל תשתפו אותו**, הוא נותן גישת אדמין מלאה לפרויקט).
4. הריצו: `npm run import`. אמורות להופיע הודעות התקדמות עד "הייבוא הושלם בהצלחה!".

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
