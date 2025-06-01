import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Loader2,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  companyInfoSchema,
  type CompanyInfoResponse,
  type ContactType,
} from "@/schema/company-schema";
import { ESocialNetwork } from "@/types/enums";
import { useAppMutation, useAppQuery } from "@/utils/react-query";

const CompanyInfoForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: companyInfo, isLoading: isLoadingInfo } =
    useAppQuery<CompanyInfoResponse>({
      url: "company-info",
      queryKey: ["company-info"],
    });

  const { mutate: updateCompanyInfo, isPending: isUpdating } = useAppMutation({
    url: "company-info",
    type: "patch",
    onSuccess: () => setIsEditing(false),
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
      socialProfiles: [{ link: "", network: ESocialNetwork.Facebook }],
    },
  });

  const { control, handleSubmit, reset } = form;

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray<any>({
    control,
    name: "phone",
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray<any>({
    control,
    name: "email",
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialProfiles",
  });

  useEffect(() => {
    if (companyInfo) {
      reset({
        ...companyInfo,
        socialProfiles: companyInfo.socialProfiles.map((profile) => ({
          link: profile.link,
          network: profile.network,
        })),
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

  if (!isEditing && companyInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Company Information
          </h2>
          <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-900">{companyInfo.city}</p>
                <p className="text-gray-700 text-sm">{companyInfo.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Phone Numbers
                </h3>
                {companyInfo.phone.map((phone, i) => (
                  <p key={i}>{phone}</p>
                ))}
                <p className="text-red-600 text-sm">
                  Emergency: {companyInfo.emergencyPhone}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Working Hours
              </h3>
              <p className="text-gray-900">{companyInfo.workingHours}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Emails</h3>
                {companyInfo.email.map((email, i) => (
                  <p key={i}>{email}</p>
                ))}
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Social</h3>
                {companyInfo.socialProfiles.map((profile, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {profile.network}
                    </span>
                    <a
                      href={profile.link}
                      className="text-blue-600 hover:underline text-sm"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {profile.link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Map</h3>
              <a
                href={companyInfo.mapLink}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Company Information
          </h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            type="button"
          >
            Cancel
          </Button>
        </div>

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
                <Textarea rows={3} placeholder="Enter address" {...field} />
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
                  <Input placeholder="e.g., Mon-Fri: 9 AM - 5 PM" {...field} />
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
                  <Input placeholder="https://maps.google.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <FormLabel>Phone Numbers</FormLabel>
            <Button
              type="button"
              variant="ghost"
              onClick={() => appendPhone("")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {phoneFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <Input
                {...form.register(`phone.${index}`)}
                placeholder="Enter phone number"
              />
              {phoneFields.length >= 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removePhone(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <FormLabel>Emails</FormLabel>
            <Button
              type="button"
              variant="ghost"
              onClick={() => appendEmail("")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {emailFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <Input
                {...form.register(`email.${index}`)}
                placeholder="Enter email"
                type="email"
              />
              {emailFields.length >= 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeEmail(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <FormLabel>Social Profiles</FormLabel>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                appendSocial({ link: "", network: ESocialNetwork.Facebook })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {socialFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2"
            >
              <select
                {...form.register(`socialProfiles.${index}.network`)}
                className="px-3 py-2 border rounded-md"
              >
                {Object.values(ESocialNetwork).map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
              <Input
                {...form.register(`socialProfiles.${index}.link`)}
                placeholder="Enter link"
                className=""
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
        </div>

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
