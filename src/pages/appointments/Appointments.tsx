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
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Users,
  Trash2,
  Eye,
  Search,
  Filter,
  Phone,
  MapPin,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppMutation, useAppQuery } from "@/utils/react-query";
import type {
  Appointment,
  AppointmentResponse,
} from "@/schema/appointment-schema";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import PaginationComponent from "@/components/pagination/pagination";
import SearchInput from "@/components/helpers/search-input";

export default function AppointmentsPage() {
  const [filter, setFilter] = useState({
    doctor: "",
    department: "",
    status: "",
    dateRange: { start: "", end: "" },
  });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-full">
      <div className="mb-6 flex flex-col">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p>View and manage Appointments information</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <SearchInput />
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 border rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* {showFilters && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            className="p-2 border rounded"
            value={filter.doctor}
            onChange={(e) => setFilter({ ...filter, doctor: e.target.value })}
          >
            <option value="">All Doctors</option>
            {appointments.map((doctor) => (
              <option key={doctor} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={filter.department}
            onChange={(e) =>
              setFilter({ ...filter, department: e.target.value })
            }
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              className="p-2 border rounded flex-1"
              value={filter.dateRange.start}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  dateRange: { ...filter.dateRange, start: e.target.value },
                })
              }
            />
            <input
              type="date"
              className="p-2 border rounded flex-1"
              value={filter.dateRange.end}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  dateRange: { ...filter.dateRange, end: e.target.value },
                })
              }
            />
          </div>

          <button
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() =>
              setFilter({
                doctor: "",
                department: "",
                status: "",
                dateRange: { start: "", end: "" },
              })
            }
          >
            Clear Filters
          </button>
        </div>
      )} */}

      <AppointmentsTable />
    </div>
  );
}

function AppointmentsTable() {
  const [searchParam] = useSearchParams();

  const {
    data: appointments,
    isLoading,
    isError,
  } = useAppQuery<AppointmentResponse>({
    queryKey: ["appointments", searchParam.toString()],
    url: `/appointments?${searchParam.toString()}`,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!appointments) {
    return <div>No appointments found</div>;
  }
  // <NoDoctors />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appointments?.data.map((appointment) => (
            <AppointmentList appointment={appointment} />
          ))}
        </tbody>
      </table>
      <PaginationComponent meta={appointments.meta} />
    </div>
  );
}

function AppointmentList({ appointment }: { appointment: Appointment }) {
  const queryClient = useQueryClient();
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const { mutateAsync: deleteDoctor, isPending: isDeleting } = useAppMutation({
    type: "delete",
    url: `/appointments`,
    onSuccess: () => {
      // Optionally refetch or update the UI
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: () => {
      // Optionally show an error toast
    },
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
