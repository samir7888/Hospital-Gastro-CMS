"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import MissionVisionSection from "./mission-section";
import JourneySection from "./journey-section";
import CoreValuesSection from "./core-value-section";
import StatsSection from "./stats-section";
import type { AboutPageData } from "@/schema/pages-schemas/about-page-schema";
import { useAppQuery, useAppMutation } from "@/utils/react-query";
import HeroSection from "../content-section";

// Updated Schemas matching the new structure
const missionVisionSchema = z.object({
  mission: z
    .string()
    .min(100, { message: "Mission must be between 100 and 500 characters" })
    .max(500, { message: "Mission must be between 100 and 500 characters" })
    .transform((val) => val.trim()),
  vision: z
    .string()
    .min(100, { message: "Vision must be between 100 and 500 characters" })
    .max(500, { message: "Vision must be between 100 and 500 characters" })
    .transform((val) => val.trim()),
});

const statisticsItemSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(3, { message: "Title must be between 3 and 50 characters" })
    .max(50, { message: "Title must be between 3 and 50 characters" })
    .transform((val) => val.trim()),
  count: z
    .number({
      required_error: "Count is required",
      invalid_type_error: "Count must be a number",
    })
    .min(1, { message: "Count must be at least 1" }),
});

const statsSchema = z.object({
  statistics: z
    .array(statisticsItemSchema)
    .max(10, { message: "Statistics must be less than 10" }),
});

const journeyItemSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be between 3 and 100 characters" })
    .max(100, { message: "Title must be between 3 and 100 characters" })
    .transform((val) => val.trim()),
  description: z
    .string()
    .min(10, { message: "Description must be between 10 and 500 characters" })
    .max(500, { message: "Description must be between 10 and 500 characters" })
    .transform((val) => val.trim()),
});

const journeySchema = z.object({
  journey: z
    .array(journeyItemSchema)
    .max(10, { message: "Journey must be less than 10" }),
});

const coreValueSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be between 3 and 100 characters" })
    .max(100, { message: "Title must be between 3 and 100 characters" })
    .transform((val) => val.trim()),
  description: z
    .string()
    .min(10, { message: "Description must be between 10 and 500 characters" })
    .max(500, { message: "Description must be between 10 and 500 characters" })
    .transform((val) => val.trim()),
});

const coreValuesSchema = z.object({
  coreValues: z
    .array(coreValueSchema)
    .max(10, { message: "Core values must be less than 10" }),
});

type MissionVisionValues = z.infer<typeof missionVisionSchema>;
type StatsValues = z.infer<typeof statsSchema>;
type JourneyValues = z.infer<typeof journeySchema>;
type CoreValuesValues = z.infer<typeof coreValuesSchema>;

export default function AboutPage() {
  const [activeSubTab, setActiveSubTab] = useState("hero-section");

  // Fetch existing data
  const {
    data: existingData,
    isLoading: isDataLoading,
    refetch,
  } = useAppQuery<AboutPageData>({
    url: "/about-page",
    queryKey: ["about-page"],
  });

  // Mission & Vision Form
  const missionVisionForm = useForm<MissionVisionValues>({
    resolver: zodResolver(missionVisionSchema),
    defaultValues: {
      mission: "",
      vision: "",
    },
  });

  // Stats Form
  const statsForm = useForm<StatsValues>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      statistics: [],
    },
  });

  // Journey Form
  const journeyForm = useForm<JourneyValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      journey: [],
    },
  });

  // Core Values Form
  const coreValuesForm = useForm<CoreValuesValues>({
    resolver: zodResolver(coreValuesSchema),
    defaultValues: {
      coreValues: [],
    },
  });

  // Update Mission & Vision Mutation
  const updateMissionVisionMutation = useAppMutation({
    url: "/about-page",
    type: "patch",
    onSuccess: () => {
      toast.success("Mission & Vision updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update Mission & Vision");
    },
  });

  // Update Stats Mutation
  const updateStatsMutation = useAppMutation({
    url: "/about-page",
    type: "patch",
    onSuccess: () => {
      toast.success("Statistics updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update statistics");
    },
  });

  // Update Journey Mutation
  const updateJourneyMutation = useAppMutation({
    url: "/about-page",
    type: "patch",
    onSuccess: () => {
      toast.success("Journey updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update journey");
    },
  });

  // Update Core Values Mutation
  const updateCoreValuesMutation = useAppMutation({
    url: "/about-page",
    type: "patch",
    onSuccess: () => {
      toast.success("Core Values updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update core values");
    },
  });

  // Load existing data into forms
  useEffect(() => {
    if (existingData) {
      // Mission & Vision
      missionVisionForm.reset({
        mission: existingData.mission || "",
        vision: existingData.vision || "",
      });

      // Stats - updated to handle array structure
      if (existingData.statistics) {
        statsForm.reset({
          statistics: existingData.statistics || [],
        });
      }

      // Journey - updated to handle new structure without year
      if (existingData.journey) {
        if (existingData.journey) {
          journeyForm.reset({
            journey: existingData.journey,
          });
        }
        // Core Values
        if (existingData.coreValues) {
          coreValuesForm.reset({
            coreValues: existingData.coreValues,
          });
        }
      }
    }
  }, [existingData, missionVisionForm, statsForm, journeyForm, coreValuesForm]);

  // Submit handlers
  const handleMissionVisionSubmit = (data: MissionVisionValues) => {
    updateMissionVisionMutation.mutate({
      data: {
        mission: data.mission,
        vision: data.vision,
      },
    });
  };

  const handleStatsSubmit = (data: StatsValues) => {
    updateStatsMutation.mutate({
      data: {
        statistics: data.statistics,
      },
    });
  };

  const handleJourneySubmit = (data: JourneyValues) => {
    updateJourneyMutation.mutate({
      data: {
        journey: data.journey,
      },
    });
  };

  const handleCoreValuesSubmit = (data: CoreValuesValues) => {
    updateCoreValuesMutation.mutate({
      data: {
        coreValues: data.coreValues,
      },
    });
  };

  if (isDataLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Section</h1>
          <p className="text-muted-foreground">
            Update the about section of your website
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading about page data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      

      <Tabs defaultValue="about" className="mb-6">
        <TabsContent value="about">
          <Tabs value={activeSubTab} defaultValue="hero-section" onValueChange={setActiveSubTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="hero-section">Hero Section</TabsTrigger>
              <TabsTrigger value="mission-vision">Mission & Vision</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="journey">Our Journey</TabsTrigger>
              <TabsTrigger value="core-values">Core Values</TabsTrigger>
            </TabsList>

            <TabsContent value="hero-section">
             <HeroSection
             apiEndpoint="/about-page"
             queryKey={["about-page"]}
             dataPath="heroSection"
             cardTitle="Hero Section"
             cardDescription="Update the content for your hero section"
             />
            </TabsContent>
            <TabsContent value="mission-vision">
              <MissionVisionSection
                form={missionVisionForm}
                onSubmit={handleMissionVisionSubmit}
                isLoading={updateMissionVisionMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="stats">
              <StatsSection
                form={statsForm}
                onSubmit={handleStatsSubmit}
                isLoading={updateStatsMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="journey">
              <JourneySection
                form={journeyForm}
                onSubmit={handleJourneySubmit}
                isLoading={updateJourneyMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="core-values">
              <CoreValuesSection
                form={coreValuesForm}
                onSubmit={handleCoreValuesSubmit}
                isLoading={updateCoreValuesMutation.isPending}
              />
            </TabsContent>

            
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
