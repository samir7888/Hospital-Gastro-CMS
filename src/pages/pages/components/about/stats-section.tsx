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

interface StatisticItem {
  title: string;
  count: number;
}

interface StatsValues {
  statistics: StatisticItem[];
}

interface StatsSectionProps {
  form: UseFormReturn<StatsValues>;
  onSubmit: (data: StatsValues) => void;
  isLoading: boolean;
}

export default function StatsSection({
  form,
  onSubmit,
  isLoading,
}: StatsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    name: "statistics",
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Statistics</CardTitle>
        <CardDescription>
          Update the key statistics displayed in your about section (maximum 10 statistics)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Statistics</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title: "", count: 0 })}
                  disabled={fields.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Statistic
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`statistics.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="E.g., Years of Excellence"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Brief title for this statistic (3-50 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`statistics.${index}.count`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Count</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="E.g., 35"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Numeric value for this statistic
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No statistics added yet. Click "Add Statistic" to get started.</p>
                </div>
              )}

              {fields.length >= 10 && (
                <p className="text-sm text-amber-600">
                  Maximum of 10 statistics reached.
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