import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getTotalTransactions } from "@/bitQuery";
import { BlockchainSymbol } from "@/types";
import { TRANSACTIONS_PER_PAGE } from "@/constants";

interface PagesProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
  orderBy?: "time" | "amount";
  currentPage?: number;
  className?: string;
}

export default async function Pages({
  blockchainSymbol,
  address,
  orderBy = "time",
  currentPage = 1,
  className,
}: PagesProps) {
  const numTransactions = await getTotalTransactions(blockchainSymbol, address);
  const numPages = Math.ceil(numTransactions / TRANSACTIONS_PER_PAGE);

  const maxPages = 3;
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(numPages, currentPage + 1);

  // Determine the range of pages to display
  // Try to keep the current page in the middle
  let startPage = currentPage - Math.floor(maxPages / 2);
  startPage = Math.min(startPage, numPages - maxPages + 1);
  startPage = Math.max(1, startPage);
  const endPage = Math.min(startPage + maxPages - 1, numPages);

  const baseLink = `?sort=${orderBy}`;

  return (
    numPages >= 2 && (
      <Pagination className={className}>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              href={`${baseLink}&page=${previousPage}`}
              scroll={false}
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
                  href={`${baseLink}&page=${startPage + i}`}
                  scroll={false}
                  isActive={currentPage === startPage + i}
                  className={`cursor-pointer ${
                    currentPage === startPage + i ? "bg-muted" : ""
                  }`}
                >
                  {startPage + i}
                </PaginationLink>
              </PaginationItem>
            ),
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
              href={`${baseLink}&page=${nextPage}`}
              scroll={false}
              className={
                currentPage === numPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  );
}
