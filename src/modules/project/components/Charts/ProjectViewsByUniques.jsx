import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import analytics from 'utils/analytics';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

export default class ProjectViewsByDeviceChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupBy:'day'
        }
    }

    render(){
        const {data} = this.props;

        const plays_unique = analytics.getSeriesFromQuery(data.plays_unique);
        const plays = analytics.getSeriesFromQuery(data.plays);

        var d = {
            labels: analytics.getCategoriesFromQuery(data.plays, this.state.groupBy),
            datasets: [
                {
                    type: 'line',
                    fill: true,
                    label: 'All Views',
                    data: plays,
                    backgroundColor: 'rgb(53, 162, 235, 0.5)',
                    borderColor: 'rgb(53, 162, 235)',
                    borderWidth: 2,
                },
                {
                    type: 'line',
                    label: 'Unique Views',
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgb(75, 192, 192)',
                    data: plays_unique,
                }
            ]
        };
      
        const options = {
            responsive: true,
            plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Project Views',
                  font: {
                      size: 18,
                  }
                },
            },
            scales: {
                y: {
                    min: 0,
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks:{
                        stepSize: 1,
                        callback: (value) => {
                            return `${value} views`
                        }
                    }
                },
            },
        };
        return(
            <Chart
                data={d}
                options={options}
                height={120}
            />
        );
    }
}