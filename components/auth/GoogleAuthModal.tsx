"use client";

import { useState } from "react";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth, ActiveRole } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface GoogleAuthModalProps {
  onClose: () => void;
  mode?: "login" | "register";
}

export function GoogleAuthModal({ onClose, mode = "login" }: GoogleAuthModalProps) {
  const { authenticateWithGoogle, registerGoogleAccount } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"enter_google" | "new_account_role">("enter_google");
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<ActiveRole>("founder");
  const [city, setCity] = useState("Jakarta");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleGoogleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!googleEmail.trim() || !googleName.trim()) {
      setError("Nama dan email Google wajib diisi.");
      return;
    }

    if (!googleEmail.includes("@")) {
      setError("Format email Google tidak valid.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = authenticateWithGoogle(googleEmail, googleName);

      if (res.success && res.user) {
        onClose();
        if (res.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (res.user.role === "investor") {
          router.push("/investor/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Not registered in database yet -> proceed to role selection
        setStep("new_account_role");
      }
    }, 450);
  }

  function handleCompleteGoogleRegistration() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = registerGoogleAccount(
        googleEmail,
        googleName,
        selectedRole,
        city
      );
      if (res.success && res.user) {
        onClose();
        if (res.user.role === "investor") {
          router.push("/investor/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }, 500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Google Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24">
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
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              {step === "enter_google" ? "Masuk dengan Google" : "Lengkapi Profil Akun"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px" }}>
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
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

          {step === "enter_google" && (
            <div>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16, lineHeight: 1.5 }}>
                Hubungkan akun Google Anda untuk masuk atau mendaftar secara instan di Weaven.
              </p>

              <form onSubmit={handleGoogleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Nama Akun Google
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Pratama"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    Email Google (@gmail.com)
                  </label>
                  <input
                    type="email"
                    placeholder="nama@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: 6,
                    padding: "11px 16px",
                    background: "#2563eb",
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
                  }}
                >
                  {isLoading ? "Menghubungkan..." : (
                    <>
                      Lanjutkan dengan Akun Ini <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === "new_account_role" && (
            <div>
              <div
                style={{
                  background: "#eff6ff",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 16,
                  border: "1px solid #bfdbfe",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                  Akun Google Terhubung:
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginTop: 2 }}>
                  {googleName}
                </div>
                <div style={{ fontSize: 12, color: "#4b5563" }}>
                  {googleEmail}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
                  Pilih Peran Utama Anda:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { role: "founder" as const, label: "Founder", desc: "Listing ide & cari modal" },
                    { role: "investor" as const, label: "Investor", desc: "Investasi & review ide" },
                    { role: "cofounder" as const, label: "Co-Founder", desc: "Gabung bangun startup" },
                    { role: "capex_provider" as const, label: "Capex Owner", desc: "Sewa/jual aset properti" },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: selectedRole === r.role ? "2px solid #2563eb" : "1px solid #e5e7eb",
                        background: selectedRole === r.role ? "#eff6ff" : "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: selectedRole === r.role ? "#2563eb" : "#111827" }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Kota Domisili:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 13,
                    outline: "none",
                    background: "#fff",
                  }}
                >
                  {["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Malang", "Bali", "Makassar", "Medan"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep("enter_google")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCompleteGoogleRegistration}
                  style={{
                    flex: 2,
                    padding: "10px",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {isLoading ? "Menyimpan..." : (
                    <>
                      <CheckCircle size={15} /> Selesaikan Pendaftaran
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
