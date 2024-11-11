"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, Mail } from "lucide-react";
import { FaRegSadTear as SadFaceIcon } from "react-icons/fa";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <SadFaceIcon className="mb-4 h-20 w-20 text-muted-foreground" />
      <h1 className="mb-4 text-4xl font-bold">Oops! Something went wrong</h1>
      <p className="text-muted-foreground">Error: {error.message}</p>
      <p className="mb-12 text-muted-foreground">
        We apologize for the inconvenience. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={reset} className="flex items-center justify-center">
          <RotateCcw className="mr-2 h-4 w-4"/>
          Try again
        </Button>
        <a href="mailto:lengvietcuong@gmail.com">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4"/>
            Contact support
          </Button>
        </a>
      </div>
    </main>
  );
}
