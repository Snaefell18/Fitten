/* ══════════════════════════════════════════════════════════════════
   FITTEN.ME — Kalorien & Training
   index.html + app.js  ·  Firebase Auth/Firestore  ·  Claude Vision
   ══════════════════════════════════════════════════════════════════ */

/* ─────────────────  1. KONFIGURATION  ───────────────── */

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyC-06XiwTmKQeV2RRF_lPeMqmjHNfeFSC4",
  authDomain:        "fitten-me.firebaseapp.com",
  projectId:         "fitten-me",
  storageBucket:     "fitten-me.firebasestorage.app",
  messagingSenderId: "419221842511",
  appId:             "1:419221842511:web:859e758a5b80b13ffdd83a"
};

// Serverless-Proxy für die Claude-API (siehe api/analyze.js).
// Der API-Key gehört NIE ins Frontend.
const ANALYZE_ENDPOINT = "/api/analyze";

/* ─────────────────  2. STAMMDATEN  ───────────────── */

/* MET-Werte → kcal/h = MET × 1.05 × Körpergewicht(kg).
   Dadurch stimmen die Aktivitätskalorien für jeden Nutzer individuell. */
const ACTIVITIES = [
  { g:"Draußen",   id:"walk",      n:"Gehen outdoor",        met:3.5 },
  { g:"Draußen",   id:"walk_fast", n:"Zügiges Gehen",        met:4.3 },
  { g:"Draußen",   id:"hike",      n:"Wandern",              met:6.0 },
  { g:"Draußen",   id:"jog",       n:"Joggen (8 km/h)",      met:8.3 },
  { g:"Draußen",   id:"run",       n:"Laufen (11 km/h)",     met:11.0 },
  { g:"Draußen",   id:"bike",      n:"Fahrrad gemütlich",    met:6.0 },
  { g:"Draußen",   id:"bike_fast", n:"Fahrrad zügig",        met:8.5 },
  { g:"Draußen",   id:"mtb",       n:"Mountainbike",         met:8.5 },
  { g:"Draußen",   id:"skate",     n:"Inlineskaten",         met:7.5 },
  { g:"Draußen",   id:"ski",       n:"Skifahren",            met:7.0 },
  { g:"Draußen",   id:"garden",    n:"Gartenarbeit",         met:3.8 },

  { g:"Gym",       id:"weights",   n:"Krafttraining",        met:5.0 },
  { g:"Gym",       id:"machines",  n:"Geräte moderat",       met:3.5 },
  { g:"Gym",       id:"hiit",      n:"HIIT / Functional",    met:8.0 },
  { g:"Gym",       id:"cross",     n:"Crosstrainer",         met:5.0 },
  { g:"Gym",       id:"row",       n:"Rudergerät",           met:7.0 },
  { g:"Gym",       id:"spin",      n:"Spinning",             met:8.5 },
  { g:"Gym",       id:"stepper",   n:"Stepper",              met:7.0 },
  { g:"Gym",       id:"rope",      n:"Seilspringen",         met:11.0 },
  { g:"Gym",       id:"stairs",    n:"Treppensteigen",       met:8.0 },

  { g:"Sportarten",id:"swim",      n:"Schwimmen",            met:7.0 },
  { g:"Sportarten",id:"football",  n:"Fußball",              met:7.0 },
  { g:"Sportarten",id:"basket",    n:"Basketball",           met:6.5 },
  { g:"Sportarten",id:"tennis",    n:"Tennis",               met:7.3 },
  { g:"Sportarten",id:"badminton", n:"Badminton",            met:5.5 },
  { g:"Sportarten",id:"volley",    n:"Volleyball",           met:4.0 },
  { g:"Sportarten",id:"box",       n:"Boxen",                met:9.0 },
  { g:"Sportarten",id:"climb",     n:"Klettern",             met:7.5 },
  { g:"Sportarten",id:"dance",     n:"Tanzen",               met:5.0 },

  { g:"Ruhig",     id:"yoga",      n:"Yoga",                 met:3.0 },
  { g:"Ruhig",     id:"pilates",   n:"Pilates",              met:3.8 },
  { g:"Ruhig",     id:"stretch",   n:"Mobility / Dehnen",    met:2.5 }
];

