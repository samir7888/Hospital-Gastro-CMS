import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Category, CategoryResponse } from '@/schema/news-type';
import { useAppMutation, useAppQuery } from '@/utils/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { Edit2, Save, Trash2, X } from 'lucide-react';
import  { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const CategoryList = () => {
     const params = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const [editCategoryName, setEditCategoryName] = useState("");
  const { data: categories, isLoading } = useAppQuery<CategoryResponse[]>({
    queryKey: ["blog-categories"],
    url: `/blog-categories`,
  });

  const { mutateAsync: deleteCategory, isPending: isDeleting } = useAppMutation(
    {
      type: "delete",
      url: `/blog-categories`,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
        navigate("/news/category");
      },
      onError: (error) => console.error("Delete failed:", error),
    }
  );
  const { mutateAsync: editCategory, isPending: isEditing } = useAppMutation({
    type: "patch",
    url: `/blog-categories/${params.id}`,
    onSuccess: () => {
      setEditingCategory(null);
      setEditCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
    onError: (error) => console.error("Edit failed:", error),
  });
  const handleEditCategory = async () => {
    if (!editCategoryName.trim()) return;
    await editCategory({ data: { name: editCategoryName.trim() } });
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
            <div className="space-y-2">
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm focus:outline-none"
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory();
                  }}
                  disabled={isEditing || !editCategoryName.trim()}
                >
                  <Save className="w-3 h-3" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory(null);
                  }}
                >
                  <X className="w-3 h-3" /> Cancel
                </Button>
              </div>
            </div>
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
                    setEditingCategory(category.id);
                    setEditCategoryName(category.name);
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
  )
}

export default CategoryList