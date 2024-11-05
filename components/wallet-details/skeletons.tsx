import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PiArrowElbowDownRightBold as DownRightArrowIcon } from "react-icons/pi";

export function WalletOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row xl:gap-12">
      <div className="w-fit space-y-6">
        {/* Wallet address with the copy button */}
        <div>
          <div className="mb-1.5 flex items-center">
            <Skeleton className="mr-1.5 h-4 w-4" />
            <Skeleton className="mr-3 h-4 w-16" />
            <Badge variant="secondary">
              <Skeleton className="h-3 w-20" />
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-72 sm:w-96" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-16 gap-y-6 xl:flex-col">
          {/* Wallet balance */}
          <div>
            <div className="mb-1.5 flex items-center">
              <Skeleton className="mr-1.5 h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-40" />
            <Skeleton className="mt-1 h-4 w-32" />
          </div>

          {/* First and last active times */}
          <div className="flex gap-16">
            {[0, 1].map((index) => (
              <div key={index}>
                <div className="mb-1.5 flex items-center">
                  <Skeleton className="mr-1.5 h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-6 w-28" />
                <Skeleton className="mt-1 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical separator (for desktop display) */}
      <div className="hidden self-stretch border-l lg:block" />

      <div className="w-fit">
        <TransactionVolumeSkeleton />
      </div>
    </div>
  );
}

function TransactionVolumeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sm:justify-start sm:gap-8">
        <h3 className="text-lg font-semibold">Transaction Volume</h3>
        <Select disabled>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Placeholder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display transaction counts (sent, received, and total) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-wrap gap-x-16 gap-y-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-1">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Display amount sent and received in both crypto and USD */}
      <div className="flex flex-wrap gap-x-16 gap-y-6">
        {[0, 1].map((index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WalletReportsSkeleton() {
  return (
    <Alert className="w-fit">
      <AlertTitle className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </AlertTitle>
      <AlertDescription className="mt-2 text-xs text-muted-foreground">
        <Skeleton className="ml-6 h-4 w-72 sm:w-96" />
      </AlertDescription>
    </Alert>
  );
}

export function TransactionCountSkeleton() {
  return (
    <div className="flex h-96 w-full flex-col gap-4">
      {/* Chart skeleton */}
      <Skeleton className="flex-1" />

      {/* Legend skeleton */}
      <div className="flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function TopInteractionsTableSkeleton({
  addressColumnHeader,
}: {
  addressColumnHeader: string;
}) {
  return (
    <Table className="h-fit table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3 text-center xl:w-[40%]">
            {addressColumnHeader}
          </TableHead>
          <TableHead className="w-1/3 text-center xl:w-[30%]">
            Transactions
          </TableHead>
          <TableHead className="w-1/3 text-center xl:w-[30%]">
            Percentage
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, index) => (
          <TableRow key={index}>
            {/* Address */}
            <TableCell className="flex items-center justify-center space-x-2 px-3 py-3 sm:px-4">
              <Skeleton className="h-5 w-20 sm:w-40 lg:w-28 xl:w-40" />
              <Skeleton className="h-4 w-4 flex-shrink-0" />
            </TableCell>

            {/* Transactions */}
            <TableCell className="px-3 py-3 text-center sm:px-4">
              <Skeleton className="mx-auto h-5 w-12 sm:w-16" />
            </TableCell>

            {/* Percentage */}
            <TableCell className="px-3 py-3 text-center sm:px-4">
              <Skeleton className="mx-auto h-5 w-10 sm:w-12" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TopInteractionsSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-16">
      <TopInteractionsTableSkeleton addressColumnHeader="Sender" />
      <TopInteractionsTableSkeleton addressColumnHeader="Receiver" />
    </div>
  );
}

function TransactionTableSkeleton() {
  return (
    <Table className="h-fit table-fixed">
      <TableHeader className="sticky top-0 bg-background">
        <TableRow>
          <TableHead className="w-2/4 text-center font-bold text-primary md:w-1/3 xl:w-[40%]">
            Sender-Receiver
          </TableHead>
          <TableHead className="w-1/4 text-center font-bold text-primary md:w-1/3 xl:w-[30%]">
            Amount
          </TableHead>
          <TableHead className="w-1/4 text-center font-bold text-primary md:w-1/3 xl:w-[30%]">
            Time (UTC)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <TableRow key={index} className="hover:bg-muted/50">
              {/* Sender-Receiver */}
              <TableCell className="space-y-1 py-3 md:grid md:place-items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 sm:w-32" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <DownRightArrowIcon className="size-4 flex-shrink-0 fill-muted-foreground" />
                    <Skeleton className="h-4 w-24 sm:w-32" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell className="py-3">
                <Skeleton className="mx-auto h-4 w-16 sm:w-24" />
                <Skeleton className="mx-auto mt-1 hidden h-3 w-24 md:block" />
              </TableCell>

              {/* Time (UTC) */}
              <TableCell className="py-3">
                <Skeleton className="mx-auto h-4 w-16 sm:w-36" />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export function TransactionsSkeleton() {
  return (
    <>
      {/* Sort selection */}
      <div className="flex gap-1">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <div className="mb-6 flex flex-col xl:mb-0 xl:flex-row xl:gap-16">
        {/* Transaction graph */}
        <Skeleton className="mx-auto mb-4 aspect-square w-11/12 max-w-screen-md rounded-full" />

        {/* Transaction table */}
        <TransactionTableSkeleton />
      </div>
    </>
  );
}

export function PagesSkeleton() {
  return <Skeleton className="mx-auto h-8 w-72" />;
}
