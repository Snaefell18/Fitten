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

import { LANGS, LOCALE, STRINGS, CATALOG, LEGAL_TEXT } from "./i18n.js";

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
const num = n => Math.round(n).toLocaleString(LOCALE[LANG] || LOCALE.de);
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const clock = () => new Date().toTimeString().slice(0,5);

/* ─────────────────  4a. SPRACHE  ─────────────────
   Deutsch steht an den Daten oben, jede weitere Sprache kommt aus i18n.js.
   Die Wahl liegt im Profil und zusätzlich lokal — damit schon Login und
   Onboarding in der richtigen Sprache erscheinen, bevor ein Profil da ist. */

const LANG_KEY = "fitten-lang";
const LANG_IDS = LANGS.map(l => l.id);

function detectLang(){
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANG_IDS.includes(saved)) return saved;
  } catch {}
  // Sonst die erste Browsersprache, die wir sprechen
  const nav = (navigator.languages || [navigator.language || ""]).map(l => String(l).slice(0,2));
  return nav.find(l => LANG_IDS.includes(l)) || "de";
}

let LANG = detectLang();

/* Fehlt eine Übersetzung, greift Deutsch — die App bleibt bedienbar. */
function t(key, ...args){
  const e = STRINGS[key];
  const v = e ? (e[LANG] ?? e.de) : key;
  return typeof v === "function" ? v(...args) : v;
}

/* Gruppennamen der Kataloge. Eigene Einträge des Nutzers tragen dauerhaft
   "Eigene" als Schlüssel, übersetzt wird erst beim Anzeigen. */
const grpName = g => CATALOG[LANG]?.group?.[g] ?? g;

/* Kataloge in die aktive Sprache bringen. Die deutschen Originale bleiben
   unter __n/__s/__g liegen, damit der Wechsel in beide Richtungen geht. */
function localizeData(){
  const c = CATALOG[LANG];
  const put = (list, dict, pair = false) => list.forEach(o => {
    if (o.__n === undefined){ o.__n = o.n; o.__s = o.s; o.__g = o.g; }
    const e = dict ? dict[o.id] : null;
    o.n = (pair ? e?.[0] : e) ?? o.__n;
    if (o.__s !== undefined) o.s = (pair ? e?.[1] : undefined) ?? o.__s;
    if (o.__g !== undefined) o.g = grpName(o.__g);
  });
  put(ACTIVITIES, c?.act);
  put(FOODS,      c?.food);
  put(GOALS,      c?.goal, true);
  put(DIETS,      c?.diet, true);
  put(LIFESTYLE,  c?.life, true);
  put(TIERS,      c?.tier, true);
  MACROS.forEach(m => {
    if (m.__n === undefined) m.__n = m.n;
    m.n = c?.macro?.[m.key] ?? m.__n;
  });
}

/* Feste Texte im HTML. Alles Dynamische läuft ohnehin über t(). */
function applyStaticText(){
  $$("[data-i18n]").forEach(el      => el.textContent = t(el.dataset.i18n));
  $$("[data-i18n-ph]").forEach(el   => el.placeholder = t(el.dataset.i18nPh));
  $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
}

function setLang(lang){
  if (!LANG_IDS.includes(lang)) return;
  LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  document.documentElement.lang = lang;
  document.title = t("app.title");
  localizeData();
  applyStaticText();
}

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

/* Erst hier, weil localizeData() alle Kataloge oben braucht — TIERS und
   MACROS stehen im Abschnitt darüber. */
setLang(LANG);

let signupMode = false;

$("#li-toggle").onclick = () => {
  signupMode = !signupMode;
  $("#li-go").textContent     = signupMode ? t("li.up") : t("li.in");
  $("#li-toggle").textContent = signupMode ? t("li.toIn") : t("li.toUp");
  $("#li-pass").autocomplete  = signupMode ? "new-password" : "current-password";
  $("#li-err").textContent    = "";
};

/* Die Meldungen selbst stehen in i18n.js unter dem Firebase-Code. */
const AUTH_ERR = new Set([
  "auth/invalid-email", "auth/invalid-credential", "auth/wrong-password",
  "auth/user-not-found", "auth/email-already-in-use", "auth/weak-password",
  "auth/popup-closed-by-user", "auth/network-request-failed"
]);

async function doAuth(fn){
  $("#li-err").textContent = "";
  $("#li-go").disabled = true;
  try { await fn(); }
  catch(e){ $("#li-err").textContent = AUTH_ERR.has(e.code) ? t(e.code) : t("li.failed"); }
  finally { $("#li-go").disabled = false; }
}

$("#li-go").onclick = () => {
  const mail = $("#li-mail").value.trim(), pass = $("#li-pass").value;
  if (!mail || !pass) { $("#li-err").textContent = t("li.needBoth"); return; }
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
    // Sprache des Kontos gewinnt — sie gilt auf jedem Gerät
    if (S.profile.lang && S.profile.lang !== LANG) setLang(S.profile.lang);
    await loadDay();
    renderHome();
    screen("s-home");
    setTimeout(maybeRecap, 900);
    setTimeout(maybeShowInstall, 2600);
  } else {
    S.draft = { sex:"m", lifestyle:"mid", goal:"cut1", diet:"all", lang:LANG,
                consent:false, activities:[], foods:[], excluded:[] };
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
  try { await saveDay(); } catch { toast(t("h.offline")); }
}
async function delEntry(kind, id){
  S.day[kind] = S.day[kind].filter(e => e.id !== id);
  renderHome();
  try { await saveDay(); } catch {}
}

/* ─────────────────  8. ONBOARDING  ───────────────── */

