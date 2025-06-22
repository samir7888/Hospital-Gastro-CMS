"use client";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppMutation } from "@/utils/react-query";
import { imageSchema, type ImageResponse } from "@/schema/global.schema";
import { FileUpload } from "@/components/file-upload";
import LegalPage from "./components/legalPage";

const formSchema = z.object({
  companyName: z
    .string()
    .min(3, "Company name must be between 3 and 50 characters")
    .max(50, "Company name must be between 3 and 50 characters"),

  footerDescription: z
    .string()
    .min(50, "Footer description must be between 50 and 200 characters")
    .max(200, "Footer description must be between 50 and 200 characters")
    .optional(),
  primaryLogoId: imageSchema,
  secondaryLogoId: imageSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage({
  defaultValues,
  uploadedImage,
}: {
  defaultValues?: Partial<FormValues> & {
    privacyPolicy?: string;
    termsAndConditions?: string;  
  };
  uploadedImage?: {
    primaryLogo: ImageResponse | null;
    secondaryLogo: ImageResponse | null;
  };
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      companyName: "",
      footerDescription: "",
      primaryLogoId: null,
      secondaryLogoId: null,
    },
  });

  const updateSettingsMutation = useAppMutation({
    url: "general-setting",
    type: "patch",
  });

  function onSubmit(data: FormValues) {
    updateSettingsMutation.mutate({
      data,
    });
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

      <Tabs defaultValue="general" className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic information about your hospital website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    name="footerDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none min-h-20 field-sizing-content"
                            rows={3}
                            placeholder="Brief description for website footer..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This text appears in the website footer
                          <span className="block mt-1 text-right text-xs text-muted-foreground">
                            {field.value?.length || 0}/200 characters
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logo & Branding</CardTitle>
                  <CardDescription>
                    Upload your Primary hospital logo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="primaryLogoId"
                    render={() => (
                      <FormItem>
                        <FormLabel>Hospital Logo</FormLabel>
                        <FormControl>
                          <FileUpload
                            name="primaryLogoId"
                            currentImage={uploadedImage?.primaryLogo}
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          Upload your hospital logo. Recommended size:
                          512x512px. Max file size: 5MB. Supported formats: JPG,
                          PNG, SVG.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Branding</CardTitle>
                  <CardDescription>
                    Upload your secondary hospital logo for footer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="secondaryLogoId"
                    render={() => (
                      <FormItem>
                        <FormLabel>Hospital Logo</FormLabel>
                        <FormControl>
                          <FileUpload
                            name="secondaryLogoId"
                            currentImage={uploadedImage?.secondaryLogo}
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          Upload your hospital logo. Recommended size:
                          512x512px. Max file size: 5MB. Supported formats: JPG,
                          PNG, SVG.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
        {/* Legal Pages Tab */}
        <TabsContent value="legal">
          <LegalPage
            defaultValues={{
              privacyPolicy: defaultValues?.privacyPolicy || "",
              termsAndConditions: defaultValues?.termsAndConditions || "",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
