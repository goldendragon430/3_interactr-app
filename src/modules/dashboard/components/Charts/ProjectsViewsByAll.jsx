import React from 'react';
//import {AreaChart} from '@toast-ui/react-chart'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import analytics from 'utils/analytics';
import map from 'lodash/map';
import union from 'lodash/union';
import find from "lodash/find";
import take from "lodash/take";
import isEmpty from "lodash/isEmpty";
import reduce from 'lodash/reduce'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export default class ProjectsViewsByAll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupBy:'day'
        }
    }

    noData(){
        return (
            <div className="grid">
                <div className="col12">
                    <div style={{border: '1px solid #ccc', height: '400px', width: '100%', textAlign: 'center', borderRadius: '20px'}}>
                        <h3 style={{lineHeight: '400px', margin: '0'}}>Not Enough Data For Project Views Chart</h3>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Because a project could have a value for impressions but
     * not for plays we need to do a check for that here.
     *
     * It could also have plays but no impressions if a legacy project so
     * we need to do some cross referencing
     *
     * @param data
     */
    formatChartData(data){
        const impressionProjectIds =  Object.keys(data.impressions);
        const playProjectIds = Object.keys(data.plays);

        // Get a unique array of project ids
        const projectIds = take(
            union(
                impressionProjectIds, playProjectIds
            ),
            10
        );

        // now loop through the array of project id's and either get
        // the matching value or set to 0
        const plays = map(projectIds, projectId=>{
            return (playProjectIds && playProjectIds.includes(projectId)) ? data.plays[projectId] : 0;
        });

        const impressions = map(projectIds, projectId=>{
            return (impressionProjectIds && impressionProjectIds.includes(projectId)) ? data.impressions[projectId] : 0;
        });

        const projectNames = map(projectIds, id=>{
            const project = find(this.props.projects, {"id": id });
            let title =  (project) ? project.title : '-';
            if(project.legacy) title = "* "+title;
            return title;
        });

        return {plays, impressions, projectNames};
    }

    render(){
        const {data, labels, title} = this.props;

        if( isEmpty(data) ) {
            return this.noData();
        }

        // analytics.registerTheme();
        const colors = analytics.getThemeColors();
        const borderColors = analytics.getBorderColors();

        let d = {
            // categories: reduce(projects, (result, project)=>{
            //     return result.concat(project.title)
            // }, []),

            labels: analytics.getCategoriesFromQuery(data[labels[0].id], this.state.groupBy),

            datasets: reduce(labels, (result, label, index) => {
                return result.concat({
                    fill: true,
                    label: label.title,
                    data: analytics.getSeriesFromQuery(data[label.id]),
                    borderColor: borderColors[index],
                    backgroundColor: colors[index],
                })
            }, [])
        };
        
        const options = {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: title,
                font: {
                    size: 18,
                }
              },
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => {
                            return `${value} views`
                        }
                    }
                }
            }
        };
        return <Line options={options} data={d} height={100} />
    }
}