"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  User,
  MapPin,
  Briefcase,
  Building2,
  FileText,
  Plus,
  X,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth, ActiveRole } from "@/contexts/AuthContext";

const ROLE_OPTIONS: { value: ActiveRole; label: string; desc: string; icon: string; color: string; bg: string }[] = [
  { value: "founder", label: "Founder / Pemilik Ide", desc: "Saya punya ide bisnis atau startup yang sedang dibangun", icon: "🚀", color: "#d97706", bg: "#fffbeb" },
  { value: "investor", label: "Investor / Penyedia Modal", desc: "Saya mencari peluang investasi di startup potensial", icon: "💼", color: "#16a34a", bg: "#f0fdf4" },
  { value: "cofounder", label: "Co-Founder", desc: "Saya ingin bergabung sebagai partner bisnis di startup", icon: "🤝", color: "#7c3aed", bg: "#faf5ff" },
  { value: "capex_provider", label: "Penyedia Capex", desc: "Saya menyediakan aset/infrastruktur untuk bisnis", icon: "🏗️", color: "#0369a1", bg: "#f0f9ff" },
];

const SECTORS = ["EdTech", "AgriTech", "FinTech", "HealthTech", "SaaS B2B", "E-Commerce", "F&B", "PropTech", "CleanTech", "Marketplace", "IoT", "AI/ML"];
const STAGES = ["Pre-Seed", "Seed", "Early Stage", "Series A", "Series B+"];
const CITIES = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Malang", "Bali", "Makassar", "Medan", "Palembang"];

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || user?.title || "",
    bio: user?.bio || "",
    company: user?.company || "",
    location: user?.location || "",
    roles: (user?.roles as ActiveRole[]) || ["founder"],
    // Investor fields
    investorTicketRange: user?.investorTicketRange || "",
    investorSectors: user?.investorSectors || ([] as string[]),
    investorStages: user?.investorStages || ([] as string[]),
  });

  function toggleRole(role: ActiveRole) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.length > 1 ? prev.roles.filter((r) => r !== role) : prev.roles
        : [...prev.roles, role],
    }));
  }

  function toggleSector(sector: string) {
    setForm((prev) => ({
      ...prev,
      investorSectors: prev.investorSectors.includes(sector)
        ? prev.investorSectors.filter((s) => s !== sector)
        : [...prev.investorSectors, sector],
    }));
  }

  function toggleStage(stage: string) {
    setForm((prev) => ({
      ...prev,
      investorStages: prev.investorStages.includes(stage)
        ? prev.investorStages.filter((s) => s !== stage)
        : [...prev.investorStages, stage],
    }));
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: form.name,
        headline: form.headline,
        title: form.headline,
        bio: form.bio,
        company: form.company,
        location: form.location,
        roles: form.roles,
        role: form.roles[0],
        investorTicketRange: form.investorTicketRange,
        investorSectors: form.investorSectors,
        investorStages: form.investorStages,
        // Recalculate initials
        initials: form.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0])
          .join("")
          .toUpperCase() || "VB",
      });
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  }

  const hasInvestorRole = form.roles.includes("investor");

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Edit Profil</h1>
              <p style={{ fontSize: 14, color: "#6b7280" }}>
                Profil Anda terlihat oleh semua pengguna Weaven.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => router.back()}
                style={{
                  padding: "9px 18px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                id="save-profile-btn"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 20px",
                  background: saved ? "#16a34a" : "#2563eb",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {saved ? <><CheckCircle2 size={14} /> Tersimpan!</> : isSaving ? "Menyimpan..." : <><Save size={14} /> Simpan Perubahan</>}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Basic Info */}
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <User size={18} color="#2563eb" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Informasi Dasar</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Name */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Nama Lengkap</label>
                  <input
                    id="edit-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama lengkap Anda"
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Headline */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Headline / Judul Profil
                  </label>
                  <input
                    id="edit-headline"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="cth: Founder @ EDUKITA | EdTech Enthusiast | Seeking Seed Investor"
                    maxLength={120}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textAlign: "right" }}>{form.headline.length}/120</div>
                </div>

                {/* Company & Location */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                      <Building2 size={12} style={{ display: "inline", marginRight: 4 }} />
                      Perusahaan / Venture
                    </label>
                    <input
                      id="edit-company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Nama perusahaan"
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                      <MapPin size={12} style={{ display: "inline", marginRight: 4 }} />
                      Kota
                    </label>
                    <select
                      id="edit-city"
                      value={form.location.split(",")[0]}
                      onChange={(e) => setForm({ ...form, location: e.target.value ? `${e.target.value}, Indonesia` : "" })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, background: "#fff", outline: "none", boxSizing: "border-box" }}
                    >
                      <option value="">Pilih kota...</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    <FileText size={12} style={{ display: "inline", marginRight: 4 }} />
                    Bio / Tentang Saya
                  </label>
                  <textarea
                    id="edit-bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Ceritakan tentang diri Anda, latar belakang, dan apa yang sedang Anda kerjakan..."
                    rows={5}
                    maxLength={800}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textAlign: "right" }}>{form.bio.length}/800</div>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Briefcase size={18} color="#2563eb" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Peran Aktif</h2>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                Pilih semua peran yang relevan. Anda bisa memiliki lebih dari satu peran.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {ROLE_OPTIONS.map((role) => {
                  const isActive = form.roles.includes(role.value);
                  return (
                    <button
                      key={role.value}
                      id={`role-toggle-${role.value}`}
                      onClick={() => toggleRole(role.value)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 16px",
                        border: `2px solid ${isActive ? role.color : "#e5e7eb"}`,
                        borderRadius: 10,
                        background: isActive ? role.bg : "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        position: "relative",
                      }}
                    >
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{role.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? role.color : "#111827" }}>{role.label}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3, lineHeight: 1.4 }}>{role.desc}</div>
                      </div>
                      {isActive && (
                        <CheckCircle2 size={16} color={role.color} style={{ flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {form.roles.length > 1 && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#eff6ff", borderRadius: 8, fontSize: 12, color: "#2563eb", border: "1px solid #bfdbfe" }}>
                  💡 Multi-role seperti LinkedIn — pengunjung profil Anda akan melihat semua peran yang Anda aktifkan.
                </div>
              )}
            </div>

            {/* Investor-specific fields */}
            {hasInvestorRole && (
              <div className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <TrendingUp size={18} color="#16a34a" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Profil Investor</h2>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                  Info ini ditampilkan secara publik di profil Anda. Detail modal akan bersifat privat (hanya terlihat setelah koneksi diterima).
                </p>

                {/* Ticket Range */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Ticket Size Range (Publik)
                  </label>
                  <select
                    id="edit-ticket-range"
                    value={form.investorTicketRange}
                    onChange={(e) => setForm({ ...form, investorTicketRange: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, background: "#fff", outline: "none", boxSizing: "border-box" }}
                  >
                    <option value="">Pilih range...</option>
                    <option value="< Rp 50jt">{"< Rp 50jt"}</option>
                    <option value="Rp 50jt – Rp 100jt">Rp 50jt – Rp 100jt</option>
                    <option value="Rp 100jt – Rp 500jt">Rp 100jt – Rp 500jt</option>
                    <option value="Rp 500jt – Rp 1M">Rp 500jt – Rp 1M</option>
                    <option value="Rp 1M – Rp 5M">Rp 1M – Rp 5M</option>
                    <option value="> Rp 5M">{"> Rp 5M"}</option>
                  </select>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                    * Angka spesifik AUM / ketersediaan modal hanya diungkap setelah founder menerima koneksi Anda.
                  </p>
                </div>

                {/* Sectors */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Sektor Minat</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SECTORS.map((s) => {
                      const active = form.investorSectors.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSector(s)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 20,
                            border: `1px solid ${active ? "#16a34a" : "#e5e7eb"}`,
                            background: active ? "#f0fdf4" : "#fff",
                            color: active ? "#16a34a" : "#374151",
                            fontSize: 12,
                            fontWeight: active ? 600 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {active ? "✓ " : ""}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stages */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Stage Preferensi</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {STAGES.map((s) => {
                      const active = form.investorStages.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleStage(s)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 20,
                            border: `1px solid ${active ? "#2563eb" : "#e5e7eb"}`,
                            background: active ? "#eff6ff" : "#fff",
                            color: active ? "#2563eb" : "#374151",
                            fontSize: 12,
                            fontWeight: active ? 600 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {active ? "✓ " : ""}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Save button (bottom) */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => router.back()}
                style={{ padding: "10px 20px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", background: "#fff", cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 24px",
                  background: saved ? "#16a34a" : "#2563eb",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {saved ? <><CheckCircle2 size={14} /> Tersimpan!</> : isSaving ? "Menyimpan..." : <><Save size={14} /> Simpan Perubahan</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
