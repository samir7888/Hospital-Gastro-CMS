import { z } from "zod";
import { imageSchema } from "./global.schema";



export type ServiceCoverImage = {
  id: string;
  url: string;
};

export type Services = {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  coverImage: ServiceCoverImage;
};
export type SingleServices = {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  description:string;
  coverImage: ServiceCoverImage;
};

export type PaginationMeta = {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ServicesResponse = {
  data: Services[];
  meta: PaginationMeta;
};




export const serviceSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(3, { message: 'Title must be between 3 and 100 characters' })
    .max(100, { message: 'Title must be between 3 and 100 characters' }),

  summary: z
    .string({
      required_error: 'Summary is required',
      invalid_type_error: 'Summary must be a string',
    })
    .min(100, { message: 'Summary must be between 100 and 300 characters' })
    .max(300, { message: 'Summary must be between 100 and 300 characters' }),

  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .min(500, { message: 'Description must be between 500 and 10000 characters' })
    .max(10000, { message: 'Description must be between 500 and 10000 characters' }),

  coverImageId: imageSchema,
});

// Inferred Type (optional)
export type ServiceSchemaType = z.infer<typeof serviceSchema>;

export const serviceFormDefaultValues: Partial<ServiceSchemaType> = {
  title: "",
  summary: "",
  description: "",
  coverImageId: "",
};