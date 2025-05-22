"use client";

import type{ UseFormReturn } from "react-hook-form";
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

interface StatsValues {
  yearsOfExperience: number;
  patientsAnnually: number;
  awardWinningDoctors: number;
  emergencyCare: string;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Statistics</CardTitle>
        <CardDescription>
          Update the key statistics displayed in your about section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="E.g., 35"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of years your hospital has been operating
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientsAnnually"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patients Annually</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="E.g., 50000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of patients served annually
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="awardWinningDoctors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award-Winning Doctors</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="E.g., 200"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of award-winning doctors in your hospital
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyCare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Care</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., 24/7" {...field} />
                    </FormControl>
                    <FormDescription>
                      Emergency care availability
                    </FormDescription>
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
  );
}