"use client";
import { useState, useRef, useEffect } from "react";

export default function AIPage() {
  const assistantMessageRef = useRef("");
  const isRequestingRef = useRef(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendAIRequest = async (
    userMessage: string, history: Array<{ role: "user" | "assistant"; content: string }>
  ) => {
    try {
      assistantMessageRef.current = "";
      // Extract compact fields from chat history (look for lines like "title: ...")
      const extractFieldsFromHistory = (msgs: Array<{ role: string; content: string }>) => {
        const fields: any = {};
        const combined = msgs.map(m => m.content).join("\n");
        const getMatch = (key: string) => {
          const re = new RegExp(`${key}\\s*:\\s*(.*)`, "i");
          const m = combined.match(re);
          return m ? m[1].trim() : undefined;
        };

        const title = getMatch("title");
        if (title) fields.title = title;

        const pref = getMatch("preferred areas|preferred area|preferred locations|areas");
        if (pref) {
          fields.preferredAreas = pref.split(/,|;|\n/).map((s: string) => s.trim()).filter(Boolean);
        }

        const min = getMatch("minimum budget|min budget|min");
        if (min) fields.minBudget = Number(min.replace(/[^0-9.-]/g, "")) || undefined;
        const max = getMatch("maximum budget|max budget|max");
        if (max) fields.maxBudget = Number(max.replace(/[^0-9.-]/g, "")) || undefined;

        const movingIn = getMatch("moving in|move in|moving-in");
        if (movingIn) fields.movingIn = movingIn;
        const movingOut = getMatch("moving out|move out|moving-out");
        if (movingOut) fields.movingOut = movingOut;

        const boolParse = (val?: string) => {
          if (!val) return undefined;
          const v = val.toLowerCase();
          if (/(yes|y|true|1)/.test(v)) return true;
          if (/(no|n|false|0)/.test(v)) return false;
          return undefined;
        };

        const furnished = getMatch("furnished");
        if (furnished) fields.furnished = boolParse(furnished);
        const utilities = getMatch("utilities included|utilities");
        if (utilities) fields.utilitiesIncluded = boolParse(utilities);
        const roommates = getMatch("roommates preferred|roommates");
        if (roommates) fields.roommatesPreferred = boolParse(roommates);
        const pets = getMatch("pets allowed|pets");
        if (pets) fields.petsAllowed = boolParse(pets);
        const smoker = getMatch("smoker friendly|smoker");
        if (smoker) fields.smokerFriendly = boolParse(smoker);

        const notes = getMatch("additional notes|notes|notes:");
        if (notes) fields.additionalNotes = notes;

        return fields;
      };


      const compact = extractFieldsFromHistory(history);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, ...compact }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setChat((prev) => {
          // avoid duplicate error messages
          if (prev.length && prev[prev.length - 1].role === "assistant" && prev[prev.length - 1].content.includes("Request failed")) {
            return prev;
          }
          return [...prev, { role: "assistant", content: `Request failed${text ? ": " + text : ""}` }];
        });
        setLoading(false);
        isRequestingRef.current = false;
        return;
      }

      if (!res.body) {
        setChat((prev) => [...prev, { role: "assistant", content: "No response body" }]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          assistantMessageRef.current += chunk;
          setChat((prev) => {
            if (prev.length && prev[prev.length - 1].role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { role: "assistant", content: assistantMessageRef.current },
              ];
            } else {
              return [...prev, { role: "assistant", content: assistantMessageRef.current }];
            }
          });
        }
      }
    } catch (err) {
      setChat((prev) => {
        if (prev.length && prev[prev.length - 1].role === "assistant" && prev[prev.length - 1].content.includes("Request failed")) {
          return prev;
        }
        return [...prev, { role: "assistant", content: "Request failed" }];
      });
    } finally {
      setLoading(false);
      isRequestingRef.current = false;
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setLoading(true);

    setChat((prevChat) => {
      const newChat = [...prevChat, { role: "user" as const, content: userMessage }];
      if (!isRequestingRef.current) {
        isRequestingRef.current = true;
        sendAIRequest(userMessage, newChat);
      }
      return newChat;
    });
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, loading]);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>AI Chat Assistant</h2>
      <div style={{
        border: "1px solid #ddd",
        borderRadius: 6,
        minHeight: 300,
        maxHeight: 400,
        overflowY: "auto",
        padding: 16,
        background: "#fafbfc",
        marginBottom: 12,
      }}>
        {chat.length === 0 && <div style={{ color: "#888" }}>Start the conversation...</div>}
        {chat.map((msg, idx) => (
          <div key={idx} style={{
            margin: "8px 0",
            textAlign: msg.role === "user" ? "right" : "left",
          }}>
            <span style={{
              display: "inline-block",
              background: msg.role === "user" ? "#e6f7ff" : "#f5f5f5",
              color: "#222",
              borderRadius: 8,
              padding: "8px 12px",
              maxWidth: "80%",
              wordBreak: "break-word",
            }}>
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{ padding: "10px 18px", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}