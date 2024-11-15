import Link from "next/link";
import { FaRegSadTear as SadFaceIcon } from "react-icons/fa";
import { IoMdArrowRoundBack as ArrowLeftIcon } from "react-icons/io";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col p-4">
        <SadFaceIcon className="mx-auto mb-4 h-20 w-20 text-muted-foreground" />
        <h1 className="mx-auto mb-6 text-2xl font-bold sm:text-4xl">
          Slow down there...
        </h1>
        <p className="max-w-screen-sm text-muted-foreground">
          You&apos;ve made too many requests too quickly. Please try again
          later. If you believe this to be a mistake or would like to increase
          your limits, please don&apos;t hesitate to contact us.
        </p>
        <div className="mt-12 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
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
