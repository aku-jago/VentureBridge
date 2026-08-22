"use client";

import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Rocket,
  TrendingUp,
  Users,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  author: {
    name: string;
    initials: string;
    title: string;
    isVerified: boolean;
    avatarColor: string;
  };
  content: string;
  postType: "idea" | "funding" | "cofounder" | "insight" | "update";
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
  funding: { label: "💰 Pendanaan", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
  cofounder: { label: "🤝 Co-Founder", color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd" },
  insight: { label: "📊 Insight", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  update: { label: "🔄 Update", color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
};

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: {
      name: "Dzakki Naufal",
      initials: "DN",
      title: "Founder @ EDUKITA · Yogyakarta",
      isVerified: true,
      avatarColor: "#2563eb",
    },
    content:
      "Excited to share that EDUKITA baru saja mencapai 5.000 pengguna aktif dalam 3 bulan pertama! 🎉\n\nIni berkat dukungan luar biasa dari tim kami dan kepercayaan sekolah-sekolah mitra di Yogyakarta dan Jawa Tengah.\n\nNext step: ekspansi ke Jawa Timur dan mencari investor untuk Series A. Jika Anda tertarik dengan EdTech Indonesia, let's connect! 🚀",
    postType: "update",
    tags: ["EdTech", "Startup", "Indonesia"],
    likes: 142,
    comments: 28,
    reposts: 15,
    createdAt: "2 jam yang lalu",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p2",
    author: {
      name: "Budi Santoso",
      initials: "BS",
      title: "Managing Partner @ Nusantara Capital · Jakarta",
      isVerified: true,
      avatarColor: "#16a34a",
    },
    content:
      "🔍 Investment Thesis Update:\n\nKami sedang aktif mencari startup di sektor AgriTech dan EdTech tahap Pre-Seed hingga Seed dengan karakteristik:\n\n✅ Tim dengan domain expertise yang kuat\n✅ Fokus pada pasar Indonesia/SEA\n✅ Unit economics yang jelas\n✅ Traction awal yang terukur\n\nTicket: Rp 100jt - Rp 500jt untuk initial investment.\n\nBagi para founder yang sesuai, silakan reach out langsung atau kirim pitch deck ke profile saya. Happy to connect! 💼",
    postType: "funding",
    tags: ["Investment", "AgriTech", "EdTech", "Indonesia"],
    likes: 89,
    comments: 34,
    reposts: 47,
    createdAt: "5 jam yang lalu",
    isLiked: true,
    isSaved: true,
  },
  {
    id: "p3",
    author: {
      name: "Siti Rahmawati",
      initials: "SR",
      title: "Co-Founder Candidate · Bandung",
      isVerified: false,
      avatarColor: "#7c3aed",
    },
    content:
      "💡 Saya sedang mencari startup EdTech atau HealthTech yang membutuhkan Co-Founder dengan background:\n\n• 5 tahun pengalaman di Product Management (B2C & B2B)\n• Ex-Gojek & Traveloka\n• Strong network di komunitas kampus Bandung\n• Passionate tentang social impact tech\n\nBagi founder yang sedang membangun sesuatu yang meaningful, let's talk! DM terbuka. 🤝",
    postType: "cofounder",
    tags: ["CoFounder", "EdTech", "HealthTech", "ProductManager"],
    likes: 63,
    comments: 19,
    reposts: 8,
    createdAt: "1 hari yang lalu",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "p4",
    author: {
      name: "Andi Wijaya",
      initials: "AW",
      title: "Syndicate Lead @ East Ventures · Jakarta",
      isVerified: true,
      avatarColor: "#dc2626",
    },
    content:
      "📊 Market Insight: Kenapa AgriTech Indonesia akan booming di 2025?\n\n1️⃣ 30% populasi Indonesia masih bergantung pada pertanian\n2️⃣ Penetrasi smartphone di pedesaan naik 40% (2022-2024)\n3️⃣ Program pemerintah mendukung digitalisasi rantai pasok\n4️⃣ Gap antara petani dan pembeli masih sangat besar\n\nPeluang ini belum banyak digarap startup lokal. Masih ada ruang besar untuk inovasi IoT, marketplace, dan supply chain optimization.\n\nThoughts? 👇",
    postType: "insight",
    tags: ["AgriTech", "Indonesia", "MarketInsight", "2025"],
    likes: 215,
    comments: 67,
    reposts: 92,
    createdAt: "2 hari yang lalu",
    isLiked: false,
    isSaved: false,
  },
];

export default function FeedPage() {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filters = ["Semua", "Ide Bisnis", "Pendanaan", "Co-Founder", "Insight", "Update"];

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  function toggleSave(id: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  }

  const mainFeedContent = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 28,
        alignItems: "start",
      }}
    >
      {/* Main Feed */}
      <div>
        {/* Page Header */}
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Business Feed
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          Temukan insight, peluang, dan koneksi dari ekosistem startup Indonesia.
        </p>

        {/* Post Creator */}
        <div
          className="card"
          style={{
            padding: "16px",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
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
            {user?.initials ?? "DN"}
          </div>
          <button
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              background: "#f8f9fa",
              color: "#9ca3af",
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Bagikan update, ide, atau peluang...
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${activeFilter === f ? "#2563eb" : "#e5e7eb"}`,
                background: activeFilter === f ? "#eff6ff" : "#fff",
                color: activeFilter === f ? "#2563eb" : "#374151",
                fontSize: 13,
                fontWeight: activeFilter === f ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map((post) => {
            const typeConfig = POST_TYPE_CONFIG[post.postType];
            return (
              <article
                key={post.id}
                className="card"
                style={{ padding: "20px" }}
              >
                {/* Author Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: post.author.avatarColor,
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
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                        {post.author.name}
                      </span>
                      {post.author.isVerified && (
                        <VerificationBadge
                          badge={{ type: "identity", label: "Terverifikasi" }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                      {post.author.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{post.createdAt}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background: typeConfig.bg,
                        color: typeConfig.color,
                        border: `1px solid ${typeConfig.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {typeConfig.label}
                    </span>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                        padding: 4,
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    lineHeight: 1.7,
                    marginBottom: 14,
                    whiteSpace: "pre-line",
                  }}
                >
                  {post.content}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 12,
                        color: "#2563eb",
                        cursor: "pointer",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#f3f4f6", marginBottom: 12 }} />

                {/* Actions */}
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => toggleLike(post.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "none",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: post.isLiked ? "#dc2626" : "#6b7280",
                      fontWeight: post.isLiked ? 600 : 400,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                    {post.likes}
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "none",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <MessageSquare size={16} />
                    {post.comments}
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "none",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <RefreshCw size={16} />
                    {post.reposts}
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "none",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                  >
                    <Share2 size={16} />
                  </button>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => toggleSave(post.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "none",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: post.isSaved ? "#2563eb" : "#6b7280",
                    }}
                  >
                    <Bookmark size={16} fill={post.isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Trending Topics */}
        <div className="card" style={{ padding: "20px" }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <TrendingUp size={16} color="#2563eb" />
            Topik Trending
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { tag: "#AgriTech2025", count: "2.4K post" },
              { tag: "#InvestorIndonesia", count: "1.8K post" },
              { tag: "#StartupSeed", count: "1.2K post" },
              { tag: "#EdTechID", count: "980 post" },
              { tag: "#CoFounderNeeded", count: "754 post" },
            ].map((t) => (
              <div
                key={t.tag}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
                  {t.tag}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who to Follow */}
        <div className="card" style={{ padding: "20px" }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Users size={16} color="#2563eb" />
            Disarankan untuk Diikuti
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "Budi Santoso", title: "Investor · Nusantara Capital", initials: "BS", color: "#16a34a" },
              { name: "Siti Rahmawati", title: "Co-Founder · Bandung", initials: "SR", color: "#7c3aed" },
            ].map((person) => (
              <div
                key={person.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: person.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {person.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    {person.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{person.title}</div>
                </div>
                <button
                  style={{
                    padding: "5px 12px",
                    border: "1px solid #2563eb",
                    borderRadius: 6,
                    background: "#fff",
                    color: "#2563eb",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Ikuti
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Copilot CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            borderRadius: 12,
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Lightbulb size={18} color="#fff" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              AI Copilot
            </span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, marginBottom: 14 }}>
            Dapatkan insight personal dari AI tentang peluang bisnis yang relevan dengan profil Anda.
          </p>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "#fff",
              color: "#2563eb",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Rocket size={14} />
            Coba Sekarang
          </button>
        </div>
      </div>
    </div>
  );

  // If user is logged in, show feed inside the authenticated Dashboard layout
  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">{mainFeedContent}</main>
      </div>
    );
  }

  // If user is guest, show public TopNavBar and Footer
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fa",
      }}
    >
      <TopNavBar />
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "32px 24px",
        }}
      >
        {mainFeedContent}
      </div>
      <Footer />
    </div>
  );
}
