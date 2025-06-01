import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "@/types/enums";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASEURL } from "@/utils/constant";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (email: string, password: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASEURL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { access_token } = response.data;
      const decoded: { firstName: string; lastName: string; email: string } =
        jwtDecode(access_token);

      setAccessToken(access_token);
      const fullName = decoded.firstName + " " + decoded.lastName;
      setUser({ name: fullName, email: decoded.email });
      navigate("/dashboard");
      toast.success("Logged in successfully");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message?.message ||
        JSON.stringify(error?.response?.data) ||
        "Login failed";

      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, accessToken, setUser, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
