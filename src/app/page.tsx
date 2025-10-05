"use client";

import { AppLayout } from "@/components/custom/layout/app-layout";
import { LandingContent } from "@/components/custom/landing-content";
import { DashboardContent } from "@/components/custom/dashboard/dashboard-content";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <AppLayout>
      {isConnected ? <DashboardContent /> : <LandingContent />}
    </AppLayout>
  );
}
