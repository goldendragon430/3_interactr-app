import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { Icon } from 'components';
import { errorAlert } from 'utils';

import styles from '../ElementList/ElementList.module.scss';

export const CopyElementIcon = ({ onCopy }) => {
	const [copying, setCopying] = useState(false);

	const handleCopy = () => {
		Swal.fire({
			title: 'Are you sure? ',
			text: 'Are you sure you want to copy this element?',
			icon: 'info',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#366fe0',
			confirmButtonText: 'Copy',
		}).then(async (result) => {
			if(result.isConfirmed) {
				try {
					setCopying(true);
					await onCopy();
				} catch (err) {
					console.error(err);
					errorAlert({ text: 'Unable to copy element' });
				}
				setCopying(false);
			}
		});
	};

	return (
		<span className={styles.icon} data-tip={'Copy'} onClick={handleCopy}>
			{copying ? <Icon loading /> : <Icon name={'copy'} />}
		</span>
	);
};

CopyElementIcon.propTypes = {
	onCopy: PropTypes.func.isRequired,
};
