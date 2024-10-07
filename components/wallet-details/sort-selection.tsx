import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SortSelection({
  className,
  selected,
}: {
  className?: string;
  selected: "time" | "amount";
}) {
  return (
    // Update the sort order by changing the query parameter in the URL
    // When the sort order is updated, the page number is implicitly reset to 1
    <div className={cn("flex gap-2", className)}>
      <Link href="?sort=time">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs rounded-full px-3.5 h-8 ${selected === "time" ? "bg-muted" : ""}`}
        >
          Most recent
        </Button>
      </Link>
      <Link href="?sort=amount">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs rounded-full px-3.5 h-8 ${selected === "amount" ? "bg-muted" : ""}`}
        >
          Most value
        </Button>
      </Link>
    </div>
  );
}
