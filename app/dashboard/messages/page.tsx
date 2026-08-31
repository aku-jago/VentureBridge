"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  Search,
  Plus,
  X,
  Check,
  CheckCheck,
  Sparkles,
  MessageSquare,
  Building2,
  Briefcase,
  Lock,
  Bot,
  FileText,
  UserPlus,
  ShieldCheck,
  Handshake,
  ArrowRight,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useChat, ChatThread, ChatMessage } from "@/contexts/ChatContext";
import { useAuth, AuthUser } from "@/contexts/AuthContext";

function MessagesContent() {
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get("to") || searchParams.get("userId") || searchParams.get("user");

  const { user, accounts } = useAuth();
  const {
    threads,
    typingUsers,
    setMyTypingStatus,
    sendMessage,
    getMessagesWithUser,
    markThreadAsRead,
    startOrOpenThread,
  } = useChat();

  const currentUserId = user?.id || (user?.role === "investor" ? "user-3" : "user-1");

  // Active selected thread (empty by default on initial page load)
  const [activeOtherUserId, setActiveOtherUserId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevMsgCountRef = useRef<number>(0);
  const isUserScrolledUpRef = useRef<boolean>(false);

  // If query parameter is explicitly provided, open or start that chat immediately
  useEffect(() => {
    if (targetUserIdParam && targetUserIdParam !== currentUserId) {
      const existingThread = threads.find((t) => t.id === targetUserIdParam);
      if (!existingThread) {
        const targetAcc = accounts.find((a) => a.id === targetUserIdParam);
        if (targetAcc) {
          startOrOpenThread(targetAcc);
        }
      }
      setActiveOtherUserId(targetUserIdParam);
      markThreadAsRead(targetUserIdParam);
    }
  }, [targetUserIdParam, currentUserId, threads, accounts, startOrOpenThread, markThreadAsRead]);

  const activeThread = threads.find((t) => t.id === activeOtherUserId) || null;
  const currentMessages = activeOtherUserId ? getMessagesWithUser(activeOtherUserId) : [];
  const isOtherTyping = Boolean(activeOtherUserId && typingUsers[activeOtherUserId]);

  // Handle user scroll detection
  function handleContainerScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isUserScrolledUpRef.current = distanceToBottom > 120;
  }

  // Scroll to bottom ONLY on thread switch or when new message arrives and user is NOT scrolled up
  useEffect(() => {
    if (!activeOtherUserId) return;

    const isNewMessage = currentMessages.length > prevMsgCountRef.current;
    const isThreadChanged = prevMsgCountRef.current === 0;

    if (isThreadChanged || !isUserScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: isThreadChanged ? "auto" : "smooth" });
    }

    prevMsgCountRef.current = currentMessages.length;
  }, [activeOtherUserId, currentMessages.length]);

  function handleSelectThread(threadId: string) {
    prevMsgCountRef.current = 0;
    isUserScrolledUpRef.current = false;
    setActiveOtherUserId(threadId);
    markThreadAsRead(threadId);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setNewMessage(val);

    // Broadcast genuine typing event only when user actually types
    if (activeThread) {
      setMyTypingStatus(activeThread.otherUser.id, true);

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      typingTimerRef.current = setTimeout(() => {
        setMyTypingStatus(activeThread.otherUser.id, false);
      }, 1800);
    }
  }

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    sendMessage(
      activeThread.otherUser.id,
      activeThread.otherUser.name,
      newMessage.trim()
    );
    setNewMessage("");
  }

  function handleSelectNewMember(acc: AuthUser) {
    const threadId = startOrOpenThread(acc);
    setActiveOtherUserId(threadId);
    markThreadAsRead(threadId);
    setShowNewChatModal(false);
    setMemberSearchQuery("");
  }

  const filteredThreads = threads.filter((t) => {
    if (activeFilter === "unread" && t.unreadCount === 0) return false;
    return (
      t.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.otherUser.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const availableMembers = (accounts || []).filter(
    (acc) =>
      acc.id !== currentUserId &&
      acc.email !== user?.email &&
      acc.name.toLowerCase() !== user?.name?.toLowerCase() &&
      (acc.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        (acc.title && acc.title.toLowerCase().includes(memberSearchQuery.toLowerCase())) ||
        (acc.role && acc.role.toLowerCase().includes(memberSearchQuery.toLowerCase())))
  );

  return (
    <div className={`dashboard-layout ${activeOtherUserId ? "in-active-chat" : ""}`}>
      <DashboardSidebar />

      <main
        className="dashboard-content messages-main-wrapper"
        style={{
          padding: 0,
          display: "flex",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
          background: "#f8fafc",
          position: "relative",
        }}
      >
        {/* Left Column: Conversation List */}
        <div
          className={`messages-left-pane ${activeOtherUserId ? "mobile-hidden" : "mobile-full"}`}
          style={{
            width: 360,
            borderRight: "1px solid #e2e8f0",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            height: "100%",
          }}
        >
          {/* Header */}
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Pesan</h2>
              </div>
              <button
                onClick={() => setShowNewChatModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(22,163,74,0.25)",
                }}
              >
                <Plus size={14} /> Obrolan Baru
              </button>
            </div>

            {/* Search Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                background: "#f1f5f9",
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Cari percakapan atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  width: "100%",
                  color: "#0f172a",
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setActiveFilter("all")}
                style={{
                  padding: "4px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: activeFilter === "all" ? "#0f172a" : "#f1f5f9",
                  color: activeFilter === "all" ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                style={{
                  padding: "4px 14px",
                  borderRadius: 999,
                  border: "none",
                  background: activeFilter === "unread" ? "#16a34a" : "#f1f5f9",
                  color: activeFilter === "unread" ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Belum Dibaca
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredThreads.length === 0 ? (
              <div style={{ padding: "50px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                <MessageSquare size={36} color="#cbd5e1" style={{ margin: "0 auto 10px" }} />
                Tidak ada percakapan.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === activeOtherUserId;
                const isTyping = Boolean(typingUsers[thread.id]);

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 18px",
                      cursor: "pointer",
                      background: isSelected ? "#f0fdf4" : "transparent",
                      borderLeft: isSelected ? "4px solid #16a34a" : "4px solid transparent",
                      borderBottom: "1px solid #f8fafc",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Avatar with Online Dot */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: thread.otherUser.avatarColor || "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      {thread.otherUser.initials}
                      {thread.isOnline && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 1,
                            right: 1,
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: "#16a34a",
                            border: "2px solid #fff",
                          }}
                        />
                      )}
                    </div>

                    {/* Meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {thread.otherUser.name}
                        </span>
                        <span style={{ fontSize: 11, color: isSelected ? "#16a34a" : "#94a3b8", flexShrink: 0, fontWeight: isSelected ? 600 : 400 }}>
                          {thread.lastMessageTime}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {thread.lastMessageIsMe && !isTyping && (
                          <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                            {thread.lastMessageIsRead ? (
                              <CheckCheck size={14} color="#0284c7" />
                            ) : (
                              <CheckCheck size={14} color="#94a3b8" />
                            )}
                          </span>
                        )}

                        {isTyping ? (
                          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, fontStyle: "italic" }}>
                            sedang mengetik...
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {thread.lastMessage}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unread Badge */}
                    {!isSelected && thread.unreadCount > 0 && (
                      <span
                        style={{
                          background: "#16a34a",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Room or Empty State */}
        {activeThread ? (
          <div
            className={`messages-right-pane ${activeOtherUserId ? "mobile-full" : "mobile-hidden"}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#f8fafc",
              height: "100%",
              maxHeight: "100%",
              overflow: "hidden",
            }}
          >
            {/* Header (Sticky / Locked Top) */}
            <div
              className="chat-room-header"
              style={{
                padding: "10px 14px",
                background: "#fff",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
                gap: 8,
                flexShrink: 0,
                position: "sticky",
                top: 0,
                zIndex: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Back button for mobile */}
                <button
                  onClick={() => setActiveOtherUserId("")}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#334155",
                  }}
                  aria-label="Kembali ke daftar pesan"
                >
                  <ArrowLeft size={18} />
                </button>

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: activeThread.otherUser.avatarColor || "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {activeThread.otherUser.initials}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                      {activeThread.otherUser.name}
                    </span>
                    <span style={{ fontSize: 10, padding: "1px 6px", background: activeThread.otherUser.role === "investor" ? "#f0fdf4" : "#eff6ff", color: activeThread.otherUser.role === "investor" ? "#16a34a" : "#2563eb", borderRadius: 999, fontWeight: 700, textTransform: "capitalize" }}>
                      {activeThread.otherUser.role}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, marginTop: 1 }}>
                    {isOtherTyping ? (
                      <span style={{ color: "#16a34a", fontWeight: 700 }}>
                        sedang mengetik...
                      </span>
                    ) : activeThread.isOnline ? (
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>Online</span>
                    ) : (
                      <span style={{ color: "#64748b" }}>{activeThread.otherUser.lastSeen}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href={`/profile/${activeThread.otherUser.id}`}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#2563eb",
                    textDecoration: "none",
                    padding: "7px 14px",
                    background: "#eff6ff",
                    borderRadius: 8,
                    border: "1px solid #bfdbfe",
                  }}
                >
                  Lihat Profil Lengkap
                </Link>
              </div>
            </div>

            {/* Message Stream (ONLY this section scrolls) */}
            <div
              ref={messagesContainerRef}
              onScroll={handleContainerScroll}
              className="chat-room-stream"
              style={{
                flex: "1 1 0%",
                minHeight: 0,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                padding: "16px 14px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Privacy Notice Banner */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 16px", fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                  <ShieldCheck size={14} color="#16a34a" />
                  Kerahasiaan komunikasi &amp; negosiasi bisnis Anda terjamin di Weaven.
                </div>
              </div>

              {currentMessages.map((msg) => {
                const isMe = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "68%",
                        padding: "12px 16px",
                        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: isMe ? "linear-gradient(135deg, #16a34a, #059669)" : "#ffffff",
                        color: isMe ? "#ffffff" : "#0f172a",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        border: isMe ? "none" : "1px solid #e2e8f0",
                      }}
                    >
                      <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                        {msg.content}
                      </p>

                      {/* Timestamp & Read Receipts */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: isMe ? "flex-end" : "flex-start",
                          gap: 4,
                          fontSize: 11,
                          color: isMe ? "rgba(255,255,255,0.75)" : "#94a3b8",
                          marginTop: 6,
                        }}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          <span style={{ display: "inline-flex", alignItems: "center" }}>
                            {msg.isRead ? (
                              <CheckCheck size={14} color="#38bdf8" />
                            ) : msg.isDelivered ? (
                              <CheckCheck size={14} color="rgba(255,255,255,0.7)" />
                            ) : (
                              <Check size={14} color="rgba(255,255,255,0.7)" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Real Typing Indicator (Only when other user is actually typing) */}
              {isOtherTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: "16px 16px 16px 4px",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 700 }}>
                      {activeThread.otherUser.name.split(" ")[0]} sedang mengetik
                    </span>
                    <span style={{ display: "flex", gap: 3 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16a34a" }} />
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16a34a" }} />
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16a34a" }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar (Sticky / Locked Bottom above safe area) */}
            <form
              onSubmit={handleSend}
              className="chat-room-input"
              style={{
                padding: "12px 14px",
                background: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexShrink: 0,
                position: "sticky",
                bottom: 0,
                zIndex: 30,
                boxShadow: "0 -4px 12px rgba(0,0,0,0.04)",
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder={`Ketik pesan untuk ${activeThread.otherUser.name.split(" ")[0]}...`}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: newMessage.trim() ? "linear-gradient(135deg, #16a34a, #059669)" : "#cbd5e1",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: newMessage.trim() ? "pointer" : "not-allowed",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                  boxShadow: newMessage.trim() ? "0 2px 8px rgba(22,163,74,0.35)" : "none",
                }}
                aria-label="Kirim pesan"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          /* VentureBridge Custom Theme Hub Empty Screen (Desktop only) */
          <div
            className="messages-empty-pane hidden-mobile"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            {/* Branded Icon */}
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 24,
                background: "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 12px 28px -6px rgba(22,163,74,0.3)",
                marginBottom: 24,
              }}
            >
              <MessageSquare size={42} />
            </div>

            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              Hub Komunikasi Ekosistem Weaven
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", maxWidth: 520, lineHeight: 1.6, marginBottom: 28 }}>
              Terhubung langsung dengan angel investor, founder startup, dan pemilik capex. Pilih salah satu percakapan di sebelah kiri untuk membuka ruang diskusi.
            </p>

            {/* Feature Highlights Grid */}
            <div className="messages-features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, maxWidth: 640, marginBottom: 32 }}>
              <div style={{ background: "#fff", padding: "16px", borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Handshake size={18} color="#16a34a" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Direct Deals</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Negosiasi langsung modal &amp; capex</div>
              </div>

              <div style={{ background: "#fff", padding: "16px", borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <ShieldCheck size={18} color="#2563eb" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Kerahasiaan</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Pesan terenkripsi dan aman</div>
              </div>

              <div style={{ background: "#fff", padding: "16px", borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Sparkles size={18} color="#7c3aed" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>AI Copilot</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Bantuan analisis peluang deal</div>
              </div>
            </div>

            <button
              onClick={() => setShowNewChatModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 22px",
                background: "linear-gradient(135deg, #16a34a, #059669)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
              }}
            >
              <Plus size={16} /> Mulai Obrolan Baru
            </button>
          </div>
        )}
      </main>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewChatModal(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              padding: "24px 28px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                Mulai Obrolan Baru
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search members */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                background: "#f8fafc",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                marginBottom: 16,
              }}
            >
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Cari nama investor, founder, atau pemilik capex..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  width: "100%",
                  color: "#0f172a",
                }}
              />
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {availableMembers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: 13 }}>
                  Tidak ada anggota yang cocok.
                </div>
              ) : (
                availableMembers.map((acc) => (
                  <button
                    key={acc.id || acc.email}
                    onClick={() => handleSelectNewMember(acc)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#f0fdf4";
                      (e.currentTarget as HTMLElement).style.borderColor = "#bbf7d0";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#fff";
                      (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: acc.avatarColor || (acc.role === "investor" ? "#16a34a" : "#2563eb"),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {acc.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                          {acc.name}
                        </span>
                        <span style={{ fontSize: 10, padding: "2px 6px", background: acc.role === "investor" ? "#f0fdf4" : "#eff6ff", color: acc.role === "investor" ? "#16a34a" : "#2563eb", borderRadius: 999, fontWeight: 700, textTransform: "capitalize" }}>
                          {acc.role}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {acc.title}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          /* In Active Chat mode: Fullscreen locked roomchat like WhatsApp Mobile */
          .in-active-chat .mobile-bottom-nav {
            display: none !important;
          }
          .in-active-chat .messages-main-wrapper {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            z-index: 100 !important;
          }

          .messages-main-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            height: calc(100dvh - var(--mobile-bottom-nav-height)) !important;
            max-height: calc(100dvh - var(--mobile-bottom-nav-height)) !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            position: relative !important;
          }
          .messages-features-grid {
            grid-template-columns: 1fr !important;
            max-width: 100% !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .mobile-full {
            width: 100% !important;
            max-width: 100% !important;
            flex: 1 !important;
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
          }
          .chat-room-stream {
            flex: 1 1 0% !important;
            min-height: 0 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .chat-room-input {
            padding: 10px 14px calc(14px + env(safe-area-inset-bottom, 0px)) 14px !important;
            background: #ffffff !important;
            border-top: 1px solid #e2e8f0 !important;
            flex-shrink: 0 !important;
            position: sticky !important;
            bottom: 0 !important;
            z-index: 50 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Memuat percakapan...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
