"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { WalletConnector } from "@/components/custom/wallet/connector";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">USDC Dashboard</h1>
            </div>
          </div>
          <WalletConnector />
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground">
              USDC Transaction Dashboard - Built with Next.js, viem, and wagmi
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm">
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
