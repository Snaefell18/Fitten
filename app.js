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
  { g:"Protein",     id:"skyr",     n:"Skyr natur",          k:63,  p:150, d:"veg", pr:11, ch:4, fa:0.2 },
  { g:"Protein",     id:"quark",    n:"Magerquark",          k:67,  p:250, d:"veg", pr:12, ch:4.1, fa:0.3 },
  { g:"Protein",     id:"chicken",  n:"Hähnchenbrust",       k:165, p:150, d:"meat", pr:31, ch:0, fa:3.6 },
  { g:"Protein",     id:"beef",     n:"Rinderhack 20 %",     k:220, p:150, d:"meat", pr:18, ch:0, fa:16 },
  { g:"Protein",     id:"salmon",   n:"Lachs",               k:208, p:140, d:"pesc", pr:20, ch:0, fa:13 },
  { g:"Protein",     id:"tuna",     n:"Thunfisch (Wasser)",  k:116, p:130, d:"pesc", pr:26, ch:0, fa:1 },
  { g:"Protein",     id:"egg",      n:"Ei",                  k:155, p:60, d:"veg", pr:13, ch:1.1, fa:11 },
  { g:"Protein",     id:"whey",     n:"Whey Shake",          k:380, p:30, d:"veg", pr:75, ch:8, fa:5 },
  { g:"Protein",     id:"tofu",     n:"Tofu",                k:145, p:150, d:"vegan", pr:15, ch:3, fa:8 },

  { g:"Sättigung",   id:"pasta",    n:"Nudeln gekocht",      k:158, p:250, d:"vegan", pr:5.8, ch:30, fa:0.9 },
  { g:"Sättigung",   id:"rice",     n:"Reis gekocht",        k:130, p:200, d:"vegan", pr:2.7, ch:28, fa:0.3 },
  { g:"Sättigung",   id:"potato",   n:"Kartoffeln",          k:87,  p:250, d:"vegan", pr:2, ch:20, fa:0.1 },
  { g:"Sättigung",   id:"sweetpot", n:"Süßkartoffel",        k:90,  p:200, d:"vegan", pr:2, ch:21, fa:0.1 },
  { g:"Sättigung",   id:"oats",     n:"Haferflocken",        k:372, p:60, d:"vegan", pr:13, ch:62, fa:7 },
  { g:"Sättigung",   id:"bread",    n:"Vollkornbrot",        k:230, p:60, d:"vegan", pr:8, ch:41, fa:3 },
  { g:"Sättigung",   id:"toast",    n:"Toastbrot",           k:265, p:50, d:"vegan", pr:8, ch:49, fa:3.5 },
  { g:"Sättigung",   id:"couscous", n:"Couscous gekocht",    k:112, p:200, d:"vegan", pr:3.8, ch:23, fa:0.2 },
  { g:"Sättigung",   id:"beans",    n:"Kidneybohnen",        k:100, p:150, d:"vegan", pr:7, ch:15, fa:0.5 },

  { g:"Fast Food",   id:"nuggets",  n:"McNuggets",           k:296, p:105, d:"meat", pr:15, ch:16, fa:19 },
  { g:"Fast Food",   id:"bigmac",   n:"Big Mac",             k:257, p:220, d:"meat", pr:12, ch:20, fa:14 },
  { g:"Fast Food",   id:"cheeseb",  n:"Cheeseburger",        k:263, p:115, d:"meat", pr:14, ch:26, fa:11 },
  { g:"Fast Food",   id:"fries",    n:"Pommes",              k:312, p:150, d:"vegan", pr:3.4, ch:41, fa:15 },
  { g:"Fast Food",   id:"pizza",    n:"Pizza Margherita",    k:250, p:300, d:"veg", pr:11, ch:30, fa:9 },
  { g:"Fast Food",   id:"doener",   n:"Döner",               k:215, p:350, d:"meat", pr:14, ch:16, fa:10 },
  { g:"Fast Food",   id:"curry",    n:"Currywurst",          k:240, p:180, d:"meat", pr:11, ch:12, fa:17 },
  { g:"Fast Food",   id:"sushi",    n:"Sushi",               k:145, p:250, d:"pesc", pr:6, ch:25, fa:2 },

  { g:"Obst & Gemüse",id:"banana",  n:"Banane",              k:89,  p:120 , d:"vegan", pr:1.1, ch:23, fa:0.3 },
  { g:"Obst & Gemüse",id:"apple",   n:"Apfel",               k:52,  p:150 , d:"vegan", pr:0.3, ch:14, fa:0.2 },
  { g:"Obst & Gemüse",id:"berries", n:"Beeren",              k:45,  p:150 , d:"vegan", pr:0.9, ch:9, fa:0.4 },
  { g:"Obst & Gemüse",id:"avocado", n:"Avocado",             k:160, p:100 , d:"vegan", pr:2, ch:2, fa:15 },
  { g:"Obst & Gemüse",id:"broccoli",n:"Brokkoli",            k:34,  p:200 , d:"vegan", pr:2.8, ch:4, fa:0.4 },
  { g:"Obst & Gemüse",id:"tomato",  n:"Tomaten",             k:18,  p:150 , d:"vegan", pr:0.9, ch:3.2, fa:0.2 },
  { g:"Obst & Gemüse",id:"cucumber",n:"Gurke",               k:15,  p:150 , d:"vegan", pr:0.7, ch:2.2, fa:0.1 },
  { g:"Obst & Gemüse",id:"carrot",  n:"Karotten",            k:41,  p:150 , d:"vegan", pr:0.9, ch:8, fa:0.2 },
  { g:"Obst & Gemüse",id:"salad",   n:"Blattsalat",          k:15,  p:100 , d:"vegan", pr:1.4, ch:1.5, fa:0.2 },

  { g:"Milch & Fett", id:"milk",    n:"Milch 3,5 %",         k:64,  p:200, d:"veg", pr:3.3, ch:4.8, fa:3.5 },
  { g:"Milch & Fett", id:"yogurt",  n:"Joghurt natur",       k:61,  p:150, d:"veg", pr:3.5, ch:4.7, fa:3.3 },
  { g:"Milch & Fett", id:"gouda",   n:"Gouda",               k:356, p:30, d:"veg", pr:25, ch:2, fa:27 },
  { g:"Milch & Fett", id:"cream",   n:"Frischkäse",          k:250, p:30, d:"veg", pr:6, ch:3, fa:24 },
  { g:"Milch & Fett", id:"butter",  n:"Butter",              k:741, p:10, d:"veg", pr:0.9, ch:0.1, fa:82 },
  { g:"Milch & Fett", id:"oil",     n:"Olivenöl",            k:884, p:10, d:"vegan", pr:0, ch:0, fa:100 },

  { g:"Snacks",      id:"almonds",  n:"Mandeln",             k:579, p:30, d:"vegan", pr:21, ch:9, fa:50 },
  { g:"Snacks",      id:"choco",    n:"Schokolade",          k:546, p:40, d:"veg", pr:5, ch:59, fa:31 },
  { g:"Snacks",      id:"chips",    n:"Chips",               k:536, p:50, d:"vegan", pr:6, ch:53, fa:33 },
  { g:"Snacks",      id:"haribo",   n:"Fruchtgummi",         k:343, p:50, d:"meat", pr:6.9, ch:77, fa:0.5 },
  { g:"Snacks",      id:"icecream", n:"Eiscreme",            k:207, p:120, d:"veg", pr:3.5, ch:24, fa:11 },
  { g:"Snacks",      id:"bar",      n:"Proteinriegel",       k:350, p:50, d:"veg", pr:32, ch:30, fa:10 },
  { g:"Snacks",      id:"popcorn",  n:"Popcorn",             k:387, p:30, d:"vegan", pr:12, ch:63, fa:10 },

  { g:"Getränke",    id:"cola",     n:"Cola",                k:42,  p:330, d:"vegan", pr:0, ch:10.6, fa:0 },
  { g:"Getränke",    id:"juice",    n:"Orangensaft",         k:45,  p:250, d:"vegan", pr:0.7, ch:10, fa:0.2 },
  { g:"Getränke",    id:"schorle",  n:"Apfelschorle",        k:25,  p:330, d:"vegan", pr:0.1, ch:6, fa:0 },
  { g:"Getränke",    id:"beer",     n:"Bier",                k:43,  p:330, d:"vegan", pr:0.5, ch:3.6, fa:0 },
  { g:"Getränke",    id:"wine",     n:"Wein",                k:83,  p:200, d:"vegan", pr:0.1, ch:2.6, fa:0 },
  { g:"Getränke",    id:"latte",    n:"Latte Macchiato",     k:55,  p:250, d:"veg", pr:3, ch:5, fa:2.5 }
];

const GOALS = [
  { id:"bulk",  n:"Muskelaufbau",               s:"Leichter Überschuss für sauberen Aufbau", f:+0.10 },
  { id:"keep",  n:"Erhaltung",                  s:"Gewicht halten, Leistung stabilisieren",  f: 0.00 },
  { id:"cut1",  n:"Moderate Gewichtsabnahme",   s:"Rund 0,4 kg pro Woche, gut durchhaltbar", f:-0.15 },
  { id:"cut2",  n:"Fortgeschrittene Abnahme",   s:"Rund 0,7 kg pro Woche, mehr Disziplin",   f:-0.22 },
  { id:"manual",n:"Manuell",                    s:"Eigenes Defizit oder Überschuss",         f:null }
];

/* d-Feld je Lebensmittel: die strengste Ernährungsform, in die es passt.
   allow listet auf, welche d-Werte eine Form jeweils zulässt. */
const DIETS = [
  { id:"all",   n:"Alles",        s:"Keine Einschränkungen",     allow:["vegan","veg","pesc","meat"] },
  { id:"pesc",  n:"Pescetarisch", s:"Fisch ja, Fleisch nein",    allow:["vegan","veg","pesc"] },
  { id:"veg",   n:"Vegetarisch",  s:"Kein Fleisch, kein Fisch",  allow:["vegan","veg"] },
  { id:"vegan", n:"Vegan",        s:"Rein pflanzlich",           allow:["vegan"] }
];

const LIFESTYLE = [
  { id:"low",  n:"Überwiegend sitzend", s:"Büro, wenig Wege",              f:1.20 },
  { id:"mid",  n:"Leicht aktiv",        s:"Etwas Bewegung im Alltag",      f:1.30 },
  { id:"high", n:"Aktiv",               s:"Viel auf den Beinen, Handwerk", f:1.45 },
  { id:"manual",n:"Manuell",            s:"Eigener Zuschlag in Kalorien",  f:null }
];

/* ─────────────────  3. FIREBASE  ───────────────── */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut,
  deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const fb    = initializeApp(FIREBASE_CONFIG);
const auth  = getAuth(fb);
const db    = getFirestore(fb);
const gprov = new GoogleAuthProvider();

/* ─────────────────  4. STATE & HELFER  ───────────────── */

const S = { uid:null, profile:null, day:null, dayKey:null, pinned:false, chat:null, obStep:0, draft:{} };

/* Der Boot-Screen bleibt mindestens so lange stehen, dass die Wortmarke
   ihre Einblendung zu Ende spielen kann — sonst blitzt er nur kurz auf. */
const BOOT_MIN_MS = 1850;
const bootStart = Date.now();

/* Die Wortmarke startet erst, wenn der Webfont da ist — sonst wird sie
   erst im Fallback gezeichnet und springt beim Nachladen um. */
(document.fonts ? document.fonts.ready : Promise.resolve())
  .then(() => document.getElementById("boot").classList.add("ready"));
setTimeout(() => document.getElementById("boot").classList.add("ready"), 700);

