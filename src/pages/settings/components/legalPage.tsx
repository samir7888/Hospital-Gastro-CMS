import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppMutation } from "@/utils/react-query";
import { Button } from "@/components/ui/button";

// Define or import your schema and type
const legalPageSchema = z.object({
  privacyPolicy: z.string().min(100, "Must be between 100 and 10000 characters").max(10000, "Must be between 100 and 10000 characters"),
  termsAndConditions: z.string().min(100, "Must be between 100 and 10000 characters").max(10000, "Must be between 100 and 10000 characters"),
  
});
type LegalPageSchemaType = z.infer<typeof legalPageSchema>;

const LegalPage = ({
  defaultValues = { privacyPolicy: "", termsAndConditions: "" },
}: {
  defaultValues?: { privacyPolicy: string; termsAndConditions: string };
}) => {
  const form = useForm<LegalPageSchemaType>({
    resolver: zodResolver(legalPageSchema),
    defaultValues: {
      privacyPolicy: defaultValues.privacyPolicy || "",
      termsAndConditions: defaultValues.termsAndConditions || "",
    },
  });

  const updateSettingsMutation = useAppMutation({
    url: "general-setting",
    type: "patch",
  });

  function onSubmit(data: LegalPageSchemaType) {
    updateSettingsMutation.mutate({
      data,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Legal Pages</CardTitle>
            <CardDescription>
              Configure your privacy policy and terms & conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="privacyPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Policy</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value || ""}
                      onChange={(html) => field.onChange(html)}
                      placeholder="Write the privacy policy here..."
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Your hospital's privacy policy content
                    <span className="block mt-1 text-right text-xs text-muted-foreground">
                      {field.value?.length || 0}/1000 characters
                    </span>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value || ""}
                      onChange={(html) => field.onChange(html)}
                      placeholder="Write the terms and conditions here..."
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Your hospital's privacy policy content
                    <span className="block mt-1 text-right text-xs text-muted-foreground">
                      {field.value?.length || 0}/1000 characters
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LegalPage;
