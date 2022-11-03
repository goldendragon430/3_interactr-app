import React, { useState, useEffect } from 'react';
//import { LineChart } from '@toast-ui/react-chart';
import ErrorMessage from "components/ErrorMessage";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "components/PageBody";
import { useReactiveVar, useQuery } from "@apollo/client";
import { getAcl } from "../../../graphql/LocalState/acl";
import { getPastTwelveMonths } from "../../../utils/helpers";
import gql from "graphql-tag";
import _map from 'lodash/map';
import moment from 'moment';
import reduce from 'lodash/reduce';
import {useSetState} from "../../../utils/hooks";
import {phpApi} from "../../../utils/apis";
import analytics from "../../../utils/analytics";


const ActiverUsersPage = () => {
  const acl = useReactiveVar(getAcl);

  setBreadcrumbs([
    {text: 'Admin', link: '/admin'},
    {text: 'Active Users Report'},
  ]);

  setPageHeader('Active Users Report');

  return (
    <AnimatePresence>
      <motion.div
          exit={preAnimationState}
          initial={preAnimationState}
          animate={animationState}
          transition={transition}
      >
        <ActiveUsersPageBody
          isSuperUser={acl.isAdmin}
        />
      </motion.div>
    </AnimatePresence>
)
}

export default ActiverUsersPage;


const ActiveUsersPageBody = ({ isSuperUser }) => {
  const [state, setState] = useSetState({
    loading: true,
    chartData: [],
    error: false,
  });


  useEffect(() => {

    (async () =>  {
      try {
        const data = await fetchStats()

        setState({
          loading: false,
          chartData: data
        })

      }catch(err){
        setState({
          loading: false,
          error: err
        })
      }
    })()

  }, [])

  const {error, loading, chartData} = state;

  if(error) return <ErrorMessage error={error} />;

  if(loading) return null;

  if (! isSuperUser) return 'Unauthorised';

  const chart = {
    categories: getPastTwelveMonths(),
    series: [
      {
        name: 'Active User Count',
        data: analytics.getSeriesFromQuery(chartData),
      },
    ],
  };

  const chartOptions = {
    chart: {
      width: 1360,
      height: 650,
      title: 'Monthly Active Users',
    },
    yAxis: {
      title: 'Count',
    },
    xAxis: {
      title: 'Month',
    },
    legend: {
      visible: false
    }
  };
  
  const chartStyle = {
    width: '600px',
    height: '600px',
  };
console.log(chart);
  return (
    <div style={{ paddingLeft: 30 }}>
      <h2>Active Users</h2>
      // TODO
      {/* <LineChart data={chart} options={chartOptions} style={chartStyle} /> */}
    </div>
  )
}


const fetchStats = async () => {
  const req = await phpApi(`get-user-logins`);
  return await req.json();
};