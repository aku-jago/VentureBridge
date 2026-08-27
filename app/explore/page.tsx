"use client";

import Link from "next/link";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { mockOpportunities, mockCapexListings } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import {
  Lightbulb,
  Building2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  Users,
} from "lucide-react";

export default function ExploreHubPage() {
  const { isLoggedIn } = useAuth();

  const verifiedIdeas = mockOpportunities.filter((o) => o.verificationStatus === "verified");
  const verifiedCapex = mockCapexListings.filter((c) => c.verificationStatus === "verified");

  const hubContent = (
    <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #f5f3ff, #eff6ff)",
            border: "1px solid #e9d5ff",
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 16,
          }}
        >
          <Sparkles size={14} color="#7c3aed" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>
            Ekosistem Bisnis Indonesia
          </span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#0f172a", marginBottom: 12, lineHeight: 1.2 }}>
          Temukan Peluang<br />
          <span style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            yang Tepat untuk Anda
          </span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
          Pilih kategori yang Anda cari — ide bisnis inovatif dari founder,
          atau properti &amp; aset modal dari capex provider.
        </p>
      </div>

      {/* Two Category Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
        {/* Ide Bisnis */}
        <Link href="/explore/ideas" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "#fff",
              border: "2px solid #e9d5ff",
              borderRadius: 24,
              padding: "36px 32px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = "2px solid #7c3aed";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(124,58,237,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = "2px solid #e9d5ff";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius: "50%", opacity: 0.06 }} />

            <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Lightbulb size={28} color="#fff" />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              Ide Bisnis
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
              Temukan startup dan ide bisnis inovatif dari founder berbakat Indonesia.
              Investasi, co-found, atau jadilah mentor untuk bisnis berikutnya.
            </p>

            {/* Mini stats */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { icon: <TrendingUp size={14} color="#7c3aed" />, label: `${mockOpportunities.length} listing aktif` },
                { icon: <Sparkles size={14} color="#7c3aed" />, label: `${verifiedIdeas.length} terverifikasi` },
                { icon: <Users size={14} color="#7c3aed" />, label: "Investor & Co-Founder" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {s.icon}
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Sector pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {["EdTech", "FinTech", "AgriTech", "HealthTech", "F&B", "Marketplace"].map((s) => (
                <span key={s} style={{ fontSize: 11, padding: "3px 10px", background: "#f5f3ff", color: "#7c3aed", borderRadius: 999, fontWeight: 600 }}>{s}</span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#7c3aed", fontWeight: 700, fontSize: 14 }}>
              Jelajahi Ide Bisnis <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        {/* Capex */}
        <Link href="/explore/capex" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "#fff",
              border: "2px solid #bfdbfe",
              borderRadius: 24,
              padding: "36px 32px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = "2px solid #2563eb";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(37,99,235,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = "2px solid #bfdbfe";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "linear-gradient(135deg, #2563eb, #0891b2)", borderRadius: "50%", opacity: 0.06 }} />

            <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #2563eb, #0891b2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Building2 size={28} color="#fff" />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              Capex &amp; Properti
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
              Temukan tanah, bangunan, ruko, gudang, dan aset properti yang tersedia
              untuk disewa, dibeli, atau diinvestasikan bersama.
            </p>

            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { icon: <Building2 size={14} color="#2563eb" />, label: `${mockCapexListings.length} listing aktif` },
                { icon: <Sparkles size={14} color="#2563eb" />, label: `${verifiedCapex.length} terverifikasi` },
                { icon: <MapPin size={14} color="#2563eb" />, label: "Seluruh Indonesia" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {s.icon}
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {["Ruko", "Lahan", "Gudang", "Kantor", "Bangunan", "Mixed-Use"].map((s) => (
                <span key={s} style={{ fontSize: 11, padding: "3px 10px", background: "#eff6ff", color: "#2563eb", borderRadius: 999, fontWeight: 600 }}>{s}</span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#2563eb", fontWeight: 700, fontSize: 14 }}>
              Jelajahi Capex &amp; Properti <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      {/* Featured Ads Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          borderRadius: 20,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Sparkles size={16} color="#a78bfa" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Fitur Ads — Boost Listing Anda
            </span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            Tampilkan Listing Anda di Posisi Teratas
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Jangkau lebih banyak investor dan calon partner. Mulai dari Rp 99.000 untuk 3 hari boost.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <Link
            href="/explore/ideas"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Boost Ide Bisnis
          </Link>
          <Link
            href="/explore/capex"
            style={{
              padding: "10px 20px",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Boost Capex
          </Link>
        </div>
      </div>
    </div>
  );

  // If user is logged in, show inside Dashboard layout (DashboardSidebar on left, no duplicate top navbar)
  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content" style={{ padding: "36px 40px" }}>
          {hubContent}
        </main>
      </div>
    );
  }

  // If user is guest, show public layout with TopNavBar and Footer
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <TopNavBar />
      <main style={{ flex: 1, padding: "48px 24px" }}>
        {hubContent}
      </main>
      <Footer />
    </div>
  );
}
