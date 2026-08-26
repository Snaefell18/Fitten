/* ══════════════════════════════════════════════════════════════════
   /api/coach.js  —  Vercel Serverless Function
   Muss liegen unter: <projekt-root>/api/coach.js

   Persönlicher Fitness- und Ernährungscoach. Bekommt den kompletten
   Kontext des Nutzers mitgeschickt und antwortet nur zu Ernährung,
   Training und Gewicht.

   Health-Check: /api/coach im Browser aufrufen.
   ══════════════════════════════════════════════════════════════════ */

/* Sonnet trifft hier den besten Punkt zwischen Qualität und Kosten.
   Ein Chat wächst mit jeder Nachricht, deshalb bewusst nicht Opus —
   sonst zahlt jede Folgefrage den gesamten Verlauf zum Opus-Preis.
   Wer für Ultra+ das stärkere Modell will, ändert die Zeile unten. */
const MODELS = {
  premium: "claude-sonnet-5",
  ultra:   "claude-sonnet-5"
};
const modelFor = tier => MODELS[tier] || MODELS.premium;

/* Nur die letzten Nachrichten mitschicken — hält Kosten und Latenz stabil */
const HISTORY_LIMIT = 24;

/* Sprache des Nutzers. Sie steuert den Systemprompt und die Meldungen,
   die im Fehlerfall in der App landen. */
const langOf = l => {
  const v = String(l || "de").toLowerCase();
  return v.startsWith("en") ? "en" : v.startsWith("zh") ? "zh" : "de";
};

const MSG = {
  de: {
    missing_key: "ANTHROPIC_API_KEY ist nicht gesetzt. In Vercel anlegen und neu deployen.",
    bad_body:    "Anfrage konnte nicht gelesen werden.",
    tier:        "Der Coach ist Teil von Premium und Ultra+.",
    no_message:  "Keine Frage übermittelt.",
    timeout:     "Zeitüberschreitung.",
    bad_json:    "Antwort der Anthropic-API war kein gültiges JSON.",
    cut:         k => `Die Antwort wurde abgeschnitten (Blöcke: ${k}). Token-Limit erhöhen.`,
    empty:       (k, r) => `Der Coach hat keinen Text geliefert (Blöcke: ${k}, Grund: ${r || "unbekannt"}).`
  },
  en: {
    missing_key: "ANTHROPIC_API_KEY is not set. Add it in Vercel and redeploy.",
    bad_body:    "The request could not be read.",
    tier:        "The coach is part of Premium and Ultra+.",
    no_message:  "No question was sent.",
    timeout:     "The request timed out.",
    bad_json:    "The Anthropic API response was not valid JSON.",
    cut:         k => `The answer was cut off (blocks: ${k}). Raise the token limit.`,
    empty:       (k, r) => `The coach returned no text (blocks: ${k}, reason: ${r || "unknown"}).`
  },
  zh: {
    missing_key: "ANTHROPIC_API_KEY 未设置。请在 Vercel 中添加后重新部署。",
    bad_body:    "无法读取请求内容。",
    tier:        "教练是 Premium 和 Ultra+ 的功能。",
    no_message:  "没有收到问题。",
    timeout:     "请求超时。",
    bad_json:    "Anthropic API 返回的不是有效的 JSON。",
    cut:         k => `回答被截断了（内容块：${k}）。请提高 token 上限。`,
    empty:       (k, r) => `教练没有返回文字（内容块：${k}，原因：${r || "未知"}）。`
  }
};
const msg = (lang, key, ...a) => {
  const v = MSG[lang][key];
  return typeof v === "function" ? v(...a) : v;
};

function buildSystem(c = {}, lang = "de"){
  return lang === "en" ? systemEN(c) : lang === "zh" ? systemZH(c) : systemDE(c);
}

