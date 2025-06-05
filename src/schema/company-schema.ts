import { z } from "zod";

import { ESocialNetwork } from "@/types/enums";
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
        message: "Phone must be a valid E.164 phone number",
      })
  ),
  emergencyPhone: z
    .string()
    .min(1, "Emergency phone is required")
    .regex(PHONE_NUMBER_REGEX, {
      message: "Phone must be a valid E.164 phone number",
    }),
  workingHours: z.string().min(1, "Working hours are required"),
  mapLink: z.string().url("Invalid map link").min(1, "Map link is required"),
  email: z.array(
    z.string().email("Invalid email address").min(1, "Email is required")
  ),

  socialProfiles: z.array(
    z.object({
      link: z.string().url().or(z.string()),
      network: z.nativeEnum(ESocialNetwork),
    })
  ),
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
  socialProfiles: {
    link: string;
    network: ESocialNetwork;
  }[];
};
