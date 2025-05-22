"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  MessageSquare,
  Quote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

// Mock data for testimonials
const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    image:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5,
    department: "Cardiology",
    comment:
      "The care I received at the cardiology department was exceptional. Dr. Smith and his team were thorough, compassionate, and took the time to explain everything to me. I wouldn't go anywhere else for my heart care.",
  },
  {
    id: "2",
    name: "David Wilson",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 4,
    department: "Orthopedics",
    comment:
      "After my knee replacement surgery, the recovery process was made much easier thanks to the excellent physical therapy team. They were professional, motivating, and helped me achieve a full recovery.",
  },
  {
    id: "3",
    name: "Emily Parker",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 5,
    department: "Pediatrics",
    comment:
      "The pediatric staff made my daughter feel so comfortable during her stay. They were not only medically excellent but also showed genuine care and compassion. The child-friendly environment helped reduce her anxiety significantly.",
  },
  {
    id: "4",
    name: "Michael Thompson",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    rating: 4,
    department: "Neurology",
    comment:
      "I was nervous about my neurological testing, but the staff was reassuring and professional. The neurologist took time to thoroughly explain my condition and treatment options. I felt well-informed about my care plan.",
  },
];

export default function TestimonialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  // const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const filteredItems = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    // In a real app, you would make an API call to delete the testimonial
    setTimeout(() => {
      setIsDeleting(false);
      // setSelectedItemId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage patient testimonials and reviews
          </p>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link to="/testimonials/new">
            <Plus className="h-4 w-4 mr-1" />
            Add New Testimonial
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search testimonials..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              No testimonials found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? "No testimonials match your search criteria"
                : "You haven't added any testimonials yet"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/testimonials/new">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Testimonial
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((testimonial) => (
            <Card key={testimonial.id} className="group relative">
              <CardContent className="pt-6">
                <div className="absolute -top-5 left-6">
                  <Quote className="h-10 w-10 text-blue-500/20" />
                </div>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{testimonial.name}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {testimonial.department}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.comment}
                    </p>
                  </div>
                </div>
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link to={`/testimonials/${testimonial.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this testimonial from{" "}
                          {testimonial.name}. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
