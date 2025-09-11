import React from 'react'
import { Line } from "react-chartjs-2";
import { useContext, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const weeklyData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Average Mood",
      data: [5, 2, 4, 5, 4, 1, 3],
      fill: false,
      borderColor: "rgb(251, 146, 60)",
      backgroundColor: "#3B82F6",
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ],
};

export const monthlyData = {
  labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
  datasets: [
    {
      label: "Average Mood",
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5)+1), 
      fill: false,
      borderColor: "rgb(251, 146, 60)",
      backgroundColor: "#3B82F6",
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 4,
    },
  ],
};


const MoodChart = () => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState("weekly");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
        titleColor: theme === "dark" ? "#ffffff" : "#111827",
        bodyColor: theme === "dark" ? "#ffffff" : "#111827",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 2,
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
          <h2 className="text-xl font-bold">Mood Trends Over Time</h2>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Visualize your emotional journey.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            className={`btn btn-sm ${
              view === "weekly" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
          <button
            className={`btn btn-sm ${
              view === "monthly" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[150px] md:h-[300px]">
        <Line
          data={view === "weekly" ? weeklyData : monthlyData}
          options={options}
        />
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <p>Mood scores range from 1 (Challenging) to 5 (Excellent).</p>
      </div>
    </div>
  );
};

const SelfCareChart = () => {
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState("weekly");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
        titleColor: theme === "dark" ? "#ffffff" : "#111827",
        bodyColor: theme === "dark" ? "#ffffff" : "#111827",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 2,
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
          <h2 className="text-xl font-bold">Mood Trends Over Time</h2>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Visualize your emotional journey.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            className={`btn btn-sm ${
              view === "weekly" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
          <button
            className={`btn btn-sm ${
              view === "monthly" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[150px] md:h-[300px]">
        <Line
          data={view === "weekly" ? weeklyData : monthlyData}
          options={options}
        />
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <p>Mood scores range from 1 (Challenging) to 5 (Excellent).</p>
      </div>
    </div>
  );
};


export default MoodChart

