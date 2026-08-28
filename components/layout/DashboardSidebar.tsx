"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  Handshake,
  MessageSquare,
  Compass,
  Rss,
  Bot,
  User,
  HelpCircle,
  LogOut,
  Rocket,
  Plus,
  PenSquare,
  Coins,
  Inbox,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToken } from "@/contexts/TokenContext";
import { useOffer } from "@/contexts/OfferContext";
import { useChat } from "@/contexts/ChatContext";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardSidebarProps {
  userRole?: "founder" | "investor";
  userName?: string;
  userTitle?: string;
  userInitials?: string;
}

export function DashboardSidebar({
  userRole: propRole,
  userName: propName,
  userTitle: propTitle,
  userInitials: propInitials,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { investorBalance, founderBalance } = useToken();
  const { pendingOffersCount } = useOffer();
  const { totalUnreadCount } = useChat();

  const [pendingAccessCount, setPendingAccessCount] = useState(0);

  useEffect(() => {
    function calculatePending() {
      try {
        const stored = localStorage.getItem("vb_access_requests");
        if (stored) {
          const reqs = JSON.parse(stored);
          const pending = reqs.filter((r: any) => r.status === "pending").length;
          setPendingAccessCount(pending);
        } else {
          if (user?.id === "user-1" || !user?.id) {
            setPendingAccessCount(2);
          } else {
            setPendingAccessCount(0);
          }
        }
      } catch {
        setPendingAccessCount(0);
      }
    }

    calculatePending();
    window.addEventListener("storage", calculatePending);
    return () => window.removeEventListener("storage", calculatePending);
  }, [user]);

  const role = propRole || user?.role || "founder";
  const name = user?.name || propName || "Idea Founder";
  const title = user?.title || propTitle || (role === "investor" ? "Investor / Modal" : "Idea Founder");
  const initials =
    user?.initials ||
    propInitials ||
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() ||
    "IF";

  const isInvestor = role === "investor";

  // Investor-specific navigation
  const investorLinks: SidebarLink[] = [
    { href: "/investor/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/investor/offers", label: "Tawaran Masuk", icon: <Inbox size={18} />, badge: pendingOffersCount },
    { href: "/explore", label: "Explore Peluang", icon: <Compass size={18} /> },
    { href: "/dashboard/matches", label: "Matches AI", icon: <Handshake size={18} /> },
    { href: "/feed", label: "Feed Komunitas", icon: <Rss size={18} /> },
    { href: "/dashboard/messages", label: "Messages", icon: <MessageSquare size={18} />, badge: totalUnreadCount },
    { href: "/dashboard/ai-copilot", label: "AI Copilot", icon: <Bot size={18} /> },
    {
      href: "/investor/tokens",
      label: `Token Wallet (${investorBalance})`,
      icon: <Coins size={18} />,
    },
  ];

  // Founder & Capex navigation
  const founderLinks: SidebarLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/listings", label: "My Listings", icon: <ListChecks size={18} /> },
    { href: "/dashboard/access-requests", label: "Access Requests", icon: <FileText size={18} />, badge: pendingAccessCount > 0 ? pendingAccessCount : undefined },
    { href: "/explore", label: "Explore", icon: <Compass size={18} /> },
    { href: "/dashboard/matches", label: "Matches AI", icon: <Handshake size={18} /> },
    { href: "/feed", label: "Feed Komunitas", icon: <Rss size={18} /> },
    { href: "/dashboard/messages", label: "Messages", icon: <MessageSquare size={18} />, badge: totalUnreadCount },
    { href: "/dashboard/ai-copilot", label: "AI Copilot", icon: <Bot size={18} /> },
    { href: "/dashboard/verification", label: "Verifikasi Bisnis", icon: <FileText size={18} /> },
    {
      href: "/founder/tokens",
      label: `Token Wallet (${founderBalance})`,
      icon: <Coins size={18} />,
    },
  ];

  const links = isInvestor ? investorLinks : founderLinks;
  const ctaHref = isInvestor ? "/explore" : "/dashboard/listings/new";
  const ctaLabel = isInvestor ? "🔍 Eksplorasi Peluang" : "Buat Listing Baru";

  const bottomLinks: SidebarLink[] = [
    { href: "/help", label: "Help Center", icon: <HelpCircle size={18} /> },
  ];

  const profileLink = { href: `/profile/${user?.id || "me"}`, label: "Profil Saya", icon: <User size={18} /> };
  const editProfileLink = { href: "/profile/edit", label: "Edit Profil", icon: <PenSquare size={18} /> };

  function isActive(href: string): boolean {
    if (href === "/dashboard" || href === "/investor/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href) && href !== "/";
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#111827",
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
      {/* Logo + User */}
      <div style={{ padding: "20px 16px 16px" }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
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
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
            Weaven
          </span>
        </Link>

        {/* User Info — clickable to own profile */}
        <Link
          href={`/profile/${user?.id || "me"}`}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: user?.avatarColor || (role === "investor" ? "#16a34a" : "#2563eb"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initials
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{title}</div>
          </div>
        </Link>
      </div>

      {/* CTA Button */}
      <div style={{ padding: "0 12px 16px" }}>
        <Link
          href={ctaHref}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 12px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.15s",
            width: "100%",
          }}
        >
          <Plus size={15} />
          {ctaLabel}
        </Link>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: "0 8px" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 8,
              marginBottom: 2,
              fontSize: 13,
              fontWeight: isActive(link.href) ? 600 : 400,
              color: isActive(link.href) ? "#fff" : "#d1d5db",
              background: isActive(link.href) ? "#2563eb" : "transparent",
              textDecoration: "none",
              transition: "background 0.15s ease, color 0.15s ease",
              position: "relative",
            }}
          >
            <span style={{ opacity: isActive(link.href) ? 1 : 0.8 }}>
              {link.icon}
            </span>
            <span style={{ flex: 1 }}>{link.label}</span>
            {link.badge && (
              <span
                style={{
                  background: isActive(link.href) ? "rgba(255,255,255,0.2)" : "#374151",
                  color: isActive(link.href) ? "#fff" : "#9ca3af",
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
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Links */}
      <div style={{ padding: "8px" }}>
        <div
          style={{
            borderTop: "1px solid #374151",
            marginBottom: 8,
            paddingTop: 8,
          }}
        />

        {/* Profile & Settings — for ALL users */}
        {[profileLink, editProfileLink].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              marginBottom: 2,
              fontSize: 13,
              color: isActive(link.href) ? "#fff" : "#d1d5db",
              background: isActive(link.href) ? "#1f2937" : "transparent",
              textDecoration: "none",
            }}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

        {bottomLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              marginBottom: 2,
              fontSize: 13,
              color: "#d1d5db",
              textDecoration: "none",
            }}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

        <button
          id="sidebar-logout-btn"
          onClick={() => logout()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 13,
            color: "#f87171",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#374151";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#f87171";
          }}
        >
          <LogOut size={18} />
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}
