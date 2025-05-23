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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Toast } from "@radix-ui/react-toast";
import { Link, useParams } from "react-router-dom";
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  rating: z.string().min(1, "Rating is required"),
  comment: z
    .string()
    .min(1, "Testimonial text is required")
    .max(500, "Testimonial must not exceed 500 characters"),
});
type TestimonialFormValues = z.infer<typeof formSchema>;
const testimonials = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    image:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: "5",
    department: "Cardiology",
    comment:
      "The care I received at the cardiology department was exceptional. Dr. Smith and his team were thorough, compassionate, and took the time to explain everything to me. I wouldn't go anywhere else for my heart care.",
  },
  "2": {
    id: "2",
    name: "David Wilson",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: "4",
    department: "Orthopedics",
    comment:
      "After my knee replacement surgery, the recovery process was made much easier thanks to the excellent physical therapy team. They were professional, motivating, and helped me achieve a full recovery.",
  },
  new: {
    id: "new",
    name: "",
    image: "",
    rating: "5",
    department: "",
    comment: "",
  },
};

export default function TestimonialForm() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const testimonial = testimonials[id as keyof typeof testimonials]  || testimonials["new"];
  const [isLoading, setIsLoading] = useState(false);
  const [testimonialImage, setTestimonialImage] = useState<File | null>(null);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial.name,
      department: testimonial.department,
      rating: testimonial.rating,
      comment: testimonial.comment,
    },
  });

  function onSubmit(data: TestimonialFormValues) {
    setIsLoading(true);

    // In a real app, you would upload the image and save the form data
    setTimeout(() => {
      setIsLoading(false);
      Toast({
        title: isNew ? "Testimonial added" : "Testimonial updated",
      });
    }, 1000);

    console.log(data, testimonialImage);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-4">
          <Link to="/testimonials">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Testimonials
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "Add New Testimonial" : `Edit Testimonial`}
          </h1>
          <p className="text-muted-foreground">
            {isNew
              ? "Add a new patient testimonial"
              : "Update this testimonial"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Patient Photo</CardTitle>
              <CardDescription>
                Upload a photo of the patient (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <FileUpload
              
                onFileChange={setTestimonialImage}
                currentImage={!isNew ? testimonial.image : undefined}
              /> */}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
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
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cardiology">
                                Cardiology
                              </SelectItem>
                              <SelectItem value="Neurology">
                                Neurology
                              </SelectItem>
                              <SelectItem value="Pediatrics">
                                Pediatrics
                              </SelectItem>
                              <SelectItem value="Orthopedics">
                                Orthopedics
                              </SelectItem>
                              <SelectItem value="Dermatology">
                                Dermatology
                              </SelectItem>
                              <SelectItem value="Oncology">Oncology</SelectItem>
                              <SelectItem value="Gynecology">
                                Gynecology
                              </SelectItem>
                              <SelectItem value="Dental">Dental</SelectItem>
                              <SelectItem value="Emergency">
                                Emergency
                              </SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5">
                                5 Stars (Excellent)
                              </SelectItem>
                              <SelectItem value="4">4 Stars (Good)</SelectItem>
                              <SelectItem value="3">
                                3 Stars (Average)
                              </SelectItem>
                              <SelectItem value="2">2 Stars (Poor)</SelectItem>
                              <SelectItem value="1">
                                1 Star (Very Poor)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comment"
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
                          The patient's feedback about their experience (max 500
                          characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard/testimonials">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : isNew
                    ? "Add Testimonial"
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
