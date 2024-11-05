import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SortSelectionProps {
  orderBy?: "time" | "amount";
  className?: string;
}

export default function SortSelection({
  orderBy = "time",
  className,
}: SortSelectionProps) {
  return (
    // Update the sort order by changing the query parameter in the URL
    // When the sort order is updated, the page number is implicitly reset to 1
    <div className={cn("flex gap-1", className)}>
      <Link href={`?sort=time`} scroll={false}>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 rounded-full px-4 text-xs ${orderBy === "time" ? "bg-muted" : ""}`}
        >
          Most recent
        </Button>
      </Link>
      <Link href={`?sort=amount`} scroll={false}>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 rounded-full px-4 text-xs ${orderBy === "amount" ? "bg-muted" : ""}`}
        >
          Most value
        </Button>
      </Link>
    </div>
  );
}
