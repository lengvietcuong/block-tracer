"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  ChartOptions,
} from "chart.js";

// Data from the chart in the FBI report (Measured in billions of USD)
// Data points are only approximate because exact amounts are not provided in the report
// https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3CryptocurrencyReport.pdf
const data = [
  { year: 2017, losses: 0.06 },
  { year: 2018, losses: 0.16 },
  { year: 2019, losses: 0.14 },
  { year: 2020, losses: 0.23 },
  { year: 2021, losses: 1.5 },
  { year: 2022, losses: 3.85 },
  { year: 2023, losses: 5.6 },
];

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

const RED = "rgb(224,59,59)";
const FADED_RED = "rgba(224,59,59,0.2)";
const GRAY = "rgb(161,161,170)";

export default function CrimeDataChart() {
  const chartData = {
    labels: data.map((d) => d.year),
    datasets: [
      {
        data: data.map((d) => d.losses),
        backgroundColor: FADED_RED,
        borderColor: RED,
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: GRAY,
        },
        border: {
          color: GRAY,
        },
      },
      y: {
        beginAtZero: true,
        position: "right",
        ticks: {
          callback: (value) => `$${value}B`,
          color: GRAY,
        },
        max: 6, // Define the range of the y-axis from 0 to 6 billion
        border: {
          color: GRAY,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={chartData} options={options} height={200}/>;
}