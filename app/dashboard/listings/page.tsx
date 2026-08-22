"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Eye, Edit3, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { BusinessStageBadge } from "@/components/venturebridge/BusinessStageBadge";
import { mockOpportunities } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

export default function MyListingsPage() {
  const [listings] = useState(mockOpportunities.slice(0, 3));

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Listing Bisnis Saya
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Kelola dan pantau performa listing bisnis Anda yang aktif di VentureBridge.
            </p>
          </div>
          <Link
            href="/dashboard/listings/new"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
            }}
          >
            <Plus size={16} />
            Buat Listing Baru
          </Link>
        </div>

        {/* Listings Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {listings.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  {item.verificationStatus === "verified" && (
                    <VerificationBadge badge={{ type: "business", label: "Terverifikasi" }} />
                  )}
                  <BusinessStageBadge stage={item.stage} />
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#16a34a",
                      background: "#f0fdf4",
                      padding: "2px 8px",
                      borderRadius: 4,
                      border: "1px solid #86efac",
                    }}
                  >
                    ● Aktif
                  </span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  {item.title}
                </h2>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 8 }}>
                  {item.shortDescription}
                </p>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af" }}>
                  <span>Target: <strong style={{ color: "#111827" }}>{formatCurrency(item.targetFunding)}</strong></span>
                  <span>·</span>
                  <span>Lokasi: <strong style={{ color: "#111827" }}>{item.location}</strong></span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>142</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Dilihat</div>
                </div>
                <div style={{ textAlign: "center", padding: "0 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#2563eb" }}>12</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Permintaan</div>
                </div>
                <div style={{ textAlign: "center", padding: "0 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>
                    {item.matchScore ?? 92}%
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Avg Match</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href={`/opportunities/${item.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    textDecoration: "none",
                  }}
                >
                  <Eye size={14} />
                  Lihat
                </Link>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
