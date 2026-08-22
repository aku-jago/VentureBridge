interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: string;
  trendColor?: string;
  children?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  subLabel,
  icon,
  iconBg = "#eff6ff",
  trend,
  trendColor = "#16a34a",
  children,
}: StatCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      {/* Header: Icon + Label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <span
          style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {trend && (
          <span style={{ fontSize: 13, color: trendColor, fontWeight: 600 }}>
            {trend}
          </span>
        )}
      </div>

      {subLabel && (
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{subLabel}</span>
      )}

      {children}
    </div>
  );
}
