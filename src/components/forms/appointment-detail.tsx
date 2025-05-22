"use client";

import { useState, useEffect } from "react";

import {
  Calendar,
  Clock,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  FileText,
  ArrowLeft,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function AppointmentDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  interface Appointment {
    id: number;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientAddress: string;
    doctorName: string;
    doctorId: number;
    department: string;
    date: string;
    time: string;
    status: string;
    notes: string;
    createdAt: string;
    medicalHistory: { date: string; type: string; description: string }[];
  }
 
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const parsedId = Number(id);

        if (isNaN(parsedId)) {
          throw new Error("Invalid appointment ID");
        }

        const mockAppointment = {
          id: parsedId,
          patientName: `Patient ${id}`,
          patientEmail: `patient${id}@example.com`,
          patientPhone: `(123) 456-${7890 + parsedId}`,
          patientAddress: `123 Main St, Apt ${id}, Cityville, State, 12345`,
          doctorName: ["Smith", "Johnson", "Williams", "Brown", "Jones"][
            parsedId % 5
          ],
          doctorId: (parsedId % 5) + 1,
          department: [
            "Cardiology",
            "Neurology",
            "Pediatrics",
            "Orthopedics",
            "Dermatology",
          ][parsedId % 5],
          date: new Date(2025, 3, 29 + (parsedId % 7))
            .toISOString()
            .split("T")[0],
          time: `${9 + (parsedId % 8)}:00 ${parsedId % 8 < 3 ? "AM" : "PM"}`,
          status: [
            "Confirmed",
            "Pending",
            "Completed",
            "Cancelled",
            "Rescheduled",
          ][parsedId % 5],
          notes:
            parsedId % 2 === 0
              ? "Patient has reported recurring symptoms. Follow-up appointment recommended in 2 weeks."
              : "First time visit. Patient requires comprehensive examination.",
          createdAt: new Date(2025, 3, 20).toISOString(),
          medicalHistory:
            parsedId % 2 === 0
              ? [
                  {
                    date: "2024-12-15",
                    type: "Visit",
                    description: "Annual checkup",
                  },
                  {
                    date: "2023-08-22",
                    type: "Procedure",
                    description: "Minor surgery",
                  },
                ]
              : [],
        };

        setAppointment(mockAppointment);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        setError("Failed to load appointment details. Please try again.");
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        // In a real application, send a delete request to your API
        // await fetch(`/api/appointments/${id}`, { method: 'DELETE' });

        // Redirect to the appointments list
       
      } catch (error) {
        console.error("Failed to delete appointment:", error);
        setError("Failed to delete appointment. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 p-4 rounded flex items-start gap-3">
          <AlertCircle className="text-red-600 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700">{error || "Appointment not found"}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/appointments"
            className="flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to appointments
          </Link>
        </div>
      </div>
    );
  }

  interface StatusColorMap {
    [key: string]: string;
  }

  const getStatusColor = (status: string): string => {
    const statusColorMap: StatusColorMap = {
      Confirmed: "bg-green-100 text-green-800 border-green-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      Rescheduled: "bg-purple-100 text-purple-800 border-purple-200",
    };

    return (
      statusColorMap[status] || "bg-gray-100 text-gray-800 border-gray-200"
    );
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
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Appointment #{appointment.id}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
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
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{appointment.patientEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{appointment.patientPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{appointment.patientAddress}</p>
                </div>
              </div>
            </div>

            {appointment.medicalHistory.length > 0 && (
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
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Appointment Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
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
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{appointment.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{appointment.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Additional Notes</h3>
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="text-sm">
                    {appointment.notes || "No additional notes"}
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
