"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AppointmentBookingSection from "./components/appointment-card";

import AboutPage from "./components/about/AboutPage";

const formSchema = z.object({
  heading: z
    .string()
    .min(1, "Heading is required")
    .max(100, "Heading must not exceed 100 characters"),
  subheading: z
    .string()
    .max(200, "Subheading must not exceed 200 characters")
    .optional(),
  buttonText: z
    .string()
    .max(50, "Button text must not exceed 50 characters")
    .optional(),
  buttonLink: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HeroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [heroImage, setHeroImage] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: "Providing Quality Healthcare For The Entire Family",
      subheading:
        "Our team of medical professionals with years of experience are ready to serve you.",
      buttonText: "Book an Appointment",
      buttonLink: "/appointment",
      content:
        "<p>We are dedicated to providing the highest quality healthcare services to our patients. Our state-of-the-art facilities and compassionate care ensure that you and your family receive the best medical attention possible.</p>",
    },
  });

  function onSubmit(data: FormValues) {
    setIsLoading(true);

    // In a real app, you would upload the image and save the form data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    console.log(data, heroImage);
  }

  function handleContentChange(html: string) {
    form.setValue("content", html);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Page Section</h1>
        <p className="text-muted-foreground">
          Update the hero section of your page
        </p>
      </div>

      <Tabs defaultValue="home" className="mb-6 ">
        <TabsList className="mb-6 ">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="news">News and Events</TabsTrigger>
        </TabsList>

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
                      name="heading"
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
                      name="subheading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subheading</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a subheading"
                              {...field}
                            />
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
                      name="content"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

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
                  <h3 className="text-sm font-medium mb-2">
                    Current Hero Image
                  </h3>
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
                            {form.getValues("heading")}
                          </h1>
                          <p className="text-lg mb-6 opacity-90">
                            {form.getValues("subheading")}
                          </p>
                          <div
                            className="mb-6 prose prose-sm prose-invert"
                            dangerouslySetInnerHTML={{
                              __html: form.getValues("content") || "",
                            }}
                          />
                          <Button size="lg">
                            {form.getValues("buttonText") ||
                              "Book an Appointment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <TabsContent className="py-12" value="home">
          <Card>
            <CardContent>
              {/* Add your home page content here */}
              <div className="py-4">
                {/* enter your similar logic here for appointment booking section */}
                <AppointmentBookingSection />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="py-12" value="about">
          <Card>
            <CardContent>
              {/* Add your about page content here */}
              <div className="py-4">
                {/* enter your similar logic here for appointment booking section */}
                <AboutPage />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
