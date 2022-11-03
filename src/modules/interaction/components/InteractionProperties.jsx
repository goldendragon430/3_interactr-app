import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { Section, Option } from 'components/PropertyEditor';
import { SelectElementGroup } from 'modules/element/components/SelectElementGroup';
import TimelineProperties from 'modules/element/components/TimelineProperties';
import { useInteractionCommands } from '@/graphql/Interaction/hooks';

/**
 * Edit the properties of the interaction object
 * @returns {*}
 * @constructor
 */
const INTERACTION_QUERY = gql`
	query interaction($id: ID!) {
		interaction(id: $id) {
			id
			element_group_id
			show_at_video_end
			timeIn
			timeOut
			pause_when_shown
		}
	}
`;

const InteractionProperties = ({ tabAnimation }) => {
	const { interactionId } = useParams();

	const { data, error, loading } = useQuery(INTERACTION_QUERY, {
		variables: {
			id: interactionId,
		},
	});

	const { saveInteraction, updateInteraction } =
		useInteractionCommands(interactionId);

	if (loading || error) return null;

	const { interaction } = data;

	if (!interaction) return null;

	const {
		timeIn,
		timeOut,
		pause_when_shown,
		element_group_id,
		show_at_video_end,
	} = interaction;
	
	return (
		<motion.div {...tabAnimation}>
			<Section>
				<Option
					label='Element Group'
					value={element_group_id}
					onChange={(val) => {
						const { element, __typename, element_group_id, ...rest } = interaction;
						// Save this straight back to the BE because it can create bugs within the UI
						// if we don't
						if(val == '' && element_group_id == null)
							return;

						if(val == element_group_id)
							return;

						saveInteraction({
							variables: {
								input: { ...rest, ...{ element_group_id: parseInt(val) } },
							},
							optimisticResponse: {
								__typename: 'Mutation',
								updateInteraction: {
									...interaction,
									...{ element_group_id: parseInt(val) },
								},
							},
						});
					}}
					Component={SelectElementGroup}
				/>
				{
					// If the element doesn't have an element group we can set the time in / time out
					// here but if they have an element group the user needs to click edit group
					// and edit the time in / time out of the group
					element_group_id ? (
						<ElementHasGroupMessage />
					) : (
						<TimelineProperties
							showAtVideoEnd={show_at_video_end}
							timeIn={timeIn}
							timeOut={timeOut}
							pauseWhenShown={pause_when_shown}
							update={updateInteraction}
						/>
					)
				}
			</Section>
		</motion.div>
	);
};

export default InteractionProperties;

const ElementHasGroupMessage = () => {
	return (
		<motion.div style={{marginTop: '55px'}} animate={{opacity: 1}} initial={{opacity: 0}}>
			<div>
				<p>
					Timeline settings can't be changed when the element is linked to a
					group. You need to update the settings on the element group.
				</p>
			</div>
		</motion.div>
	);
};
