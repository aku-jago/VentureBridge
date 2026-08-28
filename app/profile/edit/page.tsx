"use client";

import { useState, useRef } from "react";
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
  Camera,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth, ActiveRole } from "@/contexts/AuthContext";

const ROLE_OPTIONS: { value: ActiveRole; label: string; desc: string; icon: string; color: string; bg: string }[] = [
  { value: "founder", label: "Founder / Pemilik Ide", desc: "Saya punya ide bisnis atau startup yang sedang dibangun", icon: "🚀", color: "#d97706", bg: "#fffbeb" },
  { value: "investor", label: "Investor / Penyedia Modal", desc: "Saya mencari peluang investasi di startup potensial", icon: "💼", color: "#16a34a", bg: "#f0fdf4" },
  { value: "cofounder", label: "Co-Founder", desc: "Saya ingin bergabung sebagai partner bisnis di startup", icon: "🤝", color: "#7c3aed", bg: "#faf5ff" },
  { value: "capex_provider", label: "Penyedia Capex", desc: "Saya menyediakan aset/infrastruktur untuk bisnis", icon: "🏗️", color: "#0369a1", bg: "#f0f9ff" },
];

const BANNER_PRESETS = [
  { id: "midnight", label: "Deep Tech", gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)" },
  { id: "emerald", label: "Emerald Growth", gradient: "linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #059669 100%)" },
  { id: "indigo", label: "Royal Indigo", gradient: "linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #4338ca 100%)" },
  { id: "sunset", label: "Sunset Glow", gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)" },
  { id: "cyber", label: "Cyberpunk", gradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #7c3aed 100%)" },
  { id: "slate", label: "Sleek Slate", gradient: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)" },
];

const COLOR_PRESETS = [
  "#2563eb",
  "#16a34a",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0d9488",
  "#db2777",
  "#0f172a",
];

const SECTORS = ["EdTech", "AgriTech", "FinTech", "HealthTech", "SaaS B2B", "E-Commerce", "F&B", "PropTech", "CleanTech", "Marketplace", "IoT", "AI/ML"];
const STAGES = ["Pre-Seed", "Seed", "Early Stage", "Series A", "Series B+"];
const CITIES = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Malang", "Bali", "Makassar", "Medan", "Palembang"];

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || user?.avatar || "");
  const [bannerUrl, setBannerUrl] = useState<string>(user?.bannerUrl || BANNER_PRESETS[0].gradient);
  const [avatarColor, setAvatarColor] = useState<string>(user?.avatarColor || "#2563eb");

  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || user?.title || "",
    bio: user?.bio || "",
    company: user?.company || "",
    location: user?.location || "",
    roles: (user?.roles as ActiveRole[]) || ["founder"],
    investorTicketRange: user?.investorTicketRange || "",
    investorSectors: user?.investorSectors || ([] as string[]),
    investorStages: user?.investorStages || ([] as string[]),
  });

  function handleAvatarFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleBannerFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setBannerUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

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
      const initials = form.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase() || "VB";

      updateProfile({
        name: form.name,
        headline: form.headline,
        title: form.headline,
        bio: form.bio,
        company: form.company,
        location: form.location,
        roles: form.roles,
        role: form.roles[0],
        avatarUrl,
        avatar: avatarUrl,
        bannerUrl,
        avatarColor,
        investorTicketRange: form.investorTicketRange,
        investorSectors: form.investorSectors,
        investorStages: form.investorStages,
        initials,
      });

      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (user?.id) {
          router.push(`/profile/${user.id}`);
        }
      }, 1000);
    }, 600);
  }

  const hasInvestorRole = form.roles.includes("investor");
  const previewInitials = form.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "VB";

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-content">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Edit Profil & Branding</h1>
              <p style={{ fontSize: 14, color: "#6b7280" }}>
                Sesuaikan foto profil, cover banner, dan informasi bisnis Anda agar tampak kredibel bagi investor & rekanan.
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
                  padding: "9px 22px",
                  background: saved ? "#16a34a" : "#2563eb",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                }}
              >
                {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
                {isSaving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW CARD */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} color="#2563eb" /> Live Preview Tampilan Profil Anda:
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid #e2e8f0", borderRadius: 16 }}>
              {/* Banner Preview */}
              <div
                style={{
                  height: 140,
                  background: bannerUrl.startsWith("data:") || bannerUrl.startsWith("http") ? `url("${bannerUrl}") center/cover no-repeat` : bannerUrl,
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
              </div>

              {/* Avatar + Info Preview */}
              <div style={{ padding: "0 24px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -40, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: avatarColor,
                      border: "4px solid #fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 26,
                      fontWeight: 800,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      previewInitials
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                  {form.name || "Nama Pengguna"}
                </div>
                <div style={{ fontSize: 13, color: "#4b5563", marginTop: 2 }}>
                  {form.headline || "Headline / Posisi Bisnis"}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {form.roles.map((r) => {
                    const opt = ROLE_OPTIONS.find((o) => o.value === r);
                    return (
                      <span key={r} style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: opt?.bg || "#f3f4f6", color: opt?.color || "#374151" }}>
                        {opt?.icon} {opt?.label}
                      </span>
                    );
                  })}
                  {form.location && (
                    <span style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 3 }}>
                      <MapPin size={12} /> {form.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: FOTO PROFIL & COVER BANNER */}
          <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={18} color="#2563eb" /> Foto Profil & Banner Cover
            </h2>

            {/* Avatar Upload / Customization */}
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #f3f4f6", flexWrap: "wrap" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: 800,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  previewInitials
                )}
              </div>

              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Foto Profil</div>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
                  Upload foto profesional (PNG, JPG, WEBP maks 5MB) atau gunakan inisial warna.
                </p>

                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarFileUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Upload size={13} /> Upload Foto Baru
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "7px 12px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} /> Hapus Foto
                    </button>
                  )}
                </div>

                {/* Color presets if no image uploaded */}
                {!avatarUrl && (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Warna Inisial:</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setAvatarColor(color)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: color,
                            border: avatarColor === color ? "2px solid #000" : "1px solid rgba(0,0,0,0.1)",
                            cursor: "pointer",
                            transform: avatarColor === color ? "scale(1.2)" : "scale(1)",
                            transition: "transform 0.15s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Cover Customization */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Cover / Banner Profil</div>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                Pilih tema gradient eksklusif atau upload gambar banner kustom Anda.
              </p>

              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerFileUpload}
                accept="image/*"
                style={{ display: "none" }}
              />

              {/* Gradient Presets */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 14 }}>
                {BANNER_PRESETS.map((bp) => {
                  const isSelected = bannerUrl === bp.gradient;
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => setBannerUrl(bp.gradient)}
                      style={{
                        height: 54,
                        borderRadius: 10,
                        background: bp.gradient,
                        border: isSelected ? "3px solid #2563eb" : "1px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                        boxShadow: isSelected ? "0 0 0 2px #bfdbfe" : "none",
                        transition: "transform 0.15s ease",
                      }}
                    >
                      {bp.label} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>

              {/* Upload Custom Banner Button */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <ImageIcon size={14} /> Upload Gambar Banner Sendiri
                </button>

                {(bannerUrl.startsWith("data:") || bannerUrl.startsWith("http")) && (
                  <button
                    type="button"
                    onClick={() => setBannerUrl(BANNER_PRESETS[0].gradient)}
                    style={{
                      padding: "7px 12px",
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Reset ke Gradient
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: BASIC INFO */}
          <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <User size={18} color="#2563eb" /> Informasi Dasar
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Nama Lengkap <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="profile-name-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nama Lengkap Anda"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Headline / Title */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Headline Profesional / Jabatan <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                  placeholder="Contoh: Founder & CEO @ EDUKITA | EdTech Innovator"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Company & Location in 2 Columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Nama Perusahaan / Startup
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Contoh: EDUKITA Nusantara"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Lokasi / Kota
                  </label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" }}
                  >
                    <option value="">Pilih Kota</option>
                    {CITIES.map((c) => (
                      <option key={c} value={`${c}, Indonesia`}>{c}, Indonesia</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Tentang / Bio Profil
                </label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Ceritakan latar belakang, visi, atau rekam jejak Anda..."
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ROLES SELECTION */}
          <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Briefcase size={18} color="#2563eb" /> Peran di Platform (Multi-Role)
            </h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
              Pilih satu atau lebih peran yang mendeskripsikan aktivitas Anda di Weaven.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = form.roles.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleRole(opt.value)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: isSelected ? `2px solid ${opt.color}` : "1px solid #e5e7eb",
                      background: isSelected ? opt.bg : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? opt.color : "#111827" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: INVESTOR PREFERENCES (If Investor Selected) */}
          {hasInvestorRole && (
            <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={18} color="#16a34a" /> Kriteria & Preferensi Investasi
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                Bantu AI mencocokkan startup yang relevan dengan tiket dan thesis Anda.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Kisaran Tiket Investasi (Per Deal)
                  </label>
                  <select
                    value={form.investorTicketRange}
                    onChange={(e) => setForm((p) => ({ ...p, investorTicketRange: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box" }}
                  >
                    <option value="">Pilih Kisaran Tiket</option>
                    <option value="Rp 25jt – Rp 100jt">Rp 25jt – Rp 100jt (Micro Angel)</option>
                    <option value="Rp 100jt – Rp 500jt">Rp 100jt – Rp 500jt (Angel / Pre-Seed)</option>
                    <option value="Rp 500jt – Rp 2M">Rp 500jt – Rp 2M (Seed Syndicate)</option>
                    <option value="> Rp 2M">&gt; Rp 2M (Early Stage VC)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                    Sektor yang Diminati:
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SECTORS.map((s) => {
                      const isSel = form.investorSectors.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSector(s)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 999,
                            border: isSel ? "1px solid #16a34a" : "1px solid #e5e7eb",
                            background: isSel ? "#f0fdf4" : "#fff",
                            color: isSel ? "#16a34a" : "#4b5563",
                            fontSize: 12,
                            fontWeight: isSel ? 700 : 500,
                            cursor: "pointer",
                          }}
                        >
                          {isSel ? "✓ " : ""}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                    Tahap Startup (Stage):
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {STAGES.map((stg) => {
                      const isSel = form.investorStages.includes(stg);
                      return (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => toggleStage(stg)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 999,
                            border: isSel ? "1px solid #16a34a" : "1px solid #e5e7eb",
                            background: isSel ? "#f0fdf4" : "#fff",
                            color: isSel ? "#16a34a" : "#4b5563",
                            fontSize: 12,
                            fontWeight: isSel ? 700 : 500,
                            cursor: "pointer",
                          }}
                        >
                          {isSel ? "✓ " : ""}{stg}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button
              onClick={() => router.back()}
              style={{
                padding: "10px 20px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                background: "#fff",
                cursor: "pointer",
              }}
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
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                cursor: isSaving ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              }}
            >
              {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
              {isSaving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Profil"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
