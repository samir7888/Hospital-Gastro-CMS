import React from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FileUpload } from "@/components/file-upload";
import { useForm } from "react-hook-form";
import {
  serviceFormDefaultValues,
  serviceSchema,
  type ServiceSchemaType,
  type ServicesResponse,
} from "@/schema/services-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
const ContentSection = () => {
  const form = useForm<ServiceSchemaType>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceFormDefaultValues,
  });

   const { mutate: createService, isPending } = useAppMutation({
      type: defaultValues ? "patch" : "post",
      url: defaultValues ? `/services` : "/services", // Fixed: was "/doctors"
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["services"] });
        navigate("/news");
      },
    });
  return (
    <div>
      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>
                Update the text content for your hero section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a heading" {...field} />
                        </FormControl>
                        <FormDescription>
                          The main heading that appears in your hero section
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
                        <FormLabel>Subheading</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a subheading" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short description that appears below the heading
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={() => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <TiptapEditor
                            content={form.getValues("content") || ""}
                            onChange={handleContentChange}
                            placeholder="Enter detailed content for the hero section..."
                          />
                        </FormControl>
                        <FormDescription>
                          Additional content that appears in the hero section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


{/* Button data */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buttonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Book an Appointment"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buttonLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., /appointment"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>
                Upload an image for your hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Current Hero Image</h3>
                <AspectRatio
                  ratio={16 / 9}
                  className="bg-muted rounded-md overflow-hidden"
                >
                  <img
                    src="https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg"
                    alt="Current hero"
                    className="object-cover"
                    width={500}
                    height={300}
                  />
                </AspectRatio>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Upload New Image</h3>
                <FileUpload onFileChange={setHeroImage} />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setIsLoading(true);

                    setTimeout(() => {
                      setIsLoading(false);
                      // toast({
                      //   title: "Hero image updated",
                      //   description: "The hero image has been updated successfully.",
                      // });
                    }, 1000);
                  }}
                  disabled={isLoading || !heroImage}
                >
                  {isLoading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Preview how your hero section will look on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow">
                <div className="relative h-[400px]">
                  <img
                    src="https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg"
                    alt="Hero preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={500}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center">
                    <div className="container mx-auto px-4 py-6 md:max-w-screen-xl">
                      <div className="max-w-2xl text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                          {form.getValues("title")}
                        </h1>
                        <p className="text-lg mb-6 opacity-90">
                          {form.getValues("summary")}
                        </p>
                        <div
                          className="mb-6 prose prose-sm prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: form.getValues("description") || "",
                          }}
                        />
                        {/* <Button size="lg">
                          {form.getValues("buttonText") ||
                            "Book an Appointment"}
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentSection;
