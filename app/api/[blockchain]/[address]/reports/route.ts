import { NextResponse } from "next/server";
import axios from "axios";
import status from "http-status";
import { BlockchainSymbol } from "@/types";
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

  // Connect with Chain Analysis and fetch reports
  try {
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.CHAIN_ANALYSIS_API_KEY,
    };
    const response = await axios.get(`${CHAIN_ANALYSIS_URL}/${address}`, {
      headers,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return getJsonOfError(error);
  }
}
