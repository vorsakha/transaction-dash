export const ETHERSCAN_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "",
  BASE_URL:
    process.env.NEXT_PUBLIC_NETWORK === "sepolia"
      ? "https://api-sepolia.etherscan.io/api"
      : "https://api.etherscan.io/v2/api",
  USDC_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS ||
    (process.env.NEXT_PUBLIC_NETWORK === "sepolia"
      ? "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" // USDC on Sepolia testnet
      : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"), // USDC on Mainnet
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || "sepolia",
  RATE_LIMIT_DELAY: 600,
  CHAIN_ID: process.env.NEXT_PUBLIC_NETWORK === "sepolia" ? 11155111 : 1,
} as const;
