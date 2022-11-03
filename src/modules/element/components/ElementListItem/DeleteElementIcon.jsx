import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Swal from 'sweetalert2';

import { Icon } from 'components';
import { errorAlert } from 'utils';

import styles from '../ElementList/ElementList.module.scss';

export const DeleteElementIcon = ({ onDelete }) => {
	const [deleting, setDeleting] = useState(false);

	const handleDelete = () => {
		Swal.fire({
			title: 'Are you sure? ',
			text: 'Are you sure you want to delete this element?',
			icon: 'warning',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#ff6961',
			confirmButtonText: 'Delete',
		}).then(async (result) => {
			if(result.isConfirmed) {
				try {
					setDeleting(true);
					await onDelete();
				} catch (err) {
					console.error(err);
					errorAlert({ text: 'Unable to delete element' });
				}
				setDeleting(false);
			}
		});
	};

	return (
		<span className={styles.icon} data-tip={'Delete'} onClick={handleDelete}>
			{deleting ? <Icon loading /> : <Icon name={'trash-alt'} />}
		</span>
	);
};

DeleteElementIcon.propTypes = {
	onDelete: PropTypes.func.isRequired,
};
