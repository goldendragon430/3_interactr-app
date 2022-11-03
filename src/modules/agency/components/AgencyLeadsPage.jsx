import React from 'react'
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../dashboard/routes";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";

const AgencyLeadsPage = () => {
  setBreadcrumbs([
    {text: 'Dashboard', link: dashboardPath()},
    {text: 'Agency Dashboard', link: '/agency/dashboard'},
    {text: 'Leads'}
  ]);

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <PageBody />
      </motion.div>
    </AnimatePresence>
  )
}
export default AgencyLeadsPage;

const PageBody = () => {
  return (
    <div style={{ padding: '0px 30px' }}>
      <div className={'grid'} style={{maxWidth: '1460px'}}>
        <div className={'col11'}>
          <h1>Agency Leads Page</h1>
        </div>
      </div>
    </div>
  )
}