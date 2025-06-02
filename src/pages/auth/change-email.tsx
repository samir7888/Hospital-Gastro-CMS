import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import useAxiosAuth from "@/hooks/useAuth";

// Zod schema for form validation
const updateEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

type UpdateEmailFormData = z.infer<typeof updateEmailSchema>;

const UpdateEmailForm = () => {
  const axios = useAxiosAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<UpdateEmailFormData>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: UpdateEmailFormData) => {
    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });

    try {

      await axios.post(`/auth/update-email`, data);

      setSubmitStatus({
        type: "success",
        message: "Email updated successfully!",
      });

      // Reset form on success
      form.reset();
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message:
          error?.response?.data?.message?.message ??
          "Failed to update email. Please check your password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Update Email Address
        </h2>
        <p className="text-gray-600">
          Enter your new email address and current password to update your
          account.
        </p>
      </div>

      {submitStatus.type && (
        <Alert
          className={`mb-4 ${
            submitStatus.type === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              submitStatus.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }
          >
            {submitStatus.message}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <div onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  New Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your new email"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your current password"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Email...
              </>
            ) : (
              "Update Email Address"
            )}
          </Button>
        </div>
      </Form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• You'll need to verify your new email address</p>
        <p>• Your current password is required for security</p>
      </div>
    </div>
  );
};

export default UpdateEmailForm;
