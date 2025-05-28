"use client";

import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/schema/faqs";

interface FAQItemProps {
  faq: FaqItem;
  onEdit: (faq: FaqItem) => void;
  onDelete: (id: string) => void;
}

export function FAQItem({ faq, onEdit, onDelete }: FAQItemProps) {
  return (
    <div className="border rounded-md">
      <div className="flex items-center justify-between p-3 bg-muted">
        <h4 className="font-medium">{faq.title}</h4>
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(faq)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(faq.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>
      <div
        className="p-3 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: faq.description }}
      />
    </div>
  );
}