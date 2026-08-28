"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth, AuthUser } from "./AuthContext";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isDelivered?: boolean;
}

export interface ChatThread {
  id: string;
  otherUser: {
    id: string;
    name: string;
    initials: string;
    title: string;
    role: string;
    avatarColor: string;
    lastSeen?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  lastMessageIsMe?: boolean;
  lastMessageIsRead?: boolean;
  unreadCount: number;
  isOnline: boolean;
}

const SEED_MESSAGES: ChatMessage[] = [
  // Between Andi Wijaya (user-3 / Investor) and Dzakki Naufal (user-1 / Founder)
  {
    id: "msg-1",
    senderId: "user-1",
    senderName: "Dzakki Naufal",
    receiverId: "user-3",
    receiverName: "Andi Wijaya",
    content: "Halo Pak Andi! Terima kasih telah menerima penawaran ruko kami untuk F&B cloud kitchen di Jl. Kaliurang.",
    timestamp: "10:15",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "msg-2",
    senderId: "user-3",
    senderName: "Andi Wijaya",
    receiverId: "user-1",
    receiverName: "Dzakki Naufal",
    content: "Halo Dzakki! Lokasi ruko di Km 5.5 sangat menarik. Apakah sertifikat dan IMB sudah lengkap untuk usaha kuliner?",
    timestamp: "10:20",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "msg-3",
    senderId: "user-1",
    senderName: "Dzakki Naufal",
    receiverId: "user-3",
    receiverName: "Andi Wijaya",
    content: "Sudah sangat lengkap Pak, SHM dan IMB komersial siap pakai. Kami bisa jadwalkan visit lokasi jika Bapak ada waktu luang.",
    timestamp: "10:25",
    isRead: true,
    isDelivered: true,
  },
  // Between Andi Wijaya (user-3) and Siti Rahmawati (user-2)
  {
    id: "msg-4",
    senderId: "user-2",
    senderName: "Siti Rahmawati",
    receiverId: "user-3",
    receiverName: "Andi Wijaya",
    content: "Selamat siang Pak Andi, saya mengirimkan pitch deck putaran Seed untuk PANENLOKAL (AgriTech).",
    timestamp: "Kemarin 14:20",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "msg-5",
    senderId: "user-3",
    senderName: "Andi Wijaya",
    receiverId: "user-2",
    receiverName: "Siti Rahmawati",
    content: "Terima kasih Siti. Pitch deck sudah saya review, traksi 200+ petani sangat impressive.",
    timestamp: "Kemarin 16:00",
    isRead: true,
    isDelivered: true,
  },
  // Between Andi Wijaya (user-3) and Budi Santoso (user-4)
  {
    id: "msg-6",
    senderId: "user-4",
    senderName: "Budi Santoso",
    receiverId: "user-3",
    receiverName: "Andi Wijaya",
    content: "Pak Andi, kami punya lahan komersial 500m2 di Seturan yang cocok untuk konsep communal space.",
    timestamp: "Senin 09:30",
    isRead: true,
    isDelivered: true,
  },
];

interface ChatContextValue {
  allMessages: ChatMessage[];
  threads: ChatThread[];
  typingUsers: Record<string, boolean>; // otherUserId -> boolean (real typing only)
  setMyTypingStatus: (targetUserId: string, isTyping: boolean) => void;
  sendMessage: (receiverId: string, receiverName: string, content: string) => void;
  getMessagesWithUser: (otherUserId: string) => ChatMessage[];
  markThreadAsRead: (otherUserId: string) => void;
  startOrOpenThread: (otherUser: AuthUser) => string;
  totalUnreadCount: number;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, accounts } = useAuth();
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const currentUserId = user?.id || (user?.role === "investor" ? "user-3" : "user-1");
  const currentUserName = user?.name || "Pengguna";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vb_chat_messages");
      if (saved) {
        setAllMessages(JSON.parse(saved));
      } else {
        setAllMessages(SEED_MESSAGES);
        localStorage.setItem("vb_chat_messages", JSON.stringify(SEED_MESSAGES));
      }
    } catch {
      setAllMessages(SEED_MESSAGES);
    }
  }, []);

  // Listen to cross-tab / storage updates for genuine real-time typing & message sync
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === "vb_chat_messages" && e.newValue) {
        try {
          setAllMessages(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === "vb_typing_status" && e.newValue) {
        try {
          const status = JSON.parse(e.newValue);
          // Check if anyone is typing to me right now (within 3 seconds)
          const now = Date.now();
          const activeTyping: Record<string, boolean> = {};
          Object.keys(status).forEach((senderId) => {
            if (status[senderId]?.targetUserId === currentUserId && (now - status[senderId]?.timestamp < 3000)) {
              activeTyping[senderId] = true;
            }
          });
          setTypingUsers(activeTyping);
        } catch {}
      }
    }

    // Interval to expire old typing indicators
    const typingInterval = setInterval(() => {
      try {
        const raw = localStorage.getItem("vb_typing_status");
        const status = raw ? JSON.parse(raw) : {};
        const now = Date.now();
        const activeTyping: Record<string, boolean> = {};
        Object.keys(status).forEach((senderId) => {
          if (status[senderId]?.targetUserId === currentUserId && (now - status[senderId]?.timestamp < 3000)) {
            activeTyping[senderId] = true;
          }
        });

        setTypingUsers((prev) => {
          const prevKeys = Object.keys(prev);
          const nextKeys = Object.keys(activeTyping);
          if (prevKeys.length === 0 && nextKeys.length === 0) return prev;
          if (prevKeys.length === nextKeys.length && prevKeys.every((k) => prev[k] === activeTyping[k])) {
            return prev;
          }
          return activeTyping;
        });
      } catch {}
    }, 1500);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(typingInterval);
    };
  }, [currentUserId]);

  function persist(messages: ChatMessage[]) {
    setAllMessages(messages);
    try {
      localStorage.setItem("vb_chat_messages", JSON.stringify(messages));
    } catch {}
  }

  function setMyTypingStatus(targetUserId: string, isTyping: boolean) {
    try {
      const raw = localStorage.getItem("vb_typing_status");
      const current = raw ? JSON.parse(raw) : {};
      if (isTyping) {
        current[currentUserId] = { targetUserId, timestamp: Date.now() };
      } else {
        delete current[currentUserId];
      }
      localStorage.setItem("vb_typing_status", JSON.stringify(current));
    } catch {}
  }

  function markThreadAsRead(otherUserId: string) {
    if (!otherUserId) return;
    setAllMessages((prev) => {
      let hasChanges = false;
      const updated = prev.map((m) => {
        if (m.receiverId === currentUserId && m.senderId === otherUserId && !m.isRead) {
          hasChanges = true;
          return { ...m, isRead: true, isDelivered: true };
        }
        return m;
      });
      if (hasChanges) {
        try {
          localStorage.setItem("vb_chat_messages", JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });
  }

  function sendMessage(receiverId: string, receiverName: string, content: string) {
    if (!content.trim()) return;

    // Reset typing status immediately when message is sent
    setMyTypingStatus(receiverId, false);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId,
      receiverName,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
      isDelivered: true,
    };

    // Mark previous incoming messages from that sender as read
    const updatedMessages = allMessages.map((m) => {
      if (m.receiverId === currentUserId && m.senderId === receiverId && !m.isRead) {
        return { ...m, isRead: true, isDelivered: true };
      }
      return m;
    });

    // Save only real messages sent by human users (NO fake automated replies!)
    persist([...updatedMessages, newMsg]);
  }

  function getMessagesWithUser(otherUserId: string): ChatMessage[] {
    return allMessages.filter(
      (m) =>
        (m.senderId === currentUserId && m.receiverId === otherUserId) ||
        (m.senderId === otherUserId && m.receiverId === currentUserId)
    );
  }

  function startOrOpenThread(otherUser: AuthUser): string {
    const otherId = otherUser.id || `user-${otherUser.email}`;
    const existing = getMessagesWithUser(otherId);
    if (existing.length === 0) {
      sendMessage(
        otherId,
        otherUser.name,
        `Halo ${otherUser.name}, senang bisa terhubung di Weaven!`
      );
    }
    return otherId;
  }

  const userMessages = allMessages.filter(
    (m) => m.senderId === currentUserId || m.receiverId === currentUserId
  );

  const participantIds = Array.from(
    new Set(
      userMessages.map((m) => (m.senderId === currentUserId ? m.receiverId : m.senderId))
    )
  ).filter((id) => id !== currentUserId);

  const knownAccounts = accounts && accounts.length > 0 ? accounts : [];
  knownAccounts.forEach((acc) => {
    const accId = acc.id || `user-${acc.email}`;
    if (accId !== currentUserId && !participantIds.includes(accId)) {
      participantIds.push(accId);
    }
  });

  const threads: ChatThread[] = participantIds
    .map((otherId) => {
      const msgs = userMessages.filter(
        (m) =>
          (m.senderId === currentUserId && m.receiverId === otherId) ||
          (m.senderId === otherId && m.receiverId === currentUserId)
      );

      const foundAccount = knownAccounts.find((a) => a.id === otherId || `user-${a.email}` === otherId);
      const otherName =
        foundAccount?.name ||
        (otherId === "user-1"
          ? "Dzakki Naufal"
          : otherId === "user-2"
          ? "Siti Rahmawati"
          : otherId === "user-3"
          ? "Andi Wijaya"
          : otherId === "user-4"
          ? "Budi Santoso"
          : "Pengguna Ekosistem");

      const otherTitle =
        foundAccount?.title ||
        (otherId === "user-1"
          ? "Founder EDUKITA"
          : otherId === "user-2"
          ? "Founder PANENLOKAL"
          : otherId === "user-3"
          ? "Angel Investor · Alpha Ventures"
          : otherId === "user-4"
          ? "Capex Provider"
          : "Member Ekosistem");

      const otherRole = foundAccount?.role || (otherId === "user-3" ? "investor" : "founder");
      const otherColor = foundAccount?.avatarColor || (otherRole === "investor" ? "#16a34a" : "#2563eb");
      const initials =
        foundAccount?.initials ||
        otherName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase() ||
        "U";

      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unreadCount = msgs.filter((m) => m.senderId === otherId && !m.isRead).length;

      const isOnline = otherId === "user-3" || otherId === "user-1" || otherId === "user-2";
      const lastSeen = isOnline ? "Online" : "Terakhir dilihat hari ini pukul 08:30";

      return {
        id: otherId,
        otherUser: {
          id: otherId,
          name: otherName,
          initials,
          title: otherTitle,
          role: otherRole,
          avatarColor: otherColor,
          lastSeen,
        },
        lastMessage: lastMsg ? lastMsg.content : "Mulai percakapan baru...",
        lastMessageTime: lastMsg ? lastMsg.timestamp : "Baru",
        lastMessageIsMe: lastMsg ? lastMsg.senderId === currentUserId : false,
        lastMessageIsRead: lastMsg ? lastMsg.isRead : false,
        unreadCount,
        isOnline,
      };
    })
    .sort((a, b) => (b.lastMessage !== "Mulai percakapan baru..." ? 1 : -1));

  const totalUnreadCount = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <ChatContext.Provider
      value={{
        allMessages,
        threads,
        typingUsers,
        setMyTypingStatus,
        sendMessage,
        getMessagesWithUser,
        markThreadAsRead,
        startOrOpenThread,
        totalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
