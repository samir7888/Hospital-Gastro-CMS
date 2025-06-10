"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect } from "react";
import type { HomePageData } from "@/schema/pages-schemas/hero-page.-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const metaDataSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be between 3 and 50 characters")
    .max(50, "Title must be between 3 and 50 characters"),
  description: z
    .string()
    .min(10, "Description must be between 10 and 300 characters")
    .max(300, "Description must be between 10 and 300 characters"),
 keywords: z.array(z.string().min(3).max(50), {
  invalid_type_error: "keywords must be an array of strings",
}).refine((arr) => arr.every(k => k.length >= 3 && k.length <= 50), {
  message: "Each keyword must be between 3 and 50 characters",
})
,
});

type MetaDataFormValues = z.infer<typeof metaDataSchema>;

interface MetaDataSectionProps {
  apiEndpoint: string;
  queryKey: string[];
}

const MetaDataSection: React.FC<MetaDataSectionProps> = ({
  apiEndpoint,
  queryKey,
}) => {
  const form = useForm<MetaDataFormValues>({
    resolver: zodResolver(metaDataSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: [],
    },
  });

  const {
    data: existingData,
    isLoading: isDataLoading,
    refetch,
  } = useAppQuery<HomePageData>({
    url: apiEndpoint,
    queryKey,
    options: {
      onSuccess: () => {
        toast.success("Hero section updated successfully!");
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update hero section");
      },
    },
  });

  useEffect(() => {
    if (existingData && !isDataLoading) {
      form.reset({
        title: existingData?.metadata?.title || "",
        description: existingData?.metadata?.description || "",
        keywords: Array.isArray(existingData?.metadata?.keywords)
          ? existingData?.metadata?.keywords
          : typeof existingData?.metadata?.keywords === "string"
          ? (existingData.metadata.keywords as string)
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      });
    }
  }, [existingData, isDataLoading, form]);

  const { mutateAsync: updateMetaData, isPending: isUpdating } = useAppMutation(
    {
      type: "patch",
      url: apiEndpoint,
      queryKey: ["meta-data"],
    }
  );

  const onSubmit = async (data: MetaDataFormValues) => {
    await updateMetaData({data:{metadata:data}});
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Meta Data</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none field-sizing-content"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input
                    id="keywords"
                    placeholder="e.g. Cardiology, Orthopedics"
                    value={field.value?.join(", ") || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.trim()) {
                        field.onChange(
                          value.split(",").map((item) => item.trim())
                        );
                      } else {
                        field.onChange([]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {
            <Button type="submit" disabled={isUpdating}>
              Update Metadata
            </Button>
          }
        </form>
      </Form>
    </div>
  );
};

export default MetaDataSection;
