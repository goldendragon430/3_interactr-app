import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import { ElementToolbarItem } from './ElementToolbarItem';
import { elements } from 'modules/element/elements';

import styles from './ElementToolbar.module.scss';

const props = {
	/** Whether to use the wizard or not like for modal elements */
	useWizard: PropTypes.bool.isRequired,
	/** Callback fired when not using the element wizard */
	onAdd: PropTypes.func,
	elementsMeta: PropTypes.array,
};

/**
 * The new element items. This is displayed as Icons that can be dragged
 * onto the canvas
 * @param useWizard
 * @param onAdd
 * @param elementsMeta
 * @returns {*}
 * @constructor
 */
const ElementToolbar = ({ canAddToGroup, onAdd, elementsMeta }) => {
	// Default to all elements if not passed as prop
	if (!elementsMeta) {
		elementsMeta = map(elements, (values, key) => {
			return { ...values, type: key };
		});
	}

	return (
		<>
			<div className={styles.ElementToolbar}>
				{map(elementsMeta, (element) => {
					return (
						<ElementToolbarItem
							key={element.type}
							element={element}
							onSelect={onAdd}
							canAddToGroup={canAddToGroup}
						/>
					);
				})}
			</div>
		</>
	);
};

ElementToolbar.propTypes = props;
ElementToolbar.defaultProps = {
	useWizard: false,
};

export default ElementToolbar;
