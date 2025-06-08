import { z } from "zod"; // Update this path accordingly

export type ImageInfo = {
  id: string;
  url: string;
};

export type Category = {
  id: string;
  name: string;
};
export type CategoryResponse = {
  id: string;
  name: string;
  blogsCount: string;
};

export type BaseNewsAndEvents = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  summary: string;
  featuredImage: ImageInfo;
  coverImage: ImageInfo | null;
  category: Category;
  content: string;
  featuredImageId: string;
  categoryId: string;
};

export type PaginationMeta = {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type NewsAndEventsResponse = {
  data: BaseNewsAndEvents[];
  meta: PaginationMeta;
};

export const CreateBlogSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(10, { message: "Title must be between 10 and 100 characters" })
    .max(100, { message: "Title must be between 10 and 100 characters" }),

  summary: z
    .string({
      required_error: "Summary is required",
      invalid_type_error: "Summary must be a string",
    })
    .min(100, { message: "Summary must be between 100 and 300 characters" })
    .max(300, { message: "Summary must be between 100 and 300 characters" }),

  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Content must be a string",
    })
    .min(300, { message: "Content must be between 300 and 10000 characters" })
    .max(10000, {
      message: "Content must be between 300 and 10000 characters",
    }),

  featuredImageId: z
    .string({
      required_error: "Featured image must be provided",
      invalid_type_error: "Featured image must be provided",
    })
    .uuid({ message: "Featured image must be provided" }),

  coverImageId: z
    .string({ invalid_type_error: "Cover image ID must be a UUID string" })
    .uuid({ message: "Cover image ID must be a valid UUID" })
    .nullish(),

  categoryId: z
    .string({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a UUID string",
    })
    .uuid({ message: "Category ID must be a valid UUID" }),
});

export type NewsEventFormSchemaValues = z.infer<typeof CreateBlogSchema>;

export const newsEventFormDefaultValues: Partial<NewsEventFormSchemaValues> = {
  title: "",
  categoryId: "",
  featuredImageId: undefined,
  coverImageId: null,
  summary: "",
  content: "",
};
