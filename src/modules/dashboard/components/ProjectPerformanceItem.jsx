import React from 'react';
import cardStyles from "../../../components/Card.module.scss";
import {FocusableItem, Menu, MenuButton, MenuItem} from "@szhsin/react-menu";
import Icon from "../../../components/Icon";
import cx from "classnames";
import styles from "../../agency/components/ClientSummary.module.scss";
import ClientSummaryStat from "../../agency/components/ClientSummaryStat";
import moment from "moment";
import getAsset from "../../../utils/getAsset";
import {Link} from "react-router-dom";
import {projectPath} from "../../project/routes";
import {openInNewTab} from "../../../utils/helpers";
import {setPreviewProject} from "../../../graphql/LocalState/previewProject";
import {setProjectEmbedCode} from "../../../graphql/LocalState/projectEmbedCode";
import {percentage} from "../../../utils/numberUtils";
import isEmpty from "lodash/isEmpty";
import {useProjectCommands} from "../../../graphql/Project/hooks";

const ProjectPerformanceList = ({loading, data, project}) => {
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

  const projectImageUrl = project.image_url || getAsset('/img/no-thumb.jpg');

  return(
    <div className={cardStyles.Card} style={{padding: '15px', height: '100px'}}>
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
      <div className={'grid'}>
        <div className={cx(styles.column, 'col2')}>
          <img src={projectImageUrl} className={'img-fluid'} style={{borderRadius: '5px'}}/>
          <a style={{fontSize: '10px', textAlign: 'center', marginTop: '5px'}} onClick={()=>previewProject(project.id)}><Icon name={'play'} /> Preview</a>
        </div>
        <div className={cx(styles.column, 'col3')} style={{paddingLeft: 0}}>
          <p style={{marginBottom: '5px'}} className={'ellipsis'}>{project.title}</p>
          <p style={{fontSize: '14px', opacity: 0.8}}>
            <small className={'text-muted'}>No Folder</small>
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


