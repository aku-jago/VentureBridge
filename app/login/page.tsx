"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"founder" | "investor">("founder");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const rawName = email.split("@")[0] || (role === "founder" ? "Dzakki Naufal" : "Budi Santoso");
      const formattedName =
        rawName
          .replace(/[._-]/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ") || (role === "founder" ? "Dzakki Naufal" : "Budi Santoso");

      const parts = formattedName.split(" ").filter(Boolean);
      const initials =
        parts.length > 1
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : formattedName.substring(0, 2).toUpperCase();

      if (role === "founder") {
        login({
          id: "user-1",
          name: formattedName,
          initials,
          title: "Idea Founder",
          role: "founder",
          email,
        });
        router.push("/dashboard");
      } else {
        login({
          id: "user-2",
          name: formattedName,
          initials,
          title: "Managing Partner",
          role: "investor",
          email,
        });
        router.push("/investor/dashboard");
      }
    }, 600);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
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
          marginBottom: 32,
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
          VentureBridge
        </span>
      </Link>

      {/* Card */}
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "32px",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
          Masuk ke VentureBridge
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>
          Belum punya akun?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: 600 }}>
            Daftar gratis
          </Link>
        </p>

        {/* Role Toggle */}
        <div
          style={{
            display: "flex",
            background: "#f3f4f6",
            borderRadius: 10,
            padding: 4,
            marginBottom: 24,
            gap: 4,
          }}
        >
          {(["founder", "investor"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: role === r ? "#fff" : "transparent",
                color: role === r ? "#111827" : "#6b7280",
                boxShadow: role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {r === "founder" ? "Saya Founder" : "Saya Investor"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                color: "#111827",
                outline: "none",
                transition: "border-color 0.15s ease",
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
              <Link href="/forgot-password" style={{ fontSize: 12, color: "#2563eb" }}>
                Lupa kata sandi?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#111827",
                  outline: "none",
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
              }}
            >
              {error}
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
            {isLoading ? "Masuk..." : (
              <>
                Masuk
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo accounts note */}
        <div
          style={{
            marginTop: 20,
            padding: "12px 14px",
            background: "#eff6ff",
            borderRadius: 8,
            border: "1px solid #bfdbfe",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Demo Mode
          </div>
          <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
            Masukkan email apa saja → pilih peran di atas → klik Masuk untuk melihat dashboard.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 24, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
        © 2024 VentureBridge Indonesia.{" "}
        <Link href="/terms" style={{ color: "#6b7280" }}>Syarat & Ketentuan</Link>
        {" · "}
        <Link href="/privacy" style={{ color: "#6b7280" }}>Privasi</Link>
      </p>
    </div>
  );
}
