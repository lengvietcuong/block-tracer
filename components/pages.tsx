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
  address: string;
  numPages: number;
  currentPage: number;
}

export default function Pages({ className, address, numPages, currentPage }: PagesProps) {
  const maxPages = 3;
  const previous = Math.max(1, currentPage - 1);
  const next = Math.min(numPages, currentPage + 1);
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?address=${address}&page=${previous}`}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {Array.from(
          {
            length: Math.min(maxPages, numPages),
          },
          (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href={`?address=${address}&page=${i + 1}`}
                isActive={currentPage === i + 1}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        {numPages > maxPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href={`?address=${address}&page=${next}`}
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
