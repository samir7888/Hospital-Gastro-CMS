"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];

const formSchema = z.object({
  name: z.string().min(1, "Title is required").max(100, "Title must not exceed 100 characters"),
  subtitle: z.string().max(200, "Subtitle must not exceed 200 characters").optional(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
  logo: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .svg formats are supported."
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TitlePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "General Hospital",
      subtitle: "Providing Quality Healthcare Since 1975",
      description: "A state-of-the-art healthcare facility dedicated to providing exceptional patient care with advanced medical technology and compassionate staff.",
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);
    // Here we would make an API call to update the name
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      form.setValue("logo", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hospital Website Settings</h1>
        <p className="text-muted-foreground">
          Configure your hospital website branding and metadata
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="branding">Logo & Branding</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Name Settings</CardTitle>
                  <CardDescription>
                    The name appears in the browser tab and in search results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Hospital Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the main name of your website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle / Tagline</FormLabel>
                        <FormControl>
                          <Input placeholder="A brief description of your hospital" {...field} />
                        </FormControl>
                        <FormDescription>
                          This appears below your name on the homepage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Branding</CardTitle>
                  <CardDescription>
                    Upload your hospital logo and configure visual branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormItem>
                    <FormLabel>Hospital Logo</FormLabel>
                    <div className="flex items-center gap-4">
                      <div className="border border-gray-200 rounded-md p-4 w-32 h-32 flex items-center justify-center">
                        {logoPreview ? (
                          <img
                            src={logoPreview} 
                            alt="Logo Preview" 
                            className="max-w-full max-h-full object-contain"
                            width={128}
                            height={128}
                          />
                        ) : (
                          <div className="text-sm text-gray-400">No logo</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input 
                          type="file" 
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                          onChange={handleLogoChange}
                        />
                        <FormDescription className="mt-2">
                          Recommended size: 512x512px. Max file size: 5MB.
                          Supported formats: JPG, PNG, SVG.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                  <CardDescription>
                    Configure how your hospital appears in search results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your hospital for search engines..." 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This description appears in search engine results. Keep it under 160 characters for best results.
                          <span className="mt-1 text-right text-xs text-muted-foreground">
                            {field.value?.length || 0}/500 characters
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}