import { z } from "zod";
import { imageSchema, type ImageResponse } from "./global.schema";

export const featureSchema = z.object({
  title: z.string().min(3, "Title must be between 3 and 50 characters").max(50, "Title must be between 3 and 50 characters"),
  description: z.string().min(10, "Description must be between 10 and 300 characters").max(300, "Description must be between 10 and 300 characters"),
  imageId: imageSchema,
});

export type FeatureSchemaType = z.infer<typeof featureSchema>;

export const featureFormDefaultValues: FeatureSchemaType = {
  title: "",
  description: "",
  imageId: null,
};
export interface Feature {
  id: string;
  title: string;
  description: string;
  image: ImageResponse;
}

export type FeatureResponse = Feature[];
