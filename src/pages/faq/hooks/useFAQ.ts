
import { useAppQuery, useAppMutation } from "@/utils/react-query";
import type { FaqResponse } from "@/schema/faqs";
import { useSearchParams } from "react-router-dom";

export const useFAQs = () => {
    
  const [searchParam] = useSearchParams();
  return useAppQuery<FaqResponse>({
    url: `/faqs?${searchParam.toString()}`,
    queryKey: ["faqs", searchParam.toString()],
  });
};

export const useCreateFAQ = () => {

  return useAppMutation({
    url: "/faqs",
    type: "post",
   
  });
};

export const useUpdateFAQ = () => {

  return useAppMutation({
    url: "/faqs",
    type: "patch",
   
  });
};

export const useDeleteFAQ = () => {

  return useAppMutation({
    url: "/faqs",
    type: "delete",
  
  });
};
