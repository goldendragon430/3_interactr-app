import moment from "moment";
import {useSetState} from "../../utils/hooks";
import {useQuery} from "@apollo/client";
import {GET_SURVEY_NODES} from "../../graphql/Node/queries";
import {useParams} from 'react-router-dom';
import {useEffect} from "react";
import queries from "../../utils/analytics";
import map from 'lodash/map';
import analytics from "../../utils/analytics";

const DefaultStartDate = moment().subtract(365, 'day');
const DefaultEndDate = moment();

export const useSurveys = (nodes) => {
  const [state, setState] = useSetState({
    data: [],
    loading: true,
    error: false,
  });

  useEffect(()=>{
    fetchStats(
      nodes,
      DefaultStartDate,
      DefaultEndDate
    ).then( (data)=>{
      setState({
        loading: false,
        data
      } )
    }).catch((err)=>{
      setState({
        error: err,
        loading: false
      })
    });
  }, [nodes]);

  const refetch = () => {};

  const {data, loading, error} = state;

  return [data, refetch, {loading, error}];
}

const fetchStats = async ( nodes, startDate, endDate ) => {
  try {
    // 👇 must be an array of queries
    const queries = map(nodes, (node, index) => ({
      "name": "element_clicks_" + index,
      "collection": "ElementClick",
      "api": "Interactr",
      "filters": {"node_id": node.id},
      "start_date": startDate,
      "end_date": endDate,
      "group_by": "interaction_id"
    }));


    const req = await analytics.queries(queries);
    return req.data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}