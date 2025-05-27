import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, FileText } from "lucide-react";
import type { Category, CategoryResponse } from "@/schema/news-type";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

const createCategorySchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name must be between 3 and 50 characters" })
    .max(50, { message: "Name must be between 3 and 50 characters" })
    .trim(),
});
type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;

const CategoryPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const params = useParams();

  // Category management states
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const { data: categories, isLoading } = useAppQuery<CategoryResponse[]>({
    queryKey: ["blog-categories"],
    url: `/blog-categories`,
  });

  const { mutate: createCategory } = useAppMutation({
    type: "post",
    url: "/blog-categories",
    onSuccess: () => {
      form.reset();
      setShowNewCategoryForm(false);
      setNewCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateCategory = async ({ name }: { name: string }) => {
    createCategory({ data: { name } });
  };

  const { mutateAsync: deleteCategory, isPending: isDeleting } = useAppMutation(
    {
      type: "delete",
      url: `/blog-categories`,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
        navigate("/news/category");
      },
      onError: (error) => {
        console.error("Delete failed:", error);
      },
    }
  );

  // Fixed edit mutation - should use category ID from parameter
  const { mutateAsync: editCategory, isPending: isEditing } = useAppMutation({
    type: "patch",
    url: `/blog-categories/${params.id}`,
    onSuccess: () => {
      setEditingCategory(null);
      setEditCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
    onError: (error) => {
      console.error("Edit failed:", error);
    },
  });

  const handleEditCategory = async () => {
    if (!editCategoryName.trim()) return;

    const data = { name: editCategoryName.trim() };
    try {
      await editCategory({ data });
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      deleteCategory({ id }); // Pass the ID from params
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditCategoryName("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        {/* Categories Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Categories
              </h2>
              <button
                onClick={() => setShowNewCategoryForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* New Category Form */}
            {showNewCategoryForm && (
              <div className="mb-4 p-3 bg-white rounded border">
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleCreateCategory({
                        name: newCategoryName,
                      })
                    }
                    disabled={!newCategoryName.trim()}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCategoryForm(false);
                      setNewCategoryName("");
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            {isLoading ? (
              <div className="text-center py-4">Loading categories...</div>
            ) : (
              <div className="space-y-2">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCategory?.id === category.id
                        ? "bg-blue-100 border-blue-300"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {editingCategory === category.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory();
                            }}
                            disabled={isEditing || !editCategoryName.trim()}
                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            {isEditing ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditing();
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {category.blogsCount} blogs
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/news/category/${category.id}`);
                              startEditingCategory(category);
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              handleDeleteCategory(category.id);
                            }}
                            disabled={isDeleting}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
