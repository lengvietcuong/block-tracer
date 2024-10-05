"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { PiCopySimpleBold as CopyIcon } from "react-icons/pi";
import { PiCheckCircleBold as CheckmarkIcon } from "react-icons/pi";

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1_000);
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
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
