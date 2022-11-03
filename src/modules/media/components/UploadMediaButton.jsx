import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { Button } from 'components/Buttons';
import {
	setAddMedia,
	SHOW_UPLOAD_TYPE_SELECT_MODAL,
} from '@/graphql/LocalState/addMedia';
import {
	getNodeSettings,
	setNodeSettings,
	SHOW_CHANGE_SOURCE_MEDIA_MODAL,
} from '@/graphql/LocalState/nodeSettings';

/**
 * Returns the upload media button and it's upload
 * type select modal
 *
 * @param small
 * @param project
 * @returns {*}
 * @constructor
 */
export const UploadMediaButton = ({ children }) => {
	/** Set the state for controlling visibility of the various upload modals */
	const { projectId } = useParams();
	const { activeModal } = useReactiveVar(getNodeSettings);

	const handleClick = () => {
		setAddMedia({
			activeModal: SHOW_UPLOAD_TYPE_SELECT_MODAL,
			previousModals: [], // clear this incase we have any old data in there
			newMediaObject: {
				project_id: parseInt(projectId),
			},
		});

		// Check if NodeSettings workflow has any active modals
		// If so, add NodeSourceMediaModal to the previous modals list
		// So we can come back to the NodeSettings workflow
		if (activeModal) {
			setNodeSettings({
				activeModal: '',
			});
			setAddMedia({
				previousModals: [SHOW_CHANGE_SOURCE_MEDIA_MODAL],
			});
		}
	};

	return (
		<React.Fragment>
			<Button primary onClick={handleClick}>
				{children}
			</Button>
		</React.Fragment>
	);
};

UploadMediaButton.propTypes = {
	children: PropTypes.arrayOf(PropTypes.node).isRequired,
};
