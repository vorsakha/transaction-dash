"use client";

import { Wallet } from "lucide-react";
import { WalletConnector } from "@/components/custom/wallet/connector";

export const LandingContent = () => {
  return (
    <div className="container bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center mx-auto my-auto">
      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground">
              <Wallet className="h-10 w-10" />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Your USDC Dashboard
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Track, analyze, and manage your USDC transactions with a beautiful,
            intuitive dashboard. Connect your wallet to get started with
            comprehensive transaction analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WalletConnector />
          </div>
        </div>
      </section>
    </div>
  );
};
