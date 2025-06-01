export interface AuthUser {
  name: string;
  email: string;
}

export enum EFileMimeType {
  Image_JPEG = "image/jpeg",
  Image_PNG = "image/png",
  Image_WEBP = "image/webp",
  PDF = "application/pdf",
}

export enum EBlogType {
  News = "news",
  Events = "events",
}

export enum ESpecialization {
  Cardiology = "cardiology",
  Gynecology = "gynecology",
  Pediatrics = "pediatrics",
  Orthopedics = "orthopedics",
  Neurology = "neurology",
  GeneralMedicine = "general_medicine",
  Dermatology = "dermatology",
  Ophthalmology = "ophthalmology",
  Orthodontics = "orthodontics",
}

export enum EWeekDays {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

export enum ELanguages {
  Hindi = "hindi",
  English = "english",
  Nepali = "nepali",
  Spanish = "spanish",
  Korean = "korean",
  Chinese = "chinese",
  Japanese = "japanese",
}

export enum EFaqType {
  General = "general",
  Doctor = "doctor",
  Patient = "patient",
  Insurance = "insurance",
  Billing = "billing",
  Facility = "facility",
  EmergencyCare = "emergency_care",
}

export enum ESocialNetwork {
  Facebook = "facebook",
  Twitter = "twitter",
  Instagram = "instagram",
  LinkedIn = "linkedin",
}

export enum EButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
  Outline = "outline",
}
