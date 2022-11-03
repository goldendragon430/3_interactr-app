import React from 'react';
import isEmpty from 'lodash/isEmpty';
//import {BarChart} from "@toast-ui/react-chart";
import map from "lodash/map";


const SurveysBarChart = ({stats}) => {
  if(isEmpty(stats)) return null;

  const d = {
    categories: map(stats, interaction=>interaction.element.name),
    series: [
      {
        name: 'Responses',
        data: map(stats, interaction=>interaction.clicks)
      }
    ]
  };

  const options = {
    chart: {
      width: 600,
      height: 350,
      title: 'Breakdown by total responses',
    },
    series: {
      stackType: 'normal'
    },
    legend: {
      visible: false
    }
    //theme: 'myTheme'
  };
  // TODO
return null;
  // return(
  //   <BarChart
  //     data={d}
  //     options={options}
  //   />
  // )
}
export default SurveysBarChart;