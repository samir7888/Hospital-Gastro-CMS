import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useAppQuery } from "@/utils/react-query";
import { useFormContext } from "react-hook-form";
import type { TOptions } from "@/schema/global.schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const CategorySelect = ({
  fieldName = "categoryId",
  placeholder = "Select category...",
  searchPlaceholder = "Search categories...",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const form = useFormContext();


  const {
    data: categories,
    isPending,
    isLoading,
    error,
  } = useAppQuery<TOptions>({
    queryKey: ["blog-categories"],
    url: `/blog-categories/options`,
  });

  // 🔄 Set selected category name when ID is available and categories are loaded
  // useEffect(() => {
  //   if (categories && selectedId) {
  //     const selectedCat = categories.find(
  //       (cat) => cat.value === selectedId
  //     );
  //     if (selectedCat) {
  //       setSelectedValue(selectedCat.label);
  //     }
  //   }
  // }, [categories, selectedId]);

  return (
    <FormField
      control={form.control}
      name="categoryId" // Make sure this matches your schema
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Category<span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className={`w-full ${className}`}>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={isPending || isLoading}
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {field.value && !isLoading
                        ? categories?.find((cat) => cat.value === field.value)
                            ?.label || "Unknown Category"
                        : "Select a category"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandGroup>
                      <div className="max-h-64 overflow-y-auto">
                        {(categories ?? [])?.map((category) => (
                          <CommandItem
                            key={category.value}
                            onSelect={() => {
                              field.onChange(category.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                field.value === category.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            <div className="flex flex-col">
                              <span>{category.label}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </div>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {error && !isLoading && (
                <p className="mt-2 text-sm text-red-600">{error.message}</p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