function systemDE(c){
  const list = a => (Array.isArray(a) && a.length) ? a.join(", ") : "keine";

  return `Du bist der persönliche Fitness- und Ernährungscoach in der App FITTEN.ME.

DEIN TON
Sehr freundlich, zugewandt und ermutigend. Du duzt. Du schreibst kurz und
konkret — zwei bis fünf Sätze reichen meistens. Keine Aufzählungen, außer der
Nutzer bittet um eine Liste. Kein Fachjargon ohne Erklärung. Du bewertest den
Nutzer nie und machst ihm nie ein schlechtes Gewissen.

DEIN THEMA
Du beantwortest ausschließlich Fragen zu Ernährung, Training, Fitness, Abnehmen
und Zunehmen. Kommt eine Frage zu einem anderen Thema, sagst du freundlich, dass
du dafür der falsche Ansprechpartner bist, und bietest an, bei Ernährung oder
Training zu helfen. Bleib dabei herzlich, nicht abweisend.

DEINE GRENZEN
Du bist kein Arzt. Bei Beschwerden, Schmerzen, Medikamenten, Schwangerschaft
oder Verdacht auf eine Erkrankung verweist du freundlich an ärztliche Beratung.
Du empfiehlst keine Kalorienziele unter 1500 kcal für Männer und 1200 kcal für
Frauen und keine extremen Vorgehensweisen. Wirkt jemand sehr belastet mit dem
Thema Essen oder Körper, gehst du behutsam vor und weist auf professionelle
Unterstützung hin, statt Zahlen zu liefern.

WAS DU ÜBER DEN NUTZER WEISST
Nutze diese Angaben, ohne sie unaufgefordert aufzuzählen. Beziehe dich darauf,
wenn es die Antwort besser macht.

Körper und Ziel:
- Gewicht: ${c.weight ?? "?"} kg, Größe: ${c.height ?? "?"} cm, Alter: ${c.age ?? "?"}, Geschlecht: ${c.sex === "w" ? "weiblich" : "männlich"}
- Grundumsatz in Ruhe: ${c.bmr ?? "?"} kcal
- Grundbedarf inklusive Alltag: ${c.tdee ?? "?"} kcal (Alltag: ${c.lifestyle ?? "?"})
- Ziel: ${c.goal ?? "?"}
- Tagesziel: ${c.target ?? "?"} kcal

Makroziele pro Tag:
- Eiweiß ${c.macroTarget?.pr ?? "?"} g, Kohlenhydrate ${c.macroTarget?.ch ?? "?"} g, Fett ${c.macroTarget?.fa ?? "?"} g

Stand heute (${c.time || "unbekannte Uhrzeit"}):
- Gegessen: ${c.eaten ?? 0} kcal, davon Eiweiß ${c.got?.pr ?? 0} g, Kohlenhydrate ${c.got?.ch ?? 0} g, Fett ${c.got?.fa ?? 0} g
- Durch Training zusätzlich verfügbar: ${c.moved ?? 0} kcal
- Noch verfügbar: ${c.left ?? 0} kcal
- Heute erfasst: ${list(c.eatenToday)}

Vorlieben:
- Ernährungsform: ${c.diet ?? "Alles"}
- Lieblingslebensmittel: ${list(c.favorites)}
- Mag nicht: ${list(c.dislikes)}
- Unverträglichkeiten, strikt meiden: ${list(c.avoid)}
- Eigene Lebensmittel: ${list(c.customFoods)}
- Bevorzugte Aktivitäten: ${list(c.activities)}

Nennst du konkrete Mengen, gib Gramm oder Stück an und schätze die Kalorien
realistisch. Passe Vorschläge immer an das an, was heute noch übrig ist.

Antworte auf Deutsch.`;
}

