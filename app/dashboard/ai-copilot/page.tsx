"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, ChevronRight, RefreshCw, User } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

const QUICK_PROMPTS = [
  "Analisis listing EDUKITA saya",
  "Siapa investor terbaik untuk bisnis saya?",
  "Bagaimana cara meningkatkan skor readiness?",
  "Tren investasi EdTech Indonesia 2025",
  "Bantu tulis executive summary",
  "Apa yang perlu saya persiapkan untuk pitch?",
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "Halo! Saya adalah AI Copilot Weaven. Saya dirancang khusus untuk membantu Anda merajut potensi bisnis (Ide × Modal × Talent × Aset) di ekosistem Indonesia.\n\nSaya bisa membantu Anda:\n• Menganalisis potensi bisnis dan investor readiness\n• Menemukan investor & partner yang paling sesuai dengan profil bisnis Anda\n• Menyusun executive summary dan pitch deck outline\n• Memberikan insight tentang tren industri terkini\n• Mempersiapkan Anda untuk meeting dengan investor\n\nApa yang ingin Anda diskusikan hari ini?",
  "Analisis listing EDUKITA saya":
    "Berdasarkan analisis mendalam terhadap listing EDUKITA Anda:\n\n**🟢 Kekuatan Utama:**\n• Pertumbuhan pengguna 5.000+ dalam 3 bulan menunjukkan product-market fit yang kuat\n• Sektor EdTech Indonesia memiliki TAM > $4 miliar (proyeksi 2025)\n• Tim dengan domain expertise yang relevan\n\n**🟡 Area untuk Ditingkatkan:**\n• Lengkapi proyeksi finansial 3 tahun (skor readiness naik +12 poin)\n• Tambahkan unit economics yang lebih detail (CAC, LTV, payback period)\n• Dokumentasikan rencana ekspansi ke kota-kota tier-2\n\n**💡 Rekomendasi Segera:**\nFokus investor readiness pada 3 dokumen: financial model, pitch deck, dan referensi pelanggan (case study). Ini akan meningkatkan conversion rate permintaan akses sebesar 3x.",
  "Siapa investor terbaik untuk bisnis saya?":
    "Berdasarkan profil EDUKITA (EdTech, Seed, Yogyakarta), berikut 3 investor dengan kecocokan tertinggi:\n\n**1. Budi Santoso — Nusantara Capital (94% match)**\n• Spesialisasi: EdTech & AgriTech\n• Range investasi: Rp100-500 juta\n• Track record: 3 exit sukses di SEA EdTech\n• Next step: Kirim pitch deck minggu ini\n\n**2. Andi Wijaya — East Ventures (88% match)**\n• Spesialisasi: Marketplace & SaaS\n• Range investasi: Rp250 juta - Rp2 miliar\n• Catatan: Preferensi traction >10K MAU\n\n**3. Dewi Lestari — Mandiri Capital (82% match)**\n• Spesialisasi: Impact tech & EdTech\n• Range investasi: Rp100-750 juta\n• Keuntungan: Koneksi ke jaringan sekolah negeri nasional",
  "Bagaimana cara meningkatkan skor readiness?":
    "Investor Readiness Score Anda saat ini: **78/100**\n\nBerikut roadmap mencapai skor 90+:\n\n**Quick Wins (1-2 minggu):**\n□ Upload proyeksi finansial Q3 (+8 poin)\n□ Tambahkan 2-3 referensi pelanggan (+5 poin)\n□ Lengkapi profil tim dengan LinkedIn verified (+3 poin)\n\n**Medium Term (1 bulan):**\n□ Dapatkan letter of intent dari 1 institusi (+7 poin)\n□ Verifikasi bisnis tingkat lanjut (+4 poin)\n□ Dokumentasikan unit economics (+3 poin)\n\n**Estimasi hasil:** Skor 90+ akan meningkatkan investor interest sebesar 2.5x dan conversion rate 60%.\n\nMau saya bantu menyiapkan template untuk dokumen-dokumen tersebut?",
};

