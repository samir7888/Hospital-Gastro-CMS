"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAxiosAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import type { HomePageData } from "@/schema/pages-schemas/hero-page.-schema";
import { useAppQuery } from "@/utils/react-query";

const metaDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z
    .array(
      z.string({ invalid_type_error: "Each keyword must be a string" }),
      { invalid_type_error: "keywords must be an array of strings" }
    ),
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
  const axios = useAxiosAuth();
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
        ? (existingData.metadata.keywords as string).split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    });
  }
}, [existingData, isDataLoading, form]);


  const onSubmit = async (data: MetaDataFormValues) => {
    try {
      const res = await axios.patch(`${apiEndpoint}`, { metadata:data });
      if (res.status === 200) {
        toast.success("Meta data updated successfully!");
      }
    } catch (error) {
      console.error("Error updating meta data:", error);
      toast.error("Failed to update meta data. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Meta Data</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Textarea
            placeholder="Description"
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
        <div>
 
  <Input
    id="keywords"
    placeholder="e.g. Cardiology, Orthopedics"
    value={
      Array.isArray(form.watch("keywords"))
        ? form.watch("keywords").join(", ")
        : ""
    }
    onChange={(e) => {
      const value = e.target.value;
      if (value.trim()) {
        form.setValue(
          "keywords",
          value
            .split(",")
            .map((item) => item.trim())
        );
      } else {
        form.setValue("keywords", []);
      }
    }}
  />
  <p className="text-gray-500 text-sm">
    Enter keywords separated by commas (optional)
  </p>
  {form.formState.errors.keywords && (
    <p className="text-red-500 text-sm">
      {form.formState.errors.keywords.message}
    </p>
  )}
</div>

        <Button type="submit">Update Meta Data</Button>
      </form>
    </div>
  );
};

export default MetaDataSection;
