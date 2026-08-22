"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TopNavBarProps {
  variant?: "public" | "dashboard";
}

export function TopNavBar({ variant = "public" }: TopNavBarProps) {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  const dashboardHref = user?.role === "investor" ? "/investor/dashboard" : "/dashboard";

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/explore", label: "Explore" },
    { href: "/feed", label: "Feed" },
    { href: "/how-it-works", label: "Cara Kerja" },
    { href: "/ai-assistant", label: "AI Assistant" },
  ];

  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 0 #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "#2563eb",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Rocket size={18} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            VentureBridge
          </span>
        </Link>

        {/* Nav Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
            justifyContent: "center",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => {
            const isCurrentActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isCurrentActive ? 700 : 500,
                  color: isCurrentActive ? "#2563eb" : "#4b5563",
                  textDecoration: "none",
                  transition: "color 0.15s ease, background 0.15s ease",
                  background: isCurrentActive ? "#eff6ff" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions / Auth state */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isLoggedIn && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* User Profile Badge */}
              <Link
                href={dashboardHref}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  padding: "4px 10px 4px 6px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: user.role === "investor" ? "#16a34a" : "#2563eb",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user.initials}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                    {user.name.split(" ")[0]}
                  </span>
                  <span style={{ fontSize: 10, color: "#6b7280", textTransform: "capitalize", lineHeight: 1 }}>
                    {user.role}
                  </span>
                </div>
              </Link>

              {/* Dashboard Button */}
              <Link
                href={dashboardHref}
                id="topbar-dashboard-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 8,
                  background: "#2563eb",
                  boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
                  transition: "background 0.15s ease",
                }}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              {/* Logout Button */}
              <button
                id="topbar-logout-btn"
                onClick={() => logout()}
                title="Keluar dari akun"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  fontSize: 13,
                  color: "#6b7280",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.borderColor = "#fca5a5";
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                id="topbar-login-btn"
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  transition: "background 0.15s ease",
                }}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                id="topbar-register-btn"
                style={{
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 8,
                  background: "#2563eb",
                  border: "1px solid transparent",
                  boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
                  transition: "background 0.15s ease",
                }}
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
