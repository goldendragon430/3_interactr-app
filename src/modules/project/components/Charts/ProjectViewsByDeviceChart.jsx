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

        const mobile = analytics.getSeriesFromQuery(data.mobile);
        const desktop = analytics.getSeriesFromQuery(data.desktop);

        var d = {
            labels: analytics.getCategoriesFromQuery(data.mobile, this.state.groupBy),
            datasets:[
                {
                    type: 'bar',
                    label: 'Desktop',
                    data: desktop,
                    backgroundColor: 'rgb(53, 162, 235)',
                },
                {
                    type: 'bar',
                    label: 'Mobile',
                    backgroundColor: 'rgb(75, 192, 192)',
                    data: mobile,
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
                  text: 'By Device',
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