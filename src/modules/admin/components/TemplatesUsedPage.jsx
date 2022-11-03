import React, { useState, useEffect } from 'react';
import { useSetState } from '../../../utils/hooks';
// import {PieChart} from '@toast-ui/react-chart'
import ErrorMessage from "components/ErrorMessage";
import { setBreadcrumbs } from "../../../graphql/LocalState/breadcrumb";
import { setPageHeader } from "../../../graphql/LocalState/pageHeading";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "components/PageBody";
import { useReactiveVar } from "@apollo/client";
import { getAcl } from "../../../graphql/LocalState/acl";
import { useQuery } from "@apollo/client";
import { getPastTwelveMonths } from "../../../utils/helpers";
import gql from "graphql-tag";
import _map from 'lodash/map';
import moment from "moment";
import {phpApi} from "../../../utils/apis";
import Icon from "../../../components/Icon";




const TemplatesUsedPage = () => {
  const acl = useReactiveVar(getAcl);

  const [state, setState] = useSetState({
    loading: true,
    chartData: [],
    error: false,
  });

  setBreadcrumbs([
    {text: 'Admin', link: '/admin'},
    {text: 'Templates Used'},
  ]);

  setPageHeader('Templates Used');



  return (
    <AnimatePresence>
      <motion.div
          exit={preAnimationState}
          initial={preAnimationState}
          animate={animationState}
          transition={transition}
      >
        <TemplatesUsedPageBody
          isSuperUser={acl.isAdmin}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default TemplatesUsedPage;

const options = {
  chart: {
        width: 1160,
        height: 650,
        // title: 'Times Used',
        format: '1'
    },
    yAxis: {
        title: 'Times Used'
    },
    xAxis: {
        title: 'Month',
        // min: 0,
        // max: 9000,
        // suffix: '$'
    },
    series: {
      dataLabels: {
        visible: true,
        pieSeriesName:{
          visible: true
        }
      },
      showLabel: true
    }
};

const TemplatesUsedPageBody = ({ isSuperUser }) => {
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

  if (! isSuperUser) return 'Unauthorised';

  if(state.error) return <ErrorMessage error={error} />;

  if(state.loading) return <Icon loading/>;

  const data = {
    categories: ['Template'],
    series: state.chartData
  };

  return (
    <div style={{ paddingLeft: 30 }}>
      // TODO
      {/* <PieChart
        data={data}
        options={options}
      /> */}
    </div>
  );
}

const fetchStats = async () => {
  const req = await phpApi(`templates-used-report`);
  return await req.json();
}