"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ArrowLeft, Zap, MapPin, Building2, Maximize2, ChevronLeft, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AdsModal } from "@/components/venturebridge/AdsModal";
import { mockCapexListings } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { useAds } from "@/contexts/AdsContext";
import type { CapexType, PropertyType } from "@/types";
import Link from "next/link";

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} jt`;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

const CAPEX_TYPES: { value: CapexType; label: string; color: string; bg: string }[] = [
  { value: "sell", label: "Dijual", color: "#2563eb", bg: "#eff6ff" },
  { value: "rent", label: "Disewa", color: "#16a34a", bg: "#f0fdf4" },
  { value: "invest", label: "Investasi", color: "#d97706", bg: "#fffbeb" },
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "land", label: "Lahan/Tanah" },
  { value: "building", label: "Bangunan" },
  { value: "ruko", label: "Ruko" },
  { value: "warehouse", label: "Gudang" },
  { value: "office", label: "Kantor/Office" },
  { value: "mixed", label: "Mixed-Use" },
];

const LOCATIONS = ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Bali", "Medan"];

function CapexCard({
  listing,
  isSponsored,
  isMine,
  onBoost,
  onContact,
}: {
  listing: typeof mockCapexListings[0];
  isSponsored: boolean;
  isMine: boolean;
  onBoost: () => void;
  onContact: () => void;
}) {
  const capexInfo = CAPEX_TYPES.find((c) => c.value === listing.capexType);
  const suffix = listing.capexType === "rent" ? "/bulan" : "";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: isSponsored ? "2px solid #fcd34d" : "1px solid #e2e8f0",
        padding: "20px",
        position: "relative",
        transition: "all 0.15s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          {/* Status badges */}
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {listing.verificationStatus === "verified" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: 999, border: "1px solid #bbf7d0" }}>
                <CheckCircle size={10} /> Terverifikasi
              </span>
            )}
            {listing.verificationStatus === "pending" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#d97706", background: "#fffbeb", padding: "2px 8px", borderRadius: 999 }}>
                <Clock size={10} /> Review
              </span>
            )}
            {capexInfo && (
              <span style={{ fontSize: 10, fontWeight: 700, color: capexInfo.color, background: capexInfo.bg, padding: "2px 8px", borderRadius: 999 }}>
                {capexInfo.label}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1.3 }}>
            {listing.title}
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 10 }}>
            {listing.shortDescription}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
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
          <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
            {formatRupiah(listing.price)}<span style={{ fontSize: 12, fontWeight: 400, color: "#94a3b8" }}>{suffix}</span>
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

      {/* Owner */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #2563eb, #0891b2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
          {listing.owner.initials}
        </div>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{listing.owner.name}</span>
      </div>
    </div>
  );
}

export default function ExploreCapexPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { boostedListingIds } = useAds();

  const [search, setSearch] = useState("");
  const [capexTypeFilter, setCapexTypeFilter] = useState<CapexType[]>([]);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyType[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [showAdsModal, setShowAdsModal] = useState(false);
  const [adsTarget, setAdsTarget] = useState<{ id: string; title: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

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

  const capexMainContent = (
    <div style={{ display: "flex", gap: 24, width: "100%" }}>
      {/* Sidebar */}
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
        <Link href="/explore" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 12, marginBottom: 16 }}>
          <ArrowLeft size={14} /> Semua Kategori
        </Link>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
            <Filter size={14} /> Filter
          </div>
          <button onClick={() => { setCapexTypeFilter([]); setPropertyTypeFilter([]); setLocationFilter([]); }}
            style={{ fontSize: 12, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Reset</button>
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
            <label key={pt.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={propertyTypeFilter.includes(pt.value)} onChange={() => setPropertyTypeFilter(toggle(propertyTypeFilter, pt.value))}
                style={{ accentColor: "#2563eb", width: 14, height: 14 }} />
              <span style={{ fontSize: 13, color: "#374151" }}>{pt.label}</span>
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
        {isLoggedIn && (
          <div style={{ background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>🏢 Punya Properti?</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Boost listing properti ke posisi teratas!</div>
            <button
              onClick={() => { setAdsTarget({ id: "my-capex", title: "Properti Saya" }); setShowAdsModal(true); }}
              style={{ width: "100%", padding: "8px", background: "linear-gradient(135deg, #2563eb, #0891b2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
            >
              <Zap size={13} /> Boost Listing
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Capex &amp; Properti</h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>Temukan tanah, bangunan, ruko, gudang, dan aset properti di seluruh Indonesia</p>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Cari properti, lokasi, jenis..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }} />
          </div>
          <select style={{ padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", background: "#fff" }}>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
            <option>Terbaru</option>
          </select>
        </div>

        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
          Menampilkan <strong>{sorted.length}</strong> listing properti
          {boosted.length > 0 && <span style={{ marginLeft: 8, color: "#2563eb", fontWeight: 600 }}>({boosted.length} sponsored di atas)</span>}
        </div>

        {/* Sponsored */}
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
              {boosted.map((c) => (
                <CapexCard key={c.id} listing={c} isSponsored isMine={user?.id === c.ownerId} onBoost={() => handleBoost(c.id, c.title)} onContact={handleContact} />
              ))}
            </div>
            <div style={{ height: 1, background: "#e2e8f0", margin: "20px 0" }} />
          </div>
        )}

        {/* Regular */}
        {paged.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
            <Building2 size={40} color="#e2e8f0" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Tidak ada properti ditemukan</div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {paged.map((c) => (
            <CapexCard key={c.id} listing={c} isSponsored={false} isMine={user?.id === c.ownerId} onBoost={() => handleBoost(c.id, c.title)} onContact={handleContact} />
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
        <main className="dashboard-content" style={{ padding: "32px 36px" }}>
          {capexMainContent}
          {modalElement}
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <TopNavBar />
      <main style={{ flex: 1, padding: "32px 24px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        {capexMainContent}
        {modalElement}
      </main>
      <Footer />
    </div>
  );
}
