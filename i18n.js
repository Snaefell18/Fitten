/* ══════════════════════════════════════════════════════════════════
   FITTEN.ME — Sprachen / Languages
   Eine Zeile je Text: { de: …, en: … }. Braucht ein Text Werte aus der
   App, steht statt der Zeichenkette eine Funktion.
   Neue Sprache: LANGS und LOCALE ergänzen, in jedem Eintrag den Schlüssel
   nachziehen — fehlt einer, greift automatisch Deutsch.
   ══════════════════════════════════════════════════════════════════ */

export const LANGS = [
  { id:"de", n:"Deutsch" },
  { id:"en", n:"English" },
  { id:"zh", n:"中文" }
];

export const LOCALE = { de:"de-DE", en:"en-GB", zh:"zh-CN" };

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
  },

  zh: {
    group: {
      "Draußen":"户外", "Gym":"健身房", "Sportarten":"球类与运动", "Ruhig":"低强度",
      "Protein":"蛋白质", "Sättigung":"主食", "Fast Food":"快餐",
      "Obst & Gemüse":"水果与蔬菜", "Milch & Fett":"乳制品与油脂",
      "Snacks":"零食", "Getränke":"饮品", "Eigene":"自定义"
    },
    act: {
      walk:"户外步行", walk_fast:"快走", hike:"徒步",
      jog:"慢跑（8 公里/小时）", run:"跑步（11 公里/小时）", bike:"骑车（轻松）",
      bike_fast:"骑车（快速）", mtb:"山地车", skate:"轮滑",
      ski:"滑雪", garden:"园艺",
      weights:"力量训练", machines:"器械（中等强度）", hiit:"HIIT / 功能性训练",
      cross:"椭圆机", row:"划船机", spin:"动感单车", stepper:"踏步机",
      rope:"跳绳", stairs:"爬楼梯",
      swim:"游泳", football:"足球", basket:"篮球", tennis:"网球",
      badminton:"羽毛球", volley:"排球", box:"拳击", climb:"攀岩",
      dance:"跳舞",
      yoga:"瑜伽", pilates:"普拉提", stretch:"灵活性 / 拉伸"
    },
    food: {
      skyr:"原味冰岛酸奶", quark:"低脂夸克奶酪", chicken:"鸡胸肉",
      beef:"牛肉馅（20 % 脂肪）", salmon:"三文鱼", tuna:"金枪鱼（水浸）", egg:"鸡蛋",
      whey:"乳清蛋白奶昔", tofu:"豆腐",
      pasta:"意面（熟）", rice:"米饭（熟）", potato:"土豆",
      sweetpot:"红薯", oats:"燕麦片", bread:"全麦面包", toast:"吐司面包",
      couscous:"库斯库斯（熟）", beans:"红腰豆",
      nuggets:"鸡块", bigmac:"巨无霸", cheeseb:"芝士汉堡", fries:"薯条",
      pizza:"玛格丽特披萨", doener:"土耳其烤肉卷", curry:"咖喱香肠", sushi:"寿司",
      banana:"香蕉", apple:"苹果", berries:"浆果", avocado:"牛油果",
      broccoli:"西兰花", tomato:"番茄", cucumber:"黄瓜", carrot:"胡萝卜",
      salad:"生菜",
      milk:"牛奶（3.5 %）", yogurt:"原味酸奶", gouda:"高达奶酪", cream:"奶油奶酪",
      butter:"黄油", oil:"橄榄油",
      almonds:"杏仁", choco:"巧克力", chips:"薯片", haribo:"软糖",
      icecream:"冰淇淋", bar:"蛋白棒", popcorn:"爆米花",
      cola:"可乐", juice:"橙汁", schorle:"苹果气泡水", beer:"啤酒",
      wine:"葡萄酒", latte:"拿铁玛奇朵"
    },
    goal: {
      bulk:  ["增肌",     "小幅热量盈余，干净地长肌肉"],
      keep:  ["保持",     "维持体重，稳住状态"],
      cut1:  ["温和减重", "每周约 0.4 公斤，容易坚持"],
      cut2:  ["快速减重", "每周约 0.7 公斤，需要自律"],
      manual:["手动",     "自己设定缺口或盈余"]
    },
    diet: {
      all:  ["不限",     "没有任何限制"],
      pesc: ["鱼素",     "吃鱼，不吃肉"],
      veg:  ["素食",     "不吃肉，也不吃鱼"],
      vegan:["纯素",     "完全植物性"]
    },
    life: {
      low:   ["久坐为主", "办公室工作，走动很少"],
      mid:   ["轻度活跃", "日常有一些活动"],
      high:  ["活跃",     "经常站立走动，体力工作"],
      manual:["手动",     "自己设定附加热量"]
    },
    tier: {
      basis:  ["基础",    "记录，就这么简单"],
      premium:["Premium", "更准。更聪明。更快。"],
      ultra:  ["Ultra+",  "一切拉满。"]
    },
    macro: { pr:"蛋白质", ch:"碳水", fa:"脂肪" }
  }
};

/* ─────────────  OBERFLÄCHE  ─────────────
   Ein Eintrag je Text. Funktionen bekommen die Werte in der Reihenfolge,
   in der sie in app.js übergeben werden. */

