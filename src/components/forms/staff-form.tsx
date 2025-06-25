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

import { useAppMutation } from "@/utils/react-query";
import type { ImageResponse } from "@/schema/global.schema";
import {
  createStaffSchema,
  staffFormDefaultValues,
  type CreateStaffInput,
} from "@/schema/staffs-schema";

export default function StaffForm({
  defaultValues,
  uploadedImage,
}: {
  defaultValues?: CreateStaffInput;
  uploadedImage?: ImageResponse | null;
}) {
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm<CreateStaffInput>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: defaultValues ?? staffFormDefaultValues,
  });

  const { mutateAsync: createStaff, isPending } = useAppMutation({
    type: defaultValues ? "patch" : "post",
    url: defaultValues ? `/staffs/${params.id}` : "/staffs",
    queryKey: ["staff", params.id!],
    form,
  });

  async function onSubmit(data: CreateStaffInput) {
    // Call the mutation with the processed data
    await createStaff({ data });
    navigate("/staffs");
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
                <CardTitle>Staff's Photo</CardTitle>
                <CardDescription>
                  Upload a professional photo of the staff
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
                  Enter the staff's basic details
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
                          <Input placeholder="staff@hospital.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter active email address of the staff
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
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 py-8">
              <Button type="button" variant="outline" asChild>
                <Link to="/staffs">Cancel</Link>
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
