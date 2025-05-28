
import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery, useAppMutation } from "@/utils/react-query";
import { toast } from "sonner";
import type { FaqItem, FaqResponse, FaqSchemaValues } from "@/schema/faqs";
import { useSearchParams } from "react-router-dom";

export const useFAQs = () => {
    
  const [searchParam] = useSearchParams();
  return useAppQuery<FaqResponse>({
    url: `/faqs?${searchParam.toString()}`,
    queryKey: ["faqs", searchParam.toString()],
  });
};

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    url: "/faqs",
    type: "post",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ created successfully");
    },
    onError: () => {
      toast.error("Failed to create FAQ");
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    url: "/faqs",
    type: "patch",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ updated successfully");
    },
    onError: () => {
      toast.error("Failed to update FAQ");
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    url: "/faqs",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete FAQ");
    },
  });
};
