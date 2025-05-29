"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import MissionVisionSection from "./mission-section";
import JourneySection from "./journey-section";
import CoreValuesSection from "./core-value-section";
import StatsSection from "./stats-section";
import type { AboutPageData } from "@/schema/pages-schemas/about-page-schema";
import { useAppQuery, useAppMutation } from "@/utils/react-query";

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
  const [activeSubTab, setActiveSubTab] = useState("mission-vision");

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Page Section</h1>
        <p className="text-muted-foreground">
          Update the about section of your website
        </p>
      </div>

      <Tabs defaultValue="about" className="mb-6">
        <TabsContent value="about">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="mission-vision">Mission & Vision</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="journey">Our Journey</TabsTrigger>
              <TabsTrigger value="core-values">Core Values</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

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

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Preview how your about section will look on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow p-6">
                    {/* Stats Preview - Updated for new array structure */}
                    <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-4 mb-12">
                      {statsForm.getValues().statistics?.map((stat, index) => (
                        <div key={index}>
                          <div className="flex justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-500"
                            >
                              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                              <circle cx="12" cy="8" r="7" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold">{stat.count}+</p>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                        </div>
                      ))}
                      {(!statsForm.getValues().statistics ||
                        statsForm.getValues().statistics?.length === 0) && (
                        <p className="text-gray-500 italic col-span-full text-center">
                          No statistics added yet.
                        </p>
                      )}
                    </div>

                    {/* Mission & Vision Preview */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Our Mission</h2>
                        <div
                          className="text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html:
                              missionVisionForm.getValues().mission ||
                              "No mission statement added yet.",
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-4">Our Vision</h2>
                        <div
                          className="text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html:
                              missionVisionForm.getValues().vision ||
                              "No vision statement added yet.",
                          }}
                        />
                      </div>
                    </div>

                    {/* Journey Preview - Updated without year display */}
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-center">
                        Our Journey
                      </h2>
                      <div className="relative border-l-2 border-blue-500 ml-4 pl-8 space-y-8">
                        {journeyForm
                          .getValues()
                          .journey?.map((milestone, index) => (
                            <div key={index}>
                              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs">
                                {index + 1}
                              </span>
                              <h3 className="text-lg font-bold">
                                {milestone.title}
                              </h3>
                              <p className="text-gray-700">
                                {milestone.description}
                              </p>
                            </div>
                          ))}
                        {(!journeyForm.getValues().journey ||
                          journeyForm.getValues().journey?.length === 0) && (
                          <p className="text-gray-500 italic">
                            No journey milestones added yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Core Values Preview */}
                    <div>
                      <h2 className="text-2xl font-bold mb-6 text-center">
                        Our Core Values
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {coreValuesForm
                          .getValues()
                          .coreValues?.map((value, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h3 className="text-lg font-bold mb-2">
                                {value.title}
                              </h3>
                              <p className="text-gray-700">
                                {value.description}
                              </p>
                            </div>
                          ))}
                        {(!coreValuesForm.getValues().coreValues ||
                          coreValuesForm.getValues().coreValues?.length ===
                            0) && (
                          <p className="text-gray-500 italic col-span-3 text-center">
                            No core values added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
