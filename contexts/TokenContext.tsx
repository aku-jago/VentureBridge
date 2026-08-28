"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  TokenTransaction,
  TopUpRequest,
  WithdrawRequest,
  TokenPackage,
} from "@/types";
import {
  TOKEN_PACKAGES,
  TOKEN_UNLOCK_COST,
  TOKEN_RUPIAH_VALUE,
  mockInvestorTransactions,
  mockFounderTransactions,
  mockTopUpRequests,
  mockWithdrawRequests,
} from "@/data/mock";

// ===========================
// Context Shape
// ===========================
interface TokenContextType {
  tokenPackages: TokenPackage[];
  tokenUnlockCost: number;
  tokenRupiahValue: number;
  investorBalance: number;
  investorTransactions: TokenTransaction[];
  unlockedOpportunities: string[];
  pendingTopUps: TopUpRequest[];
  founderBalance: number;
  founderTransactions: TokenTransaction[];
  withdrawRequests: WithdrawRequest[];
  allTopUpRequests: TopUpRequest[];
  allWithdrawRequests: WithdrawRequest[];
  requestTopUp: (pkg: TokenPackage, note?: string) => void;
  unlockOpportunity: (
    opportunityId: string,
    opportunityTitle: string,
    founderId: string,
    founderName: string
  ) => { success: boolean; message: string };
  isOpportunityUnlocked: (opportunityId: string) => boolean;
  requestWithdraw: (
    tokens: number,
    bankName: string,
    accountNumber: string,
    accountName: string
  ) => { success: boolean; message: string };
  confirmTopUp: (topUpId: string) => void;
  rejectTopUp: (topUpId: string) => void;
  processWithdraw: (withdrawId: string) => void;
  rejectWithdraw: (withdrawId: string) => void;
}

