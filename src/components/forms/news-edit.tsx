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
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["news", "event"]),
  date: z.date(),
  time: z.string().optional(),
  location: z.string().optional(),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(200, "Excerpt must not exceed 200 characters"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean(),
});

type NewsEventFormValues = z.infer<typeof formSchema>;

// Mock data for news and events
const newsAndEvents = {
  "1": {
    id: "1",
    title: "New Cardiac Center Opening",
    type: "news",
    date: new Date("2025-05-15"),
    image:
      "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    excerpt:
      "Our hospital is proud to announce the opening of a new state-of-the-art cardiac center.",
    content:
      "<p>Our hospital is proud to announce the opening of a new state-of-the-art cardiac center. The center will provide comprehensive cardiac care including diagnostics, interventions, and rehabilitation services.</p><p>The facility features the latest medical technology and will be staffed by our team of expert cardiologists and cardiac surgeons.</p>",
    published: true,
  },
  "2": {
    id: "2",
    title: "Annual Health Awareness Camp",
    type: "event",
    date: new Date("2025-06-20"),
    time: "9:00 AM - 4:00 PM",
    location: "Hospital Grounds",
    image:
      "https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    excerpt:
      "Join us for our annual health awareness camp featuring free health checkups and consultations.",
    content:
      "<p>Join us for our annual health awareness camp featuring free health checkups and consultations. The event will include:</p><ul><li>Blood pressure screening</li><li>Blood sugar testing</li><li>BMI assessment</li><li>Nutrition counseling</li><li>Dental checkups</li></ul><p>Medical professionals will be available to provide guidance on maintaining good health and preventing common diseases.</p>",
    published: true,
  },
  new: {
    id: "new",
    title: "",
    type: "news",
    date: new Date(),
    time: "",
    location: "",
    image: "",
    excerpt: "",
    content: "<p></p>",
    published: false,
  },
};

export default function NewsEventEditPage() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const item =
    newsAndEvents[id as keyof typeof newsAndEvents] || newsAndEvents["new"];
  const [isLoading, setIsLoading] = useState(false);
  const [itemImage, setItemImage] = useState<File | null>(null);

  const form = useForm<NewsEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item.title,
      type: item.type as "news" | "event",
      date: item.date,
      excerpt: item.excerpt,
      content: item.content,
      published: item.published ?? false,
    },
  });

  // Watch the type field to conditionally render form fields
  const itemType = form.watch("type");

  function onSubmit(data: NewsEventFormValues) {
    setIsLoading(true);

    // In a real app, you would upload the image and save the form data
    setTimeout(() => {
      setIsLoading(false);
      // toast({
      //   title: isNew ? "Item added" : "Item updated",
      //   description: isNew
      //     ? "The item has been added successfully."
      //     : "The item has been updated successfully.",
      // });
    }, 1000);

    console.log(data, itemImage);
  }

  function handleContentChange(html: string) {
    form.setValue("content", html);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-4">
          <Link to="/news">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to News & Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "Add New Item" : `Edit ${item.title}`}
          </h1>
          <p className="text-muted-foreground">
            {isNew
              ? "Create a new news article or event"
              : "Update the item's information"}
          </p>
        </div>
      </div>

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
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="news" id="news" />
                              <label
                                htmlFor="news"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                News Article
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="event" id="event" />
                              <label
                                htmlFor="event"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Event
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            {itemType === "news"
                              ? "Publication date"
                              : "Event date"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {itemType === "event" && (
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g., 9:00 AM - 5:00 PM"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The time when the event takes place
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {itemType === "event" && (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Hospital Auditorium"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Where the event will take place
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
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
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Content</CardTitle>
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
                  <FileUpload
                    onFileChange={setItemImage}
                    currentImage={!isNew ? item.image : undefined}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>
                    Control the publication status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            When checked, this item will be visible on the
                            website
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Saving..."
                        : isNew
                        ? "Create Item"
                        : "Update Item"}
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
