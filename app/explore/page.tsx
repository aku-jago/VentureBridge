"use client";

import { useState } from "react";
import { Search, Sparkles, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { OpportunityCard } from "@/components/venturebridge/OpportunityCard";
import { mockOpportunities } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import type { BusinessStage } from "@/types";

const SECTORS = ["AgriTech", "FinTech", "HealthTech", "EdTech"];
const STAGES: { value: BusinessStage | "all"; label: string }[] = [
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

export default function ExplorePage() {
  const { user, isLoggedIn } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["FinTech"]);
  const [selectedStages, setSelectedStages] = useState<string[]>(["Seed"]);
  const [selectedSeeking, setSelectedSeeking] = useState<string[]>(["Investor"]);
  const [sortBy, setSortBy] = useState("Direkomendasikan AI");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  function toggleSector(sector: string) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  }

  function toggleStage(stage: string) {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  }

  function toggleSeeking(seeking: string) {
    setSelectedSeeking((prev) =>
      prev.includes(seeking)
        ? prev.filter((s) => s !== seeking)
        : [...prev, seeking]
    );
  }

  function toggleSave(id: string) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const filtered = mockOpportunities.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        o.sector.some((s) => s.toLowerCase().includes(q)) ||
        o.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const mainExploreContent = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 28,
        alignItems: "start",
      }}
    >
      {/* ============================
          LEFT: FILTER SIDEBAR
          ============================ */}
      <aside>
        {/* Filter Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            <Filter size={16} />
            Filter
          </span>
          <button
            style={{
              fontSize: 12,
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => {
              setSelectedSectors([]);
              setSelectedStages([]);
              setSelectedSeeking([]);
            }}
          >
            Reset
          </button>
        </div>

        {/* Sektor */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}
          >
            SEKTOR
          </div>
          {SECTORS.map((sector) => (
            <label
              key={sector}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                cursor: "pointer",
                fontSize: 13,
                color: selectedSectors.includes(sector) ? "#2563eb" : "#374151",
                fontWeight: selectedSectors.includes(sector) ? 600 : 400,
              }}
            >
              <input
                type="checkbox"
                checked={selectedSectors.includes(sector)}
                onChange={() => toggleSector(sector)}
                style={{ accentColor: "#2563eb", width: 14, height: 14 }}
              />
              {sector}
            </label>
          ))}
        </div>

        {/* Lokasi */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}
          >
            LOKASI
          </div>
          <select
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 13,
              color: "#374151",
              background: "#fff",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option>Semua Lokasi</option>
            <option>Yogyakarta</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
          </select>
        </div>

        {/* Tahap Bisnis */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}
          >
            TAHAP BISNIS
          </div>
          {STAGES.map((stage) => (
            <label
              key={stage.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                cursor: "pointer",
                fontSize: 13,
                color: selectedStages.includes(stage.label)
                  ? "#2563eb"
                  : "#374151",
                fontWeight: selectedStages.includes(stage.label) ? 600 : 400,
              }}
            >
              <input
                type="checkbox"
                checked={selectedStages.includes(stage.label)}
                onChange={() => toggleStage(stage.label)}
                style={{ accentColor: "#2563eb", width: 14, height: 14 }}
              />
              {stage.label}
            </label>
          ))}
        </div>

        {/* Target Modal */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}
          >
            TARGET MODAL
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Min"
              style={{
                flex: 1,
                padding: "7px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                color: "#374151",
                outline: "none",
              }}
            />
            <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>
            <input
              type="text"
              placeholder="Max"
              style={{
                flex: 1,
                padding: "7px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                color: "#374151",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Mencari */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}
          >
            MENCARI
          </div>
          {SEEKING.map((s) => (
            <label
              key={s.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                cursor: "pointer",
                fontSize: 13,
                color: selectedSeeking.includes(s.label) ? "#2563eb" : "#374151",
                fontWeight: selectedSeeking.includes(s.label) ? 600 : 400,
              }}
            >
              <input
                type="checkbox"
                checked={selectedSeeking.includes(s.label)}
                onChange={() => toggleSeeking(s.label)}
                style={{ accentColor: "#2563eb", width: 14, height: 14 }}
              />
              {s.label}
            </label>
          ))}
        </div>
      </aside>

      {/* ============================
          RIGHT: RESULTS
          ============================ */}
      <div>
        {/* Page Title */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 4,
          }}
        >
          Temukan Peluang Bisnis
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          Eksplorasi ribuan ide brilian dan startup tahap awal dari seluruh
          Indonesia. Temukan partner atau investasi yang tepat untuk visi Anda.
        </p>

        {/* Search + AI Button */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Search size={17} color="#9ca3af" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ide, sektor, kota, atau kebutuhan modal..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "#111827",
                background: "transparent",
              }}
            />
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={16} />
            Cari dengan AI
          </button>
        </div>

        {/* Results Count + Sort */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            Menampilkan{" "}
            <strong style={{ color: "#111827" }}>{filtered.length * 41}</strong>{" "}
            peluang bisnis
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "6px 32px 6px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                color: "#374151",
                background: "#fff",
                cursor: "pointer",
                outline: "none",
                appearance: "auto",
              }}
            >
              <option>Direkomendasikan AI</option>
              <option>Terbaru</option>
              <option>Target Modal Tertinggi</option>
              <option>Match Terbaik</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSave={toggleSave}
              isSaved={savedIds.includes(opp.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={16} color="#6b7280" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${currentPage === page ? "#2563eb" : "#e5e7eb"}`,
                borderRadius: 8,
                background: currentPage === page ? "#2563eb" : "#fff",
                color: currentPage === page ? "#fff" : "#374151",
                fontSize: 13,
                fontWeight: currentPage === page ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={16} color="#6b7280" />
          </button>
        </div>
      </div>
    </div>
  );

  // If user is logged in, show explore inside the authenticated Dashboard layout
  if (isLoggedIn) {
    return (
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-content">{mainExploreContent}</main>
      </div>
    );
  }

  // If user is not logged in (guest visitor), show public navbar and footer
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fa",
      }}
    >
      <TopNavBar />
      <div
        style={{
          flex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "32px 24px",
        }}
      >
        {mainExploreContent}
      </div>
      <Footer />
    </div>
  );
}
