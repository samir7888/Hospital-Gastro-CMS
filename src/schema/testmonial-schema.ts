
import { z } from "zod";
import { type ImageResponse } from "./global.schema";





export interface ITestimonial {
  id: string;
  personName: string;
  personCompany: string;
  personRating: number;
  personMessage: string;    
 personImage: ImageResponse ;
}

export type TestimonialResponse = ITestimonial[];






export const CreateTestimonialSchema = z.object({
  personName: z
    .string({
      required_error: 'Person name is required',
      invalid_type_error: 'Person name must be a string',
    })
    .min(3, { message: 'Name must be between 3 and 50 characters' })
    .max(50, { message: 'Name must be between 3 and 50 characters' }),

  personCompany: z
    .string({
      invalid_type_error: 'Person company must be a string',
    })
    .min(3, { message: 'Name must be between 3 and 50 characters' })
    .max(50, { message: 'Name must be between 3 and 50 characters' })
    .optional(),

  personRating: z
  .coerce
    .number({
      required_error: 'Rating is required',
      invalid_type_error: 'Rating must be a number',
    })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must not exceed 5' }),

  personMessage: z
    .string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string',
    })
    .min(10, { message: 'Message must be between 10 and 1000 characters' })
    .max(1000, { message: 'Message must be between 10 and 1000 characters' }),

  personImageId:  z.string({
      required_error: "Person image must be provided",
      invalid_type_error: "Person image must be provided",
    })
    .uuid({ message: "Person image must be provided" }),

});

export type CreateTestimonialType = z.infer<typeof CreateTestimonialSchema>;

export const testimonialFormDefaultValues: Partial<CreateTestimonialType> = {
  personName: '',
  personCompany: '',
  personRating: undefined,
  personMessage: '',
  personImageId: undefined,
};