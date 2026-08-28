"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  Building2,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Globe,
  Shield,
  TrendingUp,
  Layers,
  ArrowLeft,
  Star,
  Users,
  BadgeCheck,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

type ActiveRole = "founder" | "investor" | "cofounder" | "capex_provider";

interface MockProfile {
  id: string;
  name: string;
  initials: string;
  headline: string;
  title: string;
  company?: string;
  location: string;
  bio: string;
  avatarColor: string;
  isVerified: boolean;
  roles: ActiveRole[];
  joinedAt: string;
  connections: number;
  // Role-specific
  investorData?: {
    ticketRange: string;
    sectors: string[];
    stages: string[];
    activeInvestments: number;
    totalDeals: number;
    philosophy: string;
    portfolio: { company: string; sector: string; stage: string; status: string }[];
    affiliations: { org: string; role: string; verified: boolean }[];
    // Private (only visible after connection)
    capitalAvailability?: string;
  };
  founderData?: {
    ventures: { name: string; sector: string; stage: string; seeking: string[] }[];
    skills: string[];
  };
  cofoundarData?: {
    skills: string[];
    experience: string;
    openTo: string[];
  };
  capexData?: {
    assetTypes: string[];
    regions: string[];
    description: string;
  };
  posts: {
    id: string;
    type: string;
    content: string;
    likes: number;
    comments: number;
    date: string;
  }[];
}

const ROLE_LABEL: Record<ActiveRole, { label: string; color: string; bg: string; icon: string }> = {
  founder: { label: "Founder", color: "#d97706", bg: "#fffbeb", icon: "🚀" },
  investor: { label: "Investor", color: "#16a34a", bg: "#f0fdf4", icon: "💼" },
  cofounder: { label: "Co-Founder", color: "#7c3aed", bg: "#faf5ff", icon: "🤝" },
  capex_provider: { label: "Penyedia Capex", color: "#0369a1", bg: "#f0f9ff", icon: "🏗️" },
};

