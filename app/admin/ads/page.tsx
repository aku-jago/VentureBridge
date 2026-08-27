"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAds } from "@/contexts/AdsContext";
import { ArrowLeft, CheckCircle, XCircle, Zap, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { AdsRequest } from "@/types";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    waiting: { label: "Menunggu", color: "#d97706", bg: "#fffbeb" },
    active: { label: "Aktif", color: "#16a34a", bg: "#f0fdf4" },
    expired: { label: "Expired", color: "#6b7280", bg: "#f3f4f6" },
    rejected: { label: "Ditolak", color: "#dc2626", bg: "#fef2f2" },
  };
  const s = map[status] ?? { label: status, color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span style={{ padding: "3px 10px", background: s.bg, color: s.color, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{s.label}</span>
  );
}

export default function AdminAdsPage() {
  const { allAdsRequests, activateAds, rejectAds } = useAds();
  const [tab, setTab] = useState<"waiting" | "all">("waiting");

  const waiting = allAdsRequests.filter((r) => r.status === "waiting");
  const active = allAdsRequests.filter((r) => r.status === "active");
  const totalRevenue = allAdsRequests.filter((r) => r.status === "active" || r.status === "expired").reduce((s, r) => s + r.amount, 0);

  const displayed = tab === "waiting" ? waiting : allAdsRequests;

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Ads Management</h1>
            <p style={{ fontSize: 13, color: "#64748b" }}>Kelola permintaan boost listing dari founder dan capex owner</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Menunggu Konfirmasi", value: waiting.length, icon: <Clock size={18} color="#d97706" />, bg: "#fffbeb", border: "#fcd34d" },
            { label: "Iklan Aktif", value: active.length, icon: <Zap size={18} color="#7c3aed" />, bg: "#f5f3ff", border: "#e9d5ff" },
            { label: "Total Ads Request", value: allAdsRequests.length, icon: <TrendingUp size={18} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Revenue dari Ads", value: formatRupiah(totalRevenue), icon: <CheckCircle size={18} color="#16a34a" />, bg: "#f0fdf4", border: "#86efac" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, background: s.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: typeof s.value === "string" ? 16 : 24, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#e2e8f0", borderRadius: 12, padding: 4, marginBottom: 20, width: "fit-content" }}>
          {[
            { id: "waiting" as const, label: `Menunggu${waiting.length > 0 ? ` (${waiting.length})` : ""}` },
            { id: "all" as const, label: `Semua (${allAdsRequests.length})` },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "8px 20px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0f172a" : "#64748b", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayed.length === 0 && (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "60px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              {tab === "waiting" ? "Tidak ada permintaan pending" : "Belum ada ads request"}
            </div>
          )}
          {displayed.map((req: AdsRequest) => (
            <div key={req.id} style={{ background: "#fff", borderRadius: 16, padding: "20px", border: req.status === "waiting" ? "2px solid #fcd34d" : "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, background: req.listingType === "idea" ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "linear-gradient(135deg, #2563eb, #0891b2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {req.userInitials}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{req.userName}</span>
                    <StatusBadge status={req.status} />
                    <span style={{ fontSize: 11, padding: "2px 8px", background: req.listingType === "idea" ? "#f5f3ff" : "#eff6ff", color: req.listingType === "idea" ? "#7c3aed" : "#2563eb", borderRadius: 999, fontWeight: 600 }}>
                      {req.listingType === "idea" ? "Ide Bisnis" : "Capex"}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>
                    <strong>"{req.listingTitle}"</strong> — Paket <strong>{req.packageName}</strong> ({req.durationDays} hari) — <strong style={{ color: "#7c3aed" }}>{formatRupiah(req.amount)}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Diajukan: {formatDate(req.requestedAt)}</div>
                  {req.activatedAt && <div style={{ fontSize: 12, color: "#16a34a" }}>Aktif: {formatDate(req.activatedAt)} — Berakhir: {req.expiresAt ? formatDate(req.expiresAt) : "—"}</div>}
                  {req.paymentProofNote && (
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#f8faff", borderRadius: 8, border: "1px solid #bfdbfe", fontSize: 12, color: "#374151" }}>
                      📝 {req.paymentProofNote}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {req.status === "waiting" && (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => activateAds(req.id)}
                      style={{ padding: "8px 16px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Zap size={14} /> Aktifkan Iklan
                    </button>
                    <button onClick={() => rejectAds(req.id)}
                      style={{ padding: "8px 16px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <XCircle size={14} /> Tolak
                    </button>
                  </div>
                )}
                {req.status === "active" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>
                    <Zap size={16} /> Aktif
                  </div>
                )}
                {req.status === "rejected" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#dc2626", fontSize: 13, fontWeight: 600 }}>
                    <XCircle size={16} /> Ditolak
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
