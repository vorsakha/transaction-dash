import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const MockWagmiProvider = ({ children }: { children: React.ReactNode }) =>
  children;

const MockThemeProvider = ({ children }: { children: React.ReactNode }) =>
  children;

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MockWagmiProvider>
        <MockThemeProvider>{children}</MockThemeProvider>
      </MockWagmiProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

export const createMockTransaction = (overrides = {}) => ({
  hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  blockNumber: 12345,
  timeStamp: "2024-01-01T12:00:00.000Z",
  from: "0x1234567890123456789012345678901234567890",
  to: "0x0987654321098765432109876543210987654321",
  value: "1000000", // 1 USDC in 6 decimals
  contractAddress: "0xA0b86a33E6417c6c1b6c7e8B3a59b4A1B4C2D3E4",
  tokenName: "USD Coin",
  tokenSymbol: "USDC",
  transactionIndex: 15,
  gas: "21000",
  gasPrice: "20000000000",
  gasUsed: "21000",
  cumulativeGasUsed: "42000",
  input: "0x",
  confirmations: "1000",
  ...overrides,
});

export const createMockBalance = (balance = "1000000") => ({
  balance,
  decimals: 6,
  formatted: (Number(balance) / 1000000).toString(),
  symbol: "USDC",
  value: BigInt(balance),
});

export const createMockAccount = (overrides = {}) => ({
  address: "0x1234567890123456789012345678901234567890",
  isConnected: true,
  isConnecting: false,
  isReconnecting: false,
  connector: null,
  status: "connected",
  ...overrides,
});

export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const createMockClipboard = () => {
  const mockClipboard = {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(""),
  };
  Object.assign(navigator, { clipboard: mockClipboard });
  return mockClipboard;
};

export const createMockWindowOpen = () => {
  const mockOpen = jest.fn();
  Object.defineProperty(window, "open", {
    writable: true,
    value: mockOpen,
  });
  return mockOpen;
};


export const cleanup = () => {
  jest.clearAllMocks();
  jest.resetModules();
};
