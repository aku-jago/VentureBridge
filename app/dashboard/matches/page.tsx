"use client";

import { useState } from "react";
import { MessageSquare, ExternalLink, Users } from "lucide-react";
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
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Koneksi & Match
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          Tinjau keselarasan Anda dengan investor dan peluang potensial.
        </p>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "2px solid #e5e7eb",
            marginBottom: 28,
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
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? "#2563eb" : "#6b7280",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.key ? "#2563eb" : "transparent"}`,
                marginBottom: -2,
                cursor: "pointer",
                transition: "color 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Main Match Card */}
          {mainMatch ? (
            <div className="card" style={{ padding: "24px" }}>
              {/* Header: Avatar + Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {mainMatch.target.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                      {mainMatch.target.name}
                    </h2>
                    <span
                      style={{
                        padding: "2px 8px",
                        background: "#f0fdf4",
                        color: "#16a34a",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        border: "1px solid #86efac",
                      }}
                    >
                      ● Now
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 12px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <Users size={11} />
                      It's a Match!
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    {mainMatch.target.title}
                    {mainMatch.target.company ? `, ${mainMatch.target.company}` : ""}
                  </div>
                </div>

                {/* Match Percentage */}
                <div
                  style={{
                    marginLeft: "auto",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>
                    {mainMatch.matchScore}%
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Keselarasan</div>
                </div>
              </div>

              {/* AI Analysis */}
              <div
                style={{
                  padding: "14px 16px",
                  background: "#f8f9fa",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  marginBottom: 20,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "#eff6ff",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 14 }}>🤖</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                    Analisis AI Copilot
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, fontStyle: "italic" }}>
                    "{mainMatch.aiAnalysis}"
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: 12 }}>
                <Link
                  href="/dashboard/messages"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <MessageSquare size={16} />
                  Kirim Pesan
                </Link>
                <Link
                  href={`/investor/profile/${mainMatch.targetId}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 20px",
                    background: "#fff",
                    color: "#374151",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <ExternalLink size={15} />
                  Lihat Profil
                </Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
              Belum ada match di kategori ini. Lengkapi profil Anda untuk hasil yang lebih baik.
            </div>
          )}

          {/* Side: Pending Match */}
          {sideMatch && (
            <div className="card" style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    padding: "2px 8px",
                    background: "#fffbeb",
                    color: "#d97706",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    border: "1px solid #fcd34d",
                  }}
                >
                  Pending
                </span>
              </div>

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {sideMatch.target.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {sideMatch.target.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {sideMatch.target.title}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, marginBottom: 12 }}>
                {sideMatch.aiAnalysis.slice(0, 80)}...
              </p>

              {/* Match Score */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>Kecocokan</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    {sideMatch.matchScore}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#e5e7eb",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${sideMatch.matchScore}%`,
                      background: "#2563eb",
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleWithdraw(sideMatch.id)}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#6b7280",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Tarik Permintaan
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
