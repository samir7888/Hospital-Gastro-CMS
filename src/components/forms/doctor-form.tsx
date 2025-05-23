
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  createDoctorSchema,
  doctorFormDefaultValues,
  type CreateDoctorInput,
} from "@/schema/Doctors";
import { ELanguages, ESpecialization, EWeekDays } from "@/types/enums";

import MultiSelect from "./multi-select";
import { useAppMutation } from "@/utils/react-query";

export default function DoctorForm() {
  const { mutate: createDoctor, isPending } = useAppMutation({
    type: "post",
    url: "/doctors",
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const form = useForm<CreateDoctorInput>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: doctorFormDefaultValues,
  });

  function onSubmit(data: CreateDoctorInput) {
    createDoctor(data);
  }

  function handleAboutChange(html: string) {
    form.setValue("about", html);
  }

  console.log(form.formState.errors);
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild className="mr-4">
          <Link to="/doctors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Doctors
          </Link>
        </Button>
      </div>

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
                  <FileUpload name="profileImageId" />
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
                        <FormLabel>Full Name</FormLabel>
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
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialty</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full capitalize">
                                <SelectValue placeholder="Select a specialty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-200 ">
                              {Object.entries(ESpecialization).map(
                                ([key, value]) => (
                                  <SelectItem
                                    value={value}
                                    key={key}
                                    className="capitalize"
                                  >
                                    {value}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifications</FormLabel>
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
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="15 years"
                            type="number"
                            {...field}
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
                        <FormLabel>Languages Known</FormLabel>
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="doctor@hospital.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
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
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consulation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consulation Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter consulation fee"
                            {...field}
                          />
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
                        <FormLabel>Availability</FormLabel>
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
                          Specify the days and hours when the doctor is
                          available
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                  <CardDescription>
                    Write a detailed biography of the doctor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
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
                      </FormItem>
                    )}
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
    </div>
  );
}
