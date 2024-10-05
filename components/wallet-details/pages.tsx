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
  const previous = Math.max(1, currentPage - 1);
  const next = Math.min(numPages, currentPage + 1);

  // Determine the range of pages to display
  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(maxPages / 2), numPages - maxPages + 1)
  );
  const endPage = Math.min(
    numPages,
    Math.max(currentPage + Math.floor(maxPages / 2), maxPages)
  );

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?sort=${sortOrder}&page=${previous}`}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Render pagination links based on the dynamic start and end pages */}
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

        {numPages > endPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={`?sort=${sortOrder}&page=${next}`}
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
