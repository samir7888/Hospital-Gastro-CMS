"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";
import SearchInput from "@/components/helpers/search-input";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import PaginationComponent from "@/components/pagination/pagination";
import type {
  BaseNewsAndEvents,
  NewsAndEventsResponse,
} from "@/schema/news-type";
import CategoryTabs from "@/components/helpers/category-tabs";

export default function NewsAndEventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News & Events</h1>
          <p className="text-muted-foreground">
            Manage blogs articles and upcoming events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="flex items-center gap-1">
            <Link to="/news/category">
              <Plus className="h-4 w-4 mr-1" />
              Add category
            </Link>
          </Button>
          <Button
            asChild
            variant={"outline"}
            className="flex items-center gap-1"
          >
            <Link to="/news/new">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex gap-4 flex-col lg:flex-row justify-between">
        <SearchInput />
        <CategoryTabs />
      </div>
      <NewsGrid />
    </div>
  );
}

function NewsGrid() {
  const [searchParam] = useSearchParams();

  const { data: newsAndEvents, isLoading } = useAppQuery<NewsAndEventsResponse>(
    {
      queryKey: ["blogs", searchParam.toString()],
      url: `/blogs?${searchParam.toString()}`,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (newsAndEvents?.data.length === 0) {
    return <NoNews />;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsAndEvents?.data.map((blogs: BaseNewsAndEvents) => (
          <NewsCard key={blogs.id} blogs={blogs} />
        ))}
      </div>
      {newsAndEvents?.meta && (
        <div>
          <PaginationComponent meta={newsAndEvents?.meta} />
        </div>
      )}
    </div>
  );
}

function NewsCard({ blogs }: { blogs: BaseNewsAndEvents }) {
  const { mutateAsync: deleteNews, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: `/blogs/${blogs.slug}`,
    queryKey: ["blogs"],
  });

  const handleDeleteConfirm = () => {
    deleteNews({});
  };

  return (
    <Card key={blogs.id} className="overflow-hidden group">
      <div className="aspect-[1/1] relative group overflow-hidden">
        <img
          src={blogs?.featuredImage?.url}
          alt={blogs.title}
          className="object-cover w-full h-full rounded-2xl transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <div className="space-x-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white"
            >
              <Link to={`/news/${blogs.slug}`}>
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/90 hover:bg-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{blogs.title}". This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <CardContent className="pt-4 pb-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant={blogs.category.name === "blogs" ? "default" : "secondary"}
            className="capitalize"
          >
            {blogs.category.name}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {blogs.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {blogs.summary}
        </p>
        <div className="text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>{format(new Date(blogs.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NoNews() {
  const [searchParam] = useSearchParams();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-muted p-3 mb-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No items found</h3>
        <p className="text-muted-foreground text-center mb-4">
          {searchParam.toString()?.length > 0
            ? "No items match your search criteria"
            : "You haven't added any blogs or events yet"}
        </p>
        {!searchParam.toString() ||
          (searchParam.toString()?.length === 0 && (
            <Button asChild>
              <Link to="/news/new">
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Item
              </Link>
            </Button>
          ))}
      </CardContent>
    </Card>
  );
}
