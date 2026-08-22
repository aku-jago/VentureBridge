"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id?: string;
  name: string;
  initials: string;
  title: string;
  role: "founder" | "investor";
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const explicitLogout = localStorage.getItem("vb_logged_out");
      const stored = localStorage.getItem("vb_user");

      if (explicitLogout === "true") {
        setUser(null);
      } else if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // By default, a new visitor is a Guest (not logged in)
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  function login(newUser: AuthUser) {
    setUser(newUser);
    try {
      localStorage.removeItem("vb_logged_out");
      localStorage.setItem("vb_user", JSON.stringify(newUser));
    } catch {}
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("vb_user");
      localStorage.setItem("vb_logged_out", "true");
    } catch {}
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user && isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
