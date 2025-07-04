import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category, CategoryResponse } from "@/schema/news-type";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createCategorySchema,
  type CreateCategorySchemaType,
} from "./Category";

const CategoryList = () => {


  // Separate form for editing
  const editForm = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "" },
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const { data: categories, isLoading } = useAppQuery<CategoryResponse[]>({
    queryKey: ["blog-categories"],
    url: `/blog-categories`,
  });
  
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useAppMutation(
    {
      type: "delete",
      url: `/blog-categories`,
    }
  );
  
  const { mutateAsync: editCategory, isPending: isEditing } = useAppMutation({
    type: "patch",
    url: `/blog-categories/${editingCategory}`,
  });

  const handleEditCategory = async (data: CreateCategorySchemaType) => {
    if (!editingCategory) return;
    
    try {
      await editCategory({ data });
      setEditingCategory(null);
      editForm.reset();
    } catch (error) {
      // Error will be handled by the mutation
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category.id);
    editForm.setValue("name", category.name);
    editForm.clearErrors();
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    editForm.reset();
    editForm.clearErrors();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-2">
      {categories?.map((category) => (
        <div
          key={category.id}
          className={`p-3 rounded-lg border cursor-pointer ${
            selectedCategory?.id === category.id
              ? "bg-blue-100 border-blue-300"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {editingCategory === category.id ? (
            <form 
              onSubmit={editForm.handleSubmit(handleEditCategory)}
              className="space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <input
                  {...editForm.register("name")}
                  type="text"
                  className={`w-full px-2 py-1 border rounded text-sm focus:outline-none ${
                    editForm.formState.errors.name 
                      ? "border-red-500 focus:border-red-500" 
                      : "focus:border-blue-500"
                  }`}
                  placeholder="Category name"
                />
                {editForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {editForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isEditing || !editForm.formState.isValid}
                >
                  <Save className="w-3 h-3" /> Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={cancelEditing}
                >
                  <X className="w-3 h-3" /> Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-xs text-gray-500">
                  {category.blogsCount} blogs
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(category);
                  }}
                  className="p-1 hover:text-blue-600"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <Dialog
                  open={deleteDialogId === category.id}
                  onOpenChange={(open) => !open && setDeleteDialogId(null)}
                >
                  <DialogTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogId(category.id);
                      }}
                      className="p-1 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Category</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this category?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setDeleteDialogId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={isDeleting}
                        variant="destructive"
                        onClick={() => {
                          deleteCategory({ id: category.id });
                          setDeleteDialogId(null);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;