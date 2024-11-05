import HeaderWrapper from "./header-wrapper";
import Logo from "@/components/icons/logo";
import Link from "next/link";
import { BlockchainSymbol } from "@/types";

interface HeaderProps {
  defaultBlockchain?: BlockchainSymbol;
  changeStyleOnScroll?: boolean;
}

export default function Header({
  defaultBlockchain = "eth",
  changeStyleOnScroll,
}: HeaderProps) {
  return (
    <HeaderWrapper
      changeStyleOnScroll={changeStyleOnScroll}
      defaultBlockchain={defaultBlockchain}
    >
      {/* Clicking on the logo takes the user back to the home page */}
      <Link href="/" aria-label="Back to Home">
        <div className="flex items-center gap-4">
          <Logo className="size-10 fill-primary" />
          <p className="hidden text-xl font-bold sm:block">Block Tracer</p>
        </div>
      </Link>
    </HeaderWrapper>
  );
}