const OB = [
  {
    get title(){ return t("ob1.title"); },
    get sub(){ return t("ob1.sub"); },
    render(){
      const d = S.draft;
      return `
        <div class="row">
          <div class="field"><label for="f-w">${t("f.weight")}</label>
            <input id="f-w" type="number" inputmode="decimal" min="30" max="300" step="0.1" value="${d.weight ?? ""}" placeholder="78"></div>
          <div class="field"><label for="f-h">${t("f.height")}</label>
            <input id="f-h" type="number" inputmode="numeric" min="120" max="230" value="${d.height ?? ""}" placeholder="182"></div>
        </div>
        <div class="row">
          <div class="field"><label for="f-a">${t("f.age")}</label>
            <input id="f-a" type="number" inputmode="numeric" min="14" max="100" value="${d.age ?? ""}" placeholder="29"></div>
          <div class="field"><label for="f-s">${t("f.sex")}</label>
            <select id="f-s">
              <option value="m" ${d.sex==="m"?"selected":""}>${t("f.male")}</option>
              <option value="w" ${d.sex==="w"?"selected":""}>${t("f.female")}</option>
            </select></div>
        </div>
        <p class="group-label">${t("ob1.everyday")}</p>
        <div class="tiles">
          ${LIFESTYLE.map(l => tileHTML(l.id, l.n, l.s, "", d.lifestyle===l.id)).join("")}
        </div>
        <div class="field" id="ob-lsk" style="margin-top:12px" ${d.lifestyle==="manual"?"":"hidden"}>
          <label for="f-lsk">${t("f.lsk")}</label>
          <input id="f-lsk" type="number" inputmode="numeric" value="${d.lifestyleKcal ?? DEF_LS_KCAL}">
        </div>
        <p class="hint">${t("ob1.hint")}</p>

        <button class="consent ${d.consent ? "sel" : ""}" id="f-consent">
          <span class="check">${ICON.check}</span>
          <span class="tx">${t("ob1.consent")}</span>
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
      if (!(w >= 30 && w <= 300)) return t("ob1.errWeight");
      if (!(h >= 120 && h <= 230)) return t("ob1.errHeight");
      if (!(a >= 14 && a <= 100))  return t("ob1.errAge");
      if (!S.draft.consent) return t("ob1.errConsent");
      Object.assign(S.draft, { weight:w, height:h, age:a, sex:$("#f-s").value });
      if (S.draft.lifestyle === "manual"){
        const k = +$("#f-lsk").value;
        if (!(k >= 0 && k <= 3000)) return t("ob1.errLsk");
        S.draft.lifestyleKcal = Math.round(k);
      }
      return null;
    }
  },
  {
    get title(){ return t("ob2.title"); },
    get sub(){ return t("ob2.sub"); },
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
        <label for="f-gk">${t("f.gk")}</label>
        <input id="f-gk" type="number" inputmode="numeric" value="${gk}">
        <p class="hint" id="ob-gk-note">${t("f.gkNote")}</p>
      </div>
      <p class="hint">${t("hint.tdee", num(tdee), num(bmrOf(p)))}</p>`;
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
          ? `<b style="color:var(--warn)">${t("f.floor", num(kcalFloor(S.draft)))}</b>`
          : t("f.gkNote");
      };
    },
    read(){
      if (!S.draft.goal) return t("ob2.errGoal");
      if (S.draft.goal === "manual"){
        const k = Math.round(+$("#f-gk").value || 0);
        if (!(k >= -1500 && k <= 1500)) return t("ob2.errKcal");
        S.draft.goalKcal = k;
      }
      return null;
    }
  },
  {
    get title(){ return t("ob3.title"); },
    get sub(){ return t("ob3.sub"); },
    render(){
      const kg = S.draft.weight || 75;
      return groupedChips(ACTIVITIES, S.draft.activities,
        a => `${kcalPerHour(a.met, kg)} ${t("unit.kcalH")}`);
    },
    bind(){ bindChips("activities"); },
    read(){ return S.draft.activities.length ? null : t("ob3.err"); }
  },
  {
    get title(){ return t("ob4.title"); },
    get sub(){ return t("ob4.sub"); },
    render(){
      return `<div class="tiles">${DIETS.map(d => {
        const n = FOODS.filter(f => fitsDiet(f, d.id)).length;
        return tileHTML(d.id, d.n, d.s, t("ob4.count", n), S.draft.diet === d.id);
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
    read(){ return S.draft.diet ? null : t("ob4.err"); }
  },
  {
    get title(){ return t("ob5.title"); },
    get sub(){ return t("ob5.sub"); },
    render(){
      const list = FOODS.filter(f => fitsDiet(f, S.draft.diet));
      return groupedChips(list, S.draft.foods, foodLabel);
    },
    bind(){ bindChips("foods"); },
    read(){ return S.draft.foods.length ? null : t("ob5.err"); }
  },
  {
    get title(){ return t("ob6.title"); },
    get sub(){ return t("ob6.sub"); },
    render(){
      const list = FOODS.filter(f => fitsDiet(f, S.draft.diet));
      return groupedChips(list, S.draft.excluded, foodLabel, "no");
    },
    bind(){ bindChips("excluded", "no", "foods"); },
    read(){ return null; }
  }
];

/* Etiketten der Chips — überall gleich, damit Einheiten nicht auseinanderlaufen */
const foodLabel = f => `${f.k} ${t("unit.kcalPer100")}`;

function tileHTML(id, ttl, sub, val, sel){
  return `<button class="tile ${sel?"sel":""}" data-id="${id}">
    <span class="t-txt"><span class="t-ttl">${esc(ttl)}</span>${sub?`<span class="t-sub">${esc(sub)}</span>`:""}</span>
    ${val?`<span class="t-val">${val}</span>`:""}
    <span class="check">${ICON.check}</span></button>`;
}
function groupedChips(list, selected, label, variant = "sel"){
  const groups = [...new Set(list.map(x => x.g))];
  return groups.map(g => `
    <p class="group-label">${esc(grpName(g))}</p>
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
  $("#ob-eyebrow").textContent = t("ob.step", S.obStep + 1, OB.length);
  $("#ob-title").textContent   = st.title;
  $("#ob-sub").textContent     = st.sub;
  $("#ob-body").innerHTML      = st.render();
  st.bind();
  $$("#ob-steps i").forEach((i, n) => i.classList.toggle("done", n <= S.obStep));
  $("#ob-next").textContent = S.obStep === OB.length-1 ? t("ob.start") : t("btn.next");
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
    toast(t("ob.saveFailed"));
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

/* In dieser Funktion steht t bereits für die Tagessummen — die Texte
   kommen deshalb über tr. */
const tr = t;

function renderHome(){
  const t = totals();
  const today = viewingToday();

  const [dy, dm, dd] = S.dayKey.split("-").map(Number);
  $("#h-date").innerHTML = new Date(dy, dm-1, dd)
    .toLocaleDateString(LOCALE[LANG], { weekday:"long", day:"numeric", month:"long" }) + CHEVRON;
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
  $("#h-left-label").textContent = over ? tr("h.over") : tr("h.available");

  const pct = Math.min(100, t.budget > 0 ? (t.eaten / t.budget) * 100 : 0);
  const rail = $("#h-rail");
  rail.style.width = pct + "%";
  rail.classList.toggle("over", over);

  $("#h-eaten").textContent  = tr("h.eaten", num(t.eaten))
    + (t.moved ? tr("h.moved", num(t.moved)) : "");
  $("#h-budget").textContent = tr("h.budget", num(t.budget));

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
    <div class="log-head"><span class="eyebrow">${today ? tr("h.logToday") : tr("h.log")}</span>
      <span class="eyebrow">${entries.length || ""}</span></div>
    ${entries.length ? entries.map(e => {
      const mv = e.kind === "workouts";
      return `<div class="item" data-kind="${e.kind}" data-id="${e.id}">
        <span class="ic ${mv?"mv":""}">${mv?ICON.bolt:ICON.fork}</span>
        <span class="t-txt"><span class="t-ttl">${esc(e.name)}</span>
          <span class="t-sub">${esc(e.detail || "")} · ${e.t}</span></span>
        <span class="kc ${mv?"mv":""}">${mv?"+":""}${num(e.kcal)}</span>
      </div>`;
    }).join("") : `<p class="log-empty">${tr("h.logEmpty")}</p>`}`;

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

  if (!silent) openSheet(t("rc.title"),
    `<div class="analyzing"><span class="spin"></span>${t("rc.loading")}</div>`);

  let days;
  try { days = await listDays(); }
  catch {
    if (!silent) $("#sheet-body").innerHTML = `<p class="log-empty">${t("rc.failed")}</p>`;
    return false;
  }

  const r = summarize(days, keys, targetOf(S.profile));
  if (silent && !r.trackedDays && !r.trainings) return false;   // nichts zu zeigen

  const fmt = k => { const [y,m,d] = k.split("-").map(Number);
    return new Date(y, m-1, d).toLocaleDateString(LOCALE[LANG], { day:"numeric", month:"short" }); };

  const savedLabel = r.saved >= 0 ? t("rc.saved") : t("rc.overBudget");
  const kicker = !r.trackedDays
    ? t("rc.none")
    : r.onTarget === r.trackedDays
      ? t("rc.perfect")
      : t("rc.some", r.onTarget, r.trackedDays);

  if (silent) openSheet(t("rc.title"), "");
  $("#sheet-body").innerHTML = `
    <p class="hint" style="margin:0 0 14px; text-align:center">${t("rc.range", fmt(keys[0]), fmt(keys[6]))}</p>

    <div class="res-total" style="${r.saved < 0 ? "background:linear-gradient(180deg,#F97316,#EF4444);box-shadow:0 12px 26px rgba(200,60,20,.28)" : ""}">
      <span style="font-weight:650">${savedLabel}</span><b>${num(Math.abs(r.saved))}</b></div>

    <div class="macros" style="margin-top:12px">
      <div class="macro pr"><span class="eyebrow">${t("rc.inBudget")}</span>
        <b>${r.onTarget}<span> / ${r.trackedDays}</span></b></div>
      <div class="macro ch"><span class="eyebrow">${t("rc.trainings")}</span>
        <b>${r.trainings}</b></div>
      <div class="macro fa"><span class="eyebrow">${t("rc.movement")}</span>
        <b>${num(r.trainKcal)}<span> kcal</span></b></div>
    </div>

    <p class="hint" style="text-align:center; margin-top:14px">${esc(kicker)}</p>`;
  $("#sheet-foot").innerHTML = `<button class="btn btn-primary" id="rc-ok">${t("rc.ok")}</button>`;
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
/* Die Begrüßung folgt der Sprache, in der der Chat gerade geöffnet wird. */
const greeting = () => t("cc.greeting");
const CHAT_KEEP = 60;   // so viele Nachrichten bleiben gespeichert

const hasCoach = () => ["premium","ultra"].includes(S.profile?.tier);
const chatRef  = () => doc(db, "users", S.uid, "chat", "main");

async function loadChat(){
  try {
    const snap = await getDoc(chatRef());
    S.chat = snap.exists() && Array.isArray(snap.data().messages) ? snap.data().messages : [];
  } catch { S.chat = []; }
  if (!S.chat.length) S.chat = [{ role:"assistant", content: greeting(), t: clock() }];
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
  if (!hasCoach()){ toast(t("cc.locked")); return; }

  openSheet("", `<div class="analyzing"><span class="spin"></span>${t("cc.loading")}</div>`,
    `<div class="chat-in">
       <textarea id="cc-in" rows="1" placeholder="${t("cc.ph")}"></textarea>
       <button class="chat-send" id="cc-send" aria-label="${t("a.send")}" disabled>${SEND_ICON}</button>
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
          tier: S.profile.tier,
          lang: LANG
        })
      });
      const ct = r.headers.get("content-type") || "";
      if (!ct.includes("application/json"))
        throw new Error(t("api.noJson", COACH_ENDPOINT, r.status, "api/coach.js"));
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
      S.chat.push({ role:"assistant", content:data.reply, t: clock() });
      paintChat();
      saveChat();
    } catch (e) {
      paintChat(false, e.message || t("err.unknown"));
    }
  }
}

