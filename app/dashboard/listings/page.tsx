"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit3, TrendingUp, CheckCircle, Clock, Building2 } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { BusinessStageBadge } from "@/components/venturebridge/BusinessStageBadge";
import { mockOpportunities } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Opportunity } from "@/types";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUserId = user?.id || "user-1";
    let userListings: Opportunity[] = [];

    // Load from local storage
    try {
      const stored = localStorage.getItem("vb_user_listings");
      if (stored) {
        const allStored: Opportunity[] = JSON.parse(stored);
        userListings = allStored.filter((item) => item.founderId === currentUserId);
      } else {
        // Initial fallback for default user-1 (Dzakki)
        const initial = mockOpportunities.filter((item) => item.founderId === currentUserId);
        userListings = initial;
        localStorage.setItem("vb_user_listings", JSON.stringify(mockOpportunities));
      }
    } catch {
      userListings = mockOpportunities.filter((item) => item.founderId === currentUserId);
    }

    setListings(userListings);
    setIsLoading(false);

    // Optional Supabase sync
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("listings")
        .select("*")
        .eq("user_id", currentUserId)
        .then(({ data, error }) => {
          if (data && !error && data.length > 0) {
            const remoteListings: Opportunity[] = data.map((d: any) => ({
              id: d.id,
              title: d.title,
              shortDescription: d.description || "",
              description: d.description || "",
              sector: [d.category || "Teknologi"],
              stage: d.stage || "seed",
              targetFunding: Number(d.target_amount || 0),
              location: d.location || "Indonesia",
              founderId: d.user_id,
              founder: { id: d.user_id, name: d.author_name || "Founder", initials: "FN" },
              seekingRoles: ["investor"],
              verificationStatus: d.is_verified ? "verified" : "pending",
              matchScore: d.avg_match || 85,
              createdAt: d.created_at,
              traction: d.traction,
            }));
            setListings(remoteListings);
          }
        });
    }
  }, [user]);

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
              Kelola dan pantau performa listing bisnis Anda yang aktif di Weaven.
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
        {listings.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: "#fff",
              border: "1px dashed #d1d5db",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Building2 size={28} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
              Belum Ada Listing Bisnis
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 440, margin: "0 auto 20px" }}>
              Anda belum mempublikasikan profil bisnis atau startup. Buat listing sekarang agar dapat dicocokkan dengan investor dan partner potensial.
            </p>
            <Link
              href="/dashboard/listings/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 2px 4px rgba(37,99,235,0.3)",
              }}
            >
              <Plus size={16} />
              Buat Listing Pertama Saya
            </Link>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}
