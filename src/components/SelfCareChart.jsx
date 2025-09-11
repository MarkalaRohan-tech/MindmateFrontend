import React, { useContext, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ThemeContext } from "../ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SelfCareChart = ({ list }) => {
  const { theme } = useContext(ThemeContext);

    const weeklyData = {
      labels: list?.map((item) => item.title),
      datasets: [
        {
          label: "Care Score of this week",
          data: [7, 7, 4, 5, 4, 1, 6],
          backgroundColor: "#fb923c",
          borderRadius: 4,
          barPercentage: list.length === 1 ? 0.2 : 0.1,
          categoryPercentage: 1.0,
        },
      ],
    };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: true,
        backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
        titleColor: theme === "dark" ? "#ffffff" : "#111827",
        bodyColor: theme === "dark" ? "#ffffff" : "#111827",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 7,
        ticks: {
          stepSize: 1,
          color: "rgb(251, 146, 60)",
          callback: (value) => value,
        },
        grid: {
          color: theme === "dark" ? "#374151" : "rgba(200,200,200,0.2)",
        },
      },
      x: {
        ticks: {
          color: theme === "dark" ? "#d1d5db" : "#4b5563",
          autoSkip: false,
          maxRotation: 60,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className={`w-full rounded-xl shadow-md p-5 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-[#f3f4f6] to-white text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Self-Care Consistency</h2>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Visualize your discipline journey.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[150px] md:h-[300px]">
        <Bar
          data={weeklyData}
          options={options}
        />
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <p>Care scores range from 1 (Lazy) to 7 (Super Discipline).</p>
      </div>
    </div>
  );
};

export default SelfCareChart;
