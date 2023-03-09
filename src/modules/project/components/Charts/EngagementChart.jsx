import Icon from 'components/Icon';
import React from 'react';
import analytics from 'utils/analytics';
import DropOffChartNode from './DropOffChartNode';
import DropOffChartProject from './DropOffChartProject';
import InteractionsChart from './InteractionsChart';

export default class EngagementChart extends React.Component {
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
                name: 'project',
                collection: 'ProjectViewDuration',
                api: 'Interactr',
                filters: {
                    project_id: project.id,
                },
                start_date: startDate,
                end_date: endDate,
                group_by: 'timestamp'
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
            },
            {
                name: 'nodes',
                collection: 'NodeViewDuration',
                api: 'Interactr',
                filters: {
                    project_id: project.id
                },
                start_date: startDate,
                end_date: endDate,
                group_by: 'day'
            },
            {
                name: 'interaction',
                collection: 'NodeInteraction',
                api: 'Interactr',
                filters: {
                    project_id: project.id
                },
                start_date: startDate,
                end_date: endDate,
                group_by: 'view_path',
                //count: 'count'
            },
        ];


        try {
            const { data } = await analytics.queries(queries);
            this.setState({ data, gotData: true });

        } catch (error) {
            this.setState({ fetchingStats: false, statsErrors: { views: true } });
        }
    }

    render(){
        const {project, startDate, endDate} = this.props;

        const {gotData} = this.state;

        if(! gotData){
            return(
                <p><Icon spin name="circle-notch" /> Getting Chart Data</p>
            );
        }

        const {data} = this.state;

        return(
            <div>
                {/*<div>*/}
                {/*    <h2 style={{marginTop: 0}}>Project Engagement</h2>*/}
                {/*    <p>Optimize your interactive video by studying the viewer engagement.</p>*/}
                {/*</div>*/}
                <div>
                    <DropOffChartProject project={project}  data={data} />
                    <DropOffChartNode project={project} data={data} />
                    <InteractionsChart project={project} data={data} />
                </div>
            </div>
        );
    }
}