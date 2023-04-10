import React from 'react';
import { FocusableItem, Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import cardStyles from "../../../components/Card.module.scss";
import Icon from "../../../components/Icon";
import { setPreviewProject } from "../../../graphql/LocalState/previewProject";
import { setProjectEmbedCode } from "../../../graphql/LocalState/projectEmbedCode";
import { useProjectCommands } from "../../../graphql/Project/hooks";
import getAsset from "../../../utils/getAsset";
import { openInNewTab } from "../../../utils/helpers";
import { percentage } from "../../../utils/numberUtils";
import styles from "../../agency/components/ClientSummary.module.scss";
import ClientSummaryStat from "../../agency/components/ClientSummaryStat";
import { projectPath } from "../../project/routes";

const ProjectPerformanceList = ({loading, data, project, projectGroups}) => {
  const {getSharePageUrl} = useProjectCommands();

  if(loading || isEmpty(data) ) return null;

  /**
   * Updates the local storage values to show the
   * preview project modal
   * @param id
   * @returns {*}
   */
  const previewProject = ( id ) => setPreviewProject({
    projectId: id,
    templateId: false,
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

  const navigate = useNavigate();
  const handleProjectCardClick = (e) => {
    navigate(projectPath({projectId: project.id}));
  }

  const projectImageUrl = project.image_url || getAsset('/img/no-thumb.jpg');

  const getProjectGroupName = (projectId) => {
    const projectGroup = projectGroups?.filter(group => group.id == projectId);
    if(projectGroup.length > 0) return projectGroup[0].title;
    return null;
  }

  return(
    <div className={cardStyles.Card} style={{padding: '15px', height: '100px', cursor: 'pointer'}} >
      <div style={{position:'absolute', top: '10px', right: '10px'}}>
        <Menu menuButton={<MenuButton><Icon name={'ellipsis-v'} style={{marginRight: 0}} /></MenuButton>}>
          <FocusableItem>
            {({ ref, closeMenu }) => (
              <Link
                ref={ref}
                to={projectPath({projectId: project.id})}
                onClick={({ detail }) =>
                  closeMenu(detail === 0 ? "Enter" : undefined)
                }
              >
                Go To Project
              </Link>
            )}
          </FocusableItem>
          <MenuItem onClick={()=>showEmbedCode(project.id)}>Get Embed Code</MenuItem>
          {
            project.storage_path ? 
              <MenuItem onClick={()=>openInNewTab( getSharePageUrl(project) )}>Go To Share Page</MenuItem>
            : 
              ""
          }
        </Menu>
      </div>
      <div className={'grid'} onClick={handleProjectCardClick}>
        <div className={cx(styles.column, 'col2')}>
          <img src={projectImageUrl} className={'img-fluid'} style={{borderRadius: '5px', maxHeight: '50px'}}/>
          <a style={{fontSize: '10px', textAlign: 'center', marginTop: '5px'}} onClick={(e)=>{ previewProject(project.id); e.stopPropagation();}}><Icon name={'play'} /> Preview</a>
        </div>
        <div className={cx(styles.column, 'col3')} style={{paddingLeft: 0}}>
          <p style={{marginBottom: '5px'}} className={'ellipsis'}>{project.title}</p>
          <p style={{fontSize: '14px', opacity: 0.8}}>
            <small className={'text-muted'}>{ getProjectGroupName(project.project_group_id) ? getProjectGroupName(project.project_group_id) : 'No Folder' }</small>
            <br/>
            <small className={'text-muted'}>{moment.utc(project.created_at).fromNow()}</small>
          </p>
        </div>
        <div className={cx(styles.column, 'col7')}>
          <div className={'grid'}>
            <div className={'col4'}>
              <ClientSummaryStat
                label={'Impressions'}
                loading={false}
                currentStat={  data.project_impressions_current[project.id]  }
                previousStat={  data.project_impressions_previous[project.id]  }
              />
            </div>
            <div className={'col4'}>
              <ClientSummaryStat
                label={'Plays'}
                loading={false}
                currentStat={data.project_views_current[project.id]}
                previousStat={data.project_views_previous[project.id]}
              />
            </div>
            <div className={'col4'}>
              <ClientSummaryStat
                label={'Play Rate'}
                loading={false}
                suffix={"%"}
                currentStat={ percentage( data.project_views_current[project.id], data.project_impressions_current[project.id] ) }
                previousStat={ percentage( data.project_views_previous[project.id], data.project_impressions_previous[project.id] ) }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default ProjectPerformanceList;


