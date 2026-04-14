// client/src/components/LoadingSpinner.js
// Shown while the backend is waiting for the LLM response

import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="spinner-text">Chef is thinking...</p>
    </div>
  );
}

export default LoadingSpinner;
