import React, {useState} from 'react';
import {Option, TimeInput} from "../../../components/PropertyEditor";
import styles from './InteractionTime.module.scss';
import {usePlayer} from "../../../graphql/LocalState/player";
import {motion} from 'framer-motion'
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";

const PLAYER_QUERY = gql`
    query player {
        player @client {
            duration
        }
    }
`;
/**
 * Component for when using the interaction time in / time out. It just
 * checks for the showAtVideoEnd value and if that's true we just show
 * a - instead of the time component.
 * @param showAtVideoEnd
 * @param value
 * @param onChange
 * @param actions
 * @param component
 * @param props
 * @returns {*}
 * @constructor
 */
const InteractionTime = ({showAtVideoEnd, value, onChange, actions, component, ...props}) => {
  const {data, loading, error} = useQuery(PLAYER_QUERY);

  if(loading || error) return null;

  const {duration} = data.player;

  if(showAtVideoEnd) {
    // show_at_video_end set to true on the interaction so the user shouldn't be able to edit
    // the time in and time out
    const content = <small >-</small>;

      // If a label is passed in we need to also render this not just the -
    if(props.label) {
      return(
        <motion.div
          className="form-option"
          animate={{height: '41px', x: 0, opacity: 1}}
          inital={{height: '117px', x: 100, opacity: 0}}
          transition={{type: 'ease-in'}}
        >
          <label>{props.label}</label>
          {content}
        </motion.div>
      );
    }

    // Render without the label, this is for when it's shown on the timeline bar
    return <div style={{textAlign: 'center', marginTop: '5px'}}>{content}</div>;
  }


  // Add a default here if no component is passed in
  if(! component) {
    component = TimeInput;
  }

  return (
    <motion.div className={'clearfix'} animate={{height: '117px'}} inital={{height: '41px'}}>
      <Option
        value={value}
        Component={component}
        onChange={onChange}
        max={duration}
        {...props}
        small
      />
      <Actions actions={actions}/>
    </motion.div>
  );
};
export default InteractionTime;

/**
 * When shown on the interaction props the time has some helper actions shown as
 * buttons to make selecting the required time easier
 * @param actions
 * @returns {null|*}
 * @constructor
 */
const Actions = ({actions}) => {
  if(! actions) return null;

  return (
    <div className={styles.actions}>
      {actions}
    </div>
  );
};