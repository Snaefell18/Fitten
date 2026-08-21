/* ══════════════════════════════════════════════════════════════════
   /api/analyze.js  —  Vercel Serverless Function
   Muss liegen unter: <projekt-root>/api/analyze.js

   Schätzt Kalorien und Makros aus Foto und/oder Textbeschreibung.
   Nutzt Structured Outputs (output_config.format): Claude wird per
   Grammatik auf das Schema festgelegt, deshalb ist kein Parsen von
   Fließtext mehr nötig.

   Health-Check: /api/analyze im Browser aufrufen.
   ══════════════════════════════════════════════════════════════════ */

/* Modell nach Mitgliedschaft. Serverseitig gemappt, damit über den
   Request kein beliebiges Modell untergeschoben werden kann. */
const MODELS = {
  basis:   "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-5",
  ultra:   "claude-opus-5"
};
const modelFor = tier => MODELS[tier] || MODELS.basis;

const SYSTEM = `Du schätzt Kalorien für eine Fitness-App — aus einem Essensfoto,
aus einer Textbeschreibung oder aus beidem.

Vorgehen bei einem Foto:
1. Benenne jede erkennbare Komponente einzeln. Beilagen, Soßen, Öl und
   Getränke nicht vergessen.
2. Schätze die Menge in Gramm oder Stück anhand von Tellergröße, Besteck
   und Bildwinkel.
3. Rechne die Kalorien je Komponente aus.

Ohne Foto gehst du von haushaltsüblichen Portionen aus, sofern keine Menge
genannt wird, und hältst diese Annahme in "note" fest.

Der Nutzerkommentar korrigiert immer deine Bildschätzung, nicht umgekehrt.
Bei Angaben wie "halbe Portion" skalierst du entsprechend.

Schätze außerdem die Makros der gesamten Mahlzeit in Gramm: pr = Eiweiß,
ch = Kohlenhydrate, fa = Fett. Sie sollten grob zu den Kalorien passen
(Eiweiß und Kohlenhydrate je 4 kcal/g, Fett 9 kcal/g).

Ist kein Essen zu erkennen, setzt du total_kcal und alle Makros auf 0,
confidence auf "niedrig" und erklärst das in "note".

"note" ist immer genau ein kurzer Satz.`;

/* Schema für die Antwort. Alle Felder required — das hält die Grammatik
   klein und sichert die Reihenfolge der Ausgabe. */
const SCHEMA = {
  type: "object",
  properties: {
    title:      { type: "string",  description: "Kurzer Name des Gerichts auf Deutsch." },
    items: {
      type: "array",
      description: "Einzelne Komponenten der Mahlzeit.",
      items: {
        type: "object",
        properties: {
          name:   { type: "string",  description: "Name der Komponente." },
          amount: { type: "string",  description: "Geschätzte Menge, z. B. 180 g oder 2 Stück." },
          kcal:   { type: "integer", description: "Kalorien dieser Komponente." }
        },
        required: ["name", "amount", "kcal"],
        additionalProperties: false
      }
    },
    total_kcal: { type: "integer", description: "Gesamtkalorien der Mahlzeit." },
    pr:         { type: "integer", description: "Eiweiß in Gramm." },
    ch:         { type: "integer", description: "Kohlenhydrate in Gramm." },
    fa:         { type: "integer", description: "Fett in Gramm." },
    confidence: { type: "string",  enum: ["hoch", "mittel", "niedrig"] },
    note:       { type: "string",  description: "Ein kurzer Satz zu den Annahmen." }
  },
  required: ["title", "items", "total_kcal", "pr", "ch", "fa", "confidence", "note"],
  additionalProperties: false
};

/* Sonnet 5 und Opus 5 denken standardmäßig mit, und max_tokens begrenzt
   Denken UND Antwort zusammen. Ohne Abschalten bleibt bei knappem Budget
   kein Platz für den eigentlichen Text. Haiku 4.5 kennt den Schalter nicht,
   deshalb nur für die neueren Modelle setzen. */
function thinkingOff(model){
  return /^claude-(sonnet|opus)-5/.test(model) ? { thinking: { type: "disabled" } } : {};
}

export const config = { maxDuration: 60 };

/* Notnagel: Structured Outputs liefern gültiges JSON — außer die Antwort
   läuft ins Token-Limit. Dann wird hier so viel wie möglich gerettet. */
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
  /* Alles umschlossen: ohne diesen Rahmen zeigt Vercel bei einem
     unerwarteten Fehler nur FUNCTION_INVOCATION_FAILED ohne Hinweis. */
  try {
    const key = process.env.ANTHROPIC_API_KEY;

    if (req.method === "GET"){
      return res.status(200).json({
        function_reachable: true,
        api_key_present: Boolean(key),
        api_key_length: key ? key.length : 0,
        api_key_prefix: key ? key.slice(0, 7) : null,
        models: MODELS,
        node: process.version
      });
    }

    if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

    if (!key) return res.status(500).json({
      error: "missing_key",
      message: "ANTHROPIC_API_KEY ist nicht gesetzt. In Vercel unter Settings → " +
               "Environment Variables anlegen und danach neu deployen."
    });

    /* ── Body lesen ── */
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

    const image = body.image || null;
    const mime  = body.mime || "image/jpeg";
    const note  = String(body.note || "").trim();
    const tier  = String(body.tier || "basis").toLowerCase();

    if (!image && !note){
      return res.status(400).json({ error: "no_input", message: "Weder Bild noch Beschreibung übermittelt." });
    }

    const prompt = image
      ? (note ? `Analysiere diese Mahlzeit. Zusatz-Info vom Nutzer: "${note}"`
              : "Analysiere diese Mahlzeit.")
      : `Der Nutzer beschreibt seine Mahlzeit so: "${note}"\n\nSchätze Kalorien und Makros.`;

    const content = image
      ? [{ type: "image", source: { type: "base64", media_type: mime, data: image } },
         { type: "text", text: prompt }]
      : [{ type: "text", text: prompt }];

    /* ── Anthropic aufrufen ── */
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
          ...thinkingOff(modelFor(tier)),
          max_tokens: 2000,
          system: SYSTEM,
          messages: [{ role: "user", content }],
          // Grammatik-gestützte Ausgabe. Kein Prefill — das ist damit unvereinbar.
          output_config: { format: { type: "json_schema", schema: SCHEMA } }
        })
      });
      rawText = await response.text();
    } catch (e) {
      return res.status(504).json({
        error: "upstream_failed",
        message: e.name === "AbortError" ? "Zeitüberschreitung bei der Analyse." : String(e.message || e)
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
