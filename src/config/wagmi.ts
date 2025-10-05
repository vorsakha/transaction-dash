import { http, createConfig } from "wagmi";
import { mainnet, sepolia, type Chain } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const networkMap: Record<string, Chain> = {
  mainnet,
  sepolia,
};

const networkName = process.env.NEXT_PUBLIC_NETWORK || "sepolia";
const selectedChain = networkMap[networkName];

export const chain = selectedChain || sepolia;

export const config = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [chain.id]: http(),
  },
});
