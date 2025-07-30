// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

// 1. Định nghĩa kiểu dữ liệu
interface User {
  id: string;
  name: string;
  email: string;
  googleId?: string;
}

interface AuthContextType {
  user: User | null; // Thông tin user
  loading: boolean; // Đang check auth
  isAuthenticated: boolean; // Đã login chưa
  logout: () => Promise<void>; // Function logout
}

// 2. Tạo Context (kho chung)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider - Component bao bọc app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 4. Khi app khởi động, check auth ngay
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        console.log("✅ User authenticated:", data.user.email);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("❌ User not authenticated");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setIsAuthenticated(false);
      console.log("✅ Logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 5. Chia sẻ data cho toàn bộ app
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 6. Hook để lấy data từ Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
