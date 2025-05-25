import { ELanguages, ESpecialization, EWeekDays } from "@/types/enums";
import { NAME_WITH_SPACE_REGEX, PHONE_NUMBER_REGEX } from "@/utils/constant";
import { z } from "zod";
import { imageSchema, type ImageResponse } from "./global.schema";

export type Doctor = {
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

export type DoctorsResponse = {
  data: Doctor[];
  meta: Meta;
};

export type TSingleDoctor = Doctor & {
  about: string;
};

export const createDoctorSchema = z.object({
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

  specialization: z.nativeEnum(ESpecialization, {
    required_error: "Specialization is required",
    invalid_type_error: "Specialization must be one of the allowed values",
  }),

  experience: z.coerce
    .number({
      required_error: "Experience is required",
      invalid_type_error: "Experience must be a number",
    })
    .min(0, { message: "Experience must be at least 0" })
    .max(100, { message: "Experience must be at most 100" }),

  availability: z
    .array(
      z.nativeEnum(EWeekDays, {
        invalid_type_error: "Each availability entry must be a valid weekday",
      }),
      {
        required_error: "Availability is required",
        invalid_type_error: "Availability must be an array of weekdays",
      }
    )
    .min(1, { message: "At least one day is required" }),

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

  languagesKnown: z
    .array(
      z.nativeEnum(ELanguages, {
        invalid_type_error: "Each language must be one of the allowed values",
      }),
      {
        required_error: "Languages are required",
        invalid_type_error: "languagesKnown must be an array",
      }
    )
    .min(1, { message: "At least one language is required" }),

  about: z
    .string({
      required_error: "About is required",
      invalid_type_error: "About must be a string",
    })
    .min(10, { message: "About must be between 10 and 1000 characters" })
    .max(1000, { message: "About must be between 10 and 1000 characters" }),

  degree: z
    .string({
      required_error: "Degree is required",
      invalid_type_error: "Degree must be a string",
    })
    .min(1, { message: "Degree must not be empty" }),

  certifications: z
    .array(
      z.string({ invalid_type_error: "Each certification must be a string" }),
      { invalid_type_error: "Certifications must be an array of strings" }
    )
    .optional(),

  consulation: z.coerce
    .number({
      required_error: "Consultation fee is required",
      invalid_type_error: "Consultation must be a number",
    })
    .min(0, { message: "Consultation must be at least 0" }),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

export const doctorFormDefaultValues: Partial<CreateDoctorInput> = {
  name: "",
  certifications: [],
  experience: 0,
  email: "",
  phone: "",
  languagesKnown: [],
  address: "",
  consulation: 0,
  degree: "",
  availability: [],
  profileImageId: null,
  about: "",
  specialization: ESpecialization.Cardiology,
};
