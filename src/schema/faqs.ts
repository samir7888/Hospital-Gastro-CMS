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
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  category: z.nativeEnum(EFaqType),
});

export type FaqSchemaValues = z.infer<typeof faqSchema>;
export const faqFormDefaultValues: Partial<FaqSchemaValues> = {
  title: "",
  description: "",
  category: EFaqType.Billing,
};