function hideBoot(){
  setTimeout(() => {
    document.getElementById("boot").classList.add("off");
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
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
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
const DEF_LS_KCAL = 400;    // typischer Alltagszuschlag, wenn nichts gesetzt ist
const DEF_GOAL_KCAL = -500; // klassisches Defizit von rund 0,5 kg pro Woche

function tdeeOf(p){
  if (p.lifestyle === "manual")
    return Math.round(bmrOf(p) + (p.lifestyleKcal ?? DEF_LS_KCAL));
  const l = LIFESTYLE.find(x => x.id === p.lifestyle) || LIFESTYLE[1];
  return Math.round(bmrOf(p) * l.f);
}
/* Harte Untergrenze für eigene Vorgaben. Bewusst niedriger als der
   Grundumsatz — sonst wäre eine manuelle Eingabe wirkungslos, sobald der
   Abzug etwas größer wird. Die Werte entsprechen den üblichen Grenzen,
   unterhalb derer eine Ernährung kaum noch bedarfsdeckend ist. */
const kcalFloor = p => p.sex === "w" ? 1200 : 1500;

function targetOf(p){
  const tdee = tdeeOf(p);
  if (p.goal === "manual")
    return Math.round(Math.max(tdee + (p.goalKcal ?? DEF_GOAL_KCAL), kcalFloor(p)));
  const g = GOALS.find(x => x.id === p.goal) || GOALS[1];
  // Die Vorgaben sind prozentual — hier bleibt der Grundumsatz die Grenze.
  return Math.round(Math.max(tdee * (1 + g.f), bmrOf(p)));
}
// true, wenn die Untergrenze den gewünschten Wert überschreibt
const targetFloored = p =>
  p.goal === "manual" && (tdeeOf(p) + (p.goalKcal ?? DEF_GOAL_KCAL)) < kcalFloor(p);
const kcalPerHour = (met, kg) => Math.round(met * 1.05 * kg);

/* Standardaktivitäten plus eigene. Bei eigenen gibt der Nutzer kcal/h direkt
   an — die skalieren dann bewusst nicht mit dem Körpergewicht, weil der Wert
   von ihm selbst kommt und nicht aus einem MET-Wert abgeleitet ist. */
const allActs  = p => [...ACTIVITIES, ...(p.customActivities || [])];
const kcalHour = (a, kg) => a.custom ? Math.round(a.kcalh) : kcalPerHour(a.met, kg);

/* Makroziele. Automatik: Eiweiß nach Körpergewicht (im Defizit höher, um
   Muskulatur zu halten), Fett auf 27 % der Kalorien, Kohlenhydrate füllen
   den Rest auf. Wer will, setzt eigene Gramm-Werte. */
const PROTEIN_PER_KG = { bulk:2.0, keep:1.8, cut1:2.0, cut2:2.2 };
/* KI-Stufen. Basis nutzt weiter das schnelle Modell, die höheren Stufen
   greifen für Bildanalyse und Vorschläge auf stärkere Modelle zu.
   Welches Modell dahintersteckt, entscheidet der Server. */
const TIERS = [
  { id:"basis",   n:"Basis",   s:"Tracken, ganz einfach" },
  { id:"premium", n:"Premium", s:"Präziser. Klüger. Schneller." },
  { id:"ultra",   n:"Ultra+",  s:"Alles auf Maximum." }
];

const MACROS = [
  { key:"pr", n:"Eiweiß",        kcal:4 },
  { key:"ch", n:"Kohlenhydrate", kcal:4 },
  { key:"fa", n:"Fett",          kcal:9 }
];

function macroTargets(p){
  if (p.macroMode === "custom" && p.macros) return { ...p.macros };
  const kcal = targetOf(p);
  const pr = Math.round(p.weight * (PROTEIN_PER_KG[p.goal] ?? 1.8));
  const fa = Math.round(kcal * 0.27 / 9);
  const ch = Math.max(0, Math.round((kcal - pr*4 - fa*9) / 4));
  return { pr, ch, fa };
}
const macroKcal = m => m.pr*4 + m.ch*4 + m.fa*9;

/* Lebensmittel, die zur Ernährungsform passen. Ausgeschlossene sind separat,
   damit ein Wechsel der Ernährungsform die Abneigungen nicht überschreibt. */
const dietOf = id => DIETS.find(d => d.id === id) || DIETS[0];
// Selbst angelegte Lebensmittel gelten immer — der Nutzer weiß, was drin ist
const fitsDiet = (f, diet) => f.custom === true || dietOf(diet).allow.includes(f.d);
// Standardliste plus die eigenen Einträge des Nutzers
const allFoods = p => [...FOODS, ...(p.customFoods || [])];
function foodsFor(p){
  const ex = p.excluded || [];
  return allFoods(p).filter(f => fitsDiet(f, p.diet || "all") && !ex.includes(f.id));
}

/* Für vergangene Tage gilt das Ziel, das an dem Tag galt — sonst würden sich
   alte Bilanzen rückwirkend verschieben, sobald Gewicht oder Ziel sich ändern.
   Der heutige Tag rechnet immer mit dem aktuellen Profil. */
function dayTarget(){
  return viewingToday() ? targetOf(S.profile) : (S.day?.target ?? targetOf(S.profile));
}
function dayTdee(){
  return viewingToday() ? tdeeOf(S.profile) : (S.day?.tdee ?? tdeeOf(S.profile));
}

function dayBmr(){
  return viewingToday() ? bmrOf(S.profile) : (S.day?.bmr ?? bmrOf(S.profile));
}
function dayMacros(){
  return viewingToday() ? macroTargets(S.profile) : (S.day?.macros ?? macroTargets(S.profile));
}

function totals(){
  const d = S.day || { meals:[], workouts:[] };
  const eaten  = d.meals.reduce((a,m) => a + m.kcal, 0);
  const moved  = d.workouts.reduce((a,w) => a + w.kcal, 0);
  const target = dayTarget();
  const got = { pr:0, ch:0, fa:0 };
  d.meals.forEach(m => MACROS.forEach(x => got[x.key] += (m[x.key] || 0)));
  MACROS.forEach(x => got[x.key] = Math.round(got[x.key]));
  return { eaten, moved, target, tdee: dayTdee(), got, macros: dayMacros(),
           budget: target + moved, left: target + moved - eaten };
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
    S.uid = null; S.profile = null; S.chat = null;
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
    setTimeout(maybeRecap, 900);
    setTimeout(maybeShowInstall, 2600);
  } else {
    S.draft = { sex:"m", lifestyle:"mid", goal:"cut1", diet:"all", consent:false, activities:[], foods:[], excluded:[] };
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
async function loadDay(key = todayKey()){
  S.dayKey = key;
  const snap = await getDoc(doc(db, "users", S.uid, "days", key));
  S.day = snap.exists() ? { meals:[], workouts:[], ...snap.data() } : { meals:[], workouts:[] };
}
const viewingToday = () => S.dayKey === todayKey();

/* Alle Tage mit Einträgen, neueste zuerst. Die Summen kommen aus dem
   Dokument selbst — kein zweiter Lesevorgang pro Tag nötig. */
async function listDays(){
  const snap = await getDocs(collection(db, "users", S.uid, "days"));
  const out = [];
  snap.forEach(d => {
    const v = d.data() || {};
    const meals = v.meals || [], workouts = v.workouts || [];
    if (!meals.length && !workouts.length) return;
    out.push({
      key:      d.id,
      eaten:    meals.reduce((a,m) => a + m.kcal, 0),
      moved:    workouts.reduce((a,w) => a + w.kcal, 0),
      target:   v.target ?? null,
      mealsN:   meals.length,
      trainings:workouts.length,
      n:        meals.length + workouts.length
    });
  });
  if (!out.some(d => d.key === todayKey()))
    out.push({ key: todayKey(), eaten:0, moved:0, mealsN:0, trainings:0, n:0 });
  return out.sort((a,b) => b.key.localeCompare(a.key));
}
async function saveDay(){
  // Momentaufnahme des Ziels, damit der Tag später eigenständig auswertbar ist
  // Heute immer aktualisieren; für vergangene Tage nur ergänzen, falls noch
  // kein Ziel hinterlegt ist — sonst würde die alte Bilanz überschrieben.
  if (viewingToday() || S.day.target == null){
    S.day.target = targetOf(S.profile);
    S.day.tdee   = tdeeOf(S.profile);
    S.day.bmr    = bmrOf(S.profile);
    S.day.macros = macroTargets(S.profile);
  }
  await setDoc(doc(db, "users", S.uid, "days", S.dayKey), S.day);
}
async function addEntry(kind, entry){
  // Kein Sprung mehr auf heute: der Eintrag gehört in den angezeigten Tag
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
    title:"Deine Eckdaten",
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
        <div class="field" id="ob-lsk" style="margin-top:12px" ${d.lifestyle==="manual"?"":"hidden"}>
          <label for="f-lsk">Zuschlag zum Grundumsatz (kcal)</label>
          <input id="f-lsk" type="number" inputmode="numeric" value="${d.lifestyleKcal ?? DEF_LS_KCAL}">
        </div>
        <p class="hint">Trainingseinheiten trägst du später separat ein – sie erhöhen dein Tagesbudget zusätzlich.</p>

        <button class="consent ${d.consent ? "sel" : ""}" id="f-consent">
          <span class="check">${ICON.check}</span>
          <span class="tx">Ich willige ein, dass FITTEN.ME meine Gesundheitsdaten – Körperdaten,
          Ziele, Mahlzeiten und Trainings – zur Berechnung meiner Werte verarbeitet und dafür
          an die genannten Dienstleister übermittelt. Die Einwilligung kann ich jederzeit
          widerrufen. Einzelheiten stehen unter
          <u style="text-decoration:underline" id="f-privacy">Datenschutz</u>.</span>
        </button>`;
    },
    bind(){
      $$("#ob-body .tile").forEach(t => t.onclick = () => {
        S.draft.lifestyle = t.dataset.id;
        $$("#ob-body .tile").forEach(x => x.classList.toggle("sel", x === t));
        $("#ob-lsk").hidden = S.draft.lifestyle !== "manual";
      });
      $("#f-consent").onclick = e => {
        if (e.target.id === "f-privacy"){       // Text antippen öffnet die Erklärung
          openLegal("privacy");
          $("#lg-back").onclick = closeSheet;   // zurück ins Onboarding, nicht in die Einstellungen
          return;
        }
        S.draft.consent = !S.draft.consent;
        $("#f-consent").classList.toggle("sel", S.draft.consent);
      };
    },
    read(){
      const w = +$("#f-w").value, h = +$("#f-h").value, a = +$("#f-a").value;
      if (!(w >= 30 && w <= 300)) return "Bitte ein Gewicht zwischen 30 und 300 kg eintragen.";
      if (!(h >= 120 && h <= 230)) return "Bitte eine Größe zwischen 120 und 230 cm eintragen.";
      if (!(a >= 14 && a <= 100))  return "Bitte ein Alter zwischen 14 und 100 Jahren eintragen.";
      if (!S.draft.consent) return "Bitte bestätige die Einwilligung zur Verarbeitung deiner Gesundheitsdaten.";
      Object.assign(S.draft, { weight:w, height:h, age:a, sex:$("#f-s").value });
      if (S.draft.lifestyle === "manual"){
        const k = +$("#f-lsk").value;
        if (!(k >= 0 && k <= 3000)) return "Bitte einen Zuschlag zwischen 0 und 3000 kcal eintragen.";
        S.draft.lifestyleKcal = Math.round(k);
      }
      return null;
    }
  },
  {
    title:"Dein Ziel",
    sub:"Bestimmt, wie dein Tagesbudget vom Grundbedarf abweicht.",
    render(){
      const p = { ...S.draft }, tdee = tdeeOf(p);
      const gk = S.draft.goalKcal ?? DEF_GOAL_KCAL;
      return `<div class="tiles">${GOALS.map(g => {
        const val = g.id === "manual"
          ? Math.max(tdee + gk, kcalFloor(p))
          : Math.max(tdee*(1+g.f), bmrOf(p));
        return tileHTML(g.id, g.n, g.s, `${num(Math.round(val))} kcal`, S.draft.goal===g.id);
      }).join("")}</div>
      <div class="field" id="ob-gk" style="margin-top:12px" ${S.draft.goal==="manual"?"":"hidden"}>
        <label for="f-gk">Abweichung vom Grundbedarf (kcal)</label>
        <input id="f-gk" type="number" inputmode="numeric" value="${gk}">
        <p class="hint" id="ob-gk-note">Negativ ergibt ein Defizit, positiv einen Überschuss.</p>
      </div>
      <p class="hint">Grundbedarf inkl. Alltag: <b>${num(tdee)} kcal</b> · Grundumsatz in Ruhe: <b>${num(bmrOf(p))} kcal</b></p>`;
    },
    bind(){
      $$("#ob-body .tile").forEach(t => t.onclick = () => {
        S.draft.goal = t.dataset.id;
        $$("#ob-body .tile").forEach(x => x.classList.toggle("sel", x === t));
        $("#ob-gk").hidden = S.draft.goal !== "manual";
      });
      $("#f-gk").oninput = () => {
        S.draft.goalKcal = Math.round(+$("#f-gk").value || 0);
        const tile = $$("#ob-body .tile").find(t => t.dataset.id === "manual");
        // direkt rechnen, damit der Wert auch stimmt, bevor "Manuell" gewählt ist
        const want = tdeeOf(S.draft) + S.draft.goalKcal;
        const val  = Math.max(want, kcalFloor(S.draft));
        if (tile) tile.querySelector(".t-val").textContent = `${num(val)} kcal`;
        $("#ob-gk-note").innerHTML = want < kcalFloor(S.draft)
          ? `<b style="color:var(--warn)">Untergrenze von ${num(kcalFloor(S.draft))} kcal greift.</b>`
          : "Negativ ergibt ein Defizit, positiv einen Überschuss.";
      };
    },
    read(){
      if (!S.draft.goal) return "Bitte ein Ziel auswählen.";
      if (S.draft.goal === "manual"){
        const k = Math.round(+$("#f-gk").value || 0);
        if (!(k >= -1500 && k <= 1500)) return "Bitte einen Wert zwischen -1500 und +1500 kcal eintragen.";
        S.draft.goalKcal = k;
      }
      return null;
    }
  },
  {
    title:"Was bewegst du gern?",
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
    title:"Wie isst du?",
    sub:"Bestimmt, welche Lebensmittel dir überhaupt angeboten werden.",
    render(){
      return `<div class="tiles">${DIETS.map(d => {
        const n = FOODS.filter(f => fitsDiet(f, d.id)).length;
        return tileHTML(d.id, d.n, d.s, `${n} Lebensmittel`, S.draft.diet === d.id);
      }).join("")}</div>`;
    },
    bind(){
      $$("#ob-body .tile").forEach(t => t.onclick = () => {
        S.draft.diet = t.dataset.id;
        // Favoriten bereinigen, die zur neuen Form nicht mehr passen
        S.draft.foods = S.draft.foods.filter(id => {
          const f = FOODS.find(x => x.id === id);
          return f && fitsDiet(f, S.draft.diet);
        });
        $$("#ob-body .tile").forEach(x => x.classList.toggle("sel", x === t));
      });
    },
    read(){ return S.draft.diet ? null : "Bitte eine Ernährungsform auswählen."; }
  },
  {
    title:"Was isst du gern?",
    sub:"Damit du Lieblingsgerichte mit einem Tipp erfassen kannst.",
    render(){
      const list = FOODS.filter(f => fitsDiet(f, S.draft.diet));
      return groupedChips(list, S.draft.foods, f => `${f.k} kcal/100 g`);
    },
    bind(){ bindChips("foods"); },
    read(){ return S.draft.foods.length ? null : "Wähle mindestens ein Lebensmittel."; }
  },
  {
    title:"Magst du etwas gar nicht?",
    sub:"Das Gewählte taucht beim Erfassen nicht mehr auf. Kannst du überspringen.",
    render(){
      const list = FOODS.filter(f => fitsDiet(f, S.draft.diet));
      return groupedChips(list, S.draft.excluded, f => `${f.k} kcal/100 g`, "no");
    },
    bind(){ bindChips("excluded", "no", "foods"); },
    read(){ return null; }
  }
];

function tileHTML(id, ttl, sub, val, sel){
  return `<button class="tile ${sel?"sel":""}" data-id="${id}">
    <span class="t-txt"><span class="t-ttl">${esc(ttl)}</span>${sub?`<span class="t-sub">${esc(sub)}</span>`:""}</span>
    ${val?`<span class="t-val">${val}</span>`:""}
    <span class="check">${ICON.check}</span></button>`;
}
function groupedChips(list, selected, label, variant = "sel"){
  const groups = [...new Set(list.map(x => x.g))];
  return groups.map(g => `
    <p class="group-label">${g}</p>
    <div class="chips">${list.filter(x => x.g === g).map(x =>
      `<button class="chip ${selected.includes(x.id) ? variant : ""}" data-id="${x.id}">${esc(x.n)} <em>${label(x)}</em></button>`
    ).join("")}</div>`).join("");
}
/* opposite: Liste, aus der der Eintrag verschwinden muss — ein Lebensmittel
   kann nicht gleichzeitig Favorit und Abneigung sein. */
function bindChips(key, variant = "sel", opposite = null){
  $$("#ob-body .chip").forEach(c => c.onclick = () => {
    const id = c.dataset.id, arr = S.draft[key];
    const i = arr.indexOf(id);
    if (i > -1) arr.splice(i,1); else arr.push(id);
    c.classList.toggle(variant, i === -1);
    if (opposite && i === -1){
      const o = S.draft[opposite], j = o.indexOf(id);
      if (j > -1) o.splice(j,1);
    }
  });
}

function renderOb(){
  const st = OB[S.obStep];
  if (!$("#ob-steps").children.length)
    $("#ob-steps").innerHTML = OB.map(() => "<i></i>").join("");
  $("#ob-eyebrow").textContent = `Schritt ${S.obStep + 1} von ${OB.length}`;
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
  // Nachweis der Einwilligung nach Art. 7 Abs. 1 DSGVO
  S.profile = { ...S.draft, onboarded:true, createdAt: Date.now(), consentAt: Date.now() };
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

/* Je Stufe ein eigenes Zeichen: schlichter Ring, Funke, Rhombus. */
const TIER_MARK = {
  basis:   `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="4"/></svg>`,
  premium: `<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12l-1.5-4.5L0 6l4.5-1.5z"/></svg>`,
  // 8 Zacken — doppelt so viele wie der Funke bei Premium, ohne zu flirren
  ultra:   `<svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0.1L7.15 3.23L10.17 1.83L8.77 4.85L11.9 6L8.77 7.15L10.17 10.17L7.15 8.77L6 11.9L4.85 8.77L1.83 10.17L3.23 7.15L0.1 6L3.23 4.85L1.83 1.83L4.85 3.23Z"/></svg>`
};

const CHEVRON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;

function renderHome(){
  const t = totals();
  const today = viewingToday();

  const [dy, dm, dd] = S.dayKey.split("-").map(Number);
  $("#h-date").innerHTML = new Date(dy, dm-1, dd)
    .toLocaleDateString("de-DE", { weekday:"long", day:"numeric", month:"long" }) + CHEVRON;
  $("#h-date").classList.toggle("past", !today);

  $("#h-coach").hidden = !hasCoach();

  const tier = TIERS.find(t => t.id === (S.profile.tier || "basis")) || TIERS[0];
  $("#h-tier").className = "tier " + tier.id;
  $("#h-tier").innerHTML = TIER_MARK[tier.id] + tier.n;

  // Auf vergangenen Tagen wird nichts erfasst — sonst landet der Eintrag
  // unbemerkt beim heutigen Datum.
  // Erfasst wird immer in den gerade angezeigten Tag — auch rückwirkend.
  // Nur der Vorschlag bleibt dem laufenden Tag vorbehalten.
  $("#h-sug-page").hidden = !today;
  $$("#h-dots i")[1].hidden = !today;

  const over = t.left < 0;
  $("#h-left").textContent = num(Math.abs(t.left));
  $("#h-left").classList.toggle("over", over);
  $("#h-left-label").textContent = over ? "kcal über dem Budget" : "kcal verfügbar";

  const pct = Math.min(100, t.budget > 0 ? (t.eaten / t.budget) * 100 : 0);
  const rail = $("#h-rail");
  rail.style.width = pct + "%";
  rail.classList.toggle("over", over);

  $("#h-eaten").textContent  = `${num(t.eaten)} gegessen`
    + (t.moved ? ` · +${num(t.moved)} Bewegung` : "");
  $("#h-budget").textContent = `${num(t.budget)} Budget`;

  $("#h-macros").innerHTML = MACROS.map(x => {
    const have = t.got[x.key], goal = t.macros[x.key] || 0;
    return `<div class="macro ${x.key} ${have > goal ? "over" : ""}">
      <span class="eyebrow">${x.n}</span>
      <b>${num(have)}<span> / ${num(goal)} g</span></b>
    </div>`;
  }).join("");

  const entries = [
    ...S.day.meals.map(m => ({ ...m, kind:"meals" })),
    ...S.day.workouts.map(w => ({ ...w, kind:"workouts" }))
  ].sort((a,b) => b.t.localeCompare(a.t));

  $("#h-log").innerHTML = `
    <div class="log-head"><span class="eyebrow">${today ? "Heute erfasst" : "Erfasst"}</span>
      <span class="eyebrow">${entries.length || ""}</span></div>
    ${entries.length ? entries.map(e => {
      const mv = e.kind === "workouts";
      return `<div class="item" data-kind="${e.kind}" data-id="${e.id}">
        <span class="ic ${mv?"mv":""}">${mv?ICON.bolt:ICON.fork}</span>
        <span class="t-txt"><span class="t-ttl">${esc(e.name)}</span>
          <span class="t-sub">${esc(e.detail || "")} · ${e.t}</span></span>
        <span class="kc ${mv?"mv":""}">${mv?"+":""}${num(e.kcal)}</span>
      </div>`;
    }).join("") : `<p class="log-empty">Noch nichts erfasst. Fang mit einer Mahlzeit oder einem Training an.</p>`}`;

  $$("#h-log .item").forEach(bindHold);
}

/* Punktanzeige des Kachel-Decks. Bei zwei Seiten reicht das Verhältnis von
   Scrollposition zur maximalen Scrollweite. */
(() => {
  const deck = $("#h-deck");
  const sync = () => {
    const max = deck.scrollWidth - deck.clientWidth;
    const i = max > 4 ? Math.round(deck.scrollLeft / max) : 0;
    $$("#h-dots i").forEach((d, n) => d.classList.toggle("on", n === i));
  };
  deck.addEventListener("scroll", sync, { passive:true });
  $$("#h-dots i").forEach((d, n) => d.onclick = () => {
    const max = deck.scrollWidth - deck.clientWidth;
    deck.scrollTo({ left: n * max, behavior:"smooth" });
  });
})();

/* ─────────────────  9e. WOCHENRÜCKBLICK  ───────────────── */

/* Ausgewertet wird die Woche von Montag bis Sonntag, die um 18 Uhr am
   Sonntag als abgeschlossen gilt. Ist dieser Zeitpunkt heute noch nicht
   erreicht, gilt die Vorwoche. */
function recapSunday(now = new Date()){
  const dow = (now.getDay() + 6) % 7;             // Montag = 0
  const sun = new Date(now);
  sun.setDate(now.getDate() + (6 - dow));
  sun.setHours(18, 0, 0, 0);
  if (now < sun) sun.setDate(sun.getDate() - 7);
  return sun;
}
const dkey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

function recapWeek(sunday){
  const keys = [];
  for (let i = 6; i >= 0; i--){
    const d = new Date(sunday);
    d.setDate(sunday.getDate() - i);
    keys.push(dkey(d));
  }
  return keys;
}

function summarize(days, keys, fallbackTarget){
  const inWeek = days.filter(d => keys.includes(d.key));
  const eatenDays = inWeek.filter(d => d.mealsN > 0);
  let saved = 0, onTarget = 0;
  eatenDays.forEach(d => {
    const budget = (d.target ?? fallbackTarget) + d.moved;
    saved += budget - d.eaten;
    if (d.eaten <= budget) onTarget++;
  });
  return {
    saved: Math.round(saved),
    onTarget,
    trackedDays: eatenDays.length,
    trainings: inWeek.reduce((a,d) => a + d.trainings, 0),
    trainKcal: inWeek.reduce((a,d) => a + d.moved, 0)
  };
}

async function openRecap(silent = false){
  const sun  = recapSunday();
  const keys = recapWeek(sun);

  if (!silent) openSheet("Deine Woche",
    `<div class="analyzing"><span class="spin"></span>Woche wird ausgewertet …</div>`);

  let days;
  try { days = await listDays(); }
  catch {
    if (!silent) $("#sheet-body").innerHTML = `<p class="log-empty">Die Woche konnte nicht geladen werden.</p>`;
    return false;
  }

  const r = summarize(days, keys, targetOf(S.profile));
  if (silent && !r.trackedDays && !r.trainings) return false;   // nichts zu zeigen

  const fmt = k => { const [y,m,d] = k.split("-").map(Number);
    return new Date(y, m-1, d).toLocaleDateString("de-DE", { day:"numeric", month:"short" }); };

  const savedLabel = r.saved >= 0 ? "kcal eingespart" : "kcal über dem Budget";
  const kicker = !r.trackedDays
    ? "Diese Woche war noch nichts erfasst — nächste Woche ist eine neue Gelegenheit."
    : r.onTarget === r.trackedDays
      ? "An jedem erfassten Tag im Budget geblieben. Stark."
      : `An ${r.onTarget} von ${r.trackedDays} erfassten Tagen im Budget geblieben.`;

  if (silent) openSheet("Deine Woche", "");
  $("#sheet-body").innerHTML = `
    <p class="hint" style="margin:0 0 14px; text-align:center">${fmt(keys[0])} bis ${fmt(keys[6])}</p>

    <div class="res-total" style="${r.saved < 0 ? "background:linear-gradient(180deg,#F97316,#EF4444);box-shadow:0 12px 26px rgba(200,60,20,.28)" : ""}">
      <span style="font-weight:650">${savedLabel}</span><b>${num(Math.abs(r.saved))}</b></div>

    <div class="macros" style="margin-top:12px">
      <div class="macro pr"><span class="eyebrow">Im Budget</span>
        <b>${r.onTarget}<span> / ${r.trackedDays}</span></b></div>
      <div class="macro ch"><span class="eyebrow">Trainings</span>
        <b>${r.trainings}</b></div>
      <div class="macro fa"><span class="eyebrow">Bewegung</span>
        <b>${num(r.trainKcal)}<span> kcal</span></b></div>
    </div>

    <p class="hint" style="text-align:center; margin-top:14px">${esc(kicker)}</p>`;
  $("#sheet-foot").innerHTML = `<button class="btn btn-primary" id="rc-ok">Weiter geht's</button>`;
  $("#rc-ok").onclick = closeSheet;

  // Merken, damit derselbe Rückblick nicht bei jedem Start erscheint
  const seen = dkey(sun);
  if (S.profile.recapSeen !== seen){
    S.profile.recapSeen = seen;
    try { await saveProfile(); } catch {}
  }
  return true;
}

/* Nach dem Start einmal je Woche von selbst zeigen */
async function maybeRecap(){
  if (!S.profile || S.profile.recapSeen === dkey(recapSunday())) return;
  await openRecap(true);
}

/* ─────────────────  9d. COACH-CHAT  ───────────────── */

const COACH_ENDPOINT = "/api/coach";
const GREETING = "Hey, ich bin dein persönlicher Fitness- und Ernährungscoach. " +
                 "Wie kann ich dir heute beim Erreichen deiner Ziele behilflich sein?";
const CHAT_KEEP = 60;   // so viele Nachrichten bleiben gespeichert

const hasCoach = () => ["premium","ultra"].includes(S.profile?.tier);
const chatRef  = () => doc(db, "users", S.uid, "chat", "main");

async function loadChat(){
  try {
    const snap = await getDoc(chatRef());
    S.chat = snap.exists() && Array.isArray(snap.data().messages) ? snap.data().messages : [];
  } catch { S.chat = []; }
  if (!S.chat.length) S.chat = [{ role:"assistant", content: GREETING, t: clock() }];
}
async function saveChat(){
  try { await setDoc(chatRef(), { messages: S.chat.slice(-CHAT_KEEP) }); } catch {}
}

/* Alles, was für eine gute Antwort hilfreich ist — der Coach soll nicht
   nach Dingen fragen müssen, die die App längst weiß. */
function coachContext(){
  const p = S.profile, t = totals();
  const name = (arr, id) => (arr.find(x => x.id === id) || {}).n;
  const foodNames = ids => allFoods(p).filter(f => ids.includes(f.id)).map(f => f.n);
  return {
    weight:p.weight, height:p.height, age:p.age, sex:p.sex,
    bmr: bmrOf(p), tdee: t.tdee, target: t.target,
    lifestyle: name(LIFESTYLE, p.lifestyle),
    goal:      name(GOALS, p.goal),
    diet:      name(DIETS, p.diet || "all"),
    macroTarget: t.macros, got: t.got,
    eaten: t.eaten, moved: t.moved, left: t.left,
    eatenToday: S.day.meals.map(m => m.name),
    favorites:  foodNames(p.foods || []),
    dislikes:   foodNames(p.excluded || []),
    avoid:      p.customDislikes || [],
    customFoods:(p.customFoods || []).map(f => f.n),
    activities: allActs(p).filter(a => (p.activities||[]).includes(a.id)).map(a => a.n),
    time: clock()
  };
}

$("#h-coach").onclick = () => openCoach();

const SEND_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
  stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;

async function openCoach(){
  if (!hasCoach()){ toast("Der Coach ist Teil von Premium und Ultra+."); return; }

  openSheet("", `<div class="analyzing"><span class="spin"></span>Verlauf wird geladen …</div>`,
    `<div class="chat-in">
       <textarea id="cc-in" rows="1" placeholder="Deine Frage"></textarea>
       <button class="chat-send" id="cc-send" aria-label="Senden" disabled>${SEND_ICON}</button>
     </div>`);

  if (!S.chat) await loadChat();
  paintChat();

  const input = $("#cc-in"), send = $("#cc-send");
  const grow = () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 130) + "px";
    send.disabled = !input.value.trim();
  };
  input.oninput = grow;
  input.onkeydown = e => {
    // Enter sendet, Shift+Enter macht einen Zeilenumbruch
    if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); ask(); }
  };
  send.onclick = ask;
  setTimeout(grow, 0);

  async function ask(){
    const text = input.value.trim();
    if (!text) return;
    input.value = ""; grow();
    S.chat.push({ role:"user", content:text, t: clock() });
    paintChat(true);
    saveChat();

    try {
      const r = await fetch(COACH_ENDPOINT, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          messages: S.chat.map(m => ({ role:m.role, content:m.content })),
          context: coachContext(),
          tier: S.profile.tier
        })
      });
      const ct = r.headers.get("content-type") || "";
      if (!ct.includes("application/json"))
        throw new Error(`${COACH_ENDPOINT} liefert kein JSON (HTTP ${r.status}). Liegt api/coach.js im Projekt-Root?`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
      S.chat.push({ role:"assistant", content:data.reply, t: clock() });
      paintChat();
      saveChat();
    } catch (e) {
      paintChat(false, e.message || "Unbekannter Fehler");
    }
  }
}

