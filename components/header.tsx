import HeaderWrapper from "./header-wrapper";
import Logo from "@/components/icons/logo";
import Link from "next/link";

export default function Header({
  changeStyleOnScroll,
}: {
  changeStyleOnScroll?: boolean;
}) {
  return (
    <HeaderWrapper changeStyleOnScroll={changeStyleOnScroll}>
      <Link href="/" aria-label="Back to Home">
        <div className="flex items-center gap-4">
          <Logo className="size-8 lg:size-10 fill-primary" />
          <p className="font-bold hidden sm:block text-xl">Block Tracer</p>
        </div>
      </Link>
    </HeaderWrapper>
  );
}