function paintChat(typing = false, error = null){
  const body = $("#sheet-body");
  if (!body) return;
  body.innerHTML = `
  <p class="chat-note">${t("cc.note")}</p>
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
  const t = totals();          // Texte laufen hier über tr
  openSheet(tr("sg.title"), `<div class="analyzing"><span class="spin"></span>
    ${tr("sg.loading")}</div>`);

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
    lang: LANG,
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
      throw new Error(tr("api.noJson", SUGGEST_ENDPOINT, r.status, "api/suggest.js"));
    data = await r.json();
    if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
  } catch (e) {
    $("#sheet-body").innerHTML = `<div class="analyzing" style="color:#B42318; align-items:flex-start; line-height:1.45">
      <span style="flex:1">${tr("sg.failed")}<br>
      <span style="font-weight:550; font-size:13.5px; color:var(--ink-2)">${esc(e.message || tr("err.unknown"))}</span></span></div>`;
    return;
  }

  const opts = Array.isArray(data.options) ? data.options : [];
  $("#sheet-body").innerHTML = `
    <div class="res-total" style="margin-bottom:14px">
      <span style="font-weight:650">${tr("sg.left")}</span><b>${num(Math.max(0, t.left))}</b></div>
    ${opts.length ? opts.map((o, i) => `
      <div class="sug-item">
        <div class="top"><b>${esc(o.name || tr("sg.item"))}</b><span>${num(o.kcal || 0)} kcal</span></div>
        ${o.amount ? `<p class="amt">${esc(o.amount)}</p>` : ""}
        ${o.why ? `<p class="why">${esc(o.why)}</p>` : ""}
        <p class="mac">${tr("sg.macros", num(o.pr||0), num(o.ch||0), num(o.fa||0))}</p>
        <button class="btn btn-glass btn-sm" data-i="${i}">${tr("btn.add")}</button>
      </div>`).join("") : ""}
    ${data.note ? `<p class="hint" style="text-align:center; margin-top:14px">${esc(data.note)}</p>` : ""}`;

  $$("#sheet-body .sug-item .btn").forEach(b => b.onclick = async () => {
    const o = opts[+b.dataset.i];
    await addEntry("meals", {
      name: o.name || tr("sg.item"),
      detail: o.amount || tr("sg.item"),
      kcal: Math.round(o.kcal || 0),
      pr: +(o.pr || 0), ch: +(o.ch || 0), fa: +(o.fa || 0),
      src: "suggest"
    });
    closeSheet();
    toast(tr("sg.logged", num(Math.round(o.kcal || 0))));
  });
}

/* ─────────────────  9b. TAGESWECHSEL  ───────────────── */

$("#h-date").onclick = () => openDays();

async function openDays(){
  openSheet(t("cal.title"), `<div class="analyzing"><span class="spin"></span>${t("cal.loading")}</div>`);

  let days;
  try { days = await listDays(); }
  catch { $("#sheet-body").innerHTML = `<p class="log-empty">${t("cal.failed")}</p>`; return; }

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
        <button id="cal-prev" aria-label="${t("cal.prev")}">${ARROW(-1)}</button>
        <b>${cursor.toLocaleDateString(LOCALE[LANG], { month:"long", year:"numeric" })}</b>
        <button id="cal-next" aria-label="${t("cal.next")}" ${isCurrentMonth ? "disabled" : ""}>${ARROW(1)}</button>
      </div>
      <div class="cal-wd">${t("cal.wd").map(w => `<span>${w}</span>`).join("")}</div>
      <div class="cal-grid">${cells}</div>
      <p class="hint" style="text-align:center">${t("cal.hint")}</p>`;

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
  const gName = (GOALS.find(g => g.id === S.profile.goal) || {}).n || tr("bd.goal");
  const lName = (LIFESTYLE.find(l => l.id === S.profile.lifestyle) || {}).n || tr("bd.life");

  const row = (label, value, cls = "") =>
    `<div class="${cls}"><span>${esc(label)}</span><b>${value}</b></div>`;

  openSheet(tr("bd.title"), `
    <div class="glass calc">
      ${row(tr("bd.bmr"), num(bmr))}
      ${row(tr("bd.life") + " · " + lName, sign(life))}
      ${row(tr("bd.tdee"), num(t.tdee), "sum")}
      ${row(tr("bd.goal") + " · " + gName, sign(goal))}
      ${row(tr("bd.target"), num(t.target), "sum")}
      ${row(tr("bd.train"), sign(t.moved))}
      ${row(tr("bd.eaten"), sign(-t.eaten))}
      ${row(t.left < 0 ? tr("bd.over") : tr("bd.left"),
            (t.left < 0 ? "−" : "") + num(Math.abs(t.left)), "total" + (t.left < 0 ? " over" : ""))}
    </div>
    <p class="hint" style="text-align:center">${tr("bd.hint")}</p>
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
    `<button class="btn btn-primary" id="en-edit">${t("en.edit")}</button>
     <button class="btn btn-ghost" id="en-del" style="color:var(--bad)">${t("en.del")}</button>`);

  $("#en-edit").onclick = () => openEntryEdit(kind, id);
  $("#en-del").onclick  = async () => {
    await delEntry(kind, id);
    closeSheet();
    toast(t("en.deleted"));
  };
}

function openEntryEdit(kind, id){
  const e = (S.day[kind] || []).find(x => x.id === id);
  if (!e) return;
  const mv = kind === "workouts";

  openSheet(t("ee.title"), `
    <div class="field"><label for="ee-n">${t("f.name")}</label>
      <input id="ee-n" type="text" value="${esc(e.name)}"></div>
    <div class="row">
      <div class="field"><label for="ee-k">${mv ? t("f.kcalBurned") : t("f.kcal")}</label>
        <input id="ee-k" type="number" inputmode="numeric" value="${Math.round(e.kcal)}"></div>
      <div class="field"><label for="ee-t">${t("ee.time")}</label>
        <input id="ee-t" type="text" inputmode="numeric" value="${esc(e.t || "")}" placeholder="12:30"></div>
    </div>
    <div class="field"><label for="ee-d">${t("ee.detail")}</label>
      <input id="ee-d" type="text" value="${esc(e.detail || "")}" placeholder="${t("ee.detailPh")}"></div>
    ${mv ? "" : `
      <p class="group-label">${t("f.macrosG")}</p>
      <div class="row">${MACROS.map(x => `
        <div class="field"><label for="ee-${x.key}">${x.n}</label>
          <input id="ee-${x.key}" type="number" inputmode="decimal" value="${e[x.key] ?? 0}"></div>`).join("")}
      </div>`}
  `, `<button class="btn btn-primary" id="ee-save">${t("btn.save")}</button>
      <button class="btn btn-ghost" id="ee-back">${t("btn.back")}</button>`);

  $("#ee-save").onclick = async () => {
    const kcal = +$("#ee-k").value;
    if (!(kcal >= 0)) { toast(t("ee.errKcal")); return; }
    e.name   = $("#ee-n").value.trim() || e.name;
    e.detail = $("#ee-d").value.trim();
    e.kcal   = Math.round(kcal);
    const time = $("#ee-t").value.trim();
    if (/^\d{1,2}:\d{2}$/.test(time)) e.t = time.padStart(5, "0");
    if (!mv) MACROS.forEach(x => e[x.key] = Math.max(0, +$("#ee-" + x.key).value || 0));
    renderHome();
    try { await saveDay(); } catch { toast(t("ee.saveFailed")); return; }
    closeSheet();
    toast(t("ee.saved"));
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
  openSheet(t("ph.title"), `
    <button type="button" class="shot ${photoData?"has":""}" id="ph-slot">
      ${photoData
        ? `<img class="preview" src="${photoData.url}" alt="${t("ph.alt")}">
           <span class="swap">${ICON.swap} ${t("ph.swap")}</span>`
        : `<span class="drop">${ICON.cam}
             <b>${t("ph.drop")}</b>
             <small>${t("ph.dropSub")}</small>
           </span>`}
    </button>

    <div class="field" style="margin-top:16px">
      <label for="ph-note">${photoData ? t("ph.extra") : t("ph.desc")}</label>
      <textarea id="ph-note" rows="3" placeholder="${photoData
        ? t("ph.extraPh")
        : t("ph.descPh")}">${esc(photoNote)}</textarea>
    </div>
    <div id="ph-out"></div>
  `, `<button class="btn btn-primary" id="ph-go">${t("ph.go")}</button>`);

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
  } catch { toast(t("ph.readFailed")); }
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
    photoData ? t("ph.busyImg") : t("ph.busyTxt")}</div>`;

  try {
    const r = await fetch(ANALYZE_ENDPOINT, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        ...(photoData ? { image: photoData.base64, mime: photoData.mime } : {}),
        note, tier: S.profile?.tier || "basis", lang: LANG
      })
    });

    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("application/json")){
      // Kommt HTML zurück, existiert /api/analyze auf dem Server nicht.
      throw new Error(t("api.noJson", ANALYZE_ENDPOINT, r.status, "api/analyze.js"));
    }

    const data = await r.json();
    if (!r.ok) throw new Error(data.message || data.error || `HTTP ${r.status}`);
    showResult(data);
  } catch (e) {
    $("#ph-out").innerHTML = `<div class="analyzing" style="color:#B42318; align-items:flex-start; line-height:1.45">
      <span style="flex:1">${t("ph.failed")}<br>
      <span style="font-weight:550; font-size:13.5px; color:var(--ink-2)">${esc(e.message || t("err.unknown"))}</span></span></div>`;
    $("#ph-go").disabled = false;
  }
}

