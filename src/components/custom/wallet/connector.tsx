"use client";

import { Button } from "@/components/ui/button";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useBalance,
} from "wagmi";
import { formatAddress } from "@/utils/formatting";
import { Wallet, LogOut, Copy, ExternalLink, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chain } from "@/config/wagmi";

export const WalletConnector = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ethBalance } = useBalance({ address });

  const copyToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
    }
  };

  const openInBlockExplorer = () => {
    if (address) {
      window.open(
        `${chain.blockExplorers?.default.url}/address/${address}`,
        "_blank",
      );
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-2">
        <Button
          onClick={() => connect({ connector: connectors[0] })}
          disabled={isPending || isConnecting}
          className="flex items-center gap-2"
        >
          {isPending || isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          {ensName || formatAddress(address || "")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between gap-2 p-2">
          <div>
            <div className="font-medium">{ensName || "Wallet Connected"}</div>
            <div className="text-xs text-muted-foreground font-mono">
              {formatAddress(address || "", 8)}
            </div>
            {ethBalance && (
              <div className="text-xs text-muted-foreground">
                {ethBalance.formatted} ETH
              </div>
            )}
          </div>
        </div>
        <div className="border-t my-1" />
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openInBlockExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on {chain.blockExplorers?.default.name}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
