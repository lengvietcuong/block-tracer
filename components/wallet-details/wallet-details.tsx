import WalletOverview from "@/components/wallet-details/wallet-overview";
import TransactionGraph from "@/components/wallet-details/transaction-graph";
import TransactionHistory from "@/components/wallet-details/transaction-history";
import Pages from "@/components/pages";
import { getWalletOverview, getTransactions } from "@/randomData";
import { BlockchainSymbol } from "@/types";

interface WalletDetailsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
  currentPage: number;
}

const TRANSACTIONS_PER_PAGE = 15;

export default function WalletDetails({
  blockchainSymbol,
  address,
  currentPage,
}: WalletDetailsProps) {
  // Suppose this is an actual fetch call to a database
  const {
    balance,
    sent,
    received,
    amountSent,
    amountReceived,
    firstActive,
    lastActive,
    riskScore
  } = getWalletOverview(address);
  const numPages = Math.ceil((sent + received) / TRANSACTIONS_PER_PAGE);
  const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const end = currentPage * TRANSACTIONS_PER_PAGE - 1;
  const transactions = getTransactions(address, start, end);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-12 xl:gap-24 mb-12">
        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Transaction Graph
          </h2>
          <div className="w-fit mx-auto">
            <TransactionGraph
              className="size-[360px] sm:size[400px] md:size-[500px] lg:size-[400px] xl:size-[500px]"
              blockchainSymbol={blockchainSymbol}
              address={address}
              transactions={transactions}
            />
            {numPages > 1 && (
              <Pages
                className="mt-2"
                blockchainSymbol={blockchainSymbol}
                address={address}
                numPages={numPages}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
        <div className="self-strech border-l border-muted hidden lg:block"></div>
        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Wallet Overview
          </h2>
          <WalletOverview
            address={address}
            blockchainSymbol={blockchainSymbol}
            balance={balance}
            sent={sent}
            received={received}
            amountSent={amountSent}
            amountReceived={amountReceived}
            firstActive={firstActive}
            lastActive={lastActive}
            riskScore={riskScore}
          />
        </div>
      </div>
      <h2 className="text-2xl lg:text-3xl font-bold mb-6">
        Transaction History
      </h2>
      <TransactionHistory
        blockchainSymbol={blockchainSymbol}
        transactions={transactions}
      />
      {numPages > 1 && (
        <Pages
          className="mt-6"
          blockchainSymbol={blockchainSymbol}
          address={address}
          numPages={numPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
}
