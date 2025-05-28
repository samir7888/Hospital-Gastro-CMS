"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FAQForm } from "./FAQForm";
// import { useUpdateFAQ } from "@/hooks/useFAQ";
import type { FaqItem, FaqSchemaValues } from "@/schema/faqs";
import { useUpdateFAQ } from "./hooks/useFAQ";

interface EditFAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: FaqItem | null;
}

export function EditFAQDialog({ open, onOpenChange, faq }: EditFAQDialogProps) {
  const updateFAQ = useUpdateFAQ();

  function handleSubmit(data: FaqSchemaValues) {
    if (!faq) return;

    updateFAQ.mutate(
      { data, id: faq.id },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  const defaultValues = faq
    ? {
        title: faq.title,
        description: faq.description,
        category: faq.category,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit FAQ</DialogTitle>
          <DialogDescription>
            Update this frequently asked question and answer
          </DialogDescription>
        </DialogHeader>

        <FAQForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          defaultValues={defaultValues}
          isSubmitting={updateFAQ.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
