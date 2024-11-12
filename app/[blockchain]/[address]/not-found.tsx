import Link from "next/link";
import { FaRegSadTear as SadFaceIcon } from "react-icons/fa";
import { IoMdArrowRoundBack as ArrowLeftIcon } from "react-icons/io";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletSearch from "@/components/wallet-details/wallet-search";

export default function NotFound() {
  return (
    <main className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col p-4">
        <SadFaceIcon className="mx-auto mb-4 h-20 w-20 text-muted-foreground" />
        <h1 className="mx-auto mb-6 text-2xl font-bold sm:text-4xl">
          Wallet not found
        </h1>
        <p className="text-muted-foreground">This is most likely due to:</p>
        <ul className="mt-2.5 list-inside list-disc space-y-1 pl-4 text-muted-foreground">
          <li>An incorrect wallet address</li>
          <li>Searching on the wrong blockchain</li>
        </ul>
        <p className="mb-2.5 mt-6 text-muted-foreground">
          Please double-check your input and try again.
        </p>
        <WalletSearch variant="compact" className="mx-auto w-full max-w-lg" />
        <div className="mt-16 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <Link href="/">
            <Button>
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>
          <a href="mailto:lengvietcuong@gmail.com">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact support
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
