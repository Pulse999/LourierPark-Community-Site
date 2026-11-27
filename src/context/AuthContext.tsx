import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiRequest } from "../api/client";

export type Administrator = {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
};

type AuthResponse = {
  status: string;
  message?: string;
  data: {
    administrator: Administrator;
  };
};

type AuthContextType = {
  administrator: Administrator | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [administrator, setAdministrator] =
    useState<Administrator | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const response = await apiRequest<AuthResponse>("/auth/me");

      setAdministrator(response.data.administrator);
    } catch {
      setAdministrator(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const login = async (email: string, password: string) => {
    await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Retrieve the normalized administrator profile from the session.
    const response = await apiRequest<AuthResponse>("/auth/me");

    setAdministrator(response.data.administrator);
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      setAdministrator(null);
    }
  };

  const hasPermission = (permission: string) => {
    if (!administrator) return false;

    return (
      administrator.isSuperAdmin ||
      administrator.permissions.includes(permission)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        administrator,
        isAuthenticated: Boolean(administrator),
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}