import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  companyInfoSchema,
  type CompanyInfoResponse,
  type ContactType,
} from "@/schema/company-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import FormErrorMessage from "@/components/ui/form-error-message";

const CompanyInfoForm = () => {
  const { data: companyInfo, isLoading: isLoadingInfo } =
    useAppQuery<CompanyInfoResponse>({
      url: "company-info",
      queryKey: ["company-info"],
    });

  const form = useForm<ContactType>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      city: "",
      address: "",
      phone: [""],
      emergencyPhone: "",
      workingHours: "",
      mapLink: "",
      email: [""],
      socialProfiles: [''],
    },
  });

  const { mutate: updateCompanyInfo, isPending: isUpdating } = useAppMutation({
    url: "company-info",
    type: "patch",
    form,
  });

  const { control, handleSubmit, reset } = form;

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray<any>({ control, name: "phone" });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray<any>({ control, name: "email" });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray<any>({ control, name: "socialProfiles" });

  useEffect(() => {
    if (companyInfo) {
      reset({
        ...companyInfo,
       
      });
    }
  }, [companyInfo, reset]);

  const onSubmit = (data: ContactType) => updateCompanyInfo({ data });

  if (isLoadingInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading company information...</span>
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl p-6 bg-white rounded-lg space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Company Info Management
          </h1>
          <p className="text-muted-foreground">
            Manage information about your company
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="city"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="emergencyPhone"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter emergency phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="address"
              control={control}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="workingHours"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Fri: 9 AM - 5 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="mapLink"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://maps.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Phone Numbers */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={() => appendPhone("")}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <FormField
                  name={`phone.${index}`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removePhone(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <FormErrorMessage error={form.formState.errors.phone} />
          </CardFooter>
        </Card>

        {/* Emails */}
        <Card>
          <CardHeader>
            <CardTitle>Emails</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={() => appendEmail("")}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {emailFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <FormField
                  name={`email.${index}`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Eg. abc@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeEmail(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Social Profiles</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                appendSocial("")
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-2">
               

                <FormField
                  name={`socialProfiles.${index}`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Eg. https://facebook.com/link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeSocial(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoForm;
