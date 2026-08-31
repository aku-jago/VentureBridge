"use client";

import Link from "next/link";
import {
  Search,
  Handshake,
  Rocket,
  Bot,
  Shield,
  FileText,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { OpportunityCard } from "@/components/venturebridge/OpportunityCard";
import { mockOpportunities } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user, isLoggedIn } = useAuth();
  const dashboardHref = user?.role === "investor" ? "/investor/dashboard" : "/dashboard";

  const featuredOpportunities = mockOpportunities.filter((o) =>
    ["opp-1", "opp-2", "opp-4"].includes(o.id)
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />

      <main style={{ flex: 1 }}>
        {/* ============================
            HERO SECTION
            ============================ */}
        <section
          style={{
            background: "#fff",
            padding: "72px 24px 80px",
          }}
          className="hero-section"
        >
          <div
            className="hero-grid"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "center",
            }}
          >
            {/* Left: Copy */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  background: "#eff6ff",
                  borderRadius: 999,
                  color: "#2563eb",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 16,
                  border: "1px solid #dbeafe",
                }}
              >
                <Rocket size={14} />
                WEAVEN • Weaving Possibilities into Ventures
              </div>
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: 20,
                }}
              >
                Weaving Possibilities{" "}
                <span style={{ color: "#2563eb" }}>into Ventures</span>.
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: "#4b5563",
                  lineHeight: 1.7,
                  marginBottom: 24,
                  maxWidth: 480,
                }}
              >
                Weaven is where <strong>ideas</strong>, <strong>capital</strong>, <strong>talent</strong>, and <strong>assets</strong> are woven into ventures. 
                Satu ekosistem terpadu tempat berbagai potensi yang sebelumnya terpisah dirajut menjadi peluang nyata.
              </p>
              <div
                style={{
                  padding: "10px 14px",
                  background: "#f0fdf4",
                  borderLeft: "3px solid #16a34a",
                  borderRadius: "0 8px 8px 0",
                  marginBottom: 28,
                  fontSize: 13,
                  color: "#166534",
                  fontWeight: 500,
                }}
              >
                💡 <em>"Alone, they are resources. Together, they become a venture."</em>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardHref}
                      id="hero-dashboard-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 15,
                        fontWeight: 700,
                        padding: "12px 26px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 10,
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                      }}
                    >
                      <LayoutDashboard size={18} />
                      Buka Dashboard ({user?.name.split(" ")[0]})
                    </Link>
                    <Link
                      href="/explore"
                      id="hero-explore-btn"
                      className="btn-secondary"
                      style={{ fontSize: 15, padding: "11px 24px" }}
                    >
                      <Rocket size={17} />
                      Jelajahi Ide Bisnis
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/explore"
                      id="hero-explore-btn"
                      className="btn-primary"
                      style={{ fontSize: 15, padding: "11px 24px" }}
                    >
                      <Rocket size={17} />
                      Jelajahi Ide Bisnis
                    </Link>
                    <Link
                      href="/register"
                      id="hero-register-btn"
                      className="btn-secondary"
                      style={{ fontSize: 15, padding: "11px 24px" }}
                    >
                      Punya Ide? Mulai Sekarang
                    </Link>
                  </>
                )}
              </div>

              {/* AI Teaser */}
              <Link
                href={isLoggedIn ? "/dashboard/ai-copilot" : "/ai-assistant"}
                id="hero-ai-teaser-link"
                style={{
                  marginTop: 32,
                  padding: "12px 16px",
                  background: "#f8f9fa",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  maxWidth: 360,
                  textDecoration: "none",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#eff6ff",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={18} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
                    Weaven AI Copilot
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", fontStyle: "italic" }}>
                    "Cari bisnis sesuai profil saya" →
                  </div>
                </div>
              </Link>
            </div>

            {/* Right: Visual Cards */}
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Brand Philosophy Interactive Card */}
              <div
                className="card"
                style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)",
                  color: "#fff",
                  borderRadius: 12,
                  border: "1px solid #312e81",
                }}
              >
                <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  The 4 Weaven Pillars
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                  Idea × Capital × Talent × Assets
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Idea", desc: "Ide & Inovasi", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
                    { label: "Capital", desc: "Modal & Investor", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
                    { label: "Talent", desc: "Skill & Builder", color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
                    { label: "Assets", desc: "Peluang & Alat", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
                  ].map((p) => (
                    <div
                      key={p.label}
                      style={{
                        background: p.bg,
                        border: `1px solid ${p.color}33`,
                        borderRadius: 8,
                        padding: "8px 10px",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e1" }}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peluang Investasi card */}
              <div className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    Peluang Weaven Terkurasi
                  </div>
                  <span style={{ padding: "2px 8px", background: "#eff6ff", color: "#2563eb", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                    Weaven AI Match
                  </span>
                </div>
                {[
                  { name: "EDUKITA", sector: "EdTech", match: 95 },
                  { name: "PANENLOKAL", sector: "AgriTech", match: 88 },
                ].map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.sector}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>
                      {item.match}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================
            BRAND PHILOSOPHY & NARRATIVE
            ============================ */}
        <section style={{ padding: "64px 24px", background: "#f8f9fa" }} className="section-padding-md">
          <div
            className="problem-grid"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
          >
            {/* Masalah & Potensi Terpisah */}
            <div className="card" style={{ padding: "32px" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "#fef2f2",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 22 }}>🧩</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                Tantangan: Potensi yang Terpisah
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>
                Sebuah bisnis bukan tercipta hanya karena ada ide. Sebuah ide membutuhkan: <strong>Idea × Capital × Talent × Assets</strong>.
              </p>
              <ul style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li>Ada mahasiswa/founder yang punya ide bagus, tetapi tidak punya modal.</li>
                <li>Ada investor yang punya modal, tetapi kesulitan menemukan peluang yang sesuai.</li>
                <li>Ada profesional bertalenta, tetapi belum menemukan venture yang tepat untuk dibangun.</li>
                <li>Ada aset yang menganggur, tetapi tidak bertemu dengan pihak yang bisa mengoptimalkannya.</li>
              </ul>
            </div>

            {/* Solusi: Ekosistem Weaven */}
            <div
              style={{
                background: "#2563eb",
                borderRadius: 10,
                padding: "32px",
                boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
                color: "#fff",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Rocket size={22} color="#fff" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                Solusi: Weaven Ecosystem
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, marginBottom: 16 }}>
                Weaven hadir untuk merajut semuanya. Seperti benang-benang yang sendiri-sendiri mungkin terlihat biasa, tetapi ketika dirajut dengan struktur yang tepat, mereka menjadi sesuatu yang jauh lebih bernilai.
              </p>
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                ✨ <em>"We don’t just connect people. We weave possibilities into ventures."</em>
              </div>
            </div>
          </div>
        </section>

        {/* ============================
            CARA KERJA
            ============================ */}
        <section style={{ padding: "64px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 8,
              }}
            >
              Cara Kerja Weaven
            </h2>
            <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 56 }}>
              Tiga langkah merajut potensi Anda menjadi venture nyata.
            </p>

            <div
              className="steps-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 32,
              }}
            >
              {[
                {
                  icon: <Search size={28} color="#2563eb" />,
                  bg: "#eff6ff",
                  title: "1. Weave / Temukan (Discover)",
                  desc: "Jelajahi database ide bisnis yang telah dikurasi atau temukan investor dan talent yang mencari profil seperti Anda.",
                },
                {
                  icon: <Handshake size={28} color="#7c3aed" />,
                  bg: "#faf5ff",
                  title: "2. Connect / Cocokkan (Match)",
                  desc: "Gunakan Weaven AI Copilot kami untuk menemukan keselarasan sempurna antara ide, modal, aset, dan kemampuan.",
                },
                {
                  icon: <Rocket size={28} color="#2563eb" />,
                  bg: "#eff6ff",
                  title: "3. Build / Bangun (Venture)",
                  desc: "Mulai kolaborasi dengan tim dan mitra modal Anda, tanda tangani Smart NDA, dan wujudkan venture bisnis Anda.",
                },
              ].map((step) => (
                <div key={step.title} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      background: step.bg,
                      borderRadius: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================
            PELUANG UNGGULAN
            ============================ */}
        <section style={{ padding: "64px 24px", background: "#f8f9fa" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
                  Peluang Unggulan Weaven
                </h2>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  Proyek terverifikasi yang siap untuk aksesi atau pendanaan.
                </p>
              </div>
              <Link
                href="/explore"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2563eb",
                  textDecoration: "none",
                }}
              >
                Lihat Semua
                <ChevronRight size={16} />
              </Link>
            </div>

            <div
              className="opportunities-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
                marginTop: 24,
              }}
            >
              {featuredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        </section>

        {/* ============================
            KENAPA LEBIH TRANSPARAN
            ============================ */}
        <section style={{ padding: "64px 24px", background: "#fff" }}>
          <div
            className="transparent-grid"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "center",
            }}
          >
            {/* Left: Text */}
            <div>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 16,
                }}
              >
                Kenapa Weaven Lebih Transparan & Aman?
              </h2>
              <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, marginBottom: 32 }}>
                Kepercayaan adalah fondasi utama dalam merajut kemitraan modal dan bisnis.
                Weaven menerapkan standar verifikasi institusional dan perlindungan data yang ketat.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  {
                    icon: <Shield size={20} color="#2563eb" />,
                    bg: "#eff6ff",
                    title: "KYC & Due Diligence Terstruktur",
                    desc: "Setiap investor dan founder diverifikasi identitas dan latar belakang profesionalnya.",
                  },
                  {
                    icon: <CheckCircle size={20} color="#16a34a" />,
                    bg: "#f0fdf4",
                    title: "Verifikasi Ekosistem & Kampus",
                    desc: 'Proyek yang ditandai "Terverifikasi" melewati kurasi inkubator dan mitra terpercaya.',
                  },
                  {
                    icon: <FileText size={20} color="#7c3aed" />,
                    bg: "#faf5ff",
                    title: "Smart NDA Otomatis",
                    desc: "Perlindungan kekayaan intelektual (NDA) otomatis sebelum akses data sensitif pitch deck diberikan.",
                  },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 16 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: item.bg,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div style={{ position: "relative" }}>
              <div className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#2563eb",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Rocket size={14} color="#fff" />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Weaven</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>Ecosystem Network</span>
                </div>

                <div
                  style={{
                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    borderRadius: 12,
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 180,
                  }}
                >
                  {/* Abstract network visualization */}
                  <div style={{ position: "relative", width: 160, height: 160 }}>
                    {[
                      { x: 80, y: 80, size: 48, label: "WV" },
                      { x: 20, y: 30, size: 32, label: "Idea" },
                      { x: 130, y: 25, size: 28, label: "Capital" },
                      { x: 140, y: 130, size: 30, label: "Talent" },
                      { x: 15, y: 130, size: 26, label: "Asset" },
                    ].map((node) => (
                      <div
                        key={node.label}
                        style={{
                          position: "absolute",
                          left: node.x - node.size / 2,
                          top: node.y - node.size / 2,
                          width: node.size,
                          height: node.size,
                          borderRadius: "50%",
                          background: node.label === "WV" ? "#2563eb" : "#fff",
                          border: node.label === "WV" ? "none" : "2px solid #2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: node.label === "WV" ? 14 : 9,
                          fontWeight: 700,
                          color: node.label === "WV" ? "#fff" : "#2563eb",
                          boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
                          zIndex: 2,
                        }}
                      >
                        {node.label}
                      </div>
                    ))}
                    {/* Connection lines via SVG */}
                    <svg
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
                      viewBox="0 0 160 160"
                    >
                      {[
                        [80, 80, 20, 30],
                        [80, 80, 130, 25],
                        [80, 80, 140, 130],
                        [80, 80, 15, 130],
                      ].map(([x1, y1, x2, y2], i) => (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#bfdbfe"
                          strokeWidth="1.5"
                          strokeDasharray="4,3"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================
            CTA BOTTOM
            ============================ */}
        <section
          style={{
            background: "#111827",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              Siap untuk merajut venture Anda?
            </h2>
            <p style={{ fontSize: 16, color: "#9ca3af", marginBottom: 32, lineHeight: 1.6 }}>
              Bergabunglah dengan ribuan founder, investor, talent, dan pemilik aset yang
              merajut masa depan bisnis Indonesia bersama Weaven.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {isLoggedIn ? (
                <Link
                  href={dashboardHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 28px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                >
                  <LayoutDashboard size={17} />
                  Buka Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 28px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                >
                  <Rocket size={17} />
                  Mulai Sekarang — Gratis
                </Link>
              )}
              <Link
                href="/explore"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
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
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .opportunities-grid { grid-template-columns: 1fr 1fr !important; }
          .transparent-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .problem-grid { grid-template-columns: 1fr !important; }
          .hero-section { padding: 40px 16px 48px !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .hero-grid > :last-child { display: none !important; }
          .hero-section { padding: 32px 16px 40px !important; }
          .steps-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .opportunities-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .transparent-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .problem-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .section-padding-md { padding: 40px 16px !important; }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 24px 16px 32px !important; }
        }
      `}</style>
    </div>
  );
}
