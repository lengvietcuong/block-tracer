import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert, CircleCheckBig } from "lucide-react";
import { PiArrowUpRightBold as UpRightArrowIcon } from "react-icons/pi";
import { BlockchainSymbol, Report } from "@/types";
import { redirectIfFailed } from "@/utils";

interface WalletReportsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
}

// Function to remove the URL from the description and limit to 100 words
function shortenDescription(description: string): string {
  // Split into words and limit to 100
  const words = description.split(/\s+/);
  if (words.length <= 100) {
    return description;
  }

  // Join first 100 words and add ellipsis
  return words.slice(0, 100).join(" ") + "...";
}

// Main component that fetches and displays wallet reports
export default async function WalletReports({
  blockchainSymbol,
  address,
}: WalletReportsProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${blockchainSymbol}/${address}/reports`,
    { cache: "no-store" },
  );
  redirectIfFailed(response);
  const reports = await response.json();
  const totalReports = reports.length;

  // Display alert if no reports are found
  if (totalReports === 0) {
    return (
      <Alert className="w-fit">
        <CircleCheckBig className="size-4 stroke-primary" />
        <AlertTitle>No reports found</AlertTitle>
        <AlertDescription className="mt-2 text-xs text-muted-foreground">
          Note: Reports are from{" "}
          <a
            href="https://www.chainalysis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="peer underline-offset-4 transition-colors duration-100 hover:text-foreground hover:underline"
          >
            chainalysis.com
          </a>
          <UpRightArrowIcon className="peer ml-0.5 inline-block transition-colors duration-100 peer-hover:fill-foreground" />{" "}
          and may not be complete.
        </AlertDescription>
      </Alert>
    );
  }

  // Display categorized reports in cards if reports are found
  return (
    <>
      <Alert className="w-fit border-destructive/75 bg-destructive/15">
        <TriangleAlert className="size-4 stroke-destructive" />
        <AlertTitle>
          {totalReports} report{totalReports > 1 ? "s" : ""} found
        </AlertTitle>
        <AlertDescription className="mt-2 text-xs text-muted-foreground">
          Note: Reports are pulled from{" "}
          <a
            href="https://www.chainalysis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="peer underline-offset-4 transition-colors duration-100 hover:text-foreground hover:underline"
          >
            chainalysis.com
          </a>
          <UpRightArrowIcon className="peer ml-0.5 inline-block transition-colors duration-100 peer-hover:fill-foreground" />{" "}
          and may not be complete.
        </AlertDescription>
      </Alert>
      <Card className="mt-4 bg-transparent">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {(reports as Report[]).map((report, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="mb-2 break-all text-lg font-semibold">
                {report.name}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {shortenDescription(report.description)}
              </p>
              {report.url && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">More Info</Badge>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm italic text-muted-foreground transition-colors duration-100 hover:text-foreground"
                  >
                    {report.url}
                  </a>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
