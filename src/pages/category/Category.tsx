import { useAppMutation } from "@/utils/react-query";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import CategoryList from "./CategoryList";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be between 3 and 50 characters" })
    .max(50, { message: "Name must be between 3 and 50 characters" })
    .trim(),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;

const CategoryPage = () => {
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "" },
  });

  const { mutateAsync: createCategory } = useAppMutation({
    type: "post",
    url: "/blog-categories",
  });

  const handleCreateCategory = form.handleSubmit(async (data) => {
    await createCategory({ data });
    form.setValue("name", "");
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          News & Events Manager
        </h1>
        <p className="text-gray-600">
          Manage categories and organize your blog content
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Categories
          </h2>

          <form onSubmit={handleCreateCategory} className="mb-4 space-y-2">
            <input
              {...form.register("name")}
              placeholder="Category name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}

            <Button type="submit">Save</Button>
          </form>
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
