/* ══════════════════════════════════════════════════════════════════
   /api/analyze.js
   Vercel Serverless Function
   ══════════════════════════════════════════════════════════════════ */

const MODELS = {
  basis:   "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-5",
  ultra:   "claude-opus-5"
};

function modelFor(tier) {
  return MODELS[tier] || MODELS.basis;
}


/* ══════════════════════════════════════════════════════════════════
   SYSTEM PROMPT
   ══════════════════════════════════════════════════════════════════ */

const SYSTEM = `
Du schätzt Kalorien für eine Fitness-App — entweder aus einem
Essensfoto, aus einer Textbeschreibung oder aus beidem.

Bekommst du nur Text, gehst du von haushaltsüblichen Portionen aus,
sofern der Nutzer keine Mengen nennt, und hältst das in "note" fest.

Bei einem Foto:

1. Benenne jede erkennbare Komponente einzeln.
   Beilagen, Soßen, Öl und Getränke nicht vergessen.

2. Schätze die Menge in Gramm oder Stück anhand von Tellergröße,
   Besteck und Bildwinkel.

3. Schätze die Kalorien jeder Komponente.

Der Nutzerkommentar korrigiert immer deine Bildschätzung, nicht umgekehrt.

Bei Mengenangaben wie "halbe Portion" skalierst du entsprechend.

4. Schätze zusätzlich die Makronährstoffe der gesamten Mahlzeit:
   pr = Eiweiß in Gramm
   ch = Kohlenhydrate in Gramm
   fa = Fett in Gramm

Die Makros sollten grob zu den Kalorien passen:
Eiweiß = 4 kcal/g
Kohlenhydrate = 4 kcal/g
Fett = 9 kcal/g

Ist auf dem Bild kein Essen zu sehen:
total_kcal = 0
pr = 0
ch = 0
fa = 0
confidence = "niedrig"

Erkläre das in note.

note muss immer nur aus einem kurzen Satz bestehen.
`;


/* ══════════════════════════════════════════════════════════════════
   JSON SCHEMA
   ══════════════════════════════════════════════════════════════════ */

const OUTPUT_SCHEMA = {
  type: "object",

  properties: {
    title: {
      type: "string",
      description: "Kurzer Name des Gerichts auf Deutsch."
    },

    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name der einzelnen Komponente."
          },
          amount: {
            type: "string",
            description: "Geschätzte Menge, z.B. 180 g oder 2 Stück."
          },
          kcal: {
            type: "integer",
            description: "Geschätzte Kalorien der Komponente."
          }
        },
        required: ["name", "amount", "kcal"],
        additionalProperties: false
      }
    },

    total_kcal: {
      type: "integer",
      description: "Gesamtkalorien der Mahlzeit."
    },

    pr: {
      type: "integer",
      description: "Eiweiß in Gramm."
    },

    ch: {
      type: "integer",
      description: "Kohlenhydrate in Gramm."
    },

    fa: {
      type: "integer",
      description: "Fett in Gramm."
    },

    confidence: {
      type: "string",
      enum: ["hoch", "mittel", "niedrig"]
    },

    note: {
      type: "string",
      description: "Kurzer Satz mit den wichtigsten Annahmen."
    }
  },

  required: [
    "title",
    "items",
    "total_kcal",
    "pr",
    "ch",
    "fa",
    "confidence",
    "note"
  ],

  additionalProperties: false
};


/* ══════════════════════════════════════════════════════════════════
   VERCEL
   ══════════════════════════════════════════════════════════════════ */

export const config = {
  maxDuration: 60
};


/* ══════════════════════════════════════════════════════════════════
   HANDLER
   ══════════════════════════════════════════════════════════════════ */

