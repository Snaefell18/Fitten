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

function buildSystem(c = {}){
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
realistisch. Passe Vorschläge immer an das an, was heute noch übrig ist.`;
}

export const config = { maxDuration: 60 };

export default async function handler(req, res){
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

    const tier = String(body.tier || "").toLowerCase();
    if (tier !== "premium" && tier !== "ultra"){
      return res.status(403).json({
        error: "tier_required",
        message: "Der Coach ist Teil von Premium und Ultra+."
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
      return res.status(400).json({ error: "no_message", message: "Keine Frage übermittelt." });
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
          max_tokens: 900,
          system: buildSystem(body.context || {}),
          messages
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

    const reply = (raw.content || [])
      .filter(b => b.type === "text").map(b => b.text).join("").trim();

    if (!reply){
      return res.status(502).json({
        error: "empty_reply",
        stop_reason: raw.stop_reason || null,
        message: "Der Coach hat keine Antwort zurückgegeben."
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
