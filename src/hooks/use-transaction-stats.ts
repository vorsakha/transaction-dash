"use client";

import { useMemo } from "react";
import { useTransactions } from "./use-transactions";
import { useAccount } from "wagmi";
import { USDC_DECIMALS } from "@/utils/constants";

export interface TransactionStats {
  totalTransactions: number;
  totalSent: number;
  totalReceived: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useTransactionStats = (): TransactionStats => {
  const { address, isConnected } = useAccount();
  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useTransactions({
    sort: "desc",
    page: 1,
    offset: 100,
  });

  const stats = useMemo(() => {
    if (!isConnected || !address || !transactions) {
      return {
        totalTransactions: 0,
        totalSent: 0,
        totalReceived: 0,
      };
    }

    let totalSent = 0;
    let totalReceived = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.value) / Math.pow(10, USDC_DECIMALS);

      const fromAddress = transaction.from.toLowerCase();
      const toAddress = transaction.to.toLowerCase();
      const userAddress = address.toLowerCase();

      if (fromAddress === userAddress) {
        totalSent += amount;
      } else if (toAddress === userAddress) {
        totalReceived += amount;
      }
    });

    return {
      totalTransactions: transactions.length,
      totalSent,
      totalReceived,
    };
  }, [transactions, address, isConnected]);

  return {
    ...stats,
    isLoading,
    error,
    refetch,
  };
};
