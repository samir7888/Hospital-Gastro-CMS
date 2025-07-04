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
import { imageSchema, type ImageResponse } from "@/schema/global.schema";
import { toast } from "sonner";
import { EInternalLink } from "@/types/enums";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Schema for hero section
const heroSectionSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be between 3 and 50 characters")
      .max(50, "Title must be between 3 and 50 characters"),
    subtitle: z
      .string()
      .min(10, "Subtitle must be between 10 and 200 characters")
      .max(200, "Subtitle must be between 10 and 200 characters"),
    imageId: imageSchema,
    cta: z
      .array(
        z.object({
          link: z.string().min(1, "Link is required"),
          text: z
            .string()
            .min(3, "Text must be between 3 and 15 characters")
            .max(15, "Text must be between 3 and 15 characters")
            .trim(),

          variant: z.enum(["primary", "secondary", "outline"]),
          type: z.enum(["external", "internal"]),
        })
      )
      .max(2, { message: "At most 2 CTAs are allowed" }),
  })
  .superRefine((data, ctx) => {
    data.cta.forEach((cta, index) => {
      ``;
      const parsedLink = z.string().url().safeParse(cta.link);

      if (cta.type === "external" && !parsedLink.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid url",
          path: ["cta", index, "link"],
        });
      }
    });
    return data;
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

const HeroSection: React.FC<HeroSectionProps> = (props) => {
  const { apiEndpoint, queryKey } = props;

  // Fetch existing data
  const {
    data,
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

  if (!data) {
    return <div>Something went wrong!</div>;
  }

  return (
    <HeroForm
      {...props}
      defaultValues={{
        cta: data.heroSection.cta.map((c) => ({
          ...c,
          type: Object.values(EInternalLink).includes(c.link as EInternalLink)
            ? "internal"
            : "external",
        })),

        title: data.heroSection.title,
        subtitle: data.heroSection.subtitle,
        imageId: data.heroSection.image?.id,
      }}
      currentImage={data.heroSection.image}
    />
  );
};

function HeroForm({
  apiEndpoint,
  dataPath = "heroSection",
  cardTitle = "Hero Section",
  cardDescription = "Update the content for your hero section",
  defaultValues,
  currentImage,
}: HeroSectionProps & {
  defaultValues: HeroSectionType;
  currentImage: ImageResponse;
}) {
  const form = useForm<HeroSectionType>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cta",
  });

  // Mutation for updating hero section
  const { mutate: updateHeroSection, isPending: isUpdating } = useAppMutation({
    type: "patch",
    url: apiEndpoint,
  });

  // Handle form submission
  const onSubmit = (data: HeroSectionType) => {
    const payload = dataPath ? { [dataPath]: data } : data;
    updateHeroSection({ data: payload });
  };

  // Add CTA button
  const addCTA = () => {
    append({
      link: "",
      text: "",
      type: "internal" as const,
      variant: "primary" as const,
    });
  };

  // Remove CTA button
  const removeCTA = (index: number) => {
    remove(index);
  };

  console.log(form.formState.errors);

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
                    disabled={fields.length >= 2}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCTA}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add CTA
                  </Button>
                </div>

                {fields.map((field, index) => {
                  return (
                    <Card key={field.id} className="p-4">
                      <FormField
                        control={form.control}
                        name={`cta.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  form.setValue(`cta.${index}.link`, "");
                                }}
                                defaultValue={field.value}
                                className="flex gap-3"
                              >
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <RadioGroupItem value="internal" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Internal
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <RadioGroupItem value="external" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    External
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                  onChange={(e) =>
                                    field.onChange(e.target.value.trimStart())
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cta.${index}.link`}
                          render={({ field: formField }) => {
                            const linkType = form.watch("cta")[index].type;

                            return (
                              <FormItem>
                                <FormLabel>
                                  {linkType === "internal"
                                    ? "Navigate to"
                                    : "Link "}
                                </FormLabel>
                                <FormControl>
                                  {linkType === "internal" ? (
                                    <Select
                                      onValueChange={formField.onChange}
                                      defaultValue={formField.value}
                                      {...formField}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select link" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(EInternalLink).map(
                                          ([key, value]) => (
                                            <SelectItem value={value} key={key}>
                                              {key}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      placeholder="e.g., /appointment"
                                      {...formField}
                                    />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
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
                                    <SelectTrigger className="w-full">
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
                            className="mb-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

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
                            currentImage={currentImage}
                            name="imageId"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}

export default HeroSection;
