import { BASEURL } from "@/utils/constant";
import axios from "axios";
const useAxiosAuth = () => {

    const axiosInstance = axios.create({
        baseURL: BASEURL,
        withCredentials: true, // Important for refresh token in HTTP-only cookie
    });



    return axiosInstance;
};

export default useAxiosAuth;