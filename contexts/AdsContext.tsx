"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AdsRequest } from "@/types";
import { mockAdsRequests } from "@/data/mock";

interface AdsContextValue {
  allAdsRequests: AdsRequest[];
  // Cek apakah sebuah listing sedang aktif iklannya
  isListingBoosted: (listingId: string) => boolean;
  // Founder / capex owner submit ads request
  submitAdsRequest: (req: Omit<AdsRequest, "id" | "requestedAt" | "status">) => void;
  // Admin actions
  activateAds: (reqId: string) => void;
  rejectAds: (reqId: string) => void;
  // Daftar listing yang sedang di-boost (untuk sorting di explore page)
  boostedListingIds: string[];
}

const AdsContext = createContext<AdsContextValue | null>(null);

export function AdsProvider({ children }: { children: ReactNode }) {
  const [allAdsRequests, setAllAdsRequests] = useState<AdsRequest[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vb_ads_requests");
      if (saved) {
        setAllAdsRequests(JSON.parse(saved));
      } else {
        setAllAdsRequests(mockAdsRequests);
      }
    } catch {
      setAllAdsRequests(mockAdsRequests);
    }
  }, []);

  function persist(data: AdsRequest[]) {
    setAllAdsRequests(data);
    try { localStorage.setItem("vb_ads_requests", JSON.stringify(data)); } catch {}
  }

  function isListingBoosted(listingId: string) {
    return allAdsRequests.some(
      (r) => r.listingId === listingId && r.status === "active"
    );
  }

  const boostedListingIds = allAdsRequests
    .filter((r) => r.status === "active")
    .map((r) => r.listingId);

  function submitAdsRequest(req: Omit<AdsRequest, "id" | "requestedAt" | "status">) {
    const newReq: AdsRequest = {
      ...req,
      id: `ads-req-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: "waiting",
    };
    persist([...allAdsRequests, newReq]);
  }

  function activateAds(reqId: string) {
    const now = new Date();
    persist(
      allAdsRequests.map((r) => {
        if (r.id !== reqId) return r;
        const exp = new Date(now);
        exp.setDate(exp.getDate() + r.durationDays);
        return {
          ...r,
          status: "active" as const,
          activatedAt: now.toISOString(),
          expiresAt: exp.toISOString(),
        };
      })
    );
  }

  function rejectAds(reqId: string) {
    persist(allAdsRequests.map((r) => r.id === reqId ? { ...r, status: "rejected" as const } : r));
  }

  return (
    <AdsContext.Provider value={{ allAdsRequests, isListingBoosted, submitAdsRequest, activateAds, rejectAds, boostedListingIds }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  const ctx = useContext(AdsContext);
  if (!ctx) throw new Error("useAds must be used inside AdsProvider");
  return ctx;
}
