import Link from "next/link";
import { PiSmileySadBold as SadFaceIcon } from "react-icons/pi";
import { IoMdArrowRoundBack as ArrowLeftIcon } from "react-icons/io";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="w-screen h-screen grid place-items-center">
      <div className="flex flex-col items-center p-4">
        <div className="flex items-center gap-4 mb-8">
          <SadFaceIcon className="size-10" />
          <h1 className="text-3xl font-bold">Not Found</h1>
        </div>
        <p>
          We couldn&apos;t find the wallet address you&apos;re looking for.
          <br />
          This could be due to:
        </p>
        <ul className="mt-2 self-start list-disc list-inside">
          <li>An incorrect wallet address</li>
          <li>Searching on the wrong blockchain</li>
        </ul>
        <Link href="/">
          <Button className="mt-12 mx-auto">
            <ArrowLeftIcon className="size-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
