"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  Users,
  FileText,
  Shield,
  LogOut,
  User,
  ChevronRight,
  Rocket,
  Megaphone,
} from "lucide-react";
import { useToken } from "@/contexts/TokenContext";
import { useAds } from "@/contexts/AdsContext";
import { useAuth } from "@/contexts/AuthContext";

interface AdminSidebarProps {
  adminName?: string;
  adminEmail?: string;
}

export function AdminSidebar({
  adminName = "Admin Weaven",
  adminEmail = "admin@weaven.id",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { allTopUpRequests, allWithdrawRequests } = useToken();
  const { allAdsRequests } = useAds();

  const currentAdminName = user?.name || adminName;

  const pendingTopUps = allTopUpRequests.filter((r) => r.status === "waiting").length;
  const pendingWithdraws = allWithdrawRequests.filter((r) => r.status === "pending").length;
  const totalPending = pendingTopUps + pendingWithdraws;
  const pendingAds = allAdsRequests.filter((r) => r.status === "waiting").length;

  const navLinks = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      href: "/admin/tokens",
      label: "Token Management",
      icon: <Coins size={18} />,
      badge: totalPending,
    },
    {
      href: "/admin/ads",
      label: "Ads Management",
      icon: <Megaphone size={18} />,
      badge: pendingAds,
    },
    {
      href: "/admin/users",
      label: "Kelola Pengguna",
      icon: <Users size={18} />,
    },
    {
      href: "/admin/opportunities",
      label: "Kelola Ide Bisnis",
      icon: <FileText size={18} />,
    },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#0f172a",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px" }}>
        <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Admin Panel</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Weaven</div>
          </div>
        </Link>

        {/* Admin identity */}
        <Link href="/admin/profile" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", padding: "10px 12px", background: "#1e293b", borderRadius: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminName}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Super Admin</div>
          </div>
          <ChevronRight size={14} color="#475569" />
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1e293b", margin: "0 16px 12px" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 10px", marginBottom: 8 }}>
          Navigasi
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 9,
              marginBottom: 2,
              fontSize: 13,
              fontWeight: isActive(link.href) ? 600 : 400,
              color: isActive(link.href) ? "#fff" : "#94a3b8",
              background: isActive(link.href)
                ? "linear-gradient(135deg, #7c3aed22, #2563eb22)"
                : "transparent",
              borderLeft: isActive(link.href) ? "2px solid #7c3aed" : "2px solid transparent",
              textDecoration: "none",
              transition: "all 0.15s ease",
              position: "relative",
            }}
          >
            <span style={{ opacity: isActive(link.href) ? 1 : 0.7 }}>{link.icon}</span>
            <span style={{ flex: 1 }}>{link.label}</span>
            {link.badge ? (
              <span
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 999,
                  minWidth: 18,
                  textAlign: "center",
                }}
              >
                {link.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px 20px" }}>
        <div style={{ height: 1, background: "#1e293b", marginBottom: 12 }} />

        <Link
          href="/admin/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 9,
            marginBottom: 2,
            fontSize: 13,
            color: isActive("/admin/profile") ? "#fff" : "#94a3b8",
            background: isActive("/admin/profile") ? "#1e293b" : "transparent",
            textDecoration: "none",
          }}
        >
          <User size={18} style={{ opacity: 0.7 }} />
          Profil Admin
        </Link>

        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 13,
            color: "#94a3b8",
            textDecoration: "none",
          }}
        >
          <Rocket size={18} style={{ opacity: 0.7 }} />
          Kembali ke App
        </Link>

        <button
          onClick={() => logout()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 13,
            color: "#f87171",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <LogOut size={18} style={{ opacity: 0.8 }} />
          Logout Admin
        </button>
      </div>
    </aside>
  );
}
