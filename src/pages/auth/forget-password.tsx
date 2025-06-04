import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASEURL } from "@/utils/constant";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0); // seconds

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function onSubmit(data: LoginValues) {
    if (countdown > 0) {
      toast.warning("Please wait for the countdown to finish before requesting again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASEURL}/auth/forgot-password`, data);
      setMessage(response?.data?.message || "Password reset link sent successfully");
      toast.success(response?.data?.message?.message || "Password reset link sent successfully");
      setCountdown(5 * 60); // 5 minutes in seconds
    } catch (error: any) {
      setMessage(error?.response?.data?.message?.message || "Something went wrong");
      toast.error(error?.response?.data?.message?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>Type your email to verify</CardDescription>
          <CardDescription className="text-red-600">{message}</CardDescription>
          {countdown > 0 && (
            <CardDescription className="text-yellow-600">
              You can request a new link in {formatTime(countdown)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={countdown > 0} // Disable input while countdown is active
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading || countdown > 0}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
