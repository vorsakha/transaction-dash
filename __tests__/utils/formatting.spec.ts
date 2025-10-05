import {
  formatAddress,
  formatBalance,
  formatTransactionHash,
  formatDateTime,
  formatGasPrice,
  formatGasUsed,
} from "@/utils/formatting";

describe("Formatting Utilities", () => {
  describe("formatAddress", () => {
    it("should format address with default length", () => {
      const address = "0x1234567890123456789012345678901234567890";
      const result = formatAddress(address);
                          expect(result).toMatch(/^0x[a-fA-F0-9]+\.\.\.[a-fA-F0-9]+$/);
    });

    it("should format address with custom length", () => {
      const address = "0x1234567890123456789012345678901234567890";
      expect(formatAddress(address, 4)).toBe("0x12...7890");
    });

    it("should handle empty address", () => {
      expect(formatAddress("")).toBe("");
    });
  });

  describe("formatBalance", () => {
    it("should format balance with default decimals", () => {
      expect(formatBalance("1000000")).toBe("1.00");
    });

    it("should format balance with custom decimals", () => {
      expect(formatBalance("1000000000000000", 18)).toBe("0.001000");
    });

    it("should handle zero balance", () => {
      expect(formatBalance("0")).toBe("0.00");
    });

    it("should handle empty balance", () => {
      expect(formatBalance("")).toBe("0");
    });
  });

  describe("formatTransactionHash", () => {
    it("should format transaction hash correctly", () => {
      const hash =
        "0x1234567890123456789012345678901234567890123456789012345678901234";
      expect(formatTransactionHash(hash)).toBe("0x12345678...78901234");
    });

    it("should handle empty hash", () => {
      expect(formatTransactionHash("")).toBe("");
    });
  });

  describe("formatDateTime", () => {
    it("should format timestamp as datetime", () => {
      const timestamp = "1609459200"; // January 1, 2021
      expect(formatDateTime(timestamp)).toMatch(/2021|2020/);
    });
  });

  describe("formatGasPrice", () => {
    it("should format gas price in Gwei", () => {
      expect(formatGasPrice("20000000000")).toBe("20.00 Gwei");
    });

    it("should handle small gas prices", () => {
      expect(formatGasPrice("1000000000")).toBe("1.00 Gwei");
    });
  });

  describe("formatGasUsed", () => {
    it("should format gas used from hex", () => {
      expect(formatGasUsed("0x5208")).toBe("21,000");
    });

    it("should handle zero gas", () => {
      expect(formatGasUsed("0x0")).toBe("0");
    });
  });
});
