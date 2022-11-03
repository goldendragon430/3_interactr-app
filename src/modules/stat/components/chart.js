import React from 'react';
import {getCollectionName, filters, containsFilter,  draw} from 'shared/keen';
import styles from './chartStyles.module.scss';
import Button from 'components/Buttons/Button';
import Select from 'react-select';
import Icon from 'components/Icon';
import each from 'lodash/each';
import find from 'lodash/find';

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeframeUnit: 12,
      timeframeMetric: 'months',
      timeframeSelectMetric: 'months',
      event_collection: getCollectionName(props.project.id || ''),
      interval: 'monthly',
      dateRangeOptions: [
        {label: 'Days', value:'days', clearableValue:false},
        {label: 'Weeks', value:'weeks', clearableValue:false},
        {label: 'Months', value:'months', clearableValue:false},
        {label: 'Years', value:'years', clearableValue:false},
      ]
    };
    this.el = null;
  }

  componentDidMount() {
    this.drawGraph();
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.timeframeMetric !== this.state.timeframeMetric || oldState.timeframeUnit !== this.state.timeframeUnit) {
      this.drawGraph();
    }
  }

  drawGraph = () => {
    const {timeframeMetric, timeframeUnit, event_collection, interval} = this.state;
    const {metric, id, type} = this.props;

    let newFilters = id === "retentionChart" ? containsFilter(metric) : filters(metric);

    let timeframe = 'this_'+timeframeUnit+'_'+timeframeMetric;
    if (timeframeMetric === "all") {
      timeframe = 'this_12_months';
    }

    const keenQuery = {
      timeframe: timeframe,
      event_collection,
      filters: newFilters
    };

    let analysis_type = 'count';
    if (id.indexOf('revenuesBy') !== -1) {
      analysis_type = 'sum';
      keenQuery.target_property = 'value';
    }

    let manualDraw = null;
    if (id === "viewsByLocation" || id === "conversionsByLocation" || id === "revenuesByLocation") {
      keenQuery.group_by = 'ip_geo_info.country';
    } else if (id === "viewsByDevice" || id === "conversionsByDevice" || id === "revenuesByDevice") {
      keenQuery.group_by = 'parsed_user_agent.browser.family';
    } else if (id === "retentionChart") {
      keenQuery.group_by = ['name', 'video_name'];
      manualDraw = this.drawManualRetentionChart;
    } else {
      keenQuery.interval = interval;
    }

    draw(this.el, event_collection, keenQuery, type, analysis_type, manualDraw);
  };

  drawManualRetentionChart = (err, res, chart, newQuery) => {
    let data = {result: []};

    let videoResults = {};
    if (res && res.result && Array.isArray(res.result)) {
      res.result.forEach((result) => {
        if (videoResults[result.videoId] === undefined) {
          videoResults[result.videoId] = {video_started: 0, video_finished: 0};
        }

        videoResults[result.videoId][result.name] += result.result;
      });

      each(videoResults, (result, videoId) => {
        let percentRetained = result.video_finished > 0 ? (result.video_finished / result.video_started) * 100 : 0;

        const video = find(this.props.nodes, {id: parseInt(videoId, 10)});
        data.result.push({
          name: video && video.name || 'Unknown',
          result: Math.round(percentRetained * 100) / 100
        })
      });
    }

    if (data.result.length === 0) {
      data.query = Object.assign(newQuery.params, {analysis_type: 'bar'});
    }

    chart
      .data(data)
      .title(" ")
      .chartOptions({
        axis: {
          y: {
            tick: {
              format: function (d) { return d + '%'; },
              outer: false
            },
            default: [0, 100],
            padding: {
              top: 0,
              bottom: 0
            },
            max: 100,
            min: 0
          },
          y2: {
            tick: {
              format: function (d) { return d + '%'; },
              outer: false
            },
            padding: {
              top: 0,
              bottom: 0
            },
            default: [0, 100],
            max: 100,
            min: 0,
            inner: true
          }
        }
      })
      .colors([
        'rgb(31, 119, 180)',
        'rgb(255, 127, 14)',
        'red'
      ])
      .render();
  };

  onUpdateTimeFrame = (el, timeframeOnly) => {
    if (timeframeOnly) {
      this.setState({timeframeMetric: el.target.value});
    } else {
      el.preventDefault();
      this.setState({timeframeUnit: el.target.timeframeUnit.value, timeframeMetric: el.target.timeframeMetric.value});
    }
  };

  render() {
    const {project, title, backgroundColor, icon} = this.props;
    if (project === undefined) {
      return null;
    }

    const headerStyles = {backgroundColor};

    const {timeframeSelectMetric, timeframeUnit} = this.state;
    return (
      <div className={styles.chart}>
        <div className={styles.headerRow} style={headerStyles}>
          <h3><Icon name={icon} />{title}</h3>
        </div>
        <div ref={(item) => this.el = item}>Loading...</div>

        <div className={styles.chartFooter}>
          <h4>
            Reporting Period
          </h4>
          <form onSubmit={this.onUpdateTimeFrame} className={styles.form}>
            <div className={styles.input}>
              <input className={styles.timeframeUnit} type="text" name="timeframeUnit" defaultValue={timeframeUnit} />
            </div>
            <div className={styles.select}>
              <Select
                name="timeframeMetric"
                value={timeframeSelectMetric}
                options={this.state.dateRangeOptions}
                onChange={(val) => this.setState({timeframeSelectMetric: val.value})}
                clearable={false}
              />
            </div>
            <Button type="submit" >Update</Button>
          </form>
        </div>
      </div>
    );
  }
}
