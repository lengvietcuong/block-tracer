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
}

export default function WalletSearch({ variant = "full" }: WalletSearchProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [blockchain, setBlockchain] = useState<BlockchainSymbol>("ETH");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleWalletSearch(event: FormEvent | MouseEvent) {
    event.preventDefault();
    if (walletAddress.trim()) {
      setLoading(true);
      router.push(`/wallet?chain=${blockchain}&address=${walletAddress}`);
    }
  }

  return (
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
          disabled={loading}
        >
          {loading ? (
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
          disabled={loading}
        />
      </div>
      <BlockchainSelection
        className="w-24 flex-shrink-0 border-none bg-transparent"
        blockchain={blockchain}
        setBlockchain={setBlockchain}
      />
    </form>
  );
}
