import React from "react";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import gql from "graphql-tag";
import Button from "../../../components/Buttons/Button";
import Icon from "../../../components/Icon";
import { BooleanInput, Option, TimeRangeInput } from "../../../components/PropertyEditor";
import InteractionTime from "../../interaction/components/InteractionTime";

const PLAYER_QUERY = gql`
    query player {
        player @client {
            duration
            playedSeconds
        }
    }
`;
/**
 * Manage the timeline properties used by either interactions or
 * element groups
 * @param showAtVideoEnd
 * @param timeIn
 * @param timeOut
 * @param pauseWhenShown
 * @param update
 * @returns {JSX.Element}
 * @constructor
 */
const TimelineProperties = ({showAtVideoEnd, timeIn, timeOut, pauseWhenShown, update}) => {
  const {data, loading, error} = useQuery(PLAYER_QUERY);

  if(loading || error) return null;

  const {duration, playedSeconds} = data.player;

  return(
    <motion.div style={{marginTop: '60px'}} animate={{opacity: 1}} initial={{opacity: 0}}>
      <InteractionTime
        label="Time in (mm:ss:ms)"
        fontSize={'100%'}
        showAtVideoEnd={showAtVideoEnd}
        value={timeIn}
        component={TimeRangeInput}
        onChange={(val)=>update("timeIn", val)}
        max={duration}
        actions={
          <div>
            <Button small primary  tooltip="Show at Current Video Time" onClick={()=>update("timeIn", playedSeconds)}>
              <Icon name={'stopwatch'} style={{'marginRight': 0}}/>
            </Button>
            <Button small primary tooltip="Show at video start" onClick={()=>update("timeIn", 0)}>
              <Icon name={'arrow-to-left'} style={{'marginRight': 0}}/>
            </Button>
          </div>
        }
      />
      <InteractionTime
        label="Time out (mm:ss:ms)"
        fontSize={'100%'}
        showAtVideoEnd={showAtVideoEnd}
        value={timeOut}
        component={TimeRangeInput}
        max={duration}
        onChange={(val)=>update("timeOut", val)}
        actions={
          <div>
            <Button small primary tooltip="Hide at Current Video Time" onClick={()=>update("timeOut", playedSeconds)} >
              <Icon name={'stopwatch'} style={{'marginRight': 0}}/>
            </Button>
            <Button small primary tooltip="Don't hide this element when video ends" onClick={()=>update("timeOut", duration  )}>
              <Icon name={'arrow-to-right'} style={{'marginRight': 0}}/>
            </Button>
          </div>
        }
      />
      <Option
        label="Show When The Video Ends"
        Component={BooleanInput}
        onChange={val=>update("show_at_video_end", val)}
        value={showAtVideoEnd}
      />
      <Option
        label="Pause The Video When Shown"
        Component={BooleanInput}
        onChange={val=>update("pause_when_shown", val)}
        value={pauseWhenShown}
      />
    </motion.div>
  )
};
export default TimelineProperties;