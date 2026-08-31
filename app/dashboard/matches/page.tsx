"use client";

import { useState } from "react";
import { MessageSquare, ExternalLink, Users, Sparkles, ArrowRight } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { mockMatches } from "@/data/mock";
import type { Match } from "@/types";
import Link from "next/link";

type TabType = "investor" | "opportunity" | "cofounder";

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("investor");
  const [matches, setMatches] = useState(mockMatches);

  const filteredMatches = matches.filter((m) => m.matchType === activeTab);

  const mainMatch = filteredMatches[0];
  const sideMatch = filteredMatches[1];

  function handleWithdraw(id: string) {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "declined" as const } : m))
    );
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            Koneksi &amp; Match AI
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Tinjau keselarasan otomatis profil startup Anda dengan investor dan peluang potensial.
          </p>
        </div>

        {/* Tabs with smooth horizontal scrolling */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 24,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {(
            [
              { key: "investor", label: "Investor Matches" },
              { key: "opportunity", label: "Opportunity Matches" },
              { key: "cofounder", label: "Co-Founder Matches" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? "#2563eb" : "#64748b",
                background: activeTab === tab.key ? "#eff6ff" : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div
          className="matches-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Main Match Card */}
          {mainMatch ? (
            <div className="card" style={{ padding: "20px" }}>
              {/* Header: Avatar + Name + Percentage */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {mainMatch.target.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                      <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: 0 }}>
                        {mainMatch.target.name}
                      </h2>
                      <span
                        style={{
                          padding: "1px 6px",
                          background: "#f0fdf4",
                          color: "#16a34a",
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          border: "1px solid #86efac",
                        }}
                      >
                        ● Aktif
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          padding: "2px 8px",
                          background: "#2563eb",
                          color: "#fff",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        <Users size={10} />
                        It's a Match!
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {mainMatch.target.title}
                      {mainMatch.target.company ? `, ${mainMatch.target.company}` : ""}
                    </div>
                  </div>
                </div>

                {/* Match Percentage */}
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", lineHeight: 1 }}>
                    {mainMatch.matchScore}%
                  </span>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Keselarasan</div>
                </div>
              </div>

              {/* AI Analysis Box */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Sparkles size={14} color="#7c3aed" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ANALISIS AI COPILOT
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#334151", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                  "{mainMatch.aiAnalysis}"
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`/dashboard/messages?to=${mainMatch.target.id}`}
                  style={{
                    flex: "1 1 140px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "11px 16px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <MessageSquare size={15} /> Kirim Pesan
                </Link>
                <Link
                  href={`/investor/profile/${mainMatch.target.id}`}
                  style={{
                    flex: "1 1 140px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "11px 16px",
                    background: "#fff",
                    color: "#374151",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={15} /> Lihat Profil
                </Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
              Belum ada match untuk kategori ini.
            </div>
          )}

          {/* Side Match Card */}
          {sideMatch && (
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Antrean Match
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: "#fffbeb",
                    color: "#d97706",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    border: "1px solid #fcd34d",
                  }}
                >
                  Pending
                </span>
              </div>

              {/* Avatar & Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {sideMatch.target.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    {sideMatch.target.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {sideMatch.target.title}
                  </div>
                </div>
              </div>

              {/* Match Score */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Kecocokan</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>
                    {sideMatch.matchScore}%
                  </span>
                </div>
                <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${sideMatch.matchScore}%`, background: "#2563eb", borderRadius: 3 }} />
                </div>
              </div>

              <button
                onClick={() => handleWithdraw(sideMatch.id)}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#64748b",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Tarik Permintaan
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .matches-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
