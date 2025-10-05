"use client";

import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/hooks/use-transactions";
import { useAccount } from "wagmi";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { ErrorMessage } from "@/components/custom/error-message";
import { formatBalance } from "@/utils/formatting";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types";
import { BarChart3, TrendingUp } from "lucide-react";

const chartConfig = {
  sent: {
    label: "Sent",
    color: "var(--chart-1)",
  },
  received: {
    label: "Received",
    color: "var(--chart-2)",
  },
} as const;

export const VolumeChart = () => {
  const { isConnected } = useAccount();
  const {
    data: transactions,
    error,
    isLoading,
  } = useTransactions({
    sort: "desc",
    page: 1,
    offset: 100,
  });
  const [chartType, setChartType] = useState<"bar" | "area">("bar");

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction Volume
          </CardTitle>
          <CardDescription>
            Connect your wallet to view transaction volume charts
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage
            message={`Failed to load chart data: ${
              error instanceof Error ? error.message : "Unknown error"
            }`}
          />
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction Volume
          </CardTitle>
          <CardDescription>
            No transactions found to display in chart
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transactionsByDate = (transactions as Transaction[]).reduce(
    (acc, tx) => {
      const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          sent: 0,
          received: 0,
          count: 0,
        };
      }

      const amount = parseFloat(formatBalance(tx.value));
      if (
        tx.from.toLowerCase() ===
        (transactions as Transaction[])[0].from.toLowerCase()
      ) {
        acc[date].sent += amount;
      } else {
        acc[date].received += amount;
      }
      acc[date].count += 1;

      return acc;
    },
    {} as Record<string, { sent: number; received: number; count: number }>,
  );

  const sortedDates = Object.keys(transactionsByDate)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-7);

  const chartData = [...sortedDates, ...sortedDates].map((date) => ({
    date,
    sent: transactionsByDate[date].sent,
    received: transactionsByDate[date].received,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction Volume
          </CardTitle>
          <CardDescription>
            Daily USDC transaction volume (last 7 days)
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "area" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("area")}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value} USDC`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value as string).toLocaleDateString()
                    }
                    formatter={(value) => [
                      `${
                        typeof value === "number" ? value.toFixed(2) : value
                      } USDC`,
                      "",
                    ]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
              <Bar dataKey="received" fill="var(--color-received)" radius={4} />
            </BarChart>
          ) : (
            <AreaChart data={chartData}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value} USDC`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value as string).toLocaleDateString()
                    }
                    formatter={(value, name) => [
                      `${
                        typeof value === "number" ? value.toFixed(2) : value
                      } USDC`,
                      name === "sent" ? "Sent" : "Received",
                    ]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="sent"
                stackId="1"
                stroke={chartConfig.sent.color}
                fill={chartConfig.sent.color}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="received"
                stackId="1"
                stroke={chartConfig.received.color}
                fill={chartConfig.received.color}
                fillOpacity={0.6}
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
