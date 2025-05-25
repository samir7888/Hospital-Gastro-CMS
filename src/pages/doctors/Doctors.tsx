"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";

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
import { Link, useSearchParams } from "react-router-dom";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import type { Doctor, DoctorsResponse } from "@/schema/Doctors";
import { useQueryClient } from "@tanstack/react-query";
import SearchInput from "@/components/search/search-input";
import PaginationComponent from "@/components/pagination/pagination";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">
            Manage specialist doctors information
          </p>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link to="/doctors/new">
            <UserPlus className="h-4 w-4 mr-1" />
            Add New Doctor
          </Link>
        </Button>
      </div>
      <SearchInput />
      <DoctorsGrid />
    </div>
  );
}

function DoctorsGrid() {
  const [searchParam] = useSearchParams();

  const {
    data: doctors,
    isLoading,
    isError,
  } = useAppQuery<DoctorsResponse>({
    queryKey: ["doctors", searchParam.toString()],
    url: `/doctors?${searchParam.toString()}`,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    <NoDoctors />;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.data.map((doctor) => (
          <>
            <DoctorCard key={doctor.id} doctor={doctor} />
          </>
        ))}
      </div>
      {doctors?.meta && (
        <div>
          <PaginationComponent meta={doctors?.meta} />
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteDoctor, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: `/doctors/${doctor.id}`,
    onSuccess: () => {
      // Optionally refetch or update the UI
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: () => {
      // Optionally show an error toast
    },
  });

  const handleDeleteConfirm = () => {
    deleteDoctor({});
  };

  return (
    <Card key={doctor.id} className="overflow-hidden group">
      <div className="aspect-square relative">
        <img
          src={doctor?.profileImage?.url || "https://via.placeholder.com/150"}
          alt={doctor.name}
          className="object-cover w-full h-full rounded-2xl transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="space-x-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/doctors/${doctor.id}`}>
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {doctor.name}'s profile. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteConfirm()}
                    disabled={isDeleting}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg truncate capitalize">
          {doctor.name}
        </h3>
        <div className="flex items-center mt-1 mb-2">
          <Badge variant="outline" className="font-normal p-2 px-3">
            {doctor.specialization}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>{doctor.certifications}</p>
          <p>{doctor.experience} years of experience</p>
        </div>
      </CardContent>
    </Card>
  );
}

function NoDoctors() {
  const [searchParam] = useSearchParams();
  const searchTerm = searchParam.get("search") || "";

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-muted p-3 mb-3">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-center mb-4">
          {searchTerm
            ? "No doctors match your search criteria"
            : "You haven't added any doctors yet"}
        </p>
        {!searchTerm && (
          <Button asChild>
            <Link to="/doctors/new">
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Doctor
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
