import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import PreviewProjectButton from 'modules/project/components/PreviewProjectButton'
import Card from 'components/Card';
import Button from 'components/Buttons/Button';
import analytics from 'utils/analytics';
import moment from 'moment';
import MoveToFolderModal from './MoveToFolderModal'
import {useSetState} from "../../../utils/hooks";
import ProjectTitle from "./ProjectTitle";
import ProjectMeta from "./ProjectMeta";
import ProjectActions from "./ProjectActions";
import EmbedCodeModal from "./EmbedCodeModal";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import {projectPath} from "../routes";
import Label from "../../../components/Label";
import ReactTooltip from "react-tooltip";

const DEFAULT_ALLOWED_ACTIONS = [
    "copy",
    "delete",
    "changeFolder",
    "edit",
    "preview",
    "share"
];

/**
 * The single project card component to use project select/delete/copy/move to folder functionalities
 * @param project
 * @param refetchProjects
 * @returns {*}
 * @constructor
 */

const ProjectCard = ({ project, refetchProjects, currentImpressions, currentPlays, previousImpressions, previousPlays, allowedActions = DEFAULT_ALLOWED_ACTIONS }) => {

  const navigate = useNavigate();

  const goToProject = () => {
    const path = projectPath({projectId: project.id, library: 'open'});
    navigate(path);
  };

  return (
      <>
        <Card
          heading={<ProjectTitle project={project}/>}
          subHeading={<ProjectSubHeading project={project}/>}
          thumbnail={project.thumbnails}
          button={
            <Button primary onClick={goToProject}>
              Edit Project<Icon name={'arrow-right'} style={{marginLeft: 4}} />
            </Button>
          }
          meta={
            <ProjectMeta
              currentImpressions={currentImpressions}
              previousImpressions={previousImpressions}
              currentPlays={currentPlays}
              previousPlays={previousPlays}
              project={project}
            />
          }
          actions={
            <ProjectActions
              project={project}
              refetchProjects={refetchProjects}
              allowedActions={allowedActions}
            />
          }
        />

        <ReactTooltip  className="tooltip" />
      </>
  );
}

const ProjectSubHeading = ({project}) => {
  return <Label secondary tooltip={'Project Created'}>{moment.utc(project.created_at).fromNow()}</Label>
}
export default ProjectCard;
