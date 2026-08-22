"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Compass } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { OpportunityCard } from "@/components/venturebridge/OpportunityCard";
import { mockOpportunities } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";

export default function SavedOpportunitiesPage() {
  const { user, isLoggedIn } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState(mockOpportunities.slice(0, 3));

  function handleRemove(id: string) {
    setSavedOpportunities((prev) => prev.filter((o) => o.id !== id));
  }

  const content = (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <Bookmark size={24} color="#2563eb" />
          Peluang Tersimpan (Saved)
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Daftar peluang bisnis dan startup yang Anda simpan untuk ditinjau lebih lanjut.
        </p>
      </div>

      {savedOpportunities.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {savedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={true}
              onSave={handleRemove}
            />
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <Bookmark size={40} color="#9ca3af" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Belum ada peluang tersimpan
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
            Jelajahi berbagai peluang bisnis dan klik ikon bookmark untuk menyimpannya di sini.
          </p>
          <Link
            href="/explore"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Compass size={16} />
            Jelajahi Peluang
          </Link>
        </div>
      )}
    </div>
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">{content}</main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />
      <main style={{ flex: 1 }}>{content}</main>
      <Footer />
    </div>
  );
}
