import  { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const ChartComponent = ({ results, columns, validColumnPairs }) => {
  const [chartType, setChartType] = useState("Bar");

  // Assuming you want to use the first valid column pair for the chart
  const xField = validColumnPairs[0].x;
  const yField = validColumnPairs[0].y;

  const chartData = {
    labels: results.map((item) => item[xField]),
    datasets: [
      {
        label: yField,
        data: results.map((item) => item[yField]),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${xField} vs ${yField}`,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return <Bar data={chartData} options={options} />;
      case "Line":
        return <Line data={chartData} options={options} />;
      case "Pie":
        return <Pie data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div>
      <div className="mx-2">
        <select
          className="w-[100px] py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-[1px] focus:ring-slate-300 focus:border-slate-300"
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="Bar">Bar</option>
          <option value="Line">Line</option>
          <option value="Pie">Pie</option>
        </select>
      </div>
      <div className="flex justify-center w-full">
        <div className={`${chartType === "Pie" ? "w-[50%]" : "w-[80%]"}`}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
