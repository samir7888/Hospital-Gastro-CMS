"use client"

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
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
import { Link } from "react-router-dom";

// Mock data for doctors
const doctors = [
  {
    id: "1",
    name: "Dr. John Smith",
    specialty: "Cardiology",
    image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    qualification: "MD, PhD",
    experience: "15 years",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    specialty: "Neurology",
    image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    qualification: "MD",
    experience: "10 years",
  },
  {
    id: "3",
    name: "Dr. Robert Williams",
    specialty: "Pediatrics",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    qualification: "MD, FAAP",
    experience: "12 years",
  },
  {
    id: "4",
    name: "Dr. Emily Davis",
    specialty: "Dermatology",
    image: "https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    qualification: "MD, FAAD",
    experience: "8 years",
  },
];

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  // const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const filteredDoctors = doctors.filter(
    doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    // In a real app, you would make an API call to delete the doctor
    setTimeout(() => {
      setIsDeleting(false);
      // setSelectedDoctorId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
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

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-3">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No doctors found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "No doctors match your search criteria" : "You haven't added any doctors yet"}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden group">
              <div className="aspect-[3/2] relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="space-x-2">
                    <Button asChild size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                      <Link to={`/doctors/${doctor.id}`}>
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="bg-red-500/90 hover:bg-red-500">
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle >Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription >
                            This will permanently delete {doctor.name}'s profile. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-white">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
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
                <h3 className="font-semibold text-lg truncate">{doctor.name}</h3>
                <div className="flex items-center mt-1 mb-2">
                  <Badge variant="outline" className="font-normal">
                    {doctor.specialty}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{doctor.qualification}</p>
                  <p>{doctor.experience} experience</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}