"use client";

import { useState } from "react";
import {
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  MapPin,
  Globe,
  AtSign,
  FileText,
  ChevronRight,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

type VerificationStatus = "pending" | "under_review" | "verified" | "needs_revision" | "rejected";

interface VerificationField {
  id: string;
  label: string;
  status: "complete" | "incomplete" | "optional";
  value?: string;
}

const STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: {
    label: "Belum Diajukan",
    color: "#9ca3af",
    bg: "#f3f4f6",
    border: "#e5e7eb",
    icon: <Clock size={16} color="#9ca3af" />,
  },
  under_review: {
    label: "Sedang Ditinjau",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
    icon: <Clock size={16} color="#d97706" />,
  },
  verified: {
    label: "Terverifikasi",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
    icon: <CheckCircle size={16} color="#16a34a" />,
  },
  needs_revision: {
    label: "Perlu Revisi",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    icon: <AlertCircle size={16} color="#dc2626" />,
  },
  rejected: {
    label: "Ditolak",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    icon: <AlertCircle size={16} color="#dc2626" />,
  },
};

export default function BusinessVerificationPage() {
  const [overallStatus] = useState<VerificationStatus>("under_review");
  const [businessName, setBusinessName] = useState("EDUKITA");
  const [nib, setNib] = useState("");
  const [businessLocation, setBusinessLocation] = useState("Yogyakarta, Indonesia");
  const [website, setWebsite] = useState("https://edukita.id");
  const [instagram, setInstagram] = useState("@edukita_id");

  const statusConfig = STATUS_CONFIG[overallStatus];

  const fields: VerificationField[] = [
    { id: "name", label: "Nama Bisnis", status: "complete", value: businessName },
    { id: "nib", label: "Nomor Induk Berusaha (NIB)", status: nib ? "complete" : "incomplete" },
    { id: "docs", label: "Dokumen Bisnis", status: "incomplete" },
    { id: "photos", label: "Foto Bisnis", status: "incomplete" },
    { id: "location", label: "Lokasi Bisnis", status: "complete", value: businessLocation },
    { id: "social", label: "Media Sosial", status: "complete", value: instagram },
    { id: "campus", label: "Afiliasi Kampus", status: "optional" },
  ];

  const completedCount = fields.filter((f) => f.status === "complete").length;
  const totalRequired = fields.filter((f) => f.status !== "optional").length;
  const progress = Math.round((completedCount / fields.length) * 100);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Verifikasi Bisnis
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>
          Lengkapi verifikasi bisnis Anda untuk meningkatkan kepercayaan investor.
        </p>

        <div
          className="verification-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Main Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Status Banner */}
            <div
              style={{
                padding: "16px 20px",
                background: statusConfig.bg,
                border: `1px solid ${statusConfig.border}`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {statusConfig.icon}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: statusConfig.color }}>
                  Status: {statusConfig.label}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  {overallStatus === "under_review"
                    ? "Tim Weaven sedang meninjau dokumen Anda. Estimasi 2-3 hari kerja."
                    : "Lengkapi semua dokumen yang diperlukan untuk proses verifikasi."}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
                Informasi Dasar Bisnis
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Business Name */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Nama Bisnis *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 14,
                      color: "#111827",
                      outline: "none",
                    }}
                  />
                </div>

                {/* NIB */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Nomor Induk Berusaha (NIB)
                  </label>
                  <input
                    type="text"
                    value={nib}
                    onChange={(e) => setNib(e.target.value)}
                    placeholder="Contoh: 1234567890123"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 14,
                      color: "#111827",
                      outline: "none",
                    }}
                  />
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                    NIB dari OSS (Online Single Submission) akan mempercepat proses verifikasi.
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Lokasi Bisnis *
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px 9px 34px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 14,
                        color: "#111827",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Website + Social */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                      Website
                    </label>
                    <div style={{ position: "relative" }}>
                      <Globe size={16} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "9px 12px 9px 34px",
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                      Instagram
                    </label>
                    <div style={{ position: "relative" }}>
                      <AtSign size={16} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "9px 12px 9px 34px",
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                          fontSize: 14,
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
                Dokumen Pendukung
              </h2>

              {[
                { label: "Dokumen Bisnis (SIUP, Akta, dll)", icon: <FileText size={18} color="#2563eb" /> },
                { label: "Foto Produk / Operasional", icon: <Building2 size={18} color="#7c3aed" /> },
              ].map((doc) => (
                <div
                  key={doc.label}
                  style={{
                    border: "2px dashed #e5e7eb",
                    borderRadius: 10,
                    padding: "24px",
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: 12,
                    transition: "border-color 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#2563eb";
                    (e.currentTarget as HTMLDivElement).style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    {doc.icon}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    {doc.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    Klik untuk upload atau drag & drop (PDF, JPG, PNG max 10MB)
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Simpan & Ajukan Verifikasi
              </button>
              <button
                style={{
                  padding: "12px 24px",
                  background: "#fff",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Simpan Draft
              </button>
            </div>
          </div>

          {/* Right: Progress Sidebar */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
              Progress Verifikasi
            </h3>

            {/* Progress Bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>{completedCount} dari {fields.length} lengkap</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{progress}%</span>
              </div>
              <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "#2563eb",
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: field.status === "complete" ? "#f0fdf4" : "#f8f9fa",
                    border: `1px solid ${field.status === "complete" ? "#86efac" : "#e5e7eb"}`,
                  }}
                >
                  {field.status === "complete" ? (
                    <CheckCircle size={14} color="#16a34a" />
                  ) : field.status === "optional" ? (
                    <Clock size={14} color="#9ca3af" />
                  ) : (
                    <AlertCircle size={14} color="#d97706" />
                  )}
                  <span
                    style={{
                      fontSize: 12,
                      color: field.status === "complete" ? "#16a34a" : field.status === "optional" ? "#9ca3af" : "#374151",
                      fontWeight: field.status === "complete" ? 600 : 400,
                    }}
                  >
                    {field.label}
                  </span>
                  {field.status === "optional" && (
                    <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: "auto" }}>Opsional</span>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "12px 14px",
                background: "#eff6ff",
                borderRadius: 8,
                border: "1px solid #bfdbfe",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                💡 Tips Weaven
              </div>
              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                Bisnis terverifikasi mendapatkan 3x lebih banyak permintaan akses dari investor.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .verification-grid {
            grid-template-columns: 1fr !important;
          }
          .verification-grid > div:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
