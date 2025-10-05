"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/custom/error-message";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAccount } from "wagmi";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { USDC_CONTRACT_ADDRESS } from "@/utils/constants";
import { useEffect } from "react";
import { Send, Copy, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { formatAddress, formatBalance } from "@/utils/formatting";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransferFormData, transferFormSchema } from "@/utils/validations";

const USDC_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const TransferForm = () => {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const { data: balance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: isConnected && !!address },
  });

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      recipient: "",
      amount: "",
    },
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentAmount = form.watch("amount");
  const amountInSmallestUnits = currentAmount
    ? BigInt(Math.floor(parseFloat(currentAmount) * Math.pow(10, 6)))
    : BigInt(0);

  const {
    writeContract,
    isPending: isWritePending,
    data: txHash,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  useEffect(() => {
    if (isConfirmed && address) {
      setIsRefreshing(true);

      const invalidateQueries = async () => {
        try {
          await queryClient.invalidateQueries({
            queryKey: [
              "readContract",
              address,
              USDC_CONTRACT_ADDRESS,
              "balanceOf",
            ],
          });

          await queryClient.invalidateQueries({
            queryKey: ["usdc-events"],
          });

          await queryClient.invalidateQueries({
            queryKey: ["transactions", "etherscan"],
          });

          await queryClient.invalidateQueries({
            queryKey: ["transaction-details"],
          });

          setTimeout(() => setIsRefreshing(false), 1500);
        } catch (error) {
          console.error("Error invalidating queries:", error);
          setIsRefreshing(false);
        }
      };

      invalidateQueries();
    }
  }, [isConfirmed, address, queryClient]);

  const handleSubmit = async () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmTransfer = async () => {
    const { recipient } = form.getValues();
    writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [recipient as `0x${string}`, amountInSmallestUnits],
    });
    form.reset();
    setShowConfirmDialog(false);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maxAmount = balance ? Number(balance) / Math.pow(10, 6) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send USDC
        </CardTitle>
        <CardDescription>
          Transfer USDC to another wallet address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="0x..."
                        {...field}
                        disabled={isWritePending || isConfirming}
                      />
                      {field.value && (
                        <div className="text-xs text-muted-foreground">
                          {formatAddress(field.value, 10)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2"
                            onClick={() => copyToClipboard(field.value)}
                          >
                            {copied ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Amount</FormLabel>
                    {balance && (
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() =>
                          form.setValue("amount", maxAmount.toString())
                        }
                      >
                        Max: {formatBalance(balance.toString())}
                      </button>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        disabled={isWritePending || isConfirming}
                        step="0.000001"
                        min="0"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        USDC
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {writeError && <ErrorMessage message={writeError.message} />}

            {txHash && (
              <div
                className={`p-3 rounded-md border ${
                  isConfirmed
                    ? "bg-green-50 border-green-200"
                    : isConfirming
                    ? "bg-blue-50 border-blue-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : isConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {isRefreshing && (
                        <RefreshCw className="h-3 w-3 animate-spin text-green-600" />
                      )}
                    </>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-yellow-500" />
                  )}
                  <span
                    className={`font-medium ${
                      isConfirmed
                        ? "text-green-800"
                        : isConfirming
                        ? "text-blue-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {isConfirmed
                      ? isRefreshing
                        ? "Transfer Confirmed! Refreshing data..."
                        : "Transfer Confirmed!"
                      : isConfirming
                      ? "Confirming Transfer..."
                      : "Transfer Sent"}
                  </span>
                </div>
                {isConfirmed && (
                  <div className="text-xs text-green-600 mt-1 font-mono">
                    Transaction: {txHash}
                  </div>
                )}
              </div>
            )}

            <Dialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isWritePending || isConfirming || !form.formState.isValid
                  }
                >
                  {isWritePending || isConfirming ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isConfirming ? "Confirming..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send USDC
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Transfer</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to send {form.watch("amount")} USDC to{" "}
                    {formatAddress(form.watch("recipient"))}?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmTransfer}
                    disabled={isWritePending}
                  >
                    {isWritePending ? "Sending..." : "Confirm"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
