import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PagesProps {
  className?: string;
  sortOrder: "time" | "amount";
  numPages: number;
  currentPage: number;
}

export default function Pages({
  className,
  sortOrder,
  numPages,
  currentPage,
}: PagesProps) {
  const maxPages = 3;
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(numPages, currentPage + 1);

  // Determine the range of pages to display
  // Try to keep the current page in the middle
  let startPage = currentPage - Math.floor(maxPages / 2);
  startPage = Math.max(1, startPage);
  startPage = Math.min(startPage, numPages - maxPages + 1);
  const endPage = Math.min(startPage + maxPages - 1, numPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href={`?sort=${sortOrder}&page=${previousPage}`}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Pages */}
        {Array.from(
          {
            length: endPage - startPage + 1,
          },
          (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href={`?sort=${sortOrder}&page=${startPage + i}`}
                isActive={currentPage === startPage + i}
                className={`cursor-pointer ${
                  currentPage === startPage + i ? "bg-muted" : ""
                }`}
              >
                {startPage + i}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* "..." if there are too many pages to be shown at once */}
        {numPages > endPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href={`?sort=${sortOrder}&page=${nextPage}`}
            className={
              currentPage === numPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
