"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransactionDetails } from "@/hooks/use-transactions";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { ErrorMessage } from "@/components/custom/error-message";
import { chain } from "@/config/wagmi";
import {
  formatBalance,
  formatDateTime,
  formatTransactionHash,
  formatGasPrice,
  formatGasUsed,
} from "@/utils/formatting";
import {
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  DollarSign,
  Cpu,
} from "lucide-react";
import { useState, memo } from "react";

interface TransactionDetailModalProps {
  txHash: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailModal = memo(
  ({ txHash, open, onOpenChange }: TransactionDetailModalProps) => {
    const {
      data: transaction,
      error,
      isLoading,
    } = useTransactionDetails(txHash);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, field: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    };

    const getStatusIcon = () => {
      if (!transaction) return null;

      if (transaction.blockNumber && transaction.blockNumber > 0) {
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      }

      return <Clock className="h-5 w-5 text-yellow-600" />;
    };

    const getStatusText = () => {
      if (!transaction) return "Unknown";

      if (transaction.blockNumber && transaction.blockNumber > 0) {
        return "Success";
      }

      return "Pending";
    };

    const getStatusColor = () => {
      if (!transaction) return "text-gray-600";

      if (transaction.blockNumber && transaction.blockNumber > 0) {
        return "text-green-600";
      }

      return "text-yellow-600";
    };

    if (!txHash) return null;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about transaction{" "}
              {formatTransactionHash(txHash)}
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <LoadingSpinner />
              <p className="text-sm text-gray-600">
                Loading transaction details...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <ErrorMessage message="Failed to load transaction details" />
          )}

          {!isLoading && !error && transaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 font-medium ${getStatusColor()}`}
                  >
                    {getStatusIcon()}
                    {getStatusText()}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-mono text-sm">
                    {formatDateTime(transaction.timeStamp)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Transaction Overview</h3>

                <div className="grid grid-cols-1 gap-3">
                  <DetailRow
                    label="Transaction Hash"
                    value={transaction.hash}
                    icon={<Hash className="h-4 w-4" />}
                    monospace
                    copyField="hash"
                    copiedField={copiedField}
                    onCopy={copyToClipboard}
                  />

                  <DetailRow
                    label="Block Number"
                    value={transaction.blockNumber.toString()}
                    icon={<Cpu className="h-4 w-4" />}
                  />

                  <DetailRow
                    label="Confirmations"
                    value={transaction.confirmations}
                    icon={<CheckCircle className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Transfer Information</h3>

                <div className="grid grid-cols-1 gap-3">
                  <DetailRow
                    label="From"
                    value={transaction.from}
                    icon={<ArrowUpRight className="h-4 w-4" />}
                    monospace
                    copyField="from"
                    copiedField={copiedField}
                    onCopy={copyToClipboard}
                  />

                  <DetailRow
                    label="To"
                    value={transaction.to}
                    icon={<ArrowDownRight className="h-4 w-4" />}
                    monospace
                    copyField="to"
                    copiedField={copiedField}
                    onCopy={copyToClipboard}
                  />

                  <DetailRow
                    label="Amount"
                    value={`${formatBalance(transaction.value)} USDC`}
                    icon={<DollarSign className="h-4 w-4" />}
                  />

                  <DetailRow
                    label="Contract Address"
                    value={transaction.contractAddress}
                    icon={<Hash className="h-4 w-4" />}
                    monospace
                    copyField="contract"
                    copiedField={copiedField}
                    onCopy={copyToClipboard}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gas Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DetailRow
                    label="Gas Price"
                    value={formatGasPrice(transaction.gasPrice)}
                    icon={<Fuel className="h-4 w-4" />}
                  />

                  <DetailRow
                    label="Gas Limit"
                    value={formatGasUsed(transaction.gas)}
                    icon={<Fuel className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Technical Details</h3>

                <div className="grid grid-cols-1 gap-3">
                  <DetailRow
                    label="Transaction Index"
                    value={transaction.transactionIndex.toString()}
                    icon={<Hash className="h-4 w-4" />}
                  />

                  <DetailRow
                    label="Input Data"
                    value={transaction.input}
                    icon={<Hash className="h-4 w-4" />}
                    monospace
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `${chain.blockExplorers?.default.url}/tx/${txHash}`,
                      "_blank",
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on {chain.blockExplorers?.default.name}
                </Button>

                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);

interface DetailRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  monospace?: boolean;
  copyField?: string;
  copiedField?: string | null;
  onCopy?: (text: string, field: string) => void;
}

const DetailRow = memo(
  ({
    label,
    value,
    icon,
    monospace = false,
    copyField,
    copiedField,
    onCopy,
  }: DetailRowProps) => {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              monospace ? "font-mono" : ""
            } break-all max-w-[200px]`}
          >
            {value}
          </span>
          {copyField && onCopy && (
            <button
              onClick={() => onCopy(value, copyField)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {copiedField === copyField ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  },
);

DetailRow.displayName = "DetailRow";

TransactionDetailModal.displayName = "TransactionDetailModal";
