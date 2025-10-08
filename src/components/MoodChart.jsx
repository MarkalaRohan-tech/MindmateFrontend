import React, { useContext, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { ThemeContext } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import api from "../Utils/axiosInstance";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

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

  // Handle window resize for responsive chart options
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch weekly & monthly trends
  const fetchTrends = async () => {
    if (!user?._id) return;
    try {
      const res = await api.get("/api/mood/trends", {
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
    plugins: {
      legend: {
        display: true,
        position: isMobile ? 'bottom' : 'top',
        labels: {
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 10 : 12,
          },
          boxWidth: isMobile ? 12 : 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        titleFont: {
          size: isMobile ? 11 : 13,
        },
        bodyFont: {
          size: isMobile ? 10 : 12,
        },
        padding: isMobile ? 6 : 10,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 9 : 11,
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className={`w-full rounded-xl shadow-md p-3 sm:p-5 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-[#f3f4f6] to-white text-black"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
        <h2 className="text-lg sm:text-xl font-bold">
          {title || "Mood Trends Over Time"}
        </h2>
        <div className="flex gap-2 text-xs sm:text-sm">
          <button
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 ${
              view === "weekly"
                ? "bg-orange-400 text-white shadow-md"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 ${
              view === "monthly"
                ? "bg-orange-400 text-white shadow-md"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
        <Line
          data={
            view === "weekly"
              ? weeklyData || emptyData
              : monthlyData || emptyData
          }
          options={options}
          key={`${view}-${isMobile}`} // Ensure re-render on view or screen size change
        />
      </div>

      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
        <p>Mood scores range from 1 (Challenging) to 5 (Excellent).</p>
      </div>
    </div>
  );
};

export default MoodTrendChart;