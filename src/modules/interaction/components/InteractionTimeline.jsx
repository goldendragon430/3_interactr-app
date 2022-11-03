import React, {useContext} from 'react';
import { motion } from 'framer-motion';
import {Timeline, TimelineBar} from 'components/Timeline';
import filter from 'lodash/filter';
import {useParams} from 'react-router-dom';
import map from 'lodash/map';
import find from "lodash/find";
import timelineStyles from 'components/Timeline/Timeline.module.scss'
import gql from "graphql-tag";
import {INTERACTION_FRAGMENT} from "../../../graphql/Interaction/fragments";
import {useQuery} from "@apollo/client";
import {ELEMENT_GROUP_FRAGMENT} from "../../../graphql/ElementGroup/fragments";

const NODE_QUERY = gql`
    query node($nodeId: ID!){
        node(id: $nodeId) {
            id
            enable_interaction_layer
            interaction_layer_id
            interactions {
                ...InteractionFragment
            }
            element_groups {
                ...ElementGroupFragment
            }
        }
    }
    ${INTERACTION_FRAGMENT}
    ${ELEMENT_GROUP_FRAGMENT}
`;

const InteractionTimeline = ({duration})=>{
  const {nodeId} = useParams();

  const {data, loading, error} = useQuery(NODE_QUERY, {
    variables: {nodeId},
    fetchPolicy: "cache-only"
  })

  if(loading || error) return null;

  const {node: {interactions, element_groups}} = data;
  
  const filteredInteractions = filter(interactions , (interaction)=>{
    return (! interaction.element_group_id);
  });

  // Track interactions that belong to an element group in order to
  // toggle selected property of element group bar when an element that
  // belongs to that group is clicked 
  const elementGroupInteraction = groupId => filter(interactions, (interaction)=>{
    return (interaction.element_group_id == groupId);
  });

  const list = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, x: -5, scale: 0.7 },
		show: { opacity: 1, x: 0, scale: 1, transition: { type: 'ease-in' } },
	};

  return (
    // <motion.div initial='hidden' animate='show' variants={list}>
      <Timeline>
        {
          (! filteredInteractions.length && ! element_groups.length) ?
            <div><p style={{textAlign:'center'}}>To get started click "New Element" and drag a new element onto the canvas.</p></div> :
            <>
              {/* First show all interactions that have no element group */}
              {map(filteredInteractions, interaction => 
                <TimelineBar key={'timeline_bar_i_key_'+interaction.id} interaction={interaction}  />
              )}
              {/* Then we show the element group on the timeline instead of all the elements */}
              {map(element_groups, elementGroup => <TimelineBar key={'timeline_bar_e_key' + elementGroup.id} elementGroup={elementGroup} elementGroupInteractions={elementGroupInteraction(elementGroup.id)} /> )}
            </>
        }
      </Timeline>
    // </motion.div>
  );
};
export default InteractionTimeline;


function getInteractionTitle(interaction) {
  let title = interaction.element.name,
      {element_group: elementGroup} = interaction;

  if (elementGroup) {
    title += ` (${elementGroup.name})`
  }

  return title;
}

function htmlToText(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.textContent || el.innerText || '';
}


const NoTimeline = () => {
  return (
    <div className={timelineStyles.Timeline} style={{background: '#f3f6fd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <h2 style={{opacity: 0.8}}>
        <em>This node doesn't have any video media so the timeline is disabled</em>
      </h2>
    </div>
  )
};