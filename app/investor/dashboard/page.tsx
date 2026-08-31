"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatCard } from "@/components/venturebridge/StatCard";
import { OpportunityCard } from "@/components/venturebridge/OpportunityCard";
import { mockOpportunities, mockCapexListings } from "@/data/mock";
import { Compass, TrendingUp, Handshake, Building2, Coins, Plus, ArrowRight, Sparkles, Send, Inbox, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToken } from "@/contexts/TokenContext";
import { useOffer } from "@/contexts/OfferContext";

export default function InvestorDashboardPage() {
  const { user } = useAuth();
  const { investorBalance } = useToken();
  const { myInboundOffers, pendingOffersCount, acceptOffer, declineOffer } = useOffer();
  const recommendedOpps = mockOpportunities.filter((o) => o.verificationStatus === "verified").slice(0, 4);
  const recommendedCapex = mockCapexListings.filter((c) => c.verificationStatus === "verified").slice(0, 2);

  const displayName = user?.name ? user.name.split(" ")[0] : "Investor";
  const recentOffers = myInboundOffers.slice(0, 3);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Selamat datang kembali, {displayName}.
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Berikut adalah deal-flow peluang startup dan aset capex yang sesuai dengan kriteria modal Anda.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
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
              <Plus size={16} /> Post Kebutuhan / Capex di Feed
            </Link>
            <Link
              href="/investor/tokens"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Coins size={16} /> Saldo Token: {investorBalance}
            </Link>
          </div>
        </div>

        {/* Reverse Demand Callout Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            borderRadius: 18,
            padding: "24px 28px",
            marginBottom: 28,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#a78bfa", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
              <Sparkles size={14} /> Reverse Inquiry untuk Investor
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              Punya Kriteria Bisnis atau Butuh Capex Tertentu?
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", maxWidth: 600, lineHeight: 1.5 }}>
              Posting kriteria Anda di Feed (misal: "Mencari ruko disekitar Jogja untuk ekspansi resto"). Para founder dan pemilik capex di ekosistem akan langsung me-reach out Anda!
            </p>
          </div>
          <Link
            href="/feed"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Send size={14} /> Buat Request di Feed
          </Link>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <StatCard
            label="Peluang Ide Bisnis"
            value="248"
            subLabel="Startup tahap awal"
            icon={<Compass size={18} color="#2563eb" />}
            iconBg="#eff6ff"
          />
          <StatCard
            label="Aset Capex & Properti"
            value="45"
            subLabel="Lahan, ruko & gudang"
            icon={<Building2 size={18} color="#0891b2" />}
            iconBg="#ecfeff"
          />
          <StatCard
            label="Matches Baru AI"
            value="8"
            subLabel="Sesuai tiket modal Anda"
            icon={<Handshake size={18} color="#16a34a" />}
            iconBg="#f0fdf4"
          />
          <StatCard
            label="Tawaran Masuk (Deals)"
            value={`${pendingOffersCount} Menunggu`}
            subLabel="Dari founder & capex"
            icon={<Inbox size={18} color="#16a34a" />}
            iconBg="#f0fdf4"
          />
        </div>

        {/* Inbound Deals / Offers Section */}
        {recentOffers.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "2px 8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>
                  <Inbox size={12} /> Inbound Deal-Flow
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                  Tawaran &amp; Pitching Masuk Terbaru
                </h2>
              </div>
              <Link
                href="/investor/offers"
                style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
              >
                Lihat Semua ({myInboundOffers.length}) <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentOffers.map((offer) => (
                <div
                  key={offer.id}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "18px 20px",
                    border: offer.status === "pending" ? "2px solid #bbf7d0" : "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 280 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: offer.senderAvatarColor || "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {offer.senderInitials}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {offer.senderName}
                        </span>
                        <span style={{ fontSize: 11, padding: "2px 8px", background: offer.offerType === "capex" ? "#eff6ff" : "#fffbeb", color: offer.offerType === "capex" ? "#2563eb" : "#d97706", borderRadius: 999, fontWeight: 700 }}>
                          {offer.offerType === "capex" ? "🏢 Capex" : "💡 Pitch Ide"}
                        </span>
                        {offer.status === "accepted" && (
                          <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: 999, fontWeight: 700 }}>
                            ✓ Diterima
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginTop: 2 }}>
                        {offer.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        {offer.message.slice(0, 100)}...
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {offer.status === "pending" ? (
                      <>
                        <button
                          onClick={() => acceptOffer(offer.id)}
                          style={{ padding: "7px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                        >
                          <CheckCircle size={13} /> Terima
                        </button>
                        <button
                          onClick={() => declineOffer(offer.id)}
                          style={{ padding: "7px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/dashboard/messages"
                        style={{ padding: "7px 14px", background: "#2563eb", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                      >
                        Buka Chat
                      </Link>
                    )}
                    <Link
                      href="/investor/offers"
                      style={{ fontSize: 12, color: "#64748b", textDecoration: "none", fontWeight: 600 }}
                    >
                      Detail →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ide Bisnis Rekomendasi Section */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Rekomendasi Ide Bisnis Terverifikasi
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                Gunakan token Anda untuk mengakses proyeksi finansial dan detail founder.
              </p>
            </div>
            <Link
              href="/explore/ideas"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              Lihat Semua Ide ({mockOpportunities.length}) <ArrowRight size={14} />
            </Link>
          </div>

          <div
            className="investor-cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {recommendedOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>

        {/* Capex & Properti Section for Investor Expansion */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Aset Capex &amp; Properti untuk Ekspansi Bisnis
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                Temukan tempat usaha, ruko, gudang, atau lahan komersial siap pakai.
              </p>
            </div>
            <Link
              href="/explore/capex"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: "#0891b2",
                textDecoration: "none",
              }}
            >
              Jelajahi Capex ({mockCapexListings.length}) <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {recommendedCapex.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: 999 }}>
                    ✓ Terverifikasi
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 999 }}>
                    {c.capexType === "rent" ? "Disewa" : "Dijual"}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                  {c.shortDescription}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                    Rp {(c.price / (c.price >= 1e9 ? 1e9 : 1e6)).toFixed(0)} {c.price >= 1e9 ? "Miliar" : "Juta"}
                    {c.capexType === "rent" ? "/bln" : ""}
                  </div>
                  <Link
                    href="/explore/capex"
                    style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
                  >
                    Detail Properti →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .investor-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .investor-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
