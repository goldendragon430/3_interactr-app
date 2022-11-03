import React from 'react';
import isEmpty from 'lodash/isEmpty';
//import {PieChart} from "@toast-ui/react-chart";
import map from "lodash/map";

const SurveysPieChart = ({stats}) => {
  if(isEmpty(stats)) return null;

  const d = {
    categories:  map(stats, interaction=>interaction.element.name),
    series: map(stats, interaction=>{
      return {
        name: interaction.element.name,
        data: interaction.clicks
      }
    })
  };

  const options = {
    chart: {
      width: 600,
      height: 350,
      title: 'Breakdown by percentage of responses',
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
  //   <PieChart
  //     data={d}
  //     options={options}
  //   />
  // )
}
export default SurveysPieChart;