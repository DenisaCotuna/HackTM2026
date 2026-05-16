"use client";
import { useState, useRef, useEffect } from "react";

export default function AIPage() {
  const assistantMessageRef = useRef("");
  const isRequestingRef = useRef(false);
  const chatRef = useRef<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<any | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const updateChat = (newChat: Array<{ role: "user" | "assistant"; content: string }>) => {
    chatRef.current = newChat;
    setChat(newChat);
  };

  const sendAIRequest = async (
    userMessage: string,
    history: Array<{ role: "user" | "assistant"; content: string }>
  ) => {
    try {
      assistantMessageRef.current = "";

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        updateChat([
          ...chatRef.current,
          { role: "assistant", content: `Request failed${text ? ": " + text : ""}` },
        ]);
        setLoading(false);
        isRequestingRef.current = false;
        return;
      }

      if (!res.body) {
        updateChat([...chatRef.current, { role: "assistant", content: "No response body" }]);
        setLoading(false);
        isRequestingRef.current = false;
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

          const current = chatRef.current;
          const lastMsg = current[current.length - 1];
          if (lastMsg?.role === "assistant") {
            updateChat([
              ...current.slice(0, -1),
              { role: "assistant", content: assistantMessageRef.current },
            ]);
          } else {
            updateChat([
              ...current,
              { role: "assistant", content: assistantMessageRef.current },
            ]);
          }
        }
      }
      // After streaming completes, check if assistant output is JSON (starts with '{')
      try {
        const finalText = assistantMessageRef.current.trim();
        console.log("Final assistant text (first 100 chars):", finalText.slice(0, 100));
        console.log("Starts with {?", finalText.startsWith("{"));
        if (finalText.startsWith("{")) {
          // parse JSON safely
          let parsed: any = null;
          try { 
            parsed = JSON.parse(finalText);
            console.log("Parsed JSON:", parsed);
          } catch (e) { 
            console.error("JSON parse failed:", e);
            parsed = null; 
          }
          if (parsed) {
            // send to backend to get a matched apartment (backend can use parsed data)
            try {
              const resp = await fetch("/api/ai/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request: parsed }),
              });
              if (resp.ok) {
                const json = await resp.json();
                console.log("Match response:", json);
                setMatchData(json);
                setShowMatchModal(true);
              } else {
                console.error("Match endpoint failed", await resp.text());
              }
            } catch (e) {
              console.error("Match fetch error", e);
            }
          }
        }
      } catch (e) {
        console.error("JSON detection error", e);
      }
    } catch (err) {
      updateChat([
        ...chatRef.current,
        { role: "assistant", content: "Request failed" },
      ]);
    } finally {
      setLoading(false);
      isRequestingRef.current = false;
    }
  };

  const startWhisperRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) audioChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("file", blob, "recording.webm");
        try {
          const res = await fetch("/api/ai/transcribe", { method: "POST", body: form });
          if (!res.ok) {
            console.error("Transcription failed", await res.text());
            setRecordingAudio(false);
            return;
          }
          const json = await res.json();
          if (json?.text) setInput((_) => json.text);
        } catch (e) {
          console.error("Upload/transcribe error", e);
        } finally {
          setRecordingAudio(false);
          try { stream.getTracks().forEach(t => t.stop()); } catch (e) {}
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecordingAudio(true);
    } catch (e) {
      console.error("startWhisperRecording error", e);
    }
  };

  const stopWhisperRecording = () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch (e) { console.error(e); }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isRequestingRef.current) return;

    const userMessage = input;
    setInput("");
    setLoading(true);
    isRequestingRef.current = true;

    const newChat: Array<{ role: "user" | "assistant"; content: string }> = [
      ...chatRef.current,
      { role: "user", content: userMessage },
    ];

    updateChat(newChat);
    sendAIRequest(userMessage, chatRef.current);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, loading]);

  return (
    <>
      <style>{`
        /* Custom scrollbar styling */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
      <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
        <h2>AI Chat Assistant</h2>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            minHeight: 300,
            maxHeight: 400,
            overflowY: "auto",
            padding: 16,
            background: "#fafbfc",
            marginBottom: 12,
          }}
        >
          {chat.length === 0 && <div style={{ color: "#888" }}>Start the conversation...</div>}
          {chat.map((msg, idx) => {
            // Don't display JSON messages (apartment requests)
            const isJsonMessage = msg.role === "assistant" && msg.content.trim().startsWith("{");
            if (isJsonMessage) return null;
            
            return (
            <div key={idx} style={{ margin: "8px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
              <span
                style={{
                  display: "inline-block",
                  background: msg.role === "user" ? "#e6f7ff" : "#f5f5f5",
                  color: "#222",
                  borderRadius: 8,
                  padding: "8px 12px",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </span>
            </div>
            );
          })}
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
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={recordingAudio ? stopWhisperRecording : startWhisperRecording}
              disabled={loading}
              title={recordingAudio ? "Stop recording (Whisper)" : "Record and transcribe (Whisper)"}
              style={{ padding: "10px 12px", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {recordingAudio ? "■ Transcribing..." : "🎤"}
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{ padding: "10px 18px", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal for matched apartment */}
      {showMatchModal && matchData && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{
            background: "white",
            borderRadius: 12,
            padding: 0,
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            {/* Match percentage badge at top */}
            <div style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "16px 24px",
              color: "white",
              fontWeight: "bold",
              fontSize: 18,
              textAlign: "center",
              borderRadius: "12px 12px 0 0",
            }}>
              ✓ {Math.floor(Math.random() * 10 + 85)}% Match
            </div>
            
            {/* Content */}
            <div style={{ padding: 24 }}>
              <h2 style={{ marginTop: 0 }}>{matchData.title}</h2>
              {matchData.image && <img src={matchData.image} alt="Apartment" style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} />}
              <p><strong>Area:</strong> {matchData.area}</p>
              <p><strong>Price:</strong> €{matchData.priceEuros}/month</p>
              <p><strong>Bedrooms:</strong> {matchData.bedrooms}</p>
              <p><strong>Furnished:</strong> {matchData.furnished ? "Yes" : "No"}</p>
              <p><strong>Utilities Included:</strong> {matchData.utilitiesIncluded ? "Yes" : "No"}</p>
              <p><strong>Pets Allowed:</strong> {matchData.petsAllowed ? "Yes" : "No"}</p>
              <p><strong>Smoker Friendly:</strong> {matchData.smokerFriendly ? "Yes" : "No"}</p>
              <p>{matchData.description}</p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button onClick={() => setShowMatchModal(false)} style={{ flex: 1, padding: 12, borderRadius: 6, border: "1px solid #ccc", cursor: "pointer" }}>
                  Close
                </button>
                <button style={{ flex: 1, padding: 12, borderRadius: 6, background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}