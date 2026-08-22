"use client";

import { useState } from "react";
import { Send, Search } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

interface Conversation {
  id: string;
  participant: { name: string; initials: string; title: string; color: string };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  content: string;
  role: "me" | "them";
  timestamp: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participant: { name: "Budi Santoso", initials: "BS", title: "Managing Partner", color: "#16a34a" },
    lastMessage: "Senang bisa terhubung! Saya tertarik dengan EDUKITA...",
    lastMessageTime: "10:30",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "c2",
    participant: { name: "Siti Rahmawati", initials: "SR", title: "Co-Founder Candidate", color: "#7c3aed" },
    lastMessage: "Apakah kita bisa jadwalkan call minggu ini?",
    lastMessageTime: "Kemarin",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "c3",
    participant: { name: "Andi Wijaya", initials: "AW", title: "Syndicate Lead", color: "#dc2626" },
    lastMessage: "Terima kasih atas pitch deck-nya. Sangat impressive!",
    lastMessageTime: "Senin",
    unreadCount: 0,
    isOnline: true,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", content: "Halo! Saya melihat listing EDUKITA di VentureBridge dan sangat tertarik.", role: "them", timestamp: "10:15" },
    { id: "m2", content: "Halo Pak Budi! Terima kasih sudah melihat listing kami. Senang mendengar Anda tertarik!", role: "me", timestamp: "10:18" },
    { id: "m3", content: "Model bisnis Anda menarik. Apakah kita bisa menjadwalkan call untuk diskusi lebih lanjut?", role: "them", timestamp: "10:25" },
    { id: "m4", content: "Tentu! Saya tersedia Rabu atau Kamis minggu ini. Jam berapa yang paling cocok untuk Anda?", role: "me", timestamp: "10:27" },
    { id: "m5", content: "Rabu jam 14.00 WIB bagaimana? Saya akan kirimkan link Google Meet.", role: "them", timestamp: "10:30" },
    { id: "m6", content: "Apakah Anda bisa mempersiapkan pitch deck dan proyeksi finansial untuk meeting kita?", role: "them", timestamp: "10:30" },
  ],
  c2: [
    { id: "m1", content: "Hi! Saya tertarik untuk bergabung sebagai Co-Founder untuk EDUKITA.", role: "them", timestamp: "Kemarin 14:20" },
    { id: "m2", content: "Halo Siti! Background Anda di product management sangat relevan. Apakah kita bisa terhubung?", role: "me", timestamp: "Kemarin 16:30" },
    { id: "m3", content: "Tentu! Apakah kita bisa jadwalkan call minggu ini?", role: "them", timestamp: "Kemarin 17:00" },
  ],
  c3: [
    { id: "m1", content: "Halo! Saya mendapat akses ke pitch deck EDUKITA. Sangat impressive progress-nya!", role: "them", timestamp: "Senin 09:00" },
    { id: "m2", content: "Terima kasih Pak Andi! Kami senang mendengar itu.", role: "me", timestamp: "Senin 10:30" },
    { id: "m3", content: "Terima kasih atas pitch deck-nya. Sangat impressive!", role: "them", timestamp: "Senin 11:00" },
  ],
};

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function handleSend() {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      content: newMessage.trim(),
      role: "me",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] ?? []), msg],
    }));
    setNewMessage("");
  }

  const currentMessages = messages[activeConv.id] ?? [];
  const filteredConvs = CONVERSATIONS.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main
        className="dashboard-content"
        style={{ padding: 0, display: "flex", height: "100vh", overflow: "hidden" }}
      >
        {/* Conversation List */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #e5e7eb",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #e5e7eb" }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
              Pesan
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "#f8f9fa",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              <Search size={14} color="#9ca3af" />
              <input
                type="text"
                placeholder="Cari percakapan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  fontSize: 13,
                  outline: "none",
                  color: "#111827",
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  width: "100%",
                  textAlign: "left",
                  background: activeConv.id === conv.id ? "#eff6ff" : "transparent",
                  border: "none",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
              >
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: conv.participant.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {conv.participant.initials}
                  </div>
                  {conv.isOnline && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#16a34a",
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                      {conv.participant.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{conv.lastMessageTime}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: 2,
                    }}
                  >
                    {conv.lastMessage}
                  </div>
                </div>

                {conv.unreadCount > 0 && (
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#2563eb",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#f8f9fa",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "16px 24px",
              background: "#fff",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: activeConv.participant.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {activeConv.participant.initials}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                {activeConv.participant.name}
              </div>
              <div style={{ fontSize: 12, color: activeConv.isOnline ? "#16a34a" : "#9ca3af" }}>
                {activeConv.isOnline ? "● Online" : "Offline"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "me" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "me" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: msg.role === "me" ? "#2563eb" : "#fff",
                    color: msg.role === "me" ? "#fff" : "#111827",
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                >
                  {msg.content}
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.7,
                      marginTop: 4,
                      textAlign: "right",
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "16px 24px",
              background: "#fff",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ketik pesan..."
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                fontSize: 14,
                color: "#111827",
                background: "#f8f9fa",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.background = "#fff";
                e.target.style.borderColor = "#2563eb";
              }}
              onBlur={(e) => {
                e.target.style.background = "#f8f9fa";
                e.target.style.borderColor = "#e5e7eb";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: newMessage.trim() ? "#2563eb" : "#e5e7eb",
                border: "none",
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s ease",
                flexShrink: 0,
              }}
            >
              <Send size={16} color={newMessage.trim() ? "#fff" : "#9ca3af"} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
