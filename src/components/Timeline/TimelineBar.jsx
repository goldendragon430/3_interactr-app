import React, {useContext, useState, useEffect} from 'react';
import styles from './TimelineBar.module.scss';
import parentStyles from './Timeline.module.scss'
import TimelineDragResize from 'components/Timeline/TimelineDragResize';
import cx from 'classnames';
import {Checkbox, Option, TimeInput} from "../PropertyEditor";
import ReactTooltip from "react-tooltip";
import {useInteractionRoute} from "modules/interaction/routeHooks";
import Icon from "../Icon";
import {useElementGroupCommands} from "../../graphql/ElementGroup/hooks";
import {useElementGroupRoute, useElementRoute} from "modules/element/routeHooks";
import {usePlayer} from "../../graphql/LocalState/player";
import {timeFromSeconds} from "../../utils/timeUtils";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import {useParams} from 'react-router-dom'
import {useInteractionCommands} from "../../graphql/Interaction/hooks";
import {toast} from "react-toastify";
import {errorAlert} from "../../utils/alert";
import Emitter, {NODE_PAGE_SAVE_COMPLETE, NODE_PAGE_SAVE_START} from "../../utils/EventEmitter";


/**
 * Render the timeline bar as a interaction or element group bar
 * @param interaction
 * @param elementGroup
 * @param children
 * @returns {null|*}
 * @constructor
 */
const TimelineBar = ({interaction, elementGroup, elementGroupInteractions, children}) => {  
  if(interaction) {
    return <InteractionBar interaction={interaction}>{children}</InteractionBar>
  }

  if(elementGroup) {
    return (
      <ElementGroupBar 
        elementGroup={elementGroup}
        elementGroupInteractions={elementGroupInteractions}
      >
          {children}
      </ElementGroupBar>
    )
  }
  return null;
};
export default TimelineBar;


const NODE_QUERY = gql`
    query node($id: ID!) {
        node(id: $id) {
            id
            interaction_layer_id
        }
    }
`;

/**
 * If this is an interaction show the timeline bar wrapped with the interaction
 * data
 * @param interaction
 * @param children
 * @returns {*}
 * @constructor
 */
const InteractionBar = ({interaction, children}) => {
  const [activeInteraction, setActiveInteraction] = useInteractionRoute();
  const [activeElement, setActiveElement] = useElementRoute();

  const {saveInteraction} = useInteractionCommands(interaction.id);

  const {nodeId} = useParams();

  const {data, loading, error} = useQuery(NODE_QUERY, {
    variables: {id: nodeId},
    fetchPolicy:'cache-only'
  })

  const {updateInteraction} = useInteractionCommands(interaction.id);

  // timeIn: 0
  // timeOut: 34.56
  const handleUpdate = async  (data) => {
    updateInteraction(data);

  
    Emitter.emit(NODE_PAGE_SAVE_START);
    try {
      await saveInteraction({
        variables:{
          input:{
            ...{id: interaction.id},
            ...data
          }
        },
        // optimisticResponse: {
        //   __typename: "Mutation",
        //   updateInteraction: {
        //     ...interaction, ...data
        //   }
        // }
      });
    }catch(err){
      console.error(err);
      errorAlert({text: 'Unable to save node'})
    }
    setTimeout(()=>{
      //toast.dismiss();
      Emitter.emit(NODE_PAGE_SAVE_COMPLETE);
    }, 500)

  };


  if(loading || error) return null;

  const {node} = data;

  const selected = ( activeInteraction === interaction.id || activeElement === interaction.id );

  return (
    <div className={styles.TimelineBar}>
      <Bar
        id={interaction.id}
        name={interaction.element.name}
        onNameClick={setActiveElement}
        show_at_video_end={interaction.show_at_video_end}
        onBarClick={setActiveInteraction}
        timeIn={interaction.timeIn}
        timeOut={interaction.timeOut }
        selected={selected}
        onChange={handleUpdate}
      >{children}</Bar>
    </div>
  );
};


/**
 * Show the bar wrapped with the element group data
 * @param children
 * @param elementGroup
 * @returns {*}
 * @constructor
 */
const ElementGroupBar = ({children, elementGroup, elementGroupInteractions}) => {
  const [activeElementGroup, setActiveElementGroup] = useElementGroupRoute();
  const {saveElementGroup, updateElementGroup} = useElementGroupCommands(elementGroup.id);
  const [activeInteraction, _] = useInteractionRoute();
  const [selected, setSelected] = useState(false);

  // Track active element group and the active interaction that
  // belong to that element group 
  useEffect(() => {
    if (activeElementGroup && activeElementGroup == elementGroup.id) {
      setSelected(activeElementGroup == elementGroup.id)
    }

    if(activeInteraction && elementGroupInteractions.find(interaction => interaction.id == activeInteraction)) {
      setSelected(true)
    } else {
      setSelected(activeElementGroup == elementGroup.id)
    }
  }, [activeInteraction, activeElementGroup])

  const handleUpdate = async  (data) => {
    updateElementGroup(data);
    
    Emitter.emit(NODE_PAGE_SAVE_START);
    try {
      await saveElementGroup({
        variables:{
          input:{
            ...{id: elementGroup.id},
            ...data
          }
        },
        // optimisticResponse: {
        //   __typename: "Mutation",
        //   updateElementGroup: {
        //     ...elementGroup, ...data
        //   }
        // }
      });
    }catch(err){
      console.error(err);
      errorAlert({text: 'Unable to save node'})
    }
    setTimeout(()=>{
      // toast.dismiss();
      Emitter.emit(NODE_PAGE_SAVE_COMPLETE);
    }, 500)

  };

  return (
    <div className={styles.TimelineBar}>
      <Bar
        id={elementGroup.id}
        name={elementGroup.name}
        onNameClick={() => setActiveElementGroup(elementGroup.id)}
        show_at_video_end={elementGroup.show_at_video_end}
        onBarClick={() => setActiveElementGroup(elementGroup.id)}
        timeIn={elementGroup.timeIn}
        timeOut={elementGroup.timeOut}
        selected={selected}
        onChange={handleUpdate}
      >{children}</Bar>
    </div>
  );
};

