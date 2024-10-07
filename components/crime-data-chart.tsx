"use client";

import {
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

// Data from the chart in the FBI report (Measured in billions of USD)
// Data points are only approximate because exact amounts are not provided in the report
// https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3CryptocurrencyReport.pdf
const data = [
  { year: 2017, complaints: 4000, losses: 0.06 },
  { year: 2018, complaints: 36000, losses: 0.16 },
  { year: 2019, complaints: 29000, losses: 0.14 },
  { year: 2020, complaints: 35000, losses: 0.23 },
  { year: 2021, complaints: 34000, losses: 1.5 },
  { year: 2022, complaints: 52000, losses: 3.85 },
  { year: 2023, complaints: 69000, losses: 5.6 },
];

export default function CrimeDataChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <Bar
          yAxisId="right"
          dataKey="losses"
          stroke="hsl(var(--destructive))"
          strokeWidth={2}
          fill="hsl(var(--destructive))"
          fillOpacity={0.2}
          name="$ Losses"
        />
        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" className="text-xs md:text-base"/>
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(value: number) => `$${value}B`}
          domain={[0, 6]} // Define the range of the y-axis
          ticks={[0, 1, 2, 3, 4, 5, 6]} // Define the indicators on the y-axis
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}