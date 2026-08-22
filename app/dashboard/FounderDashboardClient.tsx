"use client";

import { useState } from "react";
import { Bot, ListChecks, FileText, TrendingUp, Sparkles } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatCard } from "@/components/venturebridge/StatCard";
import { AIInsightPanel } from "@/components/venturebridge/AIInsightPanel";
import { AccessRequestCard } from "@/components/venturebridge/AccessRequestCard";
import { mockAccessRequests } from "@/data/mock";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";

export function FounderDashboardClient() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockAccessRequests);

  const displayName = user?.name ? user.name.split(" ")[0] : "Founder";

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

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* Page Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Selamat datang kembali, {displayName}.
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Berikut adalah ringkasan aktivitas listing Anda hari ini.
            </p>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Sparkles size={16} color="#2563eb" />
            Analisis Listing dengan AI
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <StatCard
            label="Active Listings"
            value="3"
            trend="+1 bulan ini"
            trendColor="#16a34a"
            icon={<ListChecks size={18} color="#2563eb" />}
            iconBg="#eff6ff"
          />

          <StatCard
            label="Access Requests"
            value="12"
            subLabel={`${pendingCount} Menunggu`}
            icon={<FileText size={18} color="#16a34a" />}
            iconBg="#f0fdf4"
          />

          {/* Investor Readiness Score */}
          <div
            className="card"
            style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={18} color="#2563eb" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Investor Readiness Score
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              {/* Score Circle */}
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg viewBox="0 0 72 72" width="72" height="72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" strokeWidth="6" />
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
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  78
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 8, lineHeight: 1.5 }}>
                  Skor Anda berada di persentil ke-65. Tambahkan proyeksi finansial Q3 untuk mencapai skor 90+.
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Profil Lengkap", "Finansial Kurang"].map((tag, i) => (
                    <span
                      key={tag}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: i === 0 ? "#f0fdf4" : "#fffbeb",
                        color: i === 0 ? "#16a34a" : "#d97706",
                        border: `1px solid ${i === 0 ? "#86efac" : "#fcd34d"}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: AI Panel + Requests */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
          }}
        >
          {/* AI Partner Panel */}
          <AIInsightPanel userName={displayName} />

          {/* Recent Access Requests */}
          <div className="card" style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Recent Access Requests
              </h2>
              <Link
                href="/dashboard/access-requests"
                style={{
                  fontSize: 13,
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Lihat Semua
              </Link>
            </div>

            <div>
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
    </div>
  );
}
