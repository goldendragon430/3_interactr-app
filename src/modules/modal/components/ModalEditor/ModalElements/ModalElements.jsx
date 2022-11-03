import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import _map from 'lodash/map';

import { MODAL_ELEMENT_FRAGMENT } from '@/graphql/Modal/fragments';
import { DragDropModalElementList } from 'modules/element/components/ElementList/DragDropModalElementList';

export const ModalElements = ({ tabAnimation, elements }) => {
	return (
		<DragDropModalElementList elements={elements} tabAnimation={tabAnimation} />
	);
};

ModalElements.propTypes = {
	tabAnimation: PropTypes.object.isRequired,
	elements: PropTypes.array.isRequired,
};
