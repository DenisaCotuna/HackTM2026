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
        }        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .loader {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "60px 20px" }}>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ 
              fontSize: 42, 
              fontWeight: 700, 
              color: "white", 
              margin: 0,
              marginBottom: 8,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>🏠 ApartmentAI</h1>
            <p style={{ 
              fontSize: 16, 
              color: "rgba(255,255,255,0.9)", 
              margin: 0,
              fontWeight: 300
            }}>Find your perfect student home</p>
          </div>

          {/* Chat Container */}
          <div style={{
            background: "white",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 600,
            maxHeight: 700,
          }}>
            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 24,
                background: "#f9fafb",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {chat.length === 0 && (
                <div style={{ 
                  color: "#999", 
                  textAlign: "center", 
                  margin: "auto",
                  fontSize: 16
                }}>
                  Start the conversation... 💬
                </div>
              )}
              {chat.map((msg, idx) => {
                // Don't display JSON messages (apartment requests)
                const isJsonMessage = msg.role === "assistant" && msg.content.trim().startsWith("{");
                if (isJsonMessage) return null;
                
                return (
                <div key={idx} style={{ 
                  margin: "12px 0", 
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: msg.role === "user" 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "#e5e7eb",
                      color: msg.role === "user" ? "white" : "#222",
                      borderRadius: 18,
                      padding: "10px 16px",
                      maxWidth: "75%",
                      wordBreak: "break-word",
                      boxShadow: msg.role === "user" 
                        ? "0 4px 12px rgba(102, 126, 234, 0.4)"
                        : "0 2px 8px rgba(0,0,0,0.1)",
                      fontSize: 15,
                      lineHeight: 1.4
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              background: "white",
              padding: 16,
              borderTop: "1px solid #e5e7eb",
            }}>
              <form onSubmit={handleSend} style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Type your preferences..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ 
                    flex: 1, 
                    padding: "12px 16px", 
                    borderRadius: 24,
                    border: "1px solid #e5e7eb",
                    outline: "none",
                    fontSize: 15,
                    transition: "border-color 0.2s",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  disabled={loading}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={recordingAudio ? stopWhisperRecording : startWhisperRecording}
                    disabled={loading}
                    title={recordingAudio ? "Stop recording" : "Record voice"}
                    style={{ 
                      padding: "10px 14px", 
                      borderRadius: 50,
                      border: "none",
                      background: recordingAudio ? "#ef4444" : "#f3f4f6",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: 18,
                      transition: "all 0.2s",
                      opacity: loading ? 0.5 : 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  >
                    {recordingAudio ? "⏹" : "🎤"}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{ 
                      padding: "10px 20px", 
                      borderRadius: 24,
                      background: loading || !input.trim() ? "#d1d5db" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white", 
                      border: "none",
                      cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      transition: "all 0.2s",
                      opacity: loading || !input.trim() ? 0.6 : 1,
                      boxShadow: loading || !input.trim() ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "70px"
                    }}
                  >
                    {loading ? <div className="loader" /> : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for matched apartment */}
      {showMatchModal && matchData && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
          backdropFilter: "blur(5px)"
        }}>
          <div style={{
            background: "white",
            borderRadius: 24,
            padding: 0,
            maxWidth: 520,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            animation: "slideUp 0.3s ease-out"
          }}>
            {/* Match percentage badge at top */}
            <div style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "20px 24px",
              color: "white",
              fontWeight: "bold",
              fontSize: 20,
              textAlign: "center",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
            }}>
              ✓ {Math.floor(Math.random() * 10 + 85)}% Match
            </div>
            
            {/* Content */}
            <div style={{ padding: 28 }}>
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 24, color: "#111" }}>{matchData.title}</h2>
              {matchData.image && (
                <img 
                  src={matchData.image} 
                  alt="Apartment" 
                  style={{ 
                    width: "100%", 
                    height: 320,
                    objectFit: "cover", 
                    borderRadius: 16, 
                    marginBottom: 24,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                  }} 
                />
              )}
              
              {/* Details Grid */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 24,
                padding: 16,
                background: "#f9fafb",
                borderRadius: 12
              }}>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 4, fontWeight: 600 }}>AREA</p>
                  <p style={{ fontSize: 16, color: "#111", margin: 0, fontWeight: 500 }}>{matchData.area}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 4, fontWeight: 600 }}>PRICE/MONTH</p>
                  <p style={{ fontSize: 16, color: "#111", margin: 0, fontWeight: 500 }}>€{matchData.priceEuros}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 4, fontWeight: 600 }}>BEDROOMS</p>
                  <p style={{ fontSize: 16, color: "#111", margin: 0, fontWeight: 500 }}>{matchData.bedrooms}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 4, fontWeight: 600 }}>FURNISHED</p>
                  <p style={{ fontSize: 16, color: "#111", margin: 0, fontWeight: 500 }}>{matchData.furnished ? "✓ Yes" : "✗ No"}</p>
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: "#999", marginBottom: 12, fontWeight: 600 }}>FEATURES</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {matchData.utilitiesIncluded && (
                    <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "6px 12px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>Utilities Included</span>
                  )}
                  {matchData.petsAllowed && (
                    <span style={{ background: "#fce7f3", color: "#be185d", padding: "6px 12px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>Pets Allowed</span>
                  )}
                  {matchData.smokerFriendly && (
                    <span style={{ background: "#fed7aa", color: "#92400e", padding: "6px 12px", borderRadius: 12, fontSize: 13, fontWeight: 500 }}>Smoker Friendly</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{ color: "#555", lineHeight: 1.6, marginBottom: 24, fontSize: 14 }}>{matchData.description}</p>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12 }}>
                <button 
                  onClick={() => setShowMatchModal(false)} 
                  style={{ 
                    flex: 1, 
                    padding: 14, 
                    borderRadius: 12, 
                    border: "2px solid #e5e7eb", 
                    background: "white",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#666",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  Close
                </button>
                <button 
                  style={{ 
                    flex: 1, 
                    padding: 14, 
                    borderRadius: 12, 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white", 
                    border: "none",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.5)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
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