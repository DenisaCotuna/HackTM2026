"use client";

import { useState } from "react";

export default function AIPage() {
  const [message, setMessage] = useState(
    "Suggest me a cheap apartment in Timisoara"
  );
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      setReply("");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReply(data.error || "Something went wrong");
        return;
      }

      setReply(data.reply);
    } catch (err) {
      setReply("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>AI Assistant</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 15px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      <div
        style={{
          marginTop: 20,
          padding: 15,
          border: "1px solid #ddd",
          minHeight: 100,
          whiteSpace: "pre-wrap",
        }}
      >
        {reply || "AI response will appear here..."}
      </div>
    </div>
  );
}