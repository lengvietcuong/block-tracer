"use server";

import axios from "axios";

const URL = "https://public.chainalysis.com/api/v1/address";

export async function getWalletReports(address: string) {
  const response = await axios.get(`${URL}/${address}`, {
    headers: {
      'X-API-Key': `${process.env.CHAIN_ANALYSIS_API_KEY}`,
      'Accept': "application/json",
    },
  });
  return response.data;
}
