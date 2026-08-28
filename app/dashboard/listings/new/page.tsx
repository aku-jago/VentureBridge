"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Opportunity } from "@/types";
import { mockOpportunities } from "@/data/mock";

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [sector, setSector] = useState("EdTech");
  const [stage, setStage] = useState("seed");
  const [targetFunding, setTargetFunding] = useState("");
  const [location, setLocation] = useState("Yogyakarta");
  const [seeking, setSeeking] = useState<string[]>(["investor"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const newListingId = `opp-${Date.now()}`;
    const authorId = user?.id || "user-1";
    const authorName = user?.name || "Founder Weaven";
    const numTargetFunding = Number(targetFunding) || 500000000;

    const newListing: Opportunity = {
      id: newListingId,
      title: title.trim(),
      shortDescription: tagline.trim(),
      description: tagline.trim(),
      sector: [sector],
      stage: stage as any,
      targetFunding: numTargetFunding,
      location: location.trim() || "Indonesia",
      founderId: authorId,
      founder: {
        id: authorId,
        name: authorName,
        initials: user?.initials || "FN",
      },
      seekingRoles: seeking as any,
      verificationStatus: "pending",
      matchScore: 90,
      createdAt: new Date().toISOString(),
      traction: "Baru dipublikasikan",
    };

    // Save to local storage
    try {
      const stored = localStorage.getItem("vb_user_listings");
      const currentList: Opportunity[] = stored ? JSON.parse(stored) : mockOpportunities;
      const updated = [newListing, ...currentList];
      localStorage.setItem("vb_user_listings", JSON.stringify(updated));
    } catch {}

    // Save to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      supabase.from("listings").insert({
        id: newListing.id,
        user_id: authorId,
        author_name: authorName,
        title: newListing.title,
        category: sector,
        stage: stage,
        target_amount: numTargetFunding,
        location: newListing.location,
        description: tagline,
        status: "active",
        avg_match: 90,
      }).then();
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/listings");
      }, 1000);
    }, 600);
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-content" style={{ maxWidth: 800 }}>
        {/* Back Link */}
        <Link
          href="/dashboard/listings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#6b7280",
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} />
          Kembali ke Listing Saya
        </Link>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
          Buat Listing Bisnis Baru
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
          Publikasikan profil bisnis Anda untuk mulai dicocokkan dengan investor dan partner yang tepat.
        </p>

        {isSuccess ? (
          <div
            className="card"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: "#f0fdf4",
              border: "1px solid #86efac",
            }}
          >
            <CheckCircle size={48} color="#16a34a" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#166534", marginBottom: 8 }}>
              Listing Berhasil Dibuat!
            </h2>
            <p style={{ fontSize: 14, color: "#15803d" }}>
              Listing Anda kini aktif dan siap dicocokkan oleh algoritma AI. Mengalihkan...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Title */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Nama Bisnis / Startup *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: EduSmart Indonesia"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            {/* Tagline */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Tagline / Ringkasan Singkat (1 kalimat) *
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Contoh: Platform pembelajaran adaptif AI untuk siswa sekolah dasar"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            {/* Sector & Stage */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Sektor Industri *
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    background: "#fff",
                  }}
                >
                  {["EdTech", "AgriTech", "FinTech", "HealthTech", "F&B", "Logistik", "SaaS"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Tahap Bisnis *
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    background: "#fff",
                  }}
                >
                  <option value="ideation">Ideation</option>
                  <option value="pre_seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="early_stage">Early Stage</option>
                </select>
              </div>
            </div>

            {/* Target Funding & Location */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Target Modal (Rp) *
                </label>
                <input
                  type="number"
                  value={targetFunding}
                  onChange={(e) => setTargetFunding(e.target.value)}
                  placeholder="500000000"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                  Lokasi Operasional *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Yogyakarta"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Pitch Deck Upload Zone */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Unggah Pitch Deck (PDF)
              </label>
              <div
                style={{
                  border: "2px dashed #e5e7eb",
                  borderRadius: 10,
                  padding: "24px",
                  textAlign: "center",
                  background: "#f8f9fa",
                  cursor: "pointer",
                }}
              >
                <Upload size={24} color="#9ca3af" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                  Klik untuk unggah atau seret file PDF pitch deck ke sini
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                  Maksimal 25MB · Otomatis dilindungi Smart NDA
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
              <Link
                href="/dashboard/listings"
                style={{
                  padding: "10px 20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#374151",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "10px 24px",
                  background: isSubmitting ? "#93c5fd" : "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Menyimpan..." : "Publikasikan Listing"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