function showResult(d){
  const items = Array.isArray(d.items) ? d.items : [];
  const total = Math.round(d.total_kcal || items.reduce((a,i) => a + (i.kcal||0), 0));
  const conf  = ["hoch","mittel","niedrig"].includes(d.confidence) ? t("conf." + d.confidence) : "";

  // Foto schrumpft auf Thumbnail-Größe, damit die Zahlen im Vordergrund stehen
  $("#sheet-title").textContent = t("ph.result");
  $("#sheet-body").innerHTML = `
    <div class="res-top">
      ${photoData
        ? `<img class="res-thumb" src="${photoData.url}" alt="">`
        : `<span class="res-thumb alt">${ICON.fork}</span>`}
      <span class="tx"><b>${esc(d.title || t("ph.meal"))}</b>
        <span>${esc([conf, d.note].filter(Boolean).join(" · "))}</span></span>
    </div>

    <div class="res-edit">
      <label for="ph-fix">${t("ph.total")}</label>
      <input id="ph-fix" type="number" inputmode="numeric" value="${total}" aria-label="${t("ph.fixAria")}">
      <span class="u">kcal</span>
    </div>

    <div class="macros" style="margin-top:12px">${MACROS.map(x => `
      <div class="macro ${x.key}"><span class="eyebrow">${x.n}</span>
        <b>${num(d[x.key] || 0)}<span> g</span></b></div>`).join("")}</div>

    ${items.length ? `<div class="glass res-items" style="margin-top:12px">${items.map(i =>
      `<div class="res-item"><span style="color:var(--ink)">${esc(i.name)} <span>${esc(i.amount||"")}</span></span>
       <b>${num(i.kcal||0)}</b></div>`).join("")}</div>` : ""}

    <p class="hint" style="text-align:center; margin-top:12px">${t("ph.fixHint")}</p>`;

  $("#sheet-foot").innerHTML = `
    <button class="btn btn-primary" id="ph-save">${t("btn.add")}</button>
    <button class="btn btn-ghost" id="ph-retry">${t("ph.retry")}</button>`;

  $("#sheet-body").scrollTop = 0;

  $("#ph-save").onclick = async () => {
    const kcal = Math.max(0, +$("#ph-fix").value || 0);
    // Korrigiert der Nutzer die Kalorien, skalieren die Makros proportional mit
    const scale = total ? kcal / total : 1;
    const macro = {};
    MACROS.forEach(x => macro[x.key] = +(((d[x.key] || 0) * scale).toFixed(1)));
    await addEntry("meals", {
      name: d.title || t("ph.meal"),
      detail: items.map(i => i.name).slice(0,3).join(", ") || (photoData ? t("ph.viaPhoto") : t("ph.viaText")),
      kcal, ...macro, src:"photo"
    });
    closeSheet();
    toast(t("sg.logged", num(kcal)));
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
         <span class="t-sub">${f.k} ${t("unit.kcalPer100")}</span></span>
       <span class="t-val">${Math.round(f.k*f.p/100)} kcal<br><span style="font-weight:600;color:var(--ink-3);font-size:12px">${f.p} g</span></span>
     </button>`).join("");

  openSheet(t("mn.title"), `
    <div class="seg"><button class="on" data-tab="fav">${t("tab.fav")}</button>
      <button data-tab="all">${t("tab.all")}</button><button data-tab="free">${t("tab.free")}</button></div>

    <div data-pane="fav"><div class="quick">${favs.length?list(favs):`<p class="log-empty">${t("tab.noFav")}</p>`}</div></div>

    <div data-pane="all" hidden>
      <div class="field search"><input id="mn-search" type="text" placeholder="${t("mn.search")}"></div>
      <div class="quick" id="mn-list">${list(rest)}</div>
    </div>

    <div data-pane="free" hidden>
      <div class="field"><label for="mn-name">${t("f.name")}</label>
        <input id="mn-name" type="text" placeholder="${t("mn.namePh")}"></div>
      <div class="field"><label for="mn-kcal">${t("f.kcal")}</label>
        <input id="mn-kcal" type="number" inputmode="numeric" placeholder="${t("mn.kcalPh")}"></div>
      <p class="group-label">${t("mn.macrosOpt")}</p>
      <div class="row">
        <div class="field"><label for="mn-pr">${t("macro.prShort")}</label>
          <input id="mn-pr" type="number" inputmode="decimal" placeholder="0"></div>
        <div class="field"><label for="mn-ch">${t("macro.chShort")}</label>
          <input id="mn-ch" type="number" inputmode="decimal" placeholder="0"></div>
        <div class="field"><label for="mn-fa">${t("macro.faShort")}</label>
          <input id="mn-fa" type="number" inputmode="decimal" placeholder="0"></div>
      </div>
      <button class="btn btn-primary" id="mn-free">${t("btn.add")}</button>
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
    const name = $("#mn-name").value.trim() || t("ph.meal");
    const kcal = +$("#mn-kcal").value;
    if (!(kcal > 0)) { toast(t("mn.errKcal")); return; }
    const macro = {};
    MACROS.forEach(x => macro[x.key] = Math.max(0, +$("#mn-" + x.key).value || 0));
    await addEntry("meals", { name, detail:t("mn.manualTag"), kcal:Math.round(kcal), ...macro, src:"manual" });
    closeSheet(); toast(t("sg.logged", num(kcal)));
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
    <div class="field"><label for="pt-g">${t("pt.grams")}</label>
      <input id="pt-g" type="number" inputmode="numeric" value="${f.p}"></div>
    <div class="res-total" style="margin-top:4px">
      <span style="font-weight:650">${f.k} ${t("unit.kcalPer100")}</span><b id="pt-k">${Math.round(f.k*f.p/100)}</b></div>
    <p class="hint" style="text-align:center" id="pt-m"></p>
  `, `<button class="btn btn-primary" id="pt-save">${t("btn.add")}</button>
      <button class="btn btn-ghost" id="pt-back">${t("btn.back")}</button>`);

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
    if (!kcal) { toast(t("pt.errGrams")); return; }
    const macro = {};
    MACROS.forEach(x => macro[x.key] = +(f[x.key] * g / 100).toFixed(1));
    await addEntry("meals", { name:f.n, detail:`${g} g`, kcal, ...macro, src:"db" });
    closeSheet(); toast(t("sg.logged", num(kcal)));
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
         <span class="t-sub">${kcalHour(a,kg)} ${t("unit.kcalPerHour")}</span></span>
       <span class="t-val">${Math.round(kcalHour(a,kg)/2)} kcal<br><span style="font-weight:600;color:var(--ink-3);font-size:12px">30 min</span></span>
     </button>`).join("");

  openSheet(t("tr.title"), `
    <div class="seg"><button class="on" data-tab="fav">${t("tab.fav")}</button>
      <button data-tab="all">${t("tab.all")}</button><button data-tab="free">${t("tab.free")}</button></div>

    <div data-pane="fav"><div class="quick">${favs.length?list(favs):`<p class="log-empty">${t("tab.noFav")}</p>`}</div></div>
    <div data-pane="all" hidden><div class="quick">${list(rest)}</div></div>

    <div data-pane="free" hidden>
      <div class="field"><label for="tr-name">${t("f.name")}</label>
        <input id="tr-name" type="text" placeholder="${t("tr.namePh")}"></div>
      <div class="field"><label for="tr-kcal">${t("f.kcalBurned")}</label>
        <input id="tr-kcal" type="number" inputmode="numeric" placeholder="${t("tr.kcalPh")}"></div>
      <button class="btn btn-primary" id="tr-free">${t("btn.add")}</button>
    </div>
  `);

  $$("#sheet-body .seg button").forEach(b => b.onclick = () => {
    $$("#sheet-body .seg button").forEach(x => x.classList.toggle("on", x === b));
    $$("#sheet-body [data-pane]").forEach(p => p.hidden = p.dataset.pane !== b.dataset.tab);
  });

  $("#tr-free").onclick = async () => {
    const name = $("#tr-name").value.trim() || t("tr.fallbackName");
    const kcal = +$("#tr-kcal").value;
    if (!(kcal > 0)) { toast(t("mn.errKcal")); return; }
    await addEntry("workouts", { name, detail:t("mn.manualTag"), kcal:Math.round(kcal) });
    closeSheet(); toast(t("tr.credited", num(kcal)));
  };

  $$("#sheet-body .qitem").forEach(b => b.onclick = () =>
    openDuration(allActs(S.profile).find(a => a.id === b.dataset.id)));
}

