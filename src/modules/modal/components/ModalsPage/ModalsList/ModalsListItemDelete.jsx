import React, { useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

import { Icon } from 'components';
import { errorAlert } from 'utils/alert';
import { useModalCommands } from '@/graphql/Modal/hooks';
import {toast} from 'react-toastify'
export const ModalsListItemDelete = ({ id }) => {
	const [deleting, setDeleting] = useState(false);
	const { deleteModal } = useModalCommands();

	const handleDelete = () => {
		Swal.fire({
			title: 'Are you sure? ',
			text: 'Are you sure you want to delete this modal?',
			icon: 'warning',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#ff6961',
			confirmButtonText: 'Delete',
		}).then(async (result) => {
			if(result.isConfirmed) {
				try {
					setDeleting(true);
	
					await deleteModal({
						variables: {
							id,
						},
					});
					toast.success('Successfully deleted.')
				} catch (err) {
					console.error(err);
					errorAlert({ text: 'Unable to delete element' });
				}
				setDeleting(false);
			}
		});
	};
	return (
		<span
			style={{ cursor: 'pointer', marginRight: '15px' }}
			data-tip={'Delete'}
			onClick={handleDelete}
		>
			{deleting ? <Icon loading /> : <Icon name={'trash-alt'} />}
		</span>
	);
};

ModalsListItemDelete.propTypes = {
	id: PropTypes.string.isRequired,
};
