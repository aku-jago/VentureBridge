"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Lightbulb,
  Building2,
  Send,
  Sparkles,
  CheckCircle,
  X,
  Briefcase,
  Phone,
  Mail,
} from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useOffer } from "@/contexts/OfferContext";

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    initials: string;
    title: string;
    role?: string;
    isVerified: boolean;
    avatarColor: string;
  };
  content: string;
  postType: "idea" | "funding" | "cofounder" | "capex_request" | "insight" | "update";
  tags: string[];
  likes: number;
  comments: number;
  reposts: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

const POST_TYPE_CONFIG = {
  idea: { label: "💡 Ide Bisnis", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  funding: { label: "💼 Investor Request", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
  capex_request: { label: "🏢 Butuh Capex / Lokasi", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  cofounder: { label: "🤝 Cari Co-Founder", color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd" },
  insight: { label: "📊 Insight Pasar", color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  update: { label: "🔄 Update Startup", color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
};

const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    author: {
      id: "user-3",
      name: "Andi Wijaya",
      initials: "AW",
      title: "Angel Investor · Alpha Ventures",
      role: "investor",
      isVerified: true,
      avatarColor: "#16a34a",
    },
    content:
      "📢 [INVESTOR REQUEST]\n\nKami sedang mencari ruko atau lahan komersial strategis disekitar Jogja (area Sleman / Kaliurang / Seturan) dengan estimasi sewa 100-200jt/tahun untuk ekspansi F&B cloud kitchen jaringan kami.\n\nBagi pemilik capex / properti atau rekan-rekan yang punya info valid, langsung reach out atau kirim detail properti Anda! 🤝",
    postType: "capex_request",
    tags: ["CapexJogja", "F&B", "PropertySourcing", "InvestorRequest"],
    likes: 54,
    comments: 18,
    reposts: 22,
    createdAt: "1 jam yang lalu",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p2",
    author: {
      id: "user-1",
      name: "Dzakki Naufal",
      initials: "DN",
      title: "Founder @ EDUKITA · Yogyakarta",
      role: "founder",
      isVerified: true,
      avatarColor: "#2563eb",
    },
    content:
      "Excited to share that EDUKITA baru saja mencapai 5.000 pengguna aktif dalam 3 bulan pertama! 🎉\n\nIni berkat dukungan luar biasa dari tim kami dan kepercayaan sekolah-sekolah mitra di Yogyakarta dan Jawa Tengah.\n\nNext step: ekspansi ke Jawa Timur dan mencari investor untuk putaran Seed. Jika Anda tertarik dengan AI EdTech Indonesia, mari berdiskusi! 🚀",
    postType: "update",
    tags: ["EdTech", "Startup", "AI", "Indonesia"],
    likes: 142,
    comments: 28,
    reposts: 15,
    createdAt: "3 jam yang lalu",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p3",
    author: {
      id: "user-4",
      name: "Budi Santoso",
      initials: "BS",
      title: "Capex & Property Provider · Yogyakarta",
      role: "capex_provider",
      isVerified: true,
      avatarColor: "#0891b2",
    },
    content:
      "🏢 Info Capex Tersedia:\n\nAda ruko 2 lantai siap pakai di area Jl. Kaliurang Km 5.5, cocok untuk kafe, resto, atau kantor startup tech. Listrik 3500W, parkir luas, air PDAM.\n\nBisa sistem sewa tahunan atau revenue share bagi startup kuliner yang scalable. Silakan cek detail listing saya di tab Explore Capex!",
    postType: "idea",
    tags: ["CapexJogja", "RukoDisewa", "StartupSpace"],
    likes: 38,
    comments: 9,
    reposts: 11,
    createdAt: "5 jam yang lalu",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p4",
    author: {
      id: "user-2",
      name: "Siti Rahmawati",
      initials: "SR",
      title: "Founder @ PANENLOKAL · Bandung",
      role: "founder",
      isVerified: true,
      avatarColor: "#d97706",
    },
    content:
      "💡 PANENLOKAL sedang membuka kesempatan Co-Founder (Chief Technology Officer) untuk memperkuat platform IoT supply chain petani lokal.\n\nKriteria utama:\n• Pengalaman full-stack / mobile dev\n• Siap commit equity & build something meaningful\n\nDM kami jika Anda ingin memajukan pertanian Indonesia bersama!",
    postType: "cofounder",
    tags: ["AgriTech", "CTOHiring", "CoFounder"],
    likes: 63,
    comments: 19,
    reposts: 8,
    createdAt: "1 hari yang lalu",
    isLiked: true,
    isSaved: false,
  },
];

export default function FeedPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { sendOffer } = useOffer();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newPostType, setNewPostType] = useState<Post["postType"]>("idea");
  const [newTags, setNewTags] = useState("");

  // Reach Out Modal state
  const [reachOutTarget, setReachOutTarget] = useState<Post | null>(null);
  const [reachOutType, setReachOutType] = useState<"capex" | "idea" | "collaboration">("capex");
  const [reachOutTitle, setReachOutTitle] = useState("");
  const [reachOutMessage, setReachOutMessage] = useState("");
  const [reachOutPhone, setReachOutPhone] = useState("");
  const [reachOutSent, setReachOutSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vb_feed_posts");
      if (saved) {
        setPosts(JSON.parse(saved));
      }
    } catch {}
  }, []);

  function persistPosts(updated: Post[]) {
    setPosts(updated);
    try {
      localStorage.setItem("vb_feed_posts", JSON.stringify(updated));
    } catch {}
  }

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login?redirect=/feed");
      return;
    }
    if (!newContent.trim()) return;

    const authorName = user?.name || "Pengguna";
    const initials = user?.initials || "U";
    const authorRole = user?.role || "founder";

    const parsedTags = newTags
      .split(/[,\s#]+/)
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const createdPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: user?.id || `user-${Date.now()}`,
        name: authorName,
        initials,
        title: user?.title || (authorRole === "investor" ? "Investor" : "Founder"),
        role: authorRole,
        isVerified: user?.isVerified ?? true,
        avatarColor: authorRole === "investor" ? "#16a34a" : "#2563eb",
      },
      content: newContent,
      postType: newPostType,
      tags: parsedTags.length > 0 ? parsedTags : ["Startup", "Indonesia"],
      likes: 0,
      comments: 0,
      reposts: 0,
      createdAt: "Baru saja",
      isLiked: false,
      isSaved: false,
    };

    persistPosts([createdPost, ...posts]);
    setNewContent("");
    setNewTags("");
    setShowCreateModal(false);
  }

  function toggleLike(id: string) {
    if (!isLoggedIn) {
      router.push("/login?redirect=/feed");
      return;
    }
    persistPosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  function toggleSave(id: string) {
    if (!isLoggedIn) {
      router.push("/login?redirect=/feed");
      return;
    }
    persistPosts(
      posts.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  }

  function openReachOut(post: Post) {
    if (!isLoggedIn) {
      router.push("/login?redirect=/feed");
      return;
    }
    setReachOutTarget(post);
    setReachOutType(post.postType === "capex_request" ? "capex" : "idea");
    setReachOutTitle(
      post.postType === "capex_request"
        ? "Tawaran Properti / Capex untuk Kebutuhan Anda"
        : "Penawaran Ide Bisnis / Pitching Deck"
    );
    setReachOutMessage("");
    setReachOutPhone("");
    setReachOutSent(false);
  }

  function handleSendReachOut(e: React.FormEvent) {
    e.preventDefault();
    if (!reachOutMessage.trim() || !reachOutTarget) return;

    sendOffer({
      senderId: user?.id || "user-1",
      senderName: user?.name || "Dzakki Naufal",
      senderInitials: user?.initials || "DN",
      senderRole: user?.role || "founder",
      senderAvatarColor: user?.avatarColor || "#2563eb",
      targetUserId: reachOutTarget.author.id,
      targetUserName: reachOutTarget.author.name,
      relatedPostId: reachOutTarget.id,
      relatedPostSnippet: reachOutTarget.content.slice(0, 90) + "...",
      offerType: reachOutType,
      title: reachOutTitle || "Penawaran Solusi",
      message: reachOutMessage,
      contactEmail: user?.email || "founder@weaven.id",
      contactPhone: reachOutPhone || "081234567890",
    });

    setReachOutSent(true);
    setTimeout(() => {
      setReachOutSent(false);
      setReachOutTarget(null);
      setReachOutMessage("");
      setReachOutTitle("");
    }, 1500);
  }

  const filters = [
    { label: "Semua", value: "Semua" },
    { label: "💼 Kebutuhan Investor", value: "funding" },
    { label: "🏢 Butuh Capex", value: "capex_request" },
    { label: "💡 Ide Bisnis", value: "idea" },
    { label: "🤝 Co-Founder", value: "cofounder" },
    { label: "📊 Insight", value: "insight" },
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === "Semua") return true;
    return p.postType === activeFilter;
  });

  const mainFeedContent = (
    <div
      className="feed-layout"
      style={{
        display: "flex",
        gap: 24,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Main Feed Column */}
      <div style={{ flex: 1, minWidth: 0, width: "100%", boxSizing: "border-box" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            Feed Komunitas &amp; Peluang Bisnis
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Posting kebutuhan modal, cari capex, bagikan ide bisnis, atau reach out investor secara langsung.
          </p>
        </div>

        {/* Post Creator Box */}
        <div
          className="card"
          style={{
            padding: "18px 20px",
            marginBottom: 20,
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: user?.role === "investor" ? "#16a34a" : "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user?.initials ?? "U"}
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  router.push("/login?redirect=/feed");
                  return;
                }
                if (user?.role === "investor") {
                  setNewPostType("capex_request");
                }
                setShowCreateModal(true);
              }}
              style={{
                flex: 1,
                padding: "12px 18px",
                border: "1px solid #e5e7eb",
                borderRadius: 999,
                background: "#f8f9fa",
                color: "#6b7280",
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#f1f5f9";
                (e.currentTarget as HTMLElement).style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#f8f9fa";
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
              }}
            >
              {user?.role === "investor"
                ? "Post kebutuhan: 'Butuh capex di Jogja...' atau thesis investasi..."
                : "Bagikan update startup, ide bisnis, atau kebutuhan capex Anda..."}
            </button>
          </div>

          {/* Quick Action Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
            <button
              onClick={() => { setNewPostType("capex_request"); setShowCreateModal(true); }}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Building2 size={13} /> Cari Capex / Properti
            </button>
            <button
              onClick={() => { setNewPostType("funding"); setShowCreateModal(true); }}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Briefcase size={13} /> Kebutuhan Investor
            </button>
            <button
              onClick={() => { setNewPostType("idea"); setShowCreateModal(true); }}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #fcd34d", background: "#fffbeb", color: "#d97706", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Lightbulb size={13} /> Pitch Ide Bisnis
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 20,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: activeFilter === f.value ? "1px solid #2563eb" : "1px solid #e5e7eb",
                background: activeFilter === f.value ? "#2563eb" : "#fff",
                color: activeFilter === f.value ? "#fff" : "#4b5563",
                fontSize: 13,
                fontWeight: activeFilter === f.value ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                transition: "all 0.15s ease",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredPosts.map((post) => {
            const config = POST_TYPE_CONFIG[post.postType] || POST_TYPE_CONFIG.update;
            const isInvestorPost = post.author.role === "investor" || post.postType === "funding" || post.postType === "capex_request";

            // STRICT CHECK: Is this post written by the currently logged-in user?
            const isMyPost = Boolean(
              (user?.id && post.author.id === user.id) ||
              (user?.email && post.author.id === user.email) ||
              (user?.name && user.name.trim().toLowerCase() === post.author.name.trim().toLowerCase())
            );

            return (
              <div
                key={post.id}
                className="card"
                style={{
                  padding: "20px 24px",
                  background: "#fff",
                  borderRadius: 16,
                  border: isInvestorPost ? "2px solid #bbf7d0" : "1px solid #e5e7eb",
                  boxShadow: isInvestorPost ? "0 4px 16px rgba(22,163,74,0.06)" : "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                {/* Post Author Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <div 
                    onClick={() => {
                      if (!isLoggedIn || !user) {
                        router.push("/login?redirect=/feed");
                        return;
                      }
                      router.push(`/profile/${post.author.id}`);
                    }}
                    style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", flex: "1 1 auto", minWidth: 0 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: post.author.avatarColor || (post.author.role === "investor" ? "#16a34a" : "#2563eb"),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {post.author.initials}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {post.author.name}
                        </span>
                        {post.author.isVerified && (
                          <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: 999, fontWeight: 700, border: "1px solid #bbf7d0" }}>
                            ✓ Terverifikasi
                          </span>
                        )}
                        {post.author.role === "investor" && (
                          <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", color: "#15803d", borderRadius: 999, fontWeight: 800 }}>
                            💼 Investor
                          </span>
                        )}
                        {isMyPost && (
                          <span style={{ fontSize: 11, padding: "2px 8px", background: "#f1f5f9", color: "#475569", borderRadius: 999, fontWeight: 700 }}>
                            ✨ Postingan Anda
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
                        {post.author.title} • {post.createdAt}
                      </div>
                    </div>
                  </div>

                  {/* Post Type Badge */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: config.color,
                      background: config.bg,
                      border: `1px solid ${config.border}`,
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Content */}
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, whiteSpace: "pre-line", marginBottom: 14 }}>
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 12,
                          color: "#2563eb",
                          background: "#eff6ff",
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontWeight: 600,
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid #f3f4f6",
                    paddingTop: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    {/* Like */}
                    <button
                      onClick={() => toggleLike(post.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        color: post.isLiked ? "#ef4444" : "#6b7280",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Heart size={16} fill={post.isLiked ? "#ef4444" : "none"} color={post.isLiked ? "#ef4444" : "#6b7280"} />
                      {post.likes}
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => {
                        if (!isLoggedIn || !user) {
                          router.push("/login?redirect=/feed");
                          return;
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        color: "#6b7280",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <MessageSquare size={16} />
                      {post.comments}
                    </button>

                    {/* Save */}
                    <button
                      onClick={() => toggleSave(post.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        color: post.isSaved ? "#2563eb" : "#6b7280",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <Bookmark size={16} fill={post.isSaved ? "#2563eb" : "none"} color={post.isSaved ? "#2563eb" : "#6b7280"} />
                    </button>
                  </div>

                  {/* Reach Out CTA: ONLY for posts that do NOT belong to the current user */}
                  {!isMyPost && isInvestorPost && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoggedIn || !user) {
                          router.push("/login?redirect=/feed");
                          return;
                        }
                        openReachOut(post);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 16px",
                        background: "linear-gradient(135deg, #16a34a, #059669)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(22,163,74,0.25)",
                      }}
                    >
                      <Send size={13} /> Reach Out / Tawarkan Solusi
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar Widgets (Desktop Only) */}
      <div className="feed-sidebar-desktop hidden-mobile" style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Trending Tags Widget */}
        <div
          className="card"
          style={{
            padding: "20px",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <TrendingUp size={16} color="#2563eb" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
              Topik Hangat Ekosistem
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { tag: "CapexJogja", count: "34 diskusi" },
              { tag: "EdTechAI", count: "89 diskusi" },
              { tag: "SeedFunding2025", count: "120 diskusi" },
              { tag: "AgriTechIndonesia", count: "45 diskusi" },
              { tag: "CloudKitchenSpace", count: "27 diskusi" },
            ].map((t) => (
              <div key={t.tag} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", cursor: "pointer" }}>
                  #{t.tag}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div
          style={{
            padding: "18px 20px",
            background: "linear-gradient(135deg, #f0fdf4, #eff6ff)",
            borderRadius: 16,
            border: "1px solid #bbf7d0",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d", marginBottom: 6 }}>
            💡 Tips untuk Founder &amp; Investor
          </div>
          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
            Investor dapat memposting kebutuhan capex atau kriteria startup. Founder &amp; pemilik capex dapat langsung me-reach out untuk kolaborasi langsung.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLoggedIn ? (
        <div className="dashboard-layout">
          <DashboardSidebar />
          <main className="dashboard-content">
            {mainFeedContent}
          </main>
        </div>
      ) : (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
          <TopNavBar />
          <main style={{ flex: 1, padding: "32px 24px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            {mainFeedContent}
          </main>
          <Footer />
        </div>
      )}

      {/* Feed Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .feed-layout {
            flex-direction: column !important;
            gap: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .feed-sidebar-desktop {
            display: none !important;
          }
        }
      `}</style>
      {isLoggedIn && user && showCreateModal && (
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
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 520,
              padding: "24px 28px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Buat Postingan di Feed
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Post Type Selector */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Kategori Postingan:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { value: "capex_request" as const, label: "🏢 Butuh Capex / Lokasi" },
                    { value: "funding" as const, label: "💼 Kebutuhan Investor" },
                    { value: "idea" as const, label: "💡 Ide Bisnis / Pitch" },
                    { value: "cofounder" as const, label: "🤝 Cari Co-Founder" },
                    { value: "update" as const, label: "🔄 Update Startup" },
                    { value: "insight" as const, label: "📊 Insight Pasar" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setNewPostType(t.value)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: newPostType === t.value ? "2px solid #2563eb" : "1px solid #e5e7eb",
                        background: newPostType === t.value ? "#eff6ff" : "#fff",
                        fontSize: 12,
                        fontWeight: newPostType === t.value ? 700 : 500,
                        color: newPostType === t.value ? "#2563eb" : "#374151",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Isi Postingan:
                </label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={
                    newPostType === "capex_request"
                      ? "Contoh: Sedang mencari ruko/lahan komersial di Jogja sekitar Seturan/Kaliurang dengan budget 100-200jt/thn untuk ekspansi bisnis..."
                      : newPostType === "funding"
                      ? "Contoh: Kami sedang membuka tiket investasi Rp 100jt-500jt untuk startup early stage di bidang AgriTech / EdTech..."
                      : "Tuliskan pemikiran, peluang, atau update bisnis Anda..."
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Hashtag / Topik (pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  placeholder="CapexJogja, F&B, SeedFunding"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: "11px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Send size={14} /> Publikasikan Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REACH OUT / OFFER MODAL */}
      {isLoggedIn && user && reachOutTarget && (
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
            if (e.target === e.currentTarget) setReachOutTarget(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 520,
              padding: "24px 28px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Reach Out ke {reachOutTarget.author.name}
              </div>
              <button
                onClick={() => setReachOutTarget(null)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 2 }}>Merespons Postingan Feed:</div>
              <div style={{ fontSize: 13, color: "#111827", fontStyle: "italic" }}>
                "{reachOutTarget.content.slice(0, 100)}..."
              </div>
            </div>

            {reachOutSent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                  Tawaran Berhasil Dikirim ke {reachOutTarget.author.name}!
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                  Tawaran Anda telah masuk ke kotak masuk (inbox) investor dan dapat segera direspons.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendReachOut} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Offer Type */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                    Jenis Tawaran Solusi:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[
                      { key: "capex" as const, label: "🏢 Aset Capex" },
                      { key: "idea" as const, label: "💡 Ide Bisnis" },
                      { key: "collaboration" as const, label: "🤝 Kolaborasi" },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setReachOutType(t.key)}
                        style={{
                          padding: "8px",
                          borderRadius: 8,
                          border: reachOutType === t.key ? "2px solid #16a34a" : "1px solid #e5e7eb",
                          background: reachOutType === t.key ? "#f0fdf4" : "#fff",
                          color: reachOutType === t.key ? "#16a34a" : "#374151",
                          fontSize: 12,
                          fontWeight: reachOutType === t.key ? 700 : 500,
                          cursor: "pointer",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offer Title */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Judul Penawaran:
                  </label>
                  <input
                    type="text"
                    required
                    value={reachOutTitle}
                    onChange={(e) => setReachOutTitle(e.target.value)}
                    placeholder="Contoh: Ruko 2 Lantai Siap Pakai di Jl. Kaliurang"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Pesan Detail &amp; Spesifikasi:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reachOutMessage}
                    onChange={(e) => setReachOutMessage(e.target.value)}
                    placeholder="Jelaskan spesifikasi properti / keunggulan ide bisnis Anda serta estimasi biaya/sewa..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Nomor WhatsApp / Kontak Langsung:
                  </label>
                  <input
                    type="text"
                    value={reachOutPhone}
                    onChange={(e) => setReachOutPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: 4,
                    padding: "12px",
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Send size={15} /> Kirim Tawaran ke {reachOutTarget.author.name}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
