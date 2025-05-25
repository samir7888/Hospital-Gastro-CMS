import type { Meta } from "@/schema/Doctors";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  meta: Meta;
}
const PaginationComponent = ({ meta }: Props) => {
  const [searchParam, setSearchParam] = useSearchParams();
  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex justify-between pt-8"
    >
      <div className="text-muted-foreground">
        <p>
          Showing page {meta.page} of {meta.pageCount} pages{" "}
        </p>
        <p>Total items {meta.itemCount}</p>
      </div>

      <ul className="flex items-center space-x-1">
        <li>
          <Button onClick={() => {
              const currentPage = meta.page;
              if (currentPage > 1) {
                searchParam.set("page", String(currentPage - 1));
                setSearchParam(searchParam);
              }
            }} type="button" disabled={!meta.hasPreviousPage}>
            <ChevronLeft />
            Previous
          </Button>
        </li>

        <li>
          <Button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => {
              const currentPage = meta.page;
              if (currentPage < meta.pageCount) {
                searchParam.set("page", String(currentPage + 1));
                setSearchParam(searchParam);
              }
            }}
          >
            Next
            <ChevronRight />
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;
