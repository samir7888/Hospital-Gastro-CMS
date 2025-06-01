"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { type Services, type ServicesResponse } from "@/schema/services-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/pagination/pagination";
import SearchInput from "@/components/helpers/search-input";

export default function ServicesListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchParam] = useSearchParams();
  const {
    data: servicesResponse,
    isLoading,
    error,
  } = useAppQuery<ServicesResponse>({
    url: `/services?${searchParam.toString()}`,
    queryKey: ["services", searchParam.toString()],
  });

  const { mutate: deleteService, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: "/services",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setDeletingId(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);

      setDeletingId(null);
    },
  });

  const handleEdit = (serviceId: string) => {
    navigate(`/services/edit/${serviceId}`);
  };

  const handleDelete = (serviceId: string) => {
    setDeletingId(serviceId);
    deleteService({ id: serviceId });
  };

  const handleCreateNew = () => {
    navigate("/services/create");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground">Manage your services</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground">Manage your services</p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-destructive mb-4">
              {error.message || "failed to load"}
            </p>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["services"] })
              }
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const services = servicesResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your services ({services.length} total)
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
      <SearchInput />
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No services yet</h3>
                <p className="text-muted-foreground">
                  Get started by creating your first service
                </p>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Service
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === service.id && isDeleting}
              />
            ))}
          </div>

          {/* Pagination Info */}
          {servicesResponse?.meta && (
            <PaginationComponent meta={servicesResponse.meta} />
          )}
        </>
      )}
    </div>
  );
}

interface ServiceCardProps {
  service: Services;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
  isDeleting,
}: ServiceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-1">
              {service.title}
            </CardTitle>
            <CardDescription className="text-xs">
              Created {formatDate(service.createdAt)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cover Image */}
        {service.coverImage?.url && (
          <div className="aspect-[1/1] relative overflow-hidden rounded-md bg-muted">
            <img
              src={service.coverImage.url}
              alt={service.title}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.summary}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(service.id)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Service</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{service.title}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(service.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
