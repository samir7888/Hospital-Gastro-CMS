import useAxiosAuth from "@/hooks/useAuth";
import {
  useMutation,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

interface AppMutationProps {
  url: string;
  type: "post" | "patch" | "delete";
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
}

// utils/react-query.ts
export const useAppMutation = ({
  type,
  onSuccess,
  onError,
  url,
}: AppMutationProps) => {
  const axios = useAxiosAuth();

  return useMutation({
    mutationFn: async ({ data }: { data?: any }) => {
      const res = await axios[type](url, data);
      return res.data;
    },
    onSuccess,
    onError,
  });
};

interface AppQueryProps {
  url: string;
  queryKey: string[];

  options?: Record<string, any>;
}

export const useAppQuery = <T>({
  url,
  queryKey = [],
  options,
}: AppQueryProps): UseQueryResult<T> => {
  const axios = useAxiosAuth();

  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const res = await axios.get<T>(url);
      return res.data;
    },
    ...options,
  });
};
