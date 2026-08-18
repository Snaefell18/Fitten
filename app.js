/* ══════════════════════════════════════════════════════════════════
   PULSE — Kalorien & Training
   index.html + app.js  ·  Firebase Auth/Firestore  ·  Claude Vision
   ══════════════════════════════════════════════════════════════════ */

/* ─────────────────  1. KONFIGURATION  ───────────────── */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-06XiwTmKQeV2RRF_lPeMqmjHNfeFSC4",
  authDomain: "fitten-me.firebaseapp.com",
  projectId: "fitten-me",
  storageBucket: "fitten-me.firebasestorage.app",
  messagingSenderId: "419221842511",
  appId: "1:419221842511:web:859e758a5b80b13ffdd83a"
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

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Initialize Firebase
const app   = initializeApp(firebaseConfig);
const auth  = getAuth(app);
const db    = getFirestore(app);
const gprov = new GoogleAuthProvider();

/* ─────────────────  4. STATE & HELFER  ───────────────── */

const S = { uid:null, profile:null, day:null, dayKey:null, obStep:0, draft:{} };

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
    screen("s-login");
    $("#boot").classList.add("off");
    return;
  }
  S.uid = user.uid;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists() && snap.data().onboarded){
    S.profile = snap.data();
    await loadDay();
    // renderHome(); // Angenommen, diese Funktion existiert weiter unten im Originalcode
    screen("s-home");
  } else {
    S.draft = { sex:"m", lifestyle:"mid", goal:"cut1", activities:[], foods:[] };
    S.obStep = 0;
    renderOb();
    screen("s-ob");
  }
  $("#boot").classList.add("off");
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
  // renderHome(); // Angenommen, diese Funktion existiert weiter unten im Originalcode
  try { await saveDay(); } catch { toast("Offline gespeichert – Sync folgt."); }
}
async function delEntry(kind, id){
  S.day[kind] = S.day[kind].filter(e => e.id !== id);
  // renderHome(); // Angenommen, diese Funktion existiert weiter unten im Originalcode
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
  
  if (S.obStep < OB.length-1){
    S.obStep++;
    renderOb();
  } else {
    S.profile = { ...S.draft, onboarded:true };
    await saveProfile();
    await loadDay();
    // renderHome();
    screen("s-home");
    toast("Willkommen bei PULSE!");
  }
};

$("#ob-back").onclick = () => {
  if(S.obStep > 0) {
    S.obStep--;
    renderOb();
  }
};

/* ─────────────────  9. SHEET / PORTION HELFER  ───────────────── */

function openSheet(title, body, footer = "") {
  const s = document.createElement("div");
  s.className = "sheet-overlay";
  s.innerHTML = `
    <div class="sheet">
      <div class="sheet-header">
        <h3>${esc(title)}</h3>
        <button class="sheet-close">&times;</button>
      </div>
      <div class="sheet-body" id="sheet-body">${body}</div>
      ${footer ? `<div class="sheet-footer">${footer}</div>` : ""}
    </div>
  `;
  document.body.appendChild(s);
  
  // Animation delay für weiches Einblenden
  requestAnimationFrame(() => s.classList.add("open"));
  
  s.querySelector(".sheet-close").onclick = closeSheet;
  s.onclick = (e) => { if(e.target === s) closeSheet(); }
}

function closeSheet() {
  const s = document.querySelector(".sheet-overlay");
  if(s) {
    s.classList.remove("open");
    setTimeout(() => s.remove(), 300); // Wait for transition
  }
}

// ── HIER IST DIE FUNKTION, DIE IN DEINEM CODE ABGESCHNITTEN WAR ──

function openPortion(f){
  openSheet(f.n, `
    <div class="field"><label for="pt-g">Menge in Gramm</label>
      <input id="pt-g" type="number" inputmode="numeric" value="${f.p}"></div>
    <div class="res-total" style="margin-top:4px">
      <span style="font-weight:650">Ergibt</span><b id="pt-res">${Math.round((f.k * f.p) / 100)} kcal</b>
    </div>
  `, `<button class="btn btn-primary" id="pt-go">Eintragen</button>`);
  
  const inp = $("#pt-g");
  const res = $("#pt-res");
  
  inp.oninput = () => {
    const g = +inp.value || 0;
    res.textContent = Math.round((f.k * g) / 100) + " kcal";
  };
  
  $("#pt-go").onclick = async () => {
    const g = +inp.value;
    if (!(g > 0)) { toast("Bitte eine gültige Menge eingeben."); return; }
    const kcal = Math.round((f.k * g) / 100);
    
    await addEntry("meals", { name: f.n, detail: g + " g", kcal, src: "manual" });
    closeSheet();
    toast(`${num(kcal)} kcal eingetragen`);
  };
}

/* ─────────────────  10. TRAINING HELFER (BONUS)  ───────────────── */

function openActivity(a) {
  const kg = S.profile?.weight || 75;
  const kph = kcalPerHour(a.met, kg);
  
  openSheet(a.n, `
    <div class="field"><label for="ac-m">Dauer in Minuten</label>
      <input id="ac-m" type="number" inputmode="numeric" value="30"></div>
    <div class="res-total" style="margin-top:4px">
      <span style="font-weight:650">Verbrauch</span><b id="ac-res">${Math.round(kph * 0.5)} kcal</b>
    </div>
  `, `<button class="btn btn-primary" id="ac-go">Eintragen</button>`);

  const inp = $("#ac-m");
  const res = $("#ac-res");
  
  inp.oninput = () => {
    const m = +inp.value || 0;
    res.textContent = Math.round(kph * (m / 60)) + " kcal";
  };

  $("#ac-go").onclick = async () => {
    const m = +inp.value;
    if (!(m > 0)) { toast("Bitte gültige Dauer eingeben."); return; }
    const kcal = Math.round(kph * (m / 60));
    
    await addEntry("workouts", { name: a.n, detail: m + " min", kcal, src: "manual" });
    closeSheet();
    toast(`${num(kcal)} kcal verbrannt`);
  };
}
