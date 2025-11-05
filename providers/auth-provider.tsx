"use client";

import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import LoadingIndicator from "@/components/loading-indicator";

export interface AuthState {
  user_id: string;
  user_email: string;
  user_balance: number;
  user_subscription: string;
}

interface AuthContextType extends AuthState {
  updateAuthState: (state: Partial<AuthState>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user_id: "",
  user_email: "",
  user_balance: 0,
  user_subscription: 'Trial',
  updateAuthState: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthState>({
    user_id: "",
    user_email: "",
    user_balance: 0,
    user_subscription: 'Trial',
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      setIsLoading(true);

      if (pathName.startsWith("/login") || pathName.startsWith("/sign-up")) {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("jwt-token");
      if (!token) {
        router.push("/login");
        return;
      }

      const { access_token, refresh_token } = JSON.parse(token);
      const { data: { is_authenticated, user_id, user_email, user_balance, user_subscription, access_token: new_at }} = await axios.post("/api/auth/me", {
        access_token,
        refresh_token
      });

      if (is_authenticated) {
        setAuthState({
          user_id,
          user_email,
          user_balance,
          user_subscription
        });
        localStorage.setItem("jwt-token", JSON.stringify({
          access_token: new_at,
          refresh_token
        }))
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };
    void fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const updateAuthState = (newState: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...newState }));
  };

  return <AuthContext.Provider value={{ ...authState, updateAuthState }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}