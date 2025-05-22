"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

const coreValueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const coreValuesSchema = z.object({
  values: z.array(coreValueSchema).min(1, "At least one core value is required"),
});

type CoreValuesFormValues = z.infer<typeof coreValuesSchema>;

export default function CoreValuesSection() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CoreValuesFormValues>({
    resolver: zodResolver(coreValuesSchema),
    defaultValues: {
      values: [
        {
          title: "Excellence",
          description: "We strive for excellence in every aspect of patient care, maintaining the highest standards of medical practice and professional conduct.",
        },
        {
          title: "Compassion",
          description: "We treat each patient with kindness, empathy, and respect, understanding their unique needs and concerns.",
        },
        {
          title: "Innovation",
          description: "We embrace advanced medical technologies and innovative treatments to provide the best possible care for our patients.",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "values",
    control: form.control,
  });

  function onSubmit(data: CoreValuesFormValues) {
    setIsLoading(true);
    // In a real app, you would save the form data to your API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Core values saved:", data);
    }, 1000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Values</CardTitle>
        <CardDescription>
          Define the core values that guide your hospital's practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Values</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title: "", description: "" })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Value
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-4 space-y-4 bg-white">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`values.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Excellence"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`values.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe this core value..."
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
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
  );
}