const TokenContext = createContext<TokenContextType>({
  tokenPackages: TOKEN_PACKAGES,
  tokenUnlockCost: TOKEN_UNLOCK_COST,
  tokenRupiahValue: TOKEN_RUPIAH_VALUE,
  investorBalance: 0,
  investorTransactions: [],
  unlockedOpportunities: [],
  pendingTopUps: [],
  founderBalance: 0,
  founderTransactions: [],
  withdrawRequests: [],
  allTopUpRequests: [],
  allWithdrawRequests: [],
  requestTopUp: () => {},
  unlockOpportunity: () => ({ success: false, message: "" }),
  isOpportunityUnlocked: () => false,
  requestWithdraw: () => ({ success: false, message: "" }),
  confirmTopUp: () => {},
  rejectTopUp: () => {},
  processWithdraw: () => {},
  rejectWithdraw: () => {},
});

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function TokenProvider({ children }: { children: ReactNode }) {
  const { user, updateProfile, updateUserAccount, accounts } = useAuth();

  const [investorTransactions, setInvestorTransactions] = useState<TokenTransaction[]>([]);
  const [unlockedOpportunities, setUnlockedOpportunities] = useState<string[]>([]);
  const [founderTransactions, setFounderTransactions] = useState<TokenTransaction[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [allTopUpRequests, setAllTopUpRequests] = useState<TopUpRequest[]>([]);
  const [allWithdrawRequests, setAllWithdrawRequests] = useState<WithdrawRequest[]>([]);

  useEffect(() => {
    const storedInvTxns = loadFromStorage<TokenTransaction[]>("vb_investor_transactions", []);
    setInvestorTransactions(storedInvTxns.length > 0 ? storedInvTxns : mockInvestorTransactions);

    const storedFndTxns = loadFromStorage<TokenTransaction[]>("vb_founder_transactions", []);
    setFounderTransactions(storedFndTxns.length > 0 ? storedFndTxns : mockFounderTransactions);

    const storedUnlocked = loadFromStorage<string[]>("vb_unlocked_opportunities", []);
    setUnlockedOpportunities(storedUnlocked);

    const storedTopUps = loadFromStorage<TopUpRequest[]>("vb_topup_requests", []);
    setAllTopUpRequests(storedTopUps.length > 0 ? storedTopUps : mockTopUpRequests);

    const storedWithdraws = loadFromStorage<WithdrawRequest[]>("vb_withdraw_requests", []);
    const wd = storedWithdraws.length > 0 ? storedWithdraws : mockWithdrawRequests;
    setAllWithdrawRequests(wd);
    setWithdrawRequests(wd);

    // Optional: Sync from Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from("topup_requests").select("*").then(({ data, error }) => {
        if (data && !error && data.length > 0) {
          const remote: TopUpRequest[] = data.map((r: any) => ({
            id: r.id,
            userId: r.user_id,
            userName: r.user_name,
            userInitials: r.user_initials,
            packageId: r.package_id,
            packageName: r.package_name,
            amount: Number(r.amount),
            tokens: Number(r.tokens),
            status: r.status,
            paymentProofNote: r.payment_proof_note,
            requestedAt: r.requested_at,
            confirmedAt: r.confirmed_at,
          }));
          setAllTopUpRequests(remote);
          saveToStorage("vb_topup_requests", remote);
        }
      });
    }
  }, []);

  const investorBalance = user?.tokenBalance ?? 0;
  const founderBalance = (user?.tokenBalance ?? 0) + (user?.founderTokenBalance ?? 0);
  const pendingTopUps = allTopUpRequests.filter(
    (r) => r.userId === user?.id && r.status === "waiting"
  );

  const requestTopUp = useCallback(
    (pkg: TokenPackage, note?: string) => {
      if (!user) return;
      const newRequest: TopUpRequest = {
        id: `topup-${Date.now()}`,
        userId: user.id ?? "unknown",
        userName: user.name,
        userInitials: user.initials,
        packageId: pkg.id,
        packageName: pkg.name,
        amount: pkg.price,
        tokens: pkg.tokens,
        status: "waiting",
        paymentProofNote: note,
        requestedAt: new Date().toISOString(),
      };
      const updated = [newRequest, ...allTopUpRequests];
      setAllTopUpRequests(updated);
      saveToStorage("vb_topup_requests", updated);

      if (isSupabaseConfigured && supabase) {
        supabase.from("topup_requests").insert({
          id: newRequest.id,
          user_id: newRequest.userId,
          user_name: newRequest.userName,
          user_initials: newRequest.userInitials,
          package_id: newRequest.packageId,
          package_name: newRequest.packageName,
          amount: newRequest.amount,
          tokens: newRequest.tokens,
          status: "waiting",
          payment_proof_note: note || "",
          requested_at: newRequest.requestedAt,
        }).then();
      }
    },
    [user, allTopUpRequests]
  );

  const unlockOpportunity = useCallback(
    (
      opportunityId: string,
      opportunityTitle: string,
      founderId: string,
      founderName: string
    ): { success: boolean; message: string } => {
      if (!user) return { success: false, message: "Silakan login terlebih dahulu." };

      const currentBalance = user.tokenBalance ?? 120;

      if (currentBalance < TOKEN_UNLOCK_COST) {
        return {
          success: false,
          message: `Saldo token tidak cukup. Kamu butuh ${TOKEN_UNLOCK_COST} token, saldo kamu: ${currentBalance} token.`,
        };
      }

      if (unlockedOpportunities.includes(opportunityId)) {
        return { success: true, message: "Sudah di-unlock sebelumnya." };
      }

      const newBalance = currentBalance - TOKEN_UNLOCK_COST;
      updateProfile({ tokenBalance: newBalance });

      const investorTxn: TokenTransaction = {
        id: `txn-${Date.now()}`,
        userId: user.id ?? "unknown",
        type: "unlock",
        amount: -TOKEN_UNLOCK_COST,
        description: "Akses Detail Bisnis",
        relatedOpportunityId: opportunityId,
        relatedOpportunityTitle: opportunityTitle,
        relatedUserId: founderId,
        relatedUserName: founderName,
        createdAt: new Date().toISOString(),
        status: "completed",
      };
      const updatedInvTxns = [investorTxn, ...investorTransactions];
      setInvestorTransactions(updatedInvTxns);
      saveToStorage("vb_investor_transactions", updatedInvTxns);

      const founderTxn: TokenTransaction = {
        id: `ftxn-${Date.now()}`,
        userId: founderId,
        type: "receive",
        amount: TOKEN_UNLOCK_COST,
        description: "Token diterima dari akses investor",
        relatedOpportunityId: opportunityId,
        relatedOpportunityTitle: opportunityTitle,
        relatedUserId: user.id,
        relatedUserName: user.name,
        createdAt: new Date().toISOString(),
        status: "completed",
      };
      const updatedFndTxns = [founderTxn, ...founderTransactions];
      setFounderTransactions(updatedFndTxns);
      saveToStorage("vb_founder_transactions", updatedFndTxns);

      const targetFounder = accounts.find((a) => a.id === founderId);
      const currentFounderBalance = targetFounder?.founderTokenBalance ?? 20;
      updateUserAccount(founderId, { founderTokenBalance: currentFounderBalance + TOKEN_UNLOCK_COST });

      const newUnlocked = [...unlockedOpportunities, opportunityId];
      setUnlockedOpportunities(newUnlocked);
      saveToStorage("vb_unlocked_opportunities", newUnlocked);
      updateProfile({ unlockedOpportunities: newUnlocked });

      if (isSupabaseConfigured && supabase) {
        supabase.from("token_transactions").insert([
          {
            id: investorTxn.id,
            user_id: investorTxn.userId,
            type: "unlock",
            amount: investorTxn.amount,
            description: investorTxn.description,
            related_opportunity_id: opportunityId,
            related_opportunity_title: opportunityTitle,
            related_user_id: founderId,
            related_user_name: founderName,
            status: "completed",
          },
          {
            id: founderTxn.id,
            user_id: founderTxn.userId,
            type: "receive",
            amount: founderTxn.amount,
            description: founderTxn.description,
            related_opportunity_id: opportunityId,
            related_opportunity_title: opportunityTitle,
            related_user_id: user.id,
            related_user_name: user.name,
            status: "completed",
          },
        ]).then();
      }

      return {
        success: true,
        message: `Berhasil! ${TOKEN_UNLOCK_COST} token digunakan. Saldo tersisa: ${newBalance} token.`,
      };
    },
    [user, unlockedOpportunities, investorTransactions, founderTransactions, updateProfile, accounts, updateUserAccount]
  );

  const isOpportunityUnlocked = useCallback(
    (opportunityId: string): boolean => {
      return unlockedOpportunities.includes(opportunityId);
    },
    [unlockedOpportunities]
  );

  const requestWithdraw = useCallback(
    (
      tokens: number,
      bankName: string,
      accountNumber: string,
      accountName: string
    ): { success: boolean; message: string } => {
      if (!user) return { success: false, message: "Silakan login terlebih dahulu." };

      const totalAvailableBalance = (user.tokenBalance ?? 0) + (user.founderTokenBalance ?? 0);

      if (tokens <= 0) {
        return {
          success: false,
          message: "Masukkan jumlah token yang valid.",
        };
      }

      if (tokens > totalAvailableBalance) {
        return {
          success: false,
          message: `Saldo token tidak cukup. Saldo kamu: ${totalAvailableBalance} token.`,
        };
      }

      const currentFndBal = user.founderTokenBalance ?? 0;
      const currentTopUpBal = user.tokenBalance ?? 0;
      const deductFnd = Math.min(tokens, currentFndBal);
      const deductTopUp = tokens - deductFnd;

      const newFndBal = currentFndBal - deductFnd;
      const newTopUpBal = currentTopUpBal - deductTopUp;

      updateProfile({
        tokenBalance: newTopUpBal,
        founderTokenBalance: newFndBal,
      });
      if (user.id) {
        updateUserAccount(user.id, {
          tokenBalance: newTopUpBal,
          founderTokenBalance: newFndBal,
        });
      }

      const estimatedRupiah = tokens * TOKEN_RUPIAH_VALUE;

      const fndTxn: TokenTransaction = {
        id: `ftxn-${Date.now()}`,
        userId: user.id ?? "unknown",
        type: "withdraw_pending",
        amount: -tokens,
        description: `Penarikan Dana ke ${bankName} (${accountNumber})`,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      const updatedFndTxns = [fndTxn, ...founderTransactions];
      setFounderTransactions(updatedFndTxns);
      saveToStorage("vb_founder_transactions", updatedFndTxns);

      const newWithdraw: WithdrawRequest = {
        id: `wd-${Date.now()}`,
        founderId: user.id ?? "unknown",
        founderName: user.name,
        founderInitials: user.initials,
        tokens,
        estimatedRupiah,
        bankName,
        accountNumber,
        accountName,
        status: "pending",
        requestedAt: new Date().toISOString(),
      };
      const updatedWithdraws = [newWithdraw, ...allWithdrawRequests];
      setAllWithdrawRequests(updatedWithdraws);
      setWithdrawRequests(updatedWithdraws);
      saveToStorage("vb_withdraw_requests", updatedWithdraws);

      if (isSupabaseConfigured && supabase) {
        supabase.from("withdraw_requests").insert({
          id: newWithdraw.id,
          founder_id: newWithdraw.founderId,
          founder_name: newWithdraw.founderName,
          founder_initials: newWithdraw.founderInitials,
          tokens: newWithdraw.tokens,
          estimated_rupiah: newWithdraw.estimatedRupiah,
          bank_name: newWithdraw.bankName,
          account_number: newWithdraw.accountNumber,
          account_name: newWithdraw.accountName,
          status: "pending",
          requested_at: newWithdraw.requestedAt,
        }).then();
      }

      return {
        success: true,
        message: `Permintaan withdraw ${tokens} token (≈ Rp ${estimatedRupiah.toLocaleString("id-ID")}) berhasil dikirim.`,
      };
    },
    [user, founderTransactions, allWithdrawRequests, updateProfile, updateUserAccount]
  );

  const confirmTopUp = useCallback(
    (topUpId: string) => {
      const request = allTopUpRequests.find((r) => r.id === topUpId);
      if (!request || request.status !== "waiting") return;

      const confirmedTime = new Date().toISOString();
      const updated = allTopUpRequests.map((r) =>
        r.id === topUpId
          ? { ...r, status: "confirmed" as const, confirmedAt: confirmedTime }
          : r
      );
      setAllTopUpRequests(updated);
      saveToStorage("vb_topup_requests", updated);

      const topupTxn: TokenTransaction = {
        id: `txn-${Date.now()}`,
        userId: request.userId,
        type: "topup",
        amount: request.tokens,
        description: `Top Up Paket ${request.packageName} — Dikonfirmasi`,
        createdAt: confirmedTime,
        status: "completed",
      };
      const updatedInvTxns = [topupTxn, ...investorTransactions];
      setInvestorTransactions(updatedInvTxns);
      saveToStorage("vb_investor_transactions", updatedInvTxns);

      // Directly update target user account balance
      const targetUser = accounts.find((a) => a.id === request.userId);
      const prevBal = targetUser?.tokenBalance ?? (request.userId === user?.id ? (user?.tokenBalance ?? 0) : 0);
      const newBal = prevBal + request.tokens;

      updateUserAccount(request.userId, { tokenBalance: newBal });
      if (user?.id === request.userId) {
        updateProfile({ tokenBalance: newBal });
      }

      if (isSupabaseConfigured && supabase) {
        supabase.from("topup_requests").update({
          status: "confirmed",
          confirmed_at: confirmedTime,
        }).eq("id", topUpId).then();

        supabase.from("token_transactions").insert({
          id: topupTxn.id,
          user_id: request.userId,
          type: "topup",
          amount: request.tokens,
          description: topupTxn.description,
          status: "completed",
        }).then();
      }
    },
    [allTopUpRequests, investorTransactions, user, updateProfile, accounts, updateUserAccount]
  );

  const rejectTopUp = useCallback(
    (topUpId: string) => {
      const updated = allTopUpRequests.map((r) =>
        r.id === topUpId ? { ...r, status: "rejected" as const } : r
      );
      setAllTopUpRequests(updated);
      saveToStorage("vb_topup_requests", updated);

      if (isSupabaseConfigured && supabase) {
        supabase.from("topup_requests").update({ status: "rejected" }).eq("id", topUpId).then();
      }
    },
    [allTopUpRequests]
  );

  const processWithdraw = useCallback(
    (withdrawId: string) => {
      const processedTime = new Date().toISOString();
      const updated = allWithdrawRequests.map((r) =>
        r.id === withdrawId
          ? { ...r, status: "processed" as const, processedAt: processedTime }
          : r
      );
      setAllWithdrawRequests(updated);
      setWithdrawRequests(updated);
      saveToStorage("vb_withdraw_requests", updated);

      const updatedFndTxns = founderTransactions.map((t) =>
        t.type === "withdraw_pending" && t.status === "pending"
          ? { ...t, type: "withdraw" as const, status: "completed" as const }
          : t
      );
      setFounderTransactions(updatedFndTxns);
      saveToStorage("vb_founder_transactions", updatedFndTxns);

      if (isSupabaseConfigured && supabase) {
        supabase.from("withdraw_requests").update({
          status: "processed",
          processed_at: processedTime,
        }).eq("id", withdrawId).then();
      }
    },
    [allWithdrawRequests, founderTransactions]
  );

  const rejectWithdraw = useCallback(
    (withdrawId: string) => {
      const request = allWithdrawRequests.find((r) => r.id === withdrawId);
      if (!request) return;

      // Refund the tokens back to the user
      const targetUser = accounts.find((a) => a.id === request.founderId);
      const prevBal = targetUser?.tokenBalance ?? 0;
      const newBal = prevBal + request.tokens;

      updateUserAccount(request.founderId, { tokenBalance: newBal });
      if (user?.id === request.founderId) {
        updateProfile({ tokenBalance: newBal });
      }

      const updated = allWithdrawRequests.map((r) =>
        r.id === withdrawId ? { ...r, status: "rejected" as const } : r
      );
      setAllWithdrawRequests(updated);
      setWithdrawRequests(updated);
      saveToStorage("vb_withdraw_requests", updated);

      const updatedFndTxns = founderTransactions.map((t) =>
        t.type === "withdraw_pending" && t.status === "pending"
          ? { ...t, type: "withdraw" as const, status: "rejected" as const }
          : t
      );
      setFounderTransactions(updatedFndTxns);
      saveToStorage("vb_founder_transactions", updatedFndTxns);

      if (isSupabaseConfigured && supabase) {
        supabase.from("withdraw_requests").update({ status: "rejected" }).eq("id", withdrawId).then();
      }
    },
    [allWithdrawRequests, accounts, user, updateProfile, updateUserAccount, founderTransactions]
  );

  return (
    <TokenContext.Provider
      value={{
        tokenPackages: TOKEN_PACKAGES,
        tokenUnlockCost: TOKEN_UNLOCK_COST,
        tokenRupiahValue: TOKEN_RUPIAH_VALUE,
        investorBalance,
        investorTransactions,
        unlockedOpportunities,
        pendingTopUps,
        founderBalance,
        founderTransactions,
        withdrawRequests,
        allTopUpRequests,
        allWithdrawRequests,
        requestTopUp,
        unlockOpportunity,
        isOpportunityUnlocked,
        requestWithdraw,
        confirmTopUp,
        rejectTopUp,
        processWithdraw,
        rejectWithdraw,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  return useContext(TokenContext);
}
