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
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Appointment } from "@/schema/appointment-schema";
import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/utils/react-query";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useState } from "react";

export default function AppointmentDetailsPage({
  appointment,
}: {
  appointment: Appointment;
}) {
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/appointments"
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to appointments
        </Link>
        <div className="">
          <Dialog
            open={deleteDialogId === appointment.id}
            onOpenChange={(open) => !open && setDeleteDialogId(null)}
          >
            <DialogTrigger asChild>
              <Button
              variant={"destructive"}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogId(appointment.id);
                }}
              >Delete
                {/* <Trash2 className="w-3 h-3" /> */}
              </Button>
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
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Appointment #{appointment.id}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Patient Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">
                    {appointment.firstName} {appointment.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{appointment.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{appointment.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium capitalize">
                    {appointment.address}
                  </p>
                </div>
              </div>
            </div>

            {/* {appointment.medicalHistory.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
                  Medical History
                </h2>
                <div className="space-y-4">
                  {appointment.medicalHistory.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm text-gray-500">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Appointment Details
            </h2>
            <div className="space-y-4">
              {/* associated doctors */}

              {/* <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <div>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <Link
                      to={`/doctors/${appointment.doctorId}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Doctor Profile
                    </Link>
                  </div>
                </div>
              </div> */}

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium capitalize">
                    {appointment.specialization}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-900">
                      {format(
                        new Date(appointment.preferredDate),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {format(new Date(appointment.preferredDate), " h:mm a")}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Additional Notes</h3>
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="text-sm">
                    {appointment.message || "No additional notes"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t text-sm text-gray-500">
              <p>
                Appointment created on{" "}
                {new Date(appointment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
