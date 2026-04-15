// client/src/components/ChatBox.js
// Renders the follow-up conversation area below the generated recipe

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

function ChatBox({ history, onSend }) {
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);

  // Used to auto-scroll to the latest message
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || waiting) return;

    const message = input.trim();
    setInput("");
    setWaiting(true);

    await onSend(message);

    setWaiting(false);
  };

  return (
    <section className="chatbox">
      <h3 className="chatbox__title">💬 Ask the Chef</h3>
      <p className="chatbox__subtitle">
        Have a question about this recipe? Ask about substitutions, steps, side dishes, or anything else.
      </p>

      {/* ── Message history ── */}
      <div className="chatbox__messages">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message chat-message--${msg.role}`}
          >
            <span className="chat-message__label">
              {msg.role === "user" ? "You" : "Chef"}
            </span>
            <div className="chat-message__content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {waiting && (
          <div className="chat-message chat-message--assistant">
            <span className="chat-message__label">Chef</span>
            <div className="chat-message__content chat-message--thinking">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <form className="chatbox__form" onSubmit={handleSubmit}>
        <input
          className="chatbox__input"
          type="text"
          placeholder="e.g. Can I substitute the chicken for tofu?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={waiting}
        />
        <button
          className="chatbox__send"
          type="submit"
          disabled={waiting || input.trim() === ""}
        >
          Send
        </button>
      </form>
    </section>
  );
}

export default ChatBox;