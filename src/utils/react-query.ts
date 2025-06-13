import useAxiosAuth from "@/hooks/useAuth";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface AppMutationProps {
  url: string;
  type: "post" | "patch" | "delete";
  queryKey?: string[];
  options?: Partial<UseMutationOptions<any, any, any, any>>;
  toastOnError?: boolean;
  toastOnSuccess?: boolean;
  form?: UseFormReturn<any, any>;
}

// utils/react-query.ts
export const useAppMutation = ({
  type,
  url,
  queryKey,
  options,
  toastOnError = true,
  toastOnSuccess = true,
  form,
}: AppMutationProps) => {
  const axios = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: { data?: any; id?: string }) => {
      const formattedUrl = id ? `${url}/${id}` : url;
      const res = await axios[type](formattedUrl, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });

      if (toastOnSuccess) {
        const msg = data?.message || "Success";

        toast.success(msg);
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        if (toastOnError) {
          const message = error.response?.data?.message;

          if (message instanceof Object && "message" in message) {
            const msg = message.message;

            if (Array.isArray(msg)) {
              const msgItem = JSON.parse(msg[0]);

              if ("field" in msgItem) {
                if (form) {
                  form?.setError(msgItem.field, {
                    type: "manual",
                    message: msgItem.message,
                  });
                  form?.setFocus(msgItem.field);
                } else {
                  toast.error(msgItem.message);
                }
              } else {
                toast.error(msgItem.message);
              }
            } else if ("field" in message) {
              if (form) {
                form?.setError(message.field, {
                  type: "manual",
                  message: message.message,
                });
                form?.setFocus(message.field);
              } else {
                toast.error(message.message);
              }
            } else if (typeof msg === "string") {
              toast.error(msg);
            }
          } else if (typeof message === "string") {
            toast.error(message);
          } else {
            toast.error(error.message);
          }
        }
      } else if (error instanceof Error) {
        toastOnError && toast.error(error.message);
      }
    },
    ...options,
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
