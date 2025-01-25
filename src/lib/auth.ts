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

// Mock authentication function - in a real app, this would call your API
export const authenticateUser = async (
  username: string,
  password: string,
): Promise<User> => {
  // For demo purposes, we'll use some simple logic
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  // Simple validation for demo purposes
  if (username === "admin" && password === "admin") {
    return { username: "admin", role: "admin" };
  } else if (username === "operator" && password === "operator") {
    return { username: "operator", role: "operator" };
  } else if (username === "viewer" && password === "viewer") {
    return { username: "viewer", role: "viewer" };
  }

  throw new Error("Invalid username or password");
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
