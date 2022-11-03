import React from 'react';
import PropTypes from 'prop-types';

export const NoMedia = ({ message }) => {
	return (
		<div style={{ paddingLeft: '20px' }}>
			<p>{message}</p>
			<p>
				Click the add new media button above or drag and drop files onto here to
				add media.
			</p>
		</div>
	);
};

NoMedia.propTypes = {
	message: PropTypes.string.isRequired,
};