/* kcal je 100 g. p = typische Portion in Gramm (für Ein-Tipp-Erfassung). */
const FOODS = [
  { g:"Protein",     id:"skyr",     n:"Skyr natur",          k:63,  p:150 },
  { g:"Protein",     id:"quark",    n:"Magerquark",          k:67,  p:250 },
  { g:"Protein",     id:"chicken",  n:"Hähnchenbrust",       k:165, p:150 },
  { g:"Protein",     id:"beef",     n:"Rinderhack 20 %",     k:220, p:150 },
  { g:"Protein",     id:"salmon",   n:"Lachs",               k:208, p:140 },
  { g:"Protein",     id:"tuna",     n:"Thunfisch (Wasser)",  k:116, p:130 },
  { g:"Protein",     id:"egg",      n:"Ei",                  k:155, p:60  },
  { g:"Protein",     id:"whey",     n:"Whey Shake",          k:380, p:30  },
  { g:"Protein",     id:"tofu",     n:"Tofu",                k:145, p:150 },

  { g:"Sättigung",   id:"pasta",    n:"Nudeln gekocht",      k:158, p:250 },
  { g:"Sättigung",   id:"rice",     n:"Reis gekocht",        k:130, p:200 },
  { g:"Sättigung",   id:"potato",   n:"Kartoffeln",          k:87,  p:250 },
  { g:"Sättigung",   id:"sweetpot", n:"Süßkartoffel",        k:90,  p:200 },
  { g:"Sättigung",   id:"oats",     n:"Haferflocken",        k:372, p:60  },
  { g:"Sättigung",   id:"bread",    n:"Vollkornbrot",        k:230, p:60  },
  { g:"Sättigung",   id:"toast",    n:"Toastbrot",           k:265, p:50  },
  { g:"Sättigung",   id:"couscous", n:"Couscous gekocht",    k:112, p:200 },
  { g:"Sättigung",   id:"beans",    n:"Kidneybohnen",        k:100, p:150 },

  { g:"Fast Food",   id:"nuggets",  n:"McNuggets",           k:296, p:105 },
  { g:"Fast Food",   id:"bigmac",   n:"Big Mac",             k:257, p:220 },
  { g:"Fast Food",   id:"cheeseb",  n:"Cheeseburger",        k:263, p:115 },
  { g:"Fast Food",   id:"fries",    n:"Pommes",              k:312, p:150 },
  { g:"Fast Food",   id:"pizza",    n:"Pizza Margherita",    k:250, p:300 },
  { g:"Fast Food",   id:"doener",   n:"Döner",               k:215, p:350 },
  { g:"Fast Food",   id:"curry",    n:"Currywurst",          k:240, p:180 },
  { g:"Fast Food",   id:"sushi",    n:"Sushi",               k:145, p:250 },

  { g:"Obst & Gemüse",id:"banana",  n:"Banane",              k:89,  p:120 },
  { g:"Obst & Gemüse",id:"apple",   n:"Apfel",               k:52,  p:150 },
  { g:"Obst & Gemüse",id:"berries", n:"Beeren",              k:45,  p:150 },
  { g:"Obst & Gemüse",id:"avocado", n:"Avocado",             k:160, p:100 },
  { g:"Obst & Gemüse",id:"broccoli",n:"Brokkoli",            k:34,  p:200 },
  { g:"Obst & Gemüse",id:"tomato",  n:"Tomaten",             k:18,  p:150 },
  { g:"Obst & Gemüse",id:"cucumber",n:"Gurke",               k:15,  p:150 },
  { g:"Obst & Gemüse",id:"carrot",  n:"Karotten",            k:41,  p:150 },
  { g:"Obst & Gemüse",id:"salad",   n:"Blattsalat",          k:15,  p:100 },

  { g:"Milch & Fett", id:"milk",    n:"Milch 3,5 %",         k:64,  p:200 },
  { g:"Milch & Fett", id:"yogurt",  n:"Joghurt natur",       k:61,  p:150 },
  { g:"Milch & Fett", id:"gouda",   n:"Gouda",               k:356, p:30  },
  { g:"Milch & Fett", id:"cream",   n:"Frischkäse",          k:250, p:30  },
  { g:"Milch & Fett", id:"butter",  n:"Butter",              k:741, p:10  },
  { g:"Milch & Fett", id:"oil",     n:"Olivenöl",            k:884, p:10  },

  { g:"Snacks",      id:"almonds",  n:"Mandeln",             k:579, p:30  },
  { g:"Snacks",      id:"choco",    n:"Schokolade",          k:546, p:40  },
  { g:"Snacks",      id:"chips",    n:"Chips",               k:536, p:50  },
  { g:"Snacks",      id:"haribo",   n:"Fruchtgummi",         k:343, p:50  },
  { g:"Snacks",      id:"icecream", n:"Eiscreme",            k:207, p:120 },
  { g:"Snacks",      id:"bar",      n:"Proteinriegel",       k:350, p:50  },
  { g:"Snacks",      id:"popcorn",  n:"Popcorn",             k:387, p:30  },

  { g:"Getränke",    id:"cola",     n:"Cola",                k:42,  p:330 },
  { g:"Getränke",    id:"juice",    n:"Orangensaft",         k:45,  p:250 },
  { g:"Getränke",    id:"schorle",  n:"Apfelschorle",        k:25,  p:330 },
  { g:"Getränke",    id:"beer",     n:"Bier",                k:43,  p:330 },
  { g:"Getränke",    id:"wine",     n:"Wein",                k:83,  p:200 },
  { g:"Getränke",    id:"latte",    n:"Latte Macchiato",     k:55,  p:250 }
];

const GOALS = [
  { id:"bulk",  n:"Muskelaufbau",               s:"Leichter Überschuss für sauberen Aufbau", f:+0.10 },
  { id:"keep",  n:"Erhaltung",                  s:"Gewicht halten, Leistung stabilisieren",  f: 0.00 },
  { id:"cut1",  n:"Moderate Gewichtsabnahme",   s:"Rund 0,4 kg pro Woche, gut durchhaltbar", f:-0.15 },
  { id:"cut2",  n:"Fortgeschrittene Abnahme",   s:"Rund 0,7 kg pro Woche, mehr Disziplin",   f:-0.22 }
];

const LIFESTYLE = [
  { id:"low",  n:"Überwiegend sitzend", s:"Büro, wenig Wege",              f:1.20 },
  { id:"mid",  n:"Leicht aktiv",        s:"Etwas Bewegung im Alltag",      f:1.30 },
  { id:"high", n:"Aktiv",               s:"Viel auf den Beinen, Handwerk", f:1.45 }
];

/* ─────────────────  3. FIREBASE  ───────────────── */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const fb    = initializeApp(FIREBASE_CONFIG);
const auth  = getAuth(fb);
const db    = getFirestore(fb);
const gprov = new GoogleAuthProvider();

/* ─────────────────  4. STATE & HELFER  ───────────────── */

const S = { uid:null, profile:null, day:null, dayKey:null, obStep:0, draft:{} };

/* Der Boot-Screen bleibt mindestens so lange stehen, dass die Wortmarke
   ihre Einblendung zu Ende spielen kann — sonst blitzt er nur kurz auf. */
const BOOT_MIN_MS = 1850;
const bootStart = Date.now();

/* Statusleiste: während des Boot-Screens im Himmelblau, danach im hellen
   Ton der App. Ohne das läge über dem Splash ein andersfarbiger Streifen. */
function themeColor(hex){
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute("content", hex);
}
themeColor("#BBE2FC");

/* Die Wortmarke startet erst, wenn der Webfont da ist — sonst wird sie
   erst im Fallback gezeichnet und springt beim Nachladen um. */
(document.fonts ? document.fonts.ready : Promise.resolve())
  .then(() => document.getElementById("boot").classList.add("ready"));
setTimeout(() => document.getElementById("boot").classList.add("ready"), 700);