function paintChat(typing = false, error = null){
  const body = $("#sheet-body");
  if (!body) return;
  body.innerHTML = `
  <p class="chat-note">Dein Coach ist eine KI. Antworten können Fehler enthalten und
  ersetzen keine ärztliche Beratung.</p>
  <div class="chat">
    ${S.chat.map(m => `<div class="msg ${m.role === "user" ? "me" : "ai"}">${esc(m.content)}</div>`).join("")}
    ${typing ? `<div class="msg ai typing"><i></i><i></i><i></i></div>` : ""}
    ${error ? `<div class="msg err">${esc(error)}</div>` : ""}
  </div>`;
  body.scrollTop = body.scrollHeight;
}

/* ─────────────────  9c. ESSENSVORSCHLAG  ───────────────── */

const SUGGEST_ENDPOINT = "/api/suggest";

$("#a-suggest").onclick = () => openSuggest();

async function openSuggest(){
  const t = totals();
  openSheet("Vorschlag", `<div class="analyzing"><span class="spin"></span>
    Passende Optionen werden gesucht …</div>`);

  const p = S.profile;
  const payload = {
    left: t.left,
    macrosLeft: {
      pr: Math.max(0, t.macros.pr - t.got.pr),
      ch: Math.max(0, t.macros.ch - t.got.ch),
      fa: Math.max(0, t.macros.fa - t.got.fa)
    },
    diet: (DIETS.find(d => d.id === (p.diet || "all")) || DIETS[0]).n,
    goal: (GOALS.find(g => g.id === p.goal) || GOALS[1]).n,
    // foodsFor filtert Ernährungsform und Abneigungen bereits heraus
    favorites: foodsFor(p).filter(f => p.foods.includes(f.id))
      .map(f => ({ n:f.n, k:f.k, pr:f.pr, ch:f.ch, fa:f.fa })),
    eatenToday: S.day.meals.map(m => m.name),
    avoid: p.customDislikes || [],
    tier: p.tier || "basis",
    time: clock()
  };

  let data;
  try {
    const r = await fetch(SUGGEST_ENDPOINT, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("application/json"))
      throw new Error(`${SUGGEST_ENDPOINT} liefert kein JSON (HTTP ${r.status}). Liegt api/suggest.js im Projekt-Root?`);
    data = await r.json();
    if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
  } catch (e) {
    $("#sheet-body").innerHTML = `<div class="analyzing" style="color:#B42318; align-items:flex-start; line-height:1.45">
      <span style="flex:1">Der Vorschlag hat nicht geklappt.<br>
      <span style="font-weight:550; font-size:13.5px; color:var(--ink-2)">${esc(e.message || "Unbekannter Fehler")}</span></span></div>`;
    return;
  }

  const opts = Array.isArray(data.options) ? data.options : [];
  $("#sheet-body").innerHTML = `
    <div class="res-total" style="margin-bottom:14px">
      <span style="font-weight:650">Noch verfügbar</span><b>${num(Math.max(0, t.left))}</b></div>
    ${opts.length ? opts.map((o, i) => `
      <div class="sug-item">
        <div class="top"><b>${esc(o.name || "Vorschlag")}</b><span>${num(o.kcal || 0)} kcal</span></div>
        ${o.amount ? `<p class="amt">${esc(o.amount)}</p>` : ""}
        ${o.why ? `<p class="why">${esc(o.why)}</p>` : ""}
        <p class="mac">E ${num(o.pr||0)} g · K ${num(o.ch||0)} g · F ${num(o.fa||0)} g</p>
        <button class="btn btn-glass btn-sm" data-i="${i}">Eintragen</button>
      </div>`).join("") : ""}
    ${data.note ? `<p class="hint" style="text-align:center; margin-top:14px">${esc(data.note)}</p>` : ""}`;

  $$("#sheet-body .sug-item .btn").forEach(b => b.onclick = async () => {
    const o = opts[+b.dataset.i];
    await addEntry("meals", {
      name: o.name || "Vorschlag",
      detail: o.amount || "Vorschlag",
      kcal: Math.round(o.kcal || 0),
      pr: +(o.pr || 0), ch: +(o.ch || 0), fa: +(o.fa || 0),
      src: "suggest"
    });
    closeSheet();
    toast(`${num(Math.round(o.kcal || 0))} kcal eingetragen`);
  });
}

