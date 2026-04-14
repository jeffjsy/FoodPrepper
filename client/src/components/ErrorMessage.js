// client/src/components/ErrorMessage.js
// Displays an error message when something goes wrong

import React from "react";
import "./ErrorMessage.css";

function ErrorMessage({ message }) {
  return (
    <div className="error-box" role="alert">
      <span className="error-icon">⚠️</span>
      <p className="error-text">{message}</p>
    </div>
  );
}

export default ErrorMessage;
