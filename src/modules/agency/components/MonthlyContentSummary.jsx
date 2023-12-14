import React, { useEffect } from 'react';
import { useSetState } from '../../../utils/hooks';
import dfyContent, {currentMonth} from "../dfyContent";
import cardStyles from "../../../components/Card.module.scss";
import {Menu, MenuButton, MenuItem, SubMenu} from "@szhsin/react-menu";
import Icon from "../../../components/Icon";
import map from "lodash/map";
import {openInNewTab} from "../../../utils/helpers";
import {setProjectEmbedCode} from "../../../graphql/LocalState/projectEmbedCode";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import {setPreviewProject} from "../../../graphql/LocalState/previewProject";
import {copyConfirmed} from "../../../graphql/utils";
import {projectPath} from "../../project/routes";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {errorAlert} from "../../../utils/alert";
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import ErrorMessage from "../../../components/ErrorMessage";
import reduce from 'lodash/reduce';
import {AGENCY_CLUB_CONTENT_PAGE_FRAGMENT} from "../../../graphql/Agency/fragments";

const DFY_CONTENT = gql`
    query agencyClubDfyContents {
        result: agencyClubDfyContents {
            ...AgencyClubContentFragment
        }
    }
    ${AGENCY_CLUB_CONTENT_PAGE_FRAGMENT}
    
`

const MonthlyContentSummary = () => {

  const {data, error, loading} = useQuery(DFY_CONTENT);

  if(error) return <ErrorMessage error={error} />

  if(loading) return <Icon loading/>;

  return (
    <div >
      <h4 style={{marginBottom: '15px'}}><strong>Done For You Content</strong></h4>
      {map(data.result, block => (<ListItem block={block} />))}
      {data?.result?.length == 0 && 
      <div style = {{marginTop:18}}>
        No Search Result
      </div>}
    </div>
  );
}
export default MonthlyContentSummary;


const ListItem = ({ block }) => {
  return (
    <div className={cardStyles.Card} style={{padding: '15px', background: '#183055', color: 'white'}}>
      <div className={'grid'} style={{padding: '5px 0'}}>
        <div className={'col3 vertical-center'}>
          <img src={block.image_url} className={'img-fluid'} />
        </div>
        <div className={'col9 vertical-center'}>
          <h3 style={{marginTop:0}}>{block.niche}</h3>
          <div className={'grid'}>

              {(block.projects) ? (
                <div className={'col7'}>
                  <ProjectSelect projects={block.projects } />
                </div>
              ) : null}

              {(block.landing_pages) ? (
                <div className={'col5'} style={{paddingRight: 0, paddingLeft: 0}}>
                  <LandingPageSelect landingPages={block.landing_pages} />
                </div>
              ) : null}

          </div>

        </div>
      </div>
    </div>
  )
};

const TEMPLATES_QUERY = gql`
    query templatesById($ids: [ID!]!) {
        result: templatesById(includeIds: $ids) {
            id
            template_name
            title
        }
    }`;
const ProjectSelect = ({projects}) => {
  const {copyProject, getSharePageUrl} = useProjectCommands();

  const navigate = useNavigate();

  const {data, loading, error} = useQuery(TEMPLATES_QUERY, {
    variables: {
      ids: projects
    }
  })

  if(error) return <ErrorMessage error={error} />

  if(loading) return <Icon loading/>;

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

  const handleCopy = async (template) => {
    await copyConfirmed(
      'Project',
      async () => {
        try {
          const res = await copyProject({
            variables:{
              input: {
                projectId: parseInt(template.id),
                title: `${template.template_name} (copy)`,
                copyFromTemplate: true
              }
            }
          });
          navigate(projectPath({projectId: res.data.copyProject.id}))
        }catch(err){
          errorAlert({text: 'Unable to copy project'});
          console.error(err);
        }
      }
    );
  };

  return(
    <Menu menuButton={<MenuButton>Project Templates <Icon name={['fas', 'caret-down']} /></MenuButton>}>
      {map(data.result, project => (
        <SubMenu label={project.template_name} key={`subMenu-${project.id}`}>
          <MenuItem onClick={()=>previewProject(project.id)}>Preview Template</MenuItem>
          <MenuItem onClick={()=>showEmbedCode(project.id)}>Get Embed Code</MenuItem>
          {
            project.storage_path ? 
              <MenuItem onClick={()=>openInNewTab( getSharePageUrl(project) )}>Go To Share Page</MenuItem>
            : ""
          }
          <MenuItem onClick={() => handleCopy(project)}>Use This Template</MenuItem>
        </SubMenu>
      ))}
    </Menu>
  )
};


const LANDING_PAGES_QUERY = gql`
    query agencyClubLandingPagesById($ids: [ID!]!) {
        result: agencyClubLandingPagesById(includeIds: $ids) {
            id
            name
            convertri_url
            clickfunnels_url
            html_url
            preview_url
            image_url
        }
    }`;
const LandingPageSelect = ({landingPages}) => {
  const {data, loading, error} = useQuery(LANDING_PAGES_QUERY, {
    variables: {
      ids: landingPages
    }
  })

  if(error) return <ErrorMessage error={error} />

  if(loading) return <Icon loading/>;

  return(
    <Menu menuButton={<MenuButton>Landing Pages <Icon name={['fas', 'caret-down']} /></MenuButton>}>
      {map(data.result, page => (
        <SubMenu label={page.name} key={`subMenu-${page.id}`}>
          {(page.preview_url) ? <MenuItem onClick={()=>openInNewTab(page.preview_url)}>Preview</MenuItem> : null}
          {(page.convertri_url) ? <MenuItem onClick={()=>openInNewTab(page.convertri_url)}>Convertri Funnel</MenuItem> : null}
          {(page.clickfunnels_url) ? <MenuItem onClick={()=>openInNewTab(page.clickfunnels_url)}>ClickFunnels Funnel</MenuItem> : null}
        </SubMenu>
      ))}
    </Menu>
  )
};