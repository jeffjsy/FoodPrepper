# 🍳 Pantry-to-Plate

A full-stack LLM wrapper web application built with React and Node.js for COMP-308 Assignment 4.

## Purpose

Pantry-to-Plate lets you type in the ingredients you already have at home and instantly generates a complete, structured recipe — including prep time, cook time, step-by-step instructions, and a chef's tip. The app uses a strict backend system prompt to ensure the LLM always responds with consistent, well-formatted recipe data.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Groq API key](https://console.groq.com) (free tier)

---

## Setup Instructions

### Step 1 — Clone the repository

```bash
git clone https://github.com/jeffjsy/FoodPrepper.git
cd FoodPrepper
```

### Step 2 — Create your .env file

Navigate into the server folder and create a `.env` file from the example template:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and replace the placeholder with your API key:

```
GROQ_API_KEY=your_real_groq_api_key_here
PORT=5000
```

Then return to the root:

```bash
cd ..
```

### Step 3 — Install all dependencies

From the root folder, run:

```bash
npm run install:all
```

This installs dependencies for both the server and client in one command.

### Step 4 — Run the app

From the root folder, run:

```bash
npm run dev
```

This launches both the Express backend and the React frontend concurrently in the same terminal window.

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |

---

## Usage

1. Type a comma-separated list of ingredients you have available (e.g. `chicken breast, garlic, lemon, spinach`)
2. Select the number of servings and any dietary restrictions from the dropdowns
3. Click **Generate Recipe**
4. The app calls your Express backend, which securely contacts the Groq API and returns a structured recipe

---

## System Prompt

The following system prompt is injected on the backend in `server/routes/generate.js`. The user never sees or controls this prompt — it constrains the LLM to behave strictly as a recipe generator and always return a consistent JSON structure:

```
You are "Pantry-to-Plate", a professional chef assistant. Your ONLY job is to generate
a single recipe using ingredients the user provides.

You must ALWAYS respond with a valid JSON object and NOTHING else — no markdown fences,
no explanations, no extra text. The JSON must follow this exact structure:

{
  "title": "string — the name of the dish",
  "description": "string — one or two sentences describing the dish",
  "difficulty": "Easy | Medium | Hard",
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
- Only use ingredients the user lists. You may assume salt, pepper, water, and basic
  cooking oil are always available.
- If the user provides ingredients that cannot form a reasonable meal, return a JSON
  object with an "error" key: { "error": "Cannot generate a recipe with those ingredients." }
- Never refuse a request for any other reason. Never add commentary outside the JSON.
```

---

## Security Notes

- The Groq API key is stored exclusively in `server/.env` and never sent to the frontend
- `.env` is listed in `.gitignore` and will never be committed to version control
- All LLM calls are made server-side through the Express `/api/generate` endpoint

---

## Tech Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Frontend | React 18, CSS                            |
| Backend  | Node.js, Express 4                       |
| AI       | Groq API (llama-3.3-70b-versatile)       |
| Fonts    | Playfair Display, DM Sans (Google Fonts) |

---

*COMP-308 Emerging Technologies — Assignment 4*
