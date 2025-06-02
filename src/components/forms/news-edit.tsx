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
import { TiptapEditor } from "@/components/editor/tiptap-editor";
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
  CreateBlogSchema,
  newsEventFormDefaultValues,
  type NewsEventFormSchemaValues,
} from "@/schema/news-type";
import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/utils/react-query";
import { CategorySelect } from "../helpers/single-select";
import type { ImageResponse } from "@/schema/global.schema";

export default function NewsEventEditPage({
  defaultValues,
  uploadedFeaturedImage,
  uploadedCoverImage,
}: {
  defaultValues?: NewsEventFormSchemaValues;

  uploadedFeaturedImage?: ImageResponse | null;
  uploadedCoverImage?: ImageResponse | null;
}) {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  const { mutate: createBlog, isPending } = useAppMutation({
    type: defaultValues ? "patch" : "post",
    url: defaultValues ? `/blogs/${params.id}` : "/blogs", // Fixed: was "/doctors"
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["blogs", params.id] });
      navigate("/news");
    },
  });

  const form = useForm<NewsEventFormSchemaValues>({
    resolver: zodResolver(CreateBlogSchema),
    defaultValues: defaultValues || newsEventFormDefaultValues, // Use provided defaultValues
  });

  function onSubmit(data: NewsEventFormSchemaValues) {
    createBlog({ data });
  }

  function handleContentChange(html: string) {
    form.setValue("content", html);
    // Trigger validation after setting content
    form.trigger("content");
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the details for this item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Title<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Summary<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief summary (max 200 characters)"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary that appears in listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Wrap CategorySelect in FormField for proper form integration */}
                  <CategorySelect />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    Content<span className="text-red-500">*</span>
                  </CardTitle>
                  <CardDescription>
                    Write the full content for this item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <TiptapEditor
                            content={form.getValues("content")}
                            onChange={handleContentChange}
                            placeholder="Write the content here..."
                            className="min-h-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>
                    Upload an image for this item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featuredImageId"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            currentImage={uploadedFeaturedImage}
                            name="featuredImageId"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                  <CardDescription>
                    Upload cover image for this blogs
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
                            currentImage={uploadedCoverImage}
                            name="coverImageId"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="pt-4 flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isPending}
                    >
                      {isPending ? "Saving..." : "Save Blog"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link to="/news">Cancel</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
