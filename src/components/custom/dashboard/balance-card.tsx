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
import { DollarSign, TrendingUp } from "lucide-react";
import { ErrorMessage } from "@/components/custom/error-message";
import { formatBalance } from "@/utils/formatting";
import { chain } from "@/config/wagmi";

export const BalanceCard = () => {
  const { isConnected } = useAccount();
  const { data: balance, error, isLoading } = useBalance();

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          USDC Balance
        </CardTitle>
        <CardDescription>Your current USDC token balance</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessage message="Failed to load balance" />}
        {isLoading ? (
          <div className="flex items-center justify-center h-12">
            Loading...
          </div>
        ) : balance ? (
          <div className="space-y-2">
            <div className="text-3xl font-bold">
              {formatBalance(balance.balance)} USDC
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{chain.name}</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
