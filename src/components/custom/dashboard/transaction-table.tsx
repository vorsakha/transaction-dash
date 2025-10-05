"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/use-transactions";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { ErrorMessage } from "@/components/custom/error-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatAddress,
  formatBalance,
  formatDateTime,
  formatTransactionHash,
} from "@/utils/formatting";
import { ArrowUpDown, Search, ExternalLink, Eye } from "lucide-react";
import { TransactionDetailModal } from "@/components/custom/dashboard/transaction-detail-modal";
import type { TransactionFilters } from "@/types";
import { chain } from "@/config/wagmi";

export const TransactionTable = () => {
  const { isConnected } = useAccount();
  const [filters, setFilters] = useState<TransactionFilters>({
    sort: "desc",
    page: 1,
    offset: 50,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null,
  );

  const {
    data: transactions,
    error,
    isLoading,
    refetch,
  } = useTransactions(filters);

  const filteredTransactions =
    transactions?.filter(
      (tx) =>
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleSortChange = (sort: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const openInBlockExplorer = (txHash: string) => {
    window.open(`${chain.blockExplorers?.default.url}/tx/${txHash}`, "_blank");
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Connect your wallet to view transaction history
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[300px]"
            />
          </div>
          <Select value={filters.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && <ErrorMessage message="Failed to load transactions" />}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm
                      ? "No transactions found matching your search"
                      : "No transactions found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.hash}>
                    <TableCell className="font-mono text-sm">
                      {formatTransactionHash(transaction.hash)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatAddress(transaction.from)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatAddress(transaction.to)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatBalance(transaction.value)} USDC
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(transaction.timeStamp)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedTransaction(transaction.hash)
                          }
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInBlockExplorer(transaction.hash)}
                          title={`View on ${chain.blockExplorers?.default.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <TransactionDetailModal
        txHash={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      />
    </div>
  );
};
