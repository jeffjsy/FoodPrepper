// client/src/App.js
// Root component — holds all application state and orchestrates child components

import React, { useState } from "react";
import InputForm from "./components/InputForm";
import RecipeCard from "./components/RecipeCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stores the full conversation history for the follow-up chat
  // Each entry is { role: "user" | "assistant", content: "string" }
  const [chatHistory, setChatHistory] = useState([]);

  // Called by InputForm when the user submits ingredients
  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    setChatHistory([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setRecipe(data);

        // Seed the chat history with a summary of the generated recipe
        // so the LLM has context for any follow-up questions
        setChatHistory([
          {
            role: "assistant",
            content: `I've generated a recipe for ${data.title}. Feel free to ask me anything about it — substitutions, steps, side dishes, or anything else!`,
          },
        ]);
      }
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Called by ChatBox when the user sends a follow-up message
  const handleChat = async (userMessage) => {
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: userMessage },
    ];

    // Optimistically update the chat history with the user's message
    setChatHistory(updatedHistory);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: `Sorry, something went wrong: ${data.error}` },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Could not reach the server." },
      ]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-icon">🍳</div>
        <h1 className="app-title">Pantry-to-Plate</h1>
        <p className="app-subtitle">
          Tell us what's in your fridge. We'll tell you what to make.
        </p>
      </header>

      <main className="app-main">
        <InputForm onSubmit={handleGenerate} loading={loading} />

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {recipe && !loading && (
          <>
            <RecipeCard recipe={recipe} />
            <ChatBox
              history={chatHistory}
              onSend={handleChat}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>COMP-308 Assignment 4 · Pantry-to-Plate</p>
      </footer>
    </div>
  );
}

export default App;