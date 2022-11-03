import React, {useState} from 'react';
import Card from 'components/Card';
// import { addProjectPath } from 'routeBuilders';
import PreviewProjectButton from 'modules/project/components/PreviewProjectButton';
import Icon from "../../../components/Icon";
import styles from "../../../components/Card.module.scss";
import _map from 'lodash/map';
import _find from 'lodash/find';
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import {useAuthUser} from "../../../graphql/User/hooks";
import {useAgencyCommands} from "../../../graphql/Agency/hooks";
import {useProjectTemplateCommands} from "../../../graphql/Project/hooks";
import {setProjectEmbedCode} from "../../../graphql/LocalState/projectEmbedCode";
import {useQuery} from "@apollo/client";
//import gql from "graphql-tag/src";
import {sharePageUrl} from "../../project/utils";
import {setPreviewProject} from "../../../graphql/LocalState/previewProject";
import {copyConfirmed} from "../../../graphql/utils";
import {projectPath} from "../../project/routes";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {errorAlert} from "../../../utils/alert";
import {useNavigate} from "react-router-dom";
import {setAddProject} from "../../../graphql/LocalState/addProject";
import Button from "../../../components/Buttons/Button";


export default function TemplateCard({
  template
}) {
  const { 
    id,
    downloadable_assets,
    showPreviewButton, 
    locked,
    description,
    large,
    video, 
    template_image_url,
    template_name } = template;
  // Allows us to show the preview project button on the templates
  const previewButton = showPreviewButton ? (
    <PreviewProjectButton projectId={template.id} secondary projectTemplate={template} color="#556aff" style={{width:'100%'}}>
      Preview
    </PreviewProjectButton>
  ) : false;

  const primaryButton = locked
    ? {
        text: 'Upgrade',
        icon: 'arrow-up',
        action: () => (window.location.href = '/upgrade')
      }
    : {
        text: 'Select',
        icon: 'plus',
        action: () => {
          setAddProject({
            show: true,
            templateId: template.id
          })
        }
      };


  const image = template_image_url ? template_image_url : 'http://via.placeholder.com/380x214';

  return (
    <Card
      large={large}
      button={<Button primary icon={primaryButton.icon} onClick={primaryButton.action}>{primaryButton.text}</Button>}
      title={template_name}
      description={description}
      images={image}
      previewButton={previewButton}
      downloadUrl={downloadable_assets}
      locked={locked}
      actions={<TemplateActionsButton template={template} />}
      // userIsClub={userIsClub}
      // userIsLocal={userIsLocal}
      // {...props}
      heading={template_name}
      thumbnail={image}
      meta={<TemplateMetaInfo template={template} />}
    />
  );
}

const TemplateMetaInfo = ({template}) => {

  const authUser = useAuthUser();
  const [loading, setLoading] = useState(false);
  const {likeTemplate} = useProjectTemplateCommands();
  let heartState = template?.isAuthUserLike ? ['fas', 'heart'] : ['far', 'heart'];

  const handleHeartClick = async (templateId) => {
      if (loading) return;
      setLoading(true);

      try {
          const res = await likeTemplate({
              variables: {
                  input: {
                      id: parseInt(templateId)
                  }
              }
          });
          setLoading(false);
      } catch (error) {
          setLoading(false);
          console.error(error);
      }
  };

  return (
    <ul className={styles.templateMetaInfo}>
      <li>

        {
           loading ? (<Icon loading />) : <Icon icon={heartState} onClick={() => {handleHeartClick(template.id)}}/>
        }
        <small>{template?.templateLikesCount ?? 0}</small>
      </li>

      <li
        data-tip={`Has ${template?.templateNodesCount ?? 0} Videos`}
      >
        <Icon name={['fab', 'youtube']} />
        <small>{template?.templateNodesCount ?? 0}</small>
      </li>

      <li
        data-tip={`Has ${template?.template_interactions ?? 0} Interactions`}
      >
        <Icon name={'share-alt'} />
        <small>{template?.template_interactions ?? 0}</small>
      </li>
    </ul>
  )
};

const TemplateActionsButton = ({template}) => {
 const {copyProject} = useProjectCommands();
 const navigate = useNavigate();

  /**
   * Updates the local storage values to show the
   * preview project modal
   * @returns {*}
   */
  const previewTemplate = () => {
      setPreviewProject({
          projectId: false,
          templateId: template.id,
          startNodeId: false
      });
  };

  /**
   * Update the local storage show
   * embed code value this opens
   * the embed code modal for the
   * project
   */
  const showEmbedCode = () => {
      setProjectEmbedCode({
          templateId: template.id
      });
  };

  const handleSharePage = () => {
      window.open(sharePageUrl({storage_path: template.storage_path}), '_blank');
  };

  const showAddProjectModal =  () => {
    setAddProject({
      show: true,
      templateId: template.id
    })
  }

  // const handleCopy = async () => {
  //     await copyConfirmed(
  //         'Project',
  //         async () => {
  //             try {
  //                 const res = await copyProject({
  //                     variables:{
  //                         input: {
  //                             projectId: parseInt(template.id),
  //                             title: `${template.template_name} (copy)`,
  //                             copyFromTemplate: true
  //                         }
  //                     }
  //                 });
  //                 navigate(projectPath({projectId: res.data.copyProject.id}))
  //             }catch(err){
  //                 errorAlert({text: 'Unable to copy project'});
  //                 console.error(err);
  //             }
  //         }
  //     );
  // };

  return (
    <Menu menuButton={<MenuButton><Icon name={'ellipsis-v'} style={{marginRight: 0}} /></MenuButton>}>
      <MenuItem onClick={showAddProjectModal}>Use Template</MenuItem>
      <MenuItem onClick={previewTemplate}>Preview Template</MenuItem>
      <SubMenu label="Share Template">
        <MenuItem onClick={showEmbedCode}>Embed Code</MenuItem>
        {
          template.storage_path ? <MenuItem onClick={handleSharePage}>Share Page</MenuItem> : ""
        }
      </SubMenu>
    </Menu>
    )
};