"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type UserRole = "founder" | "investor" | "cofounder" | "mentor";

const ROLES: { value: UserRole; label: string; desc: string; icon: string }[] = [
  { value: "founder", label: "Founder / Pemilik Ide", desc: "Saya punya ide bisnis atau startup", icon: "🚀" },
  { value: "investor", label: "Investor / Modal", desc: "Saya mencari peluang investasi", icon: "💼" },
  { value: "cofounder", label: "Co-Founder", desc: "Saya ingin bergabung sebagai partner bisnis", icon: "🤝" },
  { value: "mentor", label: "Mentor / Advisor", desc: "Saya ingin membimbing startup", icon: "🎓" },
];

import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("founder");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedToTerms) return;
    setIsLoading(true);

    const name = formData.fullName.trim() || "User";
    const parts = name.split(" ").filter(Boolean);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
    const role = selectedRole === "investor" ? "investor" : "founder";
    const title =
      selectedRole === "investor"
        ? "Investor / Modal"
        : selectedRole === "cofounder"
        ? "Co-Founder Candidate"
        : selectedRole === "mentor"
        ? "Mentor / Advisor"
        : "Idea Founder";

    setTimeout(() => {
      setIsLoading(false);
      login({
        id: `user-${Date.now()}`,
        name,
        initials,
        title,
        role,
        email: formData.email,
      });

      if (role === "investor") {
        router.push("/investor/dashboard");
      } else {
        router.push("/dashboard");
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

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: step === 1 ? 560 : 440,
          padding: "32px",
        }}
      >
        {/* Progress Indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 2,
                background: s <= step ? "#2563eb" : "#e5e7eb",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        {step === 1 ? (
          /* Step 1: Role Selection */
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Anda bergabung sebagai?
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
              Pilih peran yang paling mendeskripsikan Anda di ekosistem VentureBridge.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  id={`role-${role.value}`}
                  onClick={() => setSelectedRole(role.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    border: `2px solid ${selectedRole === role.value ? "#2563eb" : "#e5e7eb"}`,
                    borderRadius: 10,
                    background: selectedRole === role.value ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{role.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: selectedRole === role.value ? "#2563eb" : "#111827",
                      }}
                    >
                      {role.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                      {role.desc}
                    </div>
                  </div>
                  {selectedRole === role.value && (
                    <CheckCircle size={18} color="#2563eb" />
                  )}
                </button>
              ))}
            </div>

            <button
              id="register-next"
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "11px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Lanjutkan
              <ArrowRight size={16} />
            </button>

            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#9ca3af" }}>
              Sudah punya akun?{" "}
              <Link href="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
                Masuk
              </Link>
            </p>
          </>
        ) : (
          /* Step 2: Registration Form */
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Buat Akun Anda
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
              Bergabung sebagai{" "}
              <strong style={{ color: "#2563eb" }}>
                {ROLES.find((r) => r.value === selectedRole)?.label}
              </strong>
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
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
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#111827",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
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
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#111827",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
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
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* City */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Kota
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    color: formData.city ? "#111827" : "#9ca3af",
                    outline: "none",
                    background: "#fff",
                  }}
                >
                  <option value="">Pilih kota...</option>
                  {["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Semarang", "Malang", "Bali", "Makassar"].map((c) => (
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
                  style={{ marginTop: 2, accentColor: "#2563eb", width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                  Saya menyetujui{" "}
                  <Link href="/terms" style={{ color: "#2563eb" }}>Syarat & Ketentuan</Link>
                  {" "}dan{" "}
                  <Link href="/privacy" style={{ color: "#2563eb" }}>Kebijakan Privasi</Link>{" "}
                  VentureBridge.
                </span>
              </label>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: "11px 20px",
                    background: "#fff",
                    color: "#374151",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 14,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  ← Kembali
                </button>
                <button
                  id="register-submit"
                  type="submit"
                  disabled={isLoading || !agreedToTerms}
                  style={{
                    flex: 1,
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
                  {isLoading ? "Mendaftar..." : "Buat Akun"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
