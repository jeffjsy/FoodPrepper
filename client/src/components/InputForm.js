// client/src/components/InputForm.js
// Renders the ingredient input form with servings and dietary dropdowns

import React, { useState } from "react";
import "./InputForm.css";

// Dietary restriction options shown in the dropdown
const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
];

function InputForm({ onSubmit, loading }) {
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState(1);
  const [dietary, setDietary] = useState("None");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the form data up to App.js
    onSubmit({ ingredients, servings, dietary });
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      {/* ── Ingredients textarea ── */}
      <div className="form-group">
        <label htmlFor="ingredients" className="form-label">
          What's in your pantry?
        </label>
        <textarea
          id="ingredients"
          className="form-textarea"
          placeholder="e.g. chicken breast, garlic, lemon, spinach, olive oil..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={4}
          required
        />
        <span className="form-hint">
          Separate ingredients with commas. Salt, pepper, and water are always assumed available.
        </span>
      </div>

      {/* ── Servings + Dietary row ── */}
      <div className="form-row">
        <div className="form-group form-group--half">
          <label htmlFor="servings" className="form-label">
            Servings
          </label>
          <select
            id="servings"
            className="form-select"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group--half">
          <label htmlFor="dietary" className="form-label">
            Dietary Restrictions
          </label>
          <select
            id="dietary"
            className="form-select"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
          >
            {DIETARY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Submit button ── */}
      <button
        type="submit"
        className="submit-btn"
        disabled={loading || ingredients.trim() === ""}
      >
        {loading ? "Generating..." : "Generate Recipe 🍽️"}
      </button>
    </form>
  );
}

export default InputForm;
