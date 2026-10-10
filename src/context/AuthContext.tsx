"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setAuthenticatedUser: (user: User) => void;
  logout: () => void;
  updateAvatar: (avatar: string) => void;
  updateName: (name: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://api.escuelajs.co/api/v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        return;
      }

      const profile: User = await response.json();

      const savedAvatar = localStorage.getItem("custom_profile_avatar");
      const savedName = localStorage.getItem("custom_profile_name");

      setUser({
        ...profile,
        name: savedName || profile.name,
        avatar: savedAvatar || undefined,
      });
    } catch {
      // Don't treat a network failure as a successful login.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  function setAuthenticatedUser(newUser: User) {
    const savedAvatar = localStorage.getItem("custom_profile_avatar");
    const savedName = localStorage.getItem("custom_profile_name");

    setUser({
      ...newUser,
      name: savedName || newUser.name,
      avatar: savedAvatar || undefined,
    });

    setLoading(false);
  }

  function updateAvatar(avatar: string) {
    if (avatar) {
      localStorage.setItem("custom_profile_avatar", avatar);
    } else {
      localStorage.removeItem("custom_profile_avatar");
    }

    setUser((currentUser) =>
      currentUser
        ? { ...currentUser, avatar: avatar || undefined }
        : null
    );
  }

  function updateName(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    localStorage.setItem("custom_profile_name", trimmedName);

    setUser((currentUser) =>
      currentUser
        ? { ...currentUser, name: trimmedName }
        : null
    );
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("custom_profile_avatar");
    localStorage.removeItem("custom_profile_name");

    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        setAuthenticatedUser,
        logout,
        updateAvatar,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}