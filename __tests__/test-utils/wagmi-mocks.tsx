import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

export const renderHookWithWagmi = <T = unknown,>(
  hook: () => T,
  options?: { wrapper?: React.ComponentType<{ children: ReactNode }> },
) => {
  return renderHook(hook, {
    wrapper: createWrapper(),
    ...options,
  });
};


// Properly typed mock utilities (simplified to avoid wagmi import issues)
export const createMockUseAccount = (overrides: any = {}) => ({
  address: "0x1234567890123456789012345678901234567890",
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  connector: null,
  status: "disconnected" as const,
  chainId: undefined,
  chain: undefined,
  chains: [],
  ...overrides,
});

export const createMockUseConnect = (overrides: any = {}) => ({
  connect: jest.fn(),
  connectors: [
    {
      id: "injected",
      name: "Injected",
      type: "injected" as const,
      uid: "injected",
    },
  ],
  isPending: false,
  error: null,
  ...overrides,
});

export const createMockUseDisconnect = (overrides: any = {}) => ({
  disconnect: jest.fn(),
  isPending: false,
  error: null,
  ...overrides,
});

export const createMockUseEnsName = (overrides: any = {}) => ({
  data: undefined,
  isLoading: false,
  isError: false,
  isSuccess: false,
  ...overrides,
});

export const createMockUseBalance = (overrides: any = {}) => ({
  data: undefined,
  isLoading: false,
  isError: false,
  isSuccess: false,
  ...overrides,
});
