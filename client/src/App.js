// client/src/App.js
// Root component — holds all application state and orchestrates child components

import React, { useState } from "react";
import InputForm from "./components/InputForm";
import RecipeCard from "./components/RecipeCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import "./App.css";

function App() {
  // The recipe object returned from the backend (null when none fetched yet)
  const [recipe, setRecipe] = useState(null);

  // True while waiting for the API response
  const [loading, setLoading] = useState(false);

  // Holds any error string to display to the user
  const [error, setError] = useState(null);

  // Called by InputForm when the user submits the form
  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        // Show a friendly error message
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setRecipe(data);
      }
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-icon">🍳</div>
        <h1 className="app-title">Food Prepper</h1>
        <p className="app-subtitle">
          Tell us what's in your fridge. We'll tell you what to make.
        </p>
      </header>

      {/* ── Main Content ── */}
      <main className="app-main">
        {/* Input form is always visible */}
        <InputForm onSubmit={handleGenerate} loading={loading} />

        {/* Conditional rendering based on state */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {recipe && !loading && <RecipeCard recipe={recipe} />}
      </main>

      <footer className="app-footer">
        <p>COMP-308 Assignment 4 · Food Prepper</p>
      </footer>
    </div>
  );
}

export default App;
