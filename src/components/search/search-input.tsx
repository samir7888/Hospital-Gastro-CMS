import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  className,
  placeholder = "Search...",
}: Props) {
  const [searchParam, setSearchParam] = useSearchParams();

  return (
    <div className="flex items-center">
      <div className={cn("relative", className)}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8"
          value={searchParam.get("search") || ""}
          onChange={(e) => {
            searchParam.set("search", e.target.value);
            setSearchParam(searchParam);
          }}
        />
      </div>
    </div>
  );
}
