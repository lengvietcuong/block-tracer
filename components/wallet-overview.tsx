import { BLOCKCHAIN_NAMES } from "@/constants";
import { PiWalletBold as WalletIcon } from "react-icons/pi";
import { PiCoinsBold as CoinsIcon } from "react-icons/pi";
import { PiClockClockwiseBold as ClockIcon } from "react-icons/pi";
import { PiCubeFocus as BlockchainIcon } from "react-icons/pi";
import { GrDocumentText as TransactionIcon } from "react-icons/gr";
import { cn } from "@/lib/utils";

interface WalletOverviewProps {
  className?: string;
  blockchainSymbol: string;
  address: string;
  balance: number;
  sent: number;
  received: number;
  lastActive: string;
}

export default function WalletOverview({
  className,
  blockchainSymbol,
  address,
  balance,
  sent,
  received,
  lastActive,
}: WalletOverviewProps) {
  return (
    <div className={cn("space-y-5 lg:space-y-6", className)}>
      <div className="space-y-1">
        <div className="flex gap-1 items-center">
          <WalletIcon className="text-primary" />
          <p className="text-sm text-muted-foreground">Address</p>
        </div>
        <p className="font-medium text-sm sm:text-base">{address}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <BlockchainIcon className="text-primary" />
          <p className="text-sm text-muted-foreground">Blockchain</p>
        </div>
        <p className="font-medium">
          {BLOCKCHAIN_NAMES[blockchainSymbol as keyof typeof BLOCKCHAIN_NAMES]}
        </p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <CoinsIcon className="text-primary" />
          <p className="text-sm text-muted-foreground">Balance</p>
        </div>
        <p className="font-medium text-4xl">
          {balance} {blockchainSymbol}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <TransactionIcon className="text-primary" />
          <p className="text-sm text-muted-foreground">Transactions</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center space-y-0.5">
            <p className="text-sm text-muted-foreground">Sent</p>
            <p className="text-2xl font-medium">{sent}</p>
          </div>
          <div className="border-l self-stretch bg-muted" />
          <div className="text-center space-y-0.5">
            <p className="text-sm text-muted-foreground">Received</p>
            <p className="text-2xl font-medium">{received}</p>
          </div>
          <div className="border-l self-stretch bg-muted" />
          <div className="text-center space-y-0.5">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-medium">{sent + received}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <ClockIcon className="text-primary" />
          <p className="text-sm text-muted-foreground">Last Activity</p>
        </div>
        <p className="font-medium">{lastActive}</p>
      </div>
    </div>
  );
}