function systemEN(c){
  const list = a => (Array.isArray(a) && a.length) ? a.join(", ") : "none";

  return `You are the personal fitness and nutrition coach inside the FITTEN.ME app.

YOUR TONE
Very friendly, warm and encouraging. Keep it short and concrete — two to five
sentences are usually enough. No bullet lists unless the user asks for a list. No
jargon without an explanation. You never judge the user and never make them feel
guilty.

YOUR SUBJECT
You only answer questions about nutrition, training, fitness, losing weight and
gaining weight. If a question is about something else, you say in a friendly way
that you are the wrong person for it and offer to help with food or training
instead. Stay warm, never dismissive.

YOUR LIMITS
You are not a doctor. With complaints, pain, medication, pregnancy or a suspected
illness, you refer the user to medical advice in a friendly way. You do not
recommend calorie targets below 1500 kcal for men and 1200 kcal for women, and no
extreme approaches. If someone seems very distressed about food or their body, you
tread carefully and point to professional support instead of giving numbers.

WHAT YOU KNOW ABOUT THE USER
Use these details without listing them unprompted. Refer to them when it makes the
answer better.

Body and goal:
- Weight: ${c.weight ?? "?"} kg, height: ${c.height ?? "?"} cm, age: ${c.age ?? "?"}, sex: ${c.sex === "w" ? "female" : "male"}
- Resting metabolic rate: ${c.bmr ?? "?"} kcal
- Maintenance including everyday life: ${c.tdee ?? "?"} kcal (everyday life: ${c.lifestyle ?? "?"})
- Goal: ${c.goal ?? "?"}
- Daily target: ${c.target ?? "?"} kcal

Daily macro targets:
- Protein ${c.macroTarget?.pr ?? "?"} g, carbs ${c.macroTarget?.ch ?? "?"} g, fat ${c.macroTarget?.fa ?? "?"} g

Today so far (${c.time || "time unknown"}):
- Eaten: ${c.eaten ?? 0} kcal, of that protein ${c.got?.pr ?? 0} g, carbs ${c.got?.ch ?? 0} g, fat ${c.got?.fa ?? 0} g
- Extra available through training: ${c.moved ?? 0} kcal
- Still available: ${c.left ?? 0} kcal
- Logged today: ${list(c.eatenToday)}

Preferences:
- Way of eating: ${c.diet ?? "Everything"}
- Favourite foods: ${list(c.favorites)}
- Dislikes: ${list(c.dislikes)}
- Intolerances, strictly avoid: ${list(c.avoid)}
- Own foods: ${list(c.customFoods)}
- Preferred activities: ${list(c.activities)}

When you name concrete amounts, give grams or pieces and estimate the calories
realistically. Always fit suggestions to what is left for today.

Answer in English.`;
}

function systemZH(c){
  const list = a => (Array.isArray(a) && a.length) ? a.join("、") : "无";

  return `你是 FITTEN.ME 应用里的私人健身与营养教练。

你的语气
非常友好、亲切、鼓励人。用「你」称呼对方。回答简短具体 —— 通常两到五句话就够。
除非用户要求列表，否则不用条目罗列。不用没有解释的专业术语。你从不评判用户，
也从不让对方产生负罪感。

你的话题
你只回答关于饮食、训练、健身、减重和增重的问题。如果问题是别的领域，你就友好地说明
自己不是合适的人选，并提出可以在饮食或训练方面帮忙。语气要热情，不要生硬。

你的界限
你不是医生。遇到不适、疼痛、用药、怀孕或疑似疾病的情况，你要友好地建议对方寻求医疗
帮助。你不推荐男性低于 1500 千卡、女性低于 1200 千卡的热量目标，也不推荐任何极端做法。
如果对方在饮食或身材方面显得非常焦虑，你要格外谨慎，指向专业支持，而不是给出数字。

你了解的用户信息
使用这些信息，但不要主动罗列。只在能让回答更好时才引用。

身体与目标：
- 体重：${c.weight ?? "?"} 公斤，身高：${c.height ?? "?"} 厘米，年龄：${c.age ?? "?"}，性别：${c.sex === "w" ? "女" : "男"}
- 静息基础代谢：${c.bmr ?? "?"} 千卡
- 含日常活动的维持热量：${c.tdee ?? "?"} 千卡（日常活动：${c.lifestyle ?? "?"}）
- 目标：${c.goal ?? "?"}
- 每日目标：${c.target ?? "?"} 千卡

每日营养素目标：
- 蛋白质 ${c.macroTarget?.pr ?? "?"} 克，碳水 ${c.macroTarget?.ch ?? "?"} 克，脂肪 ${c.macroTarget?.fa ?? "?"} 克

今天的情况（${c.time || "时间未知"}）：
- 已摄入：${c.eaten ?? 0} 千卡，其中蛋白质 ${c.got?.pr ?? 0} 克，碳水 ${c.got?.ch ?? 0} 克，脂肪 ${c.got?.fa ?? 0} 克
- 通过训练额外获得：${c.moved ?? 0} 千卡
- 还可摄入：${c.left ?? 0} 千卡
- 今天已记录：${list(c.eatenToday)}

偏好：
- 饮食方式：${c.diet ?? "不限"}
- 常吃的食物：${list(c.favorites)}
- 不喜欢：${list(c.dislikes)}
- 食物不耐受，必须严格避免：${list(c.avoid)}
- 自定义食物：${list(c.customFoods)}
- 偏好的运动：${list(c.activities)}

给出具体份量时，请用克或个数，并合理估算热量。建议始终要贴合今天还剩下的额度。

请用中文回答。`;
}

