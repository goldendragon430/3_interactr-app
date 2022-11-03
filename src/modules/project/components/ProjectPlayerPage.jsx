import React, { useEffect, useRef, forwardRef, useLayoutEffect } from 'react';
import { setBreadcrumbs } from '../../../graphql/LocalState/breadcrumb';
import { dashboardPath } from '../../dashboard/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { animationState, preAnimationState, transition } from '../../../components/PageBody';
import {
  projectPlayerChaptersPath,
  projectPlayerPlayingStatePath,
  projectPlayerSharingPath,
  projectsPath,
} from '../routes';
//import EmbedSettings from "./EmbedSettings";
import Button from '../../../components/Buttons/Button';
import ProjectPreview from './ProjectPreview';
import VideoThumbnailSelector from './VideoThumbnailSelector';
import { useProject, useSaveProject } from '../../../graphql/Project/hooks';
import BaseForm from '../../../components/BaseForm';
import SharingOnPlayerTabs from './ProjectSharingPage/SharingOnPlayerTabs';
import { Route, Routes } from 'react-router-dom';
import PlayerSettingsSubNav from './ProjectPlayerPage/PlayerSettingsSubNav';
import ProjectPlayerInitialState from './ProjectPlayerPage/ProjectPlayerInitialState';
import ErrorMessage from '../../../components/ErrorMessage';
import ContentLoader from 'react-content-loader';
import ContentLoaderContainer from '../../../components/ContentLoaderContainer';
import { toRoutePath } from '../../../routeBuilders';
import styles from './PlayerSettingsPage.module.scss';
import ProjectPlayerPlayingState from './ProjectPlayerPage/ProjectPlayerPlayingState';
import PlayerSharingSettings from './ProjectPlayerPage/PlayerSharingSettings';
import PlayerChaptersPage from './ProjectPlayerPage/PlayerChaptersPage';
import PlayerEvents from './ProjectPlayerPage/playerEvents';

const ProjectPlayerPage = () => {
  const [project, updateProject, { loading, error }] = useProject();
  
  setBreadcrumbs([
    { text: 'Dashboard', link: dashboardPath() },
    { text: 'Projects', link: projectsPath() },
    { text: 'Player Settings' },
  ]);

  if (loading) return <ContentLoaderContainer height={500} width={600} />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className={'grid'}>
      <div className={'col12'}>
        <PlayerSettingsSubNav />
      </div>
      <div className={'col12'}>
        <div style={{ marginLeft: '20px' }}>
          <PageBody project={project} updateProject={updateProject} />
        </div>
      </div>
    </div>
  );
};
export default ProjectPlayerPage;

/**
 * Abstract some stuff from the main page to main that component cleaner
 * @constructor
 */
const PageBody = ({ project, updateProject }) => {
  const [saveProject, { loading: saving }] = useSaveProject();
  const playerFrame = useRef();
  const playerEventsManager = useRef();

  useLayoutEffect(() => {
    window.addEventListener('message', handleMessageFromPlayer);
    return () => {
      window.removeEventListener('message', handleMessageFromPlayer);
    };

    /**
     * @param {MessageEvent} e */
    function handleMessageFromPlayer(e) {
      if (playerFrame.current) {
        // run logic
        const playerEvents = new PlayerEvents(playerFrame.current, e.origin);
        playerEvents.emit(PlayerEvents.events.SET_EDITING_MODE, true);
        playerEventsManager.current = playerEvents;
      }
    }
  }, [playerFrame]);

  useEffect(() => {
    if (playerEventsManager.current) {
      const { __typename, nodes, modals, ...projectData } = project;
      playerEventsManager.current.emit(PlayerEvents.events.UPDATE_SETTINGS, projectData);
      console.log('Emit ', projectData);
    }

  }, [project]);

  function updateEditingStatus(status) {
    playerEventsManager?.current?.emit(PlayerEvents.events.SET_EDITING_STATUS, status);
  }


  const handleSaveProject = () => {
    const { nodes, modals, ...projectData } = project;

    saveProject({ ...projectData });
  };

  const changeHandler = (name) => (val) => {
    if (typeof val === 'boolean') val = val ? 1 : 0;
    updateProject(name, val);
  };

  // This is a JSON object so a little more complex than the simple change handler
  const changePlayerSkinHandler =
    (name, options = false) =>
    (val) => {
      const { player_skin } = project;
      const setOptions = {};

      if (options && options.bigPlay) {
        setOptions.bigPlay = { ...player_skin.bigPlay };
        setOptions.bigPlay[name] = val;
      } else if (options && options.controls) {
        setOptions.controls = { ...player_skin.controls };
        setOptions.controls[name] = val;
      } else {
        setOptions[name] = val;
      }

      updateProject('player_skin', {
        ...player_skin,
        ...setOptions,
      });
    };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 style={{marginBottom: 10}}>Preview</h2>
        <ProjectPreview
          projectId={project.id}
          frameRef={playerFrame}
        />
      </div>
      <div className={styles.right}>
        <div className={'form-control'}>
          <AnimatePresence>
            <motion.div
              exit={preAnimationState}
              initial={preAnimationState}
              animate={animationState}
              transition={transition}
            >
              <Button right primary icon={'save'} loading={saving} onClick={handleSaveProject}>
                Save Changes
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
        <Routes>
          <Route
            path='/chapters'
            element={
              <PlayerChaptersPage
                project={project}
                update={updateProject}
                updateEditingStatus={() => {
                  updateEditingStatus(PlayerEvents.editingStatuses.CHAPTERS);
                }}
              />
            }
          />
          <Route
            path='/sharing'
            element={
              <PlayerSharingSettings
                project={project}
                update={updateProject}
                updateEditingStatus={() => {
                  updateEditingStatus(PlayerEvents.editingStatuses.SHARING);
                }}
              />
            }
          />
          <Route
            path='/playing'
            element={
              <ProjectPlayerPlayingState
                project={project}
                update={changeHandler}
                updateSkin={changePlayerSkinHandler}
                updateEditingStatus={() => {
                  updateEditingStatus(PlayerEvents.editingStatuses.PLAYING);
                }}
              />
            }
          />
          <Route 
            index
            element={
              <ProjectPlayerInitialState
                project={project}
                update={changeHandler}
                updateSkin={changePlayerSkinHandler}
                updateEditingStatus={() => {
                  updateEditingStatus(PlayerEvents.editingStatuses.INITIAL)
                }}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};
