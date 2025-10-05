import { USDC_DECIMALS } from "./constants";

export const formatAddress = (address: string, length = 6): string => {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatBalance = (
  balance: string,
  decimals: number = USDC_DECIMALS,
): string => {
  if (!balance) return "0";
  const balanceNum = parseFloat(balance) / Math.pow(10, decimals);
  if (decimals === 18) {
    return balanceNum.toFixed(6);
  }
  return balanceNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

export const formatTransactionHash = (hash: string): string => {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const formatDateTime = (timestamp: string): string => {
  return new Date(parseInt(timestamp) * 1000).toLocaleString();
};

export const formatGasPrice = (gasPrice: string): string => {
  const gwei = (parseFloat(gasPrice) / Math.pow(10, 9)).toFixed(2);
  return `${gwei} Gwei`;
};

export const formatGasUsed = (gasUsed: string): string => {
  const gas = parseInt(gasUsed, 16);
  return gas.toLocaleString();
};
