"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Star, Quote, MessageSquare } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import type {
  ITestimonial,
  TestimonialResponse,
} from "@/schema/testmonial-schema";
import { useAppMutation, useAppQuery } from "@/utils/react-query";

// Star Rating Component with half star support
function StarRating({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) {
  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    const filled = rating >= i;
    const halfFilled = rating >= i - 0.5 && rating < i;
    
    stars.push(
      <div key={i} className="relative inline-block">
        {/* Background star (empty) */}
        <Star className="h-4 w-4 text-gray-300" />
        
        {/* Filled star overlay */}
        {filled && (
          <Star className="absolute top-0 left-0 h-4 w-4 text-yellow-400 fill-yellow-400" />
        )}
        
        {/* Half-filled star overlay */}
        {halfFilled && (
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>
    );
  }
  
  return <div className="flex">{stars}</div>;
}

export default function TestimonialsPage() {
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

      <TestimonialsGrid />
    </div>
  );
}

function TestimonialsGrid() {
  const [searchParam] = useState("");
  const {
    data: testimonials,
    isLoading,
    isError,
  } = useAppQuery<TestimonialResponse>({
    queryKey: ["testimonials", searchParam.toString()],
    url: `/testimonials?${searchParam.toString()}`,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <NoTestimonials />;
  }
 
  if (testimonials?.length === 0) {
    return <NoTestimonials />;
  }
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials?.map((testimonial: ITestimonial) => (
          <>
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          </>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: ITestimonial }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: deleteTestimonial, isPending: isDeleting } =
    useAppMutation({
      type: "delete",
      url: `/testimonials/${testimonial.id}`,
      queryKey: ["testimonials"],
    });

  const handleDeleteConfirm = async() => {
     await deleteTestimonial({});
     setIsOpen(false);
  };

  return (
    <Card key={testimonial.id} className="group relative">
      <CardContent className="pt-6">
        <div className="absolute -top-5 left-6">
          <Quote className="h-10 w-10 text-blue-500/20" />
        </div>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
            <AvatarImage
              src={testimonial?.personImage?.url}
              alt={testimonial.personName}
            />
            <AvatarFallback>{testimonial.personName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{testimonial.personName}</h3>
            <div className="flex flex-col items-start gap-2 mt-1 mb-4">
              {/* Updated to use the new StarRating component */}
              <StarRating rating={testimonial.personRating} />
              <span className="text-sm text-muted-foreground">
                {testimonial.personCompany}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {testimonial.personMessage}
            </p>
          </div>
        </div>
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to={`/testimonials/${testimonial.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
                  {testimonial.personName}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white"
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

function NoTestimonials() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-muted p-3 mb-3">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No testimonials found</h3>
        <p className="text-muted-foreground text-center mb-4">
          "You haven't added any testimonials yet"
        </p>

        <Button asChild>
          <Link to="/testimonials/new">
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Testimonial
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}