import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TransactionGraphSkeleton() {
  return (
    <Skeleton className="rounded-full size-[360px] sm:size[400px] md:size-[500px] lg:size-[400px] xl:size-[500px]" />
  );
}

export function WalletOverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-2.5">
          <Skeleton className="size-4 rounded-full mr-1.5" />
          <Skeleton className="h-4 w-16 mr-3" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-96" />
          <Skeleton className="size-6" />
        </div>
      </div>

      <div className="flex sm:justify-between flex-col sm:flex-row space-y-8 sm:space-y-0">
        <div>
          <div className="flex items-center mb-2.5">
            <Skeleton className="size-4 rounded-full mr-1.5" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-32 mb-1.5" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div>
          <div className="flex sm:justify-end items-center mb-2.5">
            <Skeleton className="size-4 rounded-full mr-1.5" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-4 text-center">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-1.5">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {[0, 1].map((index) => (
        <div key={index} className="flex justify-between gap-6">
          {[0, 1].map((i) => (
            <div key={i}>
              <div
                className={`flex items-center mb-2.5 ${
                  i === 1 ? "justify-end" : ""
                }`}
              >
                <Skeleton className="size-4 rounded-full mr-1.5" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-32 mb-1.5" />
              <Skeleton className={`h-4 w-24 ${i === 1 ? "ml-auto" : ""}`} />
            </div>
          ))}
        </div>
      ))}

      <div>
        <div className="flex items-center mb-2.5">
          <Skeleton className="size-4 rounded-full mr-1.5" />
          <Skeleton className="h-4 w-20 mr-3" />
        </div>
        <div className="mt-3 flex gap-6">
          <Skeleton className="rounded-full size-20 flex-shrink-0" />
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransactionHistorySkeleton() {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary font-bold w-[25%]">ID</TableHead>
          <TableHead className="text-primary font-bold w-[40%]">
            Sender-Receiver
          </TableHead>
          <TableHead className="text-primary font-bold w-[20%] lg:w-[15%]">
            Amount
          </TableHead>
          <TableHead className="text-primary font-bold w-[15%]">
            Time (UTC)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[0, 1, 2, 3, 4].map((index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-10 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PagesSkeleton() {
  return <Skeleton className="h-10 w-72" />;
}
