"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FAQForm } from "./FAQForm";
// import { useCreateFAQ } from "@/hooks/useFAQ";
import type { FaqSchemaValues } from "@/schema/faqs";
import { useCreateFAQ } from "./hooks/useFAQ";

interface AddFAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFAQDialog({ open, onOpenChange }: AddFAQDialogProps) {
  const createFAQ = useCreateFAQ();

  function handleSubmit(data: FaqSchemaValues) {
    createFAQ.mutate(
      { data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New FAQ</DialogTitle>
          <DialogDescription>
            Create a new frequently asked question and answer
          </DialogDescription>
        </DialogHeader>

        <FAQForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={createFAQ.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}