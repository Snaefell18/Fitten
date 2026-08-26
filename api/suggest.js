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

const SYSTEM_DE = `Du bist Ernährungsberater in einer Fitness-App und schlägst vor,
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
sachlich und bewerte den bisherigen Tag nicht. Antworte auf Deutsch.`;

const SYSTEM_EN = `You are a nutrition adviser inside a fitness app, suggesting what
the user could still eat today.

Rules:
1. Stay within the remaining calorie budget. Coming in slightly under is good,
   clearly over is a mistake.
2. Prioritise the macros that are still open. If protein is what is missing, suggest
   high-protein options; if barely any calories are left, suggest something small.
3. Prefer the favourite foods listed and combine them into realistic meals. Other
   foods are allowed as long as they fit the way of eating.
4. The way of eating and the intolerances are binding. Vegan means no animal products
   at all, vegetarian no meat and no fish, pescatarian no meat. Never suggest anything
   that could contain a listed intolerance.
5. Do not repeat what has already been eaten today.
6. If the budget is used up or exceeded, return an empty list and explain that kindly
   in "note".

Give 2 to 3 suggestions with concrete amounts in grams or pieces. Estimate calories
and macros realistically. "why" and "note" are exactly one short sentence each — stay
factual and do not judge how the day has gone. Answer in English.`;

const SYSTEM_ZH = `你是健身应用里的营养顾问，负责建议用户今天还可以吃点什么。

规则：
1. 不要超出剩余的热量额度。略低一些是好的，明显超出就是错误。
2. 优先补齐还缺的营养素。如果主要缺蛋白质，就建议高蛋白的选择；如果几乎没有热量额度了，
   就建议一点小份的东西。
3. 优先使用列出的常吃食物，把它们组合成实际可行的一餐。只要符合饮食方式，其他食物也可以。
4. 饮食方式和食物不耐受是硬性要求。纯素不得含任何动物性成分，素食不含肉和鱼，鱼素不含肉。
   凡是可能含有所列不耐受成分的，一律不要建议。
5. 不要重复今天已经吃过的东西。
6. 如果额度已经用完或超出，就返回空列表，并在 "note" 中友好地说明。

给出 2 到 3 条建议，份量要具体到克或个数。热量和营养素要估算得合理。"why" 和 "note"
各为一个简短的句子 —— 保持客观，不要评价用户今天吃得怎么样。请用中文回答。`;

const SYSTEM = lang => (lang === "en" ? SYSTEM_EN : lang === "zh" ? SYSTEM_ZH : SYSTEM_DE);

