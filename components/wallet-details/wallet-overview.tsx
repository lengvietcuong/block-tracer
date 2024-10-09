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
import { HiOutlineInformationCircle as InfoIcon } from "react-icons/hi";
import { BLOCKCHAIN_NAMES } from "@/constants";
import { convertToUsd, getTimeAgo } from "@/utils";
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
  riskScore: number;
}

function getVerdict(riskScore: number) {
  let title, description;
  if (riskScore <= 25) {
    title = "Safe";
    description = "No suspicious activity detected.";
  } else if (riskScore <= 50) {
    title = "Uncertain";
    description = "This wallet is somewhat suspicious.";
  } else {
    title = "Danger";
    description = "Suspicious activities detected.";
  }

  return { title, description };
}

const RISK_COLOR = {
  Safe: "bg-primary/15 border-primary",
  Uncertain: "bg-muted border-muted-foreground",
  Danger: "bg-destructive/15 border-destructive",
};

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
  riskScore,
}: WalletOverviewProps) {
  // Get the full blockchain name from its symbol (e.g. "eth" -> "Ethereum")
  const blockchainName = BLOCKCHAIN_NAMES[blockchainSymbol];

  // Convert from crypto to USD
  const balanceUsdValue = convertToUsd(balance, blockchainSymbol);
  const sentUsdValue = convertToUsd(amountSent, blockchainSymbol);
  const receivedUsdValue = convertToUsd(amountReceived, blockchainSymbol);

  const firstActiveFormatted = format(firstActive, "MMM d, yyyy");
  const lastActiveFormatted = format(lastActive, "MMM d, yyyy");

  const verdict = getVerdict(riskScore);

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
            {balance} {blockchainSymbol.toUpperCase()}
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
              <p className="text-2xl">{sent}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
            <div className="border-l self-stretch bg-muted" />
            <div className="space-y-1">
              <p className="text-2xl">{received}</p>
              <p className="text-sm text-muted-foreground">Received</p>
            </div>
            <div className="border-l self-stretch bg-muted" />
            <div className="space-y-1">
              <p className="text-2xl">{sent + received}</p>
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
            {amountSent} {blockchainSymbol.toUpperCase()}
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
            {amountReceived} {blockchainSymbol.toUpperCase()}
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

      {/* Render the risk score */}
      <div>
        <div className="flex items-center mb-1.5">
          <InfoIcon className="text-primary mr-1.5" />
          <span className="text-sm text-muted-foreground font-medium mr-3">
            Risk score
          </span>
        </div>
        <div className="mt-3 flex gap-6">
          <div
            className={`rounded-full size-20 text-3xl grid place-items-center border-2 flex-shrink-0 ${
              RISK_COLOR[verdict.title as "Safe" | "Uncertain" | "Danger"]
            }`}
          >
            {riskScore}
          </div>
          <div>
            <p
              className={`font-bold text-lg ${
                verdict.title === "Danger" ? "text-destructive" : ""
              }`}
            >
              {verdict.title}
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {verdict.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
