"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { FileUpload } from "@/components/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CreateTestimonialSchema,
  testimonialFormDefaultValues,
  type CreateTestimonialType,
} from "@/schema/testmonial-schema";
import type { ImageResponse } from "@/schema/global.schema";
import { useAppMutation } from "@/utils/react-query";

export default function TestimonialForm({
  defaultValues,
  uploadedImage,
}: {
  defaultValues?: CreateTestimonialType;
  uploadedImage?: ImageResponse | null;
}) {
  const navigate = useNavigate();
  const params = useParams();

  const { mutateAsync: createTestimonial, isPending } = useAppMutation({
    type: defaultValues ? "patch" : "post",
    url: defaultValues ? `/testimonials/${params.id}` : "/testimonials", // Fixed: was "/doctors"
    queryKey: ["testimonials"],
  });

  const form = useForm<CreateTestimonialType>({
    resolver: zodResolver(CreateTestimonialSchema),
    defaultValues: defaultValues || testimonialFormDefaultValues, // Use provided defaultValues
  });

  async function onSubmit(data: CreateTestimonialType) {
    await createTestimonial({ data });
    navigate("/testimonials");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Photo</CardTitle>
                    <CardDescription>
                      Upload a photo for the testimonial
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="personImageId"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              currentImage={uploadedImage}
                              name="personImageId"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Testimonial Information</CardTitle>
                  <CardDescription>
                    Enter the details of the testimonial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="personName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <Input placeholder="Company name" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <Input
                            placeholder="Enter rating"
                            type="number"
                            {...field}
                            min={1}
                            max={5}
                            step={0.5}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="personMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the patient's testimonial here..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the comment you want to give the doctor
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/testimonials">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Testimonial"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