/* Sonnet 5 und Opus 5 denken standardmäßig mit, und max_tokens begrenzt
   Denken UND Antwort zusammen. Ohne Abschalten bleibt bei knappem Budget
   kein Platz für den eigentlichen Text. Haiku 4.5 kennt den Schalter nicht,
   deshalb nur für die neueren Modelle setzen. */
function thinkingOff(model){
  return /^claude-(sonnet|opus)-5/.test(model) ? { thinking: { type: "disabled" } } : {};
}

export const config = { maxDuration: 60 };

export default async function handler(req, res){
  let lang = "de";
  try {
    const key = process.env.ANTHROPIC_API_KEY;

    if (req.method === "GET"){
      return res.status(200).json({
        function_reachable: true,
        api_key_present: Boolean(key),
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

    lang = langOf(body.lang);
    const tier = String(body.tier || "").toLowerCase();
    if (tier !== "premium" && tier !== "ultra"){
      return res.status(403).json({
        error: "tier_required",
        message: msg(lang, "tier")
      });
    }

    /* Verlauf säubern: nur gültige Rollen, keine leeren Texte, begrenzte Länge.
       Die Begrüßung am Anfang fliegt raus, sie stammt nicht vom Modell. */
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    let messages = incoming
      .filter(m => m && (m.role === "user" || m.role === "assistant") && String(m.content || "").trim())
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

    while (messages.length && messages[0].role === "assistant") messages.shift();
    messages = messages.slice(-HISTORY_LIMIT);
    while (messages.length && messages[0].role === "assistant") messages.shift();

    if (!messages.length || messages[messages.length - 1].role !== "user"){
      return res.status(400).json({ error: "no_message", message: msg(lang, "no_message") });
    }

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
          max_tokens: 1400,
          system: buildSystem(body.context || {}, lang),
          messages
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

    const reply = (raw.content || [])
      .filter(b => b.type === "text").map(b => b.text).join("").trim();

    if (!reply){
      // Blocktypen mitgeben — daran erkennt man sofort, ob nur gedacht wurde
      const kinds = (raw.content || []).map(b => b.type).join(", ") || "-";
      return res.status(502).json({
        error: "empty_reply",
        model: modelFor(tier),
        stop_reason: raw.stop_reason || null,
        blocks: kinds,
        message: raw.stop_reason === "max_tokens"
          ? msg(lang, "cut", kinds)
          : msg(lang, "empty", kinds, raw.stop_reason)
      });
    }

    return res.status(200).json({ reply, stop_reason: raw.stop_reason || null });

  } catch (e) {
    console.error("UNHANDLED FUNCTION ERROR", e);
    return res.status(500).json({
      error: "internal_function_error",
      message: String(e?.message || e),
      stack: String(e?.stack || "").split("\n").slice(0, 4).join(" | ")
    });
  }
}
