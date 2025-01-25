import React, { useState } from "react";
import { AuthContext, authenticateUser, type User } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if we have a stored user
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    try {
      const userData = await authenticateUser(username, password);
      setUser(userData);
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      toast({
        title: "Login bem sucedido",
        description: `Bem vindo, ${userData.username}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro no login",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
