import { NodeProps, Handle, Position } from "reactflow";
import Link from "next/link";

function abbreviateAddress(address: string, maxLength: number) {
  if (address.length <= maxLength) return address;

  const firstPart = address.slice(0, maxLength / 2);
  const secondPart = address.slice(-maxLength / 2);
  return `${firstPart}...${secondPart}`;
}

export default function TransactionNode({ data }: NodeProps) {
  return (
    <div className="relative size-12 !pointer-events-auto" title={data.label}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="source" position={Position.Left} className="invisible" />
      </div>
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm">
        {abbreviateAddress(data.label, 8)}
      </div>
      <Link href={`?address=${data.label}`}>
        <div
          className={`size-full rounded-full ${
            data.selected
              ? "bg-primary"
              : "border border-muted-foreground hover:border-primary hover:border-2 hover:bg-primary/15"  
          }`}
         />
     </Link>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="target" position={Position.Left} className="invisible" />
      </div>
    </div>
  );
}
