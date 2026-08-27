"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useToken } from "@/contexts/TokenContext";
import { mockOpportunities, mockUsers } from "@/data/mock";
import {
  Users,
  FileText,
  Coins,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Activity,
  Star,
} from "lucide-react";
import Link from "next/link";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px 24px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</div>
        <div
          style={{
            width: 40,
            height: 40,
            background: iconBg,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
      </div>
      {trend && (
        <div style={{ fontSize: 12, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const {
    allTopUpRequests,
    allWithdrawRequests,
    investorTransactions,
    tokenRupiahValue,
  } = useToken();

  const pendingTopUps = allTopUpRequests.filter((r) => r.status === "waiting");
  const pendingWithdraws = allWithdrawRequests.filter((r) => r.status === "pending");
  const confirmedTopUps = allTopUpRequests.filter((r) => r.status === "confirmed");

  const totalRevenue = confirmedTopUps.reduce((s, r) => s + r.amount, 0);
  const totalTokenCirculating = confirmedTopUps.reduce((s, r) => s + r.tokens, 0);
  const verifiedOpps = mockOpportunities.filter((o) => o.verificationStatus === "verified");

  const recentActivity = [
    ...allTopUpRequests.slice(0, 3).map((r) => ({
      id: r.id,
      text: `${r.userName} mengajukan top up ${r.tokens} token`,
      time: r.requestedAt,
      type: "topup" as const,
      status: r.status,
    })),
    ...allWithdrawRequests.slice(0, 2).map((r) => ({
      id: r.id,
      text: `${r.founderName} minta withdraw ${r.tokens} token`,
      time: r.requestedAt,
      type: "withdraw" as const,
      status: r.status,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <AdminSidebar />

      <main style={{ marginLeft: 240, flex: 1, padding: "32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
            <span style={{ fontSize: 12, color: "#64748b" }}>System online</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
            Dashboard Admin
          </h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            Ringkasan aktivitas dan statistik VentureBridge Platform
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <StatCard
            label="Total Pengguna"
            value={mockUsers.length}
            sub="investor, founder, co-founder"
            icon={<Users size={20} color="#2563eb" />}
            iconBg="#eff6ff"
            trend="+2 bulan ini"
          />
          <StatCard
            label="Ide Bisnis Aktif"
            value={mockOpportunities.length}
            sub={`${verifiedOpps.length} terverifikasi`}
            icon={<FileText size={20} color="#7c3aed" />}
            iconBg="#f5f3ff"
            trend={`${verifiedOpps.length} verified`}
          />
          <StatCard
            label="Revenue Platform"
            value={formatRupiah(totalRevenue)}
            sub={`dari ${confirmedTopUps.length} top-up`}
            icon={<TrendingUp size={20} color="#16a34a" />}
            iconBg="#f0fdf4"
            trend="dari top-up token"
          />
          <StatCard
            label="Token Beredar"
            value={`${totalTokenCirculating} token`}
            sub={`≈ ${formatRupiah(totalTokenCirculating * tokenRupiahValue)}`}
            icon={<Coins size={20} color="#f59e0b" />}
            iconBg="#fffbeb"
          />
        </div>

        {/* Pending Actions + Activity */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Pending Actions */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Aksi Diperlukan</h2>
              <Link
                href="/admin/tokens"
                style={{ fontSize: 12, color: "#7c3aed", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}
              >
                Kelola Semua <ArrowRight size={12} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Pending Top Ups */}
              <Link
                href="/admin/tokens"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: pendingTopUps.length > 0 ? "#fffbeb" : "#fff",
                    border: pendingTopUps.length > 0 ? "1px solid #fcd34d" : "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: pendingTopUps.length > 0 ? "#fef3c7" : "#f3f4f6",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {pendingTopUps.length > 0 ? (
                      <Clock size={22} color="#d97706" />
                    ) : (
                      <CheckCircle size={22} color="#16a34a" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                      Top Up Menunggu Konfirmasi
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {pendingTopUps.length > 0
                        ? `${pendingTopUps.length} permintaan perlu dikonfirmasi`
                        : "Tidak ada permintaan pending"}
                    </div>
                  </div>
                  {pendingTopUps.length > 0 && (
                    <span
                      style={{
                        background: "#f59e0b",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 800,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {pendingTopUps.length}
                    </span>
                  )}
                </div>
              </Link>

              {/* Pending Withdraws */}
              <Link href="/admin/tokens" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: pendingWithdraws.length > 0 ? "#f0fdf4" : "#fff",
                    border: pendingWithdraws.length > 0 ? "1px solid #86efac" : "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: pendingWithdraws.length > 0 ? "#dcfce7" : "#f3f4f6",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {pendingWithdraws.length > 0 ? (
                      <Wallet size={22} color="#16a34a" />
                    ) : (
                      <CheckCircle size={22} color="#16a34a" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                      Withdraw Founder
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {pendingWithdraws.length > 0
                        ? `${pendingWithdraws.length} permintaan perlu diproses`
                        : "Semua sudah diproses"}
                    </div>
                  </div>
                  {pendingWithdraws.length > 0 && (
                    <span
                      style={{
                        background: "#16a34a",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 800,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {pendingWithdraws.length}
                    </span>
                  )}
                </div>
              </Link>

              {/* Opportunity Verification */}
              <Link href="/admin/opportunities" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 44, height: 44, background: "#f5f3ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Star size={22} color="#7c3aed" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Verifikasi Ide Bisnis</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {mockOpportunities.filter(o => o.verificationStatus === "pending").length} ide bisnis menunggu verifikasi
                    </div>
                  </div>
                  <ArrowRight size={16} color="#94a3b8" />
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Aktivitas Terkini</h2>
              <Activity size={16} color="#94a3b8" />
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {recentActivity.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  Belum ada aktivitas
                </div>
              )}
              {recentActivity.map((act, i) => (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 20px",
                    borderBottom: i < recentActivity.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        act.status === "confirmed" || act.status === "processed"
                          ? "#22c55e"
                          : act.status === "waiting" || act.status === "pending"
                          ? "#f59e0b"
                          : "#94a3b8",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#0f172a" }}>{act.text}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      {new Date(act.time).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background:
                        act.status === "confirmed" || act.status === "processed"
                          ? "#f0fdf4"
                          : "#fffbeb",
                      color:
                        act.status === "confirmed" || act.status === "processed"
                          ? "#16a34a"
                          : "#d97706",
                    }}
                  >
                    {act.status === "waiting"
                      ? "Pending"
                      : act.status === "confirmed"
                      ? "Confirmed"
                      : act.status === "pending"
                      ? "Pending"
                      : "Done"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Bottom */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 20,
            padding: "24px 28px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            color: "#fff",
          }}
        >
          {[
            { label: "Top Up Dikonfirmasi", value: confirmedTopUps.length },
            { label: "Investor Aktif", value: mockUsers.filter(u => u.role === "investor").length },
            { label: "Founder Aktif", value: mockUsers.filter(u => u.role === "founder").length },
            { label: "Ide Terverifikasi", value: verifiedOpps.length },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
