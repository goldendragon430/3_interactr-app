// Vendor libs
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// Modules, custom libs, hooks etc...
import styles from './ProjectCanvasPage.module.scss';
// import MediaLibrarySidebar from '../../media/components/mediaLibrarySidebar/MediaLibrarySidebar';
import ErrorMessage from '../../../components/ErrorMessage';
import { useProject, useProjectCommands } from '../../../graphql/Project/hooks';
import { useMediaLibraryRoute } from 'modules/media/routeHooks';
import { assignProjectStartNode } from "../utils";

// Components
import Composer from '../../composer/components/Composer';
import AddNodeButton from '../../media/components/AddNodeButton';
import { MediaLibraryDrawer } from 'modules/media/components/mediaLibrarySidebar';
import Link from 'components/Link';
import Icon from 'components/Icon';
import Button from 'components/Buttons/Button';
import ProjectCanvasContext from './ProjectCanvasContext';
import { useCreateNode } from '@/graphql/Node/hooks';
import { useComposer } from '@/graphql/LocalState/composer';
import { applyZoom } from 'modules/composer/utils';
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../dashboard/routes";
import {projectsPath} from "../routes";
import YouTubePrompt from "../YouTubePrompt";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";
import {GET_PROJECT} from "../../../graphql/Project/queries";
import ContentLoader from "react-content-loader";
import AddNodeModals from "../../node/components/AddNode/AddNodeModals";
import { delay } from "utils/timeUtils"

const ProjectCanvasPage = () => {
  const {projectId} = useParams();

  const {updateStartNode} = useProjectCommands();
  
  const [shouldShowMediaDrawer, setShouldShowMediaDrawer] = useState(false);

  const {data, loading, error} = useQuery(GET_PROJECT, {variables: {projectId}});

  useEffect(()=>{
    (async () =>  {
      if(!loading) {
        await delay(700);
        setShouldShowMediaDrawer(true);
      }   
    })();

    setBreadcrumbs([
      {text: 'Dashboard', link: dashboardPath()},
      {text: 'Projects', link: projectsPath()},
      {text: 'Project Canvas'},
    ]);
  }, [])
  
  const [createNode] = useCreateNode({
    update(cache, { data: { createNode } }) {
      cache.modify({
        id: cache.identify(project),
        fields: { nodes: (prevNodes) => [...prevNodes, { __ref: `Node:${createNode.id}` }] },
      });
    },
    onCompleted(){
      //toggleLibrary(false);
    }
  });

  if (error) return <ErrorMessage error={error} />;

  if (loading) return <PageLoader />;

  const project = data.result;
  
  const activeNodeId = assignProjectStartNode(project);

  if(! project.start_node_id && activeNodeId) {
    updateStartNode(project.id, activeNodeId);
  }

  // TODO Handle this
  // function dropMediaOnCanvas(media, acceptedDrop) {
  //   const coords = applyZoom(acceptedDrop, zoom);
  //   const newNode = {
  //     project_id: parseInt(project.id),
  //     media_id: parseInt(media.id),
  //     name: `Node - ${media.name}`,
  //     posX: parseInt(pan.x + coords.x),
  //     posY: parseInt(pan.y + coords.y),
  //   };
  //   createNode(newNode);
  // }

  return (
    <>
      <AnimatePresence>
        <motion.div
          exit={preAnimationState}
          initial={preAnimationState}
          animate={animationState}
          transition={transition}
          style={{height:'100%', width: '100%'}}
        >
          <AddNodeModals project={project} />
          <YouTubePrompt nodes={project.nodes} />
          <div className={styles.canvas_body}>
            <OpenLibraryBtn shouldShowMediaDrawer={shouldShowMediaDrawer} />
            <div style={{ position: 'absolute', top: 0, left: '15px', zIndex: 100 }}>
              <AddNodeButton project={project} />
            </div>
            <ComposerWrapper project={project} />
            {/* {shouldShowMediaDrawer && <MediaLibraryDrawer />} */}
          </div>
        </motion.div>
      </AnimatePresence>
      </>
  );
};

export default ProjectCanvasPage;

/**
 * We use the shouldShowMediaDrawer param here from the parent state because
 * that sets to true when the drawer opens AFTER the delay. Without this
 * the button shows close library when the library is closed in the small windowed
 * before the delay
 *
 * @param shouldShowMediaDrawer
 * @returns {JSX.Element}
 * @constructor
 */
const OpenLibraryBtn = ({shouldShowMediaDrawer}) => {
  const [{isOpen}, toggleLibrary] = useMediaLibraryRoute();

  const open = (shouldShowMediaDrawer && isOpen);

  const buttonText = (open)  ? 'Close Media Library' : 'Open Media Library';

  const icon = (open) ? 'arrow-right' : 'image';

  const handleClick = () => {
    toggleLibrary( ! isOpen )
  };

  return (
    <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 100 }}>
      <Button
        secondary={!open}
        red={open}
        onClick={handleClick}
        icon={icon}>
        {buttonText}
      </Button>
    </div>
  );
};

const PageLoader = () => {
  return(
    <ContentLoader
      speed={2}
      width={1440}
      height={699}
      viewBox="0 0 1440 699"
    >
      {/*Add Node Button*/}
      <rect x="15" y="0" rx="3" ry="3" width="121" height="40" />
      {/* Zoom Buttons*/}
      <rect x="1250" y="0" rx="20" ry="20" width="150" height="35" />
      {/* Some Nodes*/}
      <rect x="200" y="250" rx="3" ry="3" width="150" height="85" />
      <rect x="400" y="100" rx="3" ry="3" width="150" height="85" />
      <rect x="400" y="400" rx="3" ry="3" width="150" height="85" />
      <rect x="630" y="250" rx="3" ry="3" width="150" height="85" />
      <rect x="900" y="50" rx="3" ry="3" width="150" height="85" />
      <rect x="900" y="250" rx="3" ry="3" width="150" height="85" />
      <rect x="900" y="450" rx="3" ry="3" width="150" height="85" />

      {/* Legend */}
      <rect x="15" y="659" rx="3" ry="3" width="650" height="40" />
      {/* Media Library Button */}
      <rect x="1250" y="659" rx="3" ry="3" width="190" height="40" />
    </ContentLoader>
  )
};

const ComposerWrapper = ({project}) => {
  return  <Composer project={project }  />;
};