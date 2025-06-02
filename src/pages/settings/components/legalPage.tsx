import { TiptapEditor } from "@/components/editor/tiptap-editor";
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
import { useFormContext } from "react-hook-form";
const LegalPage = () => {
  const form = useFormContext();
  return (
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
              <FormDescription>
                Your hospital's privacy policy content
              </FormDescription>
              <FormMessage />
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
                Your hospital's terms and conditions content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default LegalPage;
