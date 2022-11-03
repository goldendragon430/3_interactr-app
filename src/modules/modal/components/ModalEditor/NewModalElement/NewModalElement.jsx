import React, { useState } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { getEditPopup } from '@/graphql/LocalState/editPopup';

import {
	someElements,
	TEXT_ELEMENT,
	BUTTON_ELEMENT,
	IMAGE_ELEMENT,
	FORM_ELEMENT,
	CUSTOM_HTML_ELEMENT,
} from 'modules/element/elements';
import ElementToolbar from 'modules/interaction/components/ElementToolbar';

export const NewModalElement = ({ tabAnimation }) => {
	
	const modalSubElements = someElements(
		TEXT_ELEMENT,
		BUTTON_ELEMENT,
		IMAGE_ELEMENT,
		FORM_ELEMENT,
		CUSTOM_HTML_ELEMENT
	);

	const els = map(modalSubElements, (el, key) => ({ ...el, type: key }));
	
	return (
		<motion.div {...tabAnimation}>
			<ElementToolbar
				canAddToGroup={false}
				elementsMeta={els}
			/>
		</motion.div>
	);
};

NewModalElement.propTypes = {
	tabAnimation: PropTypes.object.isRequired,
};
