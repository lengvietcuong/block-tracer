import HeaderWrapper from "./header-wrapper";
import Logo from "@/components/icons/logo";
import Link from "next/link";
import PWAINstallButton from "./PWA_install_button";

export default function Header({
  changeStyleOnScroll,
}: {
  changeStyleOnScroll?: boolean;
}) {
  return (
    <HeaderWrapper changeStyleOnScroll={changeStyleOnScroll}>
      {/* Clicking on the logo takes the user back to the home page */}
      <Link href="/" aria-label="Back to Home" >
        <div className="flex items-center gap-4">
          <Logo className="size-10 fill-primary" />
          <p className="font-bold hidden sm:block text-xl">Block Tracer</p>
        </div>
      </Link>
      <PWAINstallButton />
    </HeaderWrapper>
  );
}
