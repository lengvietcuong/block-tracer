import { NextResponse } from "next/server";
import axios from "axios";
import status from "http-status";
import { BlockchainSymbol, Report } from "@/types";
import { CHAIN_ANALYSIS_URL } from "@/constants";
import { isValidAddress, getJsonOfError } from "@/utils";

// Define the API endpoint /api/[blockchain]/[address]/reports
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
  const { address, blockchain } = params;
  if (!isValidAddress(address, blockchain)) {
    return NextResponse.json(
      { message: "Not found" },
      { status: status.NOT_FOUND },
    );
  }

  // Connect with Chainalysis and fetch reports
  try {
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.CHAINALYSIS_API_KEY,
    };
    const response = await axios.get(`${CHAIN_ANALYSIS_URL}/${address}`, {
      headers,
    });
    const reports = processReports(response.data.identifications);
    return NextResponse.json(reports);
  } catch (error) {
    return getJsonOfError(error);
  }
}

// Function to remove the report URL from the description (because there's already a separate URL attribute)
function cleanReportDescription(report: Report): Report {
  const { url, description } = report;
  
  // Remove the URL from the description if it appears at the end
  const descWithoutUrl = description.endsWith(url)
    ? description.slice(0, -url.length).trim()
    : description;
  
  return { ...report, description: descWithoutUrl };
}

// Function to process reports, remove duplicates by URL, and return a cleaned array of unique reports
function processReports(reports: Report[]): Report[] {
  const uniqueReports: Record<string, Report> = {};

  // Remove duplicates by URL and clean descriptions
  for (const report of reports) {
    const cleanedReport = cleanReportDescription(report);
    
    // Only add to uniqueReports if URL is not already present
    if (!uniqueReports[cleanedReport.url]) {
      uniqueReports[cleanedReport.url] = cleanedReport;
    }
  }

  // Return an array of unique, cleaned reports
  return Object.values(uniqueReports);
}
