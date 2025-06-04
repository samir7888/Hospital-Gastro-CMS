"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HeroSection from "./components/content-section";
import MetaDataSection from "./components/MetaData/meta-data";
import AboutPage from "./components/about/AboutPage";

// Page configuration
const pageConfigs = {
  home: {
    apiEndpoint: "/home-page",
    queryKey: ["home-page"],
    dataPath: "heroSection",
    cardTitle: "Home Hero Section",
    cardDescription: "Update the hero content for your homepage",
  },
  about: {
    apiEndpoint: "/about-page",
    queryKey: ["about-page"],
    dataPath: "heroSection",
    cardTitle: "About Hero Section",
    cardDescription: "Update the about section of your website",
  },
  services: {
    apiEndpoint: "/services-page",
    queryKey: ["services-page"],
    dataPath: "heroSection",
    cardTitle: "Services Hero Section",
    cardDescription: "Update the hero content for your services page",
  },
  doctors: {
    apiEndpoint: "/doctors-page",
    queryKey: ["doctors-page"],
    dataPath: "heroSection",
    cardTitle: "Doctors Hero Section",
    cardDescription: "Update the hero content for your doctors page",
  },
  news: {
    apiEndpoint: "/blogs-page",
    queryKey: ["blogs-page"],
    dataPath: "heroSection",
    cardTitle: "Blogs Hero Section",
    cardDescription: "Update the hero content for your blogs page",
  },
};

type PageType = keyof typeof pageConfigs;

export default function HeroPage() {
  const [activeTab, setActiveTab] = useState<PageType>("home");

  useEffect(() => {
    const getTabFromHash = () => {
      const hash = window.location.hash.slice(1);
      return hash && pageConfigs[hash as PageType]
        ? (hash as PageType)
        : "home";
    };
    setActiveTab(getTabFromHash());
    const handleHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (value: string) => {
    const newTab = value as PageType;
    setActiveTab(newTab);
    window.location.hash = newTab;
  };

  const renderHeroSection = (pageType: PageType) => {
    const config = pageConfigs[pageType];
    return (
      <HeroSection
        apiEndpoint={config.apiEndpoint}
        queryKey={config.queryKey}
        dataPath={config.dataPath}
        cardTitle={config.cardTitle}
        cardDescription={config.cardDescription}
        onSuccess={() => toast.success(`${config.cardTitle} updated!`)}
        onError={(error) =>
          toast.error(error + `Failed to update ${config.cardTitle}`)
        }
      />
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Page Management</h1>
      <p className="text-muted-foreground">
        Manage content for different sections of your website
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="news">Blogs</TabsTrigger>
        </TabsList>

        {Object.keys(pageConfigs).map((page) => {
          const pageType = page as PageType;
          const config = pageConfigs[pageType];
          return (
            <TabsContent key={page} value={page} className="space-y-6">
              <h2 className="text-2xl font-semibold">
                {config.cardTitle.replace("Hero Section", "")} Page
              </h2>
              <p className="text-muted-foreground mb-4">
                {config.cardDescription}
              </p>

              {/* Nested Tabs for each section */}
              <Tabs defaultValue="hero" className="mb-6 !min-w-full">
                <TabsList className="!min-w-full">
                  {pageType !== "about" ? (
                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                  ) : (
                    <TabsTrigger value="hero">Content</TabsTrigger>
                  )}
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="hero">
                  {pageType !== "about" ? (
                    renderHeroSection(pageType)
                  ) : (
                    <AboutPage />
                  )}
                </TabsContent>

                <TabsContent value="metadata">
                  <MetaDataSection
                    apiEndpoint={config.apiEndpoint}
                    queryKey={config.queryKey}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
