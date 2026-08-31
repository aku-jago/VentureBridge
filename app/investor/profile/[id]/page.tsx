import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Bookmark,
  Eye,
  ExternalLink,
  TrendingUp,
  Users,
  Briefcase,
  ChevronRight,
  Bot,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { mockBudiSantoso } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profil Investor — Budi Santoso",
};

export default function InvestorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const investor = mockBudiSantoso;
  const matchScore = 92;

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          <Link href="/explore" style={{ color: "#6b7280", textDecoration: "none" }}>
            Opportunities
          </Link>
          <ChevronRight size={14} />
          <Link href="/explore" style={{ color: "#6b7280", textDecoration: "none" }}>
            Investor Directory
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#111827", fontWeight: 600 }}>{investor.name}</span>
        </div>

        <div
          className="investor-profile-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* LEFT: Main Profile Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Profile Header Card */}
            <div className="card" style={{ padding: "24px" }}>
              {/* Back link */}
              <Link
                href="/explore"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#6b7280",
                  textDecoration: "none",
                  marginBottom: 20,
                }}
              >
                <ArrowLeft size={14} />
                ← Back to Search
              </Link>

              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                    border: "3px solid #fff",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                  }}
                >
                  {investor.initials}
                </div>

                {/* Name + Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
                      {investor.name}
                    </h1>
                    <CheckCircle size={20} color="#2563eb" fill="#2563eb" />
                  </div>
                  <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 10, lineHeight: 1.4 }}>
                    {investor.title}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 13,
                        color: "#6b7280",
                      }}
                    >
                      <MapPin size={13} />
                      {investor.location}
                    </span>
                    <span style={{ color: "#e5e7eb" }}>·</span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 13,
                        color: "#6b7280",
                      }}
                    >
                      <Clock size={13} />
                      {investor.yearsInvesting}+ Tahun Investasi
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {investor.verificationBadges.map((badge, i) => (
                      <VerificationBadge key={i} badge={badge} size="md" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Match Insights */}
            <div className="card" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: "#eff6ff",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bot size={16} color="#2563eb" />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    AI Match Insights
                  </span>
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 12px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <Users size={13} />
                  {matchScore}% Match Score
                </span>
              </div>

              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16, lineHeight: 1.5 }}>
                Based on your current listing 'EduTech Nusantara', this investor shows a high probability of interest.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    icon: "✅",
                    title: "Sesuai dengan sektor EdTech Anda",
                    desc: "Budi recently exited a similar EdTech platform in 2023.",
                  },
                  {
                    icon: "📍",
                    title: "Riwayat investasi di Yogyakarta",
                    desc: "Strong preference for backing teams located in Central Java tech hubs.",
                  },
                  {
                    icon: "💰",
                    title: "Capital Range Alignment",
                    desc: "Your ask of Rp250jt falls exactly within their active deployment sweet spot.",
                  },
                ].map((insight) => (
                  <div
                    key={insight.title}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 14px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>
                        {insight.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
                        {insight.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="card" style={{ padding: "20px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                Tentang Investor
              </h2>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                {investor.bio}
              </p>
              <button
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#dc2626",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                🚩 Report this profile
              </button>
            </div>

            {/* Investment Preferences */}
            <div className="card" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {/* Active Sectors */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 10,
                    }}
                  >
                    <Briefcase size={14} color="#6b7280" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Active Sectors
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {investor.preferredSectors.map((sector) => (
                      <span
                        key={sector}
                        style={{
                          padding: "4px 10px",
                          background: "#f3f4f6",
                          color: "#374151",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 500,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capital Range */}
                <div
                  style={{
                    background: "#eff6ff",
                    borderRadius: 10,
                    padding: "16px",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                    Preferred Capital Range
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>
                    {formatCurrency(investor.capitalRangeMin)}t –{" "}
                    {formatCurrency(investor.capitalRangeMax)}t
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                    Per Initial Ticket
                  </div>
                </div>
              </div>

              {/* Business Stage */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <TrendingUp size={14} color="#6b7280" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Business Stage
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Pre-Seed", "Seed"].map((stage) => (
                    <span
                      key={stage}
                      style={{
                        padding: "4px 12px",
                        background: "#f3f4f6",
                        color: "#374151",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 500,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Track Record */}
            <div className="card" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  Track Record Highlight
                </h2>
                <button style={{ fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  View All (12)
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {investor.trackRecord.map((tr) => (
                  <div
                    key={tr.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 16,
                      }}
                    >
                      🏢
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                        {tr.companyName}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{tr.sector}</div>
                    </div>
                    <span
                      style={{
                        padding: "3px 10px",
                        background: "#f3f4f6",
                        color: "#374151",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        border: "1px solid #e5e7eb",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tr.stage} ({tr.round})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Actions + Affiliations */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Response Time */}
            <div className="card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                Typical response time:
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                {investor.typicalResponseHours} hours
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <MessageSquare size={15} />
                Hubungi Investor
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px",
                  background: "#fff",
                  color: "#374151",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <Bookmark size={15} />
                Simpan Profil
              </button>
              <div style={{ height: 1, background: "#e5e7eb", margin: "2px 0" }} />
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px",
                  background: "#fff",
                  color: "#374151",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <Eye size={15} />
                Lihat Listing yang Dilirik
              </button>
            </div>

            {/* Verified Affiliations */}
            <div className="card" style={{ padding: "16px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
                VERIFIED AFFILIATIONS
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {investor.affiliations.map((aff) => (
                  <div
                    key={aff.id}
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
                        borderRadius: 8,
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        flexShrink: 0,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {aff.organizationName.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                        {aff.organizationName}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {aff.role}
                      </div>
                    </div>
                    {aff.isVerified && (
                      <CheckCircle size={16} color="#16a34a" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .investor-profile-grid {
            grid-template-columns: 1fr !important;
          }
          .investor-profile-grid > div:last-child {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
