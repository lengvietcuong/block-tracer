"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface TransactionBarChartProps {
  chartData: {
    received: { count: number; date: string }[];
    sent: { count: number; date: string }[];
  };
  config: ChartConfig;
  className?: string;
}

// Utility function to format large numbers
function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export default function TransactionBarChart({
  chartData,
  config,
  className,
}: TransactionBarChartProps) {
  const sortedData = processChartData(chartData);

  return (
    <ChartContainer config={config} className={className}>
      <BarChart accessibilityLayer data={sortedData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(yearMonth: string) =>
            new Date(yearMonth).toLocaleString("default", {
              month: "short",
            })
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatLargeNumber(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="received" fill="var(--color-received)" radius={4} />
        <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

// Aggregates received or sent transaction counts by month
function processTransactions(
  monthlyData: Record<
    string,
    { month: string; received: number; sent: number }
  >,
  transactions: { count: number; date: string }[],
  isIncoming: boolean,
) {
  transactions.forEach(({ count, date }) => {
    const dateObj = new Date(date);
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Zero-pad month
    const year = dateObj.getUTCFullYear();
    const yearMonth = `${year}-${month}`;
    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { month: yearMonth, received: 0, sent: 0 };
    }
    if (isIncoming) {
      monthlyData[yearMonth].received += count;
    } else {
      monthlyData[yearMonth].sent += count;
    }
  });
}

// Prepares sorted chart data by month, merging received and sent counts
function processChartData(data: TransactionBarChartProps["chartData"]) {
  const monthlyData: Record<
    string,
    { month: string; received: number; sent: number }
  > = {};
  processTransactions(monthlyData, data.received, true);
  processTransactions(monthlyData, data.sent, false);

  return Object.values(monthlyData).sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
  );
}
