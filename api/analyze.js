/* ══════════════════════════════════════════════════════════════════
   /api/analyze.js  —  Vercel Serverless Function
   Muss exakt hier liegen: <projekt-root>/api/analyze.js

   Health-Check: https://deine-domain.vercel.app/api/analyze im Browser
   aufrufen. Zeigt, ob die Function läuft und der Key ankommt — ohne ihn
   preiszugeben.
   ══════════════════════════════════════════════════════════════════ */

/* Modell nach gewählter Stufe. Bewusst serverseitig gemappt — so kann über
   den Request kein beliebiges Modell untergeschoben werden. */
const MODELS = {
  basis:   "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-5",
  ultra:   "claude-opus-5"
};
const modelFor = tier => MODELS[tier] || MODELS.basis;

const SYSTEM = `Du schätzt Kalorien für eine Fitness-App — entweder aus einem
Essensfoto, aus einer Textbeschreibung oder aus beidem.

Bekommst du nur Text, gehst du von haushaltsüblichen Portionen aus, sofern der
Nutzer keine Mengen nennt, und hältst das in "note" fest.

Vorgehen bei einem Foto:
1. Benenne jede erkennbare Komponente einzeln (Beilagen, Soßen, Öl, Getränk nicht vergessen).
2. Schätze die Menge in Gramm oder Stück anhand von Tellergröße, Besteck und Bildwinkel.
3. Rechne die Kalorien pro Komponente aus.

Der Nutzerkommentar korrigiert immer deine Bildschätzung, nicht umgekehrt.
Bei Mengenangaben wie "halbe Portion" skalierst du entsprechend.

4. Schätze zusätzlich die Makronährstoffe der gesamten Mahlzeit in Gramm:
   pr = Eiweiß, ch = Kohlenhydrate, fa = Fett. Sie sollten grob zu den
   Kalorien passen (Eiweiß und Kohlenhydrate je 4 kcal/g, Fett 9 kcal/g).

Antworte ausschließlich mit reinem JSON, ohne Markdown, ohne Backticks,
ohne Text davor oder danach, in genau diesem Format:

{
  "title": "kurzer Name des Gerichts auf Deutsch",
  "items": [{ "name": "Komponente", "amount": "180 g", "kcal": 290 }],
  "total_kcal": 640,
  "pr": 38,
  "ch": 52,
  "fa": 24,
  "confidence": "hoch" | "mittel" | "niedrig",
  "note": "ein kurzer Satz, was du angenommen hast"
}

Ist auf dem Bild kein Essen zu sehen, gib total_kcal 0, alle Makros 0,
confidence "niedrig" und erkläre das in note.

Halte "note" auf einen kurzen Satz. Gib nur das JSON aus, keine Erläuterungen.`;

/* ── JSON robust aus der Modellantwort holen ──────────────────────────
   Stärkere Modelle formulieren ausführlicher. Ohne Absicherung kippt das
   Parsen, sobald ein Vorspann davorsteht oder die Antwort ins Token-Limit
   läuft. Drei Stufen: Text einsammeln, balancierte Klammer suchen, und im
   Notfall eine abgeschnittene Antwort schließen. */
function collectText(raw, prefill = ""){
  return prefill + (raw.content || [])
    .filter(b => b.type === "text").map(b => b.text).join("");
}

function sliceBalanced(t){
  const start = t.indexOf("{");
  if (start < 0) return null;
  t = t.slice(start);
  let depth = 0, inStr = false, esc = false;
  for (let i = 0; i < t.length; i++){
    const c = t[i];
    if (inStr){
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return t.slice(0, i + 1);
  }
  return t;                       // unvollständig – Reparatur versucht es weiter
}

function repair(t){
  const base = t.replace(/,\s*$/, "");
  for (const suf of ['"}]}', '"}}', "}]}", "]}", "}}", "}"]){
    try { return JSON.parse(base + suf); } catch {}
  }
  const cut = base.lastIndexOf("}");        // bis zum letzten vollständigen Objekt
  if (cut > 0) for (const suf of ["]}", "}"]){
    try { return JSON.parse(base.slice(0, cut + 1) + suf); } catch {}
  }
  return null;
}

function parseModelJson(raw, prefill = ""){
  const text = collectText(raw, prefill);
  const clean = text.replace(/^```(?:json)?/i, "").replace(/```\s*$/, "").trim();
  const sliced = sliceBalanced(clean);
  if (!sliced) return { data:null, text:clean };
  try { return { data: JSON.parse(sliced), text:clean }; } catch {}
  return { data: repair(sliced), text:clean };
}

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
      models: MODELS,
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

  const { image, mime = "image/jpeg", note = "", tier = "basis" } = body;
  const text = String(note || "").trim();

  if (!image && !text) {
    return res.status(400).json({
      error: "no_input",
      message: "Weder Bild noch Beschreibung übermittelt."
    });
  }

  const prompt = image
    ? (text ? `Analysiere diese Mahlzeit. Zusatz-Info vom Nutzer: "${text}"`
            : "Analysiere diese Mahlzeit.")
    : `Der Nutzer beschreibt seine Mahlzeit so: "${text}". Schätze die Kalorien.`;

  // Ohne Bild wird nur der Text geschickt — das spart Tokens und läuft schneller
  const content = image
    ? [{ type: "image", source: { type: "base64", media_type: mime, data: image } },
       { type: "text",  text: prompt }]
    : [{ type: "text", text: prompt }];

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
        model: modelFor(tier),
        max_tokens: 1400,
        system: SYSTEM,
        // Antwort mit "{" vorbelegen — dann kann kein Vorspann davorstehen
        messages: [
          { role: "user", content },
          { role: "assistant", content: "{" }
        ]
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
        ? "Zeitüberschreitung bei der Analyse."
        : String(e.message || e)
    });
  }

  /* ── Modellantwort in JSON überführen ───────────────────────── */
  const { data, text } = parseModelJson(raw, "{");
  if (data) return res.status(200).json(data);

  return res.status(500).json({
    error: "bad_model_output",
    stop_reason: raw.stop_reason || null,
    model: modelFor(tier),
    message: raw.stop_reason === "max_tokens"
      ? "Die Antwort war zu lang und wurde abgeschnitten."
      : "Claude hat kein verwertbares JSON geliefert.",
    raw_preview: String(text).slice(0, 300)
  });
}
