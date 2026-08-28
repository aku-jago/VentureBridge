"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Bookmark, Users } from "lucide-react";
import type { Opportunity } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { VerificationBadge } from "./VerificationBadge";
import { BusinessStageBadge } from "./BusinessStageBadge";
import { useAuth } from "@/contexts/AuthContext";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function OpportunityCard({
  opportunity,
  onSave,
  isSaved = false,
}: OpportunityCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const isVerified = opportunity.verificationStatus === "verified";

  function handleCardClick(e: React.MouseEvent) {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push(`/login?redirect=/opportunities/${opportunity.id}`);
    } else {
      router.push(`/opportunities/${opportunity.id}`);
    }
  }

  function handleSaveClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(`/login?redirect=/explore`);
      return;
    }
    onSave?.(opportunity.id);
  }

  return (
    <div
      onClick={handleCardClick}
      className="card card-hover"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Verification + Stage Row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            {isVerified && (
              <VerificationBadge
                badge={{ type: "business", label: "Terverifikasi" }}
              />
            )}
            <BusinessStageBadge stage={opportunity.stage} />
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 4,
              lineHeight: 1.3,
              textDecoration: "none",
            }}
          >
            {opportunity.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: 13,
              color: "#6b7280",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {opportunity.shortDescription}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isSaved ? "#2563eb" : "#9ca3af",
            padding: 4,
            borderRadius: 6,
            transition: "color 0.15s ease",
            flexShrink: 0,
          }}
          aria-label="Simpan peluang"
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Sector Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {opportunity.sector.map((s) => (
          <span
            key={s}
            style={{
              padding: "2px 8px",
              background: "#f3f4f6",
              color: "#374151",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              border: "1px solid #e5e7eb",
            }}
          >
            {s}
          </span>
        ))}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: "2px 8px",
            background: "#f3f4f6",
            color: "#374151",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 500,
            border: "1px solid #e5e7eb",
          }}
        >
          <MapPin size={10} />
          {opportunity.location}
        </span>
      </div>

      {/* Footer: Funding + People */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 1 }}>
            Target Modal
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
            {formatCurrency(opportunity.targetFunding)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          {/* Seeking */}
          <div style={{ display: "flex", gap: 4 }}>
            {opportunity.seekingRoles.map((role) => (
              <span
                key={role}
                style={{
                  padding: "2px 8px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  border: "1px solid #bfdbfe",
                  textTransform: "capitalize",
                }}
              >
                {role === "investor"
                  ? "Investor"
                  : role === "cofounder"
                  ? "Co-Founder"
                  : "Mentor"}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Match Score */}
      {opportunity.matchScore !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: -4,
          }}
        >
          {/* Founder avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {opportunity.founder.initials}
            </div>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {opportunity.founder.name}
            </span>
          </div>

          {/* Match */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: "3px 10px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <Users size={11} />
            {opportunity.matchScore}% Match
          </span>
        </div>
      )}
    </div>
  );
}
