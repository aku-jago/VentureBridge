"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { mockOpportunities } from "@/data/mock";
import {
  Search,
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Filter,
  MapPin,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

function VerifBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    verified: { label: "Terverifikasi", color: "#16a34a", bg: "#f0fdf4", icon: <CheckCircle size={11} /> },
    pending: { label: "Menunggu Review", color: "#d97706", bg: "#fffbeb", icon: <Clock size={11} /> },
    unverified: { label: "Belum Diverifikasi", color: "#64748b", bg: "#f8fafc", icon: <XCircle size={11} /> },
  };
  const s = map[status] ?? map.unverified;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", background: s.bg, color: s.color, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
      {s.icon} {s.label}
    </span>
  );
}

export default function AdminOpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [verifFilter, setVerifFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  const allSectors = Array.from(new Set(mockOpportunities.flatMap((o) => o.sector)));

  const filtered = mockOpportunities.filter((o) => {
    const matchSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.founder.name.toLowerCase().includes(search.toLowerCase()) ||
      o.location.toLowerCase().includes(search.toLowerCase());
    const matchVerif = verifFilter === "all" || o.verificationStatus === verifFilter;
    const matchSector = sectorFilter === "all" || o.sector.includes(sectorFilter);
    return matchSearch && matchVerif && matchSector;
  });

  const stats = {
    total: mockOpportunities.length,
    verified: mockOpportunities.filter((o) => o.verificationStatus === "verified").length,
    pending: mockOpportunities.filter((o) => o.verificationStatus === "pending").length,
    totalFunding: mockOpportunities.reduce((s, o) => s + o.targetFunding, 0),
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <AdminSidebar />

      <main style={{ marginLeft: 240, flex: 1, padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Kelola Ide Bisnis</h1>
            <p style={{ fontSize: 13, color: "#64748b" }}>Review dan verifikasi listing ide bisnis founder</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Listing", value: stats.total, icon: <FileText size={18} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Terverifikasi", value: stats.verified, icon: <Star size={18} color="#7c3aed" />, bg: "#f5f3ff", border: "#e9d5ff" },
            { label: "Menunggu Review", value: stats.pending, icon: <Clock size={18} color="#d97706" />, bg: "#fffbeb", border: "#fcd34d" },
            { label: "Total Funding Goal", value: formatCurrency(mockOpportunities.reduce((s, o) => s + o.targetFunding, 0)), icon: <TrendingUp size={18} color="#16a34a" />, bg: "#f0fdf4", border: "#86efac" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, background: s.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: s.label === "Total Funding Goal" ? 16 : 24, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Cari judul, founder, lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#64748b" />
            <select value={verifFilter} onChange={(e) => setVerifFilter(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff" }}>
              <option value="all">Semua Status</option>
              <option value="verified">Terverifikasi</option>
              <option value="pending">Menunggu Review</option>
              <option value="unverified">Belum Verifikasi</option>
            </select>
          </div>
          <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff" }}>
            <option value="all">Semua Sektor</option>
            {allSectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>{filtered.length} listing</div>
        </div>

        {/* Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: "60px", textAlign: "center", color: "#94a3b8", fontSize: 14, background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
              Tidak ada listing ditemukan
            </div>
          )}
          {filtered.map((opp) => (
            <div
              key={opp.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{opp.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{opp.founder.name}</span>
                    <span>•</span>
                    <MapPin size={11} />
                    <span>{opp.location.split(",")[0]}</span>
                  </div>
                </div>
                <VerifBadge status={opp.verificationStatus} />
              </div>

              {/* Sectors */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {opp.sector.map((s) => (
                  <span key={s} style={{ fontSize: 11, padding: "2px 8px", background: "#f5f3ff", color: "#7c3aed", borderRadius: 999, fontWeight: 600 }}>{s}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Funding Goal", value: formatCurrency(opp.targetFunding) },
                  { label: "Tim", value: (opp.teamSize ?? "—") + " orang" },
                  { label: "Stage", value: opp.stage },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 12, marginTop: 4 }}>
                <Link
                  href={`/opportunities/${opp.id}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", background: "#eff6ff", color: "#2563eb", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                >
                  <Eye size={13} /> Lihat Detail
                </Link>
                {opp.verificationStatus !== "verified" && (
                  <button
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    <CheckCircle size={13} /> Verifikasi
                  </button>
                )}
                {opp.verificationStatus === "verified" && (
                  <button
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    <XCircle size={13} /> Cabut Verifikasi
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
