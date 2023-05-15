import React from 'react';
import isEmpty from 'lodash/isEmpty';
//import {PieChart} from "@toast-ui/react-chart";
import map from "lodash/map";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import analytics from 'utils/analytics';

ChartJS.register(ArcElement, Tooltip, Legend);

const SurveysPieChart = ({stats}) => {
  if(isEmpty(stats)) return null;

  // const d = {
  //   categories:  map(stats, interaction=>interaction.element.name),
  //   series: map(stats, interaction=>{
  //     return {
  //       name: interaction.element.name,
  //       data: interaction.clicks
  //     }
  //   })
  // };

  // const options = {
  //   chart: {
  //     width: 600,
  //     height: 350,
  //     title: 'Breakdown by percentage of responses',
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
  //   <PieChart
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
        label: 'Responses',
        data: map(stats, interaction=>interaction.clicks),
        backgroundColor: map(labels, (_, index) => colors[index]),
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Breakdown by percentage of responses',
      },
    },
  };

  return <Pie data={data} options={options}/>;
}
export default SurveysPieChart;