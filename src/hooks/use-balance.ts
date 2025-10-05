"use client";

import { useAccount, useReadContract } from "wagmi";
import { USDC_CONTRACT_ADDRESS } from "@/utils/constants";

const USDC_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const useBalance = () => {
  const { address, isConnected } = useAccount();

  const { data, error, isLoading, refetch } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: isConnected && !!address,
      staleTime: 1000 * 30,
      refetchInterval: 1000 * 60,
    },
  });

  const balanceFormatted = data ? Number(data) / Math.pow(10, 6) : 0;

  return {
    data: data
      ? {
          address: address!,
          balance: data.toString(),
          balanceFormatted,
        }
      : null,
    error,
    isLoading,
    refetch,
  };
};
