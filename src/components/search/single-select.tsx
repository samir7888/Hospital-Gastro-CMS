import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Command,  CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { useAppQuery } from '@/utils/react-query';
import type { CategoryResponse } from '@/schema/news-type';
import { useFormContext } from 'react-hook-form';





export const CategorySelect = ({ 
   
  fieldName = 'category',
  placeholder = "Select category...",
  searchPlaceholder = "Search categories...",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

 const form = useFormContext();


  const { data: filteredCategories, isLoading,error } = useAppQuery<CategoryResponse[]>({
     queryKey: ["blog-categories"],
     url: `/blog-categories`,
   });


  // Handle category selection
  const handleSelect = (category: CategoryResponse) => {
    const categoryId = category.id;
    setSelectedValue(category.name);
    
    // Set form value using the provided form object
    if (form && form.setValue) {
      form.setValue(fieldName, categoryId);
    }
    
    setOpen(false);
    setSearchValue('');
  };

  // Get display text for the selected category
  const getDisplayText = () => {
    if (!selectedValue) return placeholder;
    return selectedValue;
  };

  return (
    <div className={`w-full ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                getDisplayText()
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
           
            <CommandGroup>
              <div className="max-h-64 overflow-y-auto">
                {filteredCategories?.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => handleSelect(category)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedValue === category.name ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span>{category.name}</span>
                      {category.blogsCount && (
                        <span className="text-xs text-muted-foreground">
                          {category.blogsCount} blogs
                        </span>
                      )}
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
  );
};