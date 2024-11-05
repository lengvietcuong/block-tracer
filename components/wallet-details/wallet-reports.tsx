import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert, CircleCheckBig } from "lucide-react";
import { BlockchainSymbol } from "@/types";

interface WalletReportsProps {
  blockchainSymbol: BlockchainSymbol;
  address: string;
}

interface Report {
  category: string;
  name: string;
  description: string;
  url: string;
}

// Function to process and categorize reports by unique URL and category
function processReports(reports: Report[]): Record<string, Report[]> {
  // Remove duplicate reports based on unique URLs
  const uniqueReports = reports.reduce(
    (acc: Record<string, Report>, report: Report) => {
      if (!acc[report.url]) {
        acc[report.url] = report;
      }
      return acc;
    },
    {},
  );

  // Group unique reports by category
  return Object.values(uniqueReports).reduce(
    (acc: Record<string, Report[]>, report: Report) => {
      if (!acc[report.category]) {
        acc[report.category] = [];
      }
      acc[report.category].push(report);
      return acc;
    },
    {},
  );
}

// Function to remove the URL from the description and limit to 100 words
function cleanDescription(description: string, url: string): string {
  // First remove the URL if it appears at the end
  const descWithoutUrl = description.endsWith(url)
    ? description.slice(0, -url.length).trim()
    : description;
  
  // Split into words and limit to 100
  const words = descWithoutUrl.split(/\s+/);
  if (words.length <= 100) {
    return descWithoutUrl;
  }
  
  // Join first 100 words and add ellipsis
  return words.slice(0, 100).join(' ') + '...';
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
  const fetchedReports = await response.json();
  const reports = processReports(fetchedReports.identifications);
  const totalReports = Object.values(reports).flat().length;

  // Display alert if no reports are found
  if (totalReports === 0) {
    return (
      <Alert className="w-fit">
        <CircleCheckBig className="size-4 stroke-primary" />
        <AlertTitle>No reports found</AlertTitle>
        <AlertDescription className="mt-2 text-xs text-muted-foreground">
          Note: Reports are from{" "}
          <a
            href="https://www.chainanalysis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="italic hover:text-foreground"
          >
            chainanalysis.com
          </a>{" "}
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
            href="https://www.chainanalysis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="italic transition-colors duration-100 hover:text-foreground"
          >
            chainanalysis.com
          </a>{" "}
          and may not be complete.
        </AlertDescription>
      </Alert>
      {Object.entries(reports).map(([category, categoryReports]) => (
        <Card key={category} className="mt-4 bg-transparent">
          <CardHeader>
            <CardTitle className="capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryReports.map((report, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className="mb-2 break-all text-lg font-semibold">
                  {report.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {cleanDescription(report.description, report.url)}
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
      ))}
    </>
  );
}