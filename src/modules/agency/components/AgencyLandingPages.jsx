import React from 'react';
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../dashboard/routes";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import landingPages from "../landingPages";
import styles from './AgencyLandingPages.module.scss'
import map from 'lodash/map';
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import ReactTooltip from "react-tooltip";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import {Menu, MenuButton, MenuItem, SubMenu} from "@szhsin/react-menu";
import {openInNewTab} from "../../../utils/helpers";
import cx from "classnames";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import ErrorMessage from "components/ErrorMessage";

const LANDING_PAGES = gql`
    query agencyClubLandingPages {
        result: agencyClubLandingPages {
          name,
          convertri_url,
          clickfunnels_url,
          html_url,
          preview_url,
          image_url,
        }
    }
`;

const AgencyLandingPages = () => {
  setBreadcrumbs([
    {text: 'Agency', link: '/agency/dashboard'},
    {text: 'Done For You Landing Pages'}
  ]);

  setPageHeader('Done For You Landing Pages')

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
export default AgencyLandingPages;

const PageBody = () => {
  return (
    <div style={{ padding: '0px 30px' }}>
      <div className={'grid'} style={{maxWidth: '1460px'}}>
        <div className={'col11'}>
          <h1 style={{marginTop: 0}}>Done For You Landing Pages</h1>
          <p style={{maxWidth:'1000px', marginBottom:'30px'}}>
            Use our custom done for you landing pages to drive traffic and capture new leads for your video agency.
            We add one new landing page every month, each landing page features custom written sales copy and a custom design.
            You can use the landing pages as either a ClickFunnels share funnel or a Convertri Share Funnel. You will need an account with
            ClickFunnels or Convertri to use them.
          </p>
          <LandingPagesList />
        </div>
      </div>
    </div>
  )
}

const LandingPagesList = () => {
  const {data, loading, error} = useQuery(LANDING_PAGES);
  // const pages = {...landingPages['2021'], ...landingPages['2020']};

  if (loading) return <Icon loading />;

  if(error ) return <ErrorMessage error={error} />;

  const list =  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -5, scale: 0.7 },
    show: { opacity: 1, x:0, scale: 1, transition: {type: 'ease-in'} }
  }

  return (
    <motion.div className="grid clearfix"  initial="hidden" animate="show"  variants={list}>
      {
        data.result.length > 0 ? 
          map(data.result, (landingPage) => (
            <motion.div className="col3"  key={landingPage.id} variants={item} style={{float: 'left'}}>
              <LandingPage landingPage={landingPage} />
            </motion.div>
          ))
        : (
          <div style={{textAlign: 'center', marginTop: 60, display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
            <h1 style={{ marginBottom: 0 }}>
              <Icon name='exclamation-triangle' size={'lg'} />
            </h1>
            <h2>No Landing Pages ...</h2>
          </div>
        )
      }
    </motion.div>
  )
};

const LandingPage = ({landingPage}) => {
  return(
    <div className={styles.landingPageItemWrapper} >
      <ReactTooltip  className="tooltip" />
      <div className={styles.hoverSection} >
        <img src={landingPage.image_url} className="img-fluid"  style={{boxShadow: '0px 2px 20px rgb(0 0 0 / 6%)', borderRadius: '5px', border: '1px solid #f3f6fd'}}/>
      </div>
      <div className={'clearfix'}>
        <div style={{width: '80%', float:'left', paddingTop: '5px'}}>
          <p style={{marginBottom: 0, marginLeft: '5px'}}><strong>{landingPage.name}</strong></p>
        </div>
        <div style={{width: '20%', float:'right', textAlign:'right', paddingTop: '10px'}}>
          <Menu menuButton={<MenuButton><Icon name={'ellipsis-v'} style={{marginRight: 0}} /></MenuButton>}>
            <MenuItem onClick={()=>openInNewTab(landingPage.preview_url)}>Preview Template</MenuItem>
            <SubMenu label="Use Template">
              {(landingPage.convertri_url) ? <MenuItem onClick={()=>openInNewTab(landingPage.convertri_url)}>Use In Convertri</MenuItem> : null}
              {(landingPage.clickfunnels_url) ?<MenuItem onClick={()=>openInNewTab(landingPage.clickfunnels_url)}>Use In Clickfunnels</MenuItem> : null}
            </SubMenu>
          </Menu>
        </div>
      </div>
    </div>
  )
};

