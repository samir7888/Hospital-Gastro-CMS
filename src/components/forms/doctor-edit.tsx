
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  availability: z.string().optional(),
  bio: z.string().min(1, "Bio is required"),
});

type DoctorFormValues = z.infer<typeof formSchema>;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";





const doctorData = {
  "1": {
    id: "1",
    name: "Dr. John Smith",
    specialty: "Cardiology",
    image:
      "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    qualification: "MD, PhD",
    experience: "15 years",
    email: "john.smith@hospital.com",
    phone: "(123) 456-7890",
    availability: "Mon, Wed, Fri 9AM-5PM",
    bio: "<p>Dr. John Smith is a renowned cardiologist with over 15 years of experience in treating various heart conditions. He specializes in interventional cardiology and has performed thousands of successful procedures.</p><p>Dr. Smith completed his medical education at Harvard Medical School and received his PhD in Cardiovascular Research from Johns Hopkins University. He is board certified in Internal Medicine and Cardiology.</p><p>He has published numerous research papers in top medical journals and is actively involved in clinical trials to advance cardiac care.</p>",
  },
  "2": {
    id: "2",
    name: "Dr. Sarah Johnson",
    specialty: "Neurology",
    image:
      "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    qualification: "MD",
    experience: "10 years",
    email: "sarah.johnson@hospital.com",
    phone: "(123) 456-7891",
    availability: "Tue, Thu 8AM-4PM",
    bio: "<p>Dr. Sarah Johnson is a specialized neurologist with expertise in treating complex neurological disorders. With 10 years of experience, she has helped numerous patients with conditions ranging from migraines to multiple sclerosis.</p><p>Dr. Johnson graduated from Yale School of Medicine and completed her residency at Mayo Clinic. She is board certified in Neurology and has additional certification in Headache Medicine.</p>",
  },
  new: {
    id: "new",
    name: "",
    specialty: "",
    image: "",
    qualification: "",
    experience: "",
    email: "",
    phone: "",
    availability: "",
    bio: "<p></p>",
  },
};



export default function DoctorEditForm() {
 
  const { id } = useParams();
  // const isNew = id === "new";

  const doctor = doctorData[id as keyof typeof doctorData] || doctorData["new"];
  const [isLoading, setIsLoading] = useState(false);
  const [doctorImage, setDoctorImage] = useState<File | null>(null);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor.name,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      email: doctor.email,
      phone: doctor.phone,
      availability: doctor.availability,
      bio: doctor.bio,
    },
  });

  function onSubmit(data: DoctorFormValues) {
    setIsLoading(true);
console.log("first",data)
    // In a real app, you would upload the image and save the form data
    setTimeout(() => {
      setIsLoading(false);
     
    }, 1000);

    console.log(data, doctorImage);
  }

  function handleBioChange(html: string) {
    form.setValue("bio", html);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild className="mr-4">
          <Link to="/doctors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Doctors
          </Link>
        </Button>
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Doctor's Photo</CardTitle>
              <CardDescription>
                Upload a professional photo of the doctor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileChange={setDoctorImage}
                currentImage={ doctor.image}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the doctor's basic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialty</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a specialty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-200">
                              <SelectItem value="Cardiology">
                                Cardiology
                              </SelectItem>
                              <SelectItem value="Neurology">
                                Neurology
                              </SelectItem>
                              <SelectItem value="Pediatrics">
                                Pediatrics
                              </SelectItem>
                              <SelectItem value="Orthopedics">
                                Orthopedics
                              </SelectItem>
                              <SelectItem value="Dermatology">
                                Dermatology
                              </SelectItem>
                              <SelectItem value="Gastroenterology">
                                Gastroenterology
                              </SelectItem>
                              <SelectItem value="Oncology">Oncology</SelectItem>
                              <SelectItem value="Psychiatry">
                                Psychiatry
                              </SelectItem>
                              <SelectItem value="Ophthalmology">
                                Ophthalmology
                              </SelectItem>
                              <SelectItem value="Urology">Urology</SelectItem>
                              <SelectItem value="Gynecology">
                                Gynecology
                              </SelectItem>
                              <SelectItem value="Dentistry">
                                Dentistry
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifications</FormLabel>
                          <FormControl>
                            <Input placeholder="MD, PhD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="15 years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Add contact details and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="doctor@hospital.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mon, Wed, Fri 9AM-5PM"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specify the days and hours when the doctor is
                          available
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                  <CardDescription>
                    Write a detailed biography of the doctor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TiptapEditor
                            content={field.value}
                            onChange={handleBioChange}
                            placeholder="Write the doctor's bio here..."
                            className="min-h-[300px]"
                          />
                          {/* <Editor /> */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/doctors">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
