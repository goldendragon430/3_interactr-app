import React, {useEffect} from 'react';
import moment from "moment";
import styles from './SurveysChart.module.scss';
import cx from 'classnames'
import forEach from 'lodash/forEach';
import {useSetState} from "../../../../utils/hooks";
import ContentLoader from "react-content-loader";
import SurveysBarChart from "./SurveysBarChart";
import filter from 'lodash/filter';
import map from 'lodash/map';
import SurveysPieChart from "./SurveysPieChart";

const SurveyChart = ({node, loading, data}) => {
  
  const interactions = (!loading && data) ? filter(node.interactions, interaction => {
    return (interaction.element && interaction.element.send_survey_click_event);
  }) : null;

  const stats = (!loading && data) ? map(interactions, interaction => {
    return{
      ...interaction,
      clicks: (data[interaction.id]) ? data[interaction.id] : 0
    }
  }) : null;

  let totalResponses = 0;

  if(stats) {
    forEach(stats, interaction => {
      totalResponses += parseInt(interaction.clicks);
    })
  }

  return(
    <div className={styles.wrapper}>
      <h2>
        {node.name}<br/>
        <small>Responses: {(totalResponses > 0) ? totalResponses : '-'}</small>
      </h2>
      <div className={styles.chart}>
        { (loading) ? <Loader /> : null }
        { (stats) ? <SurveysBarChart stats={stats} /> : null}
      </div>
      <div className={styles.chart}>
        { (loading) ? <Loader /> : null }
        <SurveysPieChart stats={stats} />
      </div>
    </div>
  );
}
export default SurveyChart;

const Loader = () => {

  const height = 400;
  const width = 550;

  return <ContentLoader
    speed={3}
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    backgroundColor="#f3f6fd"
  >
    {/* Only SVG shapes */}
    <rect x="0" y="0" rx="3" ry="3" width={width} height={height} />
  </ContentLoader>
};
