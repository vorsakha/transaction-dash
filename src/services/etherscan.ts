import { ETHERSCAN_CONFIG } from "@/config/etherscan";
import type {
  Transaction,
  TransactionDetails,
  TransactionFilters,
} from "@/types";

export class EtherscanService {
  private baseUrl: string;
  private apiKey: string;
  private usdcContractAddress: string;
  private chainId: number;

  constructor() {
    this.baseUrl = ETHERSCAN_CONFIG.BASE_URL;
    this.apiKey = ETHERSCAN_CONFIG.API_KEY;
    this.usdcContractAddress = ETHERSCAN_CONFIG.USDC_CONTRACT_ADDRESS;
    this.chainId = ETHERSCAN_CONFIG.CHAIN_ID;
  }

  private async makeRequest<T>(params: Record<string, string>): Promise<T> {
    const urlParams = new URLSearchParams({
      ...params,
      apikey: this.apiKey,
      chainid: this.chainId.toString(),
    });

    const response = await fetch(`${this.baseUrl}?${urlParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "0") {
      if (
        data.result === "No transactions found" ||
        data.message === "No transactions found" ||
        (Array.isArray(data.result) && data.result.length === 0)
      ) {
        return [] as T;
      }
      throw new Error(data.message || data.result || "API request failed");
    }

    return data.result;
  }

  async getUSDCBalance(address: string): Promise<{
    address: string;
    balance: string;
    balanceFormatted: number;
  }> {
    const params: Record<string, string> = {
      module: "account",
      action: "tokenbalance",
      contractaddress: this.usdcContractAddress,
      address: address,
      tag: "latest",
    };

    const balance = await this.makeRequest<string>(params);
    const balanceFormatted = parseFloat(balance) / 1e6;

    return {
      address,
      balance,
      balanceFormatted,
    };
  }

  async getUSDCTransactions(
    address: string,
    filters: TransactionFilters = {},
  ): Promise<Transaction[]> {
    const params: Record<string, string> = {
      module: "account",
      action: "tokentx",
      contractaddress: this.usdcContractAddress,
      address: address,
      sort: filters.sort || "desc",
      startblock: filters.startBlock?.toString() || "",
      endblock: filters.endBlock?.toString() || "",
      page: filters.page?.toString() || "1",
      offset: filters.offset?.toString() || "100",
    };

    const transactions = await this.makeRequest<Transaction[]>(params);

    return transactions.map((tx) => ({
      ...tx,
      confirmations: tx.confirmations || "0",
    }));
  }

  async getTransactionDetails(txHash: string): Promise<TransactionDetails> {
    const [txReceipt, txDetails, currentBlock] = await Promise.all([
      this.makeRequest<{
        blockNumber: string;
        transactionIndex: string;
        status: string;
        gasUsed: string;
        cumulativeGasUsed: string;
        contractAddress?: string;
      }>({
        module: "proxy",
        action: "eth_getTransactionReceipt",
        txhash: txHash,
      }),
      this.makeRequest<{
        from: string;
        to: string;
        value: string;
        gas: string;
        gasPrice: string;
        input: string;
      }>({
        module: "proxy",
        action: "eth_getTransactionByHash",
        txhash: txHash,
      }),
      this.makeRequest<string>({
        module: "proxy",
        action: "eth_blockNumber",
      }),
    ]);

    const blockDetails = await this.makeRequest<{
      timestamp: string;
    }>({
      module: "proxy",
      action: "eth_getBlockByNumber",
      tag: txReceipt.blockNumber,
      boolean: "false",
    });

    const blockNumber = parseInt(txReceipt.blockNumber, 16);
    const currentBlockNumber = parseInt(currentBlock, 16);
    const confirmations =
      currentBlockNumber > blockNumber
        ? (currentBlockNumber - blockNumber).toString()
        : "0";

    const isUSDCTransaction =
      txDetails.to?.toLowerCase() === this.usdcContractAddress.toLowerCase() ||
      txReceipt.contractAddress?.toLowerCase() ===
        this.usdcContractAddress.toLowerCase();

    return {
      hash: txHash,
      blockNumber,
      timeStamp: blockDetails.timestamp,
      from: txDetails.from,
      to: txDetails.to || "",
      value: txDetails.value,
      contractAddress: isUSDCTransaction
        ? this.usdcContractAddress
        : txReceipt.contractAddress || "",
      tokenName: isUSDCTransaction ? "USD Coin" : "",
      tokenSymbol: isUSDCTransaction ? "USDC" : "",
      transactionIndex: parseInt(txReceipt.transactionIndex, 16),
      gas: txDetails.gas,
      gasPrice: txDetails.gasPrice,
      gasUsed: txReceipt.gasUsed,
      cumulativeGasUsed: txReceipt.cumulativeGasUsed,
      input: txDetails.input,
      confirmations,
      methodId: txDetails.input.slice(0, 10),
      functionName:
        isUSDCTransaction && txDetails.input.startsWith("0xa9059cbb")
          ? "transfer"
          : "",
      status: parseInt(txReceipt.status, 16),
      isError: txReceipt.status === "0" ? "1" : "0",
      errCode: "",
    };
  }
}

export const etherscanService = new EtherscanService();
