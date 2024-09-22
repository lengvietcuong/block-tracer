"use client";

import { FormEvent, MouseEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { IoSearch as SearchIcon } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function WalletSearch({ className }: { className?: string }) {
  const [walletAddress, setWalletAddress] = useState("");
  const router = useRouter();

  const handleWalletSearch = (event: FormEvent | MouseEvent) => {
    event.preventDefault();
    if (walletAddress.trim()) {
      router.push(`/wallet/${walletAddress}`);
    }
  };

  return (
    <form className="relative" onSubmit={handleWalletSearch}>
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
        placeholder="Search wallet address"
        className={cn(
          "w-72 md:w-80 lg:w-96 h-10 pl-12 pr-4 text-xs border-none bg-secondary rounded-lg",
          className
        )}
      />
    </form>
  );
}