function hideBoot(){
  setTimeout(() => {
    document.getElementById("boot").classList.add("off");
    themeColor("#EDF3FF");
  }, Math.max(0, BOOT_MIN_MS - (Date.now() - bootStart)));
}

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const num = n => Math.round(n).toLocaleString("de-DE");
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const clock = () => new Date().toTimeString().slice(0,5);

function screen(id){
  $$(".screen").forEach(s => s.classList.toggle("on", s.id === id));
  window.scrollTo(0,0);
}

let toastT;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("on"), 2600);
}

const ICON = {
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  fork :`<svg viewBox="0 0 24 24" fill="none" stroke="#1D6EF5" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v7a3 3 0 0 0 6 0V2M8 9v13M18 2c-1.5 2-2 4-2 7v4h4V9c0-3-.5-5-2-7zM18 13v9"/></svg>`,
  bolt :`<svg viewBox="0 0 24 24" fill="none" stroke="#0E9F63" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12z"/></svg>`,
  trash:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>`,
  swap :`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L21 8M20.5 15a9 9 0 0 1-14.9 3.4L3 16"/></svg>`,
  cam  :`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
};

/* ─────────────────  5. KALORIEN-LOGIK  ───────────────── */

// Mifflin-St Jeor
function bmrOf(p){
  const base = 10*p.weight + 6.25*p.height - 5*p.age;
  return Math.round(p.sex === "m" ? base + 5 : base - 161);
}
// Grundbedarf inkl. Alltag, OHNE gezieltes Training (das wird separat gutgeschrieben)
function tdeeOf(p){
  const l = LIFESTYLE.find(x => x.id === p.lifestyle) || LIFESTYLE[1];
  return Math.round(bmrOf(p) * l.f);
}
function targetOf(p){
  const g = GOALS.find(x => x.id === p.goal) || GOALS[1];
  const raw = tdeeOf(p) * (1 + g.f);
  // Untergrenze: nie unter den Grundumsatz. Verhindert unrealistische Zielwerte.
  return Math.round(Math.max(raw, bmrOf(p)));
}
const kcalPerHour = (met, kg) => Math.round(met * 1.05 * kg);

function totals(){
  const p = S.profile, d = S.day || { meals:[], workouts:[] };
  const eaten  = d.meals.reduce((a,m) => a + m.kcal, 0);
  const moved  = d.workouts.reduce((a,w) => a + w.kcal, 0);
  const target = targetOf(p);
  return { eaten, moved, target, tdee: tdeeOf(p), budget: target + moved, left: target + moved - eaten };
}

/* ─────────────────  6. AUTH  ───────────────── */

let signupMode = false;

$("#li-toggle").onclick = () => {
  signupMode = !signupMode;
  $("#li-go").textContent     = signupMode ? "Konto erstellen" : "Anmelden";
  $("#li-toggle").textContent = signupMode ? "Schon dabei? Anmelden" : "Noch kein Konto? Registrieren";
  $("#li-pass").autocomplete  = signupMode ? "new-password" : "current-password";
  $("#li-err").textContent    = "";
};

const AUTH_ERR = {
  "auth/invalid-email":          "Diese E-Mail-Adresse ist ungültig.",
  "auth/invalid-credential":     "E-Mail oder Passwort stimmen nicht.",
  "auth/wrong-password":         "E-Mail oder Passwort stimmen nicht.",
  "auth/user-not-found":         "Zu dieser E-Mail gibt es kein Konto.",
  "auth/email-already-in-use":   "Für diese E-Mail existiert bereits ein Konto.",
  "auth/weak-password":          "Das Passwort braucht mindestens 6 Zeichen.",
  "auth/popup-closed-by-user":   "Das Google-Fenster wurde geschlossen.",
  "auth/network-request-failed": "Keine Verbindung. Prüfe dein Netz und versuch es erneut."
};

async function doAuth(fn){
  $("#li-err").textContent = "";
  $("#li-go").disabled = true;
  try { await fn(); }
  catch(e){ $("#li-err").textContent = AUTH_ERR[e.code] || "Anmeldung fehlgeschlagen. Versuch es noch einmal."; }
  finally { $("#li-go").disabled = false; }
}

$("#li-go").onclick = () => {
  const mail = $("#li-mail").value.trim(), pass = $("#li-pass").value;
  if (!mail || !pass) { $("#li-err").textContent = "Bitte E-Mail und Passwort eingeben."; return; }
  doAuth(() => signupMode
    ? createUserWithEmailAndPassword(auth, mail, pass)
    : signInWithEmailAndPassword(auth, mail, pass));
};
$("#li-google").onclick = () => doAuth(() => signInWithPopup(auth, gprov));

onAuthStateChanged(auth, async user => {
  if (!user){
    S.uid = null; S.profile = null;
    $("#install").classList.remove("on");
    screen("s-login");
    hideBoot();
    return;
  }
  S.uid = user.uid;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists() && snap.data().onboarded){
    S.profile = snap.data();
    await loadDay();
    renderHome();
    screen("s-home");
    setTimeout(maybeShowInstall, 1500);
  } else {
    S.draft = { sex:"m", lifestyle:"mid", goal:"cut1", activities:[], foods:[] };
    S.obStep = 0;
    renderOb();
    screen("s-ob");
  }
  hideBoot();
});

/* ─────────────────  7. DATEN  ───────────────── */

async function saveProfile(){
  await setDoc(doc(db, "users", S.uid), S.profile, { merge:true });
}
async function loadDay(){
  S.dayKey = todayKey();
  const snap = await getDoc(doc(db, "users", S.uid, "days", S.dayKey));
  S.day = snap.exists() ? { meals:[], workouts:[], ...snap.data() } : { meals:[], workouts:[] };
}
async function saveDay(){
  await setDoc(doc(db, "users", S.uid, "days", S.dayKey), S.day);
}
async function addEntry(kind, entry){
  if (S.dayKey !== todayKey()) await loadDay();
  S.day[kind].unshift({ ...entry, id: crypto.randomUUID(), t: clock() });
  renderHome();
  try { await saveDay(); } catch { toast("Offline gespeichert – Sync folgt."); }
}
async function delEntry(kind, id){
  S.day[kind] = S.day[kind].filter(e => e.id !== id);
  renderHome();
  try { await saveDay(); } catch {}
}

/* ─────────────────  8. ONBOARDING  ───────────────── */

const OB = [
  {
    eyebrow:"Schritt 1 von 4", title:"Deine Eckdaten",
    sub:"Daraus berechnen wir deinen Grundumsatz nach Mifflin-St Jeor.",
    render(){
      const d = S.draft;
      return `
        <div class="row">
          <div class="field"><label for="f-w">Gewicht (kg)</label>
            <input id="f-w" type="number" inputmode="decimal" min="30" max="300" step="0.1" value="${d.weight ?? ""}" placeholder="78"></div>
          <div class="field"><label for="f-h">Größe (cm)</label>
            <input id="f-h" type="number" inputmode="numeric" min="120" max="230" value="${d.height ?? ""}" placeholder="182"></div>
        </div>
        <div class="row">
          <div class="field"><label for="f-a">Alter</label>
            <input id="f-a" type="number" inputmode="numeric" min="14" max="100" value="${d.age ?? ""}" placeholder="29"></div>
          <div class="field"><label for="f-s">Geschlecht</label>
            <select id="f-s">
              <option value="m" ${d.sex==="m"?"selected":""}>Männlich</option>
              <option value="w" ${d.sex==="w"?"selected":""}>Weiblich</option>
            </select></div>
        </div>
        <p class="group-label">Alltag ohne gezieltes Training</p>
        <div class="tiles">
          ${LIFESTYLE.map(l => tileHTML(l.id, l.n, l.s, "", d.lifestyle===l.id)).join("")}
        </div>
        <p class="hint">Trainingseinheiten trägst du später separat ein – sie erhöhen dein Tagesbudget zusätzlich.</p>`;
    },
    bind(){
      $$("#ob-body .tile").forEach(t => t.onclick = () => {
        S.draft.lifestyle = t.dataset.id;
        $$("#ob-body .tile").forEach(x => x.classList.toggle("sel", x === t));
      });
    },
    read(){
      const w = +$("#f-w").value, h = +$("#f-h").value, a = +$("#f-a").value;
      if (!(w >= 30 && w <= 300)) return "Bitte ein Gewicht zwischen 30 und 300 kg eintragen.";
      if (!(h >= 120 && h <= 230)) return "Bitte eine Größe zwischen 120 und 230 cm eintragen.";
      if (!(a >= 14 && a <= 100))  return "Bitte ein Alter zwischen 14 und 100 Jahren eintragen.";
      Object.assign(S.draft, { weight:w, height:h, age:a, sex:$("#f-s").value });
      return null;
    }
  },
  {
    eyebrow:"Schritt 2 von 4", title:"Dein Ziel",
    sub:"Bestimmt, wie dein Tagesbudget vom Grundbedarf abweicht.",
    render(){
      const p = { ...S.draft }, tdee = tdeeOf(p);
      return `<div class="tiles">${GOALS.map(g => {
        const t = Math.max(Math.round(tdee*(1+g.f)), bmrOf(p));
        return tileHTML(g.id, g.n, g.s, `${num(t)} kcal`, S.draft.goal===g.id);
      }).join("")}</div>
      <p class="hint">Grundbedarf inkl. Alltag: <b>${num(tdee)} kcal</b> · Grundumsatz in Ruhe: <b>${num(bmrOf(p))} kcal</b></p>`;
    },
    bind(){
      $$("#ob-body .tile").forEach(t => t.onclick = () => {
        S.draft.goal = t.dataset.id;
        $$("#ob-body .tile").forEach(x => x.classList.toggle("sel", x === t));
      });
    },
    read(){ return S.draft.goal ? null : "Bitte ein Ziel auswählen."; }
  },
  {
    eyebrow:"Schritt 3 von 4", title:"Was bewegst du gern?",
    sub:"Deine Favoriten stehen beim Eintragen ganz oben. Die Werte gelten für dein Gewicht.",
    render(){
      const kg = S.draft.weight || 75;
      return groupedChips(ACTIVITIES, S.draft.activities,
        a => `${kcalPerHour(a.met, kg)} kcal/h`);
    },
    bind(){ bindChips("activities"); },
    read(){ return S.draft.activities.length ? null : "Wähle mindestens eine Aktivität."; }
  },
  {
    eyebrow:"Schritt 4 von 4", title:"Was isst du gern?",
    sub:"Damit du Lieblingsgerichte mit einem Tipp erfassen kannst.",
    render(){
      return groupedChips(FOODS, S.draft.foods, f => `${f.k} kcal/100 g`);
    },
    bind(){ bindChips("foods"); },
    read(){ return S.draft.foods.length ? null : "Wähle mindestens ein Lebensmittel."; }
  }
];

function tileHTML(id, ttl, sub, val, sel){
  return `<button class="tile ${sel?"sel":""}" data-id="${id}">
    <span class="t-txt"><span class="t-ttl">${esc(ttl)}</span>${sub?`<span class="t-sub">${esc(sub)}</span>`:""}</span>
    ${val?`<span class="t-val">${val}</span>`:""}
    <span class="check">${ICON.check}</span></button>`;
}
function groupedChips(list, selected, label){
  const groups = [...new Set(list.map(x => x.g))];
  return groups.map(g => `
    <p class="group-label">${g}</p>
    <div class="chips">${list.filter(x => x.g === g).map(x =>
      `<button class="chip ${selected.includes(x.id)?"sel":""}" data-id="${x.id}">${esc(x.n)} <em>${label(x)}</em></button>`
    ).join("")}</div>`).join("");
}
function bindChips(key){
  $$("#ob-body .chip").forEach(c => c.onclick = () => {
    const id = c.dataset.id, arr = S.draft[key];
    const i = arr.indexOf(id);
    if (i > -1) arr.splice(i,1); else arr.push(id);
    c.classList.toggle("sel", i === -1);
  });
}

function renderOb(){
  const st = OB[S.obStep];
  $("#ob-eyebrow").textContent = st.eyebrow;
  $("#ob-title").textContent   = st.title;
  $("#ob-sub").textContent     = st.sub;
  $("#ob-body").innerHTML      = st.render();
  st.bind();
  $$("#ob-steps i").forEach((i, n) => i.classList.toggle("done", n <= S.obStep));
  $("#ob-next").textContent = S.obStep === OB.length-1 ? "Los geht's" : "Weiter";
  $("#ob-back").style.display = S.obStep ? "" : "none";
  $("#ob-body").scrollTop = 0;
}

$("#ob-next").onclick = async () => {
  const err = OB[S.obStep].read();
  if (err) { toast(err); return; }
  if (S.obStep < OB.length-1){ S.obStep++; renderOb(); return; }

  $("#ob-next").disabled = true;
  S.profile = { ...S.draft, onboarded:true, createdAt: Date.now() };
  try {
    await saveProfile();
    await loadDay();
    renderHome();
    screen("s-home");
    setTimeout(maybeShowInstall, 1500);
  } catch {
    toast("Speichern fehlgeschlagen. Prüfe deine Verbindung.");
  } finally { $("#ob-next").disabled = false; }
};
$("#ob-back").onclick = () => { if (S.obStep){ S.obStep--; renderOb(); } };

/* ─────────────────  9. HOME  ───────────────── */

function renderHome(){
  const t = totals();
  const d = new Date();
  $("#h-date").textContent = d.toLocaleDateString("de-DE",
    { weekday:"long", day:"numeric", month:"long" });

  const over = t.left < 0;
  $("#h-left").textContent = num(Math.abs(t.left));
  $("#h-left").classList.toggle("over", over);
  $("#h-left-label").textContent = over ? "kcal über dem Budget" : "kcal übrig heute";

  const pct = Math.min(100, t.budget > 0 ? (t.eaten / t.budget) * 100 : 0);
  const rail = $("#h-rail");
  rail.style.width = pct + "%";
  rail.classList.toggle("over", over);

  $("#h-eaten").textContent  = `${num(t.eaten)} gegessen`;
  $("#h-budget").textContent = `${num(t.budget)} Budget`;
  $("#h-tdee").textContent   = num(t.tdee);
  $("#h-moved").textContent  = "+" + num(t.moved);
  $("#h-eaten2").textContent = num(t.eaten);

  const entries = [
    ...S.day.meals.map(m => ({ ...m, kind:"meals" })),
    ...S.day.workouts.map(w => ({ ...w, kind:"workouts" }))
  ].sort((a,b) => b.t.localeCompare(a.t));

  $("#h-log").innerHTML = `
    <div class="log-head"><span class="eyebrow">Heute erfasst</span>
      <span class="eyebrow">${entries.length || ""}</span></div>
    ${entries.length ? entries.map(e => {
      const mv = e.kind === "workouts";
      return `<div class="item">
        <span class="ic ${mv?"mv":""}">${mv?ICON.bolt:ICON.fork}</span>
        <span class="t-txt"><span class="t-ttl">${esc(e.name)}</span>
          <span class="t-sub">${esc(e.detail || "")} · ${e.t}</span></span>
        <span class="kc ${mv?"mv":""}">${mv?"+":""}${num(e.kcal)}</span>
        <button class="del" data-kind="${e.kind}" data-id="${e.id}" aria-label="Eintrag löschen">${ICON.trash}</button>
      </div>`;
    }).join("") : `<p class="log-empty">Noch nichts erfasst. Fang mit einem Foto an.</p>`}`;

  $$("#h-log .del").forEach(b => b.onclick = () => delEntry(b.dataset.kind, b.dataset.id));
}

/* ─────────────────  10. SHEET-SYSTEM  ───────────────── */

function openSheet(title, body, foot){
  $("#sheet-title").textContent = title;
  $("#sheet-body").innerHTML    = body;
  $("#sheet-foot").innerHTML    = foot || "";
  $("#sheet-wrap").classList.add("on");
  $("#sheet-body").scrollTop = 0;
}
function closeSheet(){ $("#sheet-wrap").classList.remove("on"); }
$("#scrim").onclick = closeSheet;
$("#sheet-close").onclick = closeSheet;
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

/* ─────────────────  11. FOTO → CLAUDE  ───────────────── */

let photoData = null;   // { base64, mime, url }
let photoNote = "";     // bleibt beim Wechseln des Fotos erhalten

$("#a-photo").onclick = () => { photoData = null; photoNote = ""; openPhotoSheet(); };

function openPhotoSheet(){
  openSheet("Meal erfassen", `
    <button type="button" class="shot ${photoData?"has":""}" id="ph-slot">
      ${photoData
        ? `<img class="preview" src="${photoData.url}" alt="Aufgenommene Mahlzeit">
           <span class="swap">${ICON.swap} Ändern</span>`
        : `<span class="drop">${ICON.cam}
             <b>Foto aufnehmen oder hochladen</b>
             <small>Tippen zum Auswählen — oder einfach unten beschreiben, was du gegessen hast.</small>
           </span>`}
    </button>

    <div class="field" style="margin-top:16px">
      <label for="ph-note">${photoData ? "Zusatz-Info (optional)" : "Beschreibung"}</label>
      <textarea id="ph-note" rows="3" placeholder="${photoData
        ? "z. B. nur die halbe Portion, dazu noch ein Ei"
        : "z. B. zwei Scheiben Vollkornbrot mit Käse, dazu ein Apfel"}">${esc(photoNote)}</textarea>
    </div>
    <div id="ph-out"></div>
  `, `<button class="btn btn-primary" id="ph-go">Analysieren</button>`);

  // Rahmen selbst öffnet den nativen Auswahldialog (Kamera oder Mediathek)
  $("#ph-slot").onclick = () => $("#file-pick").click();

  const note = $("#ph-note");
  const sync = () => {
    photoNote = note.value;
    // Analyse braucht entweder ein Bild oder eine Beschreibung
    $("#ph-go").disabled = !photoData && !note.value.trim();
  };
  note.oninput = sync;
  sync();

  $("#ph-go").onclick = analyzeMeal;
}

$("#file-pick").onchange = async e => {
  const input = e.target, file = input.files?.[0];
  input.value = "";
  if (!file) return;
  photoNote = $("#ph-note")?.value || photoNote;
  try {
    photoData = await compress(file);
    openPhotoSheet();
  } catch { toast("Das Bild konnte nicht gelesen werden."); }
};

/* Verkleinern spart Tokens und damit direkt API-Kosten. */
function compress(file, max = 1024, quality = 0.75){
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width  = Math.round(img.width  * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL("image/jpeg", quality);
      URL.revokeObjectURL(img.src);
      res({ url, mime:"image/jpeg", base64:url.split(",")[1] });
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

async function analyzeMeal(){
  const note = $("#ph-note").value.trim();
  if (!photoData && !note) return;

  photoNote = note;
  $("#ph-go").disabled = true;
  $("#ph-out").innerHTML = `<div class="analyzing"><span class="spin"></span>${
    photoData ? "Claude schaut sich dein Essen an …" : "Claude rechnet deine Beschreibung durch …"}</div>`;

  try {
    const r = await fetch(ANALYZE_ENDPOINT, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(photoData
        ? { image: photoData.base64, mime: photoData.mime, note }
        : { note })
    });

    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("application/json")){
      // Kommt HTML zurück, existiert /api/analyze auf dem Server nicht.
      throw new Error(`Der Endpunkt ${ANALYZE_ENDPOINT} liefert kein JSON (HTTP ${r.status}). Liegt die Datei api/analyze.js im Projekt-Root?`);
    }

    const data = await r.json();
    if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
    showResult(data);
  } catch (e) {
    $("#ph-out").innerHTML = `<div class="analyzing" style="color:#B42318; align-items:flex-start; line-height:1.45">
      <span style="flex:1">Die Analyse hat nicht geklappt.<br>
      <span style="font-weight:550; font-size:13.5px; color:var(--ink-2)">${esc(e.message || "Unbekannter Fehler")}</span></span></div>`;
    $("#ph-go").disabled = false;
  }
}

function showResult(d){
  const items = Array.isArray(d.items) ? d.items : [];
  const total = Math.round(d.total_kcal || items.reduce((a,i) => a + (i.kcal||0), 0));
  const conf  = { hoch:"Klar erkannt", mittel:"Portion geschätzt", niedrig:"Grobe Schätzung" }[d.confidence] || "";

  // Foto schrumpft auf Thumbnail-Größe, damit die Zahlen im Vordergrund stehen
  $("#sheet-title").textContent = "Erkannt";
  $("#sheet-body").innerHTML = `
    <div class="res-top">
      ${photoData
        ? `<img class="res-thumb" src="${photoData.url}" alt="">`
        : `<span class="res-thumb alt">${ICON.fork}</span>`}
      <span class="tx"><b>${esc(d.title || "Mahlzeit")}</b>
        <span>${esc([conf, d.note].filter(Boolean).join(" · "))}</span></span>
    </div>

    <div class="res-edit">
      <label for="ph-fix">Gesamt</label>
      <input id="ph-fix" type="number" inputmode="numeric" value="${total}" aria-label="Kalorien anpassen">
      <span class="u">kcal</span>
    </div>

    ${items.length ? `<div class="glass res-items" style="margin-top:12px">${items.map(i =>
      `<div class="res-item"><span style="color:var(--ink)">${esc(i.name)} <span>${esc(i.amount||"")}</span></span>
       <b>${num(i.kcal||0)}</b></div>`).join("")}</div>` : ""}

    <p class="hint" style="text-align:center; margin-top:12px">Zahl antippen, um sie zu korrigieren.</p>`;

  $("#sheet-foot").innerHTML = `
    <button class="btn btn-primary" id="ph-save">Eintragen</button>
    <button class="btn btn-ghost" id="ph-retry">Nochmal anpassen</button>`;

  $("#sheet-body").scrollTop = 0;

  $("#ph-save").onclick = async () => {
    const kcal = Math.max(0, +$("#ph-fix").value || 0);
    await addEntry("meals", {
      name: d.title || "Mahlzeit",
      detail: items.map(i => i.name).slice(0,3).join(", ") || (photoData ? "per Foto erfasst" : "per Beschreibung"),
      kcal, src:"photo"
    });
    closeSheet();
    toast(`${num(kcal)} kcal eingetragen`);
  };
  $("#ph-retry").onclick = () => openPhotoSheet();
}

/* ─────────────────  12. MANUELLE MAHLZEIT  ───────────────── */

$("#a-manual").onclick = () => openManual();

function openManual(){
  const favs  = FOODS.filter(f => S.profile.foods.includes(f.id));
  const rest  = FOODS.filter(f => !S.profile.foods.includes(f.id));
  const list  = arr => arr.map(f =>
    `<button class="qitem" data-id="${f.id}">
       <span class="t-txt"><span class="t-ttl">${esc(f.n)}</span>
         <span class="t-sub">${f.k} kcal / 100 g</span></span>
       <span class="t-val">${Math.round(f.k*f.p/100)} kcal<br><span style="font-weight:600;color:var(--ink-3);font-size:12px">${f.p} g</span></span>
     </button>`).join("");

  openSheet("Meal eintragen", `
    <div class="seg"><button class="on" data-tab="fav">Favoriten</button>
      <button data-tab="all">Alle</button><button data-tab="free">Frei</button></div>

    <div data-pane="fav"><div class="quick">${favs.length?list(favs):`<p class="log-empty">Keine Favoriten gewählt.</p>`}</div></div>

    <div data-pane="all" hidden>
      <div class="field search"><input id="mn-search" type="text" placeholder="Lebensmittel suchen"></div>
      <div class="quick" id="mn-list">${list(rest)}</div>
    </div>

    <div data-pane="free" hidden>
      <div class="field"><label for="mn-name">Bezeichnung</label>
        <input id="mn-name" type="text" placeholder="z. B. McNuggets"></div>
      <div class="field"><label for="mn-kcal">Kalorien</label>
        <input id="mn-kcal" type="number" inputmode="numeric" placeholder="650"></div>
      <button class="btn btn-primary" id="mn-free">Eintragen</button>
    </div>
  `);

  $$("#sheet-body .seg button").forEach(b => b.onclick = () => {
    $$("#sheet-body .seg button").forEach(x => x.classList.toggle("on", x === b));
    $$("#sheet-body [data-pane]").forEach(p => p.hidden = p.dataset.pane !== b.dataset.tab);
  });

  $("#mn-search").oninput = e => {
    const q = e.target.value.toLowerCase().trim();
    $("#mn-list").innerHTML = list(rest.filter(f => f.n.toLowerCase().includes(q)));
    bindFoods();
  };

  $("#mn-free").onclick = async () => {
    const name = $("#mn-name").value.trim() || "Mahlzeit";
    const kcal = +$("#mn-kcal").value;
    if (!(kcal > 0)) { toast("Bitte eine Kalorienzahl eintragen."); return; }
    await addEntry("meals", { name, detail:"manuell", kcal:Math.round(kcal), src:"manual" });
    closeSheet(); toast(`${num(kcal)} kcal eingetragen`);
  };

  bindFoods();
}

function bindFoods(){
  $$("#sheet-body .qitem").forEach(b => b.onclick = () => {
    const f = FOODS.find(x => x.id === b.dataset.id);
    openPortion(f);
  });
}

function openPortion(f){
  openSheet(f.n, `
    <div class="field"><label for="pt-g">Menge in Gramm</label>
      <input id="pt-g" type="number" inputmode="numeric" value="${f.p}"></div>
    <div class="res-total" style="margin-top:4px">
      <span style="font-weight:650">${f.k} kcal / 100 g</span><b id="pt-k">${Math.round(f.k*f.p/100)}</b></div>
  `, `<button class="btn btn-primary" id="pt-save">Eintragen</button>
      <button class="btn btn-ghost" id="pt-back">Zurück</button>`);

  const calc = () => Math.round(f.k * (+$("#pt-g").value || 0) / 100);
  $("#pt-g").oninput = () => $("#pt-k").textContent = num(calc());
  $("#pt-save").onclick = async () => {
    const kcal = calc();
    if (!kcal) { toast("Bitte eine Menge eintragen."); return; }
    await addEntry("meals", { name:f.n, detail:`${$("#pt-g").value} g`, kcal, src:"db" });
    closeSheet(); toast(`${num(kcal)} kcal eingetragen`);
  };
  $("#pt-back").onclick = openManual;
}

/* ─────────────────  13. TRAINING  ───────────────── */

$("#a-train").onclick = () => openTraining();

function openTraining(){
  const kg   = S.profile.weight;
  const favs = ACTIVITIES.filter(a => S.profile.activities.includes(a.id));
  const rest = ACTIVITIES.filter(a => !S.profile.activities.includes(a.id));
  const list = arr => arr.map(a =>
    `<button class="qitem" data-id="${a.id}">
       <span class="t-txt"><span class="t-ttl">${esc(a.n)}</span>
         <span class="t-sub">${kcalPerHour(a.met,kg)} kcal pro Stunde</span></span>
       <span class="t-val">${Math.round(kcalPerHour(a.met,kg)/2)} kcal<br><span style="font-weight:600;color:var(--ink-3);font-size:12px">30 min</span></span>
     </button>`).join("");

  openSheet("Training erfassen", `
    <div class="seg"><button class="on" data-tab="fav">Favoriten</button>
      <button data-tab="all">Alle</button><button data-tab="free">Frei</button></div>

    <div data-pane="fav"><div class="quick">${favs.length?list(favs):`<p class="log-empty">Keine Favoriten gewählt.</p>`}</div></div>
    <div data-pane="all" hidden><div class="quick">${list(rest)}</div></div>

    <div data-pane="free" hidden>
      <div class="field"><label for="tr-name">Bezeichnung</label>
        <input id="tr-name" type="text" placeholder="z. B. Fußballtraining"></div>
      <div class="field"><label for="tr-kcal">Verbrannte Kalorien</label>
        <input id="tr-kcal" type="number" inputmode="numeric" placeholder="420"></div>
      <button class="btn btn-primary" id="tr-free">Eintragen</button>
    </div>
  `);

  $$("#sheet-body .seg button").forEach(b => b.onclick = () => {
    $$("#sheet-body .seg button").forEach(x => x.classList.toggle("on", x === b));
    $$("#sheet-body [data-pane]").forEach(p => p.hidden = p.dataset.pane !== b.dataset.tab);
  });

  $("#tr-free").onclick = async () => {
    const name = $("#tr-name").value.trim() || "Training";
    const kcal = +$("#tr-kcal").value;
    if (!(kcal > 0)) { toast("Bitte eine Kalorienzahl eintragen."); return; }
    await addEntry("workouts", { name, detail:"manuell", kcal:Math.round(kcal) });
    closeSheet(); toast(`+${num(kcal)} kcal gutgeschrieben`);
  };

  $$("#sheet-body .qitem").forEach(b => b.onclick = () =>
    openDuration(ACTIVITIES.find(a => a.id === b.dataset.id)));
}

function openDuration(a){
  const kg = S.profile.weight, perH = kcalPerHour(a.met, kg);
  openSheet(a.n, `
    <div class="field"><label for="tr-min">Dauer in Minuten</label>
      <input id="tr-min" type="number" inputmode="numeric" value="45"></div>
    <div class="chips" style="margin-bottom:16px">
      ${[15,30,45,60,90].map(m => `<button class="chip" data-m="${m}">${m} min</button>`).join("")}
    </div>
    <div class="res-total"><span style="font-weight:650">${perH} kcal pro Stunde</span>
      <b id="tr-k">${Math.round(perH*0.75)}</b></div>
  `, `<button class="btn btn-primary" id="tr-save">Eintragen</button>
      <button class="btn btn-ghost" id="tr-back">Zurück</button>`);

  const calc = () => Math.round(perH * (+$("#tr-min").value || 0) / 60);
  const sync = () => $("#tr-k").textContent = num(calc());
  $("#tr-min").oninput = sync;
  $$("#sheet-body .chip").forEach(c => c.onclick = () => { $("#tr-min").value = c.dataset.m; sync(); });

  $("#tr-save").onclick = async () => {
    const kcal = calc();
    if (!kcal) { toast("Bitte eine Dauer eintragen."); return; }
    await addEntry("workouts", { name:a.n, detail:`${$("#tr-min").value} min`, kcal });
    closeSheet(); toast(`+${num(kcal)} kcal gutgeschrieben`);
  };
  $("#tr-back").onclick = openTraining;
}

/* ─────────────────  14. EINSTELLUNGEN  ───────────────── */

$("#h-settings").onclick = () => openSettings();

function openSettings(){
  const p = S.profile;
  openSheet("Einstellungen", `
    <div class="settings-grp">
      <p class="eyebrow">Körperdaten</p>
      <div class="row">
        <div class="field"><label for="st-w">Gewicht (kg)</label>
          <input id="st-w" type="number" inputmode="decimal" step="0.1" value="${p.weight}"></div>
        <div class="field"><label for="st-h">Größe (cm)</label>
          <input id="st-h" type="number" inputmode="numeric" value="${p.height}"></div>
      </div>
      <div class="row">
        <div class="field"><label for="st-a">Alter</label>
          <input id="st-a" type="number" inputmode="numeric" value="${p.age}"></div>
        <div class="field"><label for="st-s">Geschlecht</label>
          <select id="st-s"><option value="m" ${p.sex==="m"?"selected":""}>Männlich</option>
            <option value="w" ${p.sex==="w"?"selected":""}>Weiblich</option></select></div>
      </div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Alltag</p>
      <div class="tiles" data-set="lifestyle">
        ${LIFESTYLE.map(l => tileHTML(l.id, l.n, l.s, "", p.lifestyle===l.id)).join("")}
      </div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Ziel</p>
      <div class="tiles" data-set="goal">
        ${GOALS.map(g => tileHTML(g.id, g.n, g.s, "", p.goal===g.id)).join("")}
      </div>
      <p class="hint" id="st-preview"></p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Lieblings-Aktivitäten</p>
      <div id="st-acts">${groupedChips(ACTIVITIES, p.activities, a => `${kcalPerHour(a.met,p.weight)} kcal/h`)}</div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Lieblings-Lebensmittel</p>
      <div id="st-foods">${groupedChips(FOODS, p.foods, f => `${f.k} kcal/100 g`)}</div>
    </div>
  `, `<button class="btn btn-primary" id="st-save">Speichern</button>
      <button class="btn btn-ghost" id="st-out" style="color:var(--ink-3)">Abmelden</button>`);

  const draft = { ...p, activities:[...p.activities], foods:[...p.foods] };

  const preview = () => {
    draft.weight = +$("#st-w").value || draft.weight;
    draft.height = +$("#st-h").value || draft.height;
    draft.age    = +$("#st-a").value || draft.age;
    draft.sex    = $("#st-s").value;
    $("#st-preview").innerHTML =
      `Neues Tagesbudget: <b>${num(targetOf(draft))} kcal</b> · Grundbedarf ${num(tdeeOf(draft))} kcal`;
  };
  ["#st-w","#st-h","#st-a","#st-s"].forEach(s => $(s).oninput = preview);
  preview();

  $$("#sheet-body .tiles").forEach(box => {
    const key = box.dataset.set;
    $$(".tile", box).forEach(t => t.onclick = () => {
      draft[key] = t.dataset.id;
      $$(".tile", box).forEach(x => x.classList.toggle("sel", x === t));
      preview();
    });
  });

  const toggle = (sel, key) => $$(`${sel} .chip`).forEach(c => c.onclick = () => {
    const i = draft[key].indexOf(c.dataset.id);
    if (i > -1) draft[key].splice(i,1); else draft[key].push(c.dataset.id);
    c.classList.toggle("sel", i === -1);
  });
  toggle("#st-acts","activities");
  toggle("#st-foods","foods");

  $("#st-save").onclick = async () => {
    preview();
    if (!(draft.weight >= 30 && draft.weight <= 300)) { toast("Gewicht zwischen 30 und 300 kg eintragen."); return; }
    if (!(draft.height >= 120 && draft.height <= 230)) { toast("Größe zwischen 120 und 230 cm eintragen."); return; }
    if (!(draft.age >= 14 && draft.age <= 100)) { toast("Alter zwischen 14 und 100 Jahren eintragen."); return; }
    S.profile = { ...S.profile, ...draft };
    try { await saveProfile(); } catch { toast("Speichern fehlgeschlagen."); return; }
    renderHome(); closeSheet(); toast("Einstellungen gespeichert");
  };
  $("#st-out").onclick = () => { closeSheet(); signOut(auth); };
}

/* Tageswechsel abfangen, wenn die App im Hintergrund lag */
document.addEventListener("visibilitychange", async () => {
  if (!document.hidden && S.uid && S.profile && S.dayKey !== todayKey()){
    await loadDay(); renderHome();
  }
});

/* ─────────────────  15. INSTALLATIONS-HINWEIS  ───────────────── */

let installPrompt = null;
const DISMISS_KEY = "fitten-install-dismissed";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  installPrompt = e;
  maybeShowInstall();
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  $("#install").classList.remove("on");
});

function maybeShowInstall(){
  const box = $("#install");
  if (!S.uid || isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

  const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (installPrompt){
    $("#install-t").textContent = "FITTEN.ME installieren";
    $("#install-s").textContent = "Als eigene App auf dem Startbildschirm.";
    $("#install-go").hidden = false;
  } else if (iOS){
    $("#install-t").textContent = "Auf den Homescreen legen";
    $("#install-s").textContent = "Teilen-Symbol antippen, dann „Zum Home-Bildschirm“.";
    $("#install-go").hidden = true;
  } else {
    return;   // Browser kann nicht installieren – kein Hinweis
  }
  box.classList.add("on");
}

$("#install-go").onclick = async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;
  installPrompt = null;
  if (outcome === "accepted") $("#install").classList.remove("on");
};

$("#install-x").onclick = () => {
  $("#install").classList.remove("on");
  try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
};
