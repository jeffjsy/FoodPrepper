// client/src/components/RecipeCard.js
// Displays the structured recipe returned from the backend

import React from "react";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {
  // Difficulty badge colour
  const difficultyClass = {
    Easy: "badge--easy",
    Medium: "badge--medium",
    Hard: "badge--hard",
  }[recipe.difficulty] || "badge--easy";

  return (
    <article className="recipe-card">
      {/* ── Title & Description ── */}
      <div className="recipe-card__header">
        <h2 className="recipe-card__title">{recipe.title}</h2>
        <p className="recipe-card__description">{recipe.description}</p>
      </div>

      {/* ── Meta row: time, servings, difficulty ── */}
      <div className="recipe-card__meta">
        <div className="meta-item">
          <span className="meta-icon">⏱</span>
          <span className="meta-label">Prep</span>
          <span className="meta-value">{recipe.prepTime}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🔥</span>
          <span className="meta-label">Cook</span>
          <span className="meta-value">{recipe.cookTime}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🍽️</span>
          <span className="meta-label">Serves</span>
          <span className="meta-value">{recipe.servings}</span>
        </div>
        <div className="meta-item">
          <span className={`badge ${difficultyClass}`}>{recipe.difficulty}</span>
        </div>
      </div>

      <div className="recipe-card__body">
        {/* ── Ingredients ── */}
        <section className="recipe-section">
          <h3 className="recipe-section__title">Ingredients</h3>
          <ul className="ingredients-list">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="ingredient-item">
                <span className="ingredient-amount">{item.amount}</span>
                <span className="ingredient-name">{item.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Steps ── */}
        <section className="recipe-section">
          <h3 className="recipe-section__title">Instructions</h3>
          <ol className="steps-list">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="step-item">
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* ── Chef's tip ── */}
      {recipe.tips && (
        <div className="recipe-card__tip">
          <span className="tip-icon">💡</span>
          <p>{recipe.tips}</p>
        </div>
      )}
    </article>
  );
}

export default RecipeCard;
