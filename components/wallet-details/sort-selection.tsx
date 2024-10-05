import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SortSelection({
  selected,
}: {
  selected: "time" | "amount";
}) {
  return (
    <div className="flex gap-2">
      <Link href="?sort=time">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${selected === "time" ? "bg-muted" : ""}`}
        >
          Most recent
        </Button>
      </Link>
      <Link href="?sort=amount">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${selected === "amount" ? "bg-muted" : ""}`}
        >
          Most value
        </Button>
      </Link>
    </div>
  );
}
