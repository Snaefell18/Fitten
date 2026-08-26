/* ══════════════════════════════════════════════════════════════════
   FITTEN.ME — Sprachen / Languages
   Eine Zeile je Text: { de: …, en: … }. Braucht ein Text Werte aus der
   App, steht statt der Zeichenkette eine Funktion.
   Neue Sprache: LANGS und LOCALE ergänzen, in jedem Eintrag den Schlüssel
   nachziehen — fehlt einer, greift automatisch Deutsch.
   ══════════════════════════════════════════════════════════════════ */

export const LANGS = [
  { id:"de", n:"Deutsch" },
  { id:"en", n:"English" }
];

export const LOCALE = { de:"de-DE", en:"en-GB" };

/* ─────────────  KATALOGE  ─────────────
   Deutsch steht in app.js an den Daten selbst, hier nur die Übersetzung.
   Schlüssel ist jeweils die id des Eintrags. */

export const CATALOG = {
  en: {
    group: {
      "Draußen":"Outdoors", "Gym":"Gym", "Sportarten":"Sports", "Ruhig":"Low intensity",
      "Protein":"Protein", "Sättigung":"Staples", "Fast Food":"Fast food",
      "Obst & Gemüse":"Fruit & veg", "Milch & Fett":"Dairy & fats",
      "Snacks":"Snacks", "Getränke":"Drinks", "Eigene":"Custom"
    },
    act: {
      walk:"Walking outdoors", walk_fast:"Brisk walking", hike:"Hiking",
      jog:"Jogging (8 km/h)", run:"Running (11 km/h)", bike:"Cycling, easy",
      bike_fast:"Cycling, brisk", mtb:"Mountain biking", skate:"Inline skating",
      ski:"Skiing", garden:"Gardening",
      weights:"Weight training", machines:"Machines, moderate", hiit:"HIIT / functional",
      cross:"Cross trainer", row:"Rowing machine", spin:"Spinning", stepper:"Stair climber",
      rope:"Jump rope", stairs:"Stair climbing",
      swim:"Swimming", football:"Football", basket:"Basketball", tennis:"Tennis",
      badminton:"Badminton", volley:"Volleyball", box:"Boxing", climb:"Climbing",
      dance:"Dancing",
      yoga:"Yoga", pilates:"Pilates", stretch:"Mobility / stretching"
    },
    food: {
      skyr:"Skyr, plain", quark:"Low-fat quark", chicken:"Chicken breast",
      beef:"Ground beef 20 %", salmon:"Salmon", tuna:"Tuna (in water)", egg:"Egg",
      whey:"Whey shake", tofu:"Tofu",
      pasta:"Pasta, cooked", rice:"Rice, cooked", potato:"Potatoes",
      sweetpot:"Sweet potato", oats:"Oats", bread:"Wholegrain bread", toast:"White toast",
      couscous:"Couscous, cooked", beans:"Kidney beans",
      nuggets:"Chicken nuggets", bigmac:"Big Mac", cheeseb:"Cheeseburger", fries:"Fries",
      pizza:"Pizza margherita", doener:"Doner kebab", curry:"Currywurst", sushi:"Sushi",
      banana:"Banana", apple:"Apple", berries:"Berries", avocado:"Avocado",
      broccoli:"Broccoli", tomato:"Tomatoes", cucumber:"Cucumber", carrot:"Carrots",
      salad:"Leaf salad",
      milk:"Milk 3.5 %", yogurt:"Yoghurt, plain", gouda:"Gouda", cream:"Cream cheese",
      butter:"Butter", oil:"Olive oil",
      almonds:"Almonds", choco:"Chocolate", chips:"Crisps", haribo:"Gummy bears",
      icecream:"Ice cream", bar:"Protein bar", popcorn:"Popcorn",
      cola:"Cola", juice:"Orange juice", schorle:"Apple spritzer", beer:"Beer",
      wine:"Wine", latte:"Latte macchiato"
    },
    goal: {
      bulk:  ["Build muscle",        "Slight surplus for lean gains"],
      keep:  ["Maintain",            "Hold your weight, keep performance steady"],
      cut1:  ["Moderate weight loss","Around 0.4 kg per week, easy to sustain"],
      cut2:  ["Faster weight loss",  "Around 0.7 kg per week, takes discipline"],
      manual:["Manual",              "Your own deficit or surplus"]
    },
    diet: {
      all:  ["Everything",  "No restrictions"],
      pesc: ["Pescatarian", "Fish yes, meat no"],
      veg:  ["Vegetarian",  "No meat, no fish"],
      vegan:["Vegan",       "Fully plant-based"]
    },
    life: {
      low:   ["Mostly sitting", "Desk job, few steps"],
      mid:   ["Lightly active", "Some movement day to day"],
      high:  ["Active",         "On your feet a lot, manual work"],
      manual:["Manual",         "Your own allowance in calories"]
    },
    tier: {
      basis:  ["Basic",   "Tracking, made simple"],
      premium:["Premium", "Sharper. Smarter. Faster."],
      ultra:  ["Ultra+",  "Everything at maximum."]
    },
    macro: { pr:"Protein", ch:"Carbs", fa:"Fat" }
  }
};

/* ─────────────  OBERFLÄCHE  ─────────────
   Ein Eintrag je Text. Funktionen bekommen die Werte in der Reihenfolge,
   in der sie in app.js übergeben werden. */

