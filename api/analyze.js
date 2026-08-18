/* ══════════════════════════════════════════════════════════════════
   /api/analyze.js  —  Vercel Serverless Function
   Muss exakt hier liegen: <projekt-root>/api/analyze.js

   Health-Check: https://deine-domain.vercel.app/api/analyze im Browser
   aufrufen. Zeigt, ob die Function läuft und der Key ankommt — ohne ihn
   preiszugeben.
   ══════════════════════════════════════════════════════════════════ */

const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM = `Du schätzt Kalorien aus Essensfotos für eine Fitness-App.

Vorgehen:
1. Benenne jede erkennbare Komponente einzeln (Beilagen, Soßen, Öl, Getränk nicht vergessen).
2. Schätze die Menge in Gramm oder Stück anhand von Tellergröße, Besteck und Bildwinkel.
3. Rechne die Kalorien pro Komponente aus.

Der Nutzerkommentar korrigiert immer deine Bildschätzung, nicht umgekehrt.
Bei Mengenangaben wie "halbe Portion" skalierst du entsprechend.

Antworte ausschließlich mit reinem JSON, ohne Markdown, ohne Backticks,
ohne Text davor oder danach, in genau diesem Format:

{
  "title": "kurzer Name des Gerichts auf Deutsch",
  "items": [{ "name": "Komponente", "amount": "180 g", "kcal": 290 }],
  "total_kcal": 640,
  "confidence": "hoch" | "mittel" | "niedrig",
  "note": "ein kurzer Satz, was du angenommen hast"
}

Ist auf dem Bild kein Essen zu sehen, gib total_kcal 0, confidence "niedrig"
und erkläre das in note.`;

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;

  /* ── Health-Check ───────────────────────────────────────────── */
  if (req.method === "GET") {
    return res.status(200).json({
      function_reachable: true,
      api_key_present: Boolean(key),
      api_key_length: key ? key.length : 0,
      api_key_prefix: key ? key.slice(0, 7) : null,
      model: MODEL,
      node: process.version
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!key) {
    return res.status(500).json({
      error: "missing_key",
      message: "ANTHROPIC_API_KEY ist in dieser Umgebung nicht gesetzt. " +
               "In Vercel unter Settings → Environment Variables anlegen und danach neu deployen."
    });
  }

  /* ── Body lesen, auch wenn Vercel ihn nicht geparst hat ─────── */
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body) {
    try {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return res.status(400).json({ error: "bad_body", message: "Anfrage konnte nicht gelesen werden." });
    }
  }

  const { image, mime = "image/jpeg", note = "" } = body;
  if (!image) {
    return res.status(400).json({ error: "no_image", message: "Kein Bild übermittelt." });
  }

  const prompt = String(note).trim()
    ? `Analysiere diese Mahlzeit. Zusatz-Info vom Nutzer: "${String(note).trim()}"`
    : "Analysiere diese Mahlzeit.";

  /* ── Anthropic aufrufen ─────────────────────────────────────── */
  let raw;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: SYSTEM,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mime, data: image } },
            { type: "text",  text: prompt }
          ]
        }]
      })
    });
    clearTimeout(timer);

    const text = await r.text();

    if (!r.ok) {
      // Originalmeldung von Anthropic durchreichen, sonst tappt man im Dunkeln
      let detail = text.slice(0, 400);
      try { detail = JSON.parse(text)?.error?.message || detail; } catch {}
      return res.status(502).json({ error: "anthropic_error", status: r.status, message: detail });
    }
    raw = JSON.parse(text);
  } catch (e) {
    return res.status(504).json({
      error: "upstream_failed",
      message: e.name === "AbortError"
        ? "Zeitüberschreitung bei der Bildanalyse."
        : String(e.message || e)
    });
  }

  /* ── Modellantwort in JSON überführen ───────────────────────── */
  try {
    const text = (raw.content || [])
      .filter(b => b.type === "text").map(b => b.text).join("").trim();
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
