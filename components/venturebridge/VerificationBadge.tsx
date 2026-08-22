import { CheckCircle, GraduationCap, Building2, Award, Users } from "lucide-react";
import type { VerificationBadge as VBadgeType } from "@/types";

interface VerificationBadgeProps {
  badge: VBadgeType;
  size?: "sm" | "md";
}

export function VerificationBadge({ badge, size = "sm" }: VerificationBadgeProps) {
  const config: Record<
    VBadgeType["type"],
    { icon: React.ReactNode; style: React.CSSProperties }
  > = {
    identity: {
      icon: <CheckCircle size={size === "sm" ? 11 : 13} />,
      style: { background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" },
    },
    business: {
      icon: <Building2 size={size === "sm" ? 11 : 13} />,
      style: { background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" },
    },
    campus: {
      icon: <GraduationCap size={size === "sm" ? 11 : 13} />,
      style: { background: "#faf5ff", color: "#7c3aed", border: "1px solid #c4b5fd" },
    },
    investor: {
      icon: <Award size={size === "sm" ? 11 : 13} />,
      style: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
    },
    lead_syndicate: {
      icon: <Users size={size === "sm" ? 11 : 13} />,
      style: { background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" },
    },
  };

  const { icon, style } = config[badge.type] ?? config.identity;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: size === "sm" ? "2px 7px" : "3px 9px",
        borderRadius: 4,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon}
      {badge.label}
    </span>
  );
}