/* ─────────────────  9b. TAGESWECHSEL  ───────────────── */

$("#h-date").onclick = () => openDays();

async function openDays(){
  openSheet("Tag wählen", `<div class="analyzing"><span class="spin"></span>Kalender wird geladen …</div>`);

  let days;
  try { days = await listDays(); }
  catch { $("#sheet-body").innerHTML = `<p class="log-empty">Die Tage konnten nicht geladen werden.</p>`; return; }

  // nur Tage mit echten Einträgen bekommen einen Punkt
  const have = new Map(days.filter(d => d.n > 0).map(d => [d.key, d]));
  const [cy, cm] = S.dayKey.split("-").map(Number);
  let cursor = new Date(cy, cm - 1, 1);          // angezeigter Monat

  const ARROW = dir => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
    stroke-linecap="round" stroke-linejoin="round"><path d="${dir < 0 ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}"/></svg>`;

  function paint(){
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const lead  = (first.getDay() + 6) % 7;      // Woche beginnt montags
    const dim   = new Date(y, m + 1, 0).getDate();
    const today = todayKey();
    const isCurrentMonth = y === +today.slice(0,4) && m === +today.slice(5,7) - 1;

    let cells = "";
    for (let i = 0; i < lead; i++) cells += `<span class="cal-day pad"></span>`;
    for (let d = 1; d <= dim; d++){
      const key = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const cls = [
        "cal-day",
        key > today            ? "future" : "",
        have.has(key)          ? "has"    : "empty",
        key === today          ? "today"  : "",
        key === S.dayKey       ? "on"     : ""
      ].filter(Boolean).join(" ");
      cells += `<button class="${cls}" data-key="${key}">${d}${have.has(key) ? "<i></i>" : ""}</button>`;
    }

    $("#sheet-body").innerHTML = `
      <div class="cal-head">
        <button id="cal-prev" aria-label="Vorheriger Monat">${ARROW(-1)}</button>
        <b>${cursor.toLocaleDateString("de-DE", { month:"long", year:"numeric" })}</b>
        <button id="cal-next" aria-label="Nächster Monat" ${isCurrentMonth ? "disabled" : ""}>${ARROW(1)}</button>
      </div>
      <div class="cal-wd">${["Mo","Di","Mi","Do","Fr","Sa","So"].map(w => `<span>${w}</span>`).join("")}</div>
      <div class="cal-grid">${cells}</div>
      <p class="hint" style="text-align:center">Ein Punkt markiert Tage mit Einträgen.</p>`;

    $("#cal-prev").onclick = () => { cursor = new Date(y, m - 1, 1); paint(); };
    $("#cal-next").onclick = () => { cursor = new Date(y, m + 1, 1); paint(); };

    $$("#sheet-body .cal-day[data-key]").forEach(b => b.onclick = async () => {
      S.pinned = b.dataset.key !== todayKey();
      await loadDay(b.dataset.key);
      renderHome();
      closeSheet();
    });
  }

  paint();
}

/* ── Eintrag bearbeiten: langes Drücken öffnet das Menü ────────────────
   Kein Kontextmenü des Systems, und ein Fingerwisch bricht ab, damit
   Scrollen nicht versehentlich auslöst. */
function onHold(el, action){
  let timer = null, sx = 0, sy = 0;
  const clear = () => { clearTimeout(timer); timer = null; el.classList.remove("held"); };

  el.oncontextmenu = e => e.preventDefault();
  el.onpointerdown = e => {
    sx = e.clientX; sy = e.clientY;
    el.classList.add("held");
    timer = setTimeout(() => {
      clear();
      if (navigator.vibrate) navigator.vibrate(12);
      action();
    }, 480);
  };
  el.onpointermove = e => {
    if (timer && (Math.abs(e.clientX - sx) > 8 || Math.abs(e.clientY - sy) > 8)) clear();
  };
  el.onpointerup = clear;
  el.onpointercancel = clear;
  el.onpointerleave = clear;
}

const bindHold = el => onHold(el, () => openEntryMenu(el.dataset.kind, el.dataset.id));

// Langes Drücken aufs Datum ruft den Rückblick jederzeit auf
onHold($("#h-date"), () => openRecap());

/* Aufschlüsselung der großen Zahl — zeigt jeden Rechenschritt, damit
   nachvollziehbar ist, wo das Budget herkommt. */
onHold($("#h-left"), () => openBreakdown());

function openBreakdown(){
  const t = totals();
  const bmr  = dayBmr();
  const life = t.tdee - bmr;
  const goal = t.target - t.tdee;
  const sign = v => (v >= 0 ? "+" : "−") + num(Math.abs(v));
  const gName = (GOALS.find(g => g.id === S.profile.goal) || {}).n || "Ziel";
  const lName = (LIFESTYLE.find(l => l.id === S.profile.lifestyle) || {}).n || "Alltag";

  const row = (label, value, cls = "") =>
    `<div class="${cls}"><span>${esc(label)}</span><b>${value}</b></div>`;

  openSheet("Zusammensetzung", `
    <div class="glass calc">
      ${row("Grundumsatz in Ruhe", num(bmr))}
      ${row("Alltag · " + lName, sign(life))}
      ${row("Grundbedarf", num(t.tdee), "sum")}
      ${row("Ziel · " + gName, sign(goal))}
      ${row("Tagesziel", num(t.target), "sum")}
      ${row("Training", sign(t.moved))}
      ${row("Gegessen", sign(-t.eaten))}
      ${row(t.left < 0 ? "Über dem Budget" : "Noch verfügbar",
            (t.left < 0 ? "−" : "") + num(Math.abs(t.left)), "total" + (t.left < 0 ? " over" : ""))}
    </div>
    <p class="hint" style="text-align:center">Grundumsatz nach Mifflin-St Jeor aus Gewicht, Größe, Alter und Geschlecht.</p>
  `);
}

function openEntryMenu(kind, id){
  const e = (S.day[kind] || []).find(x => x.id === id);
  if (!e) return;
  const mv = kind === "workouts";

  openSheet(e.name, `
    <div class="item" style="pointer-events:none; margin-bottom:4px">
      <span class="ic ${mv?"mv":""}">${mv?ICON.bolt:ICON.fork}</span>
      <span class="t-txt"><span class="t-ttl">${esc(e.name)}</span>
        <span class="t-sub">${esc(e.detail || "")} · ${e.t}</span></span>
      <span class="kc ${mv?"mv":""}">${mv?"+":""}${num(e.kcal)}</span>
    </div>`,
    `<button class="btn btn-primary" id="en-edit">Bearbeiten</button>
     <button class="btn btn-ghost" id="en-del" style="color:var(--bad)">Löschen</button>`);

  $("#en-edit").onclick = () => openEntryEdit(kind, id);
  $("#en-del").onclick  = async () => {
    await delEntry(kind, id);
    closeSheet();
    toast("Eintrag gelöscht");
  };
}

function openEntryEdit(kind, id){
  const e = (S.day[kind] || []).find(x => x.id === id);
  if (!e) return;
  const mv = kind === "workouts";

  openSheet("Bearbeiten", `
    <div class="field"><label for="ee-n">Bezeichnung</label>
      <input id="ee-n" type="text" value="${esc(e.name)}"></div>
    <div class="row">
      <div class="field"><label for="ee-k">${mv ? "Verbrannte Kalorien" : "Kalorien"}</label>
        <input id="ee-k" type="number" inputmode="numeric" value="${Math.round(e.kcal)}"></div>
      <div class="field"><label for="ee-t">Uhrzeit</label>
        <input id="ee-t" type="text" inputmode="numeric" value="${esc(e.t || "")}" placeholder="12:30"></div>
    </div>
    <div class="field"><label for="ee-d">Zusatz</label>
      <input id="ee-d" type="text" value="${esc(e.detail || "")}" placeholder="z. B. 150 g"></div>
    ${mv ? "" : `
      <p class="group-label">Makros in Gramm</p>
      <div class="row">${MACROS.map(x => `
        <div class="field"><label for="ee-${x.key}">${x.n}</label>
          <input id="ee-${x.key}" type="number" inputmode="decimal" value="${e[x.key] ?? 0}"></div>`).join("")}
      </div>`}
  `, `<button class="btn btn-primary" id="ee-save">Speichern</button>
      <button class="btn btn-ghost" id="ee-back">Zurück</button>`);

  $("#ee-save").onclick = async () => {
    const kcal = +$("#ee-k").value;
    if (!(kcal >= 0)) { toast("Bitte eine gültige Kalorienzahl eintragen."); return; }
    e.name   = $("#ee-n").value.trim() || e.name;
    e.detail = $("#ee-d").value.trim();
    e.kcal   = Math.round(kcal);
    const time = $("#ee-t").value.trim();
    if (/^\d{1,2}:\d{2}$/.test(time)) e.t = time.padStart(5, "0");
    if (!mv) MACROS.forEach(x => e[x.key] = Math.max(0, +$("#ee-" + x.key).value || 0));
    renderHome();
    try { await saveDay(); } catch { toast("Speichern fehlgeschlagen."); return; }
    closeSheet();
    toast("Eintrag aktualisiert");
  };
  $("#ee-back").onclick = () => openEntryMenu(kind, id);
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
      body: JSON.stringify({
        ...(photoData ? { image: photoData.base64, mime: photoData.mime } : {}),
        note, tier: S.profile?.tier || "basis"
      })
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

    <div class="macros" style="margin-top:12px">${MACROS.map(x => `
      <div class="macro ${x.key}"><span class="eyebrow">${x.n}</span>
        <b>${num(d[x.key] || 0)}<span> g</span></b></div>`).join("")}</div>

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
    // Korrigiert der Nutzer die Kalorien, skalieren die Makros proportional mit
    const scale = total ? kcal / total : 1;
    const macro = {};
    MACROS.forEach(x => macro[x.key] = +(((d[x.key] || 0) * scale).toFixed(1)));
    await addEntry("meals", {
      name: d.title || "Mahlzeit",
      detail: items.map(i => i.name).slice(0,3).join(", ") || (photoData ? "per Foto erfasst" : "per Beschreibung"),
      kcal, ...macro, src:"photo"
    });
    closeSheet();
    toast(`${num(kcal)} kcal eingetragen`);
  };
  $("#ph-retry").onclick = () => openPhotoSheet();
}

/* ─────────────────  12. MANUELLE MAHLZEIT  ───────────────── */

$("#a-manual").onclick = () => openManual();

function openManual(){
  const avail = foodsFor(S.profile);          // Ernährungsform + Abneigungen
  const favs  = avail.filter(f => S.profile.foods.includes(f.id));
  const rest  = avail.filter(f => !S.profile.foods.includes(f.id));
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
      <p class="group-label">Makros in Gramm (optional)</p>
      <div class="row">
        <div class="field"><label for="mn-pr">Eiweiß</label>
          <input id="mn-pr" type="number" inputmode="decimal" placeholder="0"></div>
        <div class="field"><label for="mn-ch">Kohlenhydr.</label>
          <input id="mn-ch" type="number" inputmode="decimal" placeholder="0"></div>
        <div class="field"><label for="mn-fa">Fett</label>
          <input id="mn-fa" type="number" inputmode="decimal" placeholder="0"></div>
      </div>
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
    const macro = {};
    MACROS.forEach(x => macro[x.key] = Math.max(0, +$("#mn-" + x.key).value || 0));
    await addEntry("meals", { name, detail:"manuell", kcal:Math.round(kcal), ...macro, src:"manual" });
    closeSheet(); toast(`${num(kcal)} kcal eingetragen`);
  };

  bindFoods();
}

function bindFoods(){
  $$("#sheet-body .qitem").forEach(b => b.onclick = () => {
    const f = allFoods(S.profile).find(x => x.id === b.dataset.id);
    openPortion(f);
  });
}

function openPortion(f){
  openSheet(f.n, `
    <div class="field"><label for="pt-g">Menge in Gramm</label>
      <input id="pt-g" type="number" inputmode="numeric" value="${f.p}"></div>
    <div class="res-total" style="margin-top:4px">
      <span style="font-weight:650">${f.k} kcal / 100 g</span><b id="pt-k">${Math.round(f.k*f.p/100)}</b></div>
    <p class="hint" style="text-align:center" id="pt-m"></p>
  `, `<button class="btn btn-primary" id="pt-save">Eintragen</button>
      <button class="btn btn-ghost" id="pt-back">Zurück</button>`);

  const grams = () => +$("#pt-g").value || 0;
  const calc  = () => Math.round(f.k * grams() / 100);
  $("#pt-g").oninput = () => {
    $("#pt-k").textContent = num(calc());
    $("#pt-m").textContent = MACROS.map(x =>
      `${Math.round(f[x.key] * grams() / 100)} g ${x.n}`).join(" · ");
  };
  $("#pt-g").oninput();
  $("#pt-save").onclick = async () => {
    const kcal = calc(), g = grams();
    if (!kcal) { toast("Bitte eine Menge eintragen."); return; }
    const macro = {};
    MACROS.forEach(x => macro[x.key] = +(f[x.key] * g / 100).toFixed(1));
    await addEntry("meals", { name:f.n, detail:`${g} g`, kcal, ...macro, src:"db" });
    closeSheet(); toast(`${num(kcal)} kcal eingetragen`);
  };
  $("#pt-back").onclick = openManual;
}

/* ─────────────────  13. TRAINING  ───────────────── */

$("#a-train").onclick = () => openTraining();

function openTraining(){
  const kg   = S.profile.weight;
  const avail = allActs(S.profile);
  const favs  = avail.filter(a => S.profile.activities.includes(a.id));
  const rest  = avail.filter(a => !S.profile.activities.includes(a.id));
  const list = arr => arr.map(a =>
    `<button class="qitem" data-id="${a.id}">
       <span class="t-txt"><span class="t-ttl">${esc(a.n)}</span>
         <span class="t-sub">${kcalHour(a,kg)} kcal pro Stunde</span></span>
       <span class="t-val">${Math.round(kcalHour(a,kg)/2)} kcal<br><span style="font-weight:600;color:var(--ink-3);font-size:12px">30 min</span></span>
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
    openDuration(allActs(S.profile).find(a => a.id === b.dataset.id)));
}

