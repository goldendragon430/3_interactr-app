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

export default class DropOffChartProject extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {data} = this.props;

        if(! data) return null;

        var d = {
            labels: data.project.map(d=>d.timestamp),
            datasets: [
                {
                    type: 'line',
                    label: this.props.project.title,
                    backgroundColor: 'rgb(53, 162, 235)',
                    borderColor: 'rgb(53, 162, 235)',
                    data: data.project.map(d=> parseInt(d.count))
                },
            ]
        };
        d.labels.unshift('00:00');
        d.datasets[0].data.unshift( parseInt(data.plays) );
        
        const options = {
            responsive: true,
            plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Project Drop Off',
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
                            return `${value} viewers`
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