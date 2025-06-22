"use client";

import { EFaqType } from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { FaqItem } from "@/schema/faqs";
import {  useFAQs } from "./hooks/useFAQ";
import { FAQCategory } from "./FAQCategory";
import PaginationComponent from "@/components/pagination/pagination";

interface FAQListProps {
  onEdit: (faq: FaqItem) => void;
}

export function FAQList({ onEdit }: FAQListProps) {
  const { data: response, isLoading, error, } = useFAQs();
  console.log(isLoading, response, error);

 

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load FAQs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!response || !response.data || response.data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No FAQs found. Add your first FAQ to get started.
        </p>
      </div>
    );
  }

  const { data: faqs, meta } = response;

  return (
    <div>
      <div className="mb-6 container mx-auto space-y-6">
        {Object.values(EFaqType).map((category) => {
          const categoryFAQs = faqs.filter((faq) => faq.category === category);

          return categoryFAQs.map((faq) => (
            <FAQCategory
              key={faq.id}
              faq={faq}
              onEdit={onEdit}
            />
          ));
        })}
      </div>
      <PaginationComponent meta={meta} />
    </div>
  );
}
