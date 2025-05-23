import useAxiosAuth from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

interface AppMutationProps {
  url: string;
  type: "post" | "patch" | "delete";
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
}

export const useAppMutation = ({
  url,
  type,
  onSuccess,
  onError,
}: AppMutationProps) => {
  const axios = useAxiosAuth();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios[type](url, data);

      return res;
    },
    onSuccess,
    onError,
  });
};
