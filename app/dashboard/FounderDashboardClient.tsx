"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  ListChecks,
  FileText,
  TrendingUp,
  Sparkles,
  Zap,
  Building2,
  Users,
  Eye,
  Bookmark,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  Compass,
  MessageSquare,
  BarChart3,
  Flame,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatCard } from "@/components/venturebridge/StatCard";
import { AIInsightPanel } from "@/components/venturebridge/AIInsightPanel";
import { AccessRequestCard } from "@/components/venturebridge/AccessRequestCard";
import { mockAccessRequests, mockOpportunities } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { useToken } from "@/contexts/TokenContext";

export function FounderDashboardClient() {
  const { user } = useAuth();
  const { founderBalance } = useToken();
  const [requests, setRequests] = useState(mockAccessRequests);
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "listings">("overview");

  const displayName = user?.name ? user.name.split(" ")[0] : "Founder";
  const fullName = user?.name || "Dzakki Naufal";
  const startupName = user?.title?.replace("Founder @ ", "") || "EDUKITA";

  // Filter founder's own listings
  const myListing = mockOpportunities.find((o) => o.founderId === "user-1") || mockOpportunities[0];

  function handleApprove(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
  }

  function handleReject(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pendingCount = pendingRequests.length;

  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* =========================================
            1. HERO GREETING BANNER (MODERN GRADIENT)
            ========================================= */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #1e3a8a 100%)",
            borderRadius: 20,
            padding: "28px 24px",
            color: "#fff",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
          }}
        >
          {/* Subtle decorative glow circles */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: "40%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              position: "relative",
              zIndex: 2,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    padding: "3px 10px",
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(147, 197, 253, 0.3)",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#93c5fd",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Sparkles size={11} /> Founder Workspace
                </span>
                <span
                  style={{
                    padding: "3px 10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(110, 231, 183, 0.3)",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6ee7b7",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={11} /> Terverifikasi
                </span>
              </div>

              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: 6,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                {greeting}, {displayName}! 👋
              </h1>
              <p style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 480, lineHeight: 1.5 }}>
                Startup Anda <strong style={{ color: "#93c5fd" }}>{startupName}</strong> sedang dipantau oleh 8 investor terverifikasi minggu ini.
              </p>
            </div>

            {/* Quick CTAs */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Link
                href="/dashboard/listings/new"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <Plus size={15} /> Buat Listing Baru
              </Link>
              <Link
                href="/dashboard/ai-copilot"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Bot size={15} color="#93c5fd" /> AI Copilot
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================
            2. QUICK ACTION SHORTCUT PILLS
            ========================================= */}
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 24,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            { label: "Boost Listing (Ads)", href: "/explore/ideas", icon: <Zap size={14} color="#d97706" />, bg: "#fffbeb", border: "#fde68a" },
            { label: "Cari Investor", href: "/explore", icon: <Compass size={14} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Cari Aset Capex", href: "/explore/capex", icon: <Building2 size={14} color="#0891b2" />, bg: "#ecfeff", border: "#a5f3fc" },
            { label: "Feed Komunitas", href: "/feed", icon: <Flame size={14} color="#dc2626" />, bg: "#fef2f2", border: "#fecaca" },
            { label: "Token Wallet (" + founderBalance + ")", href: "/founder/tokens", icon: <Coins size={14} color="#b45309" />, bg: "#fef3c7", border: "#fcd34d" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 14px",
                background: action.bg,
                border: `1px solid ${action.border}`,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                color: "#1f2937",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>

        {/* =========================================
            3. KEY METRICS & STATS GRID
            ========================================= */}
        <div
          className="stats-grid-3"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard
            label="Active Listings"
            value="3"
            trend="+1 bulan ini"
            trendColor="#16a34a"
            subLabel="1 listing boosted"
            icon={<ListChecks size={18} color="#2563eb" />}
            iconBg="#eff6ff"
          />

          <StatCard
            label="Access Requests"
            value="12"
            subLabel={`${pendingCount} menunggu persetujuan`}
            trend="+3 baru"
            trendColor="#d97706"
            icon={<FileText size={18} color="#16a34a" />}
            iconBg="#f0fdf4"
          />

          <StatCard
            label="Total Profile & Listing Views"
            value="1.4k"
            subLabel="84 disimpan investor"
            trend="+18% minggu ini"
            trendColor="#16a34a"
            icon={<Eye size={18} color="#7c3aed" />}
            iconBg="#faf5ff"
          />
        </div>

        {/* =========================================
            4. INVESTOR READINESS SCORE & PROGRESS
            ========================================= */}
        <div
          className="card"
          style={{
            padding: "24px",
            marginBottom: 24,
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} color="#2563eb" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Investor Readiness Score (AI Assessed)
                </h3>
                <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
                  Tingkat kesiapan listing Anda untuk menerima penanaman modal.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/verification"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 700,
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              Tingkatkan Skor <ChevronRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              alignItems: "center",
              background: "#f8fafc",
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Score Ring & Value */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg viewBox="0 0 72 72" width="72" height="72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="6"
                    strokeDasharray={`${(78 / 100) * 2 * Math.PI * 30} ${2 * Math.PI * 30}`}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>78</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#64748b" }}>/100</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                  Tinggi · Persentil 65
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
                  Tambahkan laporan proyeksi finansial Q3 untuk mencapai level 90+ (Top Tier).
                </div>
              </div>
            </div>

            {/* 4 Pillars Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Legalitas & Identitas", score: 100, color: "#16a34a" },
                { label: "Pitch & Deskripsi Ide", score: 85, color: "#2563eb" },
                { label: "Struktur Tim & Founder", score: 90, color: "#7c3aed" },
                { label: "Proyeksi Finansial Q3", score: 60, color: "#d97706" },
              ].map((p) => (
                <div key={p.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 2 }}>
                    <span>{p.label}</span>
                    <span style={{ color: p.color, fontWeight: 700 }}>{p.score}%</span>
                  </div>
                  <div style={{ height: 5, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${p.score}%`, height: "100%", background: p.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            5. MAIN WORKSPACE CONTENT: AI & LISTINGS
            ========================================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
            marginBottom: 24,
          }}
        >
          {/* AI Strategic Partner Panel */}
          <AIInsightPanel userName={displayName} />

          {/* Founder's Active Listing Card Showcase */}
          {myListing && (
            <div
              className="card"
              style={{
                padding: "20px 24px",
                borderRadius: 16,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: 999 }}>
                      LISTING UTAMA ANDA
                    </span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Diperbarui 2 hari lalu</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    {myListing.title}
                  </h3>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/opportunities/${myListing.id}`}
                    style={{
                      padding: "7px 14px",
                      background: "#f1f5f9",
                      color: "#334155",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Lihat Publik
                  </Link>
                  <Link
                    href="/dashboard/listings/new"
                    style={{
                      padding: "7px 14px",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Edit Listing
                  </Link>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 16 }}>
                {myListing.shortDescription}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 12,
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Target Pendanaan</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                    Rp {(myListing.targetFunding / 1_000_000).toLocaleString("id-ID")} Jt
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Traksi / Status</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>
                    {myListing.traction || "5.000 Active Users"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Total Dilihat</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                    1.420x
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Investor Disimpan</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#7c3aed" }}>
                    84 Investor
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Access Requests Card */}
          <div
            className="card"
            style={{
              padding: "20px 24px",
              borderRadius: 16,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Recent Access Requests
                </h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
                  Investor &amp; partner yang meminta akses data confidential startup Anda.
                </p>
              </div>

              <Link
                href="/dashboard/access-requests"
                style={{
                  fontSize: 13,
                  color: "#2563eb",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                Lihat Semua ({requests.length}) <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {requests.slice(0, 3).map((request) => (
                <AccessRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .stats-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .stats-grid-3 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
