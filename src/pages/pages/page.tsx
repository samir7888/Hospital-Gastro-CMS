"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import AboutPage from "./components/about/AboutPage";
import HeroSection from "./components/content-section";
import { toast } from "sonner";

// Page configuration for different routes
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
    cardDescription: "Update the hero content for your about page",
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

  // Load the tab from URL hash on component mount and handle hash changes
  useEffect(() => {
    const getTabFromHash = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      return hash && pageConfigs[hash as PageType]
        ? (hash as PageType)
        : "home";
    };

    // Set initial tab from hash
    setActiveTab(getTabFromHash());

    // Listen for hash changes (back/forward navigation)
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    const newTab = value as PageType;
    setActiveTab(newTab);

    // Update the URL hash
    window.location.hash = newTab;
  };

  const handleSuccess = (pageType: string) => {
    console.log(`${pageType} hero section updated successfully!`);
    toast.success(`${pageType} hero section updated successfully!`);
  };

  const handleError = (error: any, pageType: string) => {
    console.error(`Failed to update ${pageType} hero section:`, error);
    toast.error(`Failed to update ${pageType} hero section. Please try again.`);
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
        onSuccess={() => handleSuccess(config.cardTitle)}
        onError={(error) => handleError(error, config.cardTitle)}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Page Management</h1>
        <p className="text-muted-foreground">
          Manage content for different sections of your website
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="news">Blogs</TabsTrigger>
        </TabsList>

        {/* Home Page */}
        <TabsContent value="home" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Home Page</h2>
            <p className="text-muted-foreground mb-6">
              Manage your homepage hero section and appointment booking
            </p>
          </div>

          {renderHeroSection("home")}
        </TabsContent>

        {/* About Page */}
        <TabsContent value="about" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">About Page</h2>
            <p className="text-muted-foreground mb-6">
              Manage your about page hero section and content
            </p>
          </div>

          {renderHeroSection("about")}
        </TabsContent>

        {/* Services Page */}
        <TabsContent value="services" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Services Page</h2>
            <p className="text-muted-foreground mb-6">
              Manage your services page hero section and service listings
            </p>
          </div>

          {renderHeroSection("services")}
        </TabsContent>

        {/* Doctors Page */}
        <TabsContent value="doctors" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Doctors Page</h2>
            <p className="text-muted-foreground mb-6">
              Manage your doctors page hero section and doctor profiles
            </p>
          </div>

          {renderHeroSection("doctors")}
        </TabsContent>

        {/* News and Events Page */}
        <TabsContent value="news" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Blogs Page</h2>
            <p className="text-muted-foreground mb-6">
              Manage your blogs page hero section and articles
            </p>
          </div>

          {renderHeroSection("news")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