function getAIResponse(userMessage: string): string {
  const exactMatch = AI_RESPONSES[userMessage];
  if (exactMatch) return exactMatch;

  if (userMessage.toLowerCase().includes("investor")) {
    return AI_RESPONSES["Siapa investor terbaik untuk bisnis saya?"];
  }
  if (userMessage.toLowerCase().includes("readiness") || userMessage.toLowerCase().includes("skor")) {
    return AI_RESPONSES["Bagaimana cara meningkatkan skor readiness?"];
  }
  if (userMessage.toLowerCase().includes("edukita") || userMessage.toLowerCase().includes("listing")) {
    return AI_RESPONSES["Analisis listing EDUKITA saya"];
  }

  return "Terima kasih atas pertanyaan Anda! Berdasarkan data profil Anda di Weaven, saya sedang menganalisis...\n\nUntuk pertanyaan ini, saya merekomendasikan Anda untuk:\n1. Periksa bagian Investor Readiness Score di dashboard\n2. Lihat daftar Access Requests terbaru\n3. Review match score dengan investor potensial\n\nApakah ada aspek spesifik yang ingin Anda perdalam?";
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: AI_RESPONSES.default,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(content?: string) {
    const text = content ?? inputValue.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: `a${Date.now()}`,
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  }

  function handleReset() {
    setMessages([
      {
        id: "init-reset",
        role: "assistant",
        content: AI_RESPONSES.default,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main
        className="dashboard-content"
        style={{ display: "flex", flexDirection: "column", height: "100vh", padding: 0, overflow: "hidden" }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "#2563eb",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Weaven AI Copilot
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#16a34a",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 12, color: "#6b7280" }}>Online · Powered by Weaven AI</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 13,
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: msg.role === "assistant" ? "#2563eb" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {msg.role === "assistant" ? (
                  <Bot size={18} color="#fff" />
                ) : (
                  <User size={16} color="#fff" />
                )}
              </div>

              {/* Bubble */}
              <div
                style={{
                  maxWidth: "72%",
                  padding: "12px 16px",
                  borderRadius: msg.role === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  background: msg.role === "user" ? "#2563eb" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#111827",
                  fontSize: 14,
                  lineHeight: 1.65,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.content.split("**").map((part, i) =>
                  i % 2 === 0 ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <strong key={i}>{part}</strong>
                  )
                )}
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.6,
                    marginTop: 6,
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot size={18} color="#fff" />
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "16px 16px 16px 2px",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#9ca3af",
                      animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div
          style={{
            padding: "12px 24px 0",
            background: "#fff",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            gap: 8,
            overflowX: "auto",
          }}
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#f8f9fa",
                color: "#374151",
                fontSize: 12,
                fontWeight: 500,
                cursor: isTyping ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
                opacity: isTyping ? 0.5 : 1,
              }}
              onMouseEnter={(e) => !isTyping && ((e.currentTarget.style.background = "#eff6ff"), (e.currentTarget.style.borderColor = "#2563eb"), (e.currentTarget.style.color = "#2563eb"))}
              onMouseLeave={(e) => ((e.currentTarget.style.background = "#f8f9fa"), (e.currentTarget.style.borderColor = "#e5e7eb"), (e.currentTarget.style.color = "#374151"))}
            >
              <Sparkles size={12} color="#9ca3af" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px 24px 20px",
            background: "#fff",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              background: "#f8f9fa",
            }}
          >
            <Sparkles size={16} color="#2563eb" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
              placeholder="Tanya sesuatu kepada AI Copilot..."
              disabled={isTyping}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 14,
                color: "#111827",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: inputValue.trim() && !isTyping ? "#2563eb" : "#e5e7eb",
              border: "none",
              cursor: inputValue.trim() && !isTyping ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease",
              flexShrink: 0,
            }}
          >
            <Send size={18} color={inputValue.trim() && !isTyping ? "#fff" : "#9ca3af"} />
          </button>
        </div>

        <style>{`
          @keyframes typing-dot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </main>
    </div>
  );
}
