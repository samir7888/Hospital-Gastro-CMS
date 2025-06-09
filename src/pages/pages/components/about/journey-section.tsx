"use client";

import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
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
  FormDescription,
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
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface JourneyItem {
  title: string;
  description: string;
}

interface JourneyValues {
  journey: JourneyItem[];
}

interface JourneySectionProps {
  form: UseFormReturn<JourneyValues>;
  onSubmit: (data: JourneyValues) => void;
  isLoading: boolean;
}

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

      <FormField
        control={control}
        name={`journey.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="E.g., New Research Center Opened"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Title for this milestone (3-100 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`journey.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
              className="resize-none"
                placeholder="Describe this milestone in detail..."
                {...field}
                rows={3}
              />
            </FormControl>
            <FormDescription>
              Detailed description of this milestone (10-500 characters)
              <span className="block mt-1 text-right text-xs text-muted-foreground">
                {field.value?.length || 0}/500 characters
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function JourneySection({
  form,
  onSubmit,
  isLoading,
}: JourneySectionProps) {
  const { fields, append, remove, move } = useFieldArray({
    name: "journey",
    control: form.control,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
          Document your hospital's journey and key milestones (maximum 10 milestones)
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
                  onClick={() => append({ 
                    title: "", 
                    description: "" 
                  })}
                  disabled={fields.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Milestone
                </Button>
              </div>

              {fields.length > 0 ? (
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No milestones added yet. Click "Add Milestone" to get started.</p>
                </div>
              )}

              {fields.length >= 10 && (
                <p className="text-sm text-amber-600">
                  Maximum of 10 milestones reached.
                </p>
              )}
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