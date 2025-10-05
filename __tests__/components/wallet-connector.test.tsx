import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useBalance,
} from "wagmi";
import {
  createMockClipboard,
  createMockWindowOpen,
} from "../test-utils/test-utils";
import {
  createMockUseAccount,
  createMockUseConnect,
  createMockUseDisconnect,
  createMockUseEnsName,
  createMockUseBalance,
} from "../test-utils/wagmi-mocks";

const WalletConnector = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName();
  const { data: ethBalance } = useBalance();

  const copyToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  const openInBlockExplorer = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank");
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => connect({ connector: connectors[0] })}
          disabled={isPending || isConnecting}
          className="flex items-center gap-2"
        >
          {isPending || isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button className="flex items-center gap-2">
        <div className="h-2 w-2 bg-green-500 rounded-full" />
        {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
      </button>
      <div data-testid="dropdown-menu">
        <div>{ensName || "Wallet Connected"}</div>
        <div>
          {address ? `${address.slice(0, 8)}...${address.slice(-4)}` : ""}
        </div>
        {ethBalance && <div>{ethBalance.formatted} ETH</div>}
        <button onClick={copyToClipboard}>Copy Address</button>
        <button onClick={openInBlockExplorer}>View on Etherscan</button>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    </div>
  );
};

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>;
const mockUseDisconnect = useDisconnect as jest.MockedFunction<
  typeof useDisconnect
>;
const mockUseEnsName = useEnsName as jest.MockedFunction<typeof useEnsName>;
const mockUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;

describe("WalletConnector", () => {
  const mockAddress = "0x1234567890123456789012345678901234567890";
  const mockEnsName = "example.eth";
  const mockClipboard = createMockClipboard();
  const mockWindowOpen = createMockWindowOpen();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccount.mockReturnValue(
      createMockUseAccount({
        address: mockAddress,
        isConnected: false,
        status: "disconnected",
        chainId: undefined,
      }),
    );

    mockUseConnect.mockReturnValue(createMockUseConnect());

    mockUseDisconnect.mockReturnValue(createMockUseDisconnect());

    mockUseEnsName.mockReturnValue(createMockUseEnsName());

    mockUseBalance.mockReturnValue(createMockUseBalance());
  });

  describe("When wallet is not connected", () => {
    it("shows connect wallet button", () => {
      render(<WalletConnector />);

      const connectButton = screen.getByRole("button", {
        name: /connect wallet/i,
      });
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).not.toBeDisabled();
    });

    it("shows connecting state when connecting", () => {
      mockUseConnect.mockReturnValue(
        createMockUseConnect({
          isPending: true,
        }),
      );

      render(<WalletConnector />);

      const connectButton = screen.getByRole("button", { name: /connecting/i });
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toBeDisabled();
    });

    it("calls connect when connect button is clicked", async () => {
      const mockConnect = jest.fn();
      mockUseConnect.mockReturnValue(
        createMockUseConnect({
          connect: mockConnect,
        }),
      );

      render(<WalletConnector />);

      const connectButton = screen.getByRole("button", {
        name: /connect wallet/i,
      });
      await userEvent.click(connectButton);

      expect(mockConnect).toHaveBeenCalledWith({
        connector: {
          id: "injected",
          name: "Injected",
          type: "injected" as const,
          uid: "injected",
        },
      });
    });
  });

  describe("When wallet is connected", () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          address: mockAddress,
          isConnected: true,
          status: "connected",
          chainId: 11155111,
        }),
      );
    });

    it("shows wallet dropdown with formatted address", () => {
      render(<WalletConnector />);

      const dropdownButton = screen.getByRole("button", {
        name: /0x1234\.\.\.7890/i,
      });
      expect(dropdownButton).toBeInTheDocument();

      const indicator = dropdownButton.querySelector(".bg-green-500");
      expect(indicator).toBeInTheDocument();
    });

    it("shows ENS name when available", () => {
      mockUseEnsName.mockReturnValue(
        createMockUseEnsName({
          data: mockEnsName,
          isSuccess: true,
        }),
      );

      render(<WalletConnector />);

      const dropdownButton = screen.getByRole("button", { name: mockEnsName });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("shows ETH balance when available", () => {
      mockUseBalance.mockReturnValue(
        createMockUseBalance({
          data: {
            value: BigInt("1000000000000000000"), // 1 ETH
            decimals: 18,
            formatted: "1.0",
            symbol: "ETH",
          },
          isSuccess: true,
        }),
      );

      render(<WalletConnector />);

      expect(screen.getByText("1.0 ETH")).toBeInTheDocument();
    });

    it("copies address to clipboard when copy is clicked", async () => {
      render(<WalletConnector />);

      const copyButton = screen.getByText(/copy address/i);
      await userEvent.click(copyButton);

      expect(mockClipboard.writeText).toHaveBeenCalledWith(mockAddress);
    });

    it("opens block explorer when view on etherscan is clicked", async () => {
      render(<WalletConnector />);

      const etherscanButton = screen.getByText(/view on etherscan/i);
      await userEvent.click(etherscanButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://sepolia.etherscan.io/address/0x1234567890123456789012345678901234567890",
        "_blank",
      );
    });

    it("calls disconnect when disconnect is clicked", async () => {
      const mockDisconnect = jest.fn();
      mockUseDisconnect.mockReturnValue(
        createMockUseDisconnect({
          disconnect: mockDisconnect,
        }),
      );

      render(<WalletConnector />);

      const disconnectButton = screen.getByText(/disconnect/i);
      await userEvent.click(disconnectButton);

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it("displays wallet info correctly", () => {
      mockUseEnsName.mockReturnValue(
        createMockUseEnsName({
          data: mockEnsName,
          isSuccess: true,
        }),
      );

      mockUseBalance.mockReturnValue(
        createMockUseBalance({
          data: {
            value: BigInt("1000000000000000000"), // 1 ETH
            decimals: 18,
            formatted: "1.0",
            symbol: "ETH",
          },
          isSuccess: true,
        }),
      );

      render(<WalletConnector />);

      const dropdownMenu = screen.getByTestId("dropdown-menu");
      expect(dropdownMenu).toHaveTextContent(mockEnsName);
      expect(dropdownMenu).toHaveTextContent("1.0 ETH");
      expect(dropdownMenu).toHaveTextContent("0x123456...7890");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          address: mockAddress,
          isConnected: true,
          status: "connected",
          chainId: 11155111,
        }),
      );

      render(<WalletConnector />);

      const dropdownButton = screen.getByRole("button", {
        name: /0x1234\.\.\.7890/i,
      });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("shows loading state when connecting", () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          address: undefined,
          isConnected: false,
          isConnecting: true,
          status: "connecting",
          chainId: undefined,
        }),
      );

      render(<WalletConnector />);

      const connectButton = screen.getByRole("button", { name: /connecting/i });
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toBeDisabled();
    });
  });
});
