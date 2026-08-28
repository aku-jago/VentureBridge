"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { mockUsers } from "@/data/mock";
import {
  Search,
  ArrowLeft,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  User,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  founder: { label: "Founder", color: "#7c3aed", bg: "#f5f3ff" },
  investor: { label: "Investor", color: "#2563eb", bg: "#eff6ff" },
  co_founder: { label: "Co-Founder", color: "#d97706", bg: "#fffbeb" },
  capex_provider: { label: "Capex Provider", color: "#16a34a", bg: "#f0fdf4" },
  mentor: { label: "Mentor", color: "#0891b2", bg: "#ecfeff" },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.company?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && u.isVerified) ||
      (verifiedFilter === "unverified" && !u.isVerified);
    return matchesSearch && matchesRole && matchesVerified;
  });

  const stats = {
    total: mockUsers.length,
    verified: mockUsers.filter((u) => u.isVerified).length,
    founders: mockUsers.filter((u) => u.role === "founder").length,
    investors: mockUsers.filter((u) => u.role === "investor").length,
  };

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
              Kelola Pengguna
            </h1>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Pantau dan kelola semua pengguna Weaven
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Pengguna", value: stats.total, icon: <Users size={18} color="#2563eb" />, bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Terverifikasi", value: stats.verified, icon: <Shield size={18} color="#7c3aed" />, bg: "#f5f3ff", border: "#e9d5ff" },
            { label: "Founder", value: stats.founders, icon: <Briefcase size={18} color="#d97706" />, bg: "#fffbeb", border: "#fcd34d" },
            { label: "Investor", value: stats.investors, icon: <TrendingUp size={18} color="#16a34a" />, bg: "#f0fdf4", border: "#86efac" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, background: s.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                border: "1px solid #e2e8f0",
                borderRadius: 9,
                fontSize: 13,
                color: "#0f172a",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#64748b" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff" }}
            >
              <option value="all">Semua Role</option>
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
              <option value="co_founder">Co-Founder</option>
              <option value="capex_provider">Capex Provider</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff" }}
          >
            <option value="all">Semua Status</option>
            <option value="verified">Terverifikasi</option>
            <option value="unverified">Belum Verifikasi</option>
          </select>

          <div style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>
            {filtered.length} pengguna
          </div>
        </div>

        {/* User Table */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1fr 1fr 0.8fr 1fr",
              gap: 12,
              padding: "12px 20px",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            <div>Pengguna</div>
            <div>Role</div>
            <div>Perusahaan</div>
            <div>Lokasi</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 && (
            <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              Tidak ada pengguna ditemukan
            </div>
          )}
          {filtered.map((user, i) => {
            const roleInfo = ROLE_LABELS[user.role] ?? { label: user.role, color: "#6b7280", bg: "#f3f4f6" };
            return (
              <div
                key={user.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1fr 1fr 0.8fr 1fr",
                  gap: 12,
                  padding: "14px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                  alignItems: "center",
                }}
              >
                {/* Name + Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {user.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{user.title}</div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: roleInfo.bg, color: roleInfo.color }}>
                    {roleInfo.label}
                  </span>
                </div>

                {/* Company */}
                <div style={{ fontSize: 13, color: "#374151" }}>{user.company ?? "—"}</div>

                {/* Location */}
                <div style={{ fontSize: 12, color: "#64748b" }}>{user.location?.split(",")[0] ?? "—"}</div>

                {/* Verified */}
                <div>
                  {user.isVerified ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={14} color="#16a34a" />
                      <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>Verified</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <XCircle size={14} color="#94a3b8" />
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>—</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={{
                      padding: "5px 12px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      border: "none",
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Eye size={12} /> Detail
                  </button>
                  {!user.isVerified && (
                    <button
                      style={{
                        padding: "5px 12px",
                        background: "#f0fdf4",
                        color: "#16a34a",
                        border: "none",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Shield size={12} /> Verifikasi
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
