import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDebounce } from "./debounce";

type Props = {
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  className,
  placeholder = "Search...",
}: Props) {
  const [searchParam, setSearchParam] = useSearchParams();
  const [search, setSearch] = useState(searchParam.get("search")?.trim() || "");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch) {
      searchParam.set("search", debouncedSearch);
    } else {
      searchParam.delete("search");
    }
    setSearchParam(searchParam, { replace: true });
  }, [debouncedSearch, searchParam, setSearchParam]);

  return (
    <div className="flex items-center">
      <div className={cn("relative", className)}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
        />
      </div>
    </div>
  );
}
