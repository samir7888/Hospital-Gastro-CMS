import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface MultiSelectProps {
  options: {
    value: string;
    label: string;
  }[];
  name: string;
  placeholder?: string;
}

const MultiSelect = ({
  options,
  name,
  placeholder = "Select options",
}: MultiSelectProps) => {
  const form = useFormContext();

  const handleSelect = (option: MultiSelectProps["options"][0]) => {
    const isSelected = value.includes(option.value);

    const newValue = isSelected
      ? value.filter((d: any) => d !== option.value)
      : [...value, option.value];

    form.setValue(name, newValue);
  };

  const value = form.watch(name);
console.log(value)
  return (
    <Popover>
      <PopoverTrigger className="text-left px-3 py-2 border rounded-md text-sm capitalize">
        {value?.length ? value.join(", ") : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <Command>
          <CommandInput placeholder="Search..." />
          <ScrollArea className="max-h-60">
            <CommandGroup>
              <CommandList>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer flex items-center"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
