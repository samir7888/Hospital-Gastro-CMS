import { EFaqType } from "@/types/enums";
import { z } from "zod";

export type FaqItem = {
  id: string;
  title: string;
  description: string;
  category: EFaqType;
};

export type PaginationMeta = {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type FaqResponse = {
  data: FaqItem[];
  meta: PaginationMeta;
};

export const faqSchema = z.object({
  title: z
    .string()
    .min(10, "Question must be between 10 and 100 characters long")
    .max(100, "Question must be between 10 and 100 characters long"),
  description: z
    .string()
    .min(100, "Answer must be between 100 and 500 characters")
    .max(500, "Answer must be between 100 and 500 characters"),
  category: z.nativeEnum(EFaqType),
});

export type FaqSchemaValues = z.infer<typeof faqSchema>;
export const faqFormDefaultValues: Partial<FaqSchemaValues> = {
  title: "",
  description: "",
  category: EFaqType.General,
};
