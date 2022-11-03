import React from 'react';
// import StatItem from 'modules/stat/components/statItem';
import styles from './ProjectStats.module.scss';
import Icon from 'components/Icon';
// import { getConversionsByPrice, getCollectionName, getUniqueInteractions } from 'shared/keen';
import analytics from 'utils/analytics';

import ProjectStatsChart from './ProjectStatsChart';
// TODO: Remove moment , we use date-fns
import moment from 'moment';

export default class ProjectStatsMetrics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: [],
      fetchingStats: false,
      statsErrors: {
        views: null
      }
      // regular: 0,
      // unique: 0,
      // uniqueInteractions: 0,
      // conversions: 0,
      // conversionRate: 0,
      // conversionAmounts: [],
      // totalRevenue: 0,
      // revenuePerView: 0,
      // revenuePerUniqueView: 0,
      // viewsPerConversion: 0,
      // interactionRate: 0
    };
  }

  dateOne = moment()
    .subtract(29, 'days')
    .format('YYYY-MM-DD');
  dateTwo = moment().format('YYYY-MM-DD');

  async componentDidMount() {
    const { project } = this.props;
    if (project && project.id) {
      await this.fetchStats(project);
    }
  }

  async fetchStats(project) {
    // 👇 must be an array of queries
    const queries = [
      {
        name: 'project_views',
        collection: 'ProjectView',
        api: 'Interactr',
        filters: {
          project_id: project.id
        },
        start_date: this.dateOne,
        end_date: this.dateTwo,
        group_by: 'day'
      }
    ];

    // Keep pushing queries as needed

    try {
      this.setState({ fetchingStats: true });
      const { data } = await analytics.queries(queries);
      this.setState({ stats: data, fetchingStats: false });
    } catch (error) {
      this.setState({ fetchingStats: false, statsErrors: { views: true } });
    }
  }

  // onStatUpdate = (type, value) => {
  //   this.setState({[type]: value});
  //   this.recalculateStatsFromBaseStats();
  // };

  // jumpTo(id){
  //   const target = document.getElementById(id);

  //   window.scroll({
  //     top: target.offsetTop - 100,
  //     behavior: 'smooth'
  //   });
  // }

  get formatedLabels() {
    const intervals = [moment(this.dateOne).format('DD MMM')];
    const startDate = moment(this.dateOne);
    const diff = moment(this.dateTwo).diff(startDate, 'days');
    let counter = 1;

    while (counter <= diff) {
      intervals.push(startDate.add(1, 'day').format('DD MMM'));
      counter++;
    }

    return intervals;
  }

  formatValueForChart = v => {
    if (!v) {
      return 0;
    }
    if (isNaN(v)) {
      return v;
    }

    if (typeof v === 'string' && v.includes('.')) {
      v = parseFloat(v).toFixed(2);
    } else {
      v = parseInt(v, 10);
    }
    return v.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  formatSeries = (seriesName, prefix) => {
    const { stats } = this.state;
    return stats && stats[seriesName]
      ? stats[seriesName].map(({ count }) => ({
          value: this.formatValueForChart(count),
          meta: `${prefix || ''}`
        }))
      : [];
  };

  render() {
    const { project } = this.props;
    const { statsErrors, fetchingStats } = this.state;

    if (project === undefined) {
      return null;
    }

    const projectViews = {
      labels: this.formatedLabels,
      series: [this.formatSeries('project_views', 'Views')]
    };

    return (
      <div style={{marginLeft: '30px', marginRight: '30px'}}>
        <div >
          <h2 style={{marginTop: 0}}>Project Views</h2>
          <p>Counted Each time the project is played or unmuted if autoplay is on.</p>
        </div>
        {/*<div className={styles.headline}>*/}
        {/*  <h2>*/}
        {/*    <span>Project Views</span> {' '}*/}
        {/*    <Icon name="eye" />*/}
        {/*  </h2>*/}
        {/*</div>*/}

        <ProjectStatsChart name="views" stats={projectViews} loading={fetchingStats} error={statsErrors.views} />

        {/*<div className="alert alert-info">*/}
        {/*  <p>*/}
        {/*    <Icon name="info-circle" />*/}
        {/*    <small>New Updated Stats Comming Soon.</small>*/}
        {/*  </p>*/}
        {/*</div>*/}
        {/* <div className={metricClassName}>
            <div className={styles.statItem} onClick={()=>this.jumpTo('viewsBreakdown')}>
              <div className={styles.statItemTopLine}>
                <div className={styles.statItemMetric}><StatItem projectId={project.id} onStatUpdate={this.onStatUpdate} /></div> VIEWS
              </div>
              <div className={styles.statItemLowerLine}>
                <div className={styles.statItemMetric}><StatItem projectId={project.id} type="unique" onStatUpdate={this.onStatUpdate} /></div> UNIQUE VIEWS
              </div>
              <div className={styles.statItemText} style={{backgroundColor: '#00a2e1'}}>
                <h4><Icon name="eye" />Project Views</h4>
              </div>
            </div>
          </div> */}
        {
          // Hide Interactions stats for projects created before the related bug fix
          // Hacky but better as opposed to resetting all the stats
          // isProjectCreatedAfterBugFix &&
          // <div className={metricClassName}>
          //   <div className={styles.statItem} onClick={()=> this.jumpTo('interactionsBreakdown')}>
          //     <div className={styles.statItemTopLine}>
          //       <div className={styles.statItemMetric}>{interactionRate}%</div> OF VIEWERS INTERACTED
          //     </div>
          //     <div className={styles.statItemLowerLine}>
          //       <div className={styles.statItemMetric}><StatItem projectId={project.id} type="uniqueInteractions" onStatUpdate={this.onStatUpdate} /></div> INTERACTIONS
          //     </div>
          //     <div className={styles.statItemText}  style={{backgroundColor: '#00b382'}}>
          //       <h4><Icon name="mouse-pointer" />Interactions</h4>
          //     </div>
          //   </div>
          // </div>
        }

        {/* <div className={metricClassName}>
            <div className={styles.statItem} onClick={() => this.jumpTo('conversionsBreakdown')}>
              <div className={styles.statItemTopLine}>
                <div className={styles.statItemMetric}>{conversionRate}%</div> CONVERSION RATE
              </div>
              <div className={styles.statItemLowerLine}>
                <div className={styles.statItemMetric}><StatItem projectId={project.id} type="conversions" onStatUpdate={this.onStatUpdate} /></div> CONVERSIONS
              </div>
              <div className={styles.statItemText} style={{backgroundColor: '#f81b84'}}>
                <h4><Icon name="shopping-cart" />Conversions</h4>
              </div>
            </div>
          </div> */}

        {/* <div className={metricClassName}>
            <div className={styles.statItem} onClick={() => this.jumpTo('revenueBreakdown')}>
              <div className={styles.statItemTopLine}>
                <div className={styles.statItemMetric}>{this.currencySymbol()}{totalRevenue}</div> TOTAL REVENUE
              </div>
              <div className={styles.statItemLowerLine}>
                <div className={styles.statItemMetric}>{this.currencySymbol()}{revenuePerView}</div> REVENUE PER VIEW
              </div>
              <div className={styles.statItemText} style={{backgroundColor: '#f7882f'}}>
                <h4><Icon name={'coins'} />Revenue</h4>
              </div>
            </div>
          </div> */}

        {/* Metrics not currently being used */}
        {/*<div className={styles.statItemMetric}>{viewsPerConversion}</div> VIEWS PER CONVERSION*/}
        {/*<div className={styles.statItemMetric}>{revenuePerUniqueView}</div> REVENUE PER UNIQUE VIEW*/}
      </div>
    );
  }
}
