"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { toast } from "sonner";
import HeroSection from "./components/content-section";
import MetaDataSection from "./components/MetaData/meta-data";
import AboutPage from "./components/about/AboutPage";
import { useSearchParams } from "react-router-dom";
import { ETabs, pageConfigs, tabsSchema } from "@/lib/page-config";

export default function HeroPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || ETabs.Home;

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) return;
    const { error } = tabsSchema.safeParse(tab);

    if (error) {
      searchParams.delete("tab");
      setSearchParams(searchParams);
    }
  }, []);

  const renderHeroSection = (pageType: ETabs) => {
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

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          searchParams.set("tab", val);
          setSearchParams(searchParams);
        }}
        className="mb-6"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="news">Blogs</TabsTrigger>
        </TabsList>

        {Object.keys(pageConfigs).map((page) => {
          const config = pageConfigs[page as ETabs];
          const pageType = page as ETabs;

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
