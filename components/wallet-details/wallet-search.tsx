"use client";

import { FormEvent, MouseEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import BlockchainSelection from "./blockchain-selection";
import { BlockchainSymbol } from "@/types";
import { useRouter } from "next/navigation";
import { IoSearch as SearchIcon } from "react-icons/io5";
import { TbLoader2 as LoadingIcon } from "react-icons/tb";

interface WalletSearchProps {
  variant?: "full" | "compact";
  showLoading?: boolean;
}

export default function WalletSearch({
  variant = "full",
  showLoading = false,
}: WalletSearchProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [blockchainSymbol, setBlockchainSymbol] =
    useState<BlockchainSymbol>("eth");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleWalletSearch(event: FormEvent | MouseEvent) {
    event.preventDefault(); // Prevent a full page reload
    if (walletAddress.trim()) {
      setLoading(true);
      // Redirect the user to the appropriate wallet details page
      router.push(`/${blockchainSymbol}/${walletAddress}`);
    }
  }

  return (
    // Render a larger size search bar with a soft white shadow in the full variant (in the hero section)
    // In the header, render a smaller version without the shadow
    <form
      id="wallet-search"
      className={`flex items-center rounded-lg ${
        variant === "full"
          ? "bg-background shadow-[0_0_10px_3px_hsl(var(--muted-foreground)/0.5)] lg:shadow-[0_0_20px_5px_hsl(var(--muted-foreground)/0.5)]"
          : "bg-secondary max-w-64 sm:max-w-none"
      }`}
      onSubmit={handleWalletSearch}
    >
      <div className="relative flex-1">
        <button
          aria-label="Search wallet"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1"
          onClick={handleWalletSearch}
          disabled={loading && showLoading}
        >
          {/* If showLoading is true (in the hero section), after the user presses enter or clicks the search icon, the search bar component will display a loading spinner until they are redirected to the wallet details page. */}
          {loading && showLoading ? (
            <LoadingIcon className="size-5 animate-spin stroke-primary" />
          ) : (
            <SearchIcon className="size-5 fill-primary hover:fill-primary/90" />
          )}
        </button>
        <Input
          type="text"
          id="address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter address"
          className={`bg-transparent border-none pl-12
            ${variant === "full" ? "h-12" : "h-10  text-xs"}
          `}
          disabled={loading && showLoading}
        />
      </div>
      <BlockchainSelection
        className="w-24 flex-shrink-0 border-none bg-transparent"
        blockchainSymbol={blockchainSymbol}
        setBlockchainSymbol={setBlockchainSymbol}
      />
    </form>
  );
}
