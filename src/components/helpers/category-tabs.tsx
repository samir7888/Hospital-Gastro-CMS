import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CategoryResponse } from "@/schema/news-type";
import { useAppQuery } from "@/utils/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CategoryTabs = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const [category, setCategory] = useState(searchParam.get("category") || "all");

  const { data: categories, isLoading, error } = useAppQuery<CategoryResponse[]>({
    queryKey: ["blog-categories"],
    url: `/blog-categories`,
  });

  // Sync URL param when category changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParam.toString());

    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }

    setSearchParam(newParams, { replace: true });
  }, [category, searchParam, setSearchParam]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full md:w-auto">
        <div className="flex space-x-2">
          <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full md:w-auto">
        <p className="text-red-500 text-sm">Failed to load categories</p>
      </div>
    );
  }

  
  

  return (
    <Tabs
      value={category}
      onValueChange={(value) => setCategory(value)}
      className="w-full md:w-auto bg-white"
    >
      <TabsList className={`w-full flex md:w-auto gap-3`}>
        {/* Always show "All" tab first */}
        <TabsTrigger value="all" className="text-sm">
          All
        </TabsTrigger>
        
        {/* Dynamically render category tabs */}
        {categories?.map((categoryItem) => (
          <TabsTrigger 
            key={categoryItem.id} 
            value={categoryItem.name}
            className="text-sm  capitalize"
            title={categoryItem.name} // Show full name on hover
          >
            {categoryItem.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;