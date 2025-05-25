"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Plus, Trash2, CopyPlus, Move } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Toast } from "@radix-ui/react-toast";

const featureSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title must not exceed 100 characters"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
});

const formSchema = z.object({
  sectionTitle: z.string().min(1, "Section title is required"),
  sectionDescription: z.string().optional(),
  features: z.array(featureSchema).min(1, "At least one feature is required"),
});

type FeatureFormValues = z.infer<typeof formSchema>;

const defaultFeature = {
  title: "",
  description: "<p>Enter feature description here</p>",
  icon: "",
};

export default function FeaturesPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sectionTitle: "Why Choose Our Hospital",
      sectionDescription: "We are committed to providing the highest quality healthcare with compassion and respect for all.",
      features: [
        {
          id: "1",
          title: "Experienced Doctors",
          description: "<p>Our team consists of highly qualified doctors with years of experience in their respective fields.</p>",
          icon: "users",
        },
        {
          id: "2",
          title: "Modern Equipment",
          description: "<p>We use the latest medical equipment and technology to provide the best care possible.</p>",
          icon: "stethoscope",
        },
        {
          id: "3",
          title: "24/7 Emergency Care",
          description: "<p>Our emergency department is open 24 hours a day, 7 days a week to handle any medical emergency.</p>",
          icon: "clock",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "features",
  });

  function onSubmit(data: FeatureFormValues) {
    setIsLoading(true);
    
    // In a real app, you would save the form data to your backend
    setTimeout(() => {
      setIsLoading(false);
      Toast({
        title: "Features updated",
        
      });
    }, 1000);
    
  }

  function handleDescriptionChange(value: string, index: number) {
    form.setValue(`features.${index}.description`, value);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Features Section</h1>
        <p className="text-muted-foreground">
          Update the "Why Choose Us" features section of your website
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Section Details</CardTitle>
              <CardDescription>
                The main heading and description for the features section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sectionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Why Choose Us" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main heading for the features section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sectionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Description</FormLabel>
                    <FormControl>
                      <Input placeholder="A brief description of your features" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short description that appears below the heading
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Features</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(defaultFeature)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Feature
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
              {fields.map((field, index) => (
                <AccordionItem value={field.id || index.toString()} key={field.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span>{form.getValues(`features.${index}.title`) || "New Feature"}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                    <FormField
                      control={form.control}
                      name={`features.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feature Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Feature title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feature Description</FormLabel>
                          <FormControl>
                            <TiptapEditor 
                              content={field.value} 
                              onChange={(html) => handleDescriptionChange(html, index)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`features.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., stethoscope, heart, users" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the name of a Lucide icon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => move(index, index - 1)}
                          >
                            <Move className="h-4 w-4 rotate-90" />
                            <span className="sr-only">Move up</span>
                          </Button>
                        )}
                        {index < fields.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => move(index, index + 1)}
                          >
                            <Move className="h-4 w-4 -rotate-90" />
                            <span className="sr-only">Move down</span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentFeature = form.getValues(`features.${index}`);
                            append({
                              ...currentFeature,
                              id: undefined,
                              title: `${currentFeature.title} (Copy)`,
                            });
                          }}
                        >
                          <CopyPlus className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {fields.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-4">No features added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append(defaultFeature)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Your First Feature
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}