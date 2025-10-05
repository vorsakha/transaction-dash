"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBalance } from "@/hooks/use-balance";
import { useAccount } from "wagmi";
import { DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { ErrorMessage } from "@/components/custom/error-message";
import { formatBalance } from "@/utils/formatting";

export const BalanceCard = () => {
  const { isConnected } = useAccount();
  const { data: balance, error, isLoading, refetch } = useBalance();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            USDC Balance
          </CardTitle>
          <CardDescription>
            Connect your wallet to view your USDC balance
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            USDC Balance
          </CardTitle>
          <CardDescription>Your current USDC token balance</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
          aria-label="Refresh balance"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessage message="Failed to load balance" />}
        {isLoading ? (
          <div className="flex items-center justify-center h-12">
            <LoadingSpinner data-testid="loading-spinner" />
          </div>
        ) : balance ? (
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {formatBalance(balance.balance)} USDC
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Sepolia Testnet</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
