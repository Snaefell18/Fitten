/* ══════════════════════════════════════════════════════════════════
   /api/suggest.js  —  Vercel Serverless Function
   Schlägt vor, was heute noch auf den Teller passt: anhand des
   Rest-Budgets, der offenen Makros, der Ernährungsform und der
   Lieblingslebensmittel. Abneigungen filtert bereits das Frontend.

   Health-Check: /api/suggest im Browser aufrufen.
   ══════════════════════════════════════════════════════════════════ */

/* Modell nach gewählter Stufe. Bewusst serverseitig gemappt — so kann über
   den Request kein beliebiges Modell untergeschoben werden. */
const MODELS = {
  basis:   "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-5",
  ultra:   "claude-opus-5"
};
const modelFor = tier => MODELS[tier] || MODELS.basis;

const SYSTEM = `Du bist Ernährungsberater in einer Fitness-App und schlägst vor,
was heute noch gegessen werden kann.

Regeln:
1. Halte dich an das Rest-Budget an Kalorien. Leicht darunter zu bleiben ist gut,
   deutlich darüber ist ein Fehler.
2. Priorisiere die offenen Makros. Fehlt vor allem Eiweiß, schlage eiweißreiche
   Optionen vor; sind kaum noch Kalorien übrig, schlage etwas Kleines vor.
3. Bevorzuge die genannten Lieblingslebensmittel und kombiniere sie zu realistischen
   Mahlzeiten. Andere Lebensmittel sind erlaubt, solange sie zur Ernährungsform passen.
4. Die Ernährungsform ist bindend. Bei vegan keinerlei tierische Produkte,
   bei vegetarisch kein Fleisch und kein Fisch, bei pescetarisch kein Fleisch.
   Genannte Unverträglichkeiten sind ebenfalls bindend — schlage nichts vor,
   das die betreffende Zutat enthalten könnte.
5. Wiederhole nicht, was heute schon gegessen wurde.
6. Ist das Budget aufgebraucht oder überschritten, gib eine leere Liste und
   erkläre das freundlich in "note".

Gib 2 bis 3 Vorschläge. Nenne konkrete Mengen in Gramm oder Stück und schätze
Kalorien und Makros realistisch. Bleib sachlich und kurz, ohne Bewertungen des
bisherigen Tages.

Antworte ausschließlich mit reinem JSON, ohne Markdown, ohne Backticks,
ohne Text davor oder danach, in genau diesem Format:

{
  "options": [
    { "name": "Skyr mit Beeren", "amount": "250 g Skyr, 100 g Beeren",
      "kcal": 203, "pr": 28, "ch": 19, "fa": 1,
      "why": "ein kurzer Satz, warum das jetzt passt" }
  ],
  "note": "ein kurzer Satz zur Gesamtlage"
}`;

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;

  if (req.method === "GET") {
    return res.status(200).json({
      function_reachable: true,
      api_key_present: Boolean(key),
      models: MODELS
    });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!key) {
    return res.status(500).json({
      error: "missing_key",
      message: "ANTHROPIC_API_KEY ist nicht gesetzt. In Vercel anlegen und neu deployen."
    });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body) {
    try {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return res.status(400).json({ error: "bad_body", message: "Anfrage konnte nicht gelesen werden." });
    }
  }

  const {
    left = 0, macrosLeft = {}, diet = "Alles",
    favorites = [], eatenToday = [], avoid = [], goal = "", time = "",
    tier = "basis"
  } = body;

  const favList = favorites.length
    ? favorites.map(f => `- ${f.n} (${f.k} kcal/100 g; E ${f.pr} / K ${f.ch} / F ${f.fa})`).join("\n")
    : "keine angegeben";

  const prompt = `Aktuelle Lage:
- Noch verfügbar: ${Math.round(left)} kcal
- Offene Makros: ${Math.round(macrosLeft.pr || 0)} g Eiweiß, ${Math.round(macrosLeft.ch || 0)} g Kohlenhydrate, ${Math.round(macrosLeft.fa || 0)} g Fett
- Ernährungsform: ${diet}
- Ziel: ${goal}
- Uhrzeit: ${time || "unbekannt"}
- Heute schon gegessen: ${eatenToday.length ? eatenToday.join(", ") : "noch nichts"}
- Unverträglichkeiten, strikt meiden: ${avoid.length ? avoid.join(", ") : "keine"}

Lieblingslebensmittel:
${favList}

Was passt jetzt noch?`;

  let raw;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: modelFor(tier),
        max_tokens: 900,
        system: SYSTEM,
        messages: [{ role: "user", content: prompt }]
      })
    });
    clearTimeout(timer);

    const text = await r.text();
    if (!r.ok) {
      let detail = text.slice(0, 400);
      try { detail = JSON.parse(text)?.error?.message || detail; } catch {}
      return res.status(502).json({ error: "anthropic_error", status: r.status, message: detail });
    }
    raw = JSON.parse(text);
  } catch (e) {
    return res.status(504).json({
      error: "upstream_failed",
      message: e.name === "AbortError" ? "Zeitüberschreitung." : String(e.message || e)
    });
  }

  try {
    const text = (raw.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    const clean = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
    return res.status(200).json(parsed);
  } catch {
    return res.status(500).json({
      error: "bad_model_output",
      message: "Claude hat kein verwertbares JSON geliefert."
    });
  }
}
