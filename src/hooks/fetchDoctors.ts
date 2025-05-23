import axios from "axios";
import type { CreateDoctorInput, DoctorsResponse } from "@/schema/Doctors";
import { BASEURL } from "@/utils/constant";

export const useFetchDoctors = () => {
  const fetchDoctors = async () => {
    const response = await axios.get<DoctorsResponse>(`${BASEURL}/doctors`);
    return response.data.data;
  };
  return fetchDoctors;
};

const createDoctor = async () => {
  const response = await axios.post<CreateDoctorInput>(`${BASEURL}/doctors`);
  return response.data;
};
