"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  Globe,
  Edit3,
  Save,
  X,
  Key,
  CheckCircle,
  Bell,
  Coins,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useToken } from "@/contexts/TokenContext";
import { mockOpportunities, mockUsers } from "@/data/mock";

export default function AdminProfilePage() {
  const { allTopUpRequests, allWithdrawRequests, tokenRupiahValue } = useToken();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [form, setForm] = useState({
    name: "Admin VentureBridge",
    email: "admin@venturebridge.id",
    phone: "+62 812-3456-7890",
    website: "venturebridge.id",
    bio: "Super Administrator VentureBridge Platform. Bertanggung jawab atas pengelolaan sistem, konfirmasi pembayaran token, dan verifikasi pengguna.",
    bankName: "BCA",
    accountNumber: "1234567890",
    accountHolder: "VentureBridge Indonesia",
  });

  const [editForm, setEditForm] = useState({ ...form });

  function handleSave() {
    setForm({ ...editForm });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditForm({ ...form });
    setIsEditing(false);
  }

  const confirmedRevenue = allTopUpRequests
    .filter((r) => r.status === "confirmed")
    .reduce((s, r) => s + r.amount, 0);

  const adminStats = [
    { label: "Total Revenue", value: `Rp ${confirmedRevenue.toLocaleString("id-ID")}`, icon: <Coins size={18} color="#7c3aed" />, bg: "#f5f3ff" },
    { label: "Top Up Dikonfirmasi", value: allTopUpRequests.filter((r) => r.status === "confirmed").length, icon: <CheckCircle size={18} color="#16a34a" />, bg: "#f0fdf4" },
    { label: "Pengguna Platform", value: mockUsers.length, icon: <Users size={18} color="#2563eb" />, bg: "#eff6ff" },
    { label: "Ide Bisnis Aktif", value: mockOpportunities.length, icon: <FileText size={18} color="#d97706" />, bg: "#fffbeb" },
  ];

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
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Profil Admin</h1>
            <p style={{ fontSize: 13, color: "#64748b" }}>Kelola informasi dan konfigurasi akun admin</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
          {/* Left: Avatar + Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Profile Card */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "28px", textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 auto 16px",
                }}
              >
                A
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{form.name}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f5f3ff", color: "#7c3aed", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                <Shield size={12} /> Super Admin
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{form.email}</div>
            </div>

            {/* Admin Stats */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Statistik Admin</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {adminStats.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: s.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Info */}
            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 16, padding: "20px", color: "#fff" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rekening Penerima</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Bank</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{form.bankName}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>No. Rekening</div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.05em", marginBottom: 10 }}>{form.accountNumber}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Atas Nama</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{form.accountHolder}</div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Basic Info */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Informasi Akun</div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <Edit3 size={14} /> Edit
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSave}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <Save size={14} /> Simpan
                    </button>
                    <button onClick={handleCancel}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                      <X size={14} /> Batal
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Nama Lengkap", key: "name", icon: <Shield size={14} /> },
                  { label: "Email", key: "email", icon: <Mail size={14} /> },
                  { label: "No. Telepon", key: "phone", icon: <Phone size={14} /> },
                  { label: "Website", key: "website", icon: <Globe size={14} /> },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                      {field.icon} {field.label}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm[field.key as keyof typeof editForm]}
                        onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                      />
                    ) : (
                      <div style={{ fontSize: 14, color: "#0f172a", padding: "9px 0" }}>{form[field.key as keyof typeof form]}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>Bio / Deskripsi</label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
                  />
                ) : (
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, padding: "9px 0" }}>{form.bio}</div>
                )}
              </div>
            </div>

            {/* Bank Info Edit */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "24px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Rekening Penerima Top Up</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
                Rekening ini ditampilkan ke investor saat melakukan top up token
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "Nama Bank", key: "bankName" },
                  { label: "No. Rekening", key: "accountNumber" },
                  { label: "Atas Nama", key: "accountHolder" },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{field.label}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm[field.key as keyof typeof editForm]}
                        onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                      />
                    ) : (
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", padding: "9px 0" }}>{form[field.key as keyof typeof form]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Keamanan Akun</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Kelola password dan sesi login admin</div>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  <Key size={14} /> Ubah Password
                </button>
              </div>

              {showPasswordForm && (
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Password Lama", "Password Baru", "Konfirmasi Password Baru"].map((label) => (
                      <div key={label}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>{label}</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                    <button style={{ padding: "10px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Bell size={16} color="#7c3aed" />
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Notifikasi</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Top Up Baru dari Investor", desc: "Notifikasi saat investor mengajukan top up" },
                  { label: "Permintaan Withdraw Founder", desc: "Notifikasi saat founder minta withdraw" },
                  { label: "Pengguna Baru Bergabung", desc: "Notifikasi saat ada pengguna baru mendaftar" },
                ].map((notif) => (
                  <div key={notif.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{notif.label}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{notif.desc}</div>
                    </div>
                    <div
                      style={{ width: 40, height: 22, background: "#7c3aed", borderRadius: 99, position: "relative", cursor: "pointer" }}
                    >
                      <div style={{ position: "absolute", right: 3, top: 3, width: 16, height: 16, background: "#fff", borderRadius: "50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
