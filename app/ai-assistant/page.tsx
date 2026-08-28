"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Shield,
  CheckCircle,
  Users,
  Zap,
  Target,
  FileCheck,
} from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

const SAMPLE_PROMPTS = [
  "Cari bisnis EdTech dengan traction 5.000+ pengguna",
  "Rekomendasikan investor AgriTech di Jawa Tengah",
  "Berapa rata-rata ticket size untuk startup Seed di Indonesia?",
  "Cara menyiapkan financial model untuk investor",
];

const SIMULATED_RESULTS: Record<string, {
  score: number;
  marketPotential: string;
  recommendedInvestors: { name: string; firm: string; match: number }[];
  keyStrengths: string[];
  recommendation: string;
}> = {
  default: {
    score: 91,
    marketPotential: "Tinggi (Pasar bertumbuh 24% CAGR di Indonesia)",
    recommendedInvestors: [
      { name: "Budi Santoso", firm: "Nusantara Capital", match: 94 },
      { name: "Andi Wijaya", firm: "East Ventures Syndicate", match: 88 },
    ],
    keyStrengths: [
      "Unit economics tervalidasi dengan retensi tinggi",
      "Relevansi sektor tinggi dengan fokus investasi Q3-Q4",
      "Kesiapan data profil memenuhi standar institusional",
    ],
    recommendation:
      "Profil bisnis Anda menunjukkan keselarasan tinggi dengan 5 investor aktif di Weaven. Segera ajukan permintaan matching untuk memulai percakapan.",
  },
};

export default function AIAssistantPublicPage() {
  const { user, isLoggedIn } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(SIMULATED_RESULTS.default);
  const [hasSearched, setHasSearched] = useState(false);

  function handleAnalyze(textToAnalyze?: string) {
    const text = textToAnalyze || query;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setHasSearched(true);
    setSelectedPrompt(text);

    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(SIMULATED_RESULTS.default);
    }, 800);
  }

  const pageContent = (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            background: "#eff6ff",
            borderRadius: 999,
            marginBottom: 16,
            border: "1px solid #bfdbfe",
          }}
        >
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>
            Weaven AI Copilot
          </span>
        </div>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Pencocokan Cerdas & Analisis Kesiapan Modal
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#6b7280",
            maxWidth: 680,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Temukan peluang investasi yang paling sesuai dan dapatkan evaluasi
          investor readiness otomatis menggunakan algoritma AI terkurasi.
        </p>
      </div>

      {/* Interactive AI Search Box */}
      <div
        className="card"
        style={{
          padding: "28px",
          marginBottom: 40,
          background: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          Coba Simulator AI Assistant:
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: 260,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#f8f9fa",
            }}
          >
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Contoh: Cari bisnis EdTech dengan traction kuat atau investor AgriTech..."
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 14,
                color: "#111827",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {isAnalyzing ? (
              "Menganalisis..."
            ) : (
              <>
                <Sparkles size={16} />
                Analisis dengan AI
              </>
            )}
          </button>
        </div>

        {/* Quick Prompts */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>Contoh:</span>
          {SAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setQuery(prompt);
                handleAnalyze(prompt);
              }}
              style={{
                padding: "6px 12px",
                background: selectedPrompt === prompt ? "#eff6ff" : "#f3f4f6",
                border: `1px solid ${selectedPrompt === prompt ? "#2563eb" : "#e5e7eb"}`,
                borderRadius: 999,
                fontSize: 12,
                color: selectedPrompt === prompt ? "#2563eb" : "#4b5563",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Result Box */}
      {(hasSearched || true) && (
        <div
          className="card"
          style={{
            padding: "28px",
            marginBottom: 48,
            border: "1px solid #bfdbfe",
            background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                  Hasil Analisis AI Match
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Berdasarkan database kurasi ekosistem Weaven
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "#f0fdf4",
                borderRadius: 999,
                border: "1px solid #86efac",
              }}
            >
              <CheckCircle size={15} color="#16a34a" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
                Kecocokan: {result.score}% Match
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            {/* Left: Strengths */}
            <div style={{ background: "#fff", padding: "18px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Target size={16} color="#2563eb" />
                Poin Kekuatan Terdeteksi
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                {result.keyStrengths.map((s, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Right: Top Investors Match */}
            <div style={{ background: "#fff", padding: "18px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={16} color="#16a34a" />
                Investor Paling Selaras
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.recommendedInvestors.map((inv) => (
                  <div
                    key={inv.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "#f8f9fa",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{inv.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{inv.firm}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>
                      {inv.match}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "14px 16px",
              background: "#eff6ff",
              borderRadius: 8,
              border: "1px solid #bfdbfe",
              fontSize: 13,
              color: "#1e40af",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span>💡 {result.recommendation}</span>
            {isLoggedIn ? (
              <Link
                href="/dashboard/ai-copilot"
                style={{
                  padding: "6px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Buka Chat AI Penuh →
              </Link>
            ) : (
              <Link
                href="/register"
                style={{
                  padding: "6px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Daftar untuk Akses Penuh →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Feature Pillars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          marginBottom: 56,
        }}
      >
        {[
          {
            icon: <TrendingUp size={24} color="#2563eb" />,
            title: "Investor Readiness Score",
            desc: "Evaluasi kelengkapan dokumen finansial, legal, dan daya tarik produk secara otomatis untuk meyakinkan calon investor.",
          },
          {
            icon: <Zap size={24} color="#7c3aed" />,
            title: "Algoritma Kecocokan 2 Arah",
            desc: "Mempertemukan tesis investasi spesifik dengan profil kapabilitas pendiri secara objektif dan transparan.",
          },
          {
            icon: <Shield size={24} color="#16a34a" />,
            title: "Smart NDA Protection",
            desc: "Akses data sensitif otomatis terlindungi dokumen kerahasiaan sebelum dibuka untuk pihak peminat.",
          },
        ].map((f) => (
          <div key={f.title} className="card" style={{ padding: "24px" }}>
            <div style={{ marginBottom: 14 }}>{f.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              {f.title}
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          background: "#111827",
          borderRadius: 16,
          color: "#fff",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
          Ingin Mencoba Analisis untuk Bisnis Anda?
        </h2>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>
          Buat akun dalam 1 menit dan gunakan seluruh kecanggihan AI Copilot secara gratis.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {isLoggedIn ? (
            <Link
              href="/dashboard/ai-copilot"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Bot size={16} />
              Buka Chat AI Copilot Saya
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 24px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Daftar Sekarang — Gratis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 24px",
                  background: "transparent",
                  color: "#d1d5db",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid #374151",
                }}
              >
                Masuk ke Akun
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">{pageContent}</main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />
      <main style={{ flex: 1 }}>{pageContent}</main>
      <Footer />
    </div>
  );
}
