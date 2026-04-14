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

This downloads the project onto your computer. Open a terminal, navigate to wherever you want the project to live, and run:

```bash
git clone https://github.com/jeffjsy/FoodPrepper.git
cd FoodPrepper
```

---

### Step 2 — Add your API key

The app needs your Groq API key to work, but for security reasons it's not included in the repository. You need to create a file called `.env` in the `server/` folder to store it.

In your terminal, run:

```bash
cd server
cp .env.example .env
```

This creates a new file called `.env` by copying the example template. Now open `server/.env` in any text editor and replace the placeholder with your real Groq API key:

```
GROQ_API_KEY=paste_your_groq_key_here
PORT=5000
```

Save the file, then navigate back to the root folder:

```bash
cd ..
```

> ⚠️ Never share or commit your `.env` file. It contains your private API key. It is already listed in `.gitignore` so git will ignore it automatically.

---

### Step 3 — Install dependencies

```bash
npm run install:all
```
---

### Step 4 — Run the app

From the root folder, run:

```bash
npm run dev
```

This starts both the backend server and the React frontend at the same time in one terminal window. Once it's ready, open your browser and go to:

```
http://localhost:3000
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |

> If the page doesn't load, make sure both services started without errors in the terminal.

---

## Usage

1. Type a comma-separated list of ingredients you have available (e.g. `chicken breast, garlic, lemon, spinach`)
2. Select the number of servings and any dietary restrictions from the dropdowns
3. Click **Generate Recipe**

---

## System Prompt

The following system prompt is injected, it constrains the LLM to behave strictly as a recipe generator and always return a consistent JSON structure:

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
