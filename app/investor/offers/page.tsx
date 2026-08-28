"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Inbox,
  CheckCircle,
  XCircle,
  MessageSquare,
  Building2,
  Lightbulb,
  Handshake,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  Send,
  Sparkles,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useOffer } from "@/contexts/OfferContext";
import { useAuth } from "@/contexts/AuthContext";

export default function InvestorOffersPage() {
  const { myInboundOffers, pendingOffersCount, acceptOffer, declineOffer } = useOffer();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "accepted">("all");
  const [selectedOfferType, setSelectedOfferType] = useState<string>("all");

  const filteredOffers = myInboundOffers.filter((o) => {
    if (activeTab === "pending" && o.status !== "pending") return false;
    if (activeTab === "accepted" && o.status !== "accepted") return false;
    if (selectedOfferType !== "all" && o.offerType !== selectedOfferType) return false;
    return true;
  });

  const acceptedCount = myInboundOffers.filter((o) => o.status === "accepted").length;

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>
              <Inbox size={13} /> Inbound Deal-Flow
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Tawaran Masuk dari Ekosistem
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Founder dan pemilik capex yang me-reach out untuk merespons postingan kebutuhan modal atau capex Anda di Feed.
            </p>
          </div>

          <Link
            href="/feed"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              background: "linear-gradient(135deg, #16a34a, #059669)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
            }}
          >
            <Send size={15} /> Buat Request Baru di Feed
          </Link>
        </div>

        {/* Tabs & Type Filters */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "all" as const, label: `Semua (${myInboundOffers.length})` },
              { key: "pending" as const, label: `Menunggu (${pendingOffersCount})` },
              { key: "accepted" as const, label: `Diterima (${acceptedCount})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: activeTab === t.key ? "1px solid #16a34a" : "1px solid #e5e7eb",
                  background: activeTab === t.key ? "#16a34a" : "#fff",
                  color: activeTab === t.key ? "#fff" : "#4b5563",
                  fontSize: 13,
                  fontWeight: activeTab === t.key ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "all", label: "Semua Kategori" },
              { key: "capex", label: "🏢 Penawaran Capex" },
              { key: "idea", label: "💡 Pitch Ide Bisnis" },
              { key: "collaboration", label: "🤝 Kolaborasi" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedOfferType(f.key)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: selectedOfferType === f.key ? "1px solid #2563eb" : "1px solid #e5e7eb",
                  background: selectedOfferType === f.key ? "#eff6ff" : "#fff",
                  color: selectedOfferType === f.key ? "#2563eb" : "#6b7280",
                  fontSize: 12,
                  fontWeight: selectedOfferType === f.key ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <Inbox size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
              Belum Ada Tawaran Masuk
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 420, margin: "0 auto 20px" }}>
              Posting kriteria kebutuhan capex atau tiket modal Anda di Feed agar para founder &amp; pemilik aset dapat me-reach out Anda secara langsung.
            </p>
            <Link
              href="/feed"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: "#16a34a",
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Send size={14} /> Buka Feed &amp; Buat Post
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredOffers.map((offer) => {
              const isPending = offer.status === "pending";
              const isAccepted = offer.status === "accepted";

              return (
                <div
                  key={offer.id}
                  className="card"
                  style={{
                    padding: "24px",
                    background: "#fff",
                    borderRadius: 16,
                    border: isPending ? "2px solid #bbf7d0" : "1px solid #e5e7eb",
                    boxShadow: isPending ? "0 4px 16px rgba(22,163,74,0.06)" : "0 2px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Sender Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: offer.senderAvatarColor || "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {offer.senderInitials}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                            {offer.senderName}
                          </span>
                          <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 999, fontWeight: 700, textTransform: "capitalize" }}>
                            {offer.senderRole}
                          </span>
                          {isPending && (
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#fffbeb", color: "#d97706", borderRadius: 999, fontWeight: 700, border: "1px solid #fcd34d" }}>
                              Menunggu Respons
                            </span>
                          )}
                          {isAccepted && (
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: 999, fontWeight: 700, border: "1px solid #bbf7d0" }}>
                              ✓ Diterima
                            </span>
                          )}
                          {offer.status === "declined" && (
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#fef2f2", color: "#dc2626", borderRadius: 999, fontWeight: 700 }}>
                              Ditolak
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                          {offer.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Offer Type Badge */}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: offer.offerType === "capex" ? "#eff6ff" : offer.offerType === "idea" ? "#fffbeb" : "#faf5ff",
                        color: offer.offerType === "capex" ? "#2563eb" : offer.offerType === "idea" ? "#d97706" : "#7c3aed",
                        border: offer.offerType === "capex" ? "1px solid #bfdbfe" : offer.offerType === "idea" ? "1px solid #fcd34d" : "1px solid #e9d5ff",
                      }}
                    >
                      {offer.offerType === "capex" ? "🏢 Penawaran Capex / Properti" : offer.offerType === "idea" ? "💡 Pitching Ide Bisnis" : "🤝 Ajakan Kolaborasi"}
                    </span>
                  </div>

                  {/* Context note */}
                  {offer.relatedPostSnippet && (
                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px", border: "1px solid #e2e8f0", marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 2 }}>
                        Merespons Postingan Feed:
                      </div>
                      <div style={{ fontSize: 13, color: "#334155", fontStyle: "italic" }}>
                        "{offer.relatedPostSnippet}"
                      </div>
                    </div>
                  )}

                  {/* Title & Message */}
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                    {offer.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 16, whiteSpace: "pre-line" }}>
                    {offer.message}
                  </p>

                  {/* Contact details */}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16, background: "#f8fafc", padding: "10px 14px", borderRadius: 10 }}>
                    {offer.contactEmail && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                        <Mail size={14} color="#64748b" /> {offer.contactEmail}
                      </div>
                    )}
                    {offer.contactPhone && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                        <Phone size={14} color="#64748b" /> {offer.contactPhone}
                      </div>
                    )}
                  </div>

                  {/* Action row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {isPending && (
                        <>
                          <button
                            onClick={() => acceptOffer(offer.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 18px",
                              background: "linear-gradient(135deg, #16a34a, #059669)",
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <CheckCircle size={15} /> Terima Tawaran &amp; Buka Kontak
                          </button>
                          <button
                            onClick={() => declineOffer(offer.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 14px",
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <XCircle size={15} /> Tolak
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <Link
                          href={`/dashboard/messages?to=${offer.senderId}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            background: "#2563eb",
                            color: "#fff",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          <MessageSquare size={15} /> Buka Percakapan Chat
                        </Link>
                      )}
                    </div>

                    <Link
                      href={`/profile/${offer.senderId}`}
                      style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      Lihat Profil Founder <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
