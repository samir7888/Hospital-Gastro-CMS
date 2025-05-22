"use client";

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
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";

// Schema for FAQs section header
const faqHeaderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  subtitle: z
    .string()
    .max(200, "Subtitle must not exceed 200 characters")
    .optional(),
  searchPlaceholder: z
    .string()
    .max(100, "Placeholder text must not exceed 100 characters")
    .optional(),
});

// Schema for individual FAQ item
const faqItemSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .max(200, "Question must not exceed 200 characters"),
  answer: z
    .string()
    .min(1, "Answer is required"),
  category: z
    .string()
    .min(1, "Category is required"),
});

type FAQHeaderFormValues = z.infer<typeof faqHeaderSchema>;
type FAQItemFormValues = z.infer<typeof faqItemSchema>;

export default function FAQSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddFAQDialog, setShowAddFAQDialog] = useState(false);
  const [showEditFAQDialog, setShowEditFAQDialog] = useState(false);
  const [currentEditingFAQ, setCurrentEditingFAQ] = useState<{ id: string; question: string; answer: string; category: string } | null>(null);
  
  // Initial categories
  const [categories, setCategories] = useState([
    "All Questions",
    "Admissions & Registration",
    "Insurance & Billing",
    "Visitation",
    "Medical Records & Prescriptions",
    "Facilities & Amenities",
    "Emergency Care"
  ]);
  
  // State for new category input
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  
  // Initial FAQ items
  const [faqItems, setFaqItems] = useState([
    {
      id: "1",
      question: "What should I bring for hospital admission?",
      answer: "<p>For your hospital admission, please bring:</p><ul><li>Photo ID and insurance card</li><li>List of current medications</li><li>Any relevant medical records</li><li>Comfortable clothing and personal hygiene items</li><li>Any medical devices you regularly use (CPAP, etc.)</li></ul><p>Leave valuables at home if possible.</p>",
      category: "Admissions & Registration"
    },
    {
      id: "2",
      question: "How do I pre-register for an upcoming appointment or procedure?",
      answer: "<p>You can pre-register for your appointment or procedure in several ways:</p><ul><li>Online through our patient portal</li><li>By phone at (555) 123-4567</li><li>In person at our registration desk during business hours</li></ul><p>Pre-registering saves time on the day of your appointment and helps us better prepare for your visit.</p>",
      category: "Admissions & Registration"
    },
    {
      id: "3",
      question: "Do I need a referral to see a specialist?",
      answer: "<p>Whether you need a referral depends on your insurance plan:</p><ul><li>HMO plans typically require referrals for specialist visits</li><li>PPO plans usually allow direct access to specialists</li><li>Medicare may require referrals for certain specialists</li></ul><p>We recommend checking with your insurance provider about their specific requirements before scheduling an appointment.</p>",
      category: "Insurance & Billing"
    }
  ]);
  
  // Form for FAQ section header
  const headerForm = useForm<FAQHeaderFormValues>({
    resolver: zodResolver(faqHeaderSchema),
    defaultValues: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to commonly asked questions about our services, policies, and procedures.",
      searchPlaceholder: "Search for questions..."
    },
  });
  
  // Form for adding/editing individual FAQ items
  const faqItemForm = useForm<FAQItemFormValues>({
    resolver: zodResolver(faqItemSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "All Questions"
    },
  });
  
  function onHeaderSubmit(data: FAQHeaderFormValues) {
    setIsLoading(true);
    
    // In a real app, you would save the header data
    setTimeout(() => {
      setIsLoading(false);
      console.log("Header data:", data);
    }, 1000);
  }
  
  function openAddFAQDialog() {
    faqItemForm.reset({
      question: "",
      answer: "",
      category: "All Questions"
    });
    setShowAddFAQDialog(true);
  }
  
  function openEditFAQDialog(faq: { id: string; question: string; answer: string; category: string }) {
    setCurrentEditingFAQ(faq);
    faqItemForm.reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setShowEditFAQDialog(true);
  }
  
  function onAddFAQSubmit(data: FAQItemFormValues) {
    const newId = (faqItems.length + 1).toString();
    const newFAQ = {
      id: newId,
      question: data.question,
      answer: data.answer,
      category: data.category
    };
    
    setFaqItems([...faqItems, newFAQ]);
    setShowAddFAQDialog(false);
    faqItemForm.reset();
  }
  
  function onEditFAQSubmit(data: FAQItemFormValues) {
    if (!currentEditingFAQ) return;
    
    const updatedFAQs = faqItems.map(faq => {
      if (faq.id === currentEditingFAQ.id) {
        return {
          ...faq,
          question: data.question,
          answer: data.answer,
          category: data.category
        };
      }
      return faq;
    });
    
    setFaqItems(updatedFAQs);
    setShowEditFAQDialog(false);
    setCurrentEditingFAQ(null);
  }
  
  function deleteFAQ(id: string) {
    setFaqItems(faqItems.filter(faq => faq.id !== id));
  }
  
  function addCategory() {
    if (newCategory.trim() === "" || categories.includes(newCategory.trim())) return;
    
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
    setShowAddCategoryInput(false);
  }
  
  function deleteCategory(category: string) {
    if (category === "All Questions") return; // Prevent deleting the default category
    
    // Update any FAQs in this category to "All Questions"
    const updatedFAQs = faqItems.map(faq => {
      if (faq.category === category) {
        return { ...faq, category: "All Questions" };
      }
      return faq;
    });
    
    setFaqItems(updatedFAQs);
    setCategories(categories.filter(cat => cat !== category));
  }
  
  function handleAnswerChange(html: string) {
    faqItemForm.setValue("answer", html);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Section</h1>
        <p className="text-muted-foreground">
          Manage the Frequently Asked Questions section of your website
        </p>
      </div>

      <Tabs defaultValue="header">
        <TabsList className="mb-6">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="header">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Header</CardTitle>
              <CardDescription>
                Update the main heading and subtitle for your FAQ section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...headerForm}>
                <form
                  onSubmit={headerForm.handleSubmit(onHeaderSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={headerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title" {...field} />
                        </FormControl>
                        <FormDescription>
                          The main heading for your FAQ section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={headerForm.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Subtitle</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter a subtitle" {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief description that appears below the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={headerForm.control}
                    name="searchPlaceholder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Placeholder</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Search for questions..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Placeholder text for the search input
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Categories</CardTitle>
              <CardDescription>
                Manage the categories for organizing your FAQs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Current Categories</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{category}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteCategory(category)}
                        disabled={category === "All Questions"} // Prevent deleting the default category
                      >
                        {category === "All Questions" ? "Default" : "Remove"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {showAddCategoryInput ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Add New Category</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter category name"
                      className="flex-1"
                    />
                    <Button onClick={addCategory}>Add</Button>
                    <Button variant="outline" onClick={() => setShowAddCategoryInput(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowAddCategoryInput(true)}>
                  Add New Category
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>FAQ Questions</CardTitle>
                <CardDescription>
                  Manage your frequently asked questions and answers
                </CardDescription>
              </div>
              <Button onClick={openAddFAQDialog}>Add New FAQ</Button>
            </CardHeader>
            <CardContent>
              {categories.filter(cat => cat !== "All Questions").map((category) => {
                const categoryFAQs = faqItems.filter(faq => faq.category === category);
                if (categoryFAQs.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{category}</h3>
                    <div className="space-y-2">
                      {categoryFAQs.map((faq) => (
                        <div key={faq.id} className="border rounded-md">
                          <div className="flex items-center justify-between p-3 bg-muted">
                            <h4 className="font-medium">{faq.question}</h4>
                            <div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditFAQDialog(faq)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteFAQ(faq.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div 
                            className="p-3 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Show FAQs without a category or with "All Questions" category */}
              {faqItems.filter(faq => !categories.includes(faq.category) || faq.category === "All Questions").length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Uncategorized</h3>
                  <div className="space-y-2">
                    {faqItems
                      .filter(faq => !categories.includes(faq.category) || faq.category === "All Questions")
                      .map((faq) => (
                        <div key={faq.id} className="border rounded-md">
                          <div className="flex items-center justify-between p-3 bg-muted">
                            <h4 className="font-medium">{faq.question}</h4>
                            <div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditFAQDialog(faq)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteFAQ(faq.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div 
                            className="p-3 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Add FAQ Dialog */}
          <Dialog open={showAddFAQDialog} onOpenChange={setShowAddFAQDialog}>
            <DialogContent className="max-w-2xl ">
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
                <DialogDescription>
                  Create a new frequently asked question and answer
                </DialogDescription>
              </DialogHeader>
              
              <Form {...faqItemForm}>
                <form onSubmit={faqItemForm.handleSubmit(onAddFAQSubmit)} className="space-y-6">
                  <FormField
                    control={faqItemForm.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={faqItemForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category, index) => (
                              <SelectItem key={index} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={faqItemForm.control}
                    name="answer"
                    render={() => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <TiptapEditor
                            content={faqItemForm.getValues("answer") || ""}
                            onChange={handleAnswerChange}
                            placeholder="Enter the answer..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddFAQDialog(false)} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Save FAQ</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Edit FAQ Dialog */}
          <Dialog open={showEditFAQDialog} onOpenChange={setShowEditFAQDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit FAQ</DialogTitle>
                <DialogDescription>
                  Update this frequently asked question and answer
                </DialogDescription>
              </DialogHeader>
              
              <Form {...faqItemForm}>
                <form onSubmit={faqItemForm.handleSubmit(onEditFAQSubmit)} className="space-y-6">
                  <FormField
                    control={faqItemForm.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={faqItemForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category, index) => (
                              <SelectItem key={index} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={faqItemForm.control}
                    name="answer"
                    render={() => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <TiptapEditor
                            content={faqItemForm.getValues("answer") || ""}
                            onChange={handleAnswerChange}
                            placeholder="Enter the answer..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEditFAQDialog(false)} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Update FAQ</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Preview how your FAQ section will look on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow">
                <div className="container mx-auto py-8 px-4">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{headerForm.getValues("title")}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {headerForm.getValues("subtitle")}
                    </p>
                  </div>
                  
                  <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        className="pl-10" 
                        placeholder={headerForm.getValues("searchPlaceholder")} 
                      />
                    </div>
                  </div>
                  
                  <div className="max-w-3xl mx-auto">
                    <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className={`px-4 py-2 rounded-full cursor-pointer whitespace-nowrap ${
                            index === 0 
                              ? "bg-blue-600 text-white" 
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                    
                    <div className="mt-12 bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-center">Still have questions?</h3>
                      <p className="text-center mb-6">
                        Our patient support team is available to help you with any questions not answered here.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg text-center">
                          <h4 className="font-semibold mb-2">Call Us</h4>
                          <p className="mb-1">Monday to Friday, 8am - 6pm</p>
                          <p className="font-semibold">(555) 123-4567</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg text-center">
                          <h4 className="font-semibold mb-2">Email Us</h4>
                          <p className="mb-1">We'll respond within 24 hours</p>
                          <p className="font-semibold">support@medcarehospital.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}