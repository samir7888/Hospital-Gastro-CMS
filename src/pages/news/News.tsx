"use client"

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
  Calendar, 
  Clock, 
  FileText,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { format } from "date-fns";
import { Link } from "react-router-dom";
// Mock data for news and events
const newsAndEvents = [
  {
    id: "1",
    title: "New Cardiac Center Opening",
    type: "news",
    date: "2025-05-15",
    image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    excerpt: "Our hospital is proud to announce the opening of a new state-of-the-art cardiac center.",
    content: "<p>Our hospital is proud to announce the opening of a new state-of-the-art cardiac center. The center will provide comprehensive cardiac care including diagnostics, interventions, and rehabilitation services.</p><p>The facility features the latest medical technology and will be staffed by our team of expert cardiologists and cardiac surgeons.</p>",
    published: true,
  },
  {
    id: "2",
    title: "Annual Health Awareness Camp",
    type: "event",
    date: "2025-06-20",
    time: "9:00 AM - 4:00 PM",
    location: "Hospital Grounds",
    image: "https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    excerpt: "Join us for our annual health awareness camp featuring free health checkups and consultations.",
    content: "<p>Join us for our annual health awareness camp featuring free health checkups and consultations. The event will include:</p><ul><li>Blood pressure screening</li><li>Blood sugar testing</li><li>BMI assessment</li><li>Nutrition counseling</li><li>Dental checkups</li></ul><p>Medical professionals will be available to provide guidance on maintaining good health and preventing common diseases.</p>",
    published: true,
  },
  {
    id: "3",
    title: "New Advanced MRI Machine Installation",
    type: "news",
    date: "2025-04-30",
    image: "https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    excerpt: "Our hospital has installed a new advanced MRI machine to provide better diagnostic capabilities.",
    content: "<p>Our hospital has installed a new advanced MRI machine to provide better diagnostic capabilities. The new machine offers higher resolution images and faster scan times, improving both the quality of care and patient comfort.</p><p>This investment is part of our ongoing commitment to providing the best possible healthcare services using cutting-edge technology.</p>",
    published: true,
  },
  {
    id: "4",
    title: "Medical Conference on Pandemic Preparedness",
    type: "event",
    date: "2025-07-10",
    time: "10:00 AM - 5:00 PM",
    location: "Hospital Auditorium",
    image: "https://images.pexels.com/photos/8942986/pexels-photo-8942986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    excerpt: "A conference for medical professionals on pandemic preparedness and response strategies.",
    content: "<p>A conference for medical professionals on pandemic preparedness and response strategies. The conference will feature presentations from renowned epidemiologists, infectious disease specialists, and public health experts.</p><p>Topics will include early detection systems, containment protocols, resource allocation during crisis, and community education strategies.</p>",
    published: false,
  },
];

export default function NewsAndEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredItems = newsAndEvents.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    // In a real app, you would make an API call to delete the item
    setTimeout(() => {
      setIsDeleting(false);
      // setSelectedItemId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News & Events</h1>
          <p className="text-muted-foreground">
            Manage news articles and upcoming events
          </p>
        </div>
        <Button asChild className="flex items-center gap-1">
          <Link to="/news/new">
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No items found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "No items match your search criteria" : "You haven't added any news or events yet"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/news/new">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Item
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col">
              <div className="aspect-[16/9] relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <div className="space-x-2">
                    <Button asChild size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                      <Link to={`/news/${item.id}`}>
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
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{item.title}". This action cannot be undone.
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
                  <Button asChild size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Link to={`/news/${item.id}/preview`}>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Preview
                    </Link>
                  </Button>
                </div>
              </div>
              <CardContent className="pt-4 pb-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={item.type === "news" ? "default" : "secondary"} className="capitalize">
                    {item.type}
                  </Badge>
                  {!item.published && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Draft
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                  {item.excerpt}
                </p>
                <div className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>{format(new Date(item.date), "MMM d, yyyy")}</span>
                  </div>
                  {item.type === "event" && item.time && (
                    <div className="flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>{item.time}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}