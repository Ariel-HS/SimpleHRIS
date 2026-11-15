import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User, RegisterInput } from "../types";

const AUTH_API_BASE_URL = "http://localhost:3000/api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fields: RegisterInput) => Promise<void>
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const HOME_BY_ROLE = {
  admin: "/admin",
  staff: "/staff",
}
export const homeForRole = (role: 'admin' | 'staff' ) =>   
  HOME_BY_ROLE[role] ?? "/"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on initial mount
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Implement General API Client
        const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  async function login(email: string, password: string): Promise<User> {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data: { user: User; token: string } = await response.json();
    localStorage.setItem('token', data.token);

    setToken(data.token);
    setUser(data.user);

    return data.user
  }

  async function register(fields: RegisterInput) {
    await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( fields )
    });
  }

  function logout () {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function useRequiredAuth() {
  const auth = useAuth();
  if (!auth.user) {
    throw new Error('useRequiredAuth must be used inside a ProtectedRoute');
  }
  return {
    ...auth,
    user: auth.user,
  };
}