import React, {useEffect, useState} from 'react';
import styles from './LatestDoneForYouContent.module.scss'
import {Menu, MenuButton, MenuItem, SubMenu} from "@szhsin/react-menu";
import Icon from "../../../components/Icon";
import {currentMonth} from "../dfyContent";
import map from 'lodash/map';
import {openInNewTab} from "../../../utils/helpers";
import {useQuery} from "@apollo/client";
import {GET_TEMPLATES_BY_ID} from "../../../graphql/Project/queries";
import {setPreviewProject} from "../../../graphql/LocalState/previewProject";
import ErrorMessage from "../../../components/ErrorMessage";
import cx from "classnames";
import gql from "graphql-tag";
import {setProjectEmbedCode} from "../../../graphql/LocalState/projectEmbedCode";
import {useProjectCommands} from "../../../graphql/Project/hooks";

const LatestDoneForYouContent = () => {
  return (
    <div className={styles.wrapper} style={{boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 20px'}}>
      <div className={'grid'}>
        <div className={'col3'}>
          <img src={'https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/Artboard+2.png'} className={'img-fluid'} />
        </div>
        <div className={'col7 '}>
          <h1>{currentMonth.heading}</h1>
          <p style={{marginTop: 0}}>{currentMonth.summary}</p>
          <DropDownMenu />
        </div>
        <div className={'col2'}>
          <img src={currentMonth.image} className={'img-fluid'} style={{padding: '20px'}} />
        </div>
      </div>
    </div>
  )
}
export default LatestDoneForYouContent;

const QUERY = gql`
    query templatesById($ids: [Int!]!) {
    result: templatesById(includeIds: $ids) {
        id
        title
        template_name
        storage_path
    }
}`
const DropDownMenu = () => {
  const {data, error, loading} = useQuery(QUERY, {
    variables:{
      ids: currentMonth.content.projects
    }
  });

  const {getSharePageUrl} = useProjectCommands();

  if(error) {
    console.error(error)
    return <p className={'text-danger'}>Error</p>
  }

  if(loading) return <Icon loading/>;

  /**
   * Updates the local storage values to show the
   * preview project modal
   * @param id
   * @returns {*}
   */
  const previewProject = ( id ) => setPreviewProject({
    projectId: false,
    templateId: id,
    startNodeId: false
  });

  /**
   * Update the local storage show
   * embed code value this opens
   * the embed code modal for the
   * project
   * @param id
   */
  const showEmbedCode = ( id ) => {
    setProjectEmbedCode({
      templateId: id
    });
  };

  return (
    <div>

      <Menu menuButton={<MenuButton>Access Done For You Content <Icon name={'angle-down'} style={{marginRight: 0}} /> </MenuButton>}>

        {map(data.result, project => (
          <SubMenu label={project.template_name} key={`submenu-${project.id}`}>
            <MenuItem onClick={()=>previewProject(project.id)}>Preview Template</MenuItem>
            <MenuItem onClick={()=>showEmbedCode(project.id)}>Get Embed Code</MenuItem>
            {
              project.storage_path ? 
                <MenuItem onClick={()=>openInNewTab( getSharePageUrl(project) )}>Go To Share Page</MenuItem>
              : ""
            }
            <MenuItem>Create a Copy</MenuItem>
          </SubMenu>
        ))}

        <SubMenu label="Landing Page">
          <MenuItem onClick={()=>openInNewTab(currentMonth.content.landingPage.preview_url)}>Preview</MenuItem>
          <MenuItem onClick={()=>openInNewTab(currentMonth.content.landingPage.convertri)}>Convertri Funnel</MenuItem>
          <MenuItem onClick={()=>openInNewTab(currentMonth.content.landingPage.clickfunnels)}>ClickFunnels Funnel</MenuItem>
        </SubMenu>
      </Menu>
    </div>

  )
}