export const STRINGS = {

  /* ── Rahmen ── */
  "app.title":        { de:"FITTEN.ME — Kalorien & Training", en:"FITTEN.ME — Calories & Training", zh:"FITTEN.ME — 热量与训练" },
  "app.tagline":      { de:"Kalorien, Training und Fortschritt an einem Ort.",
                        en:"Calories, training and progress in one place.", zh:"热量、训练与进步，尽在一处。" },
  "a.close":          { de:"Schließen",         en:"Close", zh:"关闭" },
  "a.dismiss":        { de:"Hinweis ausblenden",en:"Dismiss notice", zh:"关闭提示" },
  "a.remove":         { de:"Entfernen",         en:"Remove", zh:"移除" },
  "a.settings":       { de:"Einstellungen",     en:"Settings", zh:"设置" },
  "a.coach":          { de:"Coach öffnen",      en:"Open coach", zh:"打开教练" },
  "a.day":            { de:"Tag wechseln",      en:"Change day", zh:"切换日期" },
  "a.send":           { de:"Senden",            en:"Send", zh:"发送" },
  "btn.save":         { de:"Speichern",         en:"Save", zh:"保存" },
  "btn.back":         { de:"Zurück",            en:"Back", zh:"返回" },
  "btn.cancel":       { de:"Abbrechen",         en:"Cancel", zh:"取消" },
  "btn.next":         { de:"Weiter",            en:"Continue", zh:"继续" },
  "btn.add":          { de:"Eintragen",         en:"Log it", zh:"记录" },
  "btn.create":       { de:"Anlegen",           en:"Create", zh:"创建" },
  "err.unknown":      { de:"Unbekannter Fehler",en:"Unknown error", zh:"未知错误" },

  /* ── Login ── */
  "li.mail":          { de:"E-Mail",            en:"Email", zh:"邮箱" },
  "li.mailPh":        { de:"du@beispiel.de",    en:"you@example.com", zh:"you@example.com" },
  "li.pass":          { de:"Passwort",          en:"Password", zh:"密码" },
  "li.passPh":        { de:"Mindestens 6 Zeichen", en:"At least 6 characters", zh:"至少 6 个字符" },
  "li.in":            { de:"Anmelden",          en:"Sign in", zh:"登录" },
  "li.up":            { de:"Konto erstellen",   en:"Create account", zh:"创建账户" },
  "li.toUp":          { de:"Noch kein Konto? Registrieren", en:"No account yet? Sign up", zh:"还没有账户？立即注册" },
  "li.toIn":          { de:"Schon dabei? Anmelden",         en:"Already have an account? Sign in", zh:"已有账户？直接登录" },
  "li.or":            { de:"ODER",              en:"OR", zh:"或" },
  "li.google":        { de:"Mit Google fortfahren", en:"Continue with Google", zh:"使用 Google 继续" },
  "li.needBoth":      { de:"Bitte E-Mail und Passwort eingeben.",
                        en:"Please enter your email and password.", zh:"请输入邮箱和密码。" },
  "li.failed":        { de:"Anmeldung fehlgeschlagen. Versuch es noch einmal.",
                        en:"Sign-in failed. Please try again.", zh:"登录失败，请再试一次。" },

  "auth/invalid-email":          { de:"Diese E-Mail-Adresse ist ungültig.",
                                   en:"That email address is not valid.", zh:"这个邮箱地址无效。" },
  "auth/invalid-credential":     { de:"E-Mail oder Passwort stimmen nicht.",
                                   en:"Email or password is incorrect.", zh:"邮箱或密码不正确。" },
  "auth/wrong-password":         { de:"E-Mail oder Passwort stimmen nicht.",
                                   en:"Email or password is incorrect.", zh:"邮箱或密码不正确。" },
  "auth/user-not-found":         { de:"Zu dieser E-Mail gibt es kein Konto.",
                                   en:"There is no account for that email.", zh:"这个邮箱还没有注册账户。" },
  "auth/email-already-in-use":   { de:"Für diese E-Mail existiert bereits ein Konto.",
                                   en:"An account with that email already exists.", zh:"这个邮箱已经注册过账户了。" },
  "auth/weak-password":          { de:"Das Passwort braucht mindestens 6 Zeichen.",
                                   en:"The password needs at least 6 characters.", zh:"密码至少需要 6 个字符。" },
  "auth/popup-closed-by-user":   { de:"Das Google-Fenster wurde geschlossen.",
                                   en:"The Google window was closed.", zh:"Google 窗口被关闭了。" },
  "auth/network-request-failed": { de:"Keine Verbindung. Prüfe dein Netz und versuch es erneut.",
                                   en:"No connection. Check your network and try again.", zh:"没有网络连接，请检查后重试。" },

  /* ── Onboarding ── */
  "ob.step":          { de:(n,all)=>`Schritt ${n} von ${all}`, en:(n,all)=>`Step ${n} of ${all}`, zh:(n,all)=>`第 ${n} 步 / 共 ${all} 步` },
  "ob.start":         { de:"Los geht's",        en:"Let's go", zh:"开始吧" },
  "ob.saveFailed":    { de:"Speichern fehlgeschlagen. Prüfe deine Verbindung.",
                        en:"Saving failed. Check your connection.", zh:"保存失败，请检查网络连接。" },

  "ob1.title":        { de:"Deine Eckdaten",    en:"Your basics", zh:"你的基本数据" },
  "ob1.sub":          { de:"Daraus berechnen wir deinen Grundumsatz nach Mifflin-St Jeor.",
                        en:"We use these to work out your basal metabolic rate (Mifflin-St Jeor).", zh:"我们用它按 Mifflin-St Jeor 公式计算你的基础代谢。" },
  "ob1.everyday":     { de:"Alltag ohne gezieltes Training", en:"Everyday life, without workouts", zh:"日常活动，不含专门训练" },
  "ob1.hint":         { de:"Trainingseinheiten trägst du später separat ein – sie erhöhen dein Tagesbudget zusätzlich.",
                        en:"You log workouts separately later — they add to your daily budget on top.", zh:"训练之后单独记录 —— 它会额外增加你当天的可用热量。" },
  "ob1.consent":      { de:`Ich willige ein, dass FITTEN.ME meine Gesundheitsdaten – Körperdaten,
                        Ziele, Mahlzeiten und Trainings – zur Berechnung meiner Werte verarbeitet und dafür
                        an die genannten Dienstleister übermittelt. Die Einwilligung kann ich jederzeit
                        widerrufen. Einzelheiten stehen unter
                        <u style="text-decoration:underline" id="f-privacy">Datenschutz</u>.`,
                        en:`I consent to FITTEN.ME processing my health data — body data, goals, meals and
                        workouts — to calculate my figures, and transferring it to the listed service
                        providers for that purpose. I can withdraw this consent at any time. Details are in the
                        <u style="text-decoration:underline" id="f-privacy">privacy policy</u>.`, zh:`我同意 FITTEN.ME 处理我的健康数据 —— 身体数据、目标、餐食和训练 ——
                   用于计算我的各项数值，并为此传输给文中列出的服务商。我可以随时撤回该同意。
                   详情见<u style="text-decoration:underline" id="f-privacy">隐私政策</u>。` },
  "ob1.errWeight":    { de:"Bitte ein Gewicht zwischen 30 und 300 kg eintragen.",
                        en:"Please enter a weight between 30 and 300 kg.", zh:"请填写 30 到 300 公斤之间的体重。" },
  "ob1.errHeight":    { de:"Bitte eine Größe zwischen 120 und 230 cm eintragen.",
                        en:"Please enter a height between 120 and 230 cm.", zh:"请填写 120 到 230 厘米之间的身高。" },
  "ob1.errAge":       { de:"Bitte ein Alter zwischen 14 und 100 Jahren eintragen.",
                        en:"Please enter an age between 14 and 100.", zh:"请填写 14 到 100 岁之间的年龄。" },
  "ob1.errConsent":   { de:"Bitte bestätige die Einwilligung zur Verarbeitung deiner Gesundheitsdaten.",
                        en:"Please confirm your consent to the processing of your health data.", zh:"请确认同意处理你的健康数据。" },
  "ob1.errLsk":       { de:"Bitte einen Zuschlag zwischen 0 und 3000 kcal eintragen.",
                        en:"Please enter an allowance between 0 and 3000 kcal.", zh:"请填写 0 到 3000 千卡之间的附加值。" },

  "ob2.title":        { de:"Dein Ziel",         en:"Your goal", zh:"你的目标" },
  "ob2.sub":          { de:"Bestimmt, wie dein Tagesbudget vom Grundbedarf abweicht.",
                        en:"Sets how far your daily budget sits from your maintenance calories.", zh:"决定你每天的热量预算与维持热量相差多少。" },
  "ob2.errGoal":      { de:"Bitte ein Ziel auswählen.", en:"Please pick a goal.", zh:"请选择一个目标。" },
  "ob2.errKcal":      { de:"Bitte einen Wert zwischen -1500 und +1500 kcal eintragen.",
                        en:"Please enter a value between -1500 and +1500 kcal.", zh:"请填写 -1500 到 +1500 千卡之间的数值。" },

  "ob3.title":        { de:"Was bewegst du gern?", en:"How do you like to move?", zh:"你喜欢怎么动？" },
  "ob3.sub":          { de:"Deine Favoriten stehen beim Eintragen ganz oben. Die Werte gelten für dein Gewicht.",
                        en:"Your favourites show up first when logging. The figures are based on your weight.", zh:"收藏的项目在记录时排在最前面。数值按你的体重计算。" },
  "ob3.err":          { de:"Wähle mindestens eine Aktivität.", en:"Pick at least one activity.", zh:"请至少选择一项活动。" },

  "ob4.title":        { de:"Wie isst du?",      en:"How do you eat?", zh:"你怎么吃？" },
  "ob4.sub":          { de:"Bestimmt, welche Lebensmittel dir überhaupt angeboten werden.",
                        en:"Decides which foods are offered to you at all.", zh:"决定哪些食物会推荐给你。" },
  "ob4.count":        { de:n=>`${n} Lebensmittel`, en:n=>`${n} foods`, zh:n=>`${n} 种食物` },
  "ob4.err":          { de:"Bitte eine Ernährungsform auswählen.", en:"Please pick a way of eating.", zh:"请选择一种饮食方式。" },

  "ob5.title":        { de:"Was isst du gern?", en:"What do you like to eat?", zh:"你喜欢吃什么？" },
  "ob5.sub":          { de:"Damit du Lieblingsgerichte mit einem Tipp erfassen kannst.",
                        en:"So you can log your favourites with a single tap.", zh:"这样你就能一键记录常吃的东西。" },
  "ob5.err":          { de:"Wähle mindestens ein Lebensmittel.", en:"Pick at least one food.", zh:"请至少选择一种食物。" },

  "ob6.title":        { de:"Magst du etwas gar nicht?", en:"Anything you don't like?", zh:"有什么完全不吃的吗？" },
  "ob6.sub":          { de:"Das Gewählte taucht beim Erfassen nicht mehr auf. Kannst du überspringen.",
                        en:"Anything you pick won't show up when logging. Feel free to skip.", zh:"选中的食物不会再出现在记录里。可以跳过。" },

  /* ── Felder, die mehrfach vorkommen ── */
  "f.weight":         { de:"Gewicht (kg)",      en:"Weight (kg)", zh:"体重（公斤）" },
  "f.height":         { de:"Größe (cm)",        en:"Height (cm)", zh:"身高（厘米）" },
  "f.age":            { de:"Alter",             en:"Age", zh:"年龄" },
  "f.sex":            { de:"Geschlecht",        en:"Sex", zh:"性别" },
  "f.male":           { de:"Männlich",          en:"Male", zh:"男" },
  "f.female":         { de:"Weiblich",          en:"Female", zh:"女" },
  "f.lsk":            { de:"Zuschlag zum Grundumsatz (kcal)", en:"Allowance on top of BMR (kcal)", zh:"基础代谢之外的附加值（千卡）" },
  "f.gk":             { de:"Abweichung vom Grundbedarf (kcal)", en:"Difference from maintenance (kcal)", zh:"与维持热量的差值（千卡）" },
  "f.gkNote":         { de:"Negativ ergibt ein Defizit, positiv einen Überschuss.",
                        en:"Negative gives a deficit, positive a surplus.", zh:"负数是热量缺口，正数是热量盈余。" },
  "f.floor":          { de:n=>`Untergrenze von ${n} kcal greift.`,
                        en:n=>`The ${n} kcal floor applies.`, zh:n=>`已触及 ${n} 千卡的下限。` },
  "f.name":           { de:"Bezeichnung",       en:"Name", zh:"名称" },
  "f.kcal":           { de:"Kalorien",          en:"Calories", zh:"热量" },
  "f.kcalBurned":     { de:"Verbrannte Kalorien", en:"Calories burned", zh:"消耗的热量" },
  "f.macrosG":        { de:"Makros in Gramm",   en:"Macros in grams", zh:"三大营养素（克）" },
  "unit.kcalPer100":  { de:"kcal / 100 g",      en:"kcal / 100 g", zh:"kcal / 100 克" },
  "unit.kcalH":       { de:"kcal/h",            en:"kcal/h", zh:"kcal/小时" },
  "unit.kcalPerHour": { de:"kcal pro Stunde",   en:"kcal per hour", zh:"kcal / 小时" },
  "hint.tdee":        { de:(tdee,bmr)=>`Grundbedarf inkl. Alltag: <b>${tdee} kcal</b> · Grundumsatz in Ruhe: <b>${bmr} kcal</b>`,
                        en:(tdee,bmr)=>`Maintenance incl. everyday life: <b>${tdee} kcal</b> · Resting metabolic rate: <b>${bmr} kcal</b>`, zh:(tdee,bmr)=>`含日常活动的维持热量：<b>${tdee} kcal</b> · 静息基础代谢：<b>${bmr} kcal</b>` },

  /* ── Home ── */
  "h.available":      { de:"kcal verfügbar",    en:"kcal available", zh:"kcal 可用" },
  "h.over":           { de:"kcal über dem Budget", en:"kcal over budget", zh:"kcal 超出预算" },
  "h.eaten":          { de:n=>`${n} gegessen`,  en:n=>`${n} eaten`, zh:n=>`已摄入 ${n}` },
  "h.moved":          { de:n=>` · +${n} Bewegung`, en:n=>` · +${n} from movement`, zh:n=>` · 运动 +${n}` },
  "h.budget":         { de:n=>`${n} Budget`,    en:n=>`${n} budget`, zh:n=>`预算 ${n}` },
  "h.logToday":       { de:"Heute erfasst",     en:"Logged today", zh:"今天的记录" },
  "h.log":            { de:"Erfasst",           en:"Logged", zh:"记录" },
  "h.logEmpty":       { de:"Noch nichts erfasst. Fang mit einer Mahlzeit oder einem Training an.",
                        en:"Nothing logged yet. Start with a meal or a workout.", zh:"还没有记录。从一餐或一次训练开始吧。" },
  "h.sugEyebrow":     { de:"Vorschlag",         en:"Suggestion", zh:"建议" },
  "h.sugQ":           { de:"Was könnte ich heute noch essen?", en:"What else could I eat today?", zh:"今天我还能吃点什么？" },
  "h.photo":          { de:"Meal erfassen",     en:"Log a meal", zh:"记录一餐" },
  "h.manual":         { de:"+ Meal",            en:"+ Meal", zh:"+ 餐食" },
  "h.train":          { de:"+ Training",        en:"+ Workout", zh:"+ 训练" },
  "h.offline":        { de:"Offline gespeichert – Sync folgt.",
                        en:"Saved offline — it will sync later.", zh:"已离线保存，稍后自动同步。" },

  /* ── Wochenrückblick ── */
  "rc.title":         { de:"Deine Woche",       en:"Your week", zh:"你的一周" },
  "rc.loading":       { de:"Woche wird ausgewertet …", en:"Crunching your week …", zh:"正在统计这一周 …" },
  "rc.failed":        { de:"Die Woche konnte nicht geladen werden.",
                        en:"Your week could not be loaded.", zh:"这一周的数据加载失败。" },
  "rc.range":         { de:(a,b)=>`${a} bis ${b}`, en:(a,b)=>`${a} to ${b}`, zh:(a,b)=>`${a} 至 ${b}` },
  "rc.saved":         { de:"kcal eingespart",   en:"kcal saved", zh:"kcal 已节省" },
  "rc.overBudget":    { de:"kcal über dem Budget", en:"kcal over budget", zh:"kcal 超出预算" },
  "rc.none":          { de:"Diese Woche war noch nichts erfasst — nächste Woche ist eine neue Gelegenheit.",
                        en:"Nothing was logged this week — next week is a fresh start.", zh:"这一周还没有任何记录 —— 下周是新的开始。" },
  "rc.perfect":       { de:"An jedem erfassten Tag im Budget geblieben. Stark.",
                        en:"Within budget on every day you logged. Strong.", zh:"每个记录的日子都在预算之内，很棒。" },
  "rc.some":          { de:(n,all)=>`An ${n} von ${all} erfassten Tagen im Budget geblieben.`,
                        en:(n,all)=>`Within budget on ${n} of ${all} logged days.`, zh:(n,all)=>`在 ${all} 个记录的日子中，有 ${n} 天保持在预算之内。` },
  "rc.inBudget":      { de:"Im Budget",         en:"In budget", zh:"在预算内" },
  "rc.trainings":     { de:"Trainings",         en:"Workouts", zh:"训练次数" },
  "rc.movement":      { de:"Bewegung",          en:"Movement", zh:"运动消耗" },
  "rc.ok":            { de:"Weiter geht's",     en:"Keep going", zh:"继续加油" },

  /* ── Coach ── */
  "cc.greeting":      { de:"Hey, ich bin dein persönlicher Fitness- und Ernährungscoach. Wie kann ich dir heute beim Erreichen deiner Ziele behilflich sein?",
                        en:"Hey, I'm your personal fitness and nutrition coach. How can I help you reach your goals today?", zh:"嘿，我是你的私人健身与营养教练。今天我能怎么帮你实现目标？" },
  "cc.locked":        { de:"Der Coach ist Teil von Premium und Ultra+.",
                        en:"The coach is part of Premium and Ultra+.", zh:"教练是 Premium 和 Ultra+ 的功能。" },
  "cc.loading":       { de:"Verlauf wird geladen …", en:"Loading your chat …", zh:"正在加载聊天记录 …" },
  "cc.ph":            { de:"Deine Frage",       en:"Your question", zh:"你的问题" },
  "cc.note":          { de:"Dein Coach ist eine KI. Antworten können Fehler enthalten und ersetzen keine ärztliche Beratung.",
                        en:"Your coach is an AI. Answers can be wrong and are no substitute for medical advice.", zh:"你的教练是 AI。回答可能有误，不能替代医疗建议。" },

  /* ── Essensvorschlag ── */
  "sg.title":         { de:"Vorschlag",         en:"Suggestion", zh:"建议" },
  "sg.loading":       { de:"Passende Optionen werden gesucht …", en:"Looking for options that fit …", zh:"正在寻找合适的选择 …" },
  "sg.failed":        { de:"Der Vorschlag hat nicht geklappt.", en:"The suggestion didn't work out.", zh:"这次建议没能生成。" },
  "sg.left":          { de:"Noch verfügbar",    en:"Still available", zh:"还可摄入" },
  "sg.item":          { de:"Vorschlag",         en:"Suggestion", zh:"建议" },
  "sg.macros":        { de:(pr,ch,fa)=>`E ${pr} g · K ${ch} g · F ${fa} g`,
                        en:(pr,ch,fa)=>`P ${pr} g · C ${ch} g · F ${fa} g`, zh:(pr,ch,fa)=>`蛋白 ${pr} 克 · 碳水 ${ch} 克 · 脂肪 ${fa} 克` },
  "sg.logged":        { de:n=>`${n} kcal eingetragen`, en:n=>`${n} kcal logged`, zh:n=>`已记录 ${n} kcal` },

  /* ── Tageswechsel ── */
  "cal.title":        { de:"Tag wählen",        en:"Pick a day", zh:"选择日期" },
  "cal.loading":      { de:"Kalender wird geladen …", en:"Loading the calendar …", zh:"正在加载日历 …" },
  "cal.failed":       { de:"Die Tage konnten nicht geladen werden.", en:"The days could not be loaded.", zh:"日期加载失败。" },
  "cal.prev":         { de:"Vorheriger Monat",  en:"Previous month", zh:"上一个月" },
  "cal.next":         { de:"Nächster Monat",    en:"Next month", zh:"下一个月" },
  "cal.wd":           { de:["Mo","Di","Mi","Do","Fr","Sa","So"],
                        en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], zh:["一","二","三","四","五","六","日"] },
  "cal.hint":         { de:"Ein Punkt markiert Tage mit Einträgen.",
                        en:"A dot marks days with entries.", zh:"圆点表示当天有记录。" },

  /* ── Zusammensetzung ── */
  "bd.title":         { de:"Zusammensetzung",   en:"How it adds up", zh:"数字怎么来的" },
  "bd.bmr":           { de:"Grundumsatz in Ruhe", en:"Resting metabolic rate", zh:"静息基础代谢" },
  "bd.life":          { de:"Alltag",            en:"Everyday life", zh:"日常活动" },
  "bd.tdee":          { de:"Grundbedarf",       en:"Maintenance", zh:"维持热量" },
  "bd.goal":          { de:"Ziel",              en:"Goal", zh:"目标" },
  "bd.target":        { de:"Tagesziel",         en:"Daily target", zh:"每日目标" },
  "bd.train":         { de:"Training",          en:"Workouts", zh:"训练" },
  "bd.eaten":         { de:"Gegessen",          en:"Eaten", zh:"已摄入" },
  "bd.over":          { de:"Über dem Budget",   en:"Over budget", zh:"超出预算" },
  "bd.left":          { de:"Noch verfügbar",    en:"Still available", zh:"还可摄入" },
  "bd.hint":          { de:"Grundumsatz nach Mifflin-St Jeor aus Gewicht, Größe, Alter und Geschlecht.",
                        en:"Basal rate per Mifflin-St Jeor from weight, height, age and sex.", zh:"基础代谢按 Mifflin-St Jeor 公式，由体重、身高、年龄和性别得出。" },

  /* ── Eintrag bearbeiten ── */
  "en.edit":          { de:"Bearbeiten",        en:"Edit", zh:"编辑" },
  "en.del":           { de:"Löschen",           en:"Delete", zh:"删除" },
  "en.deleted":       { de:"Eintrag gelöscht",  en:"Entry deleted", zh:"记录已删除" },
  "ee.title":         { de:"Bearbeiten",        en:"Edit entry", zh:"编辑记录" },
  "ee.time":          { de:"Uhrzeit",           en:"Time", zh:"时间" },
  "ee.detail":        { de:"Zusatz",            en:"Detail", zh:"备注" },
  "ee.detailPh":      { de:"z. B. 150 g",       en:"e.g. 150 g", zh:"例如 150 克" },
  "ee.errKcal":       { de:"Bitte eine gültige Kalorienzahl eintragen.",
                        en:"Please enter a valid calorie figure.", zh:"请填写有效的热量数值。" },
  "ee.saveFailed":    { de:"Speichern fehlgeschlagen.", en:"Saving failed.", zh:"保存失败。" },
  "ee.saved":         { de:"Eintrag aktualisiert", en:"Entry updated", zh:"记录已更新" },

  /* ── Foto & Analyse ── */
  "ph.title":         { de:"Meal erfassen",     en:"Log a meal", zh:"记录一餐" },
  "ph.alt":           { de:"Aufgenommene Mahlzeit", en:"Photographed meal", zh:"拍下的餐食" },
  "ph.swap":          { de:"Ändern",            en:"Change", zh:"更换" },
  "ph.drop":          { de:"Foto aufnehmen oder hochladen", en:"Take or upload a photo", zh:"拍照或上传照片" },
  "ph.dropSub":       { de:"Tippen zum Auswählen — oder einfach unten beschreiben, was du gegessen hast.",
                        en:"Tap to choose — or simply describe below what you ate.", zh:"点击选择 —— 或者直接在下面写下你吃了什么。" },
  "ph.extra":         { de:"Zusatz-Info (optional)", en:"Extra info (optional)", zh:"补充说明（可选）" },
  "ph.desc":          { de:"Beschreibung",      en:"Description", zh:"描述" },
  "ph.extraPh":       { de:"z. B. nur die halbe Portion, dazu noch ein Ei",
                        en:"e.g. only half a portion, plus an egg", zh:"例如只吃了一半，另外加一个鸡蛋" },
  "ph.descPh":        { de:"z. B. zwei Scheiben Vollkornbrot mit Käse, dazu ein Apfel",
                        en:"e.g. two slices of wholegrain bread with cheese and an apple", zh:"例如两片全麦面包夹奶酪，再加一个苹果" },
  "ph.go":            { de:"Analysieren",       en:"Analyse", zh:"开始分析" },
  "ph.readFailed":    { de:"Das Bild konnte nicht gelesen werden.", en:"That image could not be read.", zh:"这张图片无法读取。" },
  "ph.busyImg":       { de:"Claude schaut sich dein Essen an …", en:"Claude is looking at your food …", zh:"Claude 正在看你的食物 …" },
  "ph.busyTxt":       { de:"Claude rechnet deine Beschreibung durch …",
                        en:"Claude is working through your description …", zh:"Claude 正在计算你的描述 …" },
  "ph.failed":        { de:"Die Analyse hat nicht geklappt.", en:"The analysis didn't work out.", zh:"这次分析没能完成。" },
  "ph.result":        { de:"Erkannt",           en:"Recognised", zh:"识别结果" },
  "ph.meal":          { de:"Mahlzeit",          en:"Meal", zh:"餐食" },
  "ph.total":         { de:"Gesamt",            en:"Total", zh:"总计" },
  "ph.fixAria":       { de:"Kalorien anpassen", en:"Adjust calories", zh:"调整热量" },
  "ph.fixHint":       { de:"Zahl antippen, um sie zu korrigieren.", en:"Tap the number to correct it.", zh:"点击数字即可修改。" },
  "ph.retry":         { de:"Nochmal anpassen",  en:"Adjust and retry", zh:"重新调整" },
  "ph.viaPhoto":      { de:"per Foto erfasst",  en:"logged from a photo", zh:"由照片记录" },
  "ph.viaText":       { de:"per Beschreibung",  en:"logged from a description", zh:"由描述记录" },
  "conf.hoch":        { de:"Klar erkannt",      en:"Clearly recognised", zh:"识别清晰" },
  "conf.mittel":      { de:"Portion geschätzt", en:"Portion estimated", zh:"份量为估算" },
  "conf.niedrig":     { de:"Grobe Schätzung",   en:"Rough estimate", zh:"粗略估算" },

  /* ── Mahlzeit von Hand ── */
  "mn.title":         { de:"Meal eintragen",    en:"Log a meal", zh:"记录一餐" },
  "tab.fav":          { de:"Favoriten",         en:"Favourites", zh:"收藏" },
  "tab.all":          { de:"Alle",              en:"All", zh:"全部" },
  "tab.free":         { de:"Frei",              en:"Free", zh:"自定义" },
  "tab.noFav":        { de:"Keine Favoriten gewählt.", en:"No favourites picked.", zh:"还没有收藏。" },
  "mn.search":        { de:"Lebensmittel suchen", en:"Search foods", zh:"搜索食物" },
  "mn.namePh":        { de:"z. B. McNuggets",   en:"e.g. chicken nuggets", zh:"例如鸡块" },
  "mn.kcalPh":        { de:"650",               en:"650", zh:"650" },
  "mn.macrosOpt":     { de:"Makros in Gramm (optional)", en:"Macros in grams (optional)", zh:"三大营养素（克，可选）" },
  "mn.errKcal":       { de:"Bitte eine Kalorienzahl eintragen.", en:"Please enter a calorie figure.", zh:"请填写热量数值。" },
  "mn.manualTag":     { de:"manuell",           en:"manual", zh:"手动" },
  "pt.grams":         { de:"Menge in Gramm",    en:"Amount in grams", zh:"份量（克）" },
  "pt.errGrams":      { de:"Bitte eine Menge eintragen.", en:"Please enter an amount.", zh:"请填写份量。" },

  /* ── Training ── */
  "tr.title":         { de:"Training erfassen", en:"Log a workout", zh:"记录训练" },
  "tr.namePh":        { de:"z. B. Fußballtraining", en:"e.g. football practice", zh:"例如足球训练" },
  "tr.kcalPh":        { de:"420",               en:"420", zh:"420" },
  "tr.fallbackName":  { de:"Training",          en:"Workout", zh:"训练" },
  "tr.credited":      { de:n=>`+${n} kcal gutgeschrieben`, en:n=>`+${n} kcal credited`, zh:n=>`已计入 +${n} kcal` },
  "tr.minutes":       { de:"Dauer in Minuten",  en:"Duration in minutes", zh:"时长（分钟）" },
  "tr.errMin":        { de:"Bitte eine Dauer eintragen.", en:"Please enter a duration.", zh:"请填写时长。" },
  "tr.min":           { de:m=>`${m} min`,       en:m=>`${m} min`, zh:m=>`${m} 分钟` }
};

