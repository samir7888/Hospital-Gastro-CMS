
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
import { Switch } from "@/components/ui/switch";

const appointmentFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  subtitle: z
    .string()
    .max(200, "Subtitle must not exceed 200 characters")
    .optional(),
  emergencyPhoneNumber: z
    .string()
    .min(1, "Emergency phone number is required")
    .max(20, "Phone number must not exceed 20 characters"),
  bookingBenefits: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, "Benefit text is required"),
  })),
  urgentCareText: z
    .string()
    .min(1, "Urgent care text is required")
    .max(100, "Text must not exceed 100 characters"),
  bookingButtonText: z
    .string()
    .max(50, "Button text must not exceed 50 characters")
    .optional(),
  bookingButtonLink: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  showEmergencyContact: z.boolean().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export default function AppointmentBookingSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [benefitsList, setBenefitsList] = useState([
    { id: "1", text: "Quick and easy scheduling" },
    { id: "2", text: "No waiting on hold" },
    { id: "3", text: "24/7 booking availability" },
    { id: "4", text: "Automatic confirmation" },
    { id: "5", text: "Easy rescheduling if needed" },
  ]);
  
  const [newBenefit, setNewBenefit] = useState("");
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      title: "Book an Appointment",
      subtitle: "Schedule your visit with our specialists and receive the care you deserve.",
      emergencyPhoneNumber: "(123) 456-7890",
      bookingBenefits: benefitsList,
      urgentCareText: "Need urgent care?",
      bookingButtonText: "Book Now",
      bookingButtonLink: "/booking",
      showEmergencyContact: true,
    },
  });

  function onSubmit(data: AppointmentFormValues) {
    setIsLoading(true);

    // In a real app, you would save the form data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
  
  function addBenefit() {
    if (newBenefit.trim() === "") return;
    
    const newId = (benefitsList.length + 1).toString();
    const updatedBenefits = [...benefitsList, { id: newId, text: newBenefit }];
    
    setBenefitsList(updatedBenefits);
    form.setValue("bookingBenefits", updatedBenefits);
    setNewBenefit("");
  }
  
  function removeBenefit(id: string) {
    const updatedBenefits = benefitsList.filter(benefit => benefit.id !== id);
    setBenefitsList(updatedBenefits);
    form.setValue("bookingBenefits", updatedBenefits);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointment Booking Section</h1>
        <p className="text-muted-foreground mt-2">
          Update the appointment booking section of your website
        </p>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Section Content</CardTitle>
              <CardDescription>
                Update the main content for your appointment booking section
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
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title" {...field} />
                        </FormControl>
                        <FormDescription>
                          The main heading for your appointment section
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
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a subtitle" {...field} />
                        </FormControl>
                        <FormDescription>
                          A description that appears below the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bookingButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Book Now" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingButtonLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Link</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., /booking" {...field} />
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

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Online Booking Benefits</CardTitle>
              <CardDescription>
                Manage the list of benefits shown for online booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Current Benefits</h3>
                <div className="space-y-2">
                  {benefitsList.map((benefit) => (
                    <div key={benefit.id} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{benefit.text}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeBenefit(benefit.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Add New Benefit</h3>
                <div className="flex gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Enter a new benefit"
                    className="flex-1"
                  />
                  <Button onClick={addBenefit}>Add</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Benefits"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact Section</CardTitle>
              <CardDescription>
                Configure the emergency contact information
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
                    name="showEmergencyContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Display Emergency Contact
                          </FormLabel>
                          <FormDescription>
                            Show or hide the emergency contact section
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urgentCareText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgent Care Text</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Need urgent care?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., (123) 456-7890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Phone number for urgent care or emergencies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Preview how your appointment booking section will look on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow p-6">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold mb-2">{form.getValues("title")}</h2>
                  <div className="h-1 w-24 bg-blue-600 mb-6"></div>
                  
                  <p className="text-lg mb-8">{form.getValues("subtitle")}</p>
                  
                  <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl">📋</span>
                      <h3 className="text-xl font-semibold ml-2">Why Book Online?</h3>
                    </div>
                    
                    <ul className="space-y-3">
                      {benefitsList.map((benefit) => (
                        <li key={benefit.id} className="flex items-center">
                          <span className="mr-2">✓</span>
                          <span>{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {form.getValues("showEmergencyContact") && (
                      <div className="mt-8 p-4 bg-blue-700 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-red-500 rounded-full p-3 mr-4">
                            <span className="text-xl">📞</span>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">{form.getValues("urgentCareText")}</p>
                            <p className="text-xl font-bold">Call our 24/7 emergency line:</p>
                            <p className="text-2xl font-bold">{form.getValues("emergencyPhoneNumber")}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <Button size="lg" className="px-8 py-6 text-lg">
                      {form.getValues("bookingButtonText") || "Book Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}