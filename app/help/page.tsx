"use client";

import Link from "next/link";
import { HelpCircle, Search, Mail, MessageSquare, ChevronRight, FileQuestion } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

const FAQS = [
  {
    q: "Bagaimana cara mendaftarkan ide bisnis saya?",
    a: "Setelah mendaftar sebagai Founder, masuk ke menu My Listings di dashboard dan klik '+ Buat Listing Baru'. Isi informasi dasar, target modal, dan unggah pitch deck.",
  },
  {
    q: "Apakah data dan ide bisnis saya aman?",
    a: "Ya. Dokumen sensitif seperti pitch deck lengkap dan proyeksi finansial terkunci secara default. Calon investor harus menyetujui NDA sebelum dapat mengakses data tersebut.",
  },
  {
    q: "Bagaimana sistem AI Match Score dihitung?",
    a: "Algoritma AI menganalisis keselarasan industri, riwayat investasi pemodal, tahap bisnis, besaran modal yang dicari, dan lokasi untuk memberikan persentase kecocokan objektif.",
  },
  {
    q: "Bagaimana proses verifikasi bisnis?",
    a: "Masuk ke menu Verifikasi Bisnis di dashboard. Unggah dokumen identitas founder, legalitas usaha (NIB/Akta jika ada), atau surat inkubasi kampus untuk mendapatkan badge Terverifikasi.",
  },
];

export default function HelpCenterPage() {
  const { user, isLoggedIn } = useAuth();

  const content = (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
          Pusat Bantuan Weaven
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 540, margin: "0 auto" }}>
          Temukan jawaban atas pertanyaan umum seputar merajut ide, modal, NDA, dan fitur platform Weaven.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
        {FAQS.map((item, i) => (
          <div key={i} className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <FileQuestion size={18} color="#2563eb" />
              {item.q}
            </h3>
            <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, paddingLeft: 26 }}>
              {item.a}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Support Card */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 12,
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Mail size={24} color="#2563eb" />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
              Butuh bantuan lebih lanjut?
            </div>
            <div style={{ fontSize: 13, color: "#3b82f6" }}>
              Tim dukungan kami siap membantu Anda di support@weaven.id
            </div>
          </div>
        </div>
        <a
          href="mailto:support@weaven.id"
          style={{
            padding: "8px 18px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Hubungi Tim Kami
        </a>
      </div>
    </div>
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">{content}</main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />
      <main style={{ flex: 1 }}>{content}</main>
      <Footer />
    </div>
  );
}
