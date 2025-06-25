import { ELanguages, ESpecialization, EWeekDays } from "@/types/enums";
import { NAME_WITH_SPACE_REGEX, PHONE_NUMBER_REGEX } from "@/utils/constant";
import { z } from "zod";
import { imageSchema, type ImageResponse } from "./global.schema";

export type Staff = {
  id: string;
  createdAt: string;
  name: string;
  specialization: ESpecialization;
  experience: number;
  availability: EWeekDays[];
  email: string;
  phone: string;
  address: string;
  languagesKnown: ELanguages[];
  degree: string;
  certifications: string[];
  consulation: number;
  profileImage: ImageResponse | null;
};

export type Meta = {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type StaffsResponse = {
  data: Staff[];
  meta: Meta;
};

export type TSingleStaff = Staff & {
  about: string;
};

export const createStaffSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .regex(NAME_WITH_SPACE_REGEX, {
      message: "Name can have only alphabets and spaces",
    })
    .min(3, { message: "Name must be between 3 and 50 characters" })
    .max(50, { message: "Name must be between 3 and 50 characters" }),

  
  profileImageId: imageSchema,

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Email must be a valid email address" }),

  phone: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone must be a string",
    })
    .regex(PHONE_NUMBER_REGEX, {
      message: "Phone must be a valid E.164 phone number",
    }),

  address: z
    .string({
      required_error: "Address is required",
      invalid_type_error: "Address must be a string",
    })
    .min(3, { message: "Address must be between 3 and 100 characters" })
    .max(100, { message: "Address must be between 3 and 100 characters" }),

 


});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const staffFormDefaultValues: Partial<CreateStaffInput> = {
  name: "",
  email: "",
  phone: "",
  address: "",
  profileImageId: null,
};
