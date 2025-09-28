// src/Components/MoodTrendChart.jsx
import React, { useContext, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodTrendChart = ({ title = "", refreshKey }) => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState("weekly");
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  // Fallback empty dataset
  const emptyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Mood",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        tension: 0.4,
      },
    ],
  };

  // Fetch weekly & monthly trends
  const fetchTrends = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get("/api/mood/trends", {
        params: { userId: user._id },
      });
      if (!res.data) return;

      const weekly = {
        ...res.data.weeklyData,
        datasets: res.data.weeklyData.datasets.map((ds) => ({
          ...ds,
          tension: 0.4,
        })),
      };
      const monthly = {
        ...res.data.monthlyData,
        datasets: res.data.monthlyData.datasets.map((ds) => ({
          ...ds,
          tension: 0.4,
        })),
      };

      setWeeklyData(weekly);
      setMonthlyData(monthly);
    } catch (err) {
      console.error("Failed to fetch mood trends:", err);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [user?._id, refreshKey]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: { y: { min: 0, max: 6, ticks: { stepSize: 1 } } },
  };

  return (
    <div
      className={`w-full rounded-xl shadow-md p-5 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-[#f3f4f6] to-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {title || "Mood Trends Over Time"}
        </h2>
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

      <div className="h-[150px] md:h-[300px]">
        <Line
          data={
            view === "weekly"
              ? weeklyData || emptyData
              : monthlyData || emptyData
          }
          options={options}
          key={view} // ensure new instance when view changes
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Mood scores range from 1 (Challenging) to 5 (Excellent).</p>
      </div>
    </div>
  );
};

export default MoodTrendChart;
