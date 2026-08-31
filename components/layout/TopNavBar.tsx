"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, LayoutDashboard, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TopNavBarProps {
  variant?: "public" | "dashboard";
}

export function TopNavBar({ variant = "public" }: TopNavBarProps) {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = user?.role === "investor" ? "/investor/dashboard" : "/dashboard";

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/explore", label: "Explore" },
    { href: "/feed", label: "Feed" },
    { href: "/how-it-works", label: "Cara Kerja" },
    { href: "/ai-assistant", label: "AI Assistant" },
  ];

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
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
            padding: "0 16px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
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
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Weaven Logo"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
              }}
            />
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              Weaven
            </span>
          </Link>

          {/* Nav Links — Desktop only */}
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions — Desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden-mobile">
            {isLoggedIn && user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                      background: user.avatarColor || (user.role === "investor" ? "#16a34a" : "#2563eb"),
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      user.initials
                    )}
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
                    whiteSpace: "nowrap",
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
                    whiteSpace: "nowrap",
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
                    whiteSpace: "nowrap",
                  }}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="show-mobile" style={{ display: "none", alignItems: "center", gap: 8 }}>
            {isLoggedIn && user ? (
              <Link
                href={dashboardHref}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: user.avatarColor || (user.role === "investor" ? "#16a34a" : "#2563eb"),
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user.initials
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                style={{
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Masuk
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label="Buka menu"
            >
              <Menu size={20} color="#374151" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 200,
              backdropFilter: "blur(2px)",
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "min(300px, 85vw)",
              height: "100vh",
              background: "#fff",
              zIndex: 201,
              overflowY: "auto",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
              animation: "slideInRight 0.25s ease-out",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src="/logo.png" alt="Weaven Logo" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Weaven</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: 4 }}
              >
                <X size={22} />
              </button>
            </div>

            {/* User info */}
            {isLoggedIn && user && (
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <Link
                  href={dashboardHref}
                  style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: user.avatarColor || (user.role === "investor" ? "#16a34a" : "#2563eb"),
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      user.initials
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{user.name.split(" ")[0]}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", textTransform: "capitalize" }}>{user.role}</div>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" style={{ marginLeft: "auto" }} />
                </Link>
              </div>
            )}

            {/* Nav links */}
            <nav style={{ flex: 1, padding: "12px 12px" }}>
              {navLinks.map((link) => {
                const isCurrentActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 14px",
                      borderRadius: 8,
                      marginBottom: 2,
                      fontSize: 15,
                      fontWeight: isCurrentActive ? 700 : 500,
                      color: isCurrentActive ? "#2563eb" : "#374151",
                      background: isCurrentActive ? "#eff6ff" : "transparent",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div style={{ padding: "12px 20px 24px", borderTop: "1px solid #f3f4f6" }}>
              {isLoggedIn ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link
                    href={dashboardHref}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "11px",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    <LayoutDashboard size={16} />
                    Buka Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "11px",
                      background: "#fef2f2",
                      color: "#dc2626",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      border: "1px solid #fca5a5",
                      cursor: "pointer",
                    }}
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link
                    href="/register"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "11px",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    Daftar Sekarang
                  </Link>
                  <Link
                    href="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "11px",
                      background: "#fff",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    Masuk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
