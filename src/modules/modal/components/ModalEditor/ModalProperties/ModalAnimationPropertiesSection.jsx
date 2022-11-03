import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';

import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import { ModalAnimationProperties } from './ModalAnimationProperties';
import { AccountUpgradeMessage } from './AccountUpgradeMessage';
import { Section } from 'components/PropertyEditor';
import { getAcl } from '@/graphql/LocalState/acl';

/**
 * The animation properties for the popup
 * @param modal
 * @param updateModal
 * @returns {*}
 * @constructor
 */
export const ModalAnimationPropertiesSection = () => {
	const acl = useReactiveVar(getAcl);

	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
			>
				<Section>
					{acl.canAccessCustomAnimations && <ModalAnimationProperties />}
					{!acl.isSubUser && !acl.canAccessCustomAnimations && (
						<AccountUpgradeMessage />
					)}
				</Section>
			</motion.div>
		</AnimatePresence>
	);
};
