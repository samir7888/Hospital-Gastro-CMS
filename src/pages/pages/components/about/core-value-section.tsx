"use client";

import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";

interface CoreValue {
  title: string;
  description: string;
}

interface CoreValuesValues {
  coreValues: CoreValue[];
}

interface CoreValuesSectionProps {
  form: UseFormReturn<CoreValuesValues>;
  onSubmit: (data: CoreValuesValues) => void;
  isLoading: boolean;
}

export default function CoreValuesSection({
  form,
  onSubmit,
  isLoading,
}: CoreValuesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    name: "coreValues",
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Values</CardTitle>
        <CardDescription>
          Define the core values that guide your hospital's practices (maximum 10 values)
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
                  disabled={fields.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Value
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-md p-4 space-y-4 bg-white">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`coreValues.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g., Excellence"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Title for this core value (3-100 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`coreValues.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe this core value and how it guides your hospital's practices..."
                                {...field}
                                rows={3}
                              />
                            </FormControl>
                            <FormDescription>
                              Detailed description of this core value (10-500 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No core values added yet. Click "Add Value" to get started.</p>
                </div>
              )}

              {fields.length >= 10 && (
                <p className="text-sm text-amber-600">
                  Maximum of 10 core values reached.
                </p>
              )}
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