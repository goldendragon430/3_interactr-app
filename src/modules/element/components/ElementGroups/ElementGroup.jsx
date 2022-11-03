import React from 'react';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

import { Element } from './Element';
import { ElementGroupHeader } from './ElementGroupHeader';
import DraggableElementGroup from '../DraggableElementGroup';

/**
 * Render an element group with the group name headings
 * and the elements list
 * @param groupId
 * @param interactions
 * @param elementGroups
 * @returns {*}
 * @constructor
 */
export const ElementGroup = ({ group, index }) => {
	const list = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<DraggableElementGroup
			group={group}
			index={index}
			header={<ElementGroupHeader name={group.name} id={group.id} />}
		>
			<AnimateSharedLayout>
				<motion.div
					initial='hidden'
					animate='show'
					variants={list}
					style={{ paddingBottom: '15px' }}
				>
					<AnimatePresence>
						{_map(group.interactions, (interaction, index) => (
							<motion.div
								key={interaction.id}
								initial={{
									opacity: 0,
									x: 50,
									transition: { type: 'ease-in', duration: 0.7 },
								}}
								animate={{
									opacity: 1,
									x: 0,
									transition: { type: 'ease-in', duration: 0.7 },
								}}
								exit={{
									opacity: 0,
									x: 0,
									transition: { type: 'ease-in', duration: 0.0 },
								}}
							>
								<Element interaction={interaction} index={index} />
							</motion.div>
						))}
					</AnimatePresence>
					{!group.interactions.length && (
						<div>
							<p>
								<small className={'muted'}>No Elements in this group</small>
							</p>
						</div>
					)}
				</motion.div>
			</AnimateSharedLayout>
		</DraggableElementGroup>
	);
};

ElementGroup.propTypes = {
	group: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
};
