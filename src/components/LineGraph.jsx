import {Line } from "react-chartjs-2";
import { LineData } from "../Data";
import { useContext } from "react";
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

const LineGraph = () => {
  const { theme } = useContext(ThemeContext);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }, 
    },
    scales: {
      y: {
        min: 1,
        max: 5,
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
    <div
      className={`${
        theme === "dark" ? "text-white" : "text-black"
      } flex mt-3 mb-3 w-[100%] h-[50%] justify-center`}
    >
      <Line
        data={LineData}
        options={options}
      />
    </div>
  );
};

export default LineGraph;

