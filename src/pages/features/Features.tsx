import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FeatureResponse } from "@/schema/feature-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FeaturesPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Features
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage why to choose your hospital and what features you offer
          </p>
        </div>
        <Button asChild className="flex items-center gap-2 w-full sm:w-auto">
          <Link to="/features/new">
            <Plus className="h-4 w-4" />
            Add New Feature
          </Link>
        </Button>
      </div>
      <FeaturesGrid />
    </div>
  );
}

function FeaturesGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: features,
    isLoading,
    isError,
  } = useAppQuery<FeatureResponse>({
    queryKey: ["features"],
    url: "/features",
  });

  const { mutateAsync: deleteFeature, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: "/features",
  });

  const navigate = useNavigate();

  const handleDelete = async (featureID: string) => {
    await deleteFeature({ id: featureID });
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <NoFeatures />;
  }

  if (!features || features.length === 0) {
    return <NoFeatures />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {features.map((feature, index) => (
        <Card
          key={feature.id || index}
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
        >
          <CardContent className="p-0 h-full">
            <div className="h-full flex flex-col">
              {/* Feature Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image?.url || "/api/placeholder/400/300"}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Feature Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Mobile-only action buttons (visible on non-hover devices) */}
                <div className=" flex  items-center justify-between pt-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/features/${feature.id}`, { state: feature })
                    }
                    className="flex items-center gap-1 text-xs"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>

                  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {isDeleting ? "..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Feature</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{feature.title}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          type="button"
                          variant={"destructive"}
                          onClick={() => handleDelete(feature.id)}
                          disabled={isDeleting}
                          className={buttonVariants({ variant: "destructive" })}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NoFeatures() {
  return (
    <div className="flex flex-col items-center justify-center h-64 md:h-96 text-center px-4">
      <div className="space-y-4">
        <div className="text-4xl md:text-6xl opacity-20">🏥</div>
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            No features found
          </h3>
          <p className="text-sm md:text-base text-muted-foreground max-w-md">
            Add some features to showcase what makes your hospital unique and
            attract more patients.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link to="/features/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Feature
          </Link>
        </Button>
      </div>
    </div>
  );
}
