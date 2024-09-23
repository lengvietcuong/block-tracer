"use client"

import React, {useState, useEffect} from "react";
import api from "@/components/api";
import TransactionGraph from "@/components/graphs/transaction-graph";
import TransactionHistory from "@/components/transaction-history";
import { Transaction } from "@/types";

export default function API_call() {
    const [transaction, setTransactions] = useState<Transaction[]>([]);
    const [address, setAddress] = useState<string>("0x")
    useEffect(() => {
        const fetchData = async () => {
          const result = await api.post("/transactions");
      
          if (result.status === 200) {
            console.log(result.data);
            setAddress(result.data[0].from_address);
            const transactions: Transaction[] = []
      
            result.data.forEach((item: any) => {
                transactions.push({
                    id: item.hash,
                    sender: item.from_address,
                    receiver: item.to_address,
                    amount: item.value,
                });
            });
            setTransactions(transactions);
          }
        };
      
        fetchData();
      }, []);
      
  return(
    <div>
        <h1>cứu</h1>
          <div className="w-fit mx-auto">
            <TransactionGraph
              className="size-[360px] md:size-[440px] lg:size-[500px]"
              address={address}
              transactions={transaction}
            />
          </div>
        <TransactionHistory transactions={transaction} />
    </div>
  );
}