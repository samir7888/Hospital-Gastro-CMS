import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createDoctorSchema,
  doctorFormDefaultValues,
  type CreateDoctorInput,
} from "@/schema/Doctors";
import { ELanguages, ESpecialization, EWeekDays } from "@/types/enums";

import MultiSelect from "./multi-select";
import { useAppMutation } from "@/utils/react-query";
import type { ImageResponse } from "@/schema/global.schema";

export default function DoctorForm({
  defaultValues,
  uploadedImage,
}: {
  defaultValues?: CreateDoctorInput;
  uploadedImage?: ImageResponse | null;
}) {
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm<CreateDoctorInput>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: defaultValues ?? doctorFormDefaultValues,
  });

  const { mutateAsync: createDoctor, isPending } = useAppMutation({
    type: defaultValues ? "patch" : "post",
    url: defaultValues ? `/doctors/${params.id}` : "/doctors",
    queryKey: ["doctor", params.id!],
    form,
  });

  async function onSubmit(data: CreateDoctorInput) {
    // Call the mutation with the processed data
    await createDoctor({ data });
    navigate("/doctors");
  }

  function handleAboutChange(html: string) {
    form.setValue("about", html);
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Doctor's Photo</CardTitle>
                <CardDescription>
                  Upload a professional photo of the doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  currentImage={uploadedImage}
                  name="profileImageId"
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the doctor's basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="specializations"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Specialty<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            name="specializations"
                            options={Object.entries(ESpecialization).map(
                              ([key, value]) => ({
                                label: key,
                                value: value,
                              })
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Qualifications
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="MD, PhD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Experience<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="15 years"
                          type="number"
                          {...field}
                          min={1}
                          max={50}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languagesKnown"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Languages Known<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          name="languagesKnown"
                          options={Object.entries(ELanguages).map(
                            ([key, value]) => ({
                              label: key,
                              value: value,
                            })
                          )}
                        />
                      </FormControl>
                      <FormDescription>
                        Select the languages the doctor can communicate in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Board Certified, Fellow of XYZ"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.trim()) {
                              field.onChange(
                                value.split(",").map((cert) => cert.trim())
                              );
                            } else {
                              field.onChange([]);
                            }
                          }}
                          value={
                            Array.isArray(field.value)
                              ? field.value.join(", ")
                              : ""
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter certifications or awards received by the doctor
                        separated by commas (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Add contact details and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="doctor@hospital.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter active email address of the doctor
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the phone number with country code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Availability<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          name="availability"
                          options={Object.entries(EWeekDays).map(
                            ([key, value]) => ({
                              label: key,
                              value: value,
                            })
                          )}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify the days and hours when the doctor is available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Biography<span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Write a detailed biography of the doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <TiptapEditor
                            content={field.value}
                            onChange={handleAboutChange}
                            placeholder="Write the doctor's bio here..."
                            className="min-h-[300px]"
                          />
                          {/* <Editor /> */}
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Your biography is a detailed description of your
                          doctor with rich text formatting
                          <span className="block mt-1 text-right text-xs text-muted-foreground">
                            {field.value?.length || 0}/1000 characters
                          </span>
                        </FormDescription>
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 py-8">
              <Button type="button" variant="outline" asChild>
                <Link to="/doctors">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
