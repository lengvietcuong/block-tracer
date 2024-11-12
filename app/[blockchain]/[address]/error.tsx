"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw, Mail } from "lucide-react";
import { IoMdArrowRoundBack as ArrowLeftIcon } from "react-icons/io";
import { FaRegSadTear as SadFaceIcon } from "react-icons/fa";

// In production, Next.js hides detailed error information to prevent leaking sensitive details
// Only display the error message if it's not hidden (in development mode)
const NEXTJS_HIDDEN_ERROR_MESSAGE =
  "An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error.";

export default function Component({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleReset() {
    setIsLoading(true);
    // Add a delay of 0.5s to show the loading spinner before reloading
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <SadFaceIcon className="mb-4 h-20 w-20 text-muted-foreground" />
      <h1 className="mb-4 text-2xl font-bold sm:text-4xl">
        Oops! Something went wrong
      </h1>
      {error.message !== NEXTJS_HIDDEN_ERROR_MESSAGE && (
        <p className="mb-2.5 max-w-screen-sm text-muted-foreground">
          <span className="font-bold">Error:</span> {error.message}
        </p>
      )}
      <Button
        variant="secondary"
        className="mb-4"
        onClick={handleReset}
        disabled={isLoading}
      >
        <RotateCcw
          className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
        />
        {isLoading ? "Trying..." : "Try again"}
      </Button>
      <p className="max-w-screen-sm text-muted-foreground">
        An unexpected error occurred while fetching the data you&apos;re looking
        for. We sincerely apologize for this inconvenience.
        {error.digest && (
          <>
            <br />
            If you&apos;d like to contact support, please provide this code:{" "}
            <span className="font-bold">{error.digest}</span>
          </>
        )}
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
            <Mail className="mr-2 h-4 w-4" />
            Contact support
          </Button>
        </a>
      </div>
    </main>
  );
}
