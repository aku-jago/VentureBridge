"use client";

import { useState } from "react";
import { Search, Sparkles, Filter, ArrowLeft, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { OpportunityCard } from "@/components/venturebridge/OpportunityCard";
import { AdsModal } from "@/components/venturebridge/AdsModal";
import { mockOpportunities } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { useAds } from "@/contexts/AdsContext";
import type { BusinessStage } from "@/types";
import Link from "next/link";

const SECTORS = ["AgriTech", "FinTech", "HealthTech", "EdTech", "F&B", "Marketplace", "SaaS", "IoT"];
const STAGES: { value: BusinessStage; label: string }[] = [
  { value: "ideation", label: "Ideation" },
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "early_stage", label: "Early Stage" },
];
const SEEKING = [
  { value: "investor", label: "Investor" },
  { value: "cofounder", label: "Co-Founder" },
  { value: "mentor", label: "Mentor" },
];

export default function ExploreIdeasPage() {
  const { user, isLoggedIn } = useAuth();
  const { boostedListingIds } = useAds();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSeeking, setSelectedSeeking] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Direkomendasikan AI");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdsModal, setShowAdsModal] = useState(false);
  const [adsTarget, setAdsTarget] = useState<{ id: string; title: string } | null>(null);

  const ITEMS_PER_PAGE = 6;

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function toggleSave(id: string) {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  const filtered = mockOpportunities.filter((opp) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || opp.title.toLowerCase().includes(q) || opp.sector.some((s) => s.toLowerCase().includes(q)) || opp.location.toLowerCase().includes(q);
    const matchSector = selectedSectors.length === 0 || opp.sector.some((s) => selectedSectors.includes(s));
    const matchStage = selectedStages.length === 0 || selectedStages.includes(opp.stage);
    const matchSeeking = selectedSeeking.length === 0 || opp.seekingRoles.some((r) => selectedSeeking.includes(r));
    return matchSearch && matchSector && matchStage && matchSeeking;
  });

  // Sort: boosted first, then by match score
  const sorted = [...filtered].sort((a, b) => {
    const aBoost = boostedListingIds.includes(a.id) ? 1 : 0;
    const bBoost = boostedListingIds.includes(b.id) ? 1 : 0;
    if (bBoost !== aBoost) return bBoost - aBoost;
    return (b.matchScore ?? 0) - (a.matchScore ?? 0);
  });

  const boosted = sorted.filter((o) => boostedListingIds.includes(o.id));
  const regular = sorted.filter((o) => !boostedListingIds.includes(o.id));

  const totalPages = Math.ceil(regular.length / ITEMS_PER_PAGE);
  const paged = regular.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const ideasMainContent = (
    <div style={{ display: "flex", gap: 24, width: "100%" }}>
      {/* Sidebar Filter */}
      <aside
        style={{
          width: 240,
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: "20px",
          flexShrink: 0,
          height: "fit-content",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Link href="/explore" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 12 }}>
            <ArrowLeft size={14} /> Semua Kategori
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            <Filter size={14} /> Filter
          </div>
          <button onClick={() => { setSelectedSectors([]); setSelectedStages([]); setSelectedSeeking([]); }}
            style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Reset</button>
        </div>

        {/* Sektor */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Sektor</div>
          {SECTORS.map((s) => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={selectedSectors.includes(s)} onChange={() => setSelectedSectors(toggle(selectedSectors, s))}
                style={{ accentColor: "#7c3aed", width: 14, height: 14 }} />
              <span style={{ fontSize: 13, color: "#374151" }}>{s}</span>
            </label>
          ))}
        </div>

        {/* Stage */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Tahap Bisnis</div>
          {STAGES.map((st) => (
            <label key={st.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={selectedStages.includes(st.value)} onChange={() => setSelectedStages(toggle(selectedStages, st.value))}
                style={{ accentColor: "#7c3aed", width: 14, height: 14 }} />
              <span style={{ fontSize: 13, color: "#374151" }}>{st.label}</span>
            </label>
          ))}
        </div>

        {/* Seeking */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Mencari</div>
          {SEEKING.map((sk) => (
            <label key={sk.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={selectedSeeking.includes(sk.value)} onChange={() => setSelectedSeeking(toggle(selectedSeeking, sk.value))}
                style={{ accentColor: "#7c3aed", width: 14, height: 14 }} />
              <span style={{ fontSize: 13, color: "#374151" }}>{sk.label}</span>
            </label>
          ))}
        </div>

        {/* Ads CTA for founders */}
        {isLoggedIn && (user?.role === "founder" || user?.role === "cofounder") && (
          <div style={{ background: "linear-gradient(135deg, #f5f3ff, #eff6ff)", border: "1px solid #e9d5ff", borderRadius: 12, padding: "14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>💡 Punya Listing?</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Boost listing ke posisi teratas mulai Rp 99.000!</div>
            <button
              onClick={() => { setAdsTarget({ id: "my-listing", title: "Listing Saya" }); setShowAdsModal(true); }}
              style={{ width: "100%", padding: "8px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
            >
              <Zap size={13} /> Boost Listing
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Ide Bisnis</h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>Eksplorasi startup dan ide bisnis inovatif dari founder seluruh Indonesia</p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Cari ide, sektor, kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", background: "#fff" }}>
            <option>Direkomendasikan AI</option>
            <option>Terbaru</option>
            <option>Target Modal Tertinggi</option>
          </select>
          <button style={{ padding: "10px 16px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={14} /> Cari dengan AI
          </button>
        </div>

        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
          Menampilkan <strong>{sorted.length}</strong> ide bisnis
          {boosted.length > 0 && <span style={{ marginLeft: 8, color: "#7c3aed", fontWeight: 600 }}>({boosted.length} sponsored di atas)</span>}
        </div>

        {/* Sponsored / Boosted Section */}
        {boosted.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #fef3c7, #fffbeb)", border: "1px solid #fcd34d", borderRadius: 999, padding: "3px 12px" }}>
                <Zap size={12} color="#d97706" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#d97706" }}>SPONSORED</span>
              </div>
              <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {boosted.map((opp) => (
                <div key={opp.id} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2, display: "flex", alignItems: "center", gap: 4, background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                    <Zap size={10} /> Sponsored
                  </div>
                  <div style={{ border: "2px solid #fcd34d", borderRadius: 14, overflow: "hidden" }}>
                    <OpportunityCard
                      opportunity={opp}
                      isSaved={savedIds.includes(opp.id)}
                      onSave={() => toggleSave(opp.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "#e2e8f0", margin: "20px 0" }} />
          </div>
        )}

        {/* Regular listings */}
        {paged.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
            <Search size={40} color="#e2e8f0" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Tidak ada hasil ditemukan</div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {paged.map((opp) => (
            <div key={opp.id} style={{ position: "relative" }}>
              <OpportunityCard
                opportunity={opp}
                isSaved={savedIds.includes(opp.id)}
                onSave={() => toggleSave(opp.id)}
              />
              {/* Boost button for founders on their own listings */}
              {isLoggedIn && user?.id === opp.founderId && !boostedListingIds.includes(opp.id) && (
                <button
                  onClick={() => { setAdsTarget({ id: opp.id, title: opp.title }); setShowAdsModal(true); }}
                  style={{ position: "absolute", bottom: 14, right: 14, display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", border: "none", borderRadius: 8, padding: "5px 11px", fontSize: 11, fontWeight: 700, cursor: "pointer", zIndex: 2 }}
                >
                  <Zap size={11} /> Boost
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 28 }}>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} color={currentPage === 1 ? "#e2e8f0" : "#374151"} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                style={{ width: 36, height: 36, border: "none", borderRadius: 8, background: p === currentPage ? "#7c3aed" : "#fff", color: p === currentPage ? "#fff" : "#374151", fontWeight: p === currentPage ? 700 : 400, cursor: "pointer", fontSize: 13, boxShadow: p === currentPage ? "none" : "0 1px 3px rgba(0,0,0,0.08)" }}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} color={currentPage === totalPages ? "#e2e8f0" : "#374151"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const modalElement = showAdsModal && adsTarget && (
    <AdsModal
      listingId={adsTarget.id}
      listingTitle={adsTarget.title}
      listingType="idea"
      onClose={() => { setShowAdsModal(false); setAdsTarget(null); }}
    />
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content" style={{ padding: "32px 36px" }}>
          {ideasMainContent}
          {modalElement}
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <TopNavBar />
      <main style={{ flex: 1, padding: "32px 24px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        {ideasMainContent}
        {modalElement}
      </main>
      <Footer />
    </div>
  );
}
