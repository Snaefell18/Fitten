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

const SYSTEM_DE = `Du schätzt Kalorien für eine Fitness-App — aus einem Essensfoto,
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

"note" ist immer genau ein kurzer Satz. Schreibe auf Deutsch.`;

const SYSTEM_EN = `You estimate calories for a fitness app — from a photo of a meal,
from a text description, or from both.

With a photo:
1. Name every component you can make out, one by one. Do not forget sides, sauces,
   oil and drinks.
2. Estimate the amount in grams or pieces from plate size, cutlery and camera angle.
3. Work out the calories for each component.

Without a photo you assume household portions unless an amount is given, and you
record that assumption in "note".

The user's comment always corrects your estimate from the image, never the other way
round. For statements like "half a portion" you scale accordingly.

Also estimate the macros of the whole meal in grams: pr = protein, ch = carbs,
fa = fat. They should roughly match the calories (protein and carbs 4 kcal/g each,
fat 9 kcal/g).

If no food can be made out, set total_kcal and all macros to 0, confidence to
"niedrig" and explain that in "note".

"note" is always exactly one short sentence. Write in English.`;

const SYSTEM_ZH = `你为一款健身应用估算热量 —— 依据食物照片、文字描述，或两者都有。

看照片时的步骤：
1. 逐一说出能辨认出的每个组成部分。配菜、酱汁、油和饮品都不要漏。
2. 结合盘子大小、餐具和拍摄角度，估算克数或个数。
3. 分别算出每个部分的热量。

没有照片时，如果没写份量，就按家常份量估算，并把这个假设写进 "note"。

用户的说明始终用来修正你从图片得到的估算，而不是反过来。遇到「只吃了一半」这类说法，
就按比例缩放。

另外估算整餐的营养素克数：pr = 蛋白质，ch = 碳水，fa = 脂肪。它们应大致与热量吻合
（蛋白质和碳水各 4 千卡/克，脂肪 9 千卡/克）。

如果照片里看不出任何食物，就把 total_kcal 和所有营养素设为 0，confidence 设为
"niedrig"，并在 "note" 中说明。

"note" 始终只有一个简短的句子。请用中文书写。`;

const SYSTEM = lang => (lang === "en" ? SYSTEM_EN : lang === "zh" ? SYSTEM_ZH : SYSTEM_DE);

/* Sprache des Nutzers — steuert Prompt, Schema und Fehlermeldungen.
   Die Werte von "confidence" bleiben deutsch, sie sind reine Schlüssel. */
const langOf = l => {
  const v = String(l || "de").toLowerCase();
  return v.startsWith("en") ? "en" : v.startsWith("zh") ? "zh" : "de";
};

const MSG = {
  de: {
    missing_key: "ANTHROPIC_API_KEY ist nicht gesetzt. In Vercel unter Settings → " +
                 "Environment Variables anlegen und danach neu deployen.",
    bad_body:    "Anfrage konnte nicht gelesen werden.",
    no_input:    "Weder Bild noch Beschreibung übermittelt.",
    timeout:     "Zeitüberschreitung.",
    bad_json:    "Antwort der Anthropic-API war kein gültiges JSON.",
    cut:         "Die Antwort war zu lang und wurde abgeschnitten.",
    refusal:     "Claude hat die Anfrage abgelehnt.",
    unusable:    "Claude hat kein verwertbares JSON geliefert."
  },
  en: {
    missing_key: "ANTHROPIC_API_KEY is not set. Add it in Vercel under Settings → " +
                 "Environment Variables and redeploy.",
    bad_body:    "The request could not be read.",
    no_input:    "Neither an image nor a description was sent.",
    timeout:     "The request timed out.",
    bad_json:    "The Anthropic API response was not valid JSON.",
    cut:         "The answer was too long and got cut off.",
    refusal:     "Claude declined the request.",
    unusable:    "Claude did not return usable JSON."
  },
  zh: {
    missing_key: "ANTHROPIC_API_KEY 未设置。请在 Vercel 的 Settings → " +
                 "Environment Variables 中添加后重新部署。",
    bad_body:    "无法读取请求内容。",
    no_input:    "既没有收到图片，也没有收到描述。",
    timeout:     "请求超时。",
    bad_json:    "Anthropic API 返回的不是有效的 JSON。",
    cut:         "回答太长，被截断了。",
    refusal:     "Claude 拒绝了这个请求。",
    unusable:    "Claude 没有返回可用的 JSON。"
  }
};
const msg = (lang, key) => MSG[lang][key];

