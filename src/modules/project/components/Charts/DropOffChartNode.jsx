import React from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
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

export default class DropOffChartNode extends React.Component {
    constructor(props) {
        super(props);
    }

    getNodeName(nodeId){
        const node = find(this.props.nodes, {id: parseInt(nodeId)});
         
        return (node) ? node.name : nodeId;
    }

    getViewCountAsPercentage(node){
        const res = node.map(n => {
            return 10;
        })

        // Make sure it starts at 100%;
        return [100].concat(res);
    }

    render(){
        const {data} = this.props;

        if(! data) return null;

        const colors = analytics.getBorderColors();
        let key = 0;
        var d = {
            labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
            datasets: map(data.nodes, (node, index)=>{                
                return {
                    type: 'line',
                    label: this.getNodeName(index),
                    backgroundColor: colors[key],
                    borderColor: colors[key ++],
                    data: map(node, v=>v)
                }
            })
        };

        // var options = {
        //     chart: {
        //         width: 1160,
        //         height: 540,
        //         title: 'Node Drop Off'
        //     },
        //     yAxis: {
        //         title: 'Total Viewers',
        //     },
        //     xAxis: {
        //         title: '% Of Node Viewed',
        //         pointOnColumn: true,
        //         tickInterval: 'auto'
        //     },
        //     series: {
        //         showDot: false,
        //         zoomable: true
        //     },
        //     tooltip: {
        //         suffix: 'Viewers'
        //     },
        // };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'Node Drop Off',
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