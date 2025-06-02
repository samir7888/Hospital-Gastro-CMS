import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();


  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
}
