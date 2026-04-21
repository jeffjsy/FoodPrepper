// server/routes/generate.js
import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// ── System Prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are "Food Prepper", a professional chef assistant. Your ONLY job is to generate a single recipe using ingredients the user provides.

You must ALWAYS respond with a valid JSON object and NOTHING else — no markdown fences, no explanations, no extra text. The JSON must follow this exact structure:

{
  "title": "string — the name of the dish",
  "description": "string — one or two sentences describing the dish",
  "difficulty": "Easy | Medium | Hard",
  "prepTime": "string — e.g. '10 minutes'",
  "cookTime": "string — e.g. '25 minutes'",
  "servings": number,
  "caloriesPerServing": "string — estimated calories per serving e.g. '450 kcal'",
  "ingredients": [
    { "name": "string", "amount": "string" }
  ],
  "steps": ["string", "string"],
  "tips": "string — one helpful cooking tip"
}

Rules:
- Only use ingredients the user lists. You may assume salt, pepper, water, and basic cooking oil are always available.
- caloriesPerServing should be a reasonable estimate based on the ingredients and serving size.
- If the user provides ingredients that cannot form a reasonable meal, return a JSON object with an "error" key: { "error": "Cannot generate a recipe with those ingredients." }
- Never refuse a request for any other reason. Never add commentary outside the JSON.
`.trim();

// ── Follow-up chat system prompt ──────────────────────────────────────────
// Used after the recipe has been generated — allows plain text responses
const CHAT_SYSTEM_PROMPT = `
You are "Food Prepper", a friendly and knowledgeable professional chef assistant.
A recipe has already been generated for the user. You are now helping them with follow-up questions or modifications related to that recipe.

Respond in plain, conversational text — not JSON. Keep answers concise and helpful.
You may help with things like:
- Substituting ingredients
- Adjusting serving sizes
- Clarifying a cooking step
- Suggesting side dishes
- Answering general cooking questions about the recipe

Stay focused on the recipe and cooking. Do not help with unrelated topics.
`.trim();

// ── POST /api/generate ────────────────────────────────────────────────────
router.post("/generate", async (req, res) => {
  const { ingredients, servings, dietary } = req.body;

  if (!ingredients || ingredients.trim() === "") {
    return res.status(400).json({ error: "No ingredients provided." });
  }

  const userMessage = `
Ingredients I have: ${ingredients}
Servings needed: ${servings || 2}
Dietary restrictions: ${dietary || "None"}

Please generate a recipe using only these ingredients.
  `.trim();

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1024,
    });

    const rawText = completion.choices[0].message.content;
    console.log("Raw API response:", rawText);

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const recipe = JSON.parse(cleaned);
    res.json(recipe);
  } catch (error) {
    console.error("Full error:", error.message);
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: "Failed to parse recipe response from AI." });
    }
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// ── POST /api/chat ────────────────────────────────────────────────────────
// Accepts full conversation history so the LLM has context of the recipe
// and all previous follow-up messages
router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "No messages provided." });
  }

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

export default router;