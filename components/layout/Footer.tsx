import Link from "next/link";
import { Rocket } from "lucide-react";

export function Footer() {
  const links = [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <footer
      style={{
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        padding: "40px 24px 24px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "#2563eb",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Rocket size={15} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
            VentureBridge
          </span>
        </div>

        {/* Links */}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
          © 2024 VentureBridge Indonesia. Elevating the startup ecosystem.
        </p>
      </div>
    </footer>
  );
}
