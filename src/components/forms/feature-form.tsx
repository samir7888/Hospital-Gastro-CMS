import {
  featureFormDefaultValues,
  featureSchema,
  type Feature,
  type FeatureSchemaType,
} from "@/schema/feature-schema";
import { useAppMutation } from "@/utils/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import type { ImageResponse } from "@/schema/global.schema";

export const FeatureForm = ({
  defaultValues,
  uploadedImage,
}: {
  defaultValues?: FeatureSchemaType;
  uploadedImage?: ImageResponse | null;
}) => {
  const navigate = useNavigate();
  const params = useParams();

  const form = useForm<FeatureSchemaType>({
    resolver: zodResolver(featureSchema),
    defaultValues: defaultValues ?? featureFormDefaultValues,
  });

  const { mutateAsync: createFeature, isPending } = useAppMutation({
    type: defaultValues ? "patch" : "post",
    url: defaultValues ? `/features/${params.id}` : "/features",
    queryKey: ["features", params.id!],
    form,
  });

  async function onSubmit(data: FeatureSchemaType) {
    // Call the mutation with the processed data
    await createFeature({ data });
    navigate("/features");
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Form</CardTitle>
              <CardDescription>
                {params.id ? "Update" : "Create"} a feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload currentImage={uploadedImage} name="imageId" />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter feature title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter feature description"
                        className="min-h-[80px] resize-none "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Your feature description is a detailed description of your feature with rich text formatting
                      <span className="block mt-1 text-right text-xs text-muted-foreground">
                        {field.value?.length || 0}/300 characters
                      </span>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-4 py-8">
            <Button type="button" variant="outline" asChild>
              <Link to="/features">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
