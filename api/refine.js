export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const { history } = req.body || {};
  if (!Array.isArray(history) || history.length < 2) {
    return res.status(400).json({ error: "history array is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server not configured — contact your administrator." });

  // Prepend a system-style instruction as the first user turn if not already present
  const systemPreamble = `You are a senior HSEQ investigation analyst at Saltend Chemicals Park using ICAM methodology. You are refining a root cause analysis based on feedback from the investigator. Return ONLY valid JSON in exactly the same structure as before — no markdown, no backticks, no commentary. Update whichever sections are affected by the new information. Keep sections that are unaffected. Be highly specific to this incident.

The JSON structure is:
{
  "title": "short incident title",
  "summary": "2-3 sentence summary",
  "whys": [{"level":1,"question":"...","answer":"..."},{"level":2,...},{"level":3,...},{"level":4,...},{"level":5,...}],
  "rootCauses": [{"label":"...","detail":"..."},...],
  "contributingFactors": [{"label":"...","detail":"..."},...],
  "actions": [{"text":"...","priority":"High|Medium|Low","owner":"...","timeframe":"..."},...]
}`;

  // Insert system context as leading user message if not already there
  const messages = history[0]?.content?.startsWith('You are a senior HSEQ')
    ? history
    : [{ role: 'user', content: systemPreamble }, { role: 'assistant', content: 'Understood. I will update the analysis as requested and return only valid JSON.' }, ...history];

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages
      })
    });

    const data = await upstream.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text   = (data.content || []).map(b => b.text || "").join("");
    const clean  = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: "Refinement failed: " + err.message });
  }
}
