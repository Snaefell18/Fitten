/* ══════════════════════════════════════════════════════════════════
   /api/suggest.js  —  Vercel Serverless Function
   Muss liegen unter: <projekt-root>/api/suggest.js

   Schlägt vor, was heute noch auf den Teller passt: anhand von
   Rest-Budget, offenen Makros, Ernährungsform, Unverträglichkeiten
   und Lieblingslebensmitteln. Abneigungen filtert das Frontend
   bereits heraus.

   Health-Check: /api/suggest im Browser aufrufen.
   ══════════════════════════════════════════════════════════════════ */

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
4. Ernährungsform und Unverträglichkeiten sind bindend. Bei vegan keinerlei tierische
   Produkte, bei vegetarisch kein Fleisch und kein Fisch, bei pescetarisch kein Fleisch.
   Schlage nichts vor, das eine genannte Unverträglichkeit enthalten könnte.
5. Wiederhole nicht, was heute schon gegessen wurde.
6. Ist das Budget aufgebraucht oder überschritten, gib eine leere Liste und
   erkläre das freundlich in "note".

Gib 2 bis 3 Vorschläge mit konkreten Mengen in Gramm oder Stück. Schätze Kalorien
und Makros realistisch. "why" und "note" sind je genau ein kurzer Satz — bleib
sachlich und bewerte den bisherigen Tag nicht.`;

const SCHEMA = {
  type: "object",
  properties: {
    options: {
      type: "array",
      description: "Zwei bis drei Vorschläge, bei aufgebrauchtem Budget leer.",
      items: {
        type: "object",
        properties: {
          name:   { type: "string",  description: "Name der Mahlzeit auf Deutsch." },
          amount: { type: "string",  description: "Konkrete Mengen, z. B. 250 g Skyr, 100 g Beeren." },
          kcal:   { type: "integer", description: "Kalorien des Vorschlags." },
          pr:     { type: "integer", description: "Eiweiß in Gramm." },
          ch:     { type: "integer", description: "Kohlenhydrate in Gramm." },
          fa:     { type: "integer", description: "Fett in Gramm." },
          why:    { type: "string",  description: "Ein kurzer Satz, warum das jetzt passt." }
        },
        required: ["name", "amount", "kcal", "pr", "ch", "fa", "why"],
        additionalProperties: false
      }
    },
    note: { type: "string", description: "Ein kurzer Satz zur Gesamtlage." }
  },
  required: ["options", "note"],
  additionalProperties: false
};

export const config = { maxDuration: 60 };

function salvage(text){
  const t = String(text || "").trim();
  const start = t.indexOf("{");
  if (start < 0) return null;
  const body = t.slice(start).replace(/,\s*$/, "");
  for (const suffix of ["", '"}]}', '"}}', "}]}", "]}", "}}", "}"]){
    try { return JSON.parse(body + suffix); } catch {}
  }
  const cut = body.lastIndexOf("}");
  if (cut > 0) for (const suffix of ["]}", "}"]){
    try { return JSON.parse(body.slice(0, cut + 1) + suffix); } catch {}
  }
  return null;
}

export default async function handler(req, res){
  try {
    const key = process.env.ANTHROPIC_API_KEY;

    if (req.method === "GET"){
      return res.status(200).json({
        function_reachable: true,
        api_key_present: Boolean(key),
        api_key_length: key ? key.length : 0,
        models: MODELS,
        node: process.version
      });
    }

    if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

    if (!key) return res.status(500).json({
      error: "missing_key",
      message: "ANTHROPIC_API_KEY ist nicht gesetzt. In Vercel anlegen und neu deployen."
    });

    let body = req.body;
    if (typeof body === "string"){
      try { body = JSON.parse(body); } catch { body = null; }
    }
    if (!body || typeof body !== "object"){
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
      favorites = [], eatenToday = [], avoid = [],
      goal = "", time = "", tier = "basis"
    } = body;

    const favList = favorites.length
      ? favorites.map(f => `- ${f.n} (${f.k} kcal/100 g; E ${f.pr} / K ${f.ch} / F ${f.fa})`).join("\n")
      : "keine angegeben";

    const prompt = `Aktuelle Lage:
- Noch verfügbar: ${Math.round(left)} kcal
- Offene Makros: ${Math.round(macrosLeft.pr || 0)} g Eiweiß, ${Math.round(macrosLeft.ch || 0)} g Kohlenhydrate, ${Math.round(macrosLeft.fa || 0)} g Fett
- Ernährungsform: ${diet}
- Unverträglichkeiten, strikt meiden: ${avoid.length ? avoid.join(", ") : "keine"}
- Ziel: ${goal}
- Uhrzeit: ${time || "unbekannt"}
- Heute schon gegessen: ${eatenToday.length ? eatenToday.join(", ") : "noch nichts"}

Lieblingslebensmittel:
${favList}

Was passt jetzt noch?`;

    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    let response, rawText;

    try {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: modelFor(tier),
          max_tokens: 2000,
          system: SYSTEM,
          messages: [{ role: "user", content: prompt }],
          output_config: { format: { type: "json_schema", schema: SCHEMA } }
        })
      });
      rawText = await response.text();
    } catch (e) {
      return res.status(504).json({
        error: "upstream_failed",
        message: e.name === "AbortError" ? "Zeitüberschreitung." : String(e.message || e)
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok){
      let detail = rawText.slice(0, 500);
      try { detail = JSON.parse(rawText)?.error?.message || detail; } catch {}
      console.error("Anthropic API error", response.status, detail);
      return res.status(502).json({
        error: "anthropic_error", status: response.status,
        model: modelFor(tier), message: detail
      });
    }

    let raw;
    try { raw = JSON.parse(rawText); }
    catch {
      return res.status(502).json({ error: "invalid_anthropic_response",
        message: "Antwort der Anthropic-API war kein gültiges JSON." });
    }

    const text = (raw.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();

    let result = null;
    try { result = JSON.parse(text); } catch { result = salvage(text); }

    if (!result){
      return res.status(502).json({
        error: "bad_model_output",
        model: modelFor(tier),
        stop_reason: raw.stop_reason || null,
        message: raw.stop_reason === "max_tokens"
          ? "Die Antwort war zu lang und wurde abgeschnitten."
          : raw.stop_reason === "refusal"
            ? "Claude hat die Anfrage abgelehnt."
            : "Claude hat kein verwertbares JSON geliefert.",
        raw_preview: text.slice(0, 300)
      });
    }

    return res.status(200).json(result);

  } catch (e) {
    console.error("UNHANDLED FUNCTION ERROR", e);
    return res.status(500).json({
      error: "internal_function_error",
      message: String(e?.message || e),
      stack: String(e?.stack || "").split("\n").slice(0, 4).join(" | ")
    });
  }
}
