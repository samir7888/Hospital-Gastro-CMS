// app/dashboard/appointments/page.jsx
"use client";

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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AppointmentsPage() {
  interface Appointment {
    id: number;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    status: string;
    notes: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    doctor: "",
    department: "",
    status: "",
    dateRange: { start: "", end: "" },
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real application, fetch from your API
        // const response = await fetch('/api/appointments');
        // const data = await response.json();

        // Mock data for demonstration
        const mockData = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          patientName: `Patient ${i + 1}`,
          patientEmail: `patient${i + 1}@example.com`,
          patientPhone: `(123) 456-${7890 + i}`,
          doctorName: `Dr. ${
            ["Smith", "Johnson", "Williams", "Brown", "Jones"][i % 5]
          }`,
          department: [
            "Cardiology",
            "Neurology",
            "Pediatrics",
            "Orthopedics",
            "Dermatology",
          ][i % 5],
          date: new Date(2025, 3, 29 + (i % 7)).toISOString().split("T")[0],
          time: `${9 + (i % 8)}:00 ${i % 8 < 3 ? "AM" : "PM"}`,
          status: [
            "Confirmed",
            "Pending",
            "Completed",
            "Cancelled",
            "Rescheduled",
          ][i % 5],
          notes: i % 2 === 0 ? "Patient has reported recurring symptoms" : "",
        }));

        setAppointments(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  interface DeleteHandler {
    (id: number): Promise<void>;
  }

  const handleDelete: DeleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        // In a real application, send a delete request to your API
        // await fetch(`/api/appointments/${id}`, { method: 'DELETE' });

        // Remove the appointment from state
        setAppointments(
          appointments.filter((appointment) => appointment.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete appointment:", error);
      }
    }
  };

  const filterAppointments = () => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDoctor = filter.doctor
        ? apt.doctorName.includes(filter.doctor)
        : true;
      const matchesDepartment = filter.department
        ? apt.department === filter.department
        : true;
      const matchesStatus = filter.status ? apt.status === filter.status : true;

      const dateInRange =
        (!filter.dateRange.start || apt.date >= filter.dateRange.start) &&
        (!filter.dateRange.end || apt.date <= filter.dateRange.end);

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesDepartment &&
        matchesStatus &&
        dateInRange
      );
    });
  };

  const filteredAppointments = filterAppointments();

  // Get unique values for filters
  const doctors = [...new Set(appointments.map((apt) => apt.doctorName))];
  const departments = [...new Set(appointments.map((apt) => apt.department))];
  const statuses = [...new Set(appointments.map((apt) => apt.status))];

  return (
    <div className="max-w-full">
      <div className="mb-6 flex flex-col">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p>View and manage Appointments information</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by patient, email, or doctor..."
            className="w-full p-2 pl-10 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 border rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            className="p-2 border rounded"
            value={filter.doctor}
            onChange={(e) => setFilter({ ...filter, doctor: e.target.value })}
          >
            <option value="">All Doctors</option>
            {doctors.map((doctor) => (
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
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-lg text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.patientEmail}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.patientPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctorName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {appointment.date}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {appointment.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`${appointment.id}`}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
