"use client";

import { useState, useEffect, ReactNode } from "react";
import WalletSearch from "@/components/wallet-search";

interface HeaderWrapperProps {
  children: ReactNode;
  changeStyleOnScroll?: boolean;
}

function HeaderWrapper({
  children,
  changeStyleOnScroll = true,
}: HeaderWrapperProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`sticky top-0 z-10 px-4 md:px-8 lg:px-12 xl:px-36 py-3 transition-colors duration-300 ${
        scrolled || !changeStyleOnScroll
          ? "bg-background border-b"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center max-w-screen-2xl mx-auto justify-between">
        {children}
        {(scrolled || !changeStyleOnScroll) && <WalletSearch variant="compact"/>}
      </div>
    </header>
  );
}

export default HeaderWrapper;
