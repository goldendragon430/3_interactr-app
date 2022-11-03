import React from 'react';
import PropTypes from 'prop-types';

import { ModalAnimationPropertiesSection } from './ModalAnimationPropertiesSection';
import { ModalPropertiesSection } from './ModalPropertiesSection';
import { ModalCloseIconSection } from './ModalCloseIconSection';
import { ModalTimerPropertiesSection } from './ModalTimerPropertiesSection';

export const ModalPropertiesTabs = ({ activeTab }) => {
	switch (activeTab) {
		case 'properties':
			return <ModalPropertiesSection />;
		case 'close-icon':
			return <ModalCloseIconSection />;
		case 'animation':
			return <ModalAnimationPropertiesSection />;
		case 'timer':
			return <ModalTimerPropertiesSection />;
	}
	return null;
};

ModalPropertiesTabs.propTypes = {
	activeTab: PropTypes.string.isRequired,
};
