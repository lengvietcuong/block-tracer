"use client";

import { useState, useEffect, ReactNode } from "react";
import WalletSearch from "@/components/wallet-details/wallet-search";
import { BlockchainSymbol } from "@/types";

interface HeaderWrapperProps {
  children: ReactNode;
  defaultBlockchain?: BlockchainSymbol;
  changeStyleOnScroll?: boolean;
}

function HeaderWrapper({
  children,
  defaultBlockchain = "eth",
  changeStyleOnScroll = true,
}: HeaderWrapperProps) {
  // Keep track of whether the user has scrolled down the page
  // If changeStyleOnScroll is true, when scrolled, the header will have a background and the search bar will be shown
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50); // 50px from the top of the page
    }

    document.addEventListener("scroll", handleScroll);
    return () => {
      // Cleanup function when the component unmounts
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`sticky top-0 z-10 px-4 py-3 transition-colors duration-300 md:px-8 lg:px-12 xl:px-28 ${
        scrolled || !changeStyleOnScroll
          ? "border-b bg-background"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        {children}
        {(scrolled || !changeStyleOnScroll) && (
          <WalletSearch
            variant="compact"
            defaultBlockchain={defaultBlockchain}
          />
        )}
      </div>
    </header>
  );
}

export default HeaderWrapper;
