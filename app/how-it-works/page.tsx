import type { Metadata } from "next";
import Link from "next/link";
import { Search, Handshake, Rocket, Shield, Bot, CheckCircle, ArrowRight } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Cara Kerja — Weaven",
  description: "Pelajari bagaimana ekosistem Weaven merajut ide, modal, talent, dan aset menjadi venture nyata.",
};

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />

      <main style={{ flex: 1, padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                background: "#eff6ff",
                color: "#2563eb",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              WEAVEN ECOSYSTEM
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
              Bagaimana Weaven Bekerja?
            </h1>
            <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              Weaven adalah ekosistem tempat berbagai potensi (Idea × Capital × Talent × Assets) dirajut menjadi peluang nyata.
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 64 }}>
            {[
              {
                num: "01",
                icon: <Search size={28} color="#2563eb" />,
                bg: "#eff6ff",
                title: "1. Temukan Peluang & Daftarkan Profil",
                desc: "Founder mendaftarkan listing bisnis dengan ringkasan terbuka dan dokumen sensitif yang terkunci. Investor menentukan kriteria investasi spesifik.",
              },
              {
                num: "02",
                icon: <Bot size={28} color="#7c3aed" />,
                bg: "#faf5ff",
                title: "2. Pencocokan Cerdas dengan AI Copilot",
                desc: "Algoritma AI menganalisis keselarasan industri, modal, wilayah geografis, dan tahap bisnis untuk menghitung Match Score secara transparan.",
              },
              {
                num: "03",
                icon: <Shield size={28} color="#16a34a" />,
                bg: "#f0fdf4",
                title: "3. Permintaan Akses & NDA Otomatis",
                desc: "Investor mengajukan permintaan akses untuk meninjau pitch deck dan proyeksi finansial. NDA otomatis melindungi hak kekayaan intelektual founder.",
              },
              {
                num: "04",
                icon: <Handshake size={28} color="#2563eb" />,
                bg: "#eff6ff",
                title: "4. Kolaborasi, Percakapan & Deal",
                desc: "Setelah akses disetujui, kedua pihak dapat berdiskusi melalui chat terintegrasi, menjadwalkan meeting, dan merealisasikan kemitraan modal.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="card"
                style={{
                  padding: "32px",
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: step.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                    {step.title}
                  </h2>
                  <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              textAlign: "center",
              padding: "48px 32px",
              background: "#111827",
              borderRadius: 16,
              color: "#fff",
            }}
          >
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
              Siap Menjadi Bagian dari Ekosistem?
            </h2>
            <p style={{ fontSize: 15, color: "#9ca3af", marginBottom: 24 }}>
              Mulai gratis sekarang dan bangun kemitraan bisnis berikutnya.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 26px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Daftar Sekarang
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/explore"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 26px",
                  background: "transparent",
                  color: "#d1d5db",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid #374151",
                }}
              >
                Jelajahi Peluang
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
