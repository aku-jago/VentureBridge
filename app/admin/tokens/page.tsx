"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useToken } from "@/contexts/TokenContext";
import { TopUpRequest, WithdrawRequest } from "@/types";
import {
  CheckCircle,
  XCircle,
  Clock,
  Coins,
  Wallet,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Avatar({ initials, color = "#2563eb" }: { initials: string; color?: string }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    waiting: { label: "Menunggu", color: "#d97706", bg: "#fffbeb" },
    confirmed: { label: "Dikonfirmasi", color: "#16a34a", bg: "#f0fdf4" },
    rejected: { label: "Ditolak", color: "#dc2626", bg: "#fef2f2" },
    pending: { label: "Diproses", color: "#d97706", bg: "#fffbeb" },
    processed: { label: "Selesai", color: "#16a34a", bg: "#f0fdf4" },
  };
  const s = map[status] ?? { label: status, color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span style={{ padding: "3px 10px", background: s.bg, color: s.color, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

export default function AdminTokensPage() {
  const { allTopUpRequests, allWithdrawRequests, confirmTopUp, rejectTopUp, processWithdraw, tokenRupiahValue } = useToken();
  const [activeTab, setActiveTab] = useState<"topup" | "withdraw">("topup");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const waitingTopUps = allTopUpRequests.filter((r) => r.status === "waiting");
  const pendingWithdraws = allWithdrawRequests.filter((r) => r.status === "pending");
  const confirmedTopUps = allTopUpRequests.filter((r) => r.status === "confirmed");
  const totalRevenue = confirmedTopUps.reduce((s, r) => s + r.amount, 0);
  const totalTokensSold = confirmedTopUps.reduce((s, r) => s + r.tokens, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <AdminSidebar />

      <main style={{ marginLeft: 240, flex: 1, padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <Link
            href="/admin/dashboard"
            style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500 }}
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Token Management</h1>
            <p style={{ fontSize: 13, color: "#64748b" }}>Kelola top-up investor dan withdraw founder</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Top Up Menunggu", value: waitingTopUps.length, icon: <Clock size={18} color="#d97706" />, bg: "#fffbeb", border: "#fcd34d" },
            { label: "Withdraw Pending", value: pendingWithdraws.length, icon: <Wallet size={18} color="#16a34a" />, bg: "#f0fdf4", border: "#86efac" },
            { label: "Total Dikonfirmasi", value: confirmedTopUps.length, icon: <TrendingUp size={18} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Revenue Platform", value: formatRupiah(totalRevenue), icon: <Coins size={18} color="#7c3aed" />, bg: "#f5f3ff", border: "#e9d5ff" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, background: s.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#e2e8f0", borderRadius: 12, padding: 4, marginBottom: 20, width: "fit-content" }}>
          {[
            { id: "topup" as const, label: `Top Up${waitingTopUps.length > 0 ? ` (${waitingTopUps.length} pending)` : ""}` },
            { id: "withdraw" as const, label: `Withdraw${pendingWithdraws.length > 0 ? ` (${pendingWithdraws.length} pending)` : ""}` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "8px 20px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? "#0f172a" : "#64748b", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top Up Requests */}
        {activeTab === "topup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allTopUpRequests.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
                Tidak ada permintaan top up
              </div>
            )}
            {allTopUpRequests.map((req: TopUpRequest) => (
              <div key={req.id} style={{ background: "#fff", borderRadius: 16, padding: "20px", border: req.status === "waiting" ? "2px solid #fcd34d" : "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar initials={req.userInitials} color="#7c3aed" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{req.userName}</div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      Paket <strong>{req.packageName}</strong> — <strong>{req.tokens} token</strong> — {formatRupiah(req.amount)}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Diajukan: {formatDate(req.requestedAt)}</div>
                    {req.paymentProofNote && (
                      <div style={{ marginTop: 8, padding: "8px 12px", background: "#f8faff", borderRadius: 8, border: "1px solid #bfdbfe", fontSize: 12, color: "#374151" }}>
                        📝 {req.paymentProofNote}
                      </div>
                    )}
                  </div>
                  {req.status === "waiting" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      {confirmingId === req.id ? (
                        <>
                          <button onClick={() => { confirmTopUp(req.id); setConfirmingId(null); }}
                            style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle size={14} /> Ya, Konfirmasi
                          </button>
                          <button onClick={() => setConfirmingId(null)}
                            style={{ padding: "8px 12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setConfirmingId(req.id)}
                            style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle size={14} /> Konfirmasi
                          </button>
                          <button onClick={() => rejectTopUp(req.id)}
                            style={{ padding: "8px 16px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <XCircle size={14} /> Tolak
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {req.status === "confirmed" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 13, fontWeight: 600 }}>
                      <CheckCircle size={16} /> Dikonfirmasi
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
        )}

        {/* Withdraw Requests */}
        {activeTab === "withdraw" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allWithdrawRequests.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
                Tidak ada permintaan withdraw
              </div>
            )}
            {allWithdrawRequests.map((req: WithdrawRequest) => (
              <div key={req.id} style={{ background: "#fff", borderRadius: 16, padding: "20px", border: req.status === "pending" ? "2px solid #86efac" : "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar initials={req.founderInitials} color="#065f46" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{req.founderName}</div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      <strong>{req.tokens} token</strong> ≈ {formatRupiah(req.estimatedRupiah)}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {req.bankName} • {req.accountNumber} • a/n {req.accountName}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Diajukan: {formatDate(req.requestedAt)}</div>
                    {req.processedAt && (
                      <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>✓ Diproses: {formatDate(req.processedAt)}</div>
                    )}
                  </div>
                  {req.status === "pending" && (
                    <button onClick={() => processWithdraw(req.id)}
                      style={{ padding: "8px 16px", background: "#065f46", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle size={14} /> Tandai Selesai
                    </button>
                  )}
                  {req.status === "processed" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 13, fontWeight: 600 }}>
                      <CheckCircle size={16} /> Selesai
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
