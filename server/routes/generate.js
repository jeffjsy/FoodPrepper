// server/routes/generate.js
import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const SYSTEM_PROMPT = `
You are "Food Prepper", a professional chef assistant. Your ONLY job is to generate a single recipe using ingredients the user provides.

You must ALWAYS respond with a valid JSON object and NOTHING else — no markdown fences, no explanations, no extra text. The JSON must follow this exact structure:

{
  "title": "string — the name of the dish",
  "description": "string — one or two sentences describing the dish",
  "difficulty": "Easy | Medium | Hard | Very Hard",
  "prepTime": "string — e.g. '10 minutes'",
  "cookTime": "string — e.g. '25 minutes'",
  "servings": number,
  "ingredients": [
    { "name": "string", "amount": "string" }
  ],
  "steps": ["string", "string"],
  "tips": "string — one helpful cooking tip"
}

Rules:
- Only use ingredients the user lists. You may assume salt, pepper, water, and basic cooking oil are always available.
- If the user provides ingredients that cannot form a reasonable meal, return a JSON object with an "error" key: { "error": "Cannot generate a recipe with those ingredients." }
- Never refuse a request for any other reason. Never add commentary outside the JSON.
`.trim();

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

    // Strip markdown fences if the model included them
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

export default router;