/* Die Beschreibungen im Schema steuern die Ausgabesprache mit. */
const SCHEMA = lang => lang === "zh" ? {
  type: "object",
  properties: {
    options: {
      type: "array",
      description: "两到三条建议；额度用完时为空数组。",
      items: {
        type: "object",
        properties: {
          name:   { type: "string",  description: "这一餐的中文名称。" },
          amount: { type: "string",  description: "具体份量，例如 250 克酸奶、100 克浆果。" },
          kcal:   { type: "integer", description: "该建议的热量。" },
          pr:     { type: "integer", description: "蛋白质克数。" },
          ch:     { type: "integer", description: "碳水克数。" },
          fa:     { type: "integer", description: "脂肪克数。" },
          why:    { type: "string",  description: "一句话说明为什么现在适合。" }
        },
        required: ["name", "amount", "kcal", "pr", "ch", "fa", "why"],
        additionalProperties: false
      }
    },
    note: { type: "string", description: "一句话总结整体情况。" }
  },
  required: ["options", "note"],
  additionalProperties: false
} : lang === "en" ? {
  type: "object",
  properties: {
    options: {
      type: "array",
      description: "Two to three suggestions, empty when the budget is used up.",
      items: {
        type: "object",
        properties: {
          name:   { type: "string",  description: "Name of the meal in English." },
          amount: { type: "string",  description: "Concrete amounts, e.g. 250 g skyr, 100 g berries." },
          kcal:   { type: "integer", description: "Calories of the suggestion." },
          pr:     { type: "integer", description: "Protein in grams." },
          ch:     { type: "integer", description: "Carbohydrates in grams." },
          fa:     { type: "integer", description: "Fat in grams." },
          why:    { type: "string",  description: "One short sentence on why this fits now." }
        },
        required: ["name", "amount", "kcal", "pr", "ch", "fa", "why"],
        additionalProperties: false
      }
    },
    note: { type: "string", description: "One short sentence on the overall situation." }
  },
  required: ["options", "note"],
  additionalProperties: false
} : {
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

/* Sprache des Nutzers — steuert Prompt, Schema und Fehlermeldungen. */
const langOf = l => {
  const v = String(l || "de").toLowerCase();
  return v.startsWith("en") ? "en" : v.startsWith("zh") ? "zh" : "de";
};

const MSG = {
  de: {
    missing_key: "ANTHROPIC_API_KEY ist nicht gesetzt. In Vercel anlegen und neu deployen.",
    bad_body:    "Anfrage konnte nicht gelesen werden.",
    timeout:     "Zeitüberschreitung.",
    bad_json:    "Antwort der Anthropic-API war kein gültiges JSON.",
    cut:         "Die Antwort war zu lang und wurde abgeschnitten.",
    refusal:     "Claude hat die Anfrage abgelehnt.",
    unusable:    "Claude hat kein verwertbares JSON geliefert."
  },
  en: {
    missing_key: "ANTHROPIC_API_KEY is not set. Add it in Vercel and redeploy.",
    bad_body:    "The request could not be read.",
    timeout:     "The request timed out.",
    bad_json:    "The Anthropic API response was not valid JSON.",
    cut:         "The answer was too long and got cut off.",
    refusal:     "Claude declined the request.",
    unusable:    "Claude did not return usable JSON."
  },
  zh: {
    missing_key: "ANTHROPIC_API_KEY 未设置。请在 Vercel 中添加后重新部署。",
    bad_body:    "无法读取请求内容。",
    timeout:     "请求超时。",
    bad_json:    "Anthropic API 返回的不是有效的 JSON。",
    cut:         "回答太长，被截断了。",
    refusal:     "Claude 拒绝了这个请求。",
    unusable:    "Claude 没有返回可用的 JSON。"
  }
};
const msg = (lang, key) => MSG[lang][key];

/* Sonnet 5 und Opus 5 denken standardmäßig mit, und max_tokens begrenzt
   Denken UND Antwort zusammen. Ohne Abschalten bleibt bei knappem Budget
   kein Platz für den eigentlichen Text. Haiku 4.5 kennt den Schalter nicht,
   deshalb nur für die neueren Modelle setzen. */
function thinkingOff(model){
  return /^claude-(sonnet|opus)-5/.test(model) ? { thinking: { type: "disabled" } } : {};
}

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
  let lang = "de";
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
      message: msg(lang, "missing_key")
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
        return res.status(400).json({ error: "bad_body", message: msg(lang, "bad_body") });
      }
    }

    const {
      left = 0, macrosLeft = {}, diet = "Alles",
      favorites = [], eatenToday = [], avoid = [],
      goal = "", time = "", tier = "basis"
    } = body;

    lang = langOf(body.lang);

    const MACRO_TAG = { de:["E","K","F"], en:["P","C","F"], zh:["蛋白","碳水","脂肪"] }[lang];
    const favList = favorites.length
      ? favorites.map(f => `- ${f.n} (${f.k} kcal/100 g; ${MACRO_TAG[0]} ${f.pr} / ${MACRO_TAG[1]} ${f.ch} / ${MACRO_TAG[2]} ${f.fa})`).join("\n")
      : { de:"keine angegeben", en:"none given", zh:"未提供" }[lang];

    const prompt = lang === "zh" ? `目前的情况：
- 还可摄入：${Math.round(left)} 千卡
- 还缺的营养素：蛋白质 ${Math.round(macrosLeft.pr || 0)} 克、碳水 ${Math.round(macrosLeft.ch || 0)} 克、脂肪 ${Math.round(macrosLeft.fa || 0)} 克
- 饮食方式：${diet}
- 食物不耐受，必须严格避免：${avoid.length ? avoid.join("、") : "无"}
- 目标：${goal}
- 当前时间：${time || "未知"}
- 今天已经吃过：${eatenToday.length ? eatenToday.join("、") : "还没有"}

常吃的食物：
${favList}

现在还适合吃什么？` : lang === "en" ? `Where things stand:
- Still available: ${Math.round(left)} kcal
- Macros still open: ${Math.round(macrosLeft.pr || 0)} g protein, ${Math.round(macrosLeft.ch || 0)} g carbs, ${Math.round(macrosLeft.fa || 0)} g fat
- Way of eating: ${diet}
- Intolerances, strictly avoid: ${avoid.length ? avoid.join(", ") : "none"}
- Goal: ${goal}
- Time: ${time || "unknown"}
- Already eaten today: ${eatenToday.length ? eatenToday.join(", ") : "nothing yet"}

Favourite foods:
${favList}

What still fits?` : `Aktuelle Lage:
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
          ...thinkingOff(modelFor(tier)),
          max_tokens: 2500,
          system: SYSTEM(lang),
          messages: [{ role: "user", content: prompt }],
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
