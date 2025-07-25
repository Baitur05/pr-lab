"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  group?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin.university@gmail.edu",
    role: "admin",
  },
  {
    id: "2",
    name: "Teacher1",
    email: "teacher1@gmail.edu",
    role: "teacher",
  },
  {
    id: "3",
    name: "Baitur Ibrakhimov",
    email: "baitur.ibrakhimov@gmail.edu",
    role: "student",
    group: "bis-1-23",
  },
  {
    id: "4",
    name: "Syimyk Nurlanov",
    email: "syimyk.nurlanov@gmail.edu",
    role: "student",
    group: "bis-1-23",
  },
  {
    id: "5",
    name: "Teacher2",
    email: "teacher2@gmail.com",
    role: "teacher",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Mock authentication
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser && password === "password") {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