export default async function handler(req, res) {

  try {

    const key = process.env.ANTHROPIC_API_KEY;


    /* ──────────────────────────────────────────────────────────────
       HEALTH CHECK
       GET /api/analyze
       ────────────────────────────────────────────────────────────── */

    if (req.method === "GET") {

      return res.status(200).json({
        function_reachable: true,
        api_key_present: Boolean(key),
        api_key_length: key ? key.length : 0,
        api_key_prefix: key ? key.slice(0, 7) : null,
        models: MODELS,
        node: process.version
      });

    }


    /* ──────────────────────────────────────────────────────────────
       METHOD
       ────────────────────────────────────────────────────────────── */

    if (req.method !== "POST") {

      return res.status(405).json({
        error: "method_not_allowed"
      });

    }


    /* ──────────────────────────────────────────────────────────────
       API KEY
       ────────────────────────────────────────────────────────────── */

    if (!key) {

      return res.status(500).json({
        error: "missing_key",
        message:
          "ANTHROPIC_API_KEY ist in Vercel nicht gesetzt. " +
          "Unter Settings → Environment Variables anlegen und neu deployen."
      });

    }


    /* ──────────────────────────────────────────────────────────────
       BODY
       ────────────────────────────────────────────────────────────── */

    let body;

    try {

      body =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body;

    } catch (error) {

      return res.status(400).json({
        error: "bad_body",
        message: "Der Request-Body enthält kein gültiges JSON."
      });

    }

    if (!body || typeof body !== "object") {

      return res.status(400).json({
        error: "bad_body",
        message: "Kein gültiger Request-Body erhalten."
      });

    }


    /* ──────────────────────────────────────────────────────────────
       INPUT
       ────────────────────────────────────────────────────────────── */

    const image = body.image || null;
    const mime = body.mime || "image/jpeg";
    const note = String(body.note || "").trim();
    const tier = String(body.tier || "basis").toLowerCase();


    if (!image && !note) {

      return res.status(400).json({
        error: "no_input",
        message: "Weder Bild noch Beschreibung übermittelt."
      });

    }


    /* ──────────────────────────────────────────────────────────────
       PROMPT
       ────────────────────────────────────────────────────────────── */

    let prompt;

    if (image) {

      prompt = note
        ? `Analysiere diese Mahlzeit.

Zusatz-Info vom Nutzer:
"${note}"`

        : "Analysiere diese Mahlzeit.";

    } else {

      prompt =
        `Der Nutzer beschreibt seine Mahlzeit so:

"${note}"

Schätze die Kalorien und Makronährstoffe dieser Mahlzeit.`;

    }


    /* ──────────────────────────────────────────────────────────────
       CONTENT
       ────────────────────────────────────────────────────────────── */

    const content = image

      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mime,
              data: image
            }
          },

          {
            type: "text",
            text: prompt
          }
        ]

      : [
          {
            type: "text",
            text: prompt
          }
        ];


    /* ──────────────────────────────────────────────────────────────
       ANTHROPIC API
       ────────────────────────────────────────────────────────────── */

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 45000);


    let response;

    try {

      response = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",

          signal: controller.signal,

          headers: {
            "content-type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01"
          },

          body: JSON.stringify({

            model: modelFor(tier),

            max_tokens: 1400,

            system: SYSTEM,

            messages: [
              {
                role: "user",
                content
              }
            ],

            /*
             * WICHTIG:
             * Kein Assistant-Prefill mehr.
             *
             * Anthropic Structured Outputs sorgen dafür,
             * dass Claude valides JSON nach diesem Schema liefert.
             */

            output_config: {
              format: {
                type: "json_schema",
                schema: OUTPUT_SCHEMA
              }
            }

          })
        }
      );

    } catch (error) {

      clearTimeout(timeout);

      console.error("Anthropic fetch failed:", error);

      return res.status(504).json({
        error: "upstream_failed",
        message:
          error.name === "AbortError"
            ? "Zeitüberschreitung bei der Analyse."
            : String(error.message || error)
      });

    }

    clearTimeout(timeout);


    /* ──────────────────────────────────────────────────────────────
       ANTHROPIC RESPONSE
       ────────────────────────────────────────────────────────────── */

    const responseText = await response.text();


    if (!response.ok) {

      let detail = responseText.slice(0, 1000);

      try {

        const parsed = JSON.parse(responseText);

        detail =
          parsed?.error?.message ||
          parsed?.message ||
          detail;

      } catch {
        // Originaltext behalten
      }


      console.error(
        "Anthropic API error:",
        response.status,
        detail
      );


      return res.status(502).json({
        error: "anthropic_error",
        status: response.status,
        model: modelFor(tier),
        message: detail
      });

    }


    /* ──────────────────────────────────────────────────────────────
       RESPONSE PARSEN
       ────────────────────────────────────────────────────────────── */

    let raw;

    try {

      raw = JSON.parse(responseText);

    } catch (error) {

      console.error(
        "Anthropic returned invalid JSON:",
        responseText.slice(0, 500)
      );

      return res.status(502).json({
        error: "invalid_anthropic_response",
        message: "Anthropic hat keine gültige API-Antwort geliefert."
      });

    }


    const textBlock =
      raw?.content?.find(
        block => block.type === "text"
      );


    const outputText =
      textBlock?.text?.trim() || "";


    if (!outputText) {

      return res.status(502).json({
        error: "empty_model_output",
        model: modelFor(tier),
        stop_reason: raw.stop_reason || null,
        message: "Claude hat keine Textantwort zurückgegeben."
      });

    }


    /* ──────────────────────────────────────────────────────────────
       JSON PARSEN
       ────────────────────────────────────────────────────────────── */

    let result;

    try {

      result = JSON.parse(outputText);

    } catch (error) {

      console.error(
        "Claude returned invalid structured output:",
        outputText.slice(0, 1000)
      );

      return res.status(502).json({
        error: "bad_model_output",
        model: modelFor(tier),
        message: "Claude hat kein gültiges JSON zurückgegeben.",
        raw_preview: outputText.slice(0, 500)
      });

    }


    /* ──────────────────────────────────────────────────────────────
       SUCCESS
       ────────────────────────────────────────────────────────────── */

    return res.status(200).json(result);


  } catch (error) {

    /*
     * Letzte Sicherheitsstufe:
     * Dadurch sollte Vercel nicht mehr einfach
     * FUNCTION_INVOCATION_FAILED anzeigen.
     */

    console.error(
      "UNHANDLED FUNCTION ERROR:",
      error
    );

    return res.status(500).json({
      error: "internal_function_error",
      message: String(error?.message || error)
    });

  }

}
