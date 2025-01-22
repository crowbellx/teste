import { createContext, useContext } from "react";

export type UserRole = "admin" | "operator" | "viewer";

export interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

import { authAPI } from "./api";

export const authenticateUser = async (username: string, password: string) => {
  try {
    const { user, token } = await authAPI.login(username, password);
    localStorage.setItem("authToken", token);
    return user;
  } catch (error) {
    throw new Error("Invalid credentials");
  }
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
