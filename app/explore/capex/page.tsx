"use client";

import { useState } from "react";
import { Search, Sparkles, Filter, ArrowLeft, Zap, ChevronLeft, ChevronRight, Building2, MapPin, Maximize2, X, SlidersHorizontal } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AdsModal } from "@/components/venturebridge/AdsModal";
import { mockCapexListings } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { useAds } from "@/contexts/AdsContext";
import { useOffer } from "@/contexts/OfferContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CapexListing } from "@/types";

const CAPEX_TYPES: { value: CapexListing["capexType"]; label: string; color: string; bg: string }[] = [
  { value: "sell", label: "Dijual", color: "#2563eb", bg: "#eff6ff" },
  { value: "rent", label: "Disewa", color: "#16a34a", bg: "#f0fdf4" },
  { value: "invest", label: "Investasi", color: "#d97706", bg: "#fffbeb" },
];

const PROPERTY_TYPES = ["Lahan/Tanah", "Bangunan", "Ruko", "Gudang", "Kantor/Office", "Mixed-Use"];
const LOCATIONS = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Bali", "Medan"];

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Miliar`;
  }
  return `Rp ${(amount / 1_000_000).toLocaleString("id-ID")} Jt`;
}

function CapexCard({
  listing,
  isSponsored,
  isMine,
  onBoost,
  onContact,
}: {
  listing: CapexListing;
  isSponsored: boolean;
  isMine: boolean;
  onBoost: () => void;
  onContact: () => void;
}) {
  const typeConfig = CAPEX_TYPES.find((t) => t.value === listing.capexType) || CAPEX_TYPES[0];
  const suffix = listing.capexType === "rent" ? "/bulan" : listing.capexType === "invest" ? " (modal bersama)" : "";

  return (
    <div
      style={{
        background: "#fff",
        border: isSponsored ? "2px solid #fcd34d" : "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        boxShadow: isSponsored ? "0 4px 16px rgba(245,158,11,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {isSponsored && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "3px 10px",
            borderRadius: 999,
          }}
        >
          <Zap size={10} /> SPONSORED
        </div>
      )}

      {/* Tags row */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12, flexWrap: "wrap", paddingRight: isSponsored ? 90 : 0 }}>
        {listing.verificationStatus === "verified" && (
          <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: 999, fontWeight: 700, border: "1px solid #86efac" }}>
            ✓ Terverifikasi
          </span>
        )}
        <span style={{ fontSize: 11, padding: "2px 8px", background: typeConfig.bg, color: typeConfig.color, borderRadius: 999, fontWeight: 700 }}>
          {typeConfig.label}
        </span>
        <span style={{ fontSize: 11, padding: "2px 8px", background: "#f8fafc", color: "#64748b", borderRadius: 999, border: "1px solid #e2e8f0" }}>
          {listing.propertyType}
        </span>
      </div>

      {/* Title & description */}
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6, lineHeight: 1.4 }}>
          {listing.title}
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {listing.shortDescription}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
          <MapPin size={13} color="#94a3b8" /> {listing.location}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
          <Maximize2 size={13} color="#94a3b8" /> {listing.area.toLocaleString("id-ID")} m²
        </div>
      </div>

      {/* Sector tags */}
      {listing.sector && listing.sector.length > 0 && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
          {listing.sector.map((s) => (
            <span key={s} style={{ fontSize: 11, padding: "2px 8px", background: "#f5f3ff", color: "#7c3aed", borderRadius: 999, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      )}

      {/* Facilities */}
      {listing.facilities && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
          {listing.facilities.slice(0, 3).map((f) => (
            <span key={f} style={{ fontSize: 11, padding: "2px 8px", background: "#f8fafc", color: "#64748b", borderRadius: 999, border: "1px solid #e2e8f0" }}>{f}</span>
          ))}
          {listing.facilities.length > 3 && (
            <span style={{ fontSize: 11, padding: "2px 8px", background: "#f8fafc", color: "#94a3b8", borderRadius: 999, border: "1px solid #e2e8f0" }}>+{listing.facilities.length - 3} lainnya</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Harga</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a" }}>
            {formatRupiah(listing.price)}<span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>{suffix}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {isMine && !isSponsored && (
            <button
              onClick={(e) => { e.stopPropagation(); onBoost(); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              <Zap size={12} /> Boost
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContact();
            }}
            style={{ padding: "7px 14px", background: "#f5f3ff", color: "#7c3aed", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            Hubungi
          </button>
        </div>
      </div>

      {/* Owner Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 8, borderTop: "1px solid #f8fafc" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {listing.owner.name.substring(0, 2).toUpperCase()}
        </div>
        <span style={{ fontSize: 12, color: "#64748b" }}>{listing.owner.name}</span>
      </div>
    </div>
  );
}

export default function ExploreCapexPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { boostedListingIds } = useAds();
  const { sendOffer } = useOffer();

  const [search, setSearch] = useState("");
  const [capexTypeFilter, setCapexTypeFilter] = useState<string[]>([]);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Terbaru");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdsModal, setShowAdsModal] = useState(false);
  const [adsTarget, setAdsTarget] = useState<{ id: string; title: string } | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const ITEMS_PER_PAGE = 6;

  function handleContact() {
    if (!isLoggedIn) {
      router.push("/login?redirect=/explore/capex");
      return;
    }
    router.push("/dashboard/messages");
  }

  function handleBoost(id: string, title: string) {
    if (!isLoggedIn) {
      router.push("/login?redirect=/explore/capex");
      return;
    }
    setAdsTarget({ id, title });
    setShowAdsModal(true);
  }

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  const activeFiltersCount = capexTypeFilter.length + propertyTypeFilter.length + locationFilter.length;

  const filtered = mockCapexListings.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.sector?.some((s) => s.toLowerCase().includes(q));
    const matchCapex = capexTypeFilter.length === 0 || capexTypeFilter.includes(c.capexType);
    const matchProp = propertyTypeFilter.length === 0 || propertyTypeFilter.includes(c.propertyType);
    const matchLoc = locationFilter.length === 0 || locationFilter.includes(c.location);
    return matchSearch && matchCapex && matchProp && matchLoc;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aBoost = boostedListingIds.includes(a.id) || a.isAds ? 1 : 0;
    const bBoost = boostedListingIds.includes(b.id) || b.isAds ? 1 : 0;
    return bBoost - aBoost;
  });

  const boosted = sorted.filter((c) => boostedListingIds.includes(c.id) || c.isAds);
  const regular = sorted.filter((c) => !boostedListingIds.includes(c.id) && !c.isAds);
  const totalPages = Math.ceil(regular.length / ITEMS_PER_PAGE);
  const paged = regular.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const FilterElements = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          <Filter size={14} /> Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </div>
        <button
          onClick={() => { setCapexTypeFilter([]); setPropertyTypeFilter([]); setLocationFilter([]); }}
          style={{ fontSize: 12, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          Reset
        </button>
      </div>

      {/* Tipe Listing */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Tipe Listing</div>
        {CAPEX_TYPES.map((ct) => (
          <label key={ct.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer" }}>
            <input type="checkbox" checked={capexTypeFilter.includes(ct.value)} onChange={() => setCapexTypeFilter(toggle(capexTypeFilter, ct.value))}
              style={{ accentColor: "#2563eb", width: 14, height: 14 }} />
            <span style={{ fontSize: 12, padding: "2px 8px", background: ct.bg, color: ct.color, borderRadius: 999, fontWeight: 600 }}>{ct.label}</span>
          </label>
        ))}
      </div>

      {/* Jenis Properti */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Jenis Properti</div>
        {PROPERTY_TYPES.map((pt) => (
          <label key={pt} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={propertyTypeFilter.includes(pt)} onChange={() => setPropertyTypeFilter(toggle(propertyTypeFilter, pt))}
              style={{ accentColor: "#2563eb", width: 14, height: 14 }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{pt}</span>
          </label>
        ))}
      </div>

      {/* Lokasi */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Lokasi</div>
        {LOCATIONS.map((loc) => (
          <label key={loc} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={locationFilter.includes(loc)} onChange={() => setLocationFilter(toggle(locationFilter, loc))}
              style={{ accentColor: "#2563eb", width: 14, height: 14 }} />
            <span style={{ fontSize: 13, color: "#374151" }}>{loc}</span>
          </label>
        ))}
      </div>

      {/* Ads CTA */}
      <div style={{ background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>🏢 Punya Properti?</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Boost listing properti ke posisi teratas!</div>
        <button
          onClick={() => { setAdsTarget({ id: "my-capex", title: "Properti Saya" }); setShowAdsModal(true); }}
          style={{ width: "100%", padding: "8px", background: "linear-gradient(135deg, #2563eb, #0891b2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
        >
          <Zap size={13} /> Boost Listing
        </button>
      </div>
    </>
  );

  const capexMainContent = (
    <div className="explore-layout" style={{ display: "flex", gap: 24, width: "100%" }}>
      {/* Desktop Sidebar */}
      <aside
        className="explore-filter-desktop"
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
        <Link href="/explore" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 12, marginBottom: 16 }}>
          <ArrowLeft size={14} /> Semua Kategori
        </Link>
        <FilterElements />
      </aside>

      {/* Main Content Area */}
      <div className="explore-cards-container" style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Link href="/explore" style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={13} /> Hub Explore
            </Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Capex &amp; Properti Bisnis</h1>
          <p style={{ fontSize: 13, color: "#64748b" }}>Temukan tanah, bangunan, ruko, gudang, dan aset properti untuk disewa atau investasi bersama</p>
        </div>

        {/* Search & Sort Bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Cari ruko, gudang, lokasi, luas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#0f172a", outline: "none", background: "#fff", boxSizing: "border-box" }}
            />
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            style={{
              padding: "10px 14px",
              background: activeFiltersCount > 0 ? "#2563eb" : "#fff",
              color: activeFiltersCount > 0 ? "#fff" : "#374151",
              border: `1px solid ${activeFiltersCount > 0 ? "#2563eb" : "#e2e8f0"}`,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12, color: "#374151", outline: "none", background: "#fff", maxWidth: 160 }}
          >
            <option>Terbaru</option>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
          </select>
        </div>

        {/* Count & Reset */}
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            Menampilkan <strong>{sorted.length}</strong> aset properti
            {boosted.length > 0 && <span style={{ marginLeft: 6, color: "#2563eb", fontWeight: 700 }}>({boosted.length} Boosted)</span>}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setCapexTypeFilter([]); setPropertyTypeFilter([]); setLocationFilter([]); }}
              style={{ fontSize: 11, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "2px 8px", borderRadius: 999, fontWeight: 700, cursor: "pointer" }}
            >
              Hapus Filter ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Sponsored */}
        {boosted.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #fef3c7, #fffbeb)", border: "1px solid #fcd34d", borderRadius: 999, padding: "3px 12px" }}>
                <Zap size={12} color="#d97706" />
                <span style={{ fontSize: 10, fontWeight: 800, color: "#d97706", letterSpacing: "0.04em" }}>SPONSORED PROPERTI</span>
              </div>
              <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
            </div>
            <div className="capex-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {boosted.map((c) => (
                <CapexCard key={c.id} listing={c} isSponsored isMine={user?.id === c.ownerId} onBoost={() => handleBoost(c.id, c.title)} onContact={handleContact} />
              ))}
            </div>
            <div style={{ height: 1, background: "#e2e8f0", margin: "16px 0" }} />
          </div>
        )}

        {/* Regular */}
        {paged.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", color: "#64748b" }}>
            <Building2 size={36} color="#cbd5e1" style={{ margin: "0 auto 10px" }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Tidak ada properti ditemukan</div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        )}
        <div className="capex-cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {paged.map((c) => (
            <CapexCard key={c.id} listing={c} isSponsored={false} isMine={user?.id === c.ownerId} onBoost={() => handleBoost(c.id, c.title)} onContact={handleContact} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24 }}>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ width: 36, height: 36, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} color={currentPage === 1 ? "#e2e8f0" : "#374151"} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                style={{ width: 36, height: 36, border: "none", borderRadius: 8, background: p === currentPage ? "#2563eb" : "#fff", color: p === currentPage ? "#fff" : "#374151", fontWeight: p === currentPage ? 700 : 400, cursor: "pointer", fontSize: 13, boxShadow: p === currentPage ? "none" : "0 1px 3px rgba(0,0,0,0.08)" }}>
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

      {/* MOBILE FILTER MODAL / BOTTOM SHEET */}
      {mobileFilterOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "20px 20px 32px",
              boxShadow: "0 -10px 30px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Filter Capex &amp; Properti</div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            <FilterElements />

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e2e8f0", display: "flex", gap: 10 }}>
              <button
                onClick={() => { setCapexTypeFilter([]); setPropertyTypeFilter([]); setLocationFilter([]); }}
                style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #2563eb, #0891b2)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Terapkan ({sorted.length} Hasil)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const modalElement = showAdsModal && adsTarget && (
    <AdsModal
      listingId={adsTarget.id}
      listingTitle={adsTarget.title}
      listingType="capex"
      onClose={() => { setShowAdsModal(false); setAdsTarget(null); }}
    />
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">
          {capexMainContent}
          {modalElement}
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <TopNavBar />
      <main style={{ flex: 1, padding: "24px 16px", maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {capexMainContent}
        {modalElement}
      </main>
      <Footer />
    </div>
  );
}
