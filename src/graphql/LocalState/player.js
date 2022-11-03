import {gql, makeVar} from "@apollo/client";
import {createLocalHook} from "../utils";

/**
 * Query the local cache for the player state. Stuff needs to be added in here and in the
 * player defaults to work.
 * @type {DocumentNode}
 */
export const PLAYER = gql`
    query player {
        result: player @client {
            playing
            muted
            duration
            playedSeconds
            ready
            showGrid
            clickThruMode
            activeModal
        }
    }
`;

/**
 * Defaults for the playerVar local cache object. Stuff needs to be added in here AND in the payer query
 * @type {ReactiveVar<{duration: number, playedSeconds: number, ready: boolean, playing: boolean, showGrid: boolean, muted: boolean}>}
 */
export const playerVar = makeVar({
  playing: false,
  muted: true,
  duration: 0,
  playedSeconds: 0,
  ready: false,
  showGrid: false,
  clickThruMode: false,
  activeModal: false
});


export const usePlayer = () => {
  const updatePlayer = (key, value) => {
    const oldData = playerVar();
    playerVar( { ...oldData, ...{[key]: value} })
  }

  return {updatePlayer};
};
