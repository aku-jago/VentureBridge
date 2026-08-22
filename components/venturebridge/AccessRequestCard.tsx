"use client";

import { useState } from "react";
import type { AccessRequest } from "@/types";
import { VerificationBadge } from "./VerificationBadge";
import { MessageSquare } from "lucide-react";

interface AccessRequestCardProps {
  request: AccessRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewConversation?: (id: string) => void;
}

export function AccessRequestCard({
  request,
  onApprove,
  onReject,
  onViewConversation,
}: AccessRequestCardProps) {
  const [status, setStatus] = useState(request.status);

  function handleApprove() {
    setStatus("approved");
    onApprove?.(request.id);
  }

  function handleReject() {
    setStatus("rejected");
    onReject?.(request.id);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {request.requester.initials}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            {request.requester.name}
          </span>
          {request.requester.verificationBadges.map((badge, i) => (
            <VerificationBadge key={i} badge={badge} />
          ))}
        </div>

        {/* Time */}
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
          {request.requestedAt}
        </div>

        {/* Message */}
        <p
          style={{
            fontSize: 13,
            color: "#6b7280",
            fontStyle: "italic",
            lineHeight: 1.5,
            marginBottom: 0,
          }}
        >
          "{request.message}"
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
        {status === "pending" && (
          <>
            <button
              onClick={handleApprove}
              style={{
                padding: "6px 14px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              Terima
            </button>
            <button
              onClick={handleReject}
              style={{
                padding: "6px 12px",
                background: "#fff",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              Tolak
            </button>
          </>
        )}
        {status === "approved" && (
          <button
            onClick={() => onViewConversation?.(request.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#f0fdf4",
              color: "#16a34a",
              border: "1px solid #86efac",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <MessageSquare size={13} />
            Lihat Percakapan
          </button>
        )}
        {status === "rejected" && (
          <span
            style={{
              padding: "4px 10px",
              background: "#fef2f2",
              color: "#dc2626",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: "1px solid #fca5a5",
            }}
          >
            Ditolak
          </span>
        )}
      </div>
    </div>
  );
}
