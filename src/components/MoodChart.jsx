import React, { useContext, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ThemeContext } from "../Context/ThemeContext";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const MoodChart = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [view, setView] = useState("weekly");
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get("/api/mood/trends", {
          params: { userId: user._id },
        });

        // inject tension into datasets
        const weekly = {
          ...res.data.weeklyData,
          datasets: res.data.weeklyData.datasets.map((ds) => ({
            ...ds,
            tension: 0.4, // smooth curve
          })),
        };

        const monthly = {
          ...res.data.monthlyData,
          datasets: res.data.monthlyData.datasets.map((ds) => ({
            ...ds,
            tension: 0.4, // smooth curve
          })),
        };

        setWeeklyData(weekly);
        setMonthlyData(monthly);
      } catch (err) {
        console.error("Failed to fetch mood trends:", err);
      }
    };
    if (user._id) fetchTrends();
  }, [user._id]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
      y: { min: 0, max: 6, ticks: { stepSize: 1 } },
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
        <h2 className="text-xl font-bold">Mood Trends Over Time</h2>
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
        {view === "weekly" && weeklyData && (
          <Line data={weeklyData} options={options} />
        )}
        {view === "monthly" && monthlyData && (
          <Line data={monthlyData} options={options} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Mood scores range from 1 (Challenging) to 5 (Excellent).</p>
      </div>
    </div>
  );
};

export default MoodChart;
