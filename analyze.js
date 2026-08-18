/* ══════════════════════════════════════════════════════════════════
   /api/analyze.js  —  Vercel Serverless Function
   Nimmt Foto + Kommentar entgegen, fragt Claude, gibt sauberes JSON zurück.
   Der API-Key liegt ausschließlich hier (Vercel → Settings → Environment
   Variables → ANTHROPIC_API_KEY). Er darf niemals ins Frontend.
   ══════════════════════════════════════════════════════════════════ */

// Haiku 4.5 ist das günstigste Modell mit Bildverständnis – für die
// Portionsschätzung reicht es klar aus. Für maximale Genauigkeit hier
// auf "claude-sonnet-4-6" wechseln (deutlich teurer pro Bild).
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

export default async function handler(req, res){
  if (req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });

  const { image, mime = "image/jpeg", note = "" } = req.body || {};
  if (!image) return res.status(400).json({ error:"Kein Bild übermittelt" });

  const prompt = note.trim()
    ? `Analysiere diese Mahlzeit. Zusatz-Info vom Nutzer: "${note.trim()}"`
    : "Analysiere diese Mahlzeit.";

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{
        "content-type":"application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version":"2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: SYSTEM,
        messages:[{
          role:"user",
          content:[
            { type:"image", source:{ type:"base64", media_type:mime, data:image } },
            { type:"text",  text:prompt }
          ]
        }]
      })
    });

    if (!r.ok) return res.status(502).json({ error:"Claude-API nicht erreichbar" });

    const data = await r.json();
    const text = (data.content || [])
      .filter(b => b.type === "text").map(b => b.text).join("").trim();

    // Sicherheitsnetz, falls das Modell doch Backticks mitschickt
    const clean = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const start = clean.indexOf("{"), end = clean.lastIndexOf("}");
    const parsed = JSON.parse(clean.slice(start, end + 1));

    return res.status(200).json(parsed);
  } catch {
    return res.status(500).json({ error:"Analyse fehlgeschlagen" });
  }
}
