import type { EButtonVariant } from "@/types/enums";




export type AboutPageData = {
  id: string;
  statistics: any | null; // You can replace `any` with a more specific type if you know the structure
  mission: string;
  vision: string;
  journey: any | null; // Replace `any` if you know its structure
  coreValues: any | null; // Replace `any` if you know its structure
  heroSection: {
    id: string;
    title: string;
    subtitle: string;
    cta: {
      link: string;
      text: string;
      variant: EButtonVariant;
    }[];
    image: {
      id: string;
      url: string;
    } | null;
  };
};
