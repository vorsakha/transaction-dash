"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmi";
import { useState } from "react";

export default function WagmiProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 15,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (failureCount, error: unknown) => {
              if (error && typeof error === "object") {
                if (
                  "status" in error &&
                  (error as { status: number }).status === 429
                )
                  return false;
                if (
                  "message" in error &&
                  typeof (error as { message: string }).message === "string" &&
                  ((error as { message: string }).message.includes(
                    "rate limit",
                  ) ||
                    (error as { message: string }).message.includes("network"))
                )
                  return false;
              }
              return failureCount < 1;
            },
          },
        },
      }),
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
