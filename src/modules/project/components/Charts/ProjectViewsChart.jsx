import React from 'react';
import ProjectViewsByDeviceChart from './ProjectViewsByDeviceChart'
import ProjectViewsMap from './ProjectViewsMap';
import ProjectViewsByUnique from './ProjectViewsByUniques';
import analytics from 'utils/analytics';
import Icon from 'components/Icon';

export default class ProjectViewsChart extends React.Component {
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
                name: 'plays_unique',
                collection: 'ProjectView',
                api: 'Interactr',
                filters: {
                    project_id: project.id,
                },
                count: 'unique',
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
            },
            {
                name: 'mobile',
                collection: 'ProjectViewByDevice',
                api: 'Interactr',
                filters: {
                    project_id: project.id,
                },
                count:'mobile',
                start_date: startDate,
                end_date: endDate,
                group_by: 'day'
            },
            {
                name: 'desktop',
                collection: 'ProjectViewByDevice',
                api: 'Interactr',
                filters: {
                    project_id: project.id
                },
                count:'desktop',
                start_date: startDate,
                end_date: endDate,
                group_by: 'day'
            },
            {
                name: 'location',
                collection: 'ProjectViewByLocation',
                api: 'Interactr',
                filters: {
                    project_id: project.id
                },
                start_date: startDate,
                end_date: endDate,
                distinct: 'country_code'
            }
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
                {/*    <h2 style={{marginTop: 0}}>Project Views</h2>*/}
                {/*    <p>Counted Each time the project is played or unmuted if autoplay is on.</p>*/}
                {/*</div>*/}
                <ProjectViewsByUnique
                    project={project}
                    startDate={startDate}
                    endDate={endDate}
                    data={data}
                />
                <ProjectViewsByDeviceChart
                    project={project}
                    startDate={startDate}
                    endDate={endDate}
                    data={data}
                />
                <ProjectViewsMap
                    project={project}
                    startDate={startDate}
                    endDate={endDate}
                    data={data}
                />
            </div>
        );
    }
}