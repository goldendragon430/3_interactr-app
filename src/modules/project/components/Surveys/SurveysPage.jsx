import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useQuery, useReactiveVar} from "@apollo/client";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import {AnimatePresence, motion} from "framer-motion";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import Icon from "../../../../components/Icon";
import ErrorMessage from "../../../../components/ErrorMessage";
import Button from "../../../../components/Buttons/Button";
import {useProject, useSaveProject} from "../../../../graphql/Project/hooks";
import {errorAlert} from "../../../../utils/alert";
import {EnableSurveyAlertsStepTwo} from "../../utils";
import {GET_SURVEY_NODES} from "../../../../graphql/Node/queries";
import SurveysChart from "./SurveysChart";
import SurveysCharts from "./SurveysCharts";
import {getAcl} from "../../../../graphql/LocalState/acl";
import LinkButton from "../../../../components/Buttons/LinkButton";


const SurveysPage = () => {
    const [project, _, {loading, error}] = useProject();
    useEffect(()=>{
      setBreadcrumbs([
        {text: 'Dashboard', link: dashboardPath()},
        {text: 'Projects', link: projectsPath()},
        {text: 'Project Survey'},
      ]);
    }, [])

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;


  return (
      <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}
            style={{paddingLeft: '30px'}}
          >
            <Page project={project} />
          </motion.div>
      </AnimatePresence>
    );
};

export default SurveysPage;

const Page = ({project}) => {
  const acl = useReactiveVar(getAcl);
  const [isRefetching, setIsRefetching] = useState(false)
  const { loading, error, data, refetch } = useQuery(GET_SURVEY_NODES, {
    variables: {projectId: Number(project?.id)}
  });

  const handleRefetch = async () => {
    setIsRefetching(true)
    try {
      await refetch()
    } catch (err) {
      console.error(err)
      errorAlert({text: err})
    }
    setIsRefetching(false)
  }

  if(! acl.canAccessSurveys){
    return(
      <div>
        <h2>Upgrade Required</h2>
        <p>You need to upgrade your account to access the surveys feature</p>
        <LinkButton to={'/upgrade'} primary icon={'arrow-up'}>Upgrade Now</LinkButton>
      </div>
    )
  }

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  if(!project.enable_surveys) {
    return <EnableSurveysPrompt projectId={Number(project?.id)} />
  }

  if (!data?.result.length) {
    return (
      <div className={'grid'}>
          <div className={'col9'}>
            <NoSurveysYet />
          </div>
          <div className={'col2'} style={{paddingRight: 0}}>
            <Button 
              primary 
              right 
              style={{marginTop: '20px'}}
              loading={isRefetching}
              icon={'sync-alt'}
              onClick={handleRefetch}
            >Refresh Results</Button>
          </div>
      </div>
    )
  }
  
  return (
    <div className={'grid'}>
      <div className={'col12'} style={{paddingRight: 0}}>
        <Button 
          primary 
          right 
          loading={isRefetching}
          icon={'sync-alt'}
          onClick={handleRefetch}
        >Refresh Results</Button>
      </div>
      <SurveysCharts nodes={data.result} />
    </div>
  )
};

Page.propTypes = {
  project: PropTypes.object.isRequired
}

const EnableSurveysPrompt = ({projectId}) => {
  const [saveProject, {loading}] = useSaveProject();

  const handleClick = async () => {
    try {
      await saveProject({
        id: projectId,
        enable_surveys: 1
      });

      EnableSurveyAlertsStepTwo();
    }catch(err){
      errorAlert({text: err});
    }
  };

  return(
    <div>
      <h2>Surveys haven't been enabled on this project, would you like to enable surveys now?</h2>
      <Button primary onClick={handleClick} loading={loading} icon={'check'}>Yes, Enable Surveys</Button>
    </div>
  );
};

EnableSurveysPrompt.propTypes = {
  projectId: PropTypes.number.isRequired
}

const NoSurveysYet = () => {
  return(
    <div>
      <h2>No Survey Results</h2>
      <p>We don't have any survey results for this project yet</p>
    </div>
  )
};