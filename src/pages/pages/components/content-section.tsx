import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import type { HomePageData } from "@/schema/pages-schemas/hero-page.-schema";
import { imageSchema } from "@/schema/global.schema";
import { toast } from "sonner";

// Schema for hero section
const heroSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  imageId: imageSchema,
  cta: z.array(
    z.object({
      link: z.string().min(1, "Link is required"),
      text: z.string().min(1, "Text is required"),
      variant: z.enum(["primary", "secondary", "outline"]),
    })
  ),
});

type HeroSectionType = z.infer<typeof heroSectionSchema>;

interface HeroSectionProps {
  /**
   * The API endpoint for this hero section (e.g., '/doctor-page', '/services')
   */
  apiEndpoint: string;
  /**
   * The query key for react-query caching
   */
  queryKey: string[];
  /**
   * The nested path to the hero section data in the API response
   * e.g., 'heroSection' for { heroSection: { title: '...' } }
   */
  dataPath?: string;
  /**
   * Custom title for the card
   */
  cardTitle?: string;
  /**
   * Custom description for the card
   */
  cardDescription?: string;
  /**
   * Success callback after save
   */
  onSuccess?: () => void;
  /**
   * Error callback
   */
  onError?: (error: any) => void;
}

const defaultHeroValues: HeroSectionType = {
  title: "",
  subtitle: "",
  imageId: "",
  cta: [],
};

const HeroSection: React.FC<HeroSectionProps> = ({
  apiEndpoint,
  queryKey,
  dataPath = "heroSection",
  cardTitle = "Hero Section",
  cardDescription = "Update the content for your hero section",
}) => {
  // Fetch existing data
  const {
    data: existingData,
    isLoading: isDataLoading,
    refetch,
  } = useAppQuery<HomePageData>({
    url: apiEndpoint,
    queryKey,
    options: {
      onSuccess: () => {
        toast.success("Hero section updated successfully!");
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update hero section");
      },
    },
  });

  const form = useForm<HeroSectionType>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: defaultHeroValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cta",
  });

  // Update form when data is loaded
  useEffect(() => {
    if (existingData && dataPath) {
      if (existingData) {
        form.reset({
          title: existingData.heroSection.title || "",
          subtitle: existingData.heroSection.subtitle || "",
          imageId: existingData.heroSection.image?.id || "",
          cta: existingData.heroSection.cta || [],
        });
      }
    }
  }, [existingData, dataPath, form]);

  // Mutation for updating hero section
  const { mutate: updateHeroSection, isPending: isUpdating } = useAppMutation({
    type: "patch",
    url: apiEndpoint,

    onSuccess: () => {
      toast.success("Hero section updated successfully!");
      refetch();
    },
    // You might want to show a toast here

    onError: (error: any) => {
      toast.error(error?.message || "Failed to update hero section");
    },
  });

  // Handle form submission
  const onSubmit = (data: HeroSectionType) => {
    const payload = dataPath ? { [dataPath]: data } : data;
    updateHeroSection({ data: payload });
  };

  // Add CTA button
  const addCTA = () => {
    append({ link: "", text: "", variant: "primary" as const });
  };

  // Remove CTA button
  const removeCTA = (index: number) => {
    remove(index);
  };

  if (isDataLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {/* Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hero title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main heading that appears in your hero section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subtitle Field */}
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hero subtitle" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short description that appears below the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CTA Buttons Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Call-to-Action Buttons
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCTA}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add CTA
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`cta.${index}.text`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Text</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Book Appointment"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`cta.${index}.link`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., /appointment"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`cta.${index}.variant`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Style</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="primary">
                                    Primary
                                  </SelectItem>
                                  <SelectItem value="secondary">
                                    Secondary
                                  </SelectItem>
                                  <SelectItem value="outline">
                                    Outline
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCTA(index)}
                          className="mb-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Image</CardTitle>
            <CardDescription>
              Upload an image for your hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="imageId"
              render={() => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      currentImage={existingData?.heroSection.image}
                      name="imageId"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

export default HeroSection;
