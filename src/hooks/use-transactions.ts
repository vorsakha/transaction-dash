"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { etherscanService } from "@/services/etherscan";
import {
  useAccount,
  useClient,
  useBlockNumber,
  useWaitForTransactionReceipt,
  useTransaction,
  useTransactionConfirmations,
} from "wagmi";
import { USDC_CONTRACT_ADDRESS } from "@/utils/constants";
import { parseAbi, decodeEventLog } from "viem";
import { getLogs } from "viem/actions";
import type { TransactionFilters, Transaction, LogEvent } from "@/types";

const USDC_TRANSFER_ABI = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

export const useWagmiUSDCEvents = (filters: TransactionFilters = {}) => {
  const { address, isConnected } = useAccount();
  const { data: currentBlock } = useBlockNumber();
  const client = useClient();

  const normalizedFilters = useMemo(
    () => ({
      startBlock: filters.startBlock,
      endBlock: filters.endBlock,
    }),
    [filters.startBlock, filters.endBlock],
  );

  const queryKey = useMemo(
    () => [
      "usdc-events",
      address,
      normalizedFilters.startBlock,
      normalizedFilters.endBlock,
    ],
    [address, normalizedFilters.startBlock, normalizedFilters.endBlock],
  );

  const queryFn = useCallback(async () => {
    if (!client || !address) return [];

    const logs = await getLogs(client, {
      address: USDC_CONTRACT_ADDRESS,
      events: [USDC_TRANSFER_ABI],
      fromBlock: normalizedFilters.startBlock
        ? BigInt(normalizedFilters.startBlock)
        : BigInt(0),
      toBlock: normalizedFilters.endBlock
        ? BigInt(normalizedFilters.endBlock)
        : currentBlock || BigInt("latest"),
    });

    return logs;
  }, [
    client,
    address,
    normalizedFilters.startBlock,
    normalizedFilters.endBlock,
    currentBlock,
  ]);

  return useQuery({
    queryKey,
    queryFn,
    enabled: isConnected && !!address && !!client,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

const convertLogToTransaction = (log: LogEvent): Transaction => {
  const { value } = log.args || {};
  const from = log.args?.from || "";
  const to = log.args?.to || "";

  return {
    hash: log.transactionHash,
    blockNumber: Number(log.blockNumber),
    timeStamp: new Date().toISOString(), // We don't get timestamp from logs
    from,
    to,
    value: value?.toString() || "0",
    contractAddress: USDC_CONTRACT_ADDRESS,
    tokenName: "USD Coin",
    tokenSymbol: "USDC",
    transactionIndex: log.transactionIndex || 0,
    gas: "0", // Not available in logs
    gasPrice: "0", // Not available in logs
    gasUsed: "0", // Not available in logs
    cumulativeGasUsed: "0", // Not available in logs
    input: "0x",
    confirmations: "0", // Would need current block to calculate
  };
};

export const useTransactions = (filters: TransactionFilters = {}) => {
  const { address, isConnected } = useAccount();
  const client = useClient();

  const normalizedFilters = useMemo(
    () => ({
      startBlock: filters.startBlock,
      endBlock: filters.endBlock,
      sort: filters.sort || "desc",
      page: filters.page || 1,
      offset: filters.offset || 100,
    }),
    [
      filters.startBlock,
      filters.endBlock,
      filters.sort,
      filters.page,
      filters.offset,
    ],
  );

  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useWagmiUSDCEvents(filters);

  const etherscanQueryKey = useMemo(
    () => [
      "transactions",
      "etherscan",
      address,
      normalizedFilters.startBlock,
      normalizedFilters.endBlock,
      normalizedFilters.sort,
      normalizedFilters.page,
      normalizedFilters.offset,
    ],
    [
      address,
      normalizedFilters.startBlock,
      normalizedFilters.endBlock,
      normalizedFilters.sort,
      normalizedFilters.page,
      normalizedFilters.offset,
    ],
  );

  const etherscanQuery = useQuery({
    queryKey: etherscanQueryKey,
    queryFn: () =>
      etherscanService.getUSDCTransactions(address!, normalizedFilters),
    enabled: isConnected && !!address && !!client && !events?.length,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const convertedTransactions = useMemo(() => {
    if (!events || events.length === 0 || !address) return null;

    const transactions = events.map((log) => convertLogToTransaction(log));

    return normalizedFilters.sort === "asc"
      ? [...transactions].sort(
          (a: Transaction, b: Transaction) => a.blockNumber - b.blockNumber,
        )
      : [...transactions].sort(
          (a: Transaction, b: Transaction) => b.blockNumber - a.blockNumber,
        );
  }, [events, address, normalizedFilters.sort]);

  if (convertedTransactions) {
    return {
      data: convertedTransactions,
      isLoading: isLoadingEvents,
      error: null,
      refetch: refetchEvents,
    };
  }

  return etherscanQuery;
};

export const useTransactionDetails = (txHash: string | null) => {
  const client = useClient();

  const transactionReceipt = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    query: {
      enabled: !!txHash && !!client,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  });

  const transaction = useTransaction({
    hash: txHash as `0x${string}`,
    query: {
      enabled: !!txHash && !!client,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  });

  const transactionConfirmations = useTransactionConfirmations({
    hash: txHash as `0x${string}`,
    query: {
      enabled: !!txHash && !!client,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  });

  const transformedData = useMemo(() => {
    if (!transactionReceipt.data) return null;

    const receipt = transactionReceipt.data;

    let from = receipt.from;
    let to = receipt.to || "";
    let value = transaction.data?.value?.toString() || "0";
    let contractAddress = "";
    let tokenName = "";
    let tokenSymbol = "";

    if (receipt.logs && receipt.logs.length > 0) {
      const usdcTransferLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === USDC_CONTRACT_ADDRESS.toLowerCase(),
      );

      if (usdcTransferLog) {
        const decodedEvent = decodeEventLog({
          abi: USDC_TRANSFER_ABI,
          topics: usdcTransferLog.topics,
          data: usdcTransferLog.data,
        });

        if (decodedEvent && decodedEvent.eventName === "Transfer") {
          const transferEvent = decodedEvent as {
            eventName: "Transfer";
            args: {
              from: string;
              to: string;
              value: bigint;
            };
          };

          from = transferEvent.args.from as `0x${string}`;
          to = transferEvent.args.to;
          value = transferEvent.args.value.toString();
          contractAddress = USDC_CONTRACT_ADDRESS;
          tokenName = "USD Coin";
          tokenSymbol = "USDC";
        }
      }
    }

    return {
      hash: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber),
      timeStamp: receipt.blockNumber ? new Date().toISOString() : "",
      from,
      to,
      value,
      contractAddress,
      tokenName,
      tokenSymbol,
      transactionIndex: receipt.transactionIndex || 0,
      gas: transaction.data?.gas?.toString() || "0",
      gasPrice: transaction.data?.gasPrice?.toString() || "0",
      gasUsed: receipt.gasUsed?.toString() || "0",
      cumulativeGasUsed: receipt.cumulativeGasUsed?.toString() || "0",
      input: transaction.data?.input || "0x",
      confirmations: transactionConfirmations.data?.toString() || "0",
    };
  }, [
    transactionReceipt.data,
    transaction.data,
    transactionConfirmations.data,
  ]);

  const isLoading =
    transactionReceipt.isLoading ||
    transaction.isLoading ||
    transactionConfirmations.isLoading;
  const error =
    transactionReceipt.error ||
    transaction.error ||
    transactionConfirmations.error;

  return {
    data: transformedData,
    isLoading,
    error,
    isSuccess:
      transactionReceipt.isSuccess &&
      transaction.isSuccess &&
      transactionConfirmations.isSuccess,
    refetch: () => {
      transactionReceipt.refetch();
      transaction.refetch();
      transactionConfirmations.refetch();
    },
  };
};
