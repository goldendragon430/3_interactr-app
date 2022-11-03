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
import Icon from 'components/Icon';

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

export default class ImpressionsChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gotData: false,
            data: {},
            groupBy:'day'
        }
    }

    async componentDidMount() {
        const { project, startDate, endDate } = this.props;
        if (project && project.id) {
            await this.fetchStats(project, startDate, endDate );
        }
    }

    async shouldComponentUpdate(nextProps, nextState){
        const { project, startDate, endDate } = this.props;
        if(startDate !== nextProps.startDate || endDate !== nextProps.endDate) {
            await this.fetchStats(project, nextProps.startDate, nextProps.endDate );
        }
    }

    async fetchStats(project, startDate, endDate ) {
        // 👇 must be an array of queries
        const queries = [
            {
                name: 'impressions',
                collection: 'Impression',
                api: 'Interactr',
                filters: {
                    project_id: project.id
                },
                start_date: startDate,
                end_date: endDate,
                group_by: 'day'
            },
            {
                name: 'plays',
                collection: 'ProjectView',
                api: 'Interactr',
                filters: {
                    project_id: project.id
                },
                start_date: startDate,
                end_date: endDate,
                group_by: 'day'
            }
        ];

        // Keep pushing queries as needed

        try {
            const { data } = await analytics.queries(queries);
            console.log(data);
            this.setState({ data, gotData: true });

        } catch (error) {
            this.setState({ fetchingStats: false, statsErrors: { views: true } });
        }
    }

    getData(){
        const {data, groupBy} = this.state;

        const impressions = analytics.getSeriesFromQuery(data.impressions);
        const plays = analytics.getSeriesFromQuery(data.plays);
        const playRate = this.getPlayRate(impressions, plays);
        
        return {
            labels: analytics.getCategoriesFromQuery(data.impressions, groupBy),
            datasets: [
                {
                    type: 'bar',
                    label: 'Impressions',
                    backgroundColor: 'rgb(75, 192, 192)',
                    data: impressions,
                    borderColor: 'white',
                    borderWidth: 2,
                    yAxisID: 'y',
                },
                {
                    type: 'bar',
                    label: 'Plays',
                    backgroundColor: 'rgb(53, 162, 235)',
                    data: plays,
                    yAxisID: 'y',
                }, 
                {
                    type: 'line',
                    label: 'Play Rate (%)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    fill: false,
                    data: playRate,
                    yAxisID: 'y1',
                },  
            ]
        };
    }

    getPlayRate(impressions, plays){
        return impressions.map((value, index)=>{
            const percent = (plays[index] / value) * 100;
            // Round to 2 dp
            const val =  Math.round(percent * 100) / 100
            return (isNaN(val)) ? 0.00 : (val > 100) ? 100 : val;
        })
    }

    render(){
        const {gotData} = this.state;

        if(! gotData){
            return(
                <p><Icon spin name="circle-notch" /> Getting Chart Data</p>
            );
        }

        const data = this.getData();

        const options = {
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            stacked: false,
            scales: {
                y: {
                    min: 0,
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks:{
                        stepSize: 1
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                    drawOnChartArea: false,
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: (value) => {
                            if(value == 100)
                                return `${value}% (Play Rate)`
                            return `${value}%`
                        }
                    }
                },
            },
        };

        return(
            <div>
                {/*<div>*/}
                {/*    <h2 style={{marginTop: 0}}>Project Impressions</h2>*/}
                {/*    <p>Each time the project is loaded on a page this counts as an impression.</p>*/}
                {/*</div>*/}
                <div>
                    { data &&
                        <Chart
                            data={data}
                            type='bar'
                            options={options}
                            height={120}
                        />
                    }
                </div>
            </div>
        );
    }

}