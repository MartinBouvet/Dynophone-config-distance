/**
 * Dynovate Config API - Stockage config Dynophone
 * GET : récupère la config (Dynophone)
 * POST : enregistre la config (Dynovate Unified)
 * Protégé par DYNOVATE_CONFIG_API_KEY
 */

const CONFIG_KEY = "dynophone_config";

const defaultConfig = {
  systemPrompt: "Tu es l'assistant téléphonique Dynophone de Dynovate. Tu réponds au 09 78 46 98 93. Sois professionnel, courtois et concis. Tu peux prendre des rendez-vous et répondre aux questions courantes. Réponds uniquement en français.",
  voicePreset: "female",
  greeting: "Bonjour, bienvenue chez Dynovate. Comment puis-je vous aider ?",
  transcriptionEnabled: true,
};

function checkAuth(req) {
  const apiKey = process.env.DYNOVATE_CONFIG_API_KEY;
  if (!apiKey) return true; // Pas de clé = mode dev, tout autorise
  const provided = req.headers["x-api-key"] || req.query.apiKey;
  return provided === apiKey;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Api-Key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (!checkAuth(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Vercel KV
    const { kv } = await import("@vercel/kv");

    if (req.method === "GET") {
      const config = await kv.get(CONFIG_KEY);
      return res.status(200).json(config || defaultConfig);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const config = {
        ...defaultConfig,
        ...(body.systemPrompt !== undefined && { systemPrompt: String(body.systemPrompt) }),
        ...(body.voicePreset !== undefined && { voicePreset: body.voicePreset === "male" ? "male" : "female" }),
        ...(body.greeting !== undefined && { greeting: String(body.greeting) }),
        ...(body.transcriptionEnabled !== undefined && { transcriptionEnabled: Boolean(body.transcriptionEnabled) }),
      };
      await kv.set(CONFIG_KEY, config);
      return res.status(200).json(config);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("[dynovate-config]", e);
    return res.status(500).json({ error: "Internal error" });
  }
}
