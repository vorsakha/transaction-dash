import { USDC_DECIMALS } from "./constants";
import { z } from "zod";

export const transferFormSchema = z.object({
  recipient: z
    .string()
    .min(1, "Recipient address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid recipient address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((amount) => {
      if (!amount || amount.trim() === "") return false;
      const amountNum = parseFloat(amount);
      if (
        isNaN(amountNum) ||
        amountNum <= 0 ||
        amountNum > Math.pow(10, USDC_DECIMALS)
      ) {
        return false;
      }
      const decimalPlaces = amount.split(".")[1]?.length || 0;
      return decimalPlaces <= USDC_DECIMALS;
    }, "Invalid amount. Must be greater than 0 and have at most 6 decimal places"),
});

export type TransferFormData = z.infer<typeof transferFormSchema>;
