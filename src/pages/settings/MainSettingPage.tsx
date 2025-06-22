import { useAppQuery } from "@/utils/react-query";
import SettingsPage from "./Settings";
import type { ImageResponse } from "@/schema/global.schema";

interface GeneralSettingsResponse {
  id: string;
  companyName: string;
  siteTitle: string;
  siteDescription: string;
  primaryLogo: ImageResponse | null;
  secondaryLogo: ImageResponse | null;

}

interface PrivacyPolicyResponse {
  privacyPolicy: string;
}

interface TermsConditionsResponse {
  termsAndConditions: string;
}

interface FooterDescriptionResponse {
  footerDescription: string;
}

const MainSettingPage = () => {
  const {
    data: generalSettings,
    isLoading: isLoadingGeneral,
    error: generalError,
  } = useAppQuery<GeneralSettingsResponse>({
    url: "general-setting",
    queryKey: ["general-settings"],
  });

  const {
    data: privacyPolicy,
    isLoading: isLoadingPrivacy,
    error: privacyError,
  } = useAppQuery<PrivacyPolicyResponse>({
    url: "general-setting/privacy-policy",
    queryKey: ["privacy-policy"],
  });

  const {
    data: termsConditions,
    isLoading: isLoadingTerms,
    error: termsError,
  } = useAppQuery<TermsConditionsResponse>({
    url: "general-setting/terms-and-condition",
    queryKey: ["terms-conditions"],
  });

  const {
    data: footerDescription,
    isLoading: isLoadingFooter,
    error: footerError,
  } = useAppQuery<FooterDescriptionResponse>({
    url: "general-setting/footer-description",
    queryKey: ["footer-description"],
  });

  const isLoadingSettings =
    isLoadingGeneral || isLoadingPrivacy || isLoadingTerms || isLoadingFooter;
  const hasError = generalError || privacyError || termsError || footerError;

  if (isLoadingSettings) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Failed to load general settings. Please refresh the page or try
            again later.
          </p>
        </div>
      </div>
    );
  }
  return (
    <SettingsPage
      defaultValues={{
        companyName: generalSettings?.companyName || "",
        privacyPolicy: privacyPolicy?.privacyPolicy || "",
        termsAndConditions: termsConditions?.termsAndConditions || "",
        primaryLogoId: generalSettings?.primaryLogo?.id || null,
        secondaryLogoId: generalSettings?.secondaryLogo?.id || null,
        footerDescription: footerDescription?.footerDescription || "",
      }}
      uploadedImage={{
        primaryLogo: generalSettings?.primaryLogo || null,
        secondaryLogo: generalSettings?.secondaryLogo || null,
      }}
    />
  );
};

export default MainSettingPage;