const MOCK_PROFILES: Record<string, MockProfile> = {
  "user-2": {
    id: "user-2",
    name: "Budi Santoso",
    initials: "BS",
    headline: "Managing Partner @ Nusantara Capital | Early-Stage Investor | EdTech & AgriTech Enthusiast",
    title: "Managing Partner",
    company: "Nusantara Capital",
    location: "Jakarta, Indonesia",
    bio: "Saya passionate dalam memberdayakan generasi founder Indonesia berikutnya yang memecahkan masalah nyata melalui teknologi yang scalable.\n\nDengan background di early-stage operations dan corporate M&A, saya membawa lebih dari sekadar modal. Filosofi investasi saya adalah founder-first — saya mencari grit, pemahaman pasar yang dalam, dan kesiapan untuk pivot saat diperlukan.\n\nSaya biasanya lead rounds namun juga terbuka untuk co-invest dengan syndicate terpercaya.",
    avatarColor: "#16a34a",
    isVerified: true,
    roles: ["investor", "founder"],
    joinedAt: "Juni 2023",
    connections: 312,
    investorData: {
      ticketRange: "Rp 100jt – Rp 500jt",
      sectors: ["EdTech", "AgriTech", "SaaS B2B", "F&B Innovation"],
      stages: ["Pre-Seed", "Seed"],
      activeInvestments: 12,
      totalDeals: 28,
      philosophy: "Founder-first. Saya mencari grit, pemahaman pasar yang dalam, dan kesiapan untuk pivot. Tim yang solid dengan domain expertise kuat adalah prioritas utama saya.",
      portfolio: [
        { company: "PinterAcademy", sector: "EdTech SaaS", stage: "Series A", status: "Active" },
        { company: "AgriKultur F&B", sector: "Supply Chain", stage: "Seed", status: "Exited ✓" },
        { company: "KopiNusantara", sector: "F&B D2C", stage: "Pre-Seed", status: "Active" },
      ],
      affiliations: [
        { org: "ANGIN Network", role: "Verified Member since 2021", verified: true },
        { org: "East Ventures Alumni", role: "Former EIR", verified: true },
        { org: "UI Incubator", role: "Official Mentor", verified: false },
      ],
    },
    posts: [
      {
        id: "p1",
        type: "💰 Pendanaan",
        content: "🔍 Investment Thesis Update: Kami sedang aktif mencari startup di sektor AgriTech dan EdTech tahap Pre-Seed hingga Seed. Ticket: Rp 100jt - Rp 500jt untuk initial investment.",
        likes: 89,
        comments: 34,
        date: "5 jam yang lalu",
      },
    ],
  },
  "user-1": {
    id: "user-1",
    name: "Dzakki Naufal",
    initials: "DN",
    headline: "Founder @ EDUKITA | EdTech Builder | Seeking Series A Investor",
    title: "Founder & CEO",
    company: "EDUKITA",
    location: "Yogyakarta, Indonesia",
    bio: "Membangun masa depan pendidikan Indonesia melalui teknologi adaptif. EDUKITA adalah platform pembelajaran berbasis AI yang sudah menjangkau 5.000+ siswa di Yogyakarta dan Jawa Tengah.\n\nSaya percaya bahwa setiap anak berhak mendapatkan pendidikan berkualitas yang dipersonalisasi. Kami sedang mencari investor untuk ekspansi ke Jawa Timur dan pengembangan fitur AI berikutnya.",
    avatarColor: "#2563eb",
    isVerified: true,
    roles: ["founder", "cofounder"],
    joinedAt: "Januari 2024",
    connections: 187,
    founderData: {
      ventures: [
        { name: "EDUKITA", sector: "EdTech / AI", stage: "Seed", seeking: ["Investor", "Engineer"] },
      ],
      skills: ["Product Strategy", "EdTech", "B2C Growth", "AI/ML", "Fundraising"],
    },
    posts: [
      {
        id: "p2",
        type: "🔄 Update",
        content: "EDUKITA baru saja mencapai 5.000 pengguna aktif dalam 3 bulan pertama! 🎉 Next step: ekspansi ke Jawa Timur dan mencari investor untuk Series A.",
        likes: 142,
        comments: 28,
        date: "2 jam yang lalu",
      },
    ],
  },
  "user-3": {
    id: "user-3",
    name: "Siti Rahmawati",
    initials: "SR",
    headline: "Co-Founder Candidate | Ex-Gojek & Traveloka | Product Manager | Open to Partner",
    title: "Senior Product Manager",
    company: "TechBridge",
    location: "Bandung, Indonesia",
    bio: "5 tahun pengalaman di Product Management (B2C & B2B) dengan track record di Gojek dan Traveloka. Saya passionate tentang social impact tech dan mencari co-founder journey yang meaningful.\n\nSaat ini open untuk bergabung sebagai Co-Founder di startup EdTech atau HealthTech yang sedang dalam tahap early-stage dengan strong mission.",
    avatarColor: "#7c3aed",
    isVerified: true,
    roles: ["cofounder", "founder"],
    joinedAt: "Maret 2024",
    connections: 245,
    cofoundarData: {
      skills: ["Product Management", "UX Research", "Growth Hacking", "B2C", "B2B SaaS"],
      experience: "Ex-Gojek (Senior PM) & Traveloka (PM Lead) — 5 tahun total",
      openTo: ["EdTech", "HealthTech", "Social Impact"],
    },
    posts: [
      {
        id: "p3",
        type: "🤝 Co-Founder",
        content: "Saya sedang mencari startup EdTech atau HealthTech yang membutuhkan Co-Founder. 5 tahun PM di Gojek & Traveloka. Let's talk! 🤝",
        likes: 63,
        comments: 19,
        date: "1 hari yang lalu",
      },
    ],
  },
  "user-4": {
    id: "user-4",
    name: "Andi Wijaya",
    initials: "AW",
    headline: "Syndicate Lead @ East Ventures | AgriTech & FinTech Investor | Market Analyst",
    title: "Syndicate Lead",
    company: "East Ventures",
    location: "Jakarta, Indonesia",
    bio: "Early-stage investor dengan fokus di sektor AgriTech dan FinTech. Percaya bahwa Indonesia memiliki potensi besar di kedua sektor ini, terutama dengan meningkatnya penetrasi smartphone di pedesaan.",
    avatarColor: "#dc2626",
    isVerified: true,
    roles: ["investor", "capex_provider"],
    joinedAt: "November 2023",
    connections: 428,
    investorData: {
      ticketRange: "Rp 50jt – Rp 250jt",
      sectors: ["AgriTech", "FinTech", "Marketplace"],
      stages: ["Pre-Seed", "Seed", "Early Stage"],
      activeInvestments: 8,
      totalDeals: 15,
      philosophy: "Market-first approach. Saya mencari startup yang menyerang TAM besar dengan unit economics yang jelas.",
      portfolio: [
        { company: "TaniHub", sector: "AgriTech", stage: "Series A", status: "Active" },
        { company: "PayFarm", sector: "FinTech Agri", stage: "Seed", status: "Active" },
      ],
      affiliations: [
        { org: "East Ventures", role: "Syndicate Lead", verified: true },
        { org: "KADIN Digital", role: "Anggota", verified: false },
      ],
    },
    posts: [
      {
        id: "p4",
        type: "📊 Insight",
        content: "Kenapa AgriTech Indonesia akan booming di 2025? 30% populasi Indonesia masih bergantung pada pertanian. Masih ada ruang besar untuk inovasi IoT dan marketplace.",
        likes: 215,
        comments: 67,
        date: "2 hari yang lalu",
      },
    ],
  },
};

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isLoggedIn } = useAuth();
  const [showFullBio, setShowFullBio] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showPrivateData, setShowPrivateData] = useState(false);

  const userId = params.userId as string;

  // If viewing own profile, show self
  const isOwnProfile = currentUser?.id === userId;
  const profile: MockProfile | null =
    MOCK_PROFILES[userId] ||
    (isOwnProfile && currentUser
      ? {
          id: currentUser.id || "me",
          name: currentUser.name,
          initials: currentUser.initials,
          headline: currentUser.headline || currentUser.title,
          title: currentUser.title,
          company: currentUser.company,
          location: currentUser.location || "Indonesia",
          bio: currentUser.bio || "Belum ada bio. Edit profil Anda untuk menambahkan informasi.",
          avatarColor: currentUser.avatarColor || "#2563eb",
          isVerified: currentUser.isVerified || false,
          roles: (currentUser.roles as ActiveRole[]) || ["founder"],
          joinedAt: "Baru bergabung",
          connections: 0,
          posts: [],
        }
      : null);

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 18, color: "#374151" }}>Profil tidak ditemukan.</p>
        <button onClick={() => router.back()} style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Kembali
        </button>
      </div>
    );
  }

  const bioLines = profile.bio.split("\n").filter(Boolean);
  const shortBio = bioLines.slice(0, 2).join(" ");
  const bioTruncated = profile.bio.length > 200;

  const content = (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 60 }}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#6b7280",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 20,
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      {/* Header Card */}
      <div
        className="card"
        style={{ overflow: "hidden", marginBottom: 20 }}
      >
        {/* Cover */}
        <div
          style={{
            height: 140,
            background: `linear-gradient(135deg, ${profile.avatarColor}22 0%, ${profile.avatarColor}44 100%)`,
            borderBottom: `3px solid ${profile.avatarColor}33`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, ${profile.avatarColor}15 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${profile.avatarColor}20 0%, transparent 40%)`,
            }}
          />
        </div>

        <div style={{ padding: "0 28px 24px" }}>
          {/* Avatar */}
          <div style={{ position: "relative", display: "inline-block", marginTop: -44 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: profile.avatarColor,
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {profile.initials}
            </div>
            {profile.isVerified && (
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  background: "#2563eb",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #fff",
                }}
              >
                <BadgeCheck size={12} color="#fff" />
              </div>
            )}
          </div>

          {/* Actions row */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -28, gap: 10, flexWrap: "wrap" }}>
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                style={{
                  padding: "8px 18px",
                  border: "1px solid #2563eb",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2563eb",
                  background: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Edit Profil
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setIsConnected(!isConnected)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    border: `1px solid ${isConnected ? "#e5e7eb" : "#2563eb"}`,
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isConnected ? "#6b7280" : "#2563eb",
                    background: isConnected ? "#f3f4f6" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <UserPlus size={15} />
                  {isConnected ? "Terhubung ✓" : "Hubungkan"}
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    background: "#2563eb",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <MessageSquare size={15} />
                  Kirim Pesan
                </button>
              </>
            )}
          </div>

          {/* Name & Headline */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>
                {profile.name}
              </h1>
              {profile.isVerified && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 8px",
                    background: "#eff6ff",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <Shield size={10} /> Terverifikasi
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: "#374151", marginTop: 4, lineHeight: 1.5 }}>
              {profile.headline}
            </p>

            {/* Meta */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 10 }}>
              {profile.company && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6b7280" }}>
                  <Building2 size={14} /> {profile.company}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6b7280" }}>
                <MapPin size={14} /> {profile.location}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
                <Users size={14} /> {profile.connections} koneksi
              </span>
            </div>

            {/* Roles */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {profile.roles.map((r) => {
                const cfg = ROLE_LABEL[r];
                return (
                  <span
                    key={r}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 12px",
                      background: cfg.bg,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: cfg.color,
                      border: `1px solid ${cfg.color}33`,
                    }}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* About */}
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Tentang</h2>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {showFullBio || !bioTruncated ? profile.bio : shortBio + "..."}
            </p>
            {bioTruncated && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showFullBio ? <><ChevronUp size={14} /> Tampilkan lebih sedikit</> : <><ChevronDown size={14} /> Lihat selengkapnya</>}
              </button>
            )}
          </div>

          {/* Investor Section */}
          {profile.investorData && (
            <>
              {/* Investment Focus */}
              <div className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <TrendingUp size={18} color="#16a34a" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Fokus Investasi</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Ticket Size (Publik)</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{profile.investorData.ticketRange}</div>
                  </div>
                  <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Active Investments</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{profile.investorData.activeInvestments} portofolio</div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Sektor Minat</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {profile.investorData.sectors.map((s) => (
                      <span key={s} style={{ padding: "4px 12px", background: "#f0fdf4", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#16a34a", border: "1px solid #86efac" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Stage Pilihan</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {profile.investorData.stages.map((s) => (
                      <span key={s} style={{ padding: "4px 12px", background: "#eff6ff", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#2563eb", border: "1px solid #bfdbfe" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "14px 16px", background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>💡 Filosofi Investasi</div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{profile.investorData.philosophy}</p>
                </div>

                {/* Private data hint */}
                {!isConnected && !isOwnProfile && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "12px 16px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      border: "1px dashed #d1d5db",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <DollarSign size={16} color="#9ca3af" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Ketersediaan Modal (Private)</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Hubungkan dengan investor untuk melihat detail modal yang tersedia</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Portfolio */}
              <div className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Briefcase size={18} color="#2563eb" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Portofolio</h2>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{profile.investorData.totalDeals} total deals</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {profile.investorData.portfolio.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          background: p.status.includes("Exited") ? "#dcfce7" : "#eff6ff",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {p.status.includes("Exited") ? "✓" : "📈"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.company}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{p.sector} · {p.stage}</div>
                      </div>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: p.status.includes("Exited") ? "#f0fdf4" : "#eff6ff",
                          color: p.status.includes("Exited") ? "#16a34a" : "#2563eb",
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Co-Founder Section */}
          {profile.cofoundarData && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Users size={18} color="#7c3aed" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Co-Founder Profile</h2>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Pengalaman</div>
                <p style={{ fontSize: 14, color: "#6b7280" }}>{profile.cofoundarData.experience}</p>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {profile.cofoundarData.skills.map((s) => (
                    <span key={s} style={{ padding: "4px 12px", background: "#faf5ff", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#7c3aed", border: "1px solid #c4b5fd" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Open To</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {profile.cofoundarData.openTo.map((s) => (
                    <span key={s} style={{ padding: "4px 12px", background: "#f3f4f6", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#374151" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Founder Section */}
          {profile.founderData && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Layers size={18} color="#d97706" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Ventures</h2>
              </div>
              {profile.founderData.ventures.map((v, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{v.sector} · {v.stage}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {v.seeking.map((s) => (
                      <span key={s} style={{ padding: "2px 8px", background: "#fff", borderRadius: 4, fontSize: 11, fontWeight: 600, color: "#d97706", border: "1px solid #fcd34d" }}>
                        Mencari: {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {profile.founderData.skills.map((s) => (
                    <span key={s} style={{ padding: "4px 12px", background: "#fffbeb", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#d97706", border: "1px solid #fcd34d" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Posts Activity */}
          {profile.posts.length > 0 && (
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Aktivitas Terbaru</h2>
              {profile.posts.map((post) => (
                <div key={post.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{post.type}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{post.date}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{post.content}</p>
                  <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>❤️ {post.likes}</span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>💬 {post.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile Stats */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Ringkasan Profil</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>Bergabung</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{profile.joinedAt}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>Koneksi</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>{profile.connections}</span>
              </div>
              {profile.investorData && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Total Deals</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{profile.investorData.totalDeals}</span>
                </div>
              )}
            </div>
          </div>

          {/* Affiliations */}
          {profile.investorData?.affiliations && (
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Globe size={16} color="#2563eb" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Afiliasi</h3>
              </div>
              {profile.investorData.affiliations.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: a.verified ? "#eff6ff" : "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {a.verified ? <CheckCircle2 size={16} color="#2563eb" /> : <Globe size={14} color="#9ca3af" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{a.org}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification status */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Shield size={16} color="#2563eb" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Verifikasi</h3>
            </div>
            {profile.isVerified ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #86efac" }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Profil Terverifikasi</span>
              </div>
            ) : (
              <div style={{ padding: "10px 12px", background: "#fffbeb", borderRadius: 8, border: "1px solid #fcd34d", fontSize: 12, color: "#d97706" }}>
                Profil belum diverifikasi
              </div>
            )}
          </div>

          {/* Report */}
          {!isOwnProfile && (
            <button
              style={{
                fontSize: 12,
                color: "#9ca3af",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "8px 4px",
              }}
            >
              🚩 Laporkan profil ini
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">{content}</main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px" }}>
        {content}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px", background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: "#374151" }}>Lihat profil lebih lengkap dengan bergabung ke Weaven</span>
          <Link href="/register" style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Daftar Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
