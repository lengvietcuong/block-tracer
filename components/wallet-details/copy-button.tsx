"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PiCopySimpleBold as CopyIcon } from "react-icons/pi";
import { PiCheckCircleBold as CheckmarkIcon } from "react-icons/pi";

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(content);
    // Setting the copied state to true will show the checkmark icon
    setCopied(true);
    setTimeout(() => setCopied(false), 1_000); // The checkmark icon will disappear after 1 second
  }

  return (
    // Set delayDuration to 0 to show the "Copy" text immediately when the user hovers over the button
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Copy"
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckmarkIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
