import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  authLogout,
  authMe,
  authRefresh,
  extractAccessToken,
  extractUserFromAuth,
} from "../services/authApi";

const AuthContext = createContext();

const USER_STORAGE_KEY = "auth_user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  const syncToken = (tokenValue) => {
    if (!tokenValue) return;
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const syncUser = (userValue) => {
    if (userValue) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userValue));
      setUser(userValue);
      return;
    }

    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const login = (tokenValue, userValue = null) => {
    syncToken(tokenValue);

    syncUser(userValue);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch {
      // Best effort logout for HTTP-only refresh cookie cleanup.
    } finally {
      clearAuth();
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchMe = async () => {
      const mePayload = await authMe();
      const me = extractUserFromAuth(mePayload) || mePayload;
      if (!mounted) return null;
      syncUser(me);
      return me;
    };

    const refreshSession = async () => {
      const refreshed = await authRefresh();
      const newToken = extractAccessToken(refreshed);
      if (!newToken) return null;
      if (!mounted) return newToken;
      syncToken(newToken);
      return newToken;
    };

    const bootstrap = async () => {
      try {
        if (!token) {
          const newToken = await refreshSession();
          if (!newToken) {
            clearAuth();
            return;
          }
        }

        await fetchMe();
      } catch (error) {
        if (!mounted) return;
        const status = error?.response?.status;
        if (status !== 401) {
          clearAuth();
          setIsLoading(false);
          return;
        }

        try {
          const newToken = await refreshSession();
          if (!newToken) {
            clearAuth();
            return;
          }
          await fetchMe();
        } catch {
          if (!mounted) return;
          clearAuth();
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [token]);

  const isAuthenticated = !!token;
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  const value = useMemo(
    () => ({ token, user, login, logout, isAuthenticated, isAdmin, isLoading }),
    [token, user, isAuthenticated, isAdmin, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
