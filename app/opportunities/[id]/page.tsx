"use client";

import { useState } from "react";
import {
  MapPin,
  ArrowLeft,
  Lock,
  Shield,
  CheckCircle,
  Users,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { BusinessStageBadge } from "@/components/venturebridge/BusinessStageBadge";
import { mockOpportunities } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

export default function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const opportunity = mockOpportunities.find((o) => o.id === params.id) ?? mockOpportunities[0];
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");
  const [accessRequested, setAccessRequested] = useState(false);

  function handleRequestAccess() {
    if (!ndaAccepted) return;
    setAccessRequested(true);
    setShowAccessModal(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "32px 24px",
        }}
      >
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13 }}>
          <Link href="/explore" style={{ color: "#6b7280", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={14} />
            Kembali ke Explore
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Main Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header Card */}
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {opportunity.verificationStatus === "verified" && (
                  <VerificationBadge badge={{ type: "business", label: "Terverifikasi" }} size="md" />
                )}
                <BusinessStageBadge stage={opportunity.stage} size="md" />
                {opportunity.sector.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "3px 10px",
                      background: "#f3f4f6",
                      color: "#374151",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                {opportunity.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}>
                  <MapPin size={14} />
                  {opportunity.location}
                </span>
                {opportunity.teamSize && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}>
                    <Users size={14} />
                    {opportunity.teamSize} orang
                  </span>
                )}
              </div>

              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
                {opportunity.description}
              </p>
            </div>

            {/* Traction */}
            {opportunity.traction && (
              <div className="card" style={{ padding: "20px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                  Traksi & Pencapaian
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#f0fdf4",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={18} color="#16a34a" />
                  </div>
                  <p style={{ fontSize: 14, color: "#374151" }}>{opportunity.traction}</p>
                </div>
              </div>
            )}

            {/* Locked Information */}
            <div className="card" style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <Lock size={16} color="#9ca3af" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  Informasi Tertutup
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Detail model bisnis & revenue model",
                  "Proyeksi keuangan 3 tahun",
                  "Data pengguna & metrik detail",
                  "Informasi tim & equity split",
                  "Dokumen legal & cap table",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Lock size={14} color="#9ca3af" />
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>{item}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12, lineHeight: 1.5 }}>
                Informasi di atas hanya dapat diakses setelah pemilik bisnis menyetujui permintaan akses Anda.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Funding Card */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                Target Modal
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
                {formatCurrency(opportunity.targetFunding)}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {opportunity.seekingRoles.map((role) => (
                  <div
                    key={role}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      background: "#eff6ff",
                      borderRadius: 8,
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <CheckCircle size={14} color="#2563eb" />
                    <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
                      Mencari {role === "investor" ? "Investor" : role === "cofounder" ? "Co-Founder" : "Mentor"}
                    </span>
                  </div>
                ))}
              </div>

              {accessRequested ? (
                <div
                  style={{
                    padding: "12px",
                    background: "#f0fdf4",
                    borderRadius: 10,
                    border: "1px solid #86efac",
                    textAlign: "center",
                  }}
                >
                  <CheckCircle size={20} color="#16a34a" style={{ margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
                    Permintaan Terkirim!
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    Menunggu persetujuan pemilik
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAccessModal(true)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <FileText size={16} />
                  Minta Akses Informasi
                </button>
              )}
            </div>

            {/* Match Score */}
            {opportunity.matchScore && (
              <div className="card" style={{ padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                  Kecocokan AI dengan Profil Anda
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#2563eb" }}>
                  {opportunity.matchScore}%
                </div>
              </div>
            )}

            {/* Founder */}
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
                Founder
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {opportunity.founder.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {opportunity.founder.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Access Request Modal */}
      {showAccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowAccessModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Minta Akses Informasi
              </h2>
              <button
                onClick={() => setShowAccessModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* NDA Warning */}
            <div
              style={{
                padding: "14px 16px",
                background: "#fffbeb",
                borderRadius: 10,
                border: "1px solid #fcd34d",
                marginBottom: 20,
                display: "flex",
                gap: 10,
              }}
            >
              <Shield size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#d97706", marginBottom: 4 }}>
                  Lindungi Informasi Bisnis Anda
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
                  Dengan melanjutkan, Anda menyetujui bahwa informasi yang diterima bersifat konfidensial dan tidak akan dibagikan tanpa izin pemilik.
                </p>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                Pesan untuk Pemilik Bisnis
              </label>
              <textarea
                value={accessMessage}
                onChange={(e) => setAccessMessage(e.target.value)}
                placeholder="Perkenalkan diri Anda dan jelaskan mengapa Anda tertarik dengan bisnis ini..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* NDA Checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 20,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={ndaAccepted}
                onChange={(e) => setNdaAccepted(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#2563eb", width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                Saya menyetujui <strong>Perjanjian Kerahasiaan (NDA)</strong> dan memahami bahwa informasi yang saya terima bersifat konfidensial.
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleRequestAccess}
              disabled={!ndaAccepted}
              style={{
                width: "100%",
                padding: "12px",
                background: ndaAccepted ? "#2563eb" : "#e5e7eb",
                color: ndaAccepted ? "#fff" : "#9ca3af",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: ndaAccepted ? "pointer" : "not-allowed",
                transition: "background 0.15s ease",
              }}
            >
              Kirim Permintaan Akses
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
