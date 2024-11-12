import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/wallet-details/copy-button";
import { TransactionVolume } from "@/components/wallet-details/transaction-volume";
import { BlockchainSymbol } from "@/types";
import { PiWalletBold as WalletIcon } from "react-icons/pi";
import { PiCoinsBold as CoinsIcon } from "react-icons/pi";
import { PiUserCheckBold as FirstActiveIcon } from "react-icons/pi";
import { PiClockUserBold as LastActiveIcon } from "react-icons/pi";
import { BLOCKCHAIN_NAMES } from "@/constants";
import { convertToUsd, getTimeAgo, formatAmount } from "@/utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { redirectIfFailed } from "@/utils";

interface WalletOverviewProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  address: string;
}

export default async function WalletOverview({
  className,
  blockchainSymbol,
  address,
}: WalletOverviewProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${blockchainSymbol}/${address}/overview`,
    { cache: "no-store" },
  );
  redirectIfFailed(response);
  // Destructure fields from the response
  const {
    balance,
    sentCount,
    receivedCount,
    amountSent,
    amountReceived,
    firstActive,
    lastActive,
    contractType,
  } = await response.json();

  // Check if firstActive and lastActive are valid before creating Date objects
  const firstActiveDate = firstActive ? new Date(firstActive) : null;
  const lastActiveDate = lastActive ? new Date(lastActive) : null;

  // Format dates if they are valid
  const firstActiveFormatted = firstActiveDate
    ? format(firstActiveDate, "MMM d, yyyy")
    : "N/A";
  const lastActiveFormatted = lastActiveDate
    ? format(lastActiveDate, "MMM d, yyyy")
    : "N/A";

  // Get the full blockchain name from its symbol (e.g. "eth" -> "Ethereum")
  const blockchainName = BLOCKCHAIN_NAMES[blockchainSymbol];
  const contractTypeFormatted = contractType != "eoa" ? "Contract" : "EOA";

  // Convert from crypto to USD
  const balanceUsdValue = convertToUsd(balance, blockchainSymbol);

  return (
    <div className={cn("flex flex-col gap-8 lg:flex-row xl:gap-12", className)}>
      <div className="w-fit space-y-6">
        {/* Wallet address with the copy button */}
        <div>
          <div className="mb-1.5 flex items-center gap-x-2">
            <WalletIcon className="mr-1.5 text-primary" />
            <span className="mr-3 text-sm font-medium text-muted-foreground">
              Address
            </span>
            <Badge variant="secondary">{blockchainName}</Badge>
            <Badge variant="secondary">{contractTypeFormatted}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <p className="break-all text-sm sm:text-base">{address}</p>
            <CopyButton content={address} />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-16 gap-y-6 xl:flex-col">
          {/* Wallet balance */}
          <div>
            <div className="mb-1.5 flex items-center">
              <CoinsIcon className="mr-1.5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Balance
              </span>
            </div>
            <p className="text-2xl font-semibold">
              {formatAmount(balance)} {blockchainSymbol.toUpperCase()}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              ~ ${formatAmount(balanceUsdValue)} USD
            </p>
          </div>

          {/* First and last active times */}
          <div className="flex gap-16">
            <div>
              <div className="mb-1.5 flex items-center">
                <FirstActiveIcon className="mr-1.5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  First active
                </span>
              </div>
              <p className="">{firstActiveFormatted}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {firstActiveDate ? getTimeAgo(firstActiveDate) : "N/A"}
              </p>
            </div>

            <div>
              <div className="mb-1.5 flex items-center">
                <LastActiveIcon className="mr-1.5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Last active
                </span>
              </div>
              <p className="">{lastActiveFormatted}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {lastActiveDate ? getTimeAgo(lastActiveDate) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical separator (for desktop display) */}
      <div className="hidden self-stretch border-l lg:block" />

      <div className="w-fit">
        <TransactionVolume
          blockchainSymbol={blockchainSymbol}
          sentCount={sentCount}
          receivedCount={receivedCount}
          amountSent={amountSent}
          amountReceived={amountReceived}
          firstActive={firstActiveDate ?? new Date(0)}
          lastActive={lastActiveDate ?? new Date(0)}
        />
      </div>
    </div>
  );
}
