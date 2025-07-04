import axios from "axios";
import { BASEURL } from "../utils/constant";
import { useAuth } from "@/context/auth-context";
const useAxiosAuth = () => {
  const { accessToken, setAccessToken } = useAuth();

  const axiosInstance = axios.create({
    baseURL: BASEURL,
    withCredentials: true, // Important for refresh token in HTTP-only cookie
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });


  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If access token expired, try refreshing
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            `${BASEURL}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          if (setAccessToken) {
            setAccessToken(res.data.access_token); // Update token in context
          }
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return axiosInstance(originalRequest); // Retry failed request
        } catch (refreshError) {
          console.error("Session expired, logging out...");
          if (setAccessToken) {
            setAccessToken(null);
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosAuth;
