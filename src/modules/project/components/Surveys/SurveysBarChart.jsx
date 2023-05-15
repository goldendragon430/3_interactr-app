import React from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import map from "lodash/map";
import analytics from 'utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SurveysBarChart = ({stats}) => {
  if(isEmpty(stats)) return null;

  // const d = {
  //   categories: map(stats, interaction=>interaction.element.name),
  //   series: [
  //     {
  //       name: 'Responses',
  //       data: map(stats, interaction=>interaction.clicks)
  //     }
  //   ]
  // };

  // const options = {
  //   chart: {
  //     width: 600,
  //     height: 350,
  //     title: 'Breakdown by total responses',
  //   },
  //   series: {
  //     stackType: 'normal'
  //   },
  //   legend: {
  //     visible: false
  //   }
  //   //theme: 'myTheme'
  // };
  // TODO
  // return(
  //   <BarChart
  //     data={d}
  //     options={options}
  //   />
  // )

  const labels = map(stats, interaction=>interaction.element.name);
  const colors = analytics.getBorderColors();
  
  const data = {
    labels,
    datasets: [
      {        
        data: map(stats, interaction=>interaction.clicks),
        backgroundColor: map(labels, (_, index) => colors[index]),
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Breakdown by total responses',
      },
    },
  };

  return <Bar options={options} data={data} />;
}
export default SurveysBarChart;