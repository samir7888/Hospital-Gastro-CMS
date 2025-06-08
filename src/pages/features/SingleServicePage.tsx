"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { FileUpload } from "@/components/file-upload";
import {
  serviceFormDefaultValues,
  serviceSchema,
  type ServiceSchemaType,
  type SingleServices,
} from "@/schema/services-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { useParams, useNavigate } from "react-router-dom";

export default function ServicesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  // Fetch existing service data if editing
  const { data: existingService, isLoading: isLoadingService } =
    useAppQuery<SingleServices>({
      url: `/services/${id}`,
      queryKey: ["services", id!],
      options: {
        enabled: !!id,
      },
    });

  const form = useForm<ServiceSchemaType>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceFormDefaultValues,
  });

  // Reset form when existing service data is loaded
  useEffect(() => {
    if (existingService && !isLoadingService) {
      form.reset({
        title: existingService.title,
        summary: existingService.summary,
        description: existingService.description || "", // Ensure it's not undefined
        coverImageId: existingService.coverImage?.id || "",
      });
    }
  }, [existingService, isLoadingService, form]);

  // Create/Update service mutation
  const { mutate: saveService, isPending } = useAppMutation({
    type: id ? "patch" : "post",
    url: "/services",
    
  });

  function onSubmit(data: ServiceSchemaType) {
    if (id) {
      // For updates, pass the ID
      saveService({ data, id });
    } else {
      // For creation, just pass the data
      saveService({ data });
    }
  }

  if (isLoadingService && id) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading service...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? "Edit Service" : "Create Service"}
        </h1>
        <p className="text-muted-foreground">
          {id ? "Update your service details" : "Create a new service"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Basic information about your service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main title of your service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of your service"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief summary that appears in service listings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          key={`editor-${existingService?.id || "new"}-${field.value ? 'loaded' : 'empty'}`} // Better key for re-rendering
                          content={field.value || ""} // Ensure content is never undefined
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          placeholder="Enter detailed description of your service..."
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed description of your service with rich text
                        formatting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Cover Photo</CardTitle>
              <CardDescription>
                Upload a professional photo for your service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="coverImageId"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        currentImage={existingService?.coverImage}
                        name="coverImageId"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/services")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : id
                ? "Update Service"
                : "Create Service"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}