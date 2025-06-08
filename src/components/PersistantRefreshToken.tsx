import { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../utils/constant";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "./ui/skeleton";

const PersistentRefreshToken = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axios.post(
          `${BASEURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (res.data?.access_token && setAccessToken) {
          setAccessToken(res.data.access_token);
        }
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    };

    refreshAccessToken().then(() => {
      setLoading(false);
    }); // Call on mount (every refresh)
  }, []);

  if (loading) {
    return <div className="flex flex-col container mx-auto gap-12 items-center justify-center h-screen">
      <Skeleton className="w-52 h-12" />
      <Skeleton className="w-full h-32" />
    </div>;
  }

  return children; // No UI rendering
};

export default PersistentRefreshToken;
