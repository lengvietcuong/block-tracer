import { NextResponse } from "next/server";
import axios from "axios";
import { BlockchainSymbol } from "@/types";
import { CHAIN_ANALYSIS_URL } from "@/constants";

// Headers for Chain Analysis API authentication
const headers = {
 "Content-Type": "application/json",
 "X-API-KEY": process.env.CHAIN_ANALYSIS_API_KEY,
};

export async function GET(
 _request: Request,
 { params }: { params: { blockchain: BlockchainSymbol; address: string } },
) {
 const { address } = params;

 // Fetch risk assessment data for the given wallet address
 const response = await axios.get(`${CHAIN_ANALYSIS_URL}/${address}`, {
   headers,
 });

 // Return the risk analysis results directly from the Chain Analysis API
 return NextResponse.json(response.data);
}