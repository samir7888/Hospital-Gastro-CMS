"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";


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
import SearchInput from "@/components/helpers/search-input";
import PaginationComponent from "@/components/pagination/pagination";
import type { Staff, StaffsResponse } from "@/schema/staffs-schema";

export default function StaffsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staffs</h1>
          <p className="text-muted-foreground">
            Manage specialist staffs information
          </p>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link to="/staffs/new">
            <UserPlus className="h-4 w-4 mr-1" />
            Add New Staff
          </Link>
        </Button>
      </div>
      <SearchInput />
      <StaffsGrid />
    </div>
  );
}

function StaffsGrid() {
  const [searchParam] = useSearchParams();

  const {
    data: staffs,
    isLoading,
    isError,
  } = useAppQuery<StaffsResponse>({
    queryKey: ["staffs", searchParam.toString()],
    url: `/staffs?${searchParam.toString()}`,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    <NoStaffs />;
  }
  if (staffs?.data.length === 0) {
    return <NoStaffs />;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffs?.data.map((staff) => (
          <>
            <StaffCard key={staff.id} staff={staff} />
          </>
        ))}
      </div>
      {staffs?.meta && (
        <div>
          <PaginationComponent meta={staffs?.meta} />
        </div>
      )}
    </div>
  );
}

function StaffCard({ staff }: { staff: Staff }) {
  const { mutateAsync: deleteStaff, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: `/staffs/${staff.id}`,
    queryKey: ["staffs"],
  });

  const handleDeleteConfirm = () => {
    deleteStaff({});
  };

  return (
    <Card key={staff.id} className="overflow-hidden group">
      <div className="aspect-square relative">
        <img
          src={staff?.profileImage?.url || "https://via.placeholder.com/150"}
          alt={staff.name}
          className="object-cover w-full h-full rounded-2xl transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="space-x-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/staffs/${staff.id}`}>
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
                    This will permanently delete {staff.name}'s profile. This
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
          {staff.name}
        </h3>
      </CardContent>
    </Card>
  );
}

function NoStaffs() {
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
            ? "No staffs match your search criteria"
            : "You haven't added any staffs yet"}
        </p>
        {!searchTerm && (
          <Button asChild>
            <Link to="/staffs/new">
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Staff
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
