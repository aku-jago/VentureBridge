"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, ActiveRole } from "@/contexts/AuthContext";
import { GoogleAuthModal } from "@/components/auth/GoogleAuthModal";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    city: "Jakarta",
    role: "founder" as ActiveRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const router = useRouter();
  const { registerAccount } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Semua kolom bertanda bintang wajib diisi.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = registerAccount({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        roles: [formData.role],
        title: formData.role === "investor" ? "Investor" : formData.role === "founder" ? "Founder" : formData.role === "capex_provider" ? "Capex Provider" : "Co-Founder",
        location: formData.city ? `${formData.city}, Indonesia` : undefined,
        tokenBalance: formData.role === "investor" ? 50 : 0,
        founderTokenBalance: 0,
      });

      if (!res.success) {
        setError(res.message || "Pendaftaran gagal. Silakan coba lagi.");
        return;
      }

      if (formData.role === "investor") {
        router.push("/investor/dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 600);
  }

  const HIGHLIGHTS = [
    { icon: "🚀", text: "Listing ide bisnis & cari investor" },
    { icon: "💼", text: "Investasikan modal ke startup potensial" },
    { icon: "🤝", text: "Temukan co-founder yang tepat" },
    { icon: "🏗️", text: "Sediakan aset capex untuk bisnis" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 60%, #f0fdf4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "#2563eb",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Rocket size={20} color="#fff" />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
          Weaven
        </span>
      </Link>

      <div
        className="register-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 380px) minmax(0, 420px)",
          gap: 32,
          width: "100%",
          maxWidth: 840,
          alignItems: "start",
        }}
      >
        {/* Left: Value Prop */}
        <div style={{ paddingTop: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 12, lineHeight: 1.3 }}>
            Bergabung dengan ekosistem bisnis Indonesia
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
            Satu platform untuk semua peran — founder, investor, co-founder, atau penyedia capex. Mulai perjalanan Anda hari ini.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{h.icon}</span>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{h.text}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 24,
              padding: "14px 16px",
              background: "#eff6ff",
              borderRadius: 10,
              border: "1px solid #bfdbfe",
            }}
          >
            <p style={{ fontSize: 13, color: "#1d4ed8", lineHeight: 1.5 }}>
              💡 <strong>Multi-peran otomatis.</strong> Setelah mendaftar, kamu bisa mengaktifkan peran lain kapan saja dari profil kamu.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div
          className="card"
          style={{
            padding: "32px 28px",
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            Buat Akun Baru
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18 }}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color: "#2563eb", fontWeight: 700 }}>
              Masuk
            </Link>
          </p>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 16,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f9fafb";
              (e.currentTarget as HTMLElement).style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Daftar Cepat dengan Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>ATAU FORMULIR MANUAL</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Nama Lengkap *
              </label>
              <input
                id="register-name"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nama lengkap Anda"
                required
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Email *
              </label>
              <input
                id="register-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@contoh.com"
                required
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Role selection */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Peran Utama Anda:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { role: "founder" as const, label: "Founder (Ide Bisnis)" },
                  { role: "investor" as const, label: "Investor (Modal)" },
                  { role: "cofounder" as const, label: "Co-Founder" },
                  { role: "capex_provider" as const, label: "Capex (Properti)" },
                ].map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.role })}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: formData.role === r.role ? "2px solid #2563eb" : "1px solid #e5e7eb",
                      background: formData.role === r.role ? "#eff6ff" : "#fff",
                      fontSize: 12,
                      fontWeight: formData.role === r.role ? 700 : 500,
                      color: formData.role === r.role ? "#2563eb" : "#374151",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Kata Sandi *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  style={{
                    width: "100%",
                    padding: "9px 40px 9px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* City */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                Kota Domisili
              </label>
              <select
                id="register-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  outline: "none",
                  background: "#fff",
                  boxSizing: "border-box",
                }}
              >
                {["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Malang", "Bali", "Makassar", "Medan"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Terms */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                id="register-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#2563eb", width: 15, height: 15, flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.4 }}>
                Saya menyetujui{" "}
                <Link href="/terms" style={{ color: "#2563eb" }}>Syarat & Ketentuan</Link>
                {" "}dan{" "}
                <Link href="/privacy" style={{ color: "#2563eb" }}>Privasi</Link>{" "}
                Weaven.
              </span>
            </label>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "10px 12px",
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#dc2626",
                  lineHeight: 1.4,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading || !agreedToTerms}
              style={{
                width: "100%",
                padding: "11px",
                background: isLoading || !agreedToTerms ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: isLoading || !agreedToTerms ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isLoading ? (
                "Menyimpan Akun..."
              ) : (
                <>
                  <CheckCircle size={16} />
                  Daftar Akun
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 32, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
        © 2024 Weaven Indonesia. Weaving Possibilities into Ventures.{" "}
        <Link href="/terms" style={{ color: "#6b7280" }}>Syarat & Ketentuan</Link>
        {" · "}
        <Link href="/privacy" style={{ color: "#6b7280" }}>Privasi</Link>
      </p>

      {/* Google Auth Modal */}
      {showGoogleModal && (
        <GoogleAuthModal onClose={() => setShowGoogleModal(false)} mode="register" />
      )}

      <style>{`
        @media (max-width: 768px) {
          .register-grid {
            grid-template-columns: 1fr !important;
            max-width: 100% !important;
          }
          .register-grid > div:first-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
