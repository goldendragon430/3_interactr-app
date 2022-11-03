import React from 'react';
import PropTypes from 'prop-types';
//import ChartistGraph from 'react-chartist';
import Spinner from 'components/Spinner';

const _props = {
  name: PropTypes.string,
  stats: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  // chartOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  /** Error while fetching data , should display missing data error */
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  loading: PropTypes.bool
};

/** Project Stats Card */
class ProjectStatsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartInitialized: false
    };
    this.$chart = React.createRef();
  }

  async componentDidMount() {
    const plugins = [];
    try {
      // 👇 needed to make plugins work ,
      this.Chartist = await require('chartist');
      await require('chartist-plugin-tooltips');
      plugins.push(this.Chartist.plugins.tooltip());
      this.chartOptions.plugins = plugins;
      this.setState({ chartInitialized: true });
    } catch (error) {
      this.setState({ chartInitialized: true });
    }
  }

  chartOptions = {
    // high: series[0] + 1,
    low: 0,
    fullWidth: true,
    showArea: true,
    height: '350px',
    axisX: {
      showGrid: false
    },
    axisY: {
      onlyInteger: true
    }
    // showLine: true
    // showPoint: true,
  };
  render() {
    const { stats, loading, error } = this.props;
    const { chartInitialized } = this.state;
    if (loading) {
      return (
        <div style={{ height: 400 }}>
          <Spinner />
        </div>
      );
    }
    if (error) {
      return <ChartMessage info="Fetching Data Problem!" />;
    }
    return null;
    // return (
    //   <React.Fragment>
    //     {stats.series & (stats.series[0].length < 1) ? (
    //       <ChartMessage info="Not Enough Data for Chart !" />
    //     ) : (
    //       chartInitialized && (
    //         <ChartistGraph
    //           data={stats}
    //           options={this.chartOptions}
    //           style={{ marginBottom: 50 }}
    //           type="Line"
    //           ref={ref => (this.$chart = ref)}
    //           responsiveOptions={[
    //             [
    //               'screen and (max-width: 1000px)',
    //               {
    //                 // reverseData: true,
    //                 horizontalBars: true,
    //                 axisX: {
    //                   labelInterpolationFnc: v => v.substring(0, 2) + v[3]
    //                 },
    //                 axisY: {
    //                   offset: 60
    //                 }
    //               }
    //             ]
    //           ]}
    //         />
    //       )
    //     )}
    //   </React.Fragment>
    // );
  }
}
ProjectStatsCard.propTypes = _props;
export default ProjectStatsCard;

const ChartMessage = ({ info }) => (
  <div style={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <h3 className="text-danger">{info}</h3>
  </div>
);
