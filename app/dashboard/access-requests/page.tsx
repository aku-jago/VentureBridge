"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Sparkles, Inbox } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AccessRequestCard } from "@/components/venturebridge/AccessRequestCard";
import { mockAccessRequests } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AccessRequest } from "@/types";

export default function AccessRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "disetujui" | "ditolak">("pending");

  useEffect(() => {
    const currentUserId = user?.id || "user-1";
    let userRequests: AccessRequest[] = [];

    try {
      const stored = localStorage.getItem("vb_access_requests");
      if (stored) {
        userRequests = JSON.parse(stored);
      } else {
        // Initial fallback: only Dzakki (user-1) has default seed requests
        if (currentUserId === "user-1") {
          userRequests = mockAccessRequests;
          localStorage.setItem("vb_access_requests", JSON.stringify(mockAccessRequests));
        } else {
          userRequests = [];
        }
      }
    } catch {
      userRequests = currentUserId === "user-1" ? mockAccessRequests : [];
    }

    setRequests(userRequests);

    // Optional Supabase sync
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("access_requests")
        .select("*")
        .eq("founder_id", currentUserId)
        .then(({ data, error }) => {
          if (data && !error && data.length > 0) {
            const remoteReqs: AccessRequest[] = data.map((d: any) => ({
              id: d.id,
              opportunityId: d.listing_id || "opp-1",
              opportunityTitle: d.listing_title || "Startup",
              requesterId: d.investor_id,
              requester: {
                id: d.investor_id,
                name: d.investor_name,
                initials: d.investor_initials || "IV",
                title: d.investor_role || "Investor",
                isVerified: true,
                verificationBadges: [{ type: "identity", label: "Investor Terverifikasi" }],
              },
              status: d.status,
              message: d.message,
              matchScore: d.match_score || 90,
              requestedAt: "Baru saja",
              isHighMatch: (d.match_score || 90) >= 90,
              requesterType: "investor",
            }));

            // Merge safely: preserve local approved/rejected statuses
            setRequests((prev) => {
              const merged = [...prev];
              remoteReqs.forEach((rem) => {
                const idx = merged.findIndex((m) => m.id === rem.id);
                if (idx >= 0) {
                  // Keep local status if already decided
                  if (merged[idx].status === "pending") {
                    merged[idx] = rem;
                  }
                } else {
                  merged.push(rem);
                }
              });
              try {
                localStorage.setItem("vb_access_requests", JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        });
    }
  }, [user]);

  const totalRequests = requests.length;
  const menungguPersetujuan = requests.filter((r) => r.status === "pending").length;
  const aksesDiberikan = requests.filter((r) => r.status === "approved").length;

  function handleApprove(id: string) {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    setRequests(updated);
    try {
      localStorage.setItem("vb_access_requests", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      supabase.from("access_requests").update({ status: "approved" }).eq("id", id).then();
    }
  }

  function handleReject(id: string) {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: "rejected" as const } : r
    );
    setRequests(updated);
    try {
      localStorage.setItem("vb_access_requests", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      supabase.from("access_requests").update({ status: "rejected" }).eq("id", id).then();
    }
  }

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "disetujui") return r.status === "approved";
    if (activeTab === "ditolak") return r.status === "rejected";
    return true;
  });

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        <div
          className="access-requests-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left: Main Content */}
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Permintaan Akses
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
              Tinjau dan kelola permintaan dari investor dan calon co-founder untuk
              melihat detail startup Anda.
            </p>

            {/* Stats Row */}
            <div
              className="stats-grid-3"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                { label: "TOTAL PERMINTAAN", value: totalRequests, color: "#111827" },
                { label: "MENUNGGU PERSETUJUAN", value: menungguPersetujuan, color: "#d97706" },
                { label: "AKSES DIBERIKAN", value: aksesDiberikan, color: "#16a34a" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="card"
                  style={{ padding: "16px 20px", textAlign: "center" }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 8,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{ fontSize: 36, fontWeight: 800, color: stat.color }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 0,
                borderBottom: "2px solid #e5e7eb",
                marginBottom: 20,
              }}
            >
              {(
                [
                  { key: "pending", label: "Pending" },
                  { key: "disetujui", label: "Disetujui" },
                  { key: "ditolak", label: "Ditolak" },
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

            {/* Request Cards */}
            <div className="card" style={{ padding: "0 20px" }}>
              {filteredRequests.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                  Tidak ada permintaan di kategori ini.
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <AccessRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewConversation={() => {
                      router.push(`/dashboard/messages?to=${request.requester.id || request.requesterId}`);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right: AI Sidebar */}
          <div>
            <div
              className="card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              {/* AI Header */}
              <div
                style={{
                  padding: "16px 20px",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    Weaven AI
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                    91%
                  </div>
                </div>
              </div>

              {/* AI Content */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 12,
                  }}
                >
                  ANALISIS PROFIL PEMOHON (INVESTOR): BUDI SANTOSO
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div
                    style={{
                      padding: "12px 14px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                      💡 Insight Sektoral
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
                      Investor ini memiliki track record kuat di sektor EdTech,
                      dengan 3 investasi sukses di kawasan Asia Tenggara dalam 2
                      tahun terakhir.
                    </p>
                  </div>

                  {/* Match Score */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#eff6ff",
                      borderRadius: 8,
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                      Match Score
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>
                      94%
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#374151" }}>
                      Min First Ticket
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                      $50K+
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "12px 14px",
                      background: "#fffbeb",
                      borderRadius: 8,
                      border: "1px solid #fcd34d",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#d97706", marginBottom: 4 }}>
                      🎯 Rekomendasi Tindakan: <span style={{ color: "#dc2626" }}>Prioritas Tinggi</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
                      Jangan lewatkan 5 permintaan akses ini! Disarankan untuk
                      segera menjadwalkan panggilan untuk membantu akselerasi
                      pengguna Anda.
                    </p>
                  </div>

                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "9px 14px",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "#2563eb",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Sparkles size={14} />
                    Generate Ulang Analisis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .access-requests-layout {
            grid-template-columns: 1fr !important;
          }
          .access-requests-layout > div:last-child {
            display: none !important;
          }
          .stats-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .access-requests-layout {
            grid-template-columns: 1fr !important;
          }
          .stats-grid-3 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
