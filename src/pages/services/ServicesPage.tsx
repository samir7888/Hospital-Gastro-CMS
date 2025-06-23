"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Edit, Trash2, Plus, FileText } from "lucide-react";
import { type Services, type ServicesResponse } from "@/schema/services-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/pagination/pagination";
import SearchInput from "@/components/helpers/search-input";
import { useState } from "react";

export default function ServicesListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParam] = useSearchParams();
  const {
    data: servicesResponse,
    isLoading,
    error,
  } = useAppQuery<ServicesResponse>({
    url: `/services?${searchParam.toString()}`,
    queryKey: ["services", searchParam.toString()],
  });

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
        <NoServices />
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
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
}

function ServiceCard({ service }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteService, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: "/services",
  });
  const handleDelete = async (serviceId: string) => {
    await deleteService({ id: serviceId });
    setIsOpen(false);
  };
  const navigate = useNavigate();

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
            onClick={() => navigate(`/services/edit/${service.id}`)}
            className="flex items-center gap-1"
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
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => handleDelete(service.id)}
                  disabled={isDeleting}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
function NoServices() {
  const [searchParam] = useSearchParams();
  const searchTerm = searchParam.get("search") || "";

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-muted p-3 mb-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No services found</h3>
        <p className="text-muted-foreground text-center mb-4">
          {searchTerm
            ? "No items match your search criteria"
            : "You haven't added any services yet"}
        </p>
        {!searchTerm && (
          <Button asChild>
            <Link to="/services/create">
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Service
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
