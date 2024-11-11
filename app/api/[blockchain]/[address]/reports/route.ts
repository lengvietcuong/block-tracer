import { NextResponse } from "next/server";
import axios from "axios";
import { BlockchainSymbol } from "@/types";
import { CHAIN_ANALYSIS_URL } from "@/constants";

// Define the API endpoint /[blockchain]/[address]/reports
export async function GET(
  _request: Request,
  { params }: { params: { blockchain: BlockchainSymbol; address: string } },
  ) {
  const { address } = params;
  // Connect with Chain Analysis and fetch reports
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.CHAIN_ANALYSIS_API_KEY,
  };
  const response = await axios.get(`${CHAIN_ANALYSIS_URL}/${address}`, {
    headers,
  });
  return NextResponse.json(response.data);
}