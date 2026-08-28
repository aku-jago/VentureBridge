"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type ActiveRole = "founder" | "investor" | "cofounder" | "capex_provider" | "admin";

export interface AuthUser {
  id?: string;
  name: string;
  initials: string;
  title: string;
  role: ActiveRole;
  roles?: ActiveRole[];
  email?: string;
  password?: string;
  location?: string;
  bio?: string;
  company?: string;
  headline?: string;
  avatarColor?: string;
  investorTicketRange?: string;
  investorSectors?: string[];
  investorStages?: string[];
  isVerified?: boolean;
  profileCompletion?: number;
  tokenBalance?: number;
  founderTokenBalance?: number;
  unlockedOpportunities?: string[];
  authProvider?: "email" | "google";
}

export const INITIAL_DATABASE_ACCOUNTS: AuthUser[] = [
  {
    id: "admin-1",
    name: "Admin Weaven",
    initials: "AW",
    title: "Super Administrator",
    role: "admin",
    roles: ["admin"],
    email: "admin@weaven.id",
    password: "admin123",
    location: "Jakarta, Indonesia",
    avatarColor: "#7c3aed",
    isVerified: true,
    profileCompletion: 100,
  },
  {
    id: "user-1",
    name: "Dzakki Naufal",
    initials: "DN",
    title: "Founder EDUKITA",
    role: "founder",
    roles: ["founder", "cofounder"],
    email: "founder@weaven.id",
    password: "founder123",
    company: "EDUKITA",
    location: "Yogyakarta, Indonesia",
    bio: "Passionate educator and technologist building adaptive AI learning for students.",
    avatarColor: "#2563eb",
    isVerified: true,
    profileCompletion: 85,
    founderTokenBalance: 40,
  },
  {
    id: "user-3",
    name: "Andi Wijaya",
    initials: "AW",
    title: "Angel Investor & Syndicate Lead",
    role: "investor",
    roles: ["investor"],
    email: "investor@weaven.id",
    password: "investor123",
    company: "Alpha Ventures Indonesia",
    location: "Jakarta, Indonesia",
    bio: "Early stage investor focused on EdTech, FinTech and AgriTech.",
    avatarColor: "#16a34a",
    isVerified: true,
    profileCompletion: 90,
    tokenBalance: 120,
    investorTicketRange: "Rp 100jt - 500jt",
    investorSectors: ["EdTech", "FinTech", "AgriTech"],
  },
  {
    id: "user-2",
    name: "Siti Rahmawati",
    initials: "SR",
    title: "Founder PANENLOKAL",
    role: "founder",
    roles: ["founder"],
    email: "siti@panenlokal.id",
    password: "password123",
    company: "PANENLOKAL",
    location: "Bandung, Indonesia",
    avatarColor: "#d97706",
    isVerified: true,
    profileCompletion: 75,
    founderTokenBalance: 20,
  },
  {
    id: "user-4",
    name: "Budi Santoso",
    initials: "BS",
    title: "Capex & Property Owner",
    role: "capex_provider",
    roles: ["capex_provider"],
    email: "budi@fitsspace.id",
    password: "password123",
    company: "Santoso Property Group",
    location: "Yogyakarta, Indonesia",
    avatarColor: "#0891b2",
    isVerified: true,
    profileCompletion: 80,
  },
];

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  accounts: AuthUser[];
  login: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  updateUserAccount: (userId: string, updates: Partial<AuthUser>) => void;
  authenticateWithCredentials: (email: string, password: string) => { success: boolean; message?: string; user?: AuthUser };
  registerAccount: (newUserData: Omit<AuthUser, "id" | "initials">) => { success: boolean; message?: string; user?: AuthUser };
  authenticateWithGoogle: (googleEmail: string, googleName: string) => { success: boolean; user?: AuthUser; isNewUser?: boolean };
  registerGoogleAccount: (googleEmail: string, googleName: string, role: ActiveRole, city?: string) => { success: boolean; user?: AuthUser };
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  accounts: [],
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  updateUserAccount: () => {},
  authenticateWithCredentials: () => ({ success: false }),
  registerAccount: () => ({ success: false }),
  authenticateWithGoogle: () => ({ success: false }),
  registerGoogleAccount: () => ({ success: false }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accounts, setAccounts] = useState<AuthUser[]>(INITIAL_DATABASE_ACCOUNTS);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Load database accounts and current session from localStorage
  useEffect(() => {
    try {
      // 1. Load accounts database
      const storedAccounts = localStorage.getItem("vb_database_accounts");
      let currentDb: AuthUser[] = INITIAL_DATABASE_ACCOUNTS;
      if (storedAccounts) {
        currentDb = JSON.parse(storedAccounts);
        // ensure default accounts exist in currentDb
        INITIAL_DATABASE_ACCOUNTS.forEach((initialAcc) => {
          if (!currentDb.some((acc) => acc.email?.toLowerCase() === initialAcc.email?.toLowerCase())) {
            currentDb.push(initialAcc);
          }
        });
      } else {
        localStorage.setItem("vb_database_accounts", JSON.stringify(INITIAL_DATABASE_ACCOUNTS));
      }
      setAccounts(currentDb);

      // 2. Load active session & merge with fresh database account
      const explicitLogout = localStorage.getItem("vb_logged_out");
      const storedUser = localStorage.getItem("vb_user");

      if (explicitLogout === "true") {
        setUser(null);
      } else if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const fresh = currentDb.find(
          (a) => a.id === parsed.id || (a.email && parsed.email && a.email.toLowerCase() === parsed.email.toLowerCase())
        );
        const finalUser = fresh ? { ...parsed, ...fresh } : parsed;
        setUser(finalUser);
        try {
          localStorage.setItem("vb_user", JSON.stringify(finalUser));
        } catch {}
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsInitialized(true);
    }

    // Optional Supabase cloud sync
    if (isSupabaseConfigured && supabase) {
      supabase.from("profiles").select("*").then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          const remoteAccounts: AuthUser[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            initials: row.initials,
            title: row.title,
            role: row.role as ActiveRole,
            roles: row.roles || [row.role],
            email: row.email,
            password: row.password,
            company: row.company,
            location: row.location,
            bio: row.bio,
            avatarColor: row.avatar_color,
            isVerified: row.is_verified,
            profileCompletion: row.profile_completion,
            tokenBalance: row.token_balance,
            founderTokenBalance: row.founder_token_balance,
            unlockedOpportunities: row.unlocked_opportunities,
          }));
          setAccounts((local) => {
            const merged = [...local];
            remoteAccounts.forEach((rem) => {
              const idx = merged.findIndex((m) => m.id === rem.id || (m.email && rem.email && m.email.toLowerCase() === rem.email.toLowerCase()));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...rem };
              } else {
                merged.push(rem);
              }
            });
            try {
              localStorage.setItem("vb_database_accounts", JSON.stringify(merged));
            } catch {}

            // Also refresh active user if matched
            setUser((curr) => {
              if (!curr) return null;
              const match = merged.find((m) => m.id === curr.id || (m.email && curr.email && m.email.toLowerCase() === curr.email.toLowerCase()));
              if (match) {
                const updated = { ...curr, ...match };
                try {
                  localStorage.setItem("vb_user", JSON.stringify(updated));
                } catch {}
                return updated;
              }
              return curr;
            });

            return merged;
          });
        }
      });
    }
  }, []);

  // Listen to cross-tab updates on accounts database
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "vb_database_accounts" && e.newValue) {
        try {
          const freshDb: AuthUser[] = JSON.parse(e.newValue);
          setAccounts(freshDb);
          setUser((curr) => {
            if (!curr) return null;
            const match = freshDb.find((m) => m.id === curr.id || (m.email && curr.email && m.email.toLowerCase() === curr.email.toLowerCase()));
            if (match) {
              const updated = { ...curr, ...match };
              try {
                localStorage.setItem("vb_user", JSON.stringify(updated));
              } catch {}
              return updated;
            }
            return curr;
          });
        } catch {}
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function persistAccounts(updatedAccounts: AuthUser[]) {
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem("vb_database_accounts", JSON.stringify(updatedAccounts));
    } catch {}
  }

  const updateUserAccount = useCallback((userId: string, updates: Partial<AuthUser>) => {
    setAccounts((prevAccounts) => {
      const updatedAccounts = prevAccounts.map((acc) =>
        acc.id === userId ? { ...acc, ...updates } : acc
      );
      try {
        localStorage.setItem("vb_database_accounts", JSON.stringify(updatedAccounts));
      } catch {}
      return updatedAccounts;
    });

    setUser((prevUser) => {
      if (prevUser && prevUser.id === userId) {
        const updated = { ...prevUser, ...updates };
        try {
          localStorage.setItem("vb_user", JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prevUser;
    });

    // Also update raw localStorage vb_user in case active tab is admin
    try {
      const rawUser = localStorage.getItem("vb_user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed.id === userId) {
          localStorage.setItem("vb_user", JSON.stringify({ ...parsed, ...updates }));
        }
      }
    } catch {}

    if (isSupabaseConfigured && supabase) {
      const dbUpdates: Record<string, any> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.tokenBalance !== undefined) dbUpdates.token_balance = updates.tokenBalance;
      if (updates.founderTokenBalance !== undefined) dbUpdates.founder_token_balance = updates.founderTokenBalance;
      if (updates.isVerified !== undefined) dbUpdates.is_verified = updates.isVerified;
      if (updates.unlockedOpportunities !== undefined) dbUpdates.unlocked_opportunities = updates.unlockedOpportunities;
      if (Object.keys(dbUpdates).length > 0) {
        supabase.from("profiles").update(dbUpdates).eq("id", userId).then();
      }
    }
  }, []);

  function login(newUser: AuthUser) {
    const roles = newUser.roles ?? [newUser.role];
    const userWithRoles = { ...newUser, roles };
    setUser(userWithRoles);
    try {
      localStorage.removeItem("vb_logged_out");
      localStorage.setItem("vb_user", JSON.stringify(userWithRoles));
    } catch {}
  }

  function updateProfile(updates: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("vb_user", JSON.stringify(updated));
      } catch {}

      if (prev.id) {
        updateUserAccount(prev.id, updates);
      }
      return updated;
    });
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("vb_user");
      localStorage.setItem("vb_logged_out", "true");
    } catch {}
    router.push("/");
  }

  function authenticateWithCredentials(emailInput: string, passwordInput: string): { success: boolean; message?: string; user?: AuthUser } {
    const trimmedEmail = emailInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    const matchedAccount = accounts.find(
      (acc) => acc.email?.toLowerCase() === trimmedEmail
    );

    if (!matchedAccount) {
      return {
        success: false,
        message: "Akun belum terdaftar di sistem. Silakan daftar terlebih dahulu.",
      };
    }

    if (matchedAccount.password && matchedAccount.password !== trimmedPass) {
      return {
        success: false,
        message: "Kata sandi yang Anda masukkan salah. Silakan coba lagi.",
      };
    }

    login(matchedAccount);
    return { success: true, user: matchedAccount };
  }

  function registerAccount(newUserData: Omit<AuthUser, "id" | "initials">): { success: boolean; message?: string; user?: AuthUser } {
    const trimmedEmail = (newUserData.email || "").trim().toLowerCase();

    const isExisting = accounts.some(
      (acc) => acc.email?.toLowerCase() === trimmedEmail
    );

    if (isExisting) {
      return {
        success: false,
        message: "Email ini sudah terdaftar. Silakan langsung masuk ke akun Anda.",
      };
    }

    const name = newUserData.name.trim() || "Pengguna";
    const parts = name.split(" ").filter(Boolean);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

    const createdUser: AuthUser = {
      ...newUserData,
      id: `user-${Date.now()}`,
      name,
      initials,
      email: trimmedEmail,
      title: newUserData.title || `Member Weaven`,
      roles: newUserData.roles || [newUserData.role],
      avatarColor: newUserData.role === "investor" ? "#16a34a" : "#2563eb",
      profileCompletion: 30,
      authProvider: "email",
    };

    const updatedAccounts = [...accounts, createdUser];
    persistAccounts(updatedAccounts);
    login(createdUser);

    return { success: true, user: createdUser };
  }

  function authenticateWithGoogle(googleEmail: string, googleName: string): { success: boolean; user?: AuthUser; isNewUser?: boolean } {
    const trimmedEmail = googleEmail.trim().toLowerCase();
    const matched = accounts.find((acc) => acc.email?.toLowerCase() === trimmedEmail);

    if (matched) {
      login(matched);
      return { success: true, user: matched, isNewUser: false };
    }

    // Google account not yet registered in database
    return { success: false, isNewUser: true };
  }

  function registerGoogleAccount(googleEmail: string, googleName: string, role: ActiveRole, city?: string): { success: boolean; user?: AuthUser } {
    const trimmedEmail = googleEmail.trim().toLowerCase();
    const name = googleName.trim() || "Google User";
    const parts = name.split(" ").filter(Boolean);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

    const createdUser: AuthUser = {
      id: `google-${Date.now()}`,
      name,
      initials,
      email: trimmedEmail,
      role,
      roles: [role],
      title: role === "investor" ? "Investor" : role === "founder" ? "Founder" : role === "capex_provider" ? "Capex Provider" : "Co-Founder",
      location: city ? `${city}, Indonesia` : "Indonesia",
      avatarColor: role === "investor" ? "#16a34a" : "#2563eb",
      profileCompletion: 40,
      authProvider: "google",
      tokenBalance: role === "investor" ? 50 : 0,
      founderTokenBalance: 0,
    };

    const updatedAccounts = [...accounts, createdUser];
    persistAccounts(updatedAccounts);
    login(createdUser);

    return { success: true, user: createdUser };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user && isInitialized,
        accounts,
        login,
        logout,
        updateProfile,
        updateUserAccount,
        authenticateWithCredentials,
        registerAccount,
        authenticateWithGoogle,
        registerGoogleAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
