// app/dashboard/appointments/page.jsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Clock, User, Trash2, Eye, Phone, MapPin } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import type {
  Appointment,
  AppointmentResponse,
} from "@/schema/appointment-schema";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/pagination/pagination";
import SearchInput from "@/components/helpers/search-input";

export default function AppointmentsPage() {
  return (
    <div className="max-w-full">
      <div className="mb-6 flex flex-col">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p>View and manage Appointments information</p>
      </div>

      <div className="mb-6 ">
        <div className="relative flex-1">
          <SearchInput />
        </div>
      </div>

      <AppointmentsTable />
    </div>
  );
}

function AppointmentsTable() {
  const [searchParam] = useSearchParams();

  const { data: appointments, isLoading } = useAppQuery<AppointmentResponse>({
    queryKey: ["appointments", searchParam.toString()],
    url: `/appointments?${searchParam.toString()}`,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!appointments || appointments.data.length === 0) {
    return <NoAppointments />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">{/* ... header rows ... */}</thead>
        <tbody className="divide-y divide-gray-200">
          {appointments.data.map((appointment) => (
            <AppointmentList key={appointment.id} appointment={appointment} />
          ))}
        </tbody>
      </table>
      <PaginationComponent meta={appointments.meta} />
    </div>
  );
}

function AppointmentList({ appointment }: { appointment: Appointment }) {
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const { mutateAsync: deleteDoctor, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: `/appointments`,
    queryKey: ["appointments"],
  });

  const handleDelete = (id: string) => {
    deleteDoctor({ id });
  };
  return (
    <tr key={appointment.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 capitalize">
              {appointment.firstName} {appointment.lastName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <Phone className="h-4 w-4 text-green-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {appointment.phone}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 mt-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {format(new Date(appointment.preferredDate), "MMM d, yyyy, h:mm a")}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 capitalize">
          <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <MapPin className="h-4 w-4 " />
          </div>
          <span className="text-sm text-gray-900">{appointment.address}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <Link
            to={`${appointment.id}`}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <Dialog
            open={deleteDialogId === appointment.id}
            onOpenChange={(open) => !open && setDeleteDialogId(null)}
          >
            <DialogTrigger asChild>
              <button
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogId(appointment.id);
                }}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete appointment detail</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this appointment detail?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDeleteDialogId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(appointment.id);
                    setDeleteDialogId(null);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}

function NoAppointments() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          No appointments found.
        </p>
        <p className="text-sm text-gray-500">
          The appointments you are looking for may have been deleted or not
          present.
        </p>
      </div>
    </div>
  );
}
