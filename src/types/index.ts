export interface Transaction {
  hash: string;
  blockNumber: number;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: number;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface TransactionDetails extends Transaction {
  methodId: string;
  functionName: string;
  status: number;
  isError: string;
  errCode: string;
}

export interface TransactionFilters {
  page?: number;
  offset?: number;
  sort?: "asc" | "desc";
  startBlock?: number;
  endBlock?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface LogEvent {
  transactionHash: `0x${string}`;
  blockNumber: bigint;
  transactionIndex: number;
  address: `0x${string}`;
  topics: [] | [`0x${string}`, ...`0x${string}`[]];
  data: `0x${string}`;
  args?: {
    from: string;
    to: string;
    value: bigint;
  };
}
