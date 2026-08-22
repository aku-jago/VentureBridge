"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StatCard } from "@/components/venturebridge/StatCard";
import { OpportunityCard } from "@/components/venturebridge/OpportunityCard";
import { mockOpportunities } from "@/data/mock";
import { Compass, TrendingUp, MessageSquare, Handshake, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function InvestorDashboardPage() {
  const { user } = useAuth();
  const recommendedOpps = mockOpportunities.filter((o) => o.verificationStatus === "verified").slice(0, 4);

  const displayName = user?.name ? user.name.split(" ")[0] : "Investor";

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            Selamat datang kembali, {displayName}.
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Berikut adalah peluang terbaru yang relevan dengan preferensi investasi Anda.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <StatCard
            label="Opportunities"
            value="248"
            subLabel="Peluang baru"
            icon={<Compass size={18} color="#2563eb" />}
            iconBg="#eff6ff"
          />
          <StatCard
            label="Matches Baru"
            value="8"
            subLabel="Minggu ini"
            icon={<Handshake size={18} color="#16a34a" />}
            iconBg="#f0fdf4"
          />
          <StatCard
            label="Permintaan Akses"
            value="3"
            subLabel="Menunggu respons"
            icon={<TrendingUp size={18} color="#d97706" />}
            iconBg="#fffbeb"
          />
          <StatCard
            label="Pesan Baru"
            value="5"
            subLabel="Belum dibaca"
            icon={<MessageSquare size={18} color="#7c3aed" />}
            iconBg="#faf5ff"
          />
        </div>

        {/* Recommended Opportunities */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
              Peluang Direkomendasikan AI
            </h2>
            <Link
              href="/explore"
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
              Lihat Semua
              <ChevronRight size={14} />
            </Link>
          </div>
          <div
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
      </main>
    </div>
  );
}
