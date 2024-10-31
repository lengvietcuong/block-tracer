import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/wallet-details/copy-button";
import { BlockchainSymbol } from "@/types";
import { PiWalletBold as WalletIcon } from "react-icons/pi";
import { PiCoinsBold as CoinsIcon } from "react-icons/pi";
import { PiUserCheckBold as FirstActiveIcon } from "react-icons/pi";
import { PiClockUserBold as LastActiveIcon } from "react-icons/pi";
import { FiPlusCircle as PlusIcon } from "react-icons/fi";
import { FiMinusCircle as MinusIcon } from "react-icons/fi";
import { GrDocumentText as TransactionIcon } from "react-icons/gr";
import { BLOCKCHAIN_NAMES } from "@/constants";
import { convertToUsd, getTimeAgo, formatAmount } from "@/utils";
import { format } from "date-fns"
import { cn } from "@/lib/utils";

interface WalletOverviewProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  address: string;
  balance: number;
  sent: number;
  received: number;
  amountSent: number;
  amountReceived: number;
  firstActive: Date;
  lastActive: Date;
}

export default function WalletOverview({
  className,
  blockchainSymbol,
  address,
  balance,
  sent,
  received,
  amountSent,
  amountReceived,
  firstActive,
  lastActive,
}: WalletOverviewProps) {
  // Get the full blockchain name from its symbol (e.g. "eth" -> "Ethereum")
  const blockchainName = BLOCKCHAIN_NAMES[blockchainSymbol];

  // Convert from crypto to USD
  const balanceUsdValue = convertToUsd(balance, blockchainSymbol);
  const sentUsdValue = convertToUsd(amountSent, blockchainSymbol);
  const receivedUsdValue = convertToUsd(amountReceived, blockchainSymbol);

  const firstActiveFormatted = format(firstActive, "MMM d, yyyy");
  const lastActiveFormatted = format(lastActive, "MMM d, yyyy");

  return (
    <div className={cn("space-y-8", className)}>
      {/* Render the wallet address with the copy button */}
      <div>
        <div className="flex items-center mb-1.5">
          <WalletIcon className="text-primary mr-1.5" />
          <span className="text-sm text-muted-foreground font-medium mr-3">
            Address
          </span>
          <Badge variant="secondary">{blockchainName}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm sm:text-base">{address}</p>
          <CopyButton content={address} />
        </div>
      </div>

      <div className="flex sm:justify-between flex-col sm:flex-row space-y-8 sm:space-y-0">
        {/* Render the wallet's balance */}
        <div>
          <div className="flex items-center mb-1.5">
            <CoinsIcon className="text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground font-medium">
              Balance
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatAmount(balance)} {blockchainSymbol.toUpperCase()}
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            ~ ${balanceUsdValue.toLocaleString()} USD
          </p>
        </div>

        {/* Render the number of transactions (sent, received, total) */}
        <div>
          <div className="flex sm:justify-end items-center mb-1.5">
            <TransactionIcon className="text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground font-medium">
              Transactions
            </span>
          </div>
          <div className="flex gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl">{formatAmount(sent)}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
            <div className="border-l self-stretch bg-muted" />
            <div className="space-y-1">
              <p className="text-2xl">{formatAmount(received)}</p>
              <p className="text-sm text-muted-foreground">Received</p>
            </div>
            <div className="border-l self-stretch bg-muted" />
            <div className="space-y-1">
              <p className="text-2xl">{formatAmount(sent + received)}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-6">
        {/* Render the total amount of money sent and received */}
        <div>
          <div className="flex items-center mb-1.5">
            <MinusIcon className="text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground font-medium">
              Sent
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatAmount(amountSent)} {blockchainSymbol.toUpperCase()}
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            ~ ${sentUsdValue.toLocaleString()} USD
          </p>
        </div>

        <div className="text-right">
          <div className="flex justify-end items-center mb-1.5">
            <PlusIcon className="text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground font-medium">
              Received
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatAmount(amountReceived)} {blockchainSymbol.toUpperCase()}
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            ~ ${receivedUsdValue.toLocaleString()} USD
          </p>
        </div>
      </div>

      {/* Render the first and last active times */}
      <div className="flex justify-between gap-6">
        <div>
          <div className="flex items-center mb-1.5">
            <FirstActiveIcon className="text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground font-medium">
              First active
            </span>
          </div>
          <p className="">{firstActiveFormatted}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {getTimeAgo(firstActive)}
          </p>
        </div>

        <div className="text-right">
          <div className="flex justify-end items-center mb-1.5">
            <LastActiveIcon className="text-primary mr-1.5" />
            <span className="text-sm text-muted-foreground font-medium">
              Last active
            </span>
          </div>
          <p className="">{lastActiveFormatted}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {getTimeAgo(lastActive)}
          </p>
        </div>
      </div>
    </div>
  );
}
