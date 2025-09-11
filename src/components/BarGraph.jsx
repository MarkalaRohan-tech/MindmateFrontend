import { Bar } from "react-chartjs-2";
import { BarData } from "../Data";
import { useContext } from "react";
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

const BarGraph = () => {
  const { theme } = useContext(ThemeContext);
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 9, 
          },
        },
      },
      y: {
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
  };

  return (
    <div className="flex mt-3 mb-3 w-[100%] h-[50%] justify-center">
      <Bar data={BarData} options={options} />
    </div>
  );
};

export default BarGraph;

