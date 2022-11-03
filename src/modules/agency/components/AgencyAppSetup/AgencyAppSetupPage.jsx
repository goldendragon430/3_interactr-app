import React, {useEffect, useState} from 'react';
import styles from './AgencyAppSetupPage.module.scss'
import Icon from "../../../../components/Icon";
import ErrorMessage from "../../../../components/ErrorMessage";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import {setPageHeader} from "../../../../graphql/LocalState/pageHeading";
import {agencyPath} from "../../routes";
import AgencyBranding from "./AgencyBranding";
import {useQuery} from "@apollo/client";
import {GET_AGENCY} from "../../../../graphql/Agency/queries";
import AgencyLogo from "./AgencyLogo";
import AgencyCustomDomainSetup from "./AgencyCustomDomainSetup";
import AgencyAdvancedSettings from "./AgencyAdvancedSettings";

/**
 * Show the form for an agency user to edit their account details
 * @param props
 * @returns {*}
 * @constructor
 */
const AgencyAppSetupPage = () => {
  // Used to disable the form on saving state

  setBreadcrumbs([
    {text: 'Agency', link: agencyPath()},
    {text: 'Custom Branded App Setup'}
  ]);

  setPageHeader('Custom Branded App Setup')


  const {data, loading, error} = useQuery(GET_AGENCY);

  if(loading) return <div style={{marginLeft: '30px'}}><Icon loading /></div>;

  if(error) return <ErrorMessage error={error} />;

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <AgencyPageBody id={data.result.id}/>
      </motion.div>
    </AnimatePresence>
  )
};


export default AgencyAppSetupPage;

const AgencyPageBody = ({id}) => {

  return(
    <div style={{ padding: '0px 30px', maxWidth: '1280px', paddingBottom: '75px' }}>
      <h3 className="form-heading">Custom Branded App Setup</h3>

      <AgencyBranding  id={id}/>

      <Divider />

      <AgencyLogo  id={id} />

      <Divider />

      <AgencyCustomDomainSetup id={id} />

      <Divider />

      <AgencyAdvancedSettings id={id} />
    </div>
  );
};


const Divider = () => {
  return <div className={styles.divider}>&nbsp;</div>
}