"use client";

import { useState } from "react";
import { Bot, Send, Lightbulb, TrendingUp, Users } from "lucide-react";

interface AIInsightPanelProps {
  userName?: string;
  suggestedPrompts?: string[];
}

const DEFAULT_PROMPTS = [
  "Review Ide Saya",
  "Improve Listing",
  "Siapa investor yang cocok?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "Review Ide Saya":
    "Berdasarkan profil Anda, ide bisnis Anda memiliki potensi besar di sektor EdTech Indonesia. Beberapa rekomendasi: (1) Perkuat proposisi nilai unik dibanding platform serupa, (2) Tambahkan data traksi awal untuk menarik investor, (3) Pertimbangkan model B2B2C untuk akses pasar yang lebih cepat.",
  "Improve Listing":
    "Listing Anda sudah baik! Untuk meningkatkan daya tarik: (1) Tambahkan foto tim dan product demo, (2) Sertakan metrik traksi terkini, (3) Perjelas penggunaan dana yang diminta, (4) Tambahkan testimoni pengguna awal.",
  "Siapa investor yang cocok?":
    "Berdasarkan profil bisnis Anda di sektor EdTech tahap Seed, saya merekomendasikan: Budi Santoso (Nusantara Capital) - 92% kecocokan, memiliki rekam jejak investasi EdTech yang kuat. East Ventures - aktif di tahap early-stage Indonesia.",
};

export function AIInsightPanel({
  userName = "Founder",
  suggestedPrompts = DEFAULT_PROMPTS,
}: AIInsightPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  function handlePrompt(prompt: string) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
    ]);
    setIsLoading(true);
    setTimeout(() => {
      const response =
        MOCK_RESPONSES[prompt] ??
        "Terima kasih atas pertanyaan Anda. Saya sedang menganalisis informasi bisnis Anda untuk memberikan rekomendasi yang tepat. Silakan lengkapi profil Anda terlebih dahulu untuk hasil yang lebih akurat.";
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
      setIsLoading(false);
    }, 1200);
  }

  function handleSend() {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    handlePrompt(msg);
  }

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "#eff6ff",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={18} color="#2563eb" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
            Weaven AI – Partner Berpikir
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Saya asisten AI Anda
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 120,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {messages.length === 0 && (
          <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", margin: "auto 0" }}>
            Apa yang ingin kita kerjakan hari ini untuk memajukan startup Anda?
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "8px 12px",
                borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
                color: msg.role === "user" ? "#fff" : "#111827",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "12px 12px 12px 2px",
                background: "#f3f4f6",
                fontSize: 13,
                color: "#9ca3af",
              }}
            >
              ●●●
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      {messages.length === 0 && (
        <div
          style={{
            padding: "0 20px 12px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Review Ide Saya", icon: <Lightbulb size={13} /> },
            { label: "Improve Listing", icon: <TrendingUp size={13} /> },
            { label: "Siapa investor yang cocok?", icon: <Users size={13} /> },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => handlePrompt(p.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                color: "#374151",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background 0.15s ease",
              }}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tanya sesuatu atau pilih prompt di atas..."
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 13,
            color: "#111827",
            background: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: input.trim() ? "#2563eb" : "#e5e7eb",
            border: "none",
            cursor: input.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s ease",
            flexShrink: 0,
          }}
          aria-label="Kirim pesan"
        >
          <Send size={15} color={input.trim() ? "#fff" : "#9ca3af"} />
        </button>
      </div>
    </div>
  );
}
