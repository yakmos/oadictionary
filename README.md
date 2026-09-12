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
my-words.html         המילים שלי (למשתמשים מחוברים) - עריכה/מחיקה
leaderboard.html      תורמים מובילים
accessibility.html    הצהרת נגישות
admin.html            פאנל ניהול (לא מקושר מהתפריט הציבורי)
css/style.css        עיצוב (כולל מצב כהה ומצב ניגודיות גבוהה)
js/firebase-config.js  הגדרות Firebase (למלא!)
js/app.js             קוד משותף (תפריט/פוטר/חשבון/מצב כהה/תפריט נגישות)
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

## פאנל ניהול

בכתובת `admin.html` (לא מקושר מהתפריט הציבורי) יש פאנל ניהול לאישור/מחיקה של מילים
ממתינות (`confirm == 0`) שנשלחו דרך `add.html`, בלי להיכנס ל-Firestore console.

- מוגן ב-Firebase Authentication (Email/Password) - רק המשתמש שהוגדר כאדמין
  (לפי אימייל, ראו `isAdmin()` ב-`firestore.rules`) יכול לאשר/למחוק.
- ההתחברות נוצרה כבר עבורכם ב-Firebase console -> Authentication -> Users.

## התראות על מילים חדשות

כשמישהו שולח מילה חדשה דרך `add.html`, האתר שולח מיד התראת push דרך
[ntfy.sh](https://ntfy.sh) - שירות חינמי בלי הרשמה ובלי שרת (ה-topic מוגדר
כקבוע `NTFY_TOPIC` בתוך `add.html`).

**כדי לקבל את ההתראות (חד פעמי):**

- **בנייד**: התקינו את האפליקציה החינמית **ntfy** ([אנדרואיד](https://play.google.com/store/apps/details?id=io.heckel.ntfy) / [אייפון](https://apps.apple.com/us/app/ntfy/id1625396347)), פתחו אותה, +Subscribe to topic, והכניסו את השם:
  `oadict-admin-c02f2a0c657a`
- **במחשב**: פשוט פתחו את `https://ntfy.sh/oadict-admin-c02f2a0c657a` בדפדפן ואשרו הרשאת התראות (עובד כל עוד הטאב פתוח ברקע).

מכיוון שה-topic הוא שם אקראי וסודי, אין צורך בסיסמה - רק מי שיודע את השם יכול
להירשם אליו. אם תרצו, אפשר להחליף אותו בעתיד לשם חדש (גם ב-`add.html` וגם
בהרשמה שלכם).

## חשבון משתמש (Google Sign-In), "המילים שלי" ותורמים מובילים

אפשר להתחבר עם חשבון גוגל (כפתור בפינה העליונה בכל עמוד). זה לא חובה - עדיין
אפשר להוסיף מילים בלי להתחבר בדיוק כמו קודם - אבל התחברות נותנת שני יתרונות:

- השם שלכם מתמלא אוטומטית בטופס "הוספת מילה" (`add.html`).
- בעמוד `my-words.html` ("המילים שלי" בתפריט) רואים את כל המילים שהוספתם
  כשהייתם מחוברים, ואפשר לערוך או למחוק אותן בעצמכם. **שימו לב**: עריכת מילה
  ששולחת אותה בחזרה לתור האישור של המנהל (`confirm` מתאפס ל-0), כדי שמישהו
  יבדוק שהעריכה תקינה לפני שהיא חוזרת להופיע באתר. מילים שנשלחו בעבר בלי
  התחברות (או לפני שהתכונה הזו נוספה) אינן משויכות לאף חשבון ולכן לא יופיעו
  ב"המילים שלי" - זו מגבלה טבעית, אין דרך לשייך בדיעבד מילה אנונימית לחשבון.

בעמוד `leaderboard.html` ("תורמים מובילים" בתפריט) יש דירוג של כל התורמים
לפי כמות מילים מאושרות - כולל מי שתרם בלי להתחבר (זה נספר לפי שם התצוגה
שהוזן בטופס, בדיוק כמו סטטיסטיקת "תורמים" בדף הבית).

**כדי שההתחברות עם גוגל תעבוד, יש לבצע פעם אחת (חד פעמי) בקונסולת Firebase:**

1. **הפעלת ספק ההתחברות** - Firebase console -> **Authentication -> Sign-in method** -> לחצו על **Google** -> **Enable** -> בחרו אימייל תמיכה (support email, בדרך כלל האימייל שלכם) -> **Save**.
2. **הוספת הדומיין המורשה** - Firebase console -> **Authentication -> Settings -> Authorized domains** -> **Add domain** -> הוסיפו את `yakmos.github.io` (הדומיין של GitHub Pages). בלי זה ההתחברות תיכשל עם שגיאת `auth/unauthorized-domain`.
3. **פרסום כללי האבטחה המעודכנים** - `firestore.rules` בקוד עודכן כדי לתמוך בבעלות על מילים (uid), אבל זה לא מתעדכן אוטומטית בפרויקט - צריך להעתיק את התוכן המעודכן של הקובץ ולהדביק אותו ב-Firebase console -> **Firestore Database -> Rules** -> **Publish**.

בלי שלושת השלבים האלה, כפתור ההתחברות עם גוגל יציג שגיאה, ועריכה/מחיקה עצמית
של מילים לא תעבוד (גם אם ההתחברות תצליח).

## מצב כהה

טוגל נפרד ועצמאי (סמל ירח/שמש בפינה העליונה, ליד כפתור ההתחברות) - נפרד
לגמרי ממצב "ניגודיות גבוהה" שבתפריט הנגישות. ברירת המחדל היא לפי הגדרת
מערכת ההפעלה של המשתמש (`prefers-color-scheme`), ואם הוא בוחר ידנית - הבחירה
נשמרת בדפדפן שלו (`localStorage`) ומיושמת בכל ביקור הבא.

## מה אפשר להוסיף בהמשך

- חיפוש הפוך (הקלדה בעברית ומציאת המילה האנגלית).
- כתובת URL ייעודית לכל מילה (SEO ושיתוף קישור ישיר).
- חזרה מרווחת אמיתית (spaced repetition) בעמוד התרגול, במקום דירוג בכוכבים בלבד.
- ייבוא CSV בכמות לפאנל הניהול, במקום מילה אחת בכל פעם.
- PWA (אפשרות התקנה כאפליקציה + עבודה אופליין).
