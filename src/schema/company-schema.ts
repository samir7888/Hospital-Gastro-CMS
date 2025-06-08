import { z } from "zod";

import { PHONE_NUMBER_REGEX } from "@/utils/constant";

// Main contact schema
export const companyInfoSchema = z.object({
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.array(
    z
      .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone must be a string",
      })
      .regex(PHONE_NUMBER_REGEX, {
        message: "Phone must be a valid phone number",
      })
  ),
  emergencyPhone: z
    .string()
    .min(1, "Emergency phone is required")
    .regex(PHONE_NUMBER_REGEX, {
      message: "Phone must be a valid phone number",
    }),
  workingHours: z.string().min(1, "Working hours are required"),
  mapLink: z.string().url("Invalid map link").min(1, "Map link is required"),
  email: z.array(
    z
      .string({ required_error: "Email is required" })
      .email("Invalid email address")
      .min(1, "Email is required")
  ),

  socialProfiles: z.array(z.string().url("Invalid url")),
});

// TypeScript type
export type ContactType = z.infer<typeof companyInfoSchema>;

export type CompanyInfoResponse = {
  id: string;
  city: string;
  address: string;
  phone: string[];
  emergencyPhone: string;
  workingHours: string;
  mapLink: string;
  email: string[];
  socialProfiles: string[];
};
