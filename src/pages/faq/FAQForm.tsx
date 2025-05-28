"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  Form,
  FormControl,
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
import {
  faqFormDefaultValues,
  faqSchema,
  type FaqSchemaValues,
} from "@/schema/faqs";
import { EFaqType } from "@/types/enums";

interface FAQFormProps {
  onSubmit: (data: FaqSchemaValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<FaqSchemaValues>;
  isSubmitting?: boolean;
}

export function FAQForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
}: FAQFormProps) {
  const form = useForm<FaqSchemaValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: defaultValues || faqFormDefaultValues,
  });

  function handleAnswerChange(html: string) {
    form.setValue("description", html);
  }

  function getFaqTypeLabel(value: EFaqType): string {
    const labels: Record<EFaqType, string> = {
      [EFaqType.General]: "General",
      [EFaqType.Doctor]: "Doctor",
      [EFaqType.Patient]: "Patient",
      [EFaqType.Insurance]: "Insurance",
      [EFaqType.Billing]: "Billing",
      [EFaqType.Facility]: "Facility",
      [EFaqType.EmergencyCare]: "Emergency Care",
    };
    return labels[value];
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input placeholder="Enter the question" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(EFaqType).map((value) => (
                    <SelectItem value={value} key={value}>
                      {getFaqTypeLabel(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <TiptapEditor
                  content={form.getValues("description") || ""}
                  onChange={handleAnswerChange}
                  placeholder="Enter the answer..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save FAQ"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