export const STRINGS = {

  /* ── Rahmen ── */
  "app.title":        { de:"FITTEN.ME — Kalorien & Training", en:"FITTEN.ME — Calories & Training" },
  "app.tagline":      { de:"Kalorien, Training und Fortschritt an einem Ort.",
                        en:"Calories, training and progress in one place." },
  "a.close":          { de:"Schließen",         en:"Close" },
  "a.dismiss":        { de:"Hinweis ausblenden",en:"Dismiss notice" },
  "a.remove":         { de:"Entfernen",         en:"Remove" },
  "a.settings":       { de:"Einstellungen",     en:"Settings" },
  "a.coach":          { de:"Coach öffnen",      en:"Open coach" },
  "a.day":            { de:"Tag wechseln",      en:"Change day" },
  "a.send":           { de:"Senden",            en:"Send" },
  "btn.save":         { de:"Speichern",         en:"Save" },
  "btn.back":         { de:"Zurück",            en:"Back" },
  "btn.cancel":       { de:"Abbrechen",         en:"Cancel" },
  "btn.next":         { de:"Weiter",            en:"Continue" },
  "btn.add":          { de:"Eintragen",         en:"Log it" },
  "btn.create":       { de:"Anlegen",           en:"Create" },
  "err.unknown":      { de:"Unbekannter Fehler",en:"Unknown error" },

  /* ── Login ── */
  "li.mail":          { de:"E-Mail",            en:"Email" },
  "li.mailPh":        { de:"du@beispiel.de",    en:"you@example.com" },
  "li.pass":          { de:"Passwort",          en:"Password" },
  "li.passPh":        { de:"Mindestens 6 Zeichen", en:"At least 6 characters" },
  "li.in":            { de:"Anmelden",          en:"Sign in" },
  "li.up":            { de:"Konto erstellen",   en:"Create account" },
  "li.toUp":          { de:"Noch kein Konto? Registrieren", en:"No account yet? Sign up" },
  "li.toIn":          { de:"Schon dabei? Anmelden",         en:"Already have an account? Sign in" },
  "li.or":            { de:"ODER",              en:"OR" },
  "li.google":        { de:"Mit Google fortfahren", en:"Continue with Google" },
  "li.needBoth":      { de:"Bitte E-Mail und Passwort eingeben.",
                        en:"Please enter your email and password." },
  "li.failed":        { de:"Anmeldung fehlgeschlagen. Versuch es noch einmal.",
                        en:"Sign-in failed. Please try again." },

  "auth/invalid-email":          { de:"Diese E-Mail-Adresse ist ungültig.",
                                   en:"That email address is not valid." },
  "auth/invalid-credential":     { de:"E-Mail oder Passwort stimmen nicht.",
                                   en:"Email or password is incorrect." },
  "auth/wrong-password":         { de:"E-Mail oder Passwort stimmen nicht.",
                                   en:"Email or password is incorrect." },
  "auth/user-not-found":         { de:"Zu dieser E-Mail gibt es kein Konto.",
                                   en:"There is no account for that email." },
  "auth/email-already-in-use":   { de:"Für diese E-Mail existiert bereits ein Konto.",
                                   en:"An account with that email already exists." },
  "auth/weak-password":          { de:"Das Passwort braucht mindestens 6 Zeichen.",
                                   en:"The password needs at least 6 characters." },
  "auth/popup-closed-by-user":   { de:"Das Google-Fenster wurde geschlossen.",
                                   en:"The Google window was closed." },
  "auth/network-request-failed": { de:"Keine Verbindung. Prüfe dein Netz und versuch es erneut.",
                                   en:"No connection. Check your network and try again." },

  /* ── Onboarding ── */
  "ob.step":          { de:(n,all)=>`Schritt ${n} von ${all}`, en:(n,all)=>`Step ${n} of ${all}` },
  "ob.start":         { de:"Los geht's",        en:"Let's go" },
  "ob.saveFailed":    { de:"Speichern fehlgeschlagen. Prüfe deine Verbindung.",
                        en:"Saving failed. Check your connection." },

  "ob1.title":        { de:"Deine Eckdaten",    en:"Your basics" },
  "ob1.sub":          { de:"Daraus berechnen wir deinen Grundumsatz nach Mifflin-St Jeor.",
                        en:"We use these to work out your basal metabolic rate (Mifflin-St Jeor)." },
  "ob1.everyday":     { de:"Alltag ohne gezieltes Training", en:"Everyday life, without workouts" },
  "ob1.hint":         { de:"Trainingseinheiten trägst du später separat ein – sie erhöhen dein Tagesbudget zusätzlich.",
                        en:"You log workouts separately later — they add to your daily budget on top." },
  "ob1.consent":      { de:`Ich willige ein, dass FITTEN.ME meine Gesundheitsdaten – Körperdaten,
                        Ziele, Mahlzeiten und Trainings – zur Berechnung meiner Werte verarbeitet und dafür
                        an die genannten Dienstleister übermittelt. Die Einwilligung kann ich jederzeit
                        widerrufen. Einzelheiten stehen unter
                        <u style="text-decoration:underline" id="f-privacy">Datenschutz</u>.`,
                        en:`I consent to FITTEN.ME processing my health data — body data, goals, meals and
                        workouts — to calculate my figures, and transferring it to the listed service
                        providers for that purpose. I can withdraw this consent at any time. Details are in the
                        <u style="text-decoration:underline" id="f-privacy">privacy policy</u>.` },
  "ob1.errWeight":    { de:"Bitte ein Gewicht zwischen 30 und 300 kg eintragen.",
                        en:"Please enter a weight between 30 and 300 kg." },
  "ob1.errHeight":    { de:"Bitte eine Größe zwischen 120 und 230 cm eintragen.",
                        en:"Please enter a height between 120 and 230 cm." },
  "ob1.errAge":       { de:"Bitte ein Alter zwischen 14 und 100 Jahren eintragen.",
                        en:"Please enter an age between 14 and 100." },
  "ob1.errConsent":   { de:"Bitte bestätige die Einwilligung zur Verarbeitung deiner Gesundheitsdaten.",
                        en:"Please confirm your consent to the processing of your health data." },
  "ob1.errLsk":       { de:"Bitte einen Zuschlag zwischen 0 und 3000 kcal eintragen.",
                        en:"Please enter an allowance between 0 and 3000 kcal." },

  "ob2.title":        { de:"Dein Ziel",         en:"Your goal" },
  "ob2.sub":          { de:"Bestimmt, wie dein Tagesbudget vom Grundbedarf abweicht.",
                        en:"Sets how far your daily budget sits from your maintenance calories." },
  "ob2.errGoal":      { de:"Bitte ein Ziel auswählen.", en:"Please pick a goal." },
  "ob2.errKcal":      { de:"Bitte einen Wert zwischen -1500 und +1500 kcal eintragen.",
                        en:"Please enter a value between -1500 and +1500 kcal." },

  "ob3.title":        { de:"Was bewegst du gern?", en:"How do you like to move?" },
  "ob3.sub":          { de:"Deine Favoriten stehen beim Eintragen ganz oben. Die Werte gelten für dein Gewicht.",
                        en:"Your favourites show up first when logging. The figures are based on your weight." },
  "ob3.err":          { de:"Wähle mindestens eine Aktivität.", en:"Pick at least one activity." },

  "ob4.title":        { de:"Wie isst du?",      en:"How do you eat?" },
  "ob4.sub":          { de:"Bestimmt, welche Lebensmittel dir überhaupt angeboten werden.",
                        en:"Decides which foods are offered to you at all." },
  "ob4.count":        { de:n=>`${n} Lebensmittel`, en:n=>`${n} foods` },
  "ob4.err":          { de:"Bitte eine Ernährungsform auswählen.", en:"Please pick a way of eating." },

  "ob5.title":        { de:"Was isst du gern?", en:"What do you like to eat?" },
  "ob5.sub":          { de:"Damit du Lieblingsgerichte mit einem Tipp erfassen kannst.",
                        en:"So you can log your favourites with a single tap." },
  "ob5.err":          { de:"Wähle mindestens ein Lebensmittel.", en:"Pick at least one food." },

  "ob6.title":        { de:"Magst du etwas gar nicht?", en:"Anything you don't like?" },
  "ob6.sub":          { de:"Das Gewählte taucht beim Erfassen nicht mehr auf. Kannst du überspringen.",
                        en:"Anything you pick won't show up when logging. Feel free to skip." },

  /* ── Felder, die mehrfach vorkommen ── */
  "f.weight":         { de:"Gewicht (kg)",      en:"Weight (kg)" },
  "f.height":         { de:"Größe (cm)",        en:"Height (cm)" },
  "f.age":            { de:"Alter",             en:"Age" },
  "f.sex":            { de:"Geschlecht",        en:"Sex" },
  "f.male":           { de:"Männlich",          en:"Male" },
  "f.female":         { de:"Weiblich",          en:"Female" },
  "f.lsk":            { de:"Zuschlag zum Grundumsatz (kcal)", en:"Allowance on top of BMR (kcal)" },
  "f.gk":             { de:"Abweichung vom Grundbedarf (kcal)", en:"Difference from maintenance (kcal)" },
  "f.gkNote":         { de:"Negativ ergibt ein Defizit, positiv einen Überschuss.",
                        en:"Negative gives a deficit, positive a surplus." },
  "f.floor":          { de:n=>`Untergrenze von ${n} kcal greift.`,
                        en:n=>`The ${n} kcal floor applies.` },
  "f.name":           { de:"Bezeichnung",       en:"Name" },
  "f.kcal":           { de:"Kalorien",          en:"Calories" },
  "f.kcalBurned":     { de:"Verbrannte Kalorien", en:"Calories burned" },
  "f.macrosG":        { de:"Makros in Gramm",   en:"Macros in grams" },
  "unit.kcalPer100":  { de:"kcal / 100 g",      en:"kcal / 100 g" },
  "unit.kcalH":       { de:"kcal/h",            en:"kcal/h" },
  "unit.kcalPerHour": { de:"kcal pro Stunde",   en:"kcal per hour" },
  "hint.tdee":        { de:(tdee,bmr)=>`Grundbedarf inkl. Alltag: <b>${tdee} kcal</b> · Grundumsatz in Ruhe: <b>${bmr} kcal</b>`,
                        en:(tdee,bmr)=>`Maintenance incl. everyday life: <b>${tdee} kcal</b> · Resting metabolic rate: <b>${bmr} kcal</b>` },

  /* ── Home ── */
  "h.available":      { de:"kcal verfügbar",    en:"kcal available" },
  "h.over":           { de:"kcal über dem Budget", en:"kcal over budget" },
  "h.eaten":          { de:n=>`${n} gegessen`,  en:n=>`${n} eaten` },
  "h.moved":          { de:n=>` · +${n} Bewegung`, en:n=>` · +${n} from movement` },
  "h.budget":         { de:n=>`${n} Budget`,    en:n=>`${n} budget` },
  "h.logToday":       { de:"Heute erfasst",     en:"Logged today" },
  "h.log":            { de:"Erfasst",           en:"Logged" },
  "h.logEmpty":       { de:"Noch nichts erfasst. Fang mit einer Mahlzeit oder einem Training an.",
                        en:"Nothing logged yet. Start with a meal or a workout." },
  "h.sugEyebrow":     { de:"Vorschlag",         en:"Suggestion" },
  "h.sugQ":           { de:"Was könnte ich heute noch essen?", en:"What else could I eat today?" },
  "h.photo":          { de:"Meal erfassen",     en:"Log a meal" },
  "h.manual":         { de:"+ Meal",            en:"+ Meal" },
  "h.train":          { de:"+ Training",        en:"+ Workout" },
  "h.offline":        { de:"Offline gespeichert – Sync folgt.",
                        en:"Saved offline — it will sync later." },

  /* ── Wochenrückblick ── */
  "rc.title":         { de:"Deine Woche",       en:"Your week" },
  "rc.loading":       { de:"Woche wird ausgewertet …", en:"Crunching your week …" },
  "rc.failed":        { de:"Die Woche konnte nicht geladen werden.",
                        en:"Your week could not be loaded." },
  "rc.range":         { de:(a,b)=>`${a} bis ${b}`, en:(a,b)=>`${a} to ${b}` },
  "rc.saved":         { de:"kcal eingespart",   en:"kcal saved" },
  "rc.overBudget":    { de:"kcal über dem Budget", en:"kcal over budget" },
  "rc.none":          { de:"Diese Woche war noch nichts erfasst — nächste Woche ist eine neue Gelegenheit.",
                        en:"Nothing was logged this week — next week is a fresh start." },
  "rc.perfect":       { de:"An jedem erfassten Tag im Budget geblieben. Stark.",
                        en:"Within budget on every day you logged. Strong." },
  "rc.some":          { de:(n,all)=>`An ${n} von ${all} erfassten Tagen im Budget geblieben.`,
                        en:(n,all)=>`Within budget on ${n} of ${all} logged days.` },
  "rc.inBudget":      { de:"Im Budget",         en:"In budget" },
  "rc.trainings":     { de:"Trainings",         en:"Workouts" },
  "rc.movement":      { de:"Bewegung",          en:"Movement" },
  "rc.ok":            { de:"Weiter geht's",     en:"Keep going" },

  /* ── Coach ── */
  "cc.greeting":      { de:"Hey, ich bin dein persönlicher Fitness- und Ernährungscoach. Wie kann ich dir heute beim Erreichen deiner Ziele behilflich sein?",
                        en:"Hey, I'm your personal fitness and nutrition coach. How can I help you reach your goals today?" },
  "cc.locked":        { de:"Der Coach ist Teil von Premium und Ultra+.",
                        en:"The coach is part of Premium and Ultra+." },
  "cc.loading":       { de:"Verlauf wird geladen …", en:"Loading your chat …" },
  "cc.ph":            { de:"Deine Frage",       en:"Your question" },
  "cc.note":          { de:"Dein Coach ist eine KI. Antworten können Fehler enthalten und ersetzen keine ärztliche Beratung.",
                        en:"Your coach is an AI. Answers can be wrong and are no substitute for medical advice." },

  /* ── Essensvorschlag ── */
  "sg.title":         { de:"Vorschlag",         en:"Suggestion" },
  "sg.loading":       { de:"Passende Optionen werden gesucht …", en:"Looking for options that fit …" },
  "sg.failed":        { de:"Der Vorschlag hat nicht geklappt.", en:"The suggestion didn't work out." },
  "sg.left":          { de:"Noch verfügbar",    en:"Still available" },
  "sg.item":          { de:"Vorschlag",         en:"Suggestion" },
  "sg.macros":        { de:(pr,ch,fa)=>`E ${pr} g · K ${ch} g · F ${fa} g`,
                        en:(pr,ch,fa)=>`P ${pr} g · C ${ch} g · F ${fa} g` },
  "sg.logged":        { de:n=>`${n} kcal eingetragen`, en:n=>`${n} kcal logged` },

  /* ── Tageswechsel ── */
  "cal.title":        { de:"Tag wählen",        en:"Pick a day" },
  "cal.loading":      { de:"Kalender wird geladen …", en:"Loading the calendar …" },
  "cal.failed":       { de:"Die Tage konnten nicht geladen werden.", en:"The days could not be loaded." },
  "cal.prev":         { de:"Vorheriger Monat",  en:"Previous month" },
  "cal.next":         { de:"Nächster Monat",    en:"Next month" },
  "cal.wd":           { de:["Mo","Di","Mi","Do","Fr","Sa","So"],
                        en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
  "cal.hint":         { de:"Ein Punkt markiert Tage mit Einträgen.",
                        en:"A dot marks days with entries." },

  /* ── Zusammensetzung ── */
  "bd.title":         { de:"Zusammensetzung",   en:"How it adds up" },
  "bd.bmr":           { de:"Grundumsatz in Ruhe", en:"Resting metabolic rate" },
  "bd.life":          { de:"Alltag",            en:"Everyday life" },
  "bd.tdee":          { de:"Grundbedarf",       en:"Maintenance" },
  "bd.goal":          { de:"Ziel",              en:"Goal" },
  "bd.target":        { de:"Tagesziel",         en:"Daily target" },
  "bd.train":         { de:"Training",          en:"Workouts" },
  "bd.eaten":         { de:"Gegessen",          en:"Eaten" },
  "bd.over":          { de:"Über dem Budget",   en:"Over budget" },
  "bd.left":          { de:"Noch verfügbar",    en:"Still available" },
  "bd.hint":          { de:"Grundumsatz nach Mifflin-St Jeor aus Gewicht, Größe, Alter und Geschlecht.",
                        en:"Basal rate per Mifflin-St Jeor from weight, height, age and sex." },

  /* ── Eintrag bearbeiten ── */
  "en.edit":          { de:"Bearbeiten",        en:"Edit" },
  "en.del":           { de:"Löschen",           en:"Delete" },
  "en.deleted":       { de:"Eintrag gelöscht",  en:"Entry deleted" },
  "ee.title":         { de:"Bearbeiten",        en:"Edit entry" },
  "ee.time":          { de:"Uhrzeit",           en:"Time" },
  "ee.detail":        { de:"Zusatz",            en:"Detail" },
  "ee.detailPh":      { de:"z. B. 150 g",       en:"e.g. 150 g" },
  "ee.errKcal":       { de:"Bitte eine gültige Kalorienzahl eintragen.",
                        en:"Please enter a valid calorie figure." },
  "ee.saveFailed":    { de:"Speichern fehlgeschlagen.", en:"Saving failed." },
  "ee.saved":         { de:"Eintrag aktualisiert", en:"Entry updated" },

  /* ── Foto & Analyse ── */
  "ph.title":         { de:"Meal erfassen",     en:"Log a meal" },
  "ph.alt":           { de:"Aufgenommene Mahlzeit", en:"Photographed meal" },
  "ph.swap":          { de:"Ändern",            en:"Change" },
  "ph.drop":          { de:"Foto aufnehmen oder hochladen", en:"Take or upload a photo" },
  "ph.dropSub":       { de:"Tippen zum Auswählen — oder einfach unten beschreiben, was du gegessen hast.",
                        en:"Tap to choose — or simply describe below what you ate." },
  "ph.extra":         { de:"Zusatz-Info (optional)", en:"Extra info (optional)" },
  "ph.desc":          { de:"Beschreibung",      en:"Description" },
  "ph.extraPh":       { de:"z. B. nur die halbe Portion, dazu noch ein Ei",
                        en:"e.g. only half a portion, plus an egg" },
  "ph.descPh":        { de:"z. B. zwei Scheiben Vollkornbrot mit Käse, dazu ein Apfel",
                        en:"e.g. two slices of wholegrain bread with cheese and an apple" },
  "ph.go":            { de:"Analysieren",       en:"Analyse" },
  "ph.readFailed":    { de:"Das Bild konnte nicht gelesen werden.", en:"That image could not be read." },
  "ph.busyImg":       { de:"Claude schaut sich dein Essen an …", en:"Claude is looking at your food …" },
  "ph.busyTxt":       { de:"Claude rechnet deine Beschreibung durch …",
                        en:"Claude is working through your description …" },
  "ph.failed":        { de:"Die Analyse hat nicht geklappt.", en:"The analysis didn't work out." },
  "ph.result":        { de:"Erkannt",           en:"Recognised" },
  "ph.meal":          { de:"Mahlzeit",          en:"Meal" },
  "ph.total":         { de:"Gesamt",            en:"Total" },
  "ph.fixAria":       { de:"Kalorien anpassen", en:"Adjust calories" },
  "ph.fixHint":       { de:"Zahl antippen, um sie zu korrigieren.", en:"Tap the number to correct it." },
  "ph.retry":         { de:"Nochmal anpassen",  en:"Adjust and retry" },
  "ph.viaPhoto":      { de:"per Foto erfasst",  en:"logged from a photo" },
  "ph.viaText":       { de:"per Beschreibung",  en:"logged from a description" },
  "conf.hoch":        { de:"Klar erkannt",      en:"Clearly recognised" },
  "conf.mittel":      { de:"Portion geschätzt", en:"Portion estimated" },
  "conf.niedrig":     { de:"Grobe Schätzung",   en:"Rough estimate" },

  /* ── Mahlzeit von Hand ── */
  "mn.title":         { de:"Meal eintragen",    en:"Log a meal" },
  "tab.fav":          { de:"Favoriten",         en:"Favourites" },
  "tab.all":          { de:"Alle",              en:"All" },
  "tab.free":         { de:"Frei",              en:"Free" },
  "tab.noFav":        { de:"Keine Favoriten gewählt.", en:"No favourites picked." },
  "mn.search":        { de:"Lebensmittel suchen", en:"Search foods" },
  "mn.namePh":        { de:"z. B. McNuggets",   en:"e.g. chicken nuggets" },
  "mn.kcalPh":        { de:"650",               en:"650" },
  "mn.macrosOpt":     { de:"Makros in Gramm (optional)", en:"Macros in grams (optional)" },
  "mn.errKcal":       { de:"Bitte eine Kalorienzahl eintragen.", en:"Please enter a calorie figure." },
  "mn.manualTag":     { de:"manuell",           en:"manual" },
  "pt.grams":         { de:"Menge in Gramm",    en:"Amount in grams" },
  "pt.errGrams":      { de:"Bitte eine Menge eintragen.", en:"Please enter an amount." },

  /* ── Training ── */
  "tr.title":         { de:"Training erfassen", en:"Log a workout" },
  "tr.namePh":        { de:"z. B. Fußballtraining", en:"e.g. football practice" },
  "tr.kcalPh":        { de:"420",               en:"420" },
  "tr.fallbackName":  { de:"Training",          en:"Workout" },
  "tr.credited":      { de:n=>`+${n} kcal gutgeschrieben`, en:n=>`+${n} kcal credited` },
  "tr.minutes":       { de:"Dauer in Minuten",  en:"Duration in minutes" },
  "tr.errMin":        { de:"Bitte eine Dauer eintragen.", en:"Please enter a duration." },
  "tr.min":           { de:m=>`${m} min`,       en:m=>`${m} min` }
};

/* ── Einstellungen ── */
Object.assign(STRINGS, {
  "st.title":         { de:"Einstellungen",     en:"Settings" },
  "st.lang":          { de:"Sprache",           en:"Language" },
  "st.langHint":      { de:"Gilt für die gesamte App — auch für Coach, Vorschläge und Fotoanalyse.",
                        en:"Applies to the whole app — including coach, suggestions and photo analysis." },
  "st.tier":          { de:"Mitgliedschaft",    en:"Membership" },
  "st.coach":         { de:"Coach",             en:"Coach" },
  "st.body":          { de:"Körperdaten",       en:"Body data" },
  "st.life":          { de:"Alltag",            en:"Everyday life" },
  "st.goal":          { de:"Ziel",              en:"Goal" },
  "st.macros":        { de:"Makroziele",        en:"Macro targets" },
  "st.mmAuto":        { de:"Automatisch",       en:"Automatic" },
  "st.mmCustom":      { de:"Eigene Werte",      en:"Your own values" },
  "st.diet":          { de:"Ernährungsform",    en:"Way of eating" },
  "st.favActs":       { de:"Lieblings-Aktivitäten", en:"Favourite activities" },
  "st.favFoods":      { de:"Lieblings-Lebensmittel", en:"Favourite foods" },
  "st.dislikes":      { de:"Mag ich nicht",     en:"Don't like" },
  "st.ownFoods":      { de:"Eigene Lebensmittel", en:"Your own foods" },
  "st.ownFoodAdd":    { de:"Lebensmittel anlegen", en:"Add a food" },
  "st.ownActs":       { de:"Eigene Trainings",  en:"Your own workouts" },
  "st.ownActAdd":     { de:"Training anlegen",  en:"Add a workout" },
  "st.avoid":         { de:"Unverträglichkeiten", en:"Intolerances" },
  "st.avoidPh":       { de:"z. B. Laktose",     en:"e.g. lactose" },
  "st.avoidAdd":      { de:"Hinzufügen",        en:"Add" },
  "st.avoidHint":     { de:"Wird bei Vorschlägen berücksichtigt.",
                        en:"Taken into account for suggestions." },
  "st.avoidNone":     { de:"Nichts eingetragen.", en:"Nothing added." },
  "st.legal":         { de:"Rechtliches",       en:"Legal" },
  "st.account":       { de:"Konto",             en:"Account" },
  "st.delAccount":    { de:"Konto und alle Daten löschen", en:"Delete account and all data" },
  "st.signOut":       { de:"Abmelden",          en:"Sign out" },
  "st.saved":         { de:"Einstellungen gespeichert", en:"Settings saved" },
  "st.preview":       { de:(target,tdee)=>`Neues Tagesbudget: <b>${target} kcal</b> · Grundbedarf ${tdee} kcal`,
                        en:(target,tdee)=>`New daily budget: <b>${target} kcal</b> · maintenance ${tdee} kcal` },
  "st.previewFloor":  { de:n=>`<br><b style="color:var(--warn)">Untergrenze von ${n} kcal greift – ein größerer Abzug wird nicht übernommen.</b>`,
                        en:n=>`<br><b style="color:var(--warn)">The ${n} kcal floor applies — a bigger deduction is not used.</b>` },
  "st.errWeight":     { de:"Gewicht zwischen 30 und 300 kg eintragen.",
                        en:"Enter a weight between 30 and 300 kg." },
  "st.errHeight":     { de:"Größe zwischen 120 und 230 cm eintragen.",
                        en:"Enter a height between 120 and 230 cm." },
  "st.errAge":        { de:"Alter zwischen 14 und 100 Jahren eintragen.",
                        en:"Enter an age between 14 and 100." },
  "st.errLsk":        { de:"Zuschlag zwischen 0 und 3000 kcal eintragen.",
                        en:"Enter an allowance between 0 and 3000 kcal." },
  "st.errGk":         { de:"Abweichung zwischen -1500 und +1500 kcal eintragen.",
                        en:"Enter a difference between -1500 and +1500 kcal." },
  "st.saveFailed":    { de:"Speichern fehlgeschlagen.", en:"Saving failed." },

  "pk.none":          { de:"Noch nichts ausgewählt.", en:"Nothing picked yet." },
  "pk.close":         { de:"Liste schließen",   en:"Close list" },
  "pk.open":          { de:"Alle anzeigen",     en:"Show all" },
  "pk.count":         { de:(n,all)=>`${n} von ${all}`, en:(n,all)=>`${n} of ${all}` },
  "mg.label":         { de:n=>`${n} (g)`,       en:n=>`${n} (g)` },
  "mg.auto":          { de:g=>`Aus Gewicht und Ziel berechnet: ${g} g Eiweiß je kg, 27 % der Kalorien aus Fett, Rest Kohlenhydrate.`,
                        en:g=>`Calculated from weight and goal: ${g} g of protein per kg, 27 % of calories from fat, the rest carbs.` },
  "mg.custom":        { de:(kcal,target)=>`Ergibt ${kcal} kcal — dein Tagesziel liegt bei ${target} kcal.`,
                        en:(kcal,target)=>`Adds up to ${kcal} kcal — your daily target is ${target} kcal.` },
  "own.noFoods":      { de:"Noch keine eigenen Lebensmittel.", en:"No custom foods yet." },
  "own.noActs":       { de:"Noch keine eigenen Trainings.", en:"No custom workouts yet." },

  "cc.clear":         { de:"Chatverlauf löschen", en:"Delete chat history" },
  "cc.clearHint":     { de:"Der Coach startet danach wieder mit der Begrüßung.",
                        en:"The coach starts over with its greeting afterwards." },
  "cc.count":         { de:n=>`${n} Fragen`,    en:n=>`${n} questions` },
  "cc.empty":         { de:"leer",              en:"empty" },
  "cc.confirm":       { de:"Wirklich löschen?", en:"Really delete?" },
  "cc.confirmHint":   { de:"tippen zum Bestätigen", en:"tap to confirm" },
  "cc.cleared":       { de:"Chatverlauf gelöscht", en:"Chat history deleted" },

  /* ── Konto löschen ── */
  "da.title":         { de:"Konto löschen",     en:"Delete account" },
  "da.word":          { de:"LÖSCHEN",           en:"DELETE" },
  "da.intro":         { de:"Damit werden dein Konto und alle gespeicherten Daten endgültig entfernt: Körperdaten und Ziele, sämtliche erfassten Mahlzeiten und Trainings, eigene Lebensmittel und Trainings sowie der Coach-Verlauf. Das lässt sich nicht rückgängig machen.",
                        en:"This permanently removes your account and everything stored with it: body data and goals, every meal and workout you logged, your own foods and workouts, and the coach history. It cannot be undone." },
  "da.reauth":        { de:"Aus Sicherheitsgründen musst du dich dafür erneut anmelden.",
                        en:"For security reasons you need to sign in again first." },
  "da.google":        { de:"Mit Google bestätigen", en:"Confirm with Google" },
  "da.pass":          { de:"Dein Passwort",     en:"Your password" },
  "da.type":          { de:w=>`Tippe <b>${w}</b>, um zu bestätigen`,
                        en:w=>`Type <b>${w}</b> to confirm` },
  "da.go":            { de:"Endgültig löschen", en:"Delete permanently" },
  "da.reauthFailed":  { de:"Die Bestätigung hat nicht geklappt.", en:"That confirmation didn't work." },
  "da.needPass":      { de:"Bitte dein Passwort eingeben.", en:"Please enter your password." },
  "da.wrongPass":     { de:"Das Passwort stimmt nicht.", en:"That password is not correct." },
  "da.failed":        { de:"Löschen fehlgeschlagen. Versuch es später erneut.",
                        en:"Deleting failed. Please try again later." },
  "da.done":          { de:"Konto gelöscht",    en:"Account deleted" },

  /* ── Eigene Einträge ── */
  "oa.title":         { de:"Eigenes Training",  en:"Your own workout" },
  "oa.namePh":        { de:"z. B. Bouldern in der Halle", en:"e.g. indoor bouldering" },
  "oa.kcal":          { de:"Kalorien pro Stunde", en:"Calories per hour" },
  "oa.kcalPh":        { de:"600",               en:"600" },
  "oa.note":          { de:n=>`Ergibt ${n} kcal für 30 Minuten.`, en:n=>`That is ${n} kcal for 30 minutes.` },
  "oa.noteEmpty":     { de:"Dieser Wert gilt unabhängig vom Körpergewicht — er kommt direkt von dir.",
                        en:"This figure is independent of body weight — it comes straight from you." },
  "oa.errName":       { de:"Bitte eine Bezeichnung eintragen.", en:"Please enter a name." },
  "oa.errKcal":       { de:"Kalorien zwischen 1 und 2000 pro Stunde eintragen.",
                        en:"Enter between 1 and 2000 calories per hour." },

  "of.title":         { de:"Eigenes Lebensmittel", en:"Your own food" },
  "of.namePh":        { de:"z. B. Proteinbrot vom Bäcker", en:"e.g. protein bread from the bakery" },
  "of.kcal":          { de:"Kalorien je 100 g", en:"Calories per 100 g" },
  "of.kcalPh":        { de:"230",               en:"230" },
  "of.macros":        { de:"Makros je 100 g",   en:"Macros per 100 g" },
  "of.portion":       { de:"Übliche Portion (g)", en:"Typical portion (g)" },
  "of.note":          { de:n=>`Aus den Makros ergeben sich ${n} kcal.`,
                        en:n=>`The macros add up to ${n} kcal.` },
  "of.noteOff":       { de:` <b style="color:var(--warn)">Das weicht deutlich von deiner Kalorienangabe ab.</b>`,
                        en:` <b style="color:var(--warn)">That is well off the calorie figure you entered.</b>` },
  "of.noteEmpty":     { de:"Alkohol zählt nicht zu den Makros — dort darf die Rechnung abweichen.",
                        en:"Alcohol is not a macro — there the numbers may differ." },
  "of.errName":       { de:"Bitte eine Bezeichnung eintragen.", en:"Please enter a name." },
  "of.errKcal":       { de:"Kalorien zwischen 1 und 900 je 100 g eintragen.",
                        en:"Enter between 1 and 900 calories per 100 g." },
  "macro.prShort":    { de:"Eiweiß",            en:"Protein" },
  "macro.chShort":    { de:"Kohlenhydr.",       en:"Carbs" },
  "macro.faShort":    { de:"Fett",              en:"Fat" },

  /* ── Installations-Hinweis ── */
  "in.install":       { de:"Installieren",      en:"Install" },
  "in.title":         { de:"FITTEN.ME installieren", en:"Install FITTEN.ME" },
  "in.sub":           { de:"Als eigene App auf dem Startbildschirm.",
                        en:"As its own app on your home screen." },
  "in.iosTitle":      { de:"Auf den Homescreen legen", en:"Add to your home screen" },
  "in.iosSub":        { de:"Teilen-Symbol antippen, dann „Zum Home-Bildschirm“.",
                        en:"Tap the share icon, then “Add to Home Screen”." },

  /* ── Fehlertexte der API-Aufrufe ── */
  "api.noJson":       { de:(url,status,file)=>`${url} liefert kein JSON (HTTP ${status}). Liegt ${file} im Projekt-Root?`,
                        en:(url,status,file)=>`${url} did not return JSON (HTTP ${status}). Is ${file} in the project root?` }
});

/* ─────────────  RECHTLICHES  ─────────────
   Maßgeblich ist die deutsche Fassung — die englische ist eine Übersetzung
   zur Information. Inhalte werden mit dem Stand aus app.js aufgerufen. */

export const LEGAL_TEXT = {
  de: updated => ({
    imprint: { t:"Impressum", body:`
<h4>Angaben gemäß § 5 DDG</h4>
<p>Jan-Niklas Rentzsch<br>Bahndamm 7<br>23617 Stockelsdorf<br>Deutschland</p>
<h4>Kontakt</h4>
<p>E-Mail: info@laerby.com<br>Telefon: 0151 25380111</p>
<h4>Umsatzsteuer</h4>
<p>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet, da Kleinunternehmerregelung.</p>
<h4>Verantwortlich für den Inhalt</h4>
<p>Jan-Niklas Rentzsch, Anschrift wie oben.</p>
<h4>Streitbeilegung</h4>
<p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.</p>
<h4>Stand</h4>
<p>${updated}</p>` },

    privacy: { t:"Datenschutz", body:`
<h4>Verantwortlicher</h4>
<p>Jan-Niklas Rentzsch<br>Bahndamm 7<br>23617 Stockelsdorf<br>Deutschland<br>
E-Mail: info@laerby.com<br>Telefon: 0151 25380111</p>
<h4>Welche Daten wir verarbeiten</h4>
<p>Zugangsdaten: E-Mail-Adresse und Kennung deines Kontos.<br>
Gesundheitsbezogene Daten: Gewicht, Größe, Alter, Geschlecht, Ziele, erfasste Mahlzeiten
und Trainings, Fotos von Mahlzeiten, Angaben zu Vorlieben und Unverträglichkeiten.<br>
Nutzungsdaten: Zeitpunkte deiner Einträge, Verlauf des Coach-Chats.</p>
<h4>Zwecke</h4>
<p>Die Daten dienen ausschließlich dazu, dir die Funktionen der App bereitzustellen:
Berechnung von Grundumsatz, Tagesbudget und Makrozielen, Auswertung deiner Einträge,
Schätzung von Kalorien aus Fotos und Beschreibungen sowie die Antworten des Coaches.
Eine Auswertung zu Werbezwecken findet nicht statt, ebenso wenig eine Weitergabe an Dritte
zu deren eigenen Zwecken.</p>
<h4>Rechtsgrundlage</h4>
<p>Gesundheitsbezogene Daten sind besondere Kategorien personenbezogener Daten nach
Art. 9 DSGVO. Wir verarbeiten sie ausschließlich auf Grundlage deiner ausdrücklichen
Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO, die du beim Einrichten erteilt hast und
jederzeit mit Wirkung für die Zukunft widerrufen kannst. Die Bereitstellung der App im
Übrigen stützt sich auf Art. 6 Abs. 1 lit. b DSGVO.</p>
<h4>Empfänger</h4>
<p>Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, sowie Google LLC,
USA, für Anmeldung und Datenbank (Firebase Authentication und Cloud Firestore).<br>
Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, für den Betrieb der Anwendung.<br>
Anthropic PBC, 548 Market St, PMB 90375, San Francisco, CA 94104, USA, für die Analyse von
Mahlzeitenfotos, die Essensvorschläge und den Coach.</p>
<p>Mit allen genannten Anbietern bestehen Verträge zur Auftragsverarbeitung nach Art. 28 DSGVO.</p>
<h4>Übermittlung in Drittländer</h4>
<p>Bei den genannten Diensten werden Daten in den Vereinigten Staaten verarbeitet. Grundlage
sind die Standardvertragsklauseln der EU-Kommission sowie, soweit der jeweilige Anbieter
zertifiziert ist, das EU-US Data Privacy Framework.</p>
<h4>Speicherdauer</h4>
<p>Deine Daten bleiben gespeichert, solange dein Konto besteht. Löschst du dein Konto in den
Einstellungen, werden Profil, alle erfassten Tage und der Coach-Verlauf entfernt. Den
Coach-Verlauf kannst du davon unabhängig jederzeit einzeln löschen.</p>
<h4>Deine Rechte</h4>
<p>Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch
(Art. 21 DSGVO). Eine erteilte Einwilligung kannst du jederzeit widerrufen, ohne dass die
Rechtmäßigkeit der bis dahin erfolgten Verarbeitung berührt wird. Wende dich dafür an die
oben genannte E-Mail-Adresse.</p>
<h4>Beschwerderecht</h4>
<p>Dir steht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu. Zuständig ist
das Unabhängige Landeszentrum für Datenschutz Schleswig-Holstein, Holstenstraße 98,
24103 Kiel.</p>
<h4>Stand</h4>
<p>${updated}</p>` },

    health: { t:"Gesundheitshinweis", body:`
<h4>Keine medizinische Beratung</h4>
<p>FITTEN.ME ist eine App für Fitness und Wohlbefinden. Die angezeigten Kalorien- und
Makroziele, die Auswertungen und die Antworten des Coaches sind allgemeine Orientierung
und ersetzen weder ärztlichen Rat noch eine Diagnose oder Behandlung.</p>
<h4>Schätzwerte</h4>
<p>Der Grundumsatz wird nach der Formel von Mifflin und St Jeor berechnet. Sie liefert einen
statistischen Durchschnitt, dein tatsächlicher Bedarf kann deutlich abweichen. Kalorien aus
Fotos und Textbeschreibungen sind Schätzungen und können sich irren. Prüfe Werte, auf die
es dir ankommt, selbst nach.</p>
<h4>Wann du ärztlichen Rat einholen solltest</h4>
<p>Sprich vor einer Ernährungsumstellung oder einem neuen Trainingsplan mit einer Ärztin oder
einem Arzt, wenn du Vorerkrankungen hast, Medikamente nimmst, schwanger bist oder stillst,
unter 18 Jahre alt bist oder gesundheitliche Beschwerden auftreten.</p>
<h4>Wenn Essen belastend wird</h4>
<p>Wenn dich das Zählen von Kalorien belastet oder dein Essverhalten dich beunruhigt, hol dir
Unterstützung. Die Telefonberatung der Bundeszentrale für gesundheitliche Aufklärung zu
Essstörungen ist unter 0221 892031 erreichbar.</p>` },

    ai: { t:"KI-Hinweis", body:`
<h4>Du sprichst mit einer KI</h4>
<p>Der Coach, die Fotoanalyse und die Essensvorschläge werden von einem KI-Sprachmodell
erzeugt. Es steht kein Mensch dahinter, der deine Nachrichten liest und beantwortet.</p>
<h4>Welches System eingesetzt wird</h4>
<p>Zum Einsatz kommen Modelle der Reihe Claude von Anthropic PBC. Welches Modell verwendet
wird, hängt von deiner gewählten Mitgliedschaft ab.</p>
<h4>Was dabei übermittelt wird</h4>
<p>Für eine passende Antwort werden deine Angaben aus der App übermittelt: Körperdaten,
Ziele, Tagesbudget, erfasste Mahlzeiten und Trainings, Vorlieben und Unverträglichkeiten.
Bei der Fotoanalyse zusätzlich das aufgenommene Bild.</p>
<h4>Grenzen</h4>
<p>KI-Antworten können falsch oder unvollständig sein, auch wenn sie überzeugend klingen.
Sie sind keine medizinische Beratung. Verlass dich bei gesundheitlich wichtigen
Entscheidungen nicht allein darauf.</p>` }
  }),

  en: updated => ({
    imprint: { t:"Legal notice", body:`
<h4>Information pursuant to § 5 DDG (Germany)</h4>
<p>Jan-Niklas Rentzsch<br>Bahndamm 7<br>23617 Stockelsdorf<br>Germany</p>
<h4>Contact</h4>
<p>Email: info@laerby.com<br>Phone: +49 151 25380111</p>
<h4>VAT</h4>
<p>No VAT is charged under the small business rule of § 19 UStG.</p>
<h4>Responsible for the content</h4>
<p>Jan-Niklas Rentzsch, address as above.</p>
<h4>Dispute resolution</h4>
<p>We are neither willing nor obliged to take part in dispute resolution proceedings before a
consumer arbitration board.</p>
<h4>Last updated</h4>
<p>${updated}</p>
<p><i>This is a translation for your convenience. The German version is the legally
binding one.</i></p>` },

    privacy: { t:"Privacy", body:`
<h4>Controller</h4>
<p>Jan-Niklas Rentzsch<br>Bahndamm 7<br>23617 Stockelsdorf<br>Germany<br>
Email: info@laerby.com<br>Phone: +49 151 25380111</p>
<h4>What data we process</h4>
<p>Account data: your email address and account identifier.<br>
Health-related data: weight, height, age, sex, goals, the meals and workouts you log, photos
of meals, and your preferences and intolerances.<br>
Usage data: the times of your entries and your coach chat history.</p>
<h4>Purposes</h4>
<p>The data is used solely to provide the app's features: calculating your basal rate, daily
budget and macro targets, evaluating your entries, estimating calories from photos and
descriptions, and generating the coach's answers. It is not analysed for advertising, and it
is not passed on to third parties for their own purposes.</p>
<h4>Legal basis</h4>
<p>Health-related data is a special category of personal data under Art. 9 GDPR. We process it
solely on the basis of your explicit consent under Art. 9(2)(a) GDPR, which you gave during
setup and can withdraw at any time with effect for the future. Providing the rest of the app
is based on Art. 6(1)(b) GDPR.</p>
<h4>Recipients</h4>
<p>Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland, and Google LLC, USA,
for sign-in and the database (Firebase Authentication and Cloud Firestore).<br>
Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, for hosting the application.<br>
Anthropic PBC, 548 Market St, PMB 90375, San Francisco, CA 94104, USA, for meal photo
analysis, food suggestions and the coach.</p>
<p>Data processing agreements under Art. 28 GDPR are in place with all of these providers.</p>
<h4>Transfers to third countries</h4>
<p>With the services named above, data is processed in the United States. This is based on the
European Commission's standard contractual clauses and, where the provider is certified, on
the EU-US Data Privacy Framework.</p>
<h4>Retention</h4>
<p>Your data is stored for as long as your account exists. If you delete your account in the
settings, your profile, all logged days and the coach history are removed. You can delete the
coach history separately at any time.</p>
<h4>Your rights</h4>
<p>You have the right of access (Art. 15), rectification (Art. 16), erasure (Art. 17),
restriction of processing (Art. 18), data portability (Art. 20) and objection (Art. 21 GDPR).
You may withdraw consent at any time without affecting the lawfulness of processing carried
out beforehand. Please use the email address above.</p>
<h4>Right to complain</h4>
<p>You have the right to lodge a complaint with a data protection supervisory authority. The
competent authority is the Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein,
Holstenstraße 98, 24103 Kiel, Germany.</p>
<h4>Last updated</h4>
<p>${updated}</p>
<p><i>This is a translation for your convenience. The German version is the legally
binding one.</i></p>` },

    health: { t:"Health notice", body:`
<h4>Not medical advice</h4>
<p>FITTEN.ME is an app for fitness and wellbeing. The calorie and macro targets it shows, its
evaluations and the coach's answers are general orientation. They are no substitute for
medical advice, diagnosis or treatment.</p>
<h4>Estimates</h4>
<p>Your basal metabolic rate is calculated with the Mifflin-St Jeor formula. It gives a
statistical average, and your actual needs can differ considerably. Calories from photos and
text descriptions are estimates and can be wrong. Double-check any figure that matters to you.</p>
<h4>When to see a doctor</h4>
<p>Talk to a doctor before changing your diet or starting a new training plan if you have
pre-existing conditions, take medication, are pregnant or breastfeeding, are under 18, or if
health problems occur.</p>
<h4>When eating becomes a burden</h4>
<p>If counting calories weighs on you or your eating behaviour worries you, please get support.
In Germany, the eating disorder helpline of the Federal Centre for Health Education can be
reached on 0221 892031; elsewhere, contact your doctor or a local helpline.</p>` },

    ai: { t:"AI notice", body:`
<h4>You are talking to an AI</h4>
<p>The coach, the photo analysis and the food suggestions are produced by an AI language model.
There is no person behind them reading and answering your messages.</p>
<h4>Which system is used</h4>
<p>The app uses models from the Claude family by Anthropic PBC. Which model is used depends on
the membership you chose.</p>
<h4>What gets transmitted</h4>
<p>To give a useful answer, your data from the app is transmitted: body data, goals, daily
budget, logged meals and workouts, preferences and intolerances. For photo analysis, the
photo you took is sent as well.</p>
<h4>Limits</h4>
<p>AI answers can be wrong or incomplete, even when they sound convincing. They are not medical
advice. Do not rely on them alone for decisions that matter to your health.</p>` }
  })
};
