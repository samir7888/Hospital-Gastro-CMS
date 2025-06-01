import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "@/types/enums";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASEURL } from "@/utils/constant";

interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();
  // const axios = useAxiosAuth();

  // Initialize auth state from localStorage on mount
  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token) as any;
  //       setAccessToken(token);
  //       const fullName = decoded.firstName + " " + decoded.lastName;
  //       setUser({ name: fullName, email: decoded.email });
  //     } catch (error) {
  //       // Token is invalid, remove it
  //     }
  //   }
  // }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASEURL}/auth/login`, {
        email,
        password,
      });
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

  const logout = async () => {
    await axios.post(`${BASEURL}/auth/logout`);
    setUser(null);
    setAccessToken(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, accessToken, setAccessToken }}
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

  const { accessToken, ...rest } = context;

  // Safely decode the token only if it exists
  const currentUser = accessToken
    ? (() => {
        try {
          return jwtDecode(accessToken) as IUser;
        } catch (error) {
          console.error("Invalid token:", error);
          return null;
        }
      })()
    : null;

  return {
    ...rest,
    accessToken,
    currentUser,
  };
}
