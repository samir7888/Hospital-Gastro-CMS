"use client";

import { useState } from "react";
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
import MissionVisionSection from "./mission-section";
import JourneySection from "./journey-section";
import CoreValuesSection from "./core-value-section";
import StatsSection from "./stats-section";

const statsSchema = z.object({
  yearsOfExperience: z.number().int().positive(),
  patientsAnnually: z.number().int().positive(),
  awardWinningDoctors: z.number().int().positive(),
  emergencyCare: z.string().min(1),
});

const missionVisionSchema = z.object({
  mission: z.string().min(10, "Mission statement is required"),
  vision: z.string().min(10, "Vision statement is required"),
});

type StatsValues = z.infer<typeof statsSchema>;
type MissionVisionValues = z.infer<typeof missionVisionSchema>;

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("mission-vision");

  const statsForm = useForm<StatsValues>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      yearsOfExperience: 35,
      patientsAnnually: 50000,
      awardWinningDoctors: 200,
      emergencyCare: "24/7",
    },
  });

  const missionVisionForm = useForm<MissionVisionValues>({
    resolver: zodResolver(missionVisionSchema),
    defaultValues: {
      mission: "To deliver exceptional healthcare services that improve the quality of life for our patients and community. We are committed to delivering compassionate, patient-centered care using the latest medical technologies and evidence-based practices.",
      vision: "To be the region's most trusted healthcare provider, recognized for clinical excellence, innovative treatments, and outstanding patient outcomes. We strive to create a healthier community through comprehensive care and education.",
    },
  });

  function onSaveStats(data: StatsValues) {
    setIsLoading(true);
    // In a real app, you would save the form data to your API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Stats saved:", data);
    }, 1000);
  }

  function onSaveMissionVision(data: MissionVisionValues) {
    setIsLoading(true);
    // In a real app, you would save the form data to your API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Mission & Vision saved:", data);
    }, 1000);
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
                onSubmit={onSaveMissionVision}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="stats">
              <StatsSection 
                form={statsForm} 
                onSubmit={onSaveStats}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="journey">
              <JourneySection />
            </TabsContent>

            <TabsContent value="core-values">
              <CoreValuesSection />
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
                    {/* Stats Preview */}
                    <div className="grid grid-cols-4 text-center gap-4 mb-12">
                      <div>
                        <div className="flex justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M20 5h-8.5L9.86 2.35A2 2 0 0 0 8.28 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                          </svg>
                        </div>
                        <p className="text-xl font-bold">{statsForm.getValues().yearsOfExperience}+</p>
                        <p className="text-sm text-gray-600">Years of Excellence</p>
                      </div>
                      <div>
                        <div className="flex justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        </div>
                        <p className="text-xl font-bold">{statsForm.getValues().patientsAnnually.toLocaleString()}+</p>
                        <p className="text-sm text-gray-600">Patients Annually</p>
                      </div>
                      <div>
                        <div className="flex justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
                            <circle cx="12" cy="8" r="7"/>
                          </svg>
                        </div>
                        <p className="text-xl font-bold">{statsForm.getValues().awardWinningDoctors}+</p>
                        <p className="text-sm text-gray-600">Award-Winning Doctors</p>
                      </div>
                      <div>
                        <div className="flex justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                        </div>
                        <p className="text-xl font-bold">{statsForm.getValues().emergencyCare}</p>
                        <p className="text-sm text-gray-600">Emergency Care</p>
                      </div>
                    </div>

                    {/* Mission & Vision Preview */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-700">{missionVisionForm.getValues().mission}</p>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-4">Our Vision</h2>
                        <p className="text-gray-700">{missionVisionForm.getValues().vision}</p>
                      </div>
                    </div>

                    {/* Journey Preview */}
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 text-center">Our Journey</h2>
                      <div className="relative border-l-2 border-blue-500 ml-4 pl-8 space-y-8">
                        <div>
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs">1988</span>
                          <h3 className="text-lg font-bold">Foundation</h3>
                          <p className="text-gray-700">Established as a small community hospital with a vision to provide quality healthcare services.</p>
                        </div>
                        <div>
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs">1995</span>
                          <h3 className="text-lg font-bold">Major Expansion</h3>
                          <p className="text-gray-700">Expanded facilities to include specialized departments and state-of-the-art equipment.</p>
                        </div>
                        <div>
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs">2005</span>
                          <h3 className="text-lg font-bold">Research Center</h3>
                          <p className="text-gray-700">Opened our dedicated research center focusing on innovative medical treatments.</p>
                        </div>
                        <div>
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs">2015</span>
                          <h3 className="text-lg font-bold">Digital Transformation</h3>
                          <p className="text-gray-700">Implemented advanced digital health systems and telehealth capabilities.</p>
                        </div>
                        <div>
                          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs">2025</span>
                          <h3 className="text-lg font-bold">Future Vision</h3>
                          <p className="text-gray-700">Continuing to expand our services and embrace cutting-edge medical technologies.</p>
                        </div>
                      </div>
                    </div>

                    {/* Core Values Preview */}
                    <div>
                      <h2 className="text-2xl font-bold mb-6 text-center">Our Core Values</h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-lg font-bold mb-2">Excellence</h3>
                          <p className="text-gray-700">We strive for excellence in every aspect of patient care, maintaining the highest standards of medical practice and professional conduct.</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-lg font-bold mb-2">Compassion</h3>
                          <p className="text-gray-700">We treat each patient with kindness, empathy, and respect, understanding their unique needs and concerns.</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="text-lg font-bold mb-2">Innovation</h3>
                          <p className="text-gray-700">We embrace advanced medical technologies and innovative treatments to provide the best possible care for our patients.</p>
                        </div>
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