"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleAuthModal } from "@/components/auth/GoogleAuthModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const router = useRouter();
  const { authenticateWithCredentials } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = authenticateWithCredentials(email, password);

      if (!res.success) {
        setError(res.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
        return;
      }

      if (res.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else if (res.user?.role === "investor") {
        router.push("/investor/dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 500);
  }

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
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            background: "#2563eb",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Rocket size={20} color="#fff" />
        </div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>
          Weaven
        </span>
      </Link>

      {/* Card */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "32px 28px",
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Masuk ke Akun Anda
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
          Belum punya akun?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: 700 }}>
            Daftar di sini
          </Link>
        </p>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          style={{
            width: "100%",
            padding: "11px 14px",
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
          Masuk dengan Akun Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>ATAU DENGAN EMAIL</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              autoComplete="email"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                color: "#111827",
                outline: "none",
                transition: "border-color 0.15s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                Kata Sandi
              </label>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                Min. 8 karakter
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
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
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

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
            id="login-submit"
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "11px",
              background: isLoading ? "#93c5fd" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s ease",
              marginTop: 4,
            }}
          >
            {isLoading ? "Memvalidasi Akun..." : (
              <>
                Masuk
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 24, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
        © 2024 Weaven Indonesia. Weaving Possibilities into Ventures.{" "}
        <Link href="/terms" style={{ color: "#6b7280" }}>Syarat & Ketentuan</Link>
        {" · "}
        <Link href="/privacy" style={{ color: "#6b7280" }}>Privasi</Link>
      </p>

      {/* Google Auth Modal */}
      {showGoogleModal && (
        <GoogleAuthModal onClose={() => setShowGoogleModal(false)} mode="login" />
      )}
    </div>
  );
}
