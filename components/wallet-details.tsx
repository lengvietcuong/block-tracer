import WalletOverview from "@/components/wallet-overview";
import TransactionGraph from "@/components/graphs/transaction-graph";
import TransactionHistory from "@/components/transaction-history";
import Pages from "@/components/pages";
import { getWalletOverview, getTransactions } from "@/randomData";

interface WalletDetailsProps {
  address: string;
  currentPage: number;
}

const TRANSACTIONS_PER_PAGE = 15;

export default function WalletDetails({
  address,
  currentPage,
}: WalletDetailsProps) {
  // Suppose this is an actual fetch call to a database
  const { blockchain, balance, sent, received, lastActive } =
    getWalletOverview(address);
  const numPages = Math.ceil((sent + received) / TRANSACTIONS_PER_PAGE);
  const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const end = currentPage * TRANSACTIONS_PER_PAGE - 1;
  const transactions = getTransactions(address, start, end);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-12 xl:gap-24 mb-12">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Transaction Graph
          </h2>
          <div className="w-fit mx-auto">
            <TransactionGraph
              className="size-[360px] md:size-[440px] lg:size-[500px]"
              address={address}
              transactions={transactions}
            />
            {numPages > 1 && (
              <Pages
                className="mt-2"
                numPages={numPages}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
        <div className="self-strech border-l border-muted hidden lg:block"></div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">
            Wallet Overview
          </h2>
          <WalletOverview
            className="w-fit"
            address={address}
            blockchain={blockchain}
            balance={balance}
            sent={sent}
            received={received}
            lastActive={lastActive}
          />
        </div>
      </div>
      <h2 className="text-2xl lg:text-3xl font-bold mb-6">
        Transaction History
      </h2>
      <TransactionHistory transactions={transactions} />
      {numPages > 1 && (
        <Pages
          className="mt-6"
          numPages={numPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
}
