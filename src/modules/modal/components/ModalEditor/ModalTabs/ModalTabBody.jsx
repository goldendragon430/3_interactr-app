import React from 'react';
import PropTypes from 'prop-types';

import { ModalProperties } from '../ModalProperties';
import { NewModalElement } from '../NewModalElement';
import { DragDropModalElementList } from 'modules/element/components/ElementList/DragDropModalElementList';

export const ModalTabBody = ({ activeTab, elements }) => {
	const tabAnimation = {
		animate: { y: 0, opacity: 1 },
		initial: { y: 25, opacity: 0 },
		transition: { type: 'spring', duration: 0.2, bounce: 0.5, damping: 15 },
	};

	switch (activeTab) {
		case 'properties':
			return <ModalProperties tabAnimation={tabAnimation} />;
		case 'elements':
			return <DragDropModalElementList tabAnimation={tabAnimation} elements={elements} />;
		case 'new-element':
			return <NewModalElement tabAnimation={tabAnimation} />;
	}
	return null;
};

ModalTabBody.propTypes = {
	activeTab: PropTypes.string.isRequired,
};
