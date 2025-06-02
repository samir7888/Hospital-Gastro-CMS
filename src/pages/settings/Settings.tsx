"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppQuery, useAppMutation } from "@/utils/react-query";
import { toast } from "sonner"; // or your toast library
// import { FileUpload } from "@/components/ui/file-upload";
import type { ImageResponse } from "@/schema/global.schema";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must not exceed 100 characters"),
  siteTitle: z
    .string()
    .min(1, "Site title is required")
    .max(100, "Site title must not exceed 100 characters"),
  siteDescription: z
    .string()
    .max(500, "Site description must not exceed 500 characters")
    .optional(),
  footerDescription: z
    .string()
    .max(500, "Footer description must not exceed 500 characters")
    .optional(),
  privacyPolicy: z.string().optional(),
  termsAndConditions: z.string().optional(),
  logoId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GeneralSettingsResponse {
  id: string;
  companyName: string;
  siteTitle: string;
  siteDescription: string;
  logo: ImageResponse | null;
}

interface PrivacyPolicyResponse {
  privacyPolicy: string;
}

interface TermsConditionsResponse {
  termsAndConditions: string;
}

interface FooterDescriptionResponse {
  footerDescription: string;
}

export default function TitlePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      siteTitle: "",
      siteDescription: "",
      footerDescription: "",
      privacyPolicy: "",
      termsAndConditions: "",
      logoId: "",
    },
  });

  // Fetch existing settings from multiple endpoints
  const {
    data: generalSettings,
    isLoading: isLoadingGeneral,
    error: generalError,
  } = useAppQuery<GeneralSettingsResponse>({
    url: "general-setting",
    queryKey: ["general-settings"],
  });

  const {
    data: privacyPolicy,
    isLoading: isLoadingPrivacy,
    error: privacyError,
  } = useAppQuery<PrivacyPolicyResponse>({
    url: "general-setting/privacy-policy",
    queryKey: ["privacy-policy"],
  });

  const {
    data: termsConditions,
    isLoading: isLoadingTerms,
    error: termsError,
  } = useAppQuery<TermsConditionsResponse>({
    url: "general-setting/terms-and-condition",
    queryKey: ["terms-conditions"],
  });

  const {
    data: footerDescription,
    isLoading: isLoadingFooter,
    error: footerError,
  } = useAppQuery<FooterDescriptionResponse>({
    url: "general-setting/footer-description",
    queryKey: ["footer-description"],
  });

  const isLoadingSettings =
    isLoadingGeneral || isLoadingPrivacy || isLoadingTerms || isLoadingFooter;
  const hasError = generalError || privacyError || termsError || footerError;

  // Update form mutation
  const updateSettingsMutation = useAppMutation({
    url: "general-setting",
    type: "patch",
    onSuccess: () => {
      toast.success("Settings updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update settings. Please try again.");
      console.error("Update error:", error);
    },
  });

  // Populate form with fetched data
  useEffect(() => {
    if (
      generalSettings &&
      privacyPolicy &&
      termsConditions &&
      footerDescription
    ) {
      form.reset({
        companyName: generalSettings.companyName || "",
        siteTitle: generalSettings.siteTitle || "",
        siteDescription: generalSettings.siteDescription || "",
        footerDescription: footerDescription.footerDescription || "",
        privacyPolicy: privacyPolicy.privacyPolicy || "",
        termsAndConditions: termsConditions?.termsAndConditions || "",
        logoId: generalSettings.logo?.id || "",
      });
    }
  }, [generalSettings, form]);

  function onSubmit(data: FormValues) {
    updateSettingsMutation.mutate({
      data,
    });
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Failed to load general settings. Please refresh the page or try
            again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hospital Website Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your hospital website branding and metadata
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your hospital website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingSettings ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Hospital Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The official name of your hospital
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Hospital Website Title"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This appears in the browser tab and search results
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="footerDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description for website footer..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This text appears in the website footer
                          <span className="block mt-1 text-right text-xs text-muted-foreground">
                            {field.value?.length || 0}/500 characters
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>
                Upload your hospital logo and configure visual branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="logoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        name="logoId"
                        maxCount={1}
                        maxSize={5242880} // 5MB
                        currentImage={generalSettings?.logo || null}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your hospital logo. Recommended size: 512x512px.
                      Max file size: 5MB. Supported formats: JPG, PNG, SVG.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Legal Pages</CardTitle>
              <CardDescription>
                Configure your privacy policy and terms & conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy Policy</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your privacy policy content..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your hospital's privacy policy content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your terms and conditions..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your hospital's terms and conditions content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending || isLoadingSettings}
            >
              {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
