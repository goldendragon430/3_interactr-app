import React, { useRef, useEffect, useContext } from 'react';
import ReactPlayer from 'react-player';
import styles from './NodePage.module.scss';
import InteractionEditor from '../../interaction/components/InteractionEditor';
import { useProject } from '../../../graphql/Project/hooks';
import Icon from '../../../components/Icon';
import { useSetState } from '../../../utils/hooks';
import { useParams } from 'react-router-dom';
import map from 'lodash/map';
import ElementContainer from '../../element/components/Element/ElementContainer';
import Emitter, { VIDEO_SCRUB } from '../../../utils/EventEmitter';
import debounce from 'lodash/debounce';
import { EventListener } from '../../../components/EventListener';
import { useInteractionRoute } from 'modules/interaction/routeHooks';
import { useInteractions } from '../../../graphql/Interaction/hooks';
import getAsset from '../../../utils/getAsset';
import { usePlayer } from '../../../graphql/LocalState/player';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import ErrorMessage from '../../../components/ErrorMessage';
import { INTERACTION_FRAGMENT } from '../../../graphql/Interaction/fragments';
import { motion } from 'framer-motion';
import { useNodeRoute } from '../routeHooks';
import {cache} from "../../../graphql/client";
import {GET_NODE} from "../../../graphql/Node/queries";
import {GET_INTERACTIONS} from "../../../graphql/Interaction/queries";


const PLAYER_QUERY = gql`
  query player {
    player @client {
      playing
      muted
      ready
      showGrid
    }
  }
`;

/**
 * The canvas is the area with the node background and elements that
 * can be moved and edited
 * @returns {null|*}
 * @constructor
 */
const NodeCanvas = () => {
  const { nodeId } = useParams();

  const node = cache.readFragment({
    id: `Node:${nodeId}`,
    fragment: gql`
        fragment NodeCanvasFragment on Node {
            id
            media_id
            background_color
        }
    `,
  });

  const media = cache.readFragment({
    id: `Media:${node.media_id}`,
    fragment: gql`
        fragment NodeCanvasMediaFragment on Media {
            id
            is_image
            url
            manifest_url
            thumbnail_url
            temp_storage_url
        }
    `,
  });

  const {id, background_color} = node;

  return (
    <>
      <ProjectBranding />

      <Elements  />
      <Grid />

      {!!media && !media.is_image && (
        <>
          <Player media={media} />
          <ReservedForPlayerControls />
        </>
      )}

      {media && !!media.is_image && (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'black',
            borderRadius: '10px'
          }}
        >
          <img src={media.thumbnail_url} className={'img-fluid'} />
        </div>
      )}

      {!media && <div style={{ background: background_color, height: '100%', width: '100%', borderRadius: '10px' }}>&nbsp;</div>}
    </>
  );
};
export default NodeCanvas;

/**
 * Important to keep this part of the app seperated from
 * anything else as the video scrub causes lots of re renders
 * @param media
 * @returns {JSX.Element|null}
 * @constructor
 */
const Player = ({ media }) => {
  let mediaPlayer = useRef('');

  const { data, loading, error } = useQuery(PLAYER_QUERY);

  const { updatePlayer } = usePlayer();

  if (loading || error) return null;

  const { playing, muted, ready } = data.player;

  // Skip to time in the video when the seek to event is fired
  const seekToEvent = (playedSeconds) => {
    // Fire the debounced scrub event
    seekTo(playedSeconds);
  };

  // Debounce the seek to func for performance
  const seekTo = debounce((percentage) => {
    mediaPlayer.seekTo(percentage);
  }, 100);

  return (
    <EventListener name={VIDEO_SCRUB} func={seekToEvent}>
      <ReactPlayer
        key={media.id}
        controls={false}
        onReady={() => updatePlayer('ready', true)}
        className={styles.player}
        ref={(player) => {
          // Strange bug with null getting passed in here and overriding the player
          // object. Checking the passed in value is ! null before we override the
          // player object seems to fix this.
          if (player) mediaPlayer = player;
        }}
        width="100%"
        height="100%"
        playing={playing}
        onPlay={() => updatePlayer('playing', true)}
        onPause={() => updatePlayer('playing', false)}
        onDuration={(duration) => updatePlayer('duration', duration)}
        onProgress={({ playedSeconds }) => updatePlayer('playedSeconds', playedSeconds)}
        url={getVideoUrl(media)}
        muted={muted}
        // Set the 100ms as that's the same as the animation time on the playhead so this makes
        // the playhead move nice and smooth
        progressInterval={100}
      />
    </EventListener>
  );
};

/**
 * Display the project branding image on the player
 * canvas.
 * @returns {null|*}
 * @constructor
 */
const PROJECT_QUERY = gql`
  query project($id: ID!) {
    project(id: $id) {
      id
      branding_image_src
    }
  }
`;
const ProjectBranding = () => {
  const { projectId } = useParams();
  const { data, loading, error } = useQuery(PROJECT_QUERY, { variables: { id: projectId } });

  if (loading) return <Icon loading />;

  if (error) return null;

  const { branding_image_src } = data.project;

  // If there's not branding image set we don't need to return anything
  if (!branding_image_src) return null;

  return (
    <img
      style={{ maxWidth: '100px', position: 'absolute', zIndex: '99', top: '10px', left: '10px' }}
      src={branding_image_src}
    />
  );
};

/**
 * Shows a message to the user at the bottom of the canvas that
 * warms them not to place elements at the bottom of the video
 * canvas as they may be show behind the player controls in the
 * live project
 * @returns {*}
 * @constructor
 */
const ReservedForPlayerControls = () => {
  const [project, _, { loading, error }] = useProject();

  if (loading || error) return null;

  const fontSize = project.base_width === 228 ? '9px' : '14px';

  return (
    <div className="reservedForPlayerControls">
      <p style={{ fontSize }}>Area Reserved For Player Controls</p>
    </div>
  );
};

/**
 * Show all elements on the canvas
 * @returns {JSX.Element}
 * @constructor
 */
function Elements() {
  const [nodeId, setNodeId] = useNodeRoute();

  const { loading, error, data } = useQuery(gql`query node($nodeId: ID!){
      result: node(id: $nodeId){
          id
          interactions {
              ...InteractionFragment
          }
      }
  }${INTERACTION_FRAGMENT}`, { variables: { nodeId }, fetchPolicy: 'cache-only' });

  if(loading || error) return null;

  const {interactions} = data.result;

  return (
    <div className={styles.elementsWrapper}>
      {map(interactions, (interaction) => (
        <InteractionEditor
          key={'interaction_key_' + interaction.id}
          className={styles.stacked}
          interaction={interaction}
        />
      ))}
      <div onClick={() => {setNodeId(nodeId)}} style={{ height: '100%', width: '100%' }}>
        &nbsp;
      </div>
    </div>
  );
}

/**
 * The media object has several different urls. this function will return
 * the one that should be used
 * @param url
 * @param compressed_url
 * @param manifest_url
 * @returns {*}
 */
const getVideoUrl = ({ url, temp_storage_url, manifest_url }) => {
  // The latest version of the encoded service sets the manifest url
  // when completed
  if (manifest_url) return manifest_url;


  if (url) return url;

  // If the video hasn't been encoded yet it has this
  return temp_storage_url;
};

export const Grid = () => {
  const { data, error, loading } = useQuery(PLAYER_QUERY);

  if (loading || error) return null;

  if (!data.player.showGrid) return null;

  return <img src={getAsset('/img/grid.png')} className={styles.gridOverlay} />;
};
