"use client";

import { BalanceCard } from "@/components/custom/dashboard/balance-card";
import { TransactionTable } from "@/components/custom/dashboard/transaction-table";
import { VolumeChart } from "@/components/custom/charts/volume-chart";
import { TransferForm } from "@/components/custom/dashboard/transfer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Send, BarChart3 } from "lucide-react";
import { useTransactionStats } from "@/hooks/use-transaction-stats";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { ErrorMessage } from "@/components/custom/error-message";

export const DashboardContent = () => {
  const { totalTransactions, totalSent, totalReceived, isLoading, error } =
    useTransactionStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BalanceCard />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : error ? (
                <ErrorMessage message="Failed to load" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {totalTransactions.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : error ? (
                <ErrorMessage message="Failed to load" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalSent)}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Received
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : error ? (
                <ErrorMessage message="Failed to load" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalReceived)}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VolumeChart />

          <TransferForm />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <p className="text-muted-foreground">
                View and search your transaction history
              </p>
            </div>
          </div>
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};
