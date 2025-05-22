"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type{DragEndEvent} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const journeyItemSchema = z.object({
  year: z.number().int().positive("Year must be a positive number"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const journeySchema = z.object({
  milestones: z.array(journeyItemSchema),
});

type JourneyValues = z.infer<typeof journeySchema>;

interface SortableMilestoneProps {
  id: string;
  index: number;
  control: import("react-hook-form").Control<JourneyValues>;
  onRemove: () => void;
}

function SortableMilestone({ id, index, control, onRemove }: SortableMilestoneProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="border rounded-md p-4 space-y-4 bg-white"
    >
      <div className="flex justify-between items-center">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-move"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`milestones.${index}.year`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="E.g., 2005"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`milestones.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="E.g., Research Center"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`milestones.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe this milestone..."
                {...field}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function JourneySection() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JourneyValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      milestones: [
        {
          year: 1988,
          title: "Foundation",
          description: "Established as a small community hospital with a vision to provide quality healthcare services.",
        },
        {
          year: 1995,
          title: "Major Expansion",
          description: "Expanded facilities to include specialized departments and state-of-the-art equipment.",
        },
        {
          year: 2005,
          title: "Research Center",
          description: "Opened our dedicated research center focusing on innovative medical treatments.",
        },
        {
          year: 2015,
          title: "Digital Transformation",
          description: "Implemented advanced digital health systems and telehealth capabilities.",
        },
        {
          year: 2025,
          title: "Future Vision",
          description: "Continuing to expand our services and embrace cutting-edge medical technologies.",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    name: "milestones",
    control: form.control,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onSubmit(data: JourneyValues) {
    setIsLoading(true);
    // In a real app, you would save the form data to your API
    setTimeout(() => {
      setIsLoading(false);
      console.log("Journey saved:", data);
    }, 1000);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(item => item.id === active.id);
      const newIndex = fields.findIndex(item => item.id === over.id);
      
      move(oldIndex, newIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Journey</CardTitle>
        <CardDescription>
          Document your hospital's journey through the years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Milestones</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ year: new Date().getFullYear(), title: "", description: "" })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Milestone
                </Button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map(field => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <SortableMilestone
                        key={field.id}
                        id={field.id}
                        index={index}
                        control={form.control}
                        onRemove={() => remove(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}