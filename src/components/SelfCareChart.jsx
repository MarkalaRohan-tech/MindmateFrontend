// File: components/SelfCareChart.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ThemeContext } from "../Context/ThemeContext";
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

const SelfCareChart = ({ list = [] }) => {
  const { theme } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 640 && window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const weeklyData = useMemo(
    () => ({
      labels: list.map((item) => item.title),
      datasets: [
        {
          label: "Care Score of this week",
          data: list.map((item) => item.weeklyCount || 0),
          backgroundColor: "#fb923c",
          borderRadius: isMobile ? 3 : 4,
          barPercentage: list.length === 1 ? 0.2 : isMobile ? 0.6 : 0.7,
          categoryPercentage: isMobile ? 0.8 : 1.0,
        },
      ],
    }),
    [list, isMobile]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: !isMobile,
          position: "top",
          labels: {
            padding: isMobile ? 6 : isTablet ? 8 : 10,
            font: {
              size: isMobile ? 10 : isTablet ? 11 : 12,
            },
            boxWidth: isMobile ? 12 : 20,
          },
        },
        tooltip: {
          mode: "index",
          intersect: true,
          backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
          titleColor: theme === "dark" ? "#ffffff" : "#111827",
          bodyColor: theme === "dark" ? "#ffffff" : "#111827",
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
          max: 7,
          ticks: {
            stepSize: 1,
            color: "rgb(251, 146, 60)",
            font: {
              size: isMobile ? 9 : isTablet ? 10 : 11,
            },
          },
          grid: {
            color: theme === "dark" ? "#374151" : "rgba(200,200,200,0.2)",
          },
        },
        x: {
          ticks: {
            color: theme === "dark" ? "#d1d5db" : "#4b5563",
            autoSkip: false,
            maxRotation: isMobile ? 60 : isTablet ? 45 : 45,
            minRotation: isMobile ? 45 : isTablet ? 30 : 30,
            font: {
              size: isMobile ? 8 : isTablet ? 9 : 10,
            },
          },
          grid: { display: false },
        },
      },
    }),
    [theme, isMobile, isTablet]
  );

  const containerClasses = `w-full rounded-xl shadow-md p-3 sm:p-4 md:p-5 ${
    theme === "dark"
      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-[#f3f4f6] to-white text-black"
  }`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold">
            Self-Care Consistency
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-300 mt-0.5 sm:mt-1">
            Visualize your discipline journey.
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div
          className={`w-full rounded-xl shadow-md p-4 sm:p-5 text-center ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300"
              : "bg-gradient-to-br from-[#f3f4f6] to-white text-gray-500"
          }`}
        >
          <p className="text-sm sm:text-base">
            No self-care activities recorded yet.
          </p>
        </div>
      ) : (
        <div
          role="img"
          aria-label="Bar chart showing weekly self-care scores"
          className="chart-container w-full"
          style={{
            height: isMobile ? "200px" : isTablet ? "250px" : "300px",
          }}
        >
          <Bar
            data={weeklyData}
            options={options}
            key={`${isMobile}-${isTablet}`}
          />
        </div>
      )}

      <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>Care scores range from 1 (Lazy) to 7 (Super Discipline).</p>
      </div>
    </div>
  );
};

export default SelfCareChart;