/* ── Einstellungen ── */
Object.assign(STRINGS, {
  "st.title":         { de:"Einstellungen",     en:"Settings", zh:"设置" },
  "st.lang":          { de:"Sprache",           en:"Language", zh:"语言" },
  "st.langHint":      { de:"Gilt für die gesamte App — auch für Coach, Vorschläge und Fotoanalyse.",
                        en:"Applies to the whole app — including coach, suggestions and photo analysis.", zh:"作用于整个应用 —— 也包括教练、饮食建议和照片分析。" },
  "st.tier":          { de:"Mitgliedschaft",    en:"Membership", zh:"会员" },
  "st.coach":         { de:"Coach",             en:"Coach", zh:"教练" },
  "st.body":          { de:"Körperdaten",       en:"Body data", zh:"身体数据" },
  "st.life":          { de:"Alltag",            en:"Everyday life", zh:"日常活动" },
  "st.goal":          { de:"Ziel",              en:"Goal", zh:"目标" },
  "st.macros":        { de:"Makroziele",        en:"Macro targets", zh:"营养素目标" },
  "st.mmAuto":        { de:"Automatisch",       en:"Automatic", zh:"自动" },
  "st.mmCustom":      { de:"Eigene Werte",      en:"Your own values", zh:"自定义" },
  "st.diet":          { de:"Ernährungsform",    en:"Way of eating", zh:"饮食方式" },
  "st.favActs":       { de:"Lieblings-Aktivitäten", en:"Favourite activities", zh:"常做的运动" },
  "st.favFoods":      { de:"Lieblings-Lebensmittel", en:"Favourite foods", zh:"常吃的食物" },
  "st.dislikes":      { de:"Mag ich nicht",     en:"Don't like", zh:"不喜欢的" },
  "st.ownFoods":      { de:"Eigene Lebensmittel", en:"Your own foods", zh:"自定义食物" },
  "st.ownFoodAdd":    { de:"Lebensmittel anlegen", en:"Add a food", zh:"添加食物" },
  "st.ownActs":       { de:"Eigene Trainings",  en:"Your own workouts", zh:"自定义训练" },
  "st.ownActAdd":     { de:"Training anlegen",  en:"Add a workout", zh:"添加训练" },
  "st.avoid":         { de:"Unverträglichkeiten", en:"Intolerances", zh:"食物不耐受" },
  "st.avoidPh":       { de:"z. B. Laktose",     en:"e.g. lactose", zh:"例如乳糖" },
  "st.avoidAdd":      { de:"Hinzufügen",        en:"Add", zh:"添加" },
  "st.avoidHint":     { de:"Wird bei Vorschlägen berücksichtigt.",
                        en:"Taken into account for suggestions.", zh:"生成建议时会考虑这些。" },
  "st.avoidNone":     { de:"Nichts eingetragen.", en:"Nothing added.", zh:"还没有填写。" },
  "st.legal":         { de:"Rechtliches",       en:"Legal", zh:"法律信息" },
  "st.account":       { de:"Konto",             en:"Account", zh:"账户" },
  "st.delAccount":    { de:"Konto und alle Daten löschen", en:"Delete account and all data", zh:"删除账户及全部数据" },
  "st.signOut":       { de:"Abmelden",          en:"Sign out", zh:"退出登录" },
  "st.saved":         { de:"Einstellungen gespeichert", en:"Settings saved", zh:"设置已保存" },
  "st.preview":       { de:(target,tdee)=>`Neues Tagesbudget: <b>${target} kcal</b> · Grundbedarf ${tdee} kcal`,
                        en:(target,tdee)=>`New daily budget: <b>${target} kcal</b> · maintenance ${tdee} kcal`, zh:(target,tdee)=>`新的每日预算：<b>${target} kcal</b> · 维持热量 ${tdee} kcal` },
  "st.previewFloor":  { de:n=>`<br><b style="color:var(--warn)">Untergrenze von ${n} kcal greift – ein größerer Abzug wird nicht übernommen.</b>`,
                        en:n=>`<br><b style="color:var(--warn)">The ${n} kcal floor applies — a bigger deduction is not used.</b>`, zh:n=>`<br><b style="color:var(--warn)">已触及 ${n} kcal 的下限 —— 更大的缺口不会被采用。</b>` },
  "st.errWeight":     { de:"Gewicht zwischen 30 und 300 kg eintragen.",
                        en:"Enter a weight between 30 and 300 kg.", zh:"请填写 30 到 300 公斤之间的体重。" },
  "st.errHeight":     { de:"Größe zwischen 120 und 230 cm eintragen.",
                        en:"Enter a height between 120 and 230 cm.", zh:"请填写 120 到 230 厘米之间的身高。" },
  "st.errAge":        { de:"Alter zwischen 14 und 100 Jahren eintragen.",
                        en:"Enter an age between 14 and 100.", zh:"请填写 14 到 100 岁之间的年龄。" },
  "st.errLsk":        { de:"Zuschlag zwischen 0 und 3000 kcal eintragen.",
                        en:"Enter an allowance between 0 and 3000 kcal.", zh:"请填写 0 到 3000 千卡之间的附加值。" },
  "st.errGk":         { de:"Abweichung zwischen -1500 und +1500 kcal eintragen.",
                        en:"Enter a difference between -1500 and +1500 kcal.", zh:"请填写 -1500 到 +1500 千卡之间的差值。" },
  "st.saveFailed":    { de:"Speichern fehlgeschlagen.", en:"Saving failed.", zh:"保存失败。" },

  "pk.none":          { de:"Noch nichts ausgewählt.", en:"Nothing picked yet.", zh:"还没有选择。" },
  "pk.close":         { de:"Liste schließen",   en:"Close list", zh:"收起列表" },
  "pk.open":          { de:"Alle anzeigen",     en:"Show all", zh:"显示全部" },
  "pk.count":         { de:(n,all)=>`${n} von ${all}`, en:(n,all)=>`${n} of ${all}`, zh:(n,all)=>`已选 ${n} / ${all}` },
  "mg.label":         { de:n=>`${n} (g)`,       en:n=>`${n} (g)`, zh:n=>`${n}（克）` },
  "mg.auto":          { de:g=>`Aus Gewicht und Ziel berechnet: ${g} g Eiweiß je kg, 27 % der Kalorien aus Fett, Rest Kohlenhydrate.`,
                        en:g=>`Calculated from weight and goal: ${g} g of protein per kg, 27 % of calories from fat, the rest carbs.`, zh:g=>`根据体重和目标计算：每公斤 ${g} 克蛋白质，脂肪占热量的 27 %，其余为碳水。` },
  "mg.custom":        { de:(kcal,target)=>`Ergibt ${kcal} kcal — dein Tagesziel liegt bei ${target} kcal.`,
                        en:(kcal,target)=>`Adds up to ${kcal} kcal — your daily target is ${target} kcal.`, zh:(kcal,target)=>`合计 ${kcal} kcal —— 你的每日目标是 ${target} kcal。` },
  "own.noFoods":      { de:"Noch keine eigenen Lebensmittel.", en:"No custom foods yet.", zh:"还没有自定义食物。" },
  "own.noActs":       { de:"Noch keine eigenen Trainings.", en:"No custom workouts yet.", zh:"还没有自定义训练。" },

  "cc.clear":         { de:"Chatverlauf löschen", en:"Delete chat history", zh:"删除聊天记录" },
  "cc.clearHint":     { de:"Der Coach startet danach wieder mit der Begrüßung.",
                        en:"The coach starts over with its greeting afterwards.", zh:"之后教练会重新从问候语开始。" },
  "cc.count":         { de:n=>`${n} Fragen`,    en:n=>`${n} questions`, zh:n=>`${n} 个提问` },
  "cc.empty":         { de:"leer",              en:"empty", zh:"空" },
  "cc.confirm":       { de:"Wirklich löschen?", en:"Really delete?", zh:"确定要删除吗？" },
  "cc.confirmHint":   { de:"tippen zum Bestätigen", en:"tap to confirm", zh:"点击确认" },
  "cc.cleared":       { de:"Chatverlauf gelöscht", en:"Chat history deleted", zh:"聊天记录已删除" },

  /* ── Konto löschen ── */
  "da.title":         { de:"Konto löschen",     en:"Delete account", zh:"删除账户" },
  "da.word":          { de:"LÖSCHEN",           en:"DELETE", zh:"删除" },
  "da.intro":         { de:"Damit werden dein Konto und alle gespeicherten Daten endgültig entfernt: Körperdaten und Ziele, sämtliche erfassten Mahlzeiten und Trainings, eigene Lebensmittel und Trainings sowie der Coach-Verlauf. Das lässt sich nicht rückgängig machen.",
                        en:"This permanently removes your account and everything stored with it: body data and goals, every meal and workout you logged, your own foods and workouts, and the coach history. It cannot be undone.", zh:"这会永久删除你的账户和其中的全部数据：身体数据与目标、所有记录的餐食和训练、自定义的食物和训练，以及教练的聊天记录。此操作无法撤销。" },
  "da.reauth":        { de:"Aus Sicherheitsgründen musst du dich dafür erneut anmelden.",
                        en:"For security reasons you need to sign in again first.", zh:"出于安全考虑，你需要先重新登录一次。" },
  "da.google":        { de:"Mit Google bestätigen", en:"Confirm with Google", zh:"使用 Google 确认" },
  "da.pass":          { de:"Dein Passwort",     en:"Your password", zh:"你的密码" },
  "da.type":          { de:w=>`Tippe <b>${w}</b>, um zu bestätigen`,
                        en:w=>`Type <b>${w}</b> to confirm`, zh:w=>`输入 <b>${w}</b> 以确认` },
  "da.go":            { de:"Endgültig löschen", en:"Delete permanently", zh:"永久删除" },
  "da.reauthFailed":  { de:"Die Bestätigung hat nicht geklappt.", en:"That confirmation didn't work.", zh:"确认没有成功。" },
  "da.needPass":      { de:"Bitte dein Passwort eingeben.", en:"Please enter your password.", zh:"请输入你的密码。" },
  "da.wrongPass":     { de:"Das Passwort stimmt nicht.", en:"That password is not correct.", zh:"密码不正确。" },
  "da.failed":        { de:"Löschen fehlgeschlagen. Versuch es später erneut.",
                        en:"Deleting failed. Please try again later.", zh:"删除失败，请稍后再试。" },
  "da.done":          { de:"Konto gelöscht",    en:"Account deleted", zh:"账户已删除" },

  /* ── Eigene Einträge ── */
  "oa.title":         { de:"Eigenes Training",  en:"Your own workout", zh:"自定义训练" },
  "oa.namePh":        { de:"z. B. Bouldern in der Halle", en:"e.g. indoor bouldering", zh:"例如室内攀岩" },
  "oa.kcal":          { de:"Kalorien pro Stunde", en:"Calories per hour", zh:"每小时消耗的热量" },
  "oa.kcalPh":        { de:"600",               en:"600", zh:"600" },
  "oa.note":          { de:n=>`Ergibt ${n} kcal für 30 Minuten.`, en:n=>`That is ${n} kcal for 30 minutes.`, zh:n=>`30 分钟相当于 ${n} kcal。` },
  "oa.noteEmpty":     { de:"Dieser Wert gilt unabhängig vom Körpergewicht — er kommt direkt von dir.",
                        en:"This figure is independent of body weight — it comes straight from you.", zh:"这个数值与体重无关 —— 它直接来自你自己。" },
  "oa.errName":       { de:"Bitte eine Bezeichnung eintragen.", en:"Please enter a name.", zh:"请填写名称。" },
  "oa.errKcal":       { de:"Kalorien zwischen 1 und 2000 pro Stunde eintragen.",
                        en:"Enter between 1 and 2000 calories per hour.", zh:"请填写每小时 1 到 2000 之间的热量。" },

  "of.title":         { de:"Eigenes Lebensmittel", en:"Your own food", zh:"自定义食物" },
  "of.namePh":        { de:"z. B. Proteinbrot vom Bäcker", en:"e.g. protein bread from the bakery", zh:"例如面包房的蛋白面包" },
  "of.kcal":          { de:"Kalorien je 100 g", en:"Calories per 100 g", zh:"每 100 克的热量" },
  "of.kcalPh":        { de:"230",               en:"230", zh:"230" },
  "of.macros":        { de:"Makros je 100 g",   en:"Macros per 100 g", zh:"每 100 克的营养素" },
  "of.portion":       { de:"Übliche Portion (g)", en:"Typical portion (g)", zh:"常见份量（克）" },
  "of.note":          { de:n=>`Aus den Makros ergeben sich ${n} kcal.`,
                        en:n=>`The macros add up to ${n} kcal.`, zh:n=>`按营养素计算为 ${n} kcal。` },
  "of.noteOff":       { de:` <b style="color:var(--warn)">Das weicht deutlich von deiner Kalorienangabe ab.</b>`,
                        en:` <b style="color:var(--warn)">That is well off the calorie figure you entered.</b>`, zh:` <b style="color:var(--warn)">这与你填写的热量相差较大。</b>` },
  "of.noteEmpty":     { de:"Alkohol zählt nicht zu den Makros — dort darf die Rechnung abweichen.",
                        en:"Alcohol is not a macro — there the numbers may differ.", zh:"酒精不算在三大营养素里 —— 那里的计算可以有出入。" },
  "of.errName":       { de:"Bitte eine Bezeichnung eintragen.", en:"Please enter a name.", zh:"请填写名称。" },
  "of.errKcal":       { de:"Kalorien zwischen 1 und 900 je 100 g eintragen.",
                        en:"Enter between 1 and 900 calories per 100 g.", zh:"请填写每 100 克 1 到 900 之间的热量。" },
  "macro.prShort":    { de:"Eiweiß",            en:"Protein", zh:"蛋白质" },
  "macro.chShort":    { de:"Kohlenhydr.",       en:"Carbs", zh:"碳水" },
  "macro.faShort":    { de:"Fett",              en:"Fat", zh:"脂肪" },

  /* ── Installations-Hinweis ── */
  "in.install":       { de:"Installieren",      en:"Install", zh:"安装" },
  "in.title":         { de:"FITTEN.ME installieren", en:"Install FITTEN.ME", zh:"安装 FITTEN.ME" },
  "in.sub":           { de:"Als eigene App auf dem Startbildschirm.",
                        en:"As its own app on your home screen.", zh:"作为独立应用放到主屏幕上。" },
  "in.iosTitle":      { de:"Auf den Homescreen legen", en:"Add to your home screen", zh:"添加到主屏幕" },
  "in.iosSub":        { de:"Teilen-Symbol antippen, dann „Zum Home-Bildschirm“.",
                        en:"Tap the share icon, then “Add to Home Screen”.", zh:"点击分享图标，然后选择「添加到主屏幕」。" },

  /* ── Fehlertexte der API-Aufrufe ── */
  "api.noJson":       { de:(url,status,file)=>`${url} liefert kein JSON (HTTP ${status}). Liegt ${file} im Projekt-Root?`,
                        en:(url,status,file)=>`${url} did not return JSON (HTTP ${status}). Is ${file} in the project root?`, zh:(url,status,file)=>`${url} 没有返回 JSON（HTTP ${status}）。${file} 是否在项目根目录下？` }
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
  }),

  zh: updated => ({
    imprint: { t:"法律声明", body:`
<h4>依据德国《数字服务法》第 5 条的信息</h4>
<p>Jan-Niklas Rentzsch<br>Bahndamm 7<br>23617 Stockelsdorf<br>德国</p>
<h4>联系方式</h4>
<p>邮箱：info@laerby.com<br>电话：+49 151 25380111</p>
<h4>增值税</h4>
<p>依据德国《增值税法》第 19 条的小规模经营者规定，不计增值税。</p>
<h4>内容负责人</h4>
<p>Jan-Niklas Rentzsch，地址同上。</p>
<h4>争议解决</h4>
<p>我们不愿也没有义务参加消费者仲裁机构的争议解决程序。</p>
<h4>更新日期</h4>
<p>${updated}</p>
<p><i>本译文仅供参考，具有法律效力的是德文版本。</i></p>` },

    privacy: { t:"隐私政策", body:`
<h4>数据控制者</h4>
<p>Jan-Niklas Rentzsch<br>Bahndamm 7<br>23617 Stockelsdorf<br>德国<br>
邮箱：info@laerby.com<br>电话：+49 151 25380111</p>
<h4>我们处理哪些数据</h4>
<p>账户数据：你的邮箱地址和账户标识。<br>
健康相关数据：体重、身高、年龄、性别、目标、记录的餐食与训练、餐食照片，以及你的偏好和食物不耐受。<br>
使用数据：你记录的时间点，以及教练聊天的历史。</p>
<h4>处理目的</h4>
<p>这些数据仅用于向你提供应用的功能：计算基础代谢、每日预算和营养素目标，统计你的记录，
根据照片和描述估算热量，以及生成教练的回答。我们不会为广告目的进行分析，也不会为第三方
自身的目的向其提供数据。</p>
<h4>法律依据</h4>
<p>健康相关数据属于 GDPR 第 9 条所指的特殊类别个人数据。我们仅基于你在设置时给出的明确同意
（GDPR 第 9 条第 2 款 a 项）处理这些数据，你可以随时撤回该同意，自撤回之日起生效。应用的
其余部分基于 GDPR 第 6 条第 1 款 b 项提供。</p>
<h4>数据接收方</h4>
<p>Google Ireland Limited，Gordon House, Barrow Street, Dublin 4, 爱尔兰，以及 Google LLC，
美国，用于登录和数据库（Firebase Authentication 与 Cloud Firestore）。<br>
Vercel Inc.，440 N Barranca Ave #4133, Covina, CA 91723, 美国，用于运行本应用。<br>
Anthropic PBC，548 Market St, PMB 90375, San Francisco, CA 94104, 美国，用于餐食照片分析、
饮食建议和教练。</p>
<p>我们与上述所有服务商均签订了 GDPR 第 28 条规定的数据处理协议。</p>
<h4>向第三国传输</h4>
<p>上述服务会在美国处理数据。其依据是欧盟委员会的标准合同条款，以及在服务商已通过认证的
情况下的《欧盟-美国数据隐私框架》。</p>
<h4>保存期限</h4>
<p>只要你的账户存在，数据就会保留。如果你在设置中删除账户，个人资料、所有记录的日期以及
教练聊天记录都会被移除。教练聊天记录也可以随时单独删除。</p>
<h4>你的权利</h4>
<p>你享有访问权（第 15 条）、更正权（第 16 条）、删除权（第 17 条）、限制处理权（第 18 条）、
数据可携权（第 20 条）和反对权（GDPR 第 21 条）。你可以随时撤回已给出的同意，这不影响撤回前
处理的合法性。请通过上述邮箱与我们联系。</p>
<h4>投诉权</h4>
<p>你有权向数据保护监管机构投诉。主管机构为石勒苏益格-荷尔斯泰因州独立数据保护中心
（Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein），Holstenstraße 98,
24103 Kiel, 德国。</p>
<h4>更新日期</h4>
<p>${updated}</p>
<p><i>本译文仅供参考，具有法律效力的是德文版本。</i></p>` },

    health: { t:"健康提示", body:`
<h4>不构成医疗建议</h4>
<p>FITTEN.ME 是一款健身与健康类应用。它显示的热量与营养素目标、各项统计以及教练的回答都是
一般性参考，不能替代医生的建议、诊断或治疗。</p>
<h4>估算值</h4>
<p>基础代谢按 Mifflin-St Jeor 公式计算，得到的是统计平均值，你的实际需求可能相差很多。根据
照片和文字描述得出的热量是估算值，可能出错。对你重要的数值，请自己再核对一遍。</p>
<h4>什么时候该去看医生</h4>
<p>如果你有基础疾病、正在服药、怀孕或哺乳、未满 18 岁，或出现身体不适，请在调整饮食或开始
新的训练计划前咨询医生。</p>
<h4>当饮食成为负担时</h4>
<p>如果计算热量让你感到压力，或者你的饮食行为让你担心，请寻求帮助。在德国，联邦健康教育中心
的进食障碍咨询热线为 0221 892031；在其他地区，请联系你的医生或当地的求助热线。</p>` },

    ai: { t:"AI 提示", body:`
<h4>你正在和 AI 对话</h4>
<p>教练、照片分析和饮食建议都由 AI 语言模型生成。背后没有人在阅读和回复你的消息。</p>
<h4>使用的是哪套系统</h4>
<p>本应用使用 Anthropic PBC 的 Claude 系列模型。具体使用哪个模型取决于你选择的会员等级。</p>
<h4>会传输哪些内容</h4>
<p>为了给出合适的回答，应用中的数据会被传输：身体数据、目标、每日预算、记录的餐食与训练、
偏好和食物不耐受。照片分析还会额外传输你拍摄的照片。</p>
<h4>局限</h4>
<p>AI 的回答可能是错误或不完整的，即使听起来很有说服力。它们不是医疗建议。涉及健康的重要
决定，不要仅凭它们做判断。</p>` }
  })
};
