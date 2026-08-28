"use client";

import { use, useState } from "react";
import {
  MapPin,
  ArrowLeft,
  Lock,
  Unlock,
  Shield,
  CheckCircle,
  Users,
  TrendingUp,
  FileText,
  X,
  Coins,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { VerificationBadge } from "@/components/venturebridge/VerificationBadge";
import { BusinessStageBadge } from "@/components/venturebridge/BusinessStageBadge";
import { mockOpportunities } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { useToken } from "@/contexts/TokenContext";
import { useAuth } from "@/contexts/AuthContext";

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const opportunity = mockOpportunities.find((o) => o.id === id) ?? mockOpportunities[0];
  const { isOpportunityUnlocked, unlockOpportunity, investorBalance, tokenUnlockCost } = useToken();
  const { user, isLoggedIn } = useAuth();

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");
  const [accessRequested, setAccessRequested] = useState(false);

  // Token-based unlock modal state
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockResult, setUnlockResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const isUnlocked = isOpportunityUnlocked(opportunity.id);
  const isInvestor = user?.role === "investor" || user?.role === "capex_provider";

  function handleClickAccess() {
    if (!user || !isLoggedIn) {
      router.push(`/login?redirect=/opportunities/${opportunity.id}`);
      return;
    }
    if (isInvestor) {
      // Investors use token system
      setShowUnlockModal(true);
      setUnlockResult(null);
    } else {
      // Non-investor: old modal flow
      setShowAccessModal(true);
    }
  }

  function handleUnlock() {
    setIsUnlocking(true);
    const result = unlockOpportunity(
      opportunity.id,
      opportunity.title,
      opportunity.founderId,
      opportunity.founder.name
    );
    setUnlockResult(result);
    setIsUnlocking(false);
  }

  function handleRequestAccess() {
    if (!ndaAccepted) return;
    setAccessRequested(true);
    setShowAccessModal(false);
  }

  const detailBody = (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13 }}>
        <Link href="/explore" style={{ color: "#6b7280", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={14} />
          Kembali ke Explore
        </Link>
      </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Main Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header Card */}
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {opportunity.verificationStatus === "verified" && (
                  <VerificationBadge badge={{ type: "business", label: "Terverifikasi" }} size="md" />
                )}
                <BusinessStageBadge stage={opportunity.stage} size="md" />
                {opportunity.sector.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "3px 10px",
                      background: "#f3f4f6",
                      color: "#374151",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                {opportunity.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}>
                  <MapPin size={14} />
                  {opportunity.location}
                </span>
                {opportunity.teamSize && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}>
                    <Users size={14} />
                    {opportunity.teamSize} orang
                  </span>
                )}
              </div>

              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7 }}>
                {opportunity.description}
              </p>
            </div>

            {/* Traction */}
            {opportunity.traction && (
              <div className="card" style={{ padding: "20px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                  Traksi & Pencapaian
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#f0fdf4",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={18} color="#16a34a" />
                  </div>
                  <p style={{ fontSize: 14, color: "#374151" }}>{opportunity.traction}</p>
                </div>
              </div>
            )}

            {/* Locked / Unlocked Information */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                {isUnlocked ? (
                  <Unlock size={16} color="#16a34a" />
                ) : (
                  <Lock size={16} color="#9ca3af" />
                )}
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  {isUnlocked ? "Informasi Lengkap" : "Informasi Tertutup"}
                </h2>
                {isUnlocked && (
                  <span style={{ marginLeft: "auto", fontSize: 12, background: "#f0fdf4", color: "#16a34a", padding: "2px 10px", borderRadius: 999, fontWeight: 600, border: "1px solid #86efac" }}>
                    ✓ Akses Aktif
                  </span>
                )}
              </div>

              {isUnlocked ? (
                // Show actual content after unlock
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Detail Model Bisnis & Revenue Model", value: "Platform subscription B2C dengan tiers Freemium, Basic (Rp 49k/bln), dan Premium (Rp 99k/bln). Revenue tambahan dari lisensi sekolah (enterprise) Rp 5jt/tahun/sekolah." },
                    { label: "Proyeksi Keuangan 3 Tahun", value: "Tahun 1: Rp 1.2M ARR | Tahun 2: Rp 4.8M ARR | Tahun 3: Rp 14M ARR. Break-even projected Q3 Year 2." },
                    { label: "Data Pengguna & Metrik Detail", value: "5.200 MAU, 62% retention rate, NPS 74, CAC Rp 35k, LTV Rp 890k (LTV:CAC = 25.4x)." },
                    { label: "Informasi Tim & Equity Split", value: "Dzakki (CEO/CTO) 45%, Co-founder #2 (CPO) 35%, ESOP Pool 20%. Tim 4 orang full-time." },
                    { label: "Dokumen Legal & Cap Table", value: "PT terdaftar, NPWP aktif. Cap table tersedia untuk dibagikan setelah NDA ditandatangani." },
                  ].map(item => (
                    <div key={item.label} style={{ padding: "14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#065f46", marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                // Show locked items
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Detail model bisnis & revenue model",
                      "Proyeksi keuangan 3 tahun",
                      "Data pengguna & metrik detail",
                      "Informasi tim & equity split",
                      "Dokumen legal & cap table",
                    ].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8f9fa", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                        <Lock size={14} color="#9ca3af" />
                        <span style={{ fontSize: 13, color: "#9ca3af" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {isInvestor ? (
                    <div style={{ marginTop: 14, padding: "12px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe", fontSize: 12, color: "#1e40af", display: "flex", alignItems: "center", gap: 8 }}>
                      <Coins size={14} />
                      Gunakan <strong>{tokenUnlockCost} token</strong> untuk melihat informasi lengkap ini.
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12, lineHeight: 1.5 }}>
                      Informasi di atas hanya dapat diakses setelah pemilik bisnis menyetujui permintaan akses Anda.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Funding Card */}
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                Target Modal
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
                {formatCurrency(opportunity.targetFunding)}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {opportunity.seekingRoles.map((role) => (
                  <div
                    key={role}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      background: "#eff6ff",
                      borderRadius: 8,
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <CheckCircle size={14} color="#2563eb" />
                    <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
                      Mencari {role === "investor" ? "Investor" : role === "cofounder" ? "Co-Founder" : "Mentor"}
                    </span>
                  </div>
                ))}
              </div>

              {isUnlocked ? (
                <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac", textAlign: "center" }}>
                  <Unlock size={20} color="#16a34a" style={{ margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Akses Penuh Aktif</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Kamu sudah mengakses detail bisnis ini</div>
                </div>
              ) : accessRequested ? (
                <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac", textAlign: "center" }}>
                  <CheckCircle size={20} color="#16a34a" style={{ margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Permintaan Terkirim!</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Menunggu persetujuan pemilik</div>
                </div>
              ) : (
                <button
                  onClick={handleClickAccess}
                  style={{ width: "100%", padding: "12px", background: isInvestor ? "linear-gradient(135deg, #1e40af, #7c3aed)" : "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {isInvestor ? (
                    <><Coins size={16} /> Akses Detail ({tokenUnlockCost} Token)</>
                  ) : (
                    <><FileText size={16} /> Minta Akses Informasi</>
                  )}
                </button>
              )}
            </div>

            {/* Match Score */}
            {opportunity.matchScore && (
              <div className="card" style={{ padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                  Kecocokan AI dengan Profil Anda
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#2563eb" }}>
                  {opportunity.matchScore}%
                </div>
              </div>
            )}

            {/* Founder */}
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
                Founder
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {opportunity.founder.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {opportunity.founder.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  const modals = (
    <>
      {/* Token Unlock Modal (for investors) */}
      {showUnlockModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, backdropFilter: "blur(4px)" }}
          onClick={e => e.target === e.currentTarget && setShowUnlockModal(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
            {unlockResult?.success ? (
              // Success state
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 72, height: 72, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Unlock size={36} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Akses Berhasil!</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>{unlockResult.message}</p>
                <button onClick={() => setShowUnlockModal(false)} style={{ padding: "12px 32px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Lihat Detail Sekarang</button>
              </div>
            ) : (
              // Confirm state
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Akses Detail Bisnis</h2>
                  <button onClick={() => setShowUnlockModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
                </div>

                {/* Opportunity summary */}
                <div style={{ background: "#f8faff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{opportunity.title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{opportunity.location} • {opportunity.sector.join(", ")}</div>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {["Detail model bisnis & revenue model", "Proyeksi keuangan 3 tahun", "Data pengguna & metrik", "Informasi tim & equity split", "Dokumen legal & cap table"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#374151" }}>
                        <CheckCircle size={12} color="#2563eb" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Token cost */}
                <div style={{ background: "linear-gradient(135deg, #1e40af, #7c3aed)", borderRadius: 12, padding: "16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Biaya Akses</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Coins size={20} />
                      <span style={{ fontSize: 24, fontWeight: 800 }}>{tokenUnlockCost} token</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Saldo kamu</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{investorBalance} token</div>
                  </div>
                </div>

                {unlockResult && !unlockResult.success && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "#b91c1c" }}>
                    {unlockResult.message}
                    <Link href="/investor/tokens" style={{ display: "block", marginTop: 6, color: "#2563eb", fontSize: 12 }}>→ Top up token sekarang</Link>
                  </div>
                )}

                {investorBalance < tokenUnlockCost ? (
                  <Link href="/investor/tokens" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                    <Coins size={16} /> Top Up Token Dulu
                  </Link>
                ) : (
                  <button onClick={handleUnlock} disabled={isUnlocking}
                    style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #1e40af, #7c3aed)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Zap size={16} /> Gunakan {tokenUnlockCost} Token & Akses Sekarang
                  </button>
                )}
                <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                  Token yang digunakan akan langsung masuk ke wallet founder.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Access Request Modal */}
      {showAccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAccessModal(false);
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 480,
              padding: "28px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#eff6ff",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield size={18} color="#2563eb" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                    Minta Akses Detail
                  </h2>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {opportunity.title}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAccessModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* NDA Warning */}
            <div
              style={{
                padding: "14px 16px",
                background: "#fffbeb",
                borderRadius: 10,
                border: "1px solid #fcd34d",
                marginBottom: 20,
                display: "flex",
                gap: 10,
              }}
            >
              <Shield size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#d97706", marginBottom: 4 }}>
                  Lindungi Informasi Bisnis Anda
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
                  Dengan melanjutkan, Anda menyetujui bahwa informasi yang diterima bersifat konfidensial dan tidak akan dibagikan tanpa izin pemilik.
                </p>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                Pesan untuk Pemilik Bisnis
              </label>
              <textarea
                value={accessMessage}
                onChange={(e) => setAccessMessage(e.target.value)}
                placeholder="Perkenalkan diri Anda dan jelaskan mengapa Anda tertarik dengan bisnis ini..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* NDA Checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 20,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={ndaAccepted}
                onChange={(e) => setNdaAccepted(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#2563eb", width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                Saya menyetujui <strong>Perjanjian Kerahasiaan (NDA)</strong> dan memahami bahwa informasi yang saya terima bersifat konfidensial.
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleRequestAccess}
              disabled={!ndaAccepted}
              style={{
                width: "100%",
                padding: "12px",
                background: ndaAccepted ? "#2563eb" : "#e5e7eb",
                color: ndaAccepted ? "#fff" : "#9ca3af",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: ndaAccepted ? "pointer" : "not-allowed",
                transition: "background 0.15s ease",
              }}
            >
              Kirim Permintaan Akses
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content" style={{ padding: "32px 36px" }}>
          {detailBody}
          {modals}
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <TopNavBar />
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "32px 24px", flex: 1 }}>
        {detailBody}
        {modals}
      </div>
      <Footer />
    </div>
  );
}