function openDuration(a){
  const kg = S.profile.weight, perH = kcalHour(a, kg);
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
$("#h-tier").onclick     = () => openSettings();   // Abzeichen führt direkt zur Stufe

function openSettings(){
  // Nach dem Anlegen eines eigenen Lebensmittels wird der Zwischenstand
  // weitergereicht, damit nichts Ungespeichertes verlorengeht.
  const p = settingsResume || S.profile;
  settingsResume = null;
  const draft = {
    ...p,
    diet: p.diet || "all",
    tier: p.tier || "basis",
    macroMode: p.macroMode || "auto",
    macros: p.macros ? { ...p.macros } : null,
    activities: [...p.activities],
    foods: [...p.foods],
    excluded: [...(p.excluded || [])],
    customFoods: [...(p.customFoods || [])],
    customActivities: [...(p.customActivities || [])],
    customDislikes: [...(p.customDislikes || [])]
  };

  const CHEV = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
    stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
  const X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
    stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  openSheet("Einstellungen", `
    <div class="settings-grp">
      <p class="eyebrow">Mitgliedschaft</p>
      <div class="tiles tiers" data-set="tier">
        ${TIERS.map(t => tileHTML(t.id, t.n, t.s, "", draft.tier === t.id)).join("")}
      </div>
    </div>

    <div class="settings-grp" id="st-coach-grp" ${hasCoach() ? "" : "hidden"}>
      <p class="eyebrow">Coach</p>
      <button class="pick-open" id="cc-clear">
        <span>Chatverlauf löschen</span><span class="pick-count" id="cc-count"></span></button>
      <p class="hint">Der Coach startet danach wieder mit der Begrüßung.</p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Körperdaten</p>
      <div class="row">
        <div class="field"><label for="st-w">Gewicht (kg)</label>
          <input id="st-w" type="number" inputmode="decimal" step="0.1" value="${draft.weight}"></div>
        <div class="field"><label for="st-h">Größe (cm)</label>
          <input id="st-h" type="number" inputmode="numeric" value="${draft.height}"></div>
      </div>
      <div class="row">
        <div class="field"><label for="st-a">Alter</label>
          <input id="st-a" type="number" inputmode="numeric" value="${draft.age}"></div>
        <div class="field"><label for="st-s">Geschlecht</label>
          <select id="st-s"><option value="m" ${draft.sex==="m"?"selected":""}>Männlich</option>
            <option value="w" ${draft.sex==="w"?"selected":""}>Weiblich</option></select></div>
      </div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Alltag</p>
      <select id="st-life">
        ${LIFESTYLE.map(l => `<option value="${l.id}" ${draft.lifestyle===l.id?"selected":""}>${l.n}</option>`).join("")}
      </select>
      <p class="hint" id="st-life-h"></p>
      <div class="field" id="st-lsk" style="margin-top:12px" ${draft.lifestyle==="manual"?"":"hidden"}>
        <label for="st-lskv">Zuschlag zum Grundumsatz (kcal)</label>
        <input id="st-lskv" type="number" inputmode="numeric" value="${draft.lifestyleKcal ?? DEF_LS_KCAL}">
      </div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Ziel</p>
      <select id="st-goal">
        ${GOALS.map(g => `<option value="${g.id}" ${draft.goal===g.id?"selected":""}>${g.n}</option>`).join("")}
      </select>
      <p class="hint" id="st-goal-h"></p>
      <div class="field" id="st-gk" style="margin-top:12px" ${draft.goal==="manual"?"":"hidden"}>
        <label for="st-gkv">Abweichung vom Grundbedarf (kcal)</label>
        <input id="st-gkv" type="number" inputmode="numeric" value="${draft.goalKcal ?? DEF_GOAL_KCAL}">
        <p class="hint">Negativ ergibt ein Defizit, positiv einen Überschuss.</p>
      </div>
      <p class="hint" id="st-preview"></p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Makroziele</p>
      <div class="seg" id="st-mm">
        <button data-mm="auto">Automatisch</button><button data-mm="custom">Eigene Werte</button>
      </div>
      <div id="st-macros"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Ernährungsform</p>
      <select id="st-diet">
        ${DIETS.map(d => `<option value="${d.id}" ${draft.diet===d.id?"selected":""}>${d.n}</option>`).join("")}
      </select>
      <p class="hint" id="st-diet-h"></p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Lieblings-Aktivitäten</p>
      <div id="pk-acts"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Lieblings-Lebensmittel</p>
      <div id="pk-foods"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Mag ich nicht</p>
      <div id="pk-excl"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Eigene Lebensmittel</p>
      <div id="st-own"></div>
      <button class="pick-open" id="own-add" style="margin-top:10px">
        <span>Lebensmittel anlegen</span><span class="pick-count">+</span></button>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Eigene Trainings</p>
      <div id="st-ownact"></div>
      <button class="pick-open" id="act-add" style="margin-top:10px">
        <span>Training anlegen</span><span class="pick-count">+</span></button>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Unverträglichkeiten</p>
      <div id="st-avoid"></div>
      <div class="row" style="margin-top:10px">
        <div class="field" style="margin:0"><input id="av-in" type="text" placeholder="z. B. Laktose"></div>
        <button class="btn btn-glass btn-sm" id="av-add" style="flex:0 0 92px">Hinzufügen</button>
      </div>
      <p class="hint">Wird bei Vorschlägen berücksichtigt.</p>
    </div>


    <div class="settings-grp">
      <p class="eyebrow">Rechtliches</p>
      ${Object.keys(LEGAL).map(k => `
        <button class="pick-open" data-legal="${k}" style="margin-bottom:8px">
          <span>${LEGAL[k].t}</span><span class="pick-count">${CHEV}</span></button>`).join("")}
    </div>

    <div class="settings-grp">
      <p class="eyebrow">Konto</p>
      <button class="pick-open" id="st-del" style="color:var(--bad)">
        <span>Konto und alle Daten löschen</span><span class="pick-count" style="color:var(--bad)">${CHEV}</span></button>
    </div>
  `, `<button class="btn btn-primary" id="st-save">Speichern</button>
      <button class="btn btn-ghost" id="st-out" style="color:var(--ink-3)">Abmelden</button>`);

  /* ── Körperdaten und Vorschau ── */
  const preview = () => {
    draft.weight = +$("#st-w").value || draft.weight;
    draft.height = +$("#st-h").value || draft.height;
    draft.age    = +$("#st-a").value || draft.age;
    draft.sex    = $("#st-s").value;
    draft.lifestyleKcal = Math.round(+$("#st-lskv").value || 0);
    draft.goalKcal      = Math.round(+$("#st-gkv").value  || 0);
    $("#st-lsk").hidden = draft.lifestyle !== "manual";
    $("#st-gk").hidden  = draft.goal      !== "manual";
    // Beschreibung der gewählten Option unter die Liste schreiben
    $("#st-life-h").textContent = (LIFESTYLE.find(l => l.id === draft.lifestyle) || {}).s || "";
    $("#st-goal-h").textContent = (GOALS.find(g => g.id === draft.goal) || {}).s || "";
    $("#st-preview").innerHTML =
      `Neues Tagesbudget: <b>${num(targetOf(draft))} kcal</b> · Grundbedarf ${num(tdeeOf(draft))} kcal`
      + (targetFloored(draft)
        ? `<br><b style="color:var(--warn)">Untergrenze von ${num(kcalFloor(draft))} kcal greift –
           ein größerer Abzug wird nicht übernommen.</b>` : "");
    if (draft.macroMode !== "custom" && $("#st-macros")) paintMacros();
  };
  ["#st-w","#st-h","#st-a","#st-s","#st-lskv","#st-gkv"].forEach(x => $(x).oninput = preview);

  /* ── Kachelgruppen ── */
  // Mitgliedschaft bleibt als Kacheln — dort trägt die Optik die Aussage
  $$("#sheet-body .tiles").forEach(box => {
    const key = box.dataset.set;
    $$(".tile", box).forEach(t => t.onclick = () => {
      draft[key] = t.dataset.id;
      $$(".tile", box).forEach(x => x.classList.toggle("sel", x === t));
      if (key === "tier") $("#st-coach-grp").hidden = !["premium","ultra"].includes(draft.tier);
    });
  });

  $("#st-life").onchange = () => { draft.lifestyle = $("#st-life").value; preview(); };
  $("#st-goal").onchange = () => { draft.goal      = $("#st-goal").value; preview(); };
  $("#st-diet").onchange = () => {
    draft.diet = $("#st-diet").value;
    $("#st-diet-h").textContent = (DIETS.find(d => d.id === draft.diet) || {}).s || "";
    repaintPickers();
  };
  $("#st-diet-h").textContent = (DIETS.find(d => d.id === draft.diet) || {}).s || "";

  /* ── Auswahl-Blöcke: Gewähltes oben, Gesamtliste aufklappbar ──────────
     Der Zustand "offen" bleibt beim Neuzeichnen erhalten, sonst würde die
     Liste bei jedem Klick zuklappen. */
  const openState = {};
  function picker(host, list, key, label, variant = "sel", opposite = null){
    const box = $(host);
    const sel = list.filter(f => draft[key].includes(f.id));
    box.innerHTML = `
      <div class="pick-sum">${sel.map(f =>
        `<button class="chip ${variant}" data-id="${f.id}">${esc(f.n)} <em>${label(f)}</em></button>`).join("")}</div>
      ${sel.length ? "" : `<p class="pick-none">Noch nichts ausgewählt.</p>`}
      <button class="pick-open ${openState[host] ? "open" : ""}">
        <span>${openState[host] ? "Liste schließen" : "Alle anzeigen"}</span>
        <span class="pick-count">${sel.length} von ${list.length} ${CHEV}</span></button>
      <div class="pick-all" ${openState[host] ? "" : "hidden"}>
        ${groupedChips(list, draft[key], label, variant)}</div>`;

    $(".pick-open", box).onclick = () => {
      openState[host] = !openState[host];
      picker(host, list, key, label, variant, opposite);
    };

    const flip = id => {
      const arr = draft[key], i = arr.indexOf(id);
      if (i > -1) arr.splice(i,1); else arr.push(id);
      if (opposite && i === -1){
        const o = draft[opposite], j = o.indexOf(id);
        if (j > -1) o.splice(j,1);
      }
      repaintPickers();
    };
    $$(".chip", box).forEach(c => c.onclick = () => flip(c.dataset.id));
  }

  const foodLabel = f => `${f.k} kcal/100 g`;
  const actLabel  = a => `${kcalHour(a, draft.weight)} kcal/h`;

  function repaintPickers(){
    const list = allFoods(draft).filter(f => fitsDiet(f, draft.diet));
    // Auswahl bereinigen, die zur aktuellen Ernährungsform nicht mehr passt
    draft.foods    = draft.foods.filter(id => list.some(f => f.id === id));
    draft.excluded = draft.excluded.filter(id => list.some(f => f.id === id));
    picker("#pk-acts",  allActs(draft), "activities", actLabel);
    picker("#pk-foods", list, "foods",    foodLabel, "sel", "excluded");
    picker("#pk-excl",  list, "excluded", foodLabel, "no",  "foods");
    paintOwn();
    paintOwnActs();
  }
  repaintPickers();

  /* ── Makroziele ── */
  function paintMacros(){
    const auto = draft.macroMode !== "custom";
    const m = auto ? macroTargets(draft) : (draft.macros || macroTargets(draft));
    $$("#st-mm button").forEach(b => b.classList.toggle("on", (b.dataset.mm === "custom") === !auto));
    $("#st-macros").innerHTML = `
      <div class="row">${MACROS.map(x => `
        <div class="field"><label for="mg-${x.key}">${x.n} (g)</label>
          <input id="mg-${x.key}" type="number" inputmode="numeric" value="${m[x.key]}" ${auto ? "disabled" : ""}></div>`).join("")}
      </div>
      <p class="hint">${auto
        ? `Aus Gewicht und Ziel berechnet: ${(PROTEIN_PER_KG[draft.goal] ?? 1.8).toFixed(1)} g Eiweiß je kg, 27 % der Kalorien aus Fett, Rest Kohlenhydrate.`
        : `Ergibt ${num(macroKcal(m))} kcal — dein Tagesziel liegt bei ${num(targetOf(draft))} kcal.`}</p>`;
    if (!auto) MACROS.forEach(x => $("#mg-" + x.key).oninput = () => {
      draft.macros = draft.macros || macroTargets(draft);
      draft.macros[x.key] = Math.max(0, +$("#mg-" + x.key).value || 0);
      $("#st-macros .hint").textContent =
        `Ergibt ${num(macroKcal(draft.macros))} kcal — dein Tagesziel liegt bei ${num(targetOf(draft))} kcal.`;
    });
  }
  $$("#st-mm button").forEach(b => b.onclick = () => {
    draft.macroMode = b.dataset.mm;
    if (draft.macroMode === "custom" && !draft.macros) draft.macros = macroTargets(draft);
    paintMacros();
  });
  preview();

  /* ── Eigene Lebensmittel ── */
  function paintOwn(){
    const own = draft.customFoods;
    $("#st-own").innerHTML = own.length
      ? own.map(f => `<div class="own">
          <span class="t-txt"><span class="t-ttl">${esc(f.n)}</span>
            <span class="t-sub">${f.k} kcal/100 g · E ${f.pr} · K ${f.ch} · F ${f.fa}</span></span>
          <button class="del" data-id="${f.id}" aria-label="Entfernen">${X}</button></div>`).join("")
      : `<p class="pick-none">Noch keine eigenen Lebensmittel.</p>`;
    $$("#st-own .del").forEach(b => b.onclick = () => {
      draft.customFoods = draft.customFoods.filter(f => f.id !== b.dataset.id);
      draft.foods    = draft.foods.filter(id => id !== b.dataset.id);
      draft.excluded = draft.excluded.filter(id => id !== b.dataset.id);
      repaintPickers();
    });
  }

  /* Eigene Trainings */
  function paintOwnActs(){
    const own = draft.customActivities;
    $("#st-ownact").innerHTML = own.length
      ? own.map(a => `<div class="own">
          <span class="t-txt"><span class="t-ttl">${esc(a.n)}</span>
            <span class="t-sub">${a.kcalh} kcal pro Stunde</span></span>
          <button class="del" data-id="${a.id}" aria-label="Entfernen">${X}</button></div>`).join("")
      : `<p class="pick-none">Noch keine eigenen Trainings.</p>`;
    $$("#st-ownact .del").forEach(b => b.onclick = () => {
      draft.customActivities = draft.customActivities.filter(a => a.id !== b.dataset.id);
      draft.activities = draft.activities.filter(id => id !== b.dataset.id);
      repaintPickers();
    });
  }

  $("#act-add").onclick = () => openOwnAct(a => {
    draft.customActivities.push(a);
    draft.activities.push(a.id);       // eigenes Training gleich als Favorit
    openSettingsKeep(draft);
  });

  $("#own-add").onclick = () => openOwnFood(f => {
    draft.customFoods.push(f);
    draft.foods.push(f.id);          // eigene Lebensmittel gleich als Favorit
    openSettingsKeep(draft);
  });

  /* ── Unverträglichkeiten ── */
  function paintAvoid(){
    $("#st-avoid").innerHTML = draft.customDislikes.length
      ? `<div class="pick-sum">${draft.customDislikes.map((a,i) =>
          `<button class="chip no" data-i="${i}">${esc(a)}</button>`).join("")}</div>`
      : `<p class="pick-none">Nichts eingetragen.</p>`;
    $$("#st-avoid .chip").forEach(c => c.onclick = () => {
      draft.customDislikes.splice(+c.dataset.i, 1); paintAvoid();
    });
  }
  paintAvoid();
  const addAvoid = () => {
    const v = $("#av-in").value.trim();
    if (!v) return;
    if (!draft.customDislikes.includes(v)) draft.customDislikes.push(v);
    $("#av-in").value = ""; paintAvoid();
  };
  $("#av-add").onclick = addAvoid;
  $("#av-in").onkeydown = e => { if (e.key === "Enter"){ e.preventDefault(); addAvoid(); } };

  /* ── Speichern ── */
  $("#st-save").onclick = async () => {
    preview();
    if (!(draft.weight >= 30 && draft.weight <= 300)) { toast("Gewicht zwischen 30 und 300 kg eintragen."); return; }
    if (!(draft.height >= 120 && draft.height <= 230)) { toast("Größe zwischen 120 und 230 cm eintragen."); return; }
    if (!(draft.age >= 14 && draft.age <= 100)) { toast("Alter zwischen 14 und 100 Jahren eintragen."); return; }
    if (draft.lifestyle === "manual" && !(draft.lifestyleKcal >= 0 && draft.lifestyleKcal <= 3000)) {
      toast("Zuschlag zwischen 0 und 3000 kcal eintragen."); return; }
    if (draft.goal === "manual" && !(draft.goalKcal >= -1500 && draft.goalKcal <= 1500)) {
      toast("Abweichung zwischen -1500 und +1500 kcal eintragen."); return; }
    S.profile = { ...S.profile, ...draft };
    try { await saveProfile(); } catch { toast("Speichern fehlgeschlagen."); return; }
    if (viewingToday() && (S.day.meals.length || S.day.workouts.length)){
      try { await saveDay(); } catch {}
    }
    renderHome(); closeSheet(); toast("Einstellungen gespeichert");
  };
  /* Chatverlauf zurücksetzen. Zweistufig, weil er nicht wiederherstellbar ist. */
  const countMsgs = () => Math.max(0, (S.chat || []).filter(m => m.role === "user").length);
  $("#cc-count").textContent = countMsgs() ? `${countMsgs()} Fragen` : "leer";
  let armed = false;
  $("#cc-clear").onclick = async () => {
    if (!armed){
      armed = true;
      $("#cc-clear").querySelector("span").textContent = "Wirklich löschen?";
      $("#cc-count").textContent = "tippen zum Bestätigen";
      setTimeout(() => {
        if (!armed) return;
        armed = false;
        const b = $("#cc-clear");
        if (!b) return;
        b.querySelector("span").textContent = "Chatverlauf löschen";
        $("#cc-count").textContent = countMsgs() ? `${countMsgs()} Fragen` : "leer";
      }, 4000);
      return;
    }
    armed = false;
    S.chat = [{ role:"assistant", content: GREETING, t: clock() }];
    await saveChat();
    $("#cc-clear").querySelector("span").textContent = "Chatverlauf löschen";
    $("#cc-count").textContent = "leer";
    toast("Chatverlauf gelöscht");
  };

  $$("#sheet-body [data-legal]").forEach(b => b.onclick = () => openLegal(b.dataset.legal));
  $("#st-del").onclick = () => openDeleteAccount();

  $("#st-out").onclick = () => { closeSheet(); signOut(auth); };
}

/* Einstellungen mit Zwischenstand neu öffnen, ohne das Profil zu speichern */
let settingsResume = null;
function openSettingsKeep(draft){
  settingsResume = draft;
  openSettings();
}

/* ─────────────────  16. RECHTLICHES  ─────────────────
   Die mit «» markierten Stellen musst du vor der Veröffentlichung selbst
   ausfüllen. Der Rest ist ein Gerüst, kein anwaltlich geprüfter Text. */

const LEGAL_UPDATED = "«Datum der letzten Änderung»";

const LEGAL = {
  imprint: { t:"Impressum", body:`
<p class="todo">Vor Veröffentlichung ausfüllen. Anschrift muss ladungsfähig sein, ein Postfach genügt nicht.</p>
<h4>Angaben gemäß § 5 DDG</h4>
<p>«Vor- und Nachname»<br>«Straße und Hausnummer»<br>«PLZ und Ort»<br>Deutschland</p>
<h4>Kontakt</h4>
<p>E-Mail: «kontakt@deine-domain.de»<br>Telefon: «Telefonnummer»</p>
<h4>Umsatzsteuer</h4>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: «DE…»<br>
Alternativ, falls Kleinunternehmer: Gemäß § 19 UStG wird keine Umsatzsteuer erhoben.</p>
<h4>Verantwortlich für den Inhalt</h4>
<p>«Vor- und Nachname», Anschrift wie oben.</p>
<h4>Streitbeilegung</h4>
<p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.</p>` },

  privacy: { t:"Datenschutz", body:`
<p class="todo">Gerüst mit den tatsächlich eingesetzten Diensten. Vor Veröffentlichung juristisch prüfen lassen.</p>
<h4>Verantwortlicher</h4>
<p>«Vor- und Nachname», «Anschrift», «E-Mail».</p>
<h4>Welche Daten wir verarbeiten</h4>
<p>Zugangsdaten: E-Mail-Adresse und Kennung deines Kontos.<br>
Gesundheitsbezogene Daten: Gewicht, Größe, Alter, Geschlecht, Ziele, erfasste Mahlzeiten
und Trainings, Fotos von Mahlzeiten, Angaben zu Vorlieben und Unverträglichkeiten.<br>
Nutzungsdaten: Zeitpunkte deiner Einträge, Verlauf des Coach-Chats.</p>
<h4>Rechtsgrundlage</h4>
<p>Gesundheitsbezogene Daten sind besondere Kategorien personenbezogener Daten nach
Art. 9 DSGVO. Wir verarbeiten sie ausschließlich auf Grundlage deiner ausdrücklichen
Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO, die du beim Einrichten erteilt hast und
jederzeit widerrufen kannst. Die Vertragserfüllung stützt sich auf Art. 6 Abs. 1 lit. b DSGVO.</p>
<h4>Empfänger</h4>
<p>Google Ireland Limited beziehungsweise Google LLC für Anmeldung und Datenbank (Firebase).<br>
Vercel Inc., USA, für den Betrieb der Anwendung.<br>
Anthropic PBC, USA, für die Analyse von Mahlzeitenfotos, die Essensvorschläge und den Coach.</p>
<h4>Übermittlung in Drittländer</h4>
<p>Bei den genannten Diensten werden Daten in den USA verarbeitet. Grundlage sind die
Standardvertragsklauseln der EU-Kommission sowie, soweit einschlägig, das EU-US Data
Privacy Framework.</p>
<h4>Speicherdauer</h4>
<p>Deine Daten bleiben gespeichert, solange dein Konto besteht. Löschst du dein Konto,
werden sie entfernt. Den Coach-Verlauf kannst du jederzeit in den Einstellungen löschen.</p>
<h4>Deine Rechte</h4>
<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung kannst du jederzeit mit
Wirkung für die Zukunft widerrufen. Außerdem steht dir ein Beschwerderecht bei einer
Aufsichtsbehörde zu, für «Bundesland» ist das «zuständige Aufsichtsbehörde».</p>
<h4>Stand</h4>
<p>${LEGAL_UPDATED}</p>` },

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
};

/* Konto und sämtliche Daten entfernen. Erst Firestore, dann das Konto selbst —
   nach dem Löschen des Kontos fehlt die Berechtigung für die Dokumente. */
async function wipeAccount(){
  const uid = S.uid;
  const days = await getDocs(collection(db, "users", uid, "days"));
  const jobs = [];
  days.forEach(d => jobs.push(deleteDoc(doc(db, "users", uid, "days", d.id))));
  jobs.push(deleteDoc(doc(db, "users", uid, "chat", "main")));
  await Promise.all(jobs);
  await deleteDoc(doc(db, "users", uid));
  await deleteUser(auth.currentUser);
}

function openDeleteAccount(){
  const user = auth.currentUser;
  const viaGoogle = (user?.providerData || []).some(p => p.providerId === "google.com");
  const WORD = "LÖSCHEN";

  const form = (reauth) => `
    <p class="legal" style="margin-bottom:14px">Damit werden dein Konto und alle
    gespeicherten Daten endgültig entfernt: Körperdaten und Ziele, sämtliche erfassten
    Mahlzeiten und Trainings, eigene Lebensmittel und Trainings sowie der Coach-Verlauf.
    Das lässt sich nicht rückgängig machen.</p>

    ${reauth ? `<p class="todo" style="margin-bottom:14px">Aus Sicherheitsgründen musst du
      dich dafür erneut anmelden.</p>
      ${viaGoogle
        ? `<button class="btn btn-glass" id="da-google">Mit Google bestätigen</button>`
        : `<div class="field"><label for="da-pass">Dein Passwort</label>
             <input id="da-pass" type="password" autocomplete="current-password"></div>`}`
    : ""}

    <div class="field" style="margin-top:14px">
      <label for="da-word">Tippe <b>${WORD}</b>, um zu bestätigen</label>
      <input id="da-word" type="text" autocapitalize="characters" autocomplete="off" placeholder="${WORD}">
    </div>
    <p class="err" id="da-err"></p>`;

  const paint = (reauth = false) => {
    openSheet("Konto löschen", form(reauth),
      `<button class="btn btn-primary" id="da-go" style="background:linear-gradient(180deg,#F87171,#DC2626);
         box-shadow:0 12px 26px rgba(200,40,40,.28)" disabled>Endgültig löschen</button>
       <button class="btn btn-ghost" id="da-back">Abbrechen</button>`);

    $("#da-word").oninput = () =>
      $("#da-go").disabled = $("#da-word").value.trim().toUpperCase() !== WORD;
    $("#da-back").onclick = () => openSettings();

    if (reauth && viaGoogle) $("#da-google").onclick = async () => {
      try { await reauthenticateWithPopup(auth.currentUser, gprov); $("#da-err").textContent = ""; }
      catch { $("#da-err").textContent = "Die Bestätigung hat nicht geklappt."; }
    };

    $("#da-go").onclick = async () => {
      $("#da-go").disabled = true;
      $("#da-err").textContent = "";
      try {
        if (reauth && !viaGoogle){
          const pw = $("#da-pass").value;
          if (!pw) throw { code:"no-pass" };
          await reauthenticateWithCredential(auth.currentUser,
            EmailAuthProvider.credential(auth.currentUser.email, pw));
        }
        await wipeAccount();
        S.chat = null;
        closeSheet();
        toast("Konto gelöscht");
      } catch (e) {
        if (e?.code === "auth/requires-recent-login"){ paint(true); return; }
        $("#da-err").textContent =
          e?.code === "no-pass" ? "Bitte dein Passwort eingeben."
          : e?.code === "auth/invalid-credential" || e?.code === "auth/wrong-password"
            ? "Das Passwort stimmt nicht."
            : "Löschen fehlgeschlagen. Versuch es später erneut.";
        $("#da-go").disabled = false;
      }
    };
  };
  paint();
}

function openLegal(key){
  const l = LEGAL[key];
  openSheet(l.t, `<div class="legal">${l.body}</div>`,
    `<button class="btn btn-glass" id="lg-back">Zurück</button>`);
  $("#lg-back").onclick = () => openSettings();
}

/* Formular für ein eigenes Training */
function openOwnAct(done){
  openSheet("Eigenes Training", `
    <div class="field"><label for="oa-n">Bezeichnung</label>
      <input id="oa-n" type="text" placeholder="z. B. Bouldern in der Halle"></div>
    <div class="field"><label for="oa-k">Kalorien pro Stunde</label>
      <input id="oa-k" type="number" inputmode="numeric" placeholder="600"></div>
    <p class="hint" id="oa-note"></p>
  `, `<button class="btn btn-primary" id="oa-save">Anlegen</button>
      <button class="btn btn-ghost" id="oa-back">Abbrechen</button>`);

  const check = () => {
    const k = +$("#oa-k").value || 0;
    $("#oa-note").textContent = k
      ? `Ergibt ${num(Math.round(k/2))} kcal für 30 Minuten.`
      : "Dieser Wert gilt unabhängig vom Körpergewicht — er kommt direkt von dir.";
  };
  $("#oa-k").oninput = check;
  check();

  $("#oa-save").onclick = () => {
    const n = $("#oa-n").value.trim(), k = +$("#oa-k").value;
    if (!n) { toast("Bitte eine Bezeichnung eintragen."); return; }
    if (!(k > 0 && k <= 2000)) { toast("Kalorien zwischen 1 und 2000 pro Stunde eintragen."); return; }
    done({ id: "act_" + crypto.randomUUID().slice(0,8), g: "Eigene", n,
           kcalh: Math.round(k), custom: true });
  };
  $("#oa-back").onclick = () => openSettings();
}

/* Formular für ein eigenes Lebensmittel */
function openOwnFood(done){
  openSheet("Eigenes Lebensmittel", `
    <div class="field"><label for="of-n">Bezeichnung</label>
      <input id="of-n" type="text" placeholder="z. B. Proteinbrot vom Bäcker"></div>
    <div class="field"><label for="of-k">Kalorien je 100 g</label>
      <input id="of-k" type="number" inputmode="numeric" placeholder="230"></div>
    <p class="group-label">Makros je 100 g</p>
    <div class="row">
      <div class="field"><label for="of-pr">Eiweiß</label>
        <input id="of-pr" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label for="of-ch">Kohlenhydr.</label>
        <input id="of-ch" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label for="of-fa">Fett</label>
        <input id="of-fa" type="number" inputmode="decimal" placeholder="0"></div>
    </div>
    <div class="field"><label for="of-p">Übliche Portion (g)</label>
      <input id="of-p" type="number" inputmode="numeric" value="100"></div>
    <p class="hint" id="of-note"></p>
  `, `<button class="btn btn-primary" id="of-save">Anlegen</button>
      <button class="btn btn-ghost" id="of-back">Abbrechen</button>`);

  const check = () => {
    const k = +$("#of-k").value || 0;
    const calc = (+$("#of-pr").value||0)*4 + (+$("#of-ch").value||0)*4 + (+$("#of-fa").value||0)*9;
    $("#of-note").innerHTML = (k && calc)
      ? `Aus den Makros ergeben sich ${num(calc)} kcal.`
        + (Math.abs(calc-k) > k*0.2 ? ` <b style="color:var(--warn)">Das weicht deutlich von deiner Kalorienangabe ab.</b>` : "")
      : "Alkohol zählt nicht zu den Makros — dort darf die Rechnung abweichen.";
  };
  ["#of-k","#of-pr","#of-ch","#of-fa"].forEach(x => $(x).oninput = check);
  check();

  $("#of-save").onclick = () => {
    const n = $("#of-n").value.trim(), k = +$("#of-k").value;
    if (!n) { toast("Bitte eine Bezeichnung eintragen."); return; }
    if (!(k > 0 && k <= 900)) { toast("Kalorien zwischen 1 und 900 je 100 g eintragen."); return; }
    done({
      id: "own_" + crypto.randomUUID().slice(0,8),
      g: "Eigene", n, k: Math.round(k),
      p: Math.max(1, Math.round(+$("#of-p").value || 100)),
      pr: +(+$("#of-pr").value || 0), ch: +(+$("#of-ch").value || 0), fa: +(+$("#of-fa").value || 0),
      custom: true
    });
  };
  $("#of-back").onclick = () => openSettings();
}

/* Tageswechsel abfangen, wenn die App im Hintergrund lag */
document.addEventListener("visibilitychange", async () => {
  // Nach Mitternacht auf den neuen Tag springen — aber nur, wenn der Nutzer
  // nicht gerade bewusst einen vergangenen Tag ansieht.
  if (!document.hidden && S.uid && S.profile && !S.pinned && S.dayKey !== todayKey()){
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
