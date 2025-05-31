import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAxiosAuth from "@/hooks/useAuth";
import type { AuthUser } from "@/types/enums";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const axios = useAxiosAuth();

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          Cookies.remove("token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [axios]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
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