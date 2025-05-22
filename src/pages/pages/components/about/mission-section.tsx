"use client";


import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface MissionVisionValues {
  mission: string;
  vision: string;
}

interface MissionVisionSectionProps {
  form: UseFormReturn<MissionVisionValues>;
  onSubmit: (data: MissionVisionValues) => void;
  isLoading: boolean;
}

export default function MissionVisionSection({
  form,
  onSubmit,
  isLoading,
}: MissionVisionSectionProps) {
  const handleMissionChange = (html: string) => {
    form.setValue("mission", html);
  };

  const handleVisionChange = (html: string) => {
    form.setValue("vision", html);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission & Vision</CardTitle>
        <CardDescription>
          Update your hospital's mission and vision statements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mission"
              render={() => (
                <FormItem>
                  <FormLabel>Our Mission</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={form.getValues("mission") || ""}
                      onChange={handleMissionChange}
                      placeholder="Enter your hospital's mission statement..."
                    />
                  </FormControl>
                  <FormDescription>
                    Your mission statement describes your hospital's purpose and goals
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vision"
              render={() => (
                <FormItem>
                  <FormLabel>Our Vision</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={form.getValues("vision") || ""}
                      onChange={handleVisionChange}
                      placeholder="Enter your hospital's vision statement..."
                    />
                  </FormControl>
                  <FormDescription>
                    Your vision statement describes your hospital's aspirations for the future
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
  );
}