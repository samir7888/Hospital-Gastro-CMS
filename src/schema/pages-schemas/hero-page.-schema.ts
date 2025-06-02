import type { EButtonVariant } from "@/types/enums";

export type HomePageData = {
  id: string;
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
    };
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
};
