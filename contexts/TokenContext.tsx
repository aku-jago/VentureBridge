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
  const { user, updateProfile } = useAuth();

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
  }, []);

  const investorBalance = user?.tokenBalance ?? 120;
  const founderBalance = user?.founderTokenBalance ?? 20;
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
      const updated = [...allTopUpRequests, newRequest];
      setAllTopUpRequests(updated);
      saveToStorage("vb_topup_requests", updated);
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

      const founderBalanceKey = `vb_founder_balance_${founderId}`;
      const currentFounderBalance = loadFromStorage<number>(founderBalanceKey, 20);
      saveToStorage(founderBalanceKey, currentFounderBalance + TOKEN_UNLOCK_COST);

      const newUnlocked = [...unlockedOpportunities, opportunityId];
      setUnlockedOpportunities(newUnlocked);
      saveToStorage("vb_unlocked_opportunities", newUnlocked);
      updateProfile({ unlockedOpportunities: newUnlocked });

      return {
        success: true,
        message: `Berhasil! ${TOKEN_UNLOCK_COST} token digunakan. Saldo tersisa: ${newBalance} token.`,
      };
    },
    [user, unlockedOpportunities, investorTransactions, founderTransactions, updateProfile]
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

      const currentFounderBalance = user.founderTokenBalance ?? founderBalance;

      if (tokens <= 0) return { success: false, message: "Jumlah token tidak valid." };
      if (tokens > currentFounderBalance) {
        return {
          success: false,
          message: `Saldo token tidak cukup. Saldo kamu: ${currentFounderBalance} token.`,
        };
      }

      const estimatedRupiah = tokens * TOKEN_RUPIAH_VALUE;
      updateProfile({ founderTokenBalance: currentFounderBalance - tokens });

      const withdrawTxn: TokenTransaction = {
        id: `ftxn-${Date.now()}`,
        userId: user.id ?? "unknown",
        type: "withdraw_pending",
        amount: -tokens,
        description: `Permintaan withdraw ${tokens} token`,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      const updatedFndTxns = [withdrawTxn, ...founderTransactions];
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

      return {
        success: true,
        message: `Permintaan withdraw ${tokens} token (≈ Rp ${estimatedRupiah.toLocaleString("id-ID")}) berhasil dikirim.`,
      };
    },
    [user, founderBalance, founderTransactions, allWithdrawRequests, updateProfile]
  );

  const confirmTopUp = useCallback(
    (topUpId: string) => {
      const request = allTopUpRequests.find((r) => r.id === topUpId);
      if (!request || request.status !== "waiting") return;

      const updated = allTopUpRequests.map((r) =>
        r.id === topUpId
          ? { ...r, status: "confirmed" as const, confirmedAt: new Date().toISOString() }
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
        createdAt: new Date().toISOString(),
        status: "completed",
      };
      const updatedInvTxns = [topupTxn, ...investorTransactions];
      setInvestorTransactions(updatedInvTxns);
      saveToStorage("vb_investor_transactions", updatedInvTxns);

      if (user?.id === request.userId) {
        const currentBalance = user.tokenBalance ?? 0;
        updateProfile({ tokenBalance: currentBalance + request.tokens });
      } else {
        const balanceKey = `vb_investor_balance_${request.userId}`;
        const currentBalance = loadFromStorage<number>(balanceKey, 0);
        saveToStorage(balanceKey, currentBalance + request.tokens);
      }
    },
    [allTopUpRequests, investorTransactions, user, updateProfile]
  );

  const rejectTopUp = useCallback(
    (topUpId: string) => {
      const updated = allTopUpRequests.map((r) =>
        r.id === topUpId ? { ...r, status: "rejected" as const } : r
      );
      setAllTopUpRequests(updated);
      saveToStorage("vb_topup_requests", updated);
    },
    [allTopUpRequests]
  );

  const processWithdraw = useCallback(
    (withdrawId: string) => {
      const updated = allWithdrawRequests.map((r) =>
        r.id === withdrawId
          ? { ...r, status: "processed" as const, processedAt: new Date().toISOString() }
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
    },
    [allWithdrawRequests, founderTransactions]
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
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  return useContext(TokenContext);
}
