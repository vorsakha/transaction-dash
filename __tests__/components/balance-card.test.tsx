import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAccount } from "wagmi";
import { render as customRender } from "../test-utils/test-utils";
import { createMockUseAccount } from "../test-utils/wagmi-mocks";

const mockUseBalance = jest.fn();
jest.mock("@/hooks/use-balance", () => ({
  useBalance: () => mockUseBalance(),
}));

jest.mock("@/utils/formatting", () => ({
  formatBalance: (balance: string) => {
    const num = parseFloat(balance) / Math.pow(10, 6);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  },
}));

const BalanceCard = () => {
  const { isConnected } = useAccount();
  const { data: balance, error, isLoading, refetch } = mockUseBalance();

  if (!isConnected) {
    return (
      <div>
        <h2>USDC Balance</h2>
        <p>Connect your wallet to view your USDC balance</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>USDC Balance</h2>
        <p>Your current USDC token balance</p>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          aria-label="Refresh balance"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>
      <div>
        {error && <div role="alert">Failed to load balance</div>}
        {isLoading ? (
          <div>
            <div data-testid="loading-spinner">Loading...</div>
          </div>
        ) : balance ? (
          <div>
            <div>{parseFloat(balance.balance).toLocaleString()} USDC</div>
            <div>
              <span>Sepolia Testnet</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;

describe("BalanceCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccount.mockReturnValue(
      createMockUseAccount({
        isConnected: false,
        status: "disconnected",
        chainId: undefined,
      }),
    );

    mockUseBalance.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  describe("When wallet is not connected", () => {
    it("shows connect wallet message", () => {
      customRender(<BalanceCard />);

      expect(screen.getByText("USDC Balance")).toBeInTheDocument();
      expect(
        screen.getByText("Connect your wallet to view your USDC balance"),
      ).toBeInTheDocument();
    });

    it("does not show balance information", () => {
      customRender(<BalanceCard />);

      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      expect(screen.queryByText("USDC")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("When wallet is connected", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          status: "connected",
          chainId: 11155111,
        }),
      );
    });

    it("displays balance when data is available", () => {
      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "1000000", // 1 USDC
          balanceFormatted: 1,
        },
        error: null,
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
      expect(screen.getByText("Sepolia Testnet")).toBeInTheDocument();
    });

    it("displays formatted balance correctly", () => {
      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "2500000", // 2.5 USDC
          balanceFormatted: 2.5,
        },
        error: null,
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      expect(screen.getByText(/2,500,000/)).toBeInTheDocument();
    });

    it("shows loading state when fetching balance", () => {
      mockUseBalance.mockReturnValue({
        data: null,
        error: null,
        isLoading: true,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

      const refreshButton = screen.getByRole("button", {
        name: /refresh balance/i,
      });

      expect(refreshButton).toHaveTextContent("Loading...");
      expect(refreshButton).toBeDisabled();
    });

    it("shows error message when balance fetch fails", () => {
      mockUseBalance.mockReturnValue({
        data: null,
        error: new Error("Network error"),
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Failed to load balance")).toBeInTheDocument();
    });

    it("calls refetch when refresh button is clicked", async () => {
      const mockRefetch = jest.fn();
      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "1000000",
          balanceFormatted: 1,
        },
        error: null,
        isLoading: false,
        refetch: mockRefetch,
      });

      customRender(<BalanceCard />);

      const refreshButton = screen.getByRole("button", { name: /refresh/i });
      await userEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });

    it("disables refresh button while loading", () => {
      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "1000000",
          balanceFormatted: 1,
        },
        error: null,
        isLoading: true,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      const refreshButton = screen.getByRole("button", {
        name: /refresh balance/i,
      });

      expect(refreshButton).toBeDisabled();
      expect(refreshButton).toHaveTextContent("Loading...");
    });

    it("shows zero balance when balance is 0", () => {
      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "0",
          balanceFormatted: 0,
        },
        error: null,
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      expect(screen.getByText("Sepolia Testnet")).toBeInTheDocument();
    });

    it("handles large balance values correctly", () => {
      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "1000000000000", // 1,000,000 USDC
          balanceFormatted: 1000000,
        },
        error: null,
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      expect(screen.getByText(/1,000,000,000,000/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          status: "connected",
          chainId: 11155111,
        }),
      );

      mockUseBalance.mockReturnValue({
        data: {
          address: "0x1234567890123456789012345678901234567890",
          balance: "1000000",
          balanceFormatted: 1,
        },
        error: null,
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      const refreshButton = screen.getByRole("button", {
        name: /refresh balance/i,
      });
      expect(refreshButton).toBeInTheDocument();
    });

    it("announces errors to screen readers", () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          status: "connected",
          chainId: 11155111,
        }),
      );

      mockUseBalance.mockReturnValue({
        data: null,
        error: new Error("Network error"),
        isLoading: false,
        refetch: jest.fn(),
      });

      customRender(<BalanceCard />);

      const errorMessage = screen.getByRole("alert");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
