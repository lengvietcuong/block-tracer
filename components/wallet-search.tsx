"use client";

import { FormEvent, MouseEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { IoSearch as SearchIcon } from "react-icons/io5";
import Bitcoin from "./icons/bitcoin";
import Etherium from "./icons/etherium";
import Dogecoin from "./icons/dogecoin";
import Binance from "./icons/binance";
import Solana from "./icons/solana";
import Swincoin from "./icons/swincoin";
import { BLOCKCHAIN_NAMES } from "@/constants";

const BLOCKCHAIN_ICONS = {
  BTC: Bitcoin,
  ETH: Etherium,
  DOGE: Dogecoin,
  BNB: Binance,
  SOL: Solana,
  SWC: Swincoin,
};

interface WalletSearchProps {
  variant?: "full" | "compact";
}

export default function WalletSearch({ variant = "full" }: WalletSearchProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [blockchain, setBlockchain] = useState("BTC");
  const router = useRouter();

  function renderBlockchain(symbol: keyof typeof BLOCKCHAIN_NAMES) {
    const Icon = BLOCKCHAIN_ICONS[symbol];
    return (
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        {symbol}
      </div>
    );
  }

  function handleWalletSearch(event: FormEvent | MouseEvent) {
    event.preventDefault();
    if (walletAddress.trim()) {
      router.push(`/wallet?chain=${blockchain}&address=${walletAddress}`);
    }
  };

  return (
    <form
      className={`flex items-center rounded-lg ${
        variant === "full"
          ? "shadow-[0_0_10px_3px_hsl(var(--muted-foreground)/0.5)] lg:shadow-[0_0_20px_5px_hsl(var(--muted-foreground)/0.5)]"
          : "bg-secondary max-w-64 sm:max-w-none"
      }`}
      onSubmit={handleWalletSearch}
    >
      <div className="relative flex-1">
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2"
          onClick={handleWalletSearch}
        >
          <SearchIcon className="size-5 fill-primary hover:fill-primary/90" />
        </button>
        <Input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter address"
          className={`bg-transparent border-none pl-12
            ${variant === "full" ? "h-12" : "h-10  text-xs"}
          `}
        />
      </div>
      <Select value={blockchain} onValueChange={setBlockchain}>
        <SelectTrigger className="w-24 flex-shrink-0 border-none bg-transparent">
          <SelectValue placeholder="Blockchain" />
        </SelectTrigger>
        <SelectContent side="bottom">
          {Object.keys(BLOCKCHAIN_NAMES).map((key) => (
            <SelectItem key={key} value={key}>
              {renderBlockchain(key as keyof typeof BLOCKCHAIN_NAMES)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  );
}