function openDuration(a){
  const kg = S.profile.weight, perH = kcalHour(a, kg);
  openSheet(a.n, `
    <div class="field"><label for="tr-min">${t("tr.minutes")}</label>
      <input id="tr-min" type="number" inputmode="numeric" value="45"></div>
    <div class="chips" style="margin-bottom:16px">
      ${[15,30,45,60,90].map(m => `<button class="chip" data-m="${m}">${t("tr.min", m)}</button>`).join("")}
    </div>
    <div class="res-total"><span style="font-weight:650">${perH} ${t("unit.kcalPerHour")}</span>
      <b id="tr-k">${Math.round(perH*0.75)}</b></div>
  `, `<button class="btn btn-primary" id="tr-save">${t("btn.add")}</button>
      <button class="btn btn-ghost" id="tr-back">${t("btn.back")}</button>`);

  const calc = () => Math.round(perH * (+$("#tr-min").value || 0) / 60);
  const sync = () => $("#tr-k").textContent = num(calc());
  $("#tr-min").oninput = sync;
  $$("#sheet-body .chip").forEach(c => c.onclick = () => { $("#tr-min").value = c.dataset.m; sync(); });

  $("#tr-save").onclick = async () => {
    const kcal = calc();
    if (!kcal) { toast(t("tr.errMin")); return; }
    await addEntry("workouts", { name:a.n, detail:t("tr.min", $("#tr-min").value), kcal });
    closeSheet(); toast(t("tr.credited", num(kcal)));
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
    lang: p.lang || LANG,
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

  openSheet(t("st.title"), `
    <div class="settings-grp">
      <p class="eyebrow">${t("st.lang")}</p>
      <select id="st-lang">
        ${LANGS.map(l => `<option value="${l.id}" ${draft.lang===l.id?"selected":""}>${esc(l.n)}</option>`).join("")}
      </select>
      <p class="hint">${t("st.langHint")}</p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.tier")}</p>
      <div class="tiles tiers" data-set="tier">
        ${TIERS.map(t => tileHTML(t.id, t.n, t.s, "", draft.tier === t.id)).join("")}
      </div>
    </div>

    <div class="settings-grp" id="st-coach-grp" ${hasCoach() ? "" : "hidden"}>
      <p class="eyebrow">${t("st.coach")}</p>
      <button class="pick-open" id="cc-clear">
        <span>${t("cc.clear")}</span><span class="pick-count" id="cc-count"></span></button>
      <p class="hint">${t("cc.clearHint")}</p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.body")}</p>
      <div class="row">
        <div class="field"><label for="st-w">${t("f.weight")}</label>
          <input id="st-w" type="number" inputmode="decimal" step="0.1" value="${draft.weight}"></div>
        <div class="field"><label for="st-h">${t("f.height")}</label>
          <input id="st-h" type="number" inputmode="numeric" value="${draft.height}"></div>
      </div>
      <div class="row">
        <div class="field"><label for="st-a">${t("f.age")}</label>
          <input id="st-a" type="number" inputmode="numeric" value="${draft.age}"></div>
        <div class="field"><label for="st-s">${t("f.sex")}</label>
          <select id="st-s"><option value="m" ${draft.sex==="m"?"selected":""}>${t("f.male")}</option>
            <option value="w" ${draft.sex==="w"?"selected":""}>${t("f.female")}</option></select></div>
      </div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.life")}</p>
      <select id="st-life">
        ${LIFESTYLE.map(l => `<option value="${l.id}" ${draft.lifestyle===l.id?"selected":""}>${l.n}</option>`).join("")}
      </select>
      <p class="hint" id="st-life-h"></p>
      <div class="field" id="st-lsk" style="margin-top:12px" ${draft.lifestyle==="manual"?"":"hidden"}>
        <label for="st-lskv">${t("f.lsk")}</label>
        <input id="st-lskv" type="number" inputmode="numeric" value="${draft.lifestyleKcal ?? DEF_LS_KCAL}">
      </div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.goal")}</p>
      <select id="st-goal">
        ${GOALS.map(g => `<option value="${g.id}" ${draft.goal===g.id?"selected":""}>${g.n}</option>`).join("")}
      </select>
      <p class="hint" id="st-goal-h"></p>
      <div class="field" id="st-gk" style="margin-top:12px" ${draft.goal==="manual"?"":"hidden"}>
        <label for="st-gkv">${t("f.gk")}</label>
        <input id="st-gkv" type="number" inputmode="numeric" value="${draft.goalKcal ?? DEF_GOAL_KCAL}">
        <p class="hint">${t("f.gkNote")}</p>
      </div>
      <p class="hint" id="st-preview"></p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.macros")}</p>
      <div class="seg" id="st-mm">
        <button data-mm="auto">${t("st.mmAuto")}</button><button data-mm="custom">${t("st.mmCustom")}</button>
      </div>
      <div id="st-macros"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.diet")}</p>
      <select id="st-diet">
        ${DIETS.map(d => `<option value="${d.id}" ${draft.diet===d.id?"selected":""}>${d.n}</option>`).join("")}
      </select>
      <p class="hint" id="st-diet-h"></p>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.favActs")}</p>
      <div id="pk-acts"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.favFoods")}</p>
      <div id="pk-foods"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.dislikes")}</p>
      <div id="pk-excl"></div>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.ownFoods")}</p>
      <div id="st-own"></div>
      <button class="pick-open" id="own-add" style="margin-top:10px">
        <span>${t("st.ownFoodAdd")}</span><span class="pick-count">+</span></button>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.ownActs")}</p>
      <div id="st-ownact"></div>
      <button class="pick-open" id="act-add" style="margin-top:10px">
        <span>${t("st.ownActAdd")}</span><span class="pick-count">+</span></button>
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.avoid")}</p>
      <div id="st-avoid"></div>
      <div class="row" style="margin-top:10px">
        <div class="field" style="margin:0"><input id="av-in" type="text" placeholder="${t("st.avoidPh")}"></div>
        <button class="btn btn-glass btn-sm" id="av-add" style="flex:0 0 92px">${t("st.avoidAdd")}</button>
      </div>
      <p class="hint">${t("st.avoidHint")}</p>
    </div>


    <div class="settings-grp">
      <p class="eyebrow">${t("st.legal")}</p>
      ${Object.entries(legalDocs()).map(([k, l]) => `
        <button class="pick-open" data-legal="${k}" style="margin-bottom:8px">
          <span>${esc(l.t)}</span><span class="pick-count">${CHEV}</span></button>`).join("")}
    </div>

    <div class="settings-grp">
      <p class="eyebrow">${t("st.account")}</p>
      <button class="pick-open" id="st-del" style="color:var(--bad)">
        <span>${t("st.delAccount")}</span><span class="pick-count" style="color:var(--bad)">${CHEV}</span></button>
    </div>
  `, `<button class="btn btn-primary" id="st-save">${t("btn.save")}</button>
      <button class="btn btn-ghost" id="st-out" style="color:var(--ink-3)">${t("st.signOut")}</button>`);

  /* Sprache greift sofort — das Blatt wird mit dem Zwischenstand neu
     gezeichnet, gespeichert wird sie mit den übrigen Einstellungen. */
  $("#st-lang").onchange = () => {
    draft.lang = $("#st-lang").value;
    setLang(draft.lang);
    if (S.profile) renderHome();
    openSettingsKeep(draft);
  };

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
    $("#st-preview").innerHTML = t("st.preview", num(targetOf(draft)), num(tdeeOf(draft)))
      + (targetFloored(draft) ? t("st.previewFloor", num(kcalFloor(draft))) : "");
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
      ${sel.length ? "" : `<p class="pick-none">${t("pk.none")}</p>`}
      <button class="pick-open ${openState[host] ? "open" : ""}">
        <span>${openState[host] ? t("pk.close") : t("pk.open")}</span>
        <span class="pick-count">${t("pk.count", sel.length, list.length)} ${CHEV}</span></button>
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

  const actLabel = a => `${kcalHour(a, draft.weight)} ${t("unit.kcalH")}`;

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
        <div class="field"><label for="mg-${x.key}">${t("mg.label", x.n)}</label>
          <input id="mg-${x.key}" type="number" inputmode="numeric" value="${m[x.key]}" ${auto ? "disabled" : ""}></div>`).join("")}
      </div>
      <p class="hint">${auto
        ? t("mg.auto", (PROTEIN_PER_KG[draft.goal] ?? 1.8).toFixed(1))
        : t("mg.custom", num(macroKcal(m)), num(targetOf(draft)))}</p>`;
    if (!auto) MACROS.forEach(x => $("#mg-" + x.key).oninput = () => {
      draft.macros = draft.macros || macroTargets(draft);
      draft.macros[x.key] = Math.max(0, +$("#mg-" + x.key).value || 0);
      $("#st-macros .hint").textContent =
        t("mg.custom", num(macroKcal(draft.macros)), num(targetOf(draft)));
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
            <span class="t-sub">${foodLabel(f)} · ${t("sg.macros", f.pr, f.ch, f.fa)}</span></span>
          <button class="del" data-id="${f.id}" aria-label="${t("a.remove")}">${X}</button></div>`).join("")
      : `<p class="pick-none">${t("own.noFoods")}</p>`;
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
            <span class="t-sub">${a.kcalh} ${t("unit.kcalPerHour")}</span></span>
          <button class="del" data-id="${a.id}" aria-label="${t("a.remove")}">${X}</button></div>`).join("")
      : `<p class="pick-none">${t("own.noActs")}</p>`;
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
      : `<p class="pick-none">${t("st.avoidNone")}</p>`;
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
    if (!(draft.weight >= 30 && draft.weight <= 300)) { toast(t("st.errWeight")); return; }
    if (!(draft.height >= 120 && draft.height <= 230)) { toast(t("st.errHeight")); return; }
    if (!(draft.age >= 14 && draft.age <= 100)) { toast(t("st.errAge")); return; }
    if (draft.lifestyle === "manual" && !(draft.lifestyleKcal >= 0 && draft.lifestyleKcal <= 3000)) {
      toast(t("st.errLsk")); return; }
    if (draft.goal === "manual" && !(draft.goalKcal >= -1500 && draft.goalKcal <= 1500)) {
      toast(t("st.errGk")); return; }
    S.profile = { ...S.profile, ...draft };
    try { await saveProfile(); } catch { toast(t("st.saveFailed")); return; }
    if (viewingToday() && (S.day.meals.length || S.day.workouts.length)){
      try { await saveDay(); } catch {}
    }
    renderHome(); closeSheet(); toast(t("st.saved"));
  };
  /* Chatverlauf zurücksetzen. Zweistufig, weil er nicht wiederherstellbar ist. */
  const countMsgs = () => Math.max(0, (S.chat || []).filter(m => m.role === "user").length);
  const countLabel = () => countMsgs() ? t("cc.count", countMsgs()) : t("cc.empty");
  $("#cc-count").textContent = countLabel();
  let armed = false;
  $("#cc-clear").onclick = async () => {
    if (!armed){
      armed = true;
      $("#cc-clear").querySelector("span").textContent = t("cc.confirm");
      $("#cc-count").textContent = t("cc.confirmHint");
      setTimeout(() => {
        if (!armed) return;
        armed = false;
        const b = $("#cc-clear");
        if (!b) return;
        b.querySelector("span").textContent = t("cc.clear");
        $("#cc-count").textContent = countLabel();
      }, 4000);
      return;
    }
    armed = false;
    S.chat = [{ role:"assistant", content: greeting(), t: clock() }];
    await saveChat();
    $("#cc-clear").querySelector("span").textContent = t("cc.clear");
    $("#cc-count").textContent = t("cc.empty");
    toast(t("cc.cleared"));
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
   Inhalte auf dem Stand vom 23. August 2026. Bei Umzug, Wechsel der
   Rechtsform, neuen Dienstleistern oder Ende der Kleinunternehmerregelung
   müssen Impressum und Datenschutz angepasst werden — dann auch
   LEGAL_UPDATED hochsetzen. Nicht anwaltlich geprüft. */

const LEGAL_UPDATED = "23. August 2026";

/* Die Texte selbst stehen in i18n.js — hier nur der Zugriff in der
   aktiven Sprache. */
const legalDocs = () => (LEGAL_TEXT[LANG] || LEGAL_TEXT.de)(LEGAL_UPDATED);

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
  const WORD = t("da.word");

  const form = (reauth) => `
    <p class="legal" style="margin-bottom:14px">${t("da.intro")}</p>

    ${reauth ? `<p class="todo" style="margin-bottom:14px">${t("da.reauth")}</p>
      ${viaGoogle
        ? `<button class="btn btn-glass" id="da-google">${t("da.google")}</button>`
        : `<div class="field"><label for="da-pass">${t("da.pass")}</label>
             <input id="da-pass" type="password" autocomplete="current-password"></div>`}`
    : ""}

    <div class="field" style="margin-top:14px">
      <label for="da-word">${t("da.type", WORD)}</label>
      <input id="da-word" type="text" autocapitalize="characters" autocomplete="off" placeholder="${WORD}">
    </div>
    <p class="err" id="da-err"></p>`;

  const paint = (reauth = false) => {
    openSheet(t("da.title"), form(reauth),
      `<button class="btn btn-primary" id="da-go" style="background:linear-gradient(180deg,#F87171,#DC2626);
         box-shadow:0 12px 26px rgba(200,40,40,.28)" disabled>${t("da.go")}</button>
       <button class="btn btn-ghost" id="da-back">${t("btn.cancel")}</button>`);

    $("#da-word").oninput = () =>
      $("#da-go").disabled = $("#da-word").value.trim().toUpperCase() !== WORD;
    $("#da-back").onclick = () => openSettings();

    if (reauth && viaGoogle) $("#da-google").onclick = async () => {
      try { await reauthenticateWithPopup(auth.currentUser, gprov); $("#da-err").textContent = ""; }
      catch { $("#da-err").textContent = t("da.reauthFailed"); }
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
        toast(t("da.done"));
      } catch (e) {
        if (e?.code === "auth/requires-recent-login"){ paint(true); return; }
        $("#da-err").textContent =
          e?.code === "no-pass" ? t("da.needPass")
          : e?.code === "auth/invalid-credential" || e?.code === "auth/wrong-password"
            ? t("da.wrongPass")
            : t("da.failed");
        $("#da-go").disabled = false;
      }
    };
  };
  paint();
}

function openLegal(key){
  const l = legalDocs()[key];
  openSheet(l.t, `<div class="legal">${l.body}</div>`,
    `<button class="btn btn-glass" id="lg-back">${t("btn.back")}</button>`);
  $("#lg-back").onclick = () => openSettings();
}

/* Formular für ein eigenes Training */
function openOwnAct(done){
  openSheet(t("oa.title"), `
    <div class="field"><label for="oa-n">${t("f.name")}</label>
      <input id="oa-n" type="text" placeholder="${t("oa.namePh")}"></div>
    <div class="field"><label for="oa-k">${t("oa.kcal")}</label>
      <input id="oa-k" type="number" inputmode="numeric" placeholder="${t("oa.kcalPh")}"></div>
    <p class="hint" id="oa-note"></p>
  `, `<button class="btn btn-primary" id="oa-save">${t("btn.create")}</button>
      <button class="btn btn-ghost" id="oa-back">${t("btn.cancel")}</button>`);

  const check = () => {
    const k = +$("#oa-k").value || 0;
    $("#oa-note").textContent = k
      ? t("oa.note", num(Math.round(k/2)))
      : t("oa.noteEmpty");
  };
  $("#oa-k").oninput = check;
  check();

  $("#oa-save").onclick = () => {
    const n = $("#oa-n").value.trim(), k = +$("#oa-k").value;
    if (!n) { toast(t("oa.errName")); return; }
    if (!(k > 0 && k <= 2000)) { toast(t("oa.errKcal")); return; }
    done({ id: "act_" + crypto.randomUUID().slice(0,8), g: "Eigene", n,
           kcalh: Math.round(k), custom: true });
  };
  $("#oa-back").onclick = () => openSettings();
}

/* Formular für ein eigenes Lebensmittel */
function openOwnFood(done){
  openSheet(t("of.title"), `
    <div class="field"><label for="of-n">${t("f.name")}</label>
      <input id="of-n" type="text" placeholder="${t("of.namePh")}"></div>
    <div class="field"><label for="of-k">${t("of.kcal")}</label>
      <input id="of-k" type="number" inputmode="numeric" placeholder="${t("of.kcalPh")}"></div>
    <p class="group-label">${t("of.macros")}</p>
    <div class="row">
      <div class="field"><label for="of-pr">${t("macro.prShort")}</label>
        <input id="of-pr" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label for="of-ch">${t("macro.chShort")}</label>
        <input id="of-ch" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label for="of-fa">${t("macro.faShort")}</label>
        <input id="of-fa" type="number" inputmode="decimal" placeholder="0"></div>
    </div>
    <div class="field"><label for="of-p">${t("of.portion")}</label>
      <input id="of-p" type="number" inputmode="numeric" value="100"></div>
    <p class="hint" id="of-note"></p>
  `, `<button class="btn btn-primary" id="of-save">${t("btn.create")}</button>
      <button class="btn btn-ghost" id="of-back">${t("btn.cancel")}</button>`);

  const check = () => {
    const k = +$("#of-k").value || 0;
    const calc = (+$("#of-pr").value||0)*4 + (+$("#of-ch").value||0)*4 + (+$("#of-fa").value||0)*9;
    $("#of-note").innerHTML = (k && calc)
      ? t("of.note", num(calc)) + (Math.abs(calc-k) > k*0.2 ? t("of.noteOff") : "")
      : t("of.noteEmpty");
  };
  ["#of-k","#of-pr","#of-ch","#of-fa"].forEach(x => $(x).oninput = check);
  check();

  $("#of-save").onclick = () => {
    const n = $("#of-n").value.trim(), k = +$("#of-k").value;
    if (!n) { toast(t("of.errName")); return; }
    if (!(k > 0 && k <= 900)) { toast(t("of.errKcal")); return; }
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
    $("#install-t").textContent = t("in.title");
    $("#install-s").textContent = t("in.sub");
    $("#install-go").hidden = false;
  } else if (iOS){
    $("#install-t").textContent = t("in.iosTitle");
    $("#install-s").textContent = t("in.iosSub");
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
