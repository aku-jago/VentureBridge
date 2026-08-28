"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { InboundOffer } from "@/types";
import { useAuth } from "./AuthContext";

export const INITIAL_OFFERS: InboundOffer[] = [
  {
    id: "off-1",
    senderId: "user-1",
    senderName: "Dzakki Naufal",
    senderInitials: "DN",
    senderRole: "founder",
    senderAvatarColor: "#2563eb",
    targetUserId: "user-3", // Andi Wijaya (Investor)
    targetUserName: "Andi Wijaya",
    relatedPostId: "p1",
    relatedPostSnippet: "Kami sedang mencari ruko atau lahan komersial disekitar Jogja...",
    offerType: "capex",
    title: "Tawaran Ruko Strategis Jl. Kaliurang Km 5.5",
    message: "Halo Pak Andi, rekan kami memiliki ruko 2 lantai siap pakai di Jl. Kaliurang km 5.5 (dekat UGM), luas 150m2 dengan sewa 140jt/tahun, sangat cocok untuk F&B cloud kitchen jaringan Anda. Siap survei lokasi minggu ini.",
    contactEmail: "founder@weaven.id",
    contactPhone: "081234567890",
    status: "pending",
    createdAt: "30 menit yang lalu",
  },
  {
    id: "off-2",
    senderId: "user-2",
    senderName: "Siti Rahmawati",
    senderInitials: "SR",
    senderRole: "founder",
    senderAvatarColor: "#d97706",
    targetUserId: "user-3",
    targetUserName: "Andi Wijaya",
    relatedPostId: "p1",
    relatedPostSnippet: "Investment Thesis Update: Mencari startup di sektor AgriTech...",
    offerType: "idea",
    title: "Pitching Deck PANENLOKAL (AgriTech Supply Chain)",
    message: "Selamat siang Pak Andi, melihat thesis investasi bapak di bidang AgriTech, kami ingin mengajukan proposal putaran Seed untuk PANENLOKAL. Kami sudah menghubungkan 200+ petani dengan 50 restoran di Bandung-Jakarta.",
    contactEmail: "siti@panenlokal.id",
    status: "accepted",
    createdAt: "Kemarin",
  },
];

interface OfferContextValue {
  allOffers: InboundOffer[];
  myInboundOffers: InboundOffer[];
  mySentOffers: InboundOffer[];
  pendingOffersCount: number;
  sendOffer: (offer: Omit<InboundOffer, "id" | "createdAt" | "status">) => void;
  acceptOffer: (offerId: string) => void;
  declineOffer: (offerId: string) => void;
}

const OfferContext = createContext<OfferContextValue | null>(null);

export function OfferProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allOffers, setAllOffers] = useState<InboundOffer[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vb_inbound_offers");
      if (saved) {
        setAllOffers(JSON.parse(saved));
      } else {
        setAllOffers(INITIAL_OFFERS);
        localStorage.setItem("vb_inbound_offers", JSON.stringify(INITIAL_OFFERS));
      }
    } catch {
      setAllOffers(INITIAL_OFFERS);
    }
  }, []);

  function persist(data: InboundOffer[]) {
    setAllOffers(data);
    try {
      localStorage.setItem("vb_inbound_offers", JSON.stringify(data));
    } catch {}
  }

  function sendOffer(offerData: Omit<InboundOffer, "id" | "createdAt" | "status">) {
    const newOffer: InboundOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      createdAt: "Baru saja",
      status: "pending",
    };
    persist([newOffer, ...allOffers]);
  }

  function acceptOffer(offerId: string) {
    persist(
      allOffers.map((o) => (o.id === offerId ? { ...o, status: "accepted" as const } : o))
    );
  }

  function declineOffer(offerId: string) {
    persist(
      allOffers.map((o) => (o.id === offerId ? { ...o, status: "declined" as const } : o))
    );
  }

  // Filter offers received by the current logged in user (or default to target user matching)
  const currentUserId = user?.id || "user-3";
  const currentUserName = user?.name?.toLowerCase() || "";

  const myInboundOffers = allOffers.filter(
    (o) =>
      o.targetUserId === currentUserId ||
      (user?.role === "investor" && o.targetUserName.toLowerCase().includes("andi")) ||
      o.targetUserName.toLowerCase() === currentUserName
  );

  const mySentOffers = allOffers.filter(
    (o) => o.senderId === currentUserId || o.senderName.toLowerCase() === currentUserName
  );

  const pendingOffersCount = myInboundOffers.filter((o) => o.status === "pending").length;

  return (
    <OfferContext.Provider
      value={{
        allOffers,
        myInboundOffers,
        mySentOffers,
        pendingOffersCount,
        sendOffer,
        acceptOffer,
        declineOffer,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
}

export function useOffer() {
  const ctx = useContext(OfferContext);
  if (!ctx) throw new Error("useOffer must be used inside OfferProvider");
  return ctx;
}