/**
 * Render the bar
 * @param name
 * @param onNameClick
 * @param show_at_video_end
 * @param onBarClick
 * @param timeIn
 * @param timeOut
 * @param handleUpdate
 * @param id
 * @param selected
 * @param children
 * @returns {null|*}
 * @constructor
 */
const PLAYER_QUERY = gql`
    query player {
        player @client {
            duration
        }
    }
`;
const Bar = ({name, onNameClick, show_at_video_end, onBarClick, timeIn, timeOut, id, selected, children, isInteractionLayer, onChange}) => {
  const {data, loading, error} = useQuery(PLAYER_QUERY);
  const [state, setState] = useState({x: 0, y: 0, w: 10, h: 30, gotDimensions: false});

  if(loading || error) return null;

  const {duration} = data.player;


  /**
   * Messy hack because the timeline bar doesn't work if it can't find the wrapper
   * in the dom
   * @type {number}
   */
  const interval = setInterval(()=>{
    if(state.gotDimensions) clearInterval(interval);

    const dimensions = getDimensions(duration, timeIn, timeOut);

    if(dimensions) {
      clearInterval(interval)
      setState(dimensions);
    }

  }, 1000);


  const {x, y, w, h} = state;
  
  return(
    <>
      <ReactTooltip />
      <div className={parentStyles.elementName} onClick={()=>onNameClick(id)}>
        <small>
          <Icon name={'edit'}/>&nbsp;{name}
        </small>
      </div>
      <div className={parentStyles.bars}>
        { !!duration && (
          (! show_at_video_end) ?
            <TimelineDragResize
              key={id}
              pos={{x, y}}
              itemWidth={w}
              className={cx(styles.bar, {[styles.selected] : selected })}
              onClick={()=>onBarClick(id)}
              onChange={(from, to)=>onChange({ timeIn: parseFloat(from), timeOut: parseFloat(to) })}
              timelineDuration={duration}
            >
             <span style={{position: 'absolute', top: '7px', left : '1px', cursor: 'col-resize'}}><Icon name="grip-lines-vertical" /></span>
                {children}
             <span style={{position: 'absolute', top: '7px', right :'-4px', zIndex: 5, cursor: 'col-resize'}}><Icon name="grip-lines-vertical" /></span>
            </TimelineDragResize>
            :
            // Don't render a timeline bar if the show_at_Video_end toggle is set to true
            <TimelineDisabled isInteractionLayer={isInteractionLayer} />
        )}
      </div>
      <div className={parentStyles.startEndTime}>
        <div className={parentStyles.startEndTimeForm}>
          {
            (show_at_video_end) ?
              <small>-</small> :
              <small>{ timeFromSeconds(timeIn) }</small>
          }
        </div>
        <div className={parentStyles.startEndTimeForm}>
          {
            (show_at_video_end) ?
              <small>-</small> :
              <small>{ timeFromSeconds(timeOut) }</small>
          }
        </div>
        <div className={parentStyles.startEndTimeCheckbox}  style={{paddingLeft: '3px'}} data-tip={'Show When Video Ends'}>
          {!isInteractionLayer && <Checkbox value={show_at_video_end} onChange={val => onChange({"show_at_video_end": val})}/>}
        </div>
      </div>
    </>
  );
};

/**
 * Get the position of the timeline bar based on the time in and out
 * @param timelineDuration
 * @param $from
 * @param to
 * @returns {{w: number, x: number, h: number, y: number}}
 */
const getDimensions = (timelineDuration, $from , to) => {
  // Note: from and to are times in seconds
  $from = parseFloat($from);
  to = parseFloat(to);

  const timelineHolder = document.getElementById("axis-wrapper");

  if (!timelineHolder || !timelineDuration) {
    return null;
  }
  if (to > timelineDuration) {
    to = timelineDuration;
  }

  const ratio = timelineDuration / timelineHolder.offsetWidth;

  const x = !$from ? 0 : $from / ratio;
  const w = (to / ratio) - x;

  return {x, y: 0, w, h: 30};
};

/**
 * Timeline is disabled so show the user a message
 * @returns {*}
 * @constructor
 */
const TimelineDisabled = ({isInteractionLayer})=>{
  if(isInteractionLayer) {
    return <div className={styles.disabled}><small>TIMELINE DISABLED <em>(END CARDS WILL SHOW ON VIDEO END)</em></small></div>
  }

  return <div className={styles.disabled}><small>TIMELINE DISABLED <em>(SET TO SHOW ON VIDEO END)</em></small></div>
};