/* Schema für die Antwort. Alle Felder required — das hält die Grammatik
   klein und sichert die Reihenfolge der Ausgabe. */
const SCHEMA = lang => lang === "zh" ? {
  type: "object",
  properties: {
    title:      { type: "string",  description: "这道菜的简短中文名称。" },
    items: {
      type: "array",
      description: "这一餐的各个组成部分。",
      items: {
        type: "object",
        properties: {
          name:   { type: "string",  description: "组成部分的名称。" },
          amount: { type: "string",  description: "估算的份量，例如 180 克或 2 个。" },
          kcal:   { type: "integer", description: "该部分的热量。" }
        },
        required: ["name", "amount", "kcal"],
        additionalProperties: false
      }
    },
    total_kcal: { type: "integer", description: "整餐的总热量。" },
    pr:         { type: "integer", description: "蛋白质克数。" },
    ch:         { type: "integer", description: "碳水克数。" },
    fa:         { type: "integer", description: "脂肪克数。" },
    confidence: { type: "string",  enum: ["hoch", "mittel", "niedrig"],
                  description: "hoch = 识别清晰，mittel = 份量为估算，niedrig = 粗略估算。" },
    note:       { type: "string",  description: "一句话说明所做的假设。" }
  },
  required: ["title", "items", "total_kcal", "pr", "ch", "fa", "confidence", "note"],
  additionalProperties: false
} : lang === "en" ? {
  type: "object",
  properties: {
    title:      { type: "string",  description: "Short name of the dish in English." },
    items: {
      type: "array",
      description: "The individual components of the meal.",
      items: {
        type: "object",
        properties: {
          name:   { type: "string",  description: "Name of the component." },
          amount: { type: "string",  description: "Estimated amount, e.g. 180 g or 2 pieces." },
          kcal:   { type: "integer", description: "Calories of this component." }
        },
        required: ["name", "amount", "kcal"],
        additionalProperties: false
      }
    },
    total_kcal: { type: "integer", description: "Total calories of the meal." },
    pr:         { type: "integer", description: "Protein in grams." },
    ch:         { type: "integer", description: "Carbohydrates in grams." },
    fa:         { type: "integer", description: "Fat in grams." },
    confidence: { type: "string",  enum: ["hoch", "mittel", "niedrig"],
                  description: "hoch = clearly recognised, mittel = portion estimated, niedrig = rough estimate." },
    note:       { type: "string",  description: "One short sentence on the assumptions." }
  },
  required: ["title", "items", "total_kcal", "pr", "ch", "fa", "confidence", "note"],
  additionalProperties: false
} : {
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
  let lang = "de";
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
      message: msg(lang, "missing_key")
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
        return res.status(400).json({ error: "bad_body", message: msg(lang, "bad_body") });
      }
    }

    const image = body.image || null;
    const mime  = body.mime || "image/jpeg";
    const note  = String(body.note || "").trim();
    const tier  = String(body.tier || "basis").toLowerCase();
    lang = langOf(body.lang);

    if (!image && !note){
      return res.status(400).json({ error: "no_input", message: msg(lang, "no_input") });
    }

    const prompt = lang === "zh"
      ? (image
          ? (note ? `请分析这一餐。用户的补充说明："${note}"`
                  : "请分析这一餐。")
          : `用户这样描述他的一餐："${note}"\n\n请估算热量和营养素。`)
      : lang === "en"
      ? (image
          ? (note ? `Analyse this meal. Extra info from the user: "${note}"`
                  : "Analyse this meal.")
          : `The user describes their meal like this: "${note}"\n\nEstimate calories and macros.`)
      : (image
          ? (note ? `Analysiere diese Mahlzeit. Zusatz-Info vom Nutzer: "${note}"`
                  : "Analysiere diese Mahlzeit.")
          : `Der Nutzer beschreibt seine Mahlzeit so: "${note}"\n\nSchätze Kalorien und Makros.`);

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
          system: SYSTEM(lang),
          messages: [{ role: "user", content }],
          // Grammatik-gestützte Ausgabe. Kein Prefill — das ist damit unvereinbar.
          output_config: { format: { type: "json_schema", schema: SCHEMA(lang) } }
        })
      });
      rawText = await response.text();
    } catch (e) {
      return res.status(504).json({
        error: "upstream_failed",
        message: e.name === "AbortError" ? msg(lang, "timeout") : String(e.message || e)
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
        message: msg(lang, "bad_json") });
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
          ? msg(lang, "cut")
          : raw.stop_reason === "refusal"
            ? msg(lang, "refusal")
            : msg(lang, "unusable"),
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
