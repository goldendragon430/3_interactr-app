import React, {useEffect, useState} from 'react';
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import ClientSummary from "./ClientSummary";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import LatestDoneForYouContent from "./LatestDoneForYouContent";
import LastUserlogins from "./LastUserLogins";
import MonthlyContentSummary from "./MonthlyContentSummary";
import ProjectsViewsByAll from "../../dashboard/components/Charts/ProjectsViewsByAll";
import {useSetState} from "../../../utils/hooks";
import reduce from "lodash/reduce";
import DashboardLoader from "../../dashboard/components/DashboardLoader";
import ErrorMessage from "../../../components/ErrorMessage";
import {useAuthUser} from "../../../graphql/User/hooks";
import moment from "moment";
import analytics from "../../../utils/analytics";
import {isValidNumber, percentage} from "../../../utils/numberUtils";
import Icon from "../../../components/Icon";
import map from "lodash/map";

/**
 * Show the form for an agency user to edit their account details
 * @param props
 * @returns {*}
 * @constructor
 */
const AgencyPage = () => {
  const user = useAuthUser();
  // Used to disable the form on saving state

  setBreadcrumbs([
    {text: 'Agency', link: '/agency/dashboard'},
    {text: 'Dashboard'},
  ]);
  
  setPageHeader('Your Agency Dashboard')

  const [state, setState] = useSetState({
    loading: true,
    error: false,
    data: {},
  });

  useEffect(()=>{

    (async () =>  {
      // A small delay here allows the loader to animate in nicely before we do anything
      //await delay(500);

      try {
        const data = await fetchStats(user.subusers)

        setState({
          loading: false,
          data
        })
      }catch(err){
        setState({
          loading: false,
          error: err
        })
      }
    })()

  }, []);

  const {loading, data, error} = state;

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />

  console.log(data);

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <div style={{ padding: '0px 30px' }}>
          <AgencyPageBody subusers={user.subusers} data={data}/>
        </div>
      </motion.div>
    </AnimatePresence>
  )
};
export default AgencyPage;

const AgencyPageBody = ({subusers, data}) => {


  return(
   <div className="grid">
     <div className={'col12'} style={{ marginBottom: '60px'}}>
       <ProjectsViewsByAll title="Project Performance By Client" data={data} labels={map(subusers, subuser => ({ title: subuser.name, id: subuser.id }))} />
       {/* <LatestDoneForYouContent  /> */}
     </div>
     <div className={'col5'}>
       <MonthlyContentSummary />
       {/*<LastUserlogins />*/}
     </div>
     <div className={'col7'}>
       <h4 style={{marginBottom: '15px'}}><strong>Client Project Performance Breakdown</strong></h4>
       <ClientSummary />
     </div>
   </div>
  );
};

const fetchStats = async (subusers) => {

  const currentStart = moment().subtract(30, 'day');
  const currentEnd = moment()

  const query = reduce(subusers, (result, subuser)=>{
    return result.concat({
      name: subuser.id,
      collection: 'ProjectView',
      api: 'Interactr',
      filters: {
        project_id: subuser.projects
      },
      start_date: currentStart,
      end_date: currentEnd,
      group_by: 'day'
    })
  }, []);



  let { data } = await analytics.queries(query);

  return data;
}