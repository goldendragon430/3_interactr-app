import {playerVar, usePlayer} from "../../../graphql/LocalState/player";
import Icon from "../../../components/Icon";
import {InlineBooleanInput, Option, RangeInput} from "../../../components/PropertyEditor";
import React, {useEffect, useRef, useState} from "react";
import Time from "../../../components/Time";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import {useParams} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import DropImageZone from "../../media/components/DropImageZone";
import Modal from 'components/Modal';
import {useNodeCommands} from "../../../graphql/Node/hooks";
import Button from "../../../components/Buttons/Button";
import {errorAlert} from "../../../utils/alert";

const PLAYER_QUERY = gql`
    query player {
        player @client {
            playing
            muted
            duration
            playedSeconds
            showGrid
            clickThruMode
        }
    }
`;

const NODE_QUERY = gql`
    query node($id: ID!) {
        node(id: $id) {
            id
            duration
            media {
                id
                is_image
            }
        }   
    }
`;

const VideoControls = ()=>{
  const {nodeId} = useParams();

  const {loading, error, data} = useQuery(PLAYER_QUERY);

  const {loading: nodeLoading, error: nodeError, data: nodeData} = useQuery(NODE_QUERY, {variables: {id: nodeId}});

  const {updatePlayer} = usePlayer();

  const [showDurationModal, setShowDurationModal] = useState(false);

  if(loading || nodeLoading) return null;

  const {playing, muted, duration, playedSeconds, showGrid, clickThruMode} = data.player;

  const {media, duration: nodeDuration} = nodeData.node;

  const disabled = (!media || media.is_image);

  return (
    <div className="grid">
      <div className="col6">
        <h4 style={{display:'flex', alignItems: 'center'}}>
          <PlayIcon disabled={disabled} playing={playing} updatePlayer={updatePlayer} node={nodeData.node} playedSeconds={playedSeconds} />
          <MutedIcon disabled={disabled} muted={muted} updatePlayer={updatePlayer} />

          <span style={{paddingLeft: '15px'}}>
            <ReactTooltip />
            <VideoTime time={playedSeconds} />&nbsp;/&nbsp;
            <VideoTime time={duration} />
            {(!!nodeDuration && (
              <span style={{cursor: 'pointer'}} data-tip={'Edit Duration'} onClick={()=>setShowDurationModal(true)}>&nbsp;<Icon name={'clock'} /></span>
            ))}
          </span>
        </h4>
      </div>
      <div className="col4"  style={{display:'flex', alignItems: 'center', justifyContent:'flex-end',  paddingRight: '0'}}>
        <InlineBooleanInput
          value={clickThruMode}
          onChange={()=>updatePlayer('clickThruMode', ! clickThruMode)}
          label="Click Thru Mode"
        />
      </div>
      <div className="col2" style={{display:'flex', alignItems: 'center', paddingRight: '0', justifyContent:'flex-end'}}>
        <InlineBooleanInput
          value={showGrid}
          onChange={()=>updatePlayer('showGrid', ! showGrid)}
          label="Grid"
        />
      </div>
      <EditNodeDurationModal show={showDurationModal} onClose={()=>setShowDurationModal(false)} nodeDuration={nodeDuration}/>
    </div>
  )
};
export default VideoControls;


const VideoTime = ({time}) => {
  if(typeof time === 'undefined') return <Icon loading />;

  return <Time s={time} />;
};


const PlayIcon = ({updatePlayer, playing, node, playedSeconds}) => {
  const {duration} = node;
  const timer = useRef(null);

  const handlePlay = () => {
    if(!node.media) {
      timer.current = setInterval(()=>{
        const player = playerVar();
        updatePlayer('playedSeconds', player.playedSeconds + 0.100)
      }, 100);
    }

    updatePlayer('playing', true)
  };

  const handlePause = () => {
    if(!node.media) {
      clearInterval(timer.current);
    }
    updatePlayer('playing', false)
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      if(playing) {
        handlePause()
      }else {
        handlePlay()
      }
    }
  };

  /**
   * Comment this out because it trigger when you press space
   * in any text element atm
   */
  // useEffect(() => {
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [playing]);

  if(playing) return(
    <Icon
      name="pause-circle"
      size={'3x'}
      color={'#366fe0'}
      onClick={handlePause}
    />
  )

  return(
    <Icon
      name="play-circle"
      size={'3x'}
      color={'#366fe0'}
      onClick={handlePlay}
    />
  )
}

const MutedIcon  = ({disabled, updatePlayer, muted}) => {
  if(disabled) return(
    <span style={{paddingLeft: '15px'}}>
      <Icon
        name="volume-up"
        size={'1x'}
        style={{cursor: 'not-allowed'}}
      />
    </span>
  );

  if(muted) return(
    <span style={{paddingLeft: '15px'}}>
      <Icon
        name="volume-mute"
        size={'1x'}
        onClick={()=>updatePlayer('muted', false)}
      />
    </span>
  );

  return(
    <span style={{paddingLeft: '15px'}}>
      <Icon
        name="volume-up"
        size={'1x'}
        onClick={()=>updatePlayer('muted', true)}
      />
    </span>
  );
};

const EditNodeDurationModal = ({nodeDuration, onClose, show}) => {
  const {nodeId} = useParams();
  const [saving, setSaving] = useState(false)
  const {updateNode, saveNode} = useNodeCommands(nodeId);

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveNode({
        variables: {
          input: {id:nodeId, duration: nodeDuration}
        }
      });

      onClose();
    }catch(err){
      console.error(err);
      errorAlert({text: 'Unable to save node changes'})
    }
    setSaving(false);
  };

  return(
    <Modal
      show={show}
      height={275}
      onClose={onClose}
      heading={
        <>
          <Icon name="clock" /> Adjust Node Duration
        </>
      }
      submitButton={
        <Button primary icon={'save'} loading={saving} onClick={handleSave}>Save Changes</Button>
      }
    >
      <Option
        label="Node Duration (Secs)"
        value={nodeDuration}
        Component={RangeInput}
        onChange={value=>updateNode({duration: value})}
        max={200}
      />
    </Modal>
  )
};