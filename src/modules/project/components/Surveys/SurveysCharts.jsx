import React, { useEffect } from 'react';
import map from 'lodash/map';
import SurveysChart from "./SurveysChart";
import {useSurveys} from "../../surveyUtils";
import ErrorMessage from "../../../../components/ErrorMessage";

const SurveysCharts = ({nodes}) => {
  // Get the data from analatycs api
  const [data, refetch, {loading, error}] = useSurveys(nodes);
  
  if(error) {
    return <ErrorMessage error={error} />;
  }
  
  return map(nodes, (node, index) => <SurveysChart node={node} data={data['element_clicks_'+index]} loading={loading} />);
};
export default SurveysCharts;