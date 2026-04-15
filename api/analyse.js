export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const { description } = req.body || {};
  if (!description?.trim()) return res.status(400).json({ error: "description is required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server not configured — contact your administrator." });

  const prompt = `You are a senior HSEQ investigation analyst at Saltend Chemicals Park using ICAM methodology.
A colleague has described an incident. Analyse it and return ONLY valid JSON — no markdown, no backticks, no commentary.

Incident description:
${description}

Return exactly this JSON structure — be highly specific to this incident, never use generic filler answers:
{
  "title": "A short 6-10 word title for this incident",
  "summary": "2-3 sentences: what happened, why it matters, what the key risk was",
  "whys": [
    { "level": 1, "question": "What directly caused the incident?",               "answer": "specific answer" },
    { "level": 2, "question": "Why did that happen?",                             "answer": "one level deeper — a failed barrier or missed step" },
    { "level": 3, "question": "Why did that happen?",                             "answer": "process, procedure or equipment failure" },
    { "level": 4, "question": "Why did that happen?",                             "answer": "management system or oversight gap" },
    { "level": 5, "question": "What is the underlying root cause?",               "answer": "the systemic failure — if fixed, prevents recurrence" }
  ],
  "rootCauses": [
    { "label": "Max 5-word label",  "detail": "One sentence explaining this root cause" },
    { "label": "...", "detail": "..." },
    { "label": "...", "detail": "..." },
    { "label": "...", "detail": "..." }
  ],
  "contributingFactors": [
    { "label": "Max 5-word label", "detail": "One sentence explaining this factor" },
    { "label": "...", "detail": "..." },
    { "label": "...", "detail": "..." }
  ],
  "actions": [
    { "text": "Specific corrective action", "priority": "High",   "owner": "Role title", "timeframe": "Immediate" },
    { "text": "Specific corrective action", "priority": "High",   "owner": "Role title", "timeframe": "7 days"    },
    { "text": "Specific corrective action", "priority": "Medium", "owner": "Role title", "timeframe": "30 days"   },
    { "text": "Specific corrective action", "priority": "Medium", "owner": "Role title", "timeframe": "30 days"   },
    { "text": "Specific corrective action", "priority": "Low",    "owner": "Role title", "timeframe": "90 days"   }
  ]
}

Return ONLY the JSON object.`;

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
        messages:   [{ role: "user", content: prompt }]
      })
    });

    const data = await upstream.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text   = (data.content || []).map(b => b.text || "").join("");
    const clean  = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: "Analysis failed: " + err.message });
  }
}
