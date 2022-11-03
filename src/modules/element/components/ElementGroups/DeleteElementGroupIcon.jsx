import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import { errorAlert } from 'utils';
import { Icon } from 'components';
import { useElementGroupCommands } from '@/graphql/ElementGroup/hooks';

/**
 * GraphQL makes this a little messy we need to remove the item from the cache, then
 * remove the relation from the node and also remove the element group id for any
 * elements in this group
 * @param id
 * @returns {JSX.Element|null}
 * @constructor
 */
export const DeleteElementGroupIcon = ({ id }) => {
	const { deleteElementGroup } = useElementGroupCommands();
	const [deleting, setDeleting] = useState(false);

	const confirmDelete = async () => {
		try {
			setDeleting(true);
			await deleteElementGroup({ variables: { id } });
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to delete element group' });
		}
		setDeleting(false);
	}

	const handleDelete = () => {
		Swal.fire({
			title: 'Are you sure? ',
			text: 'This will delete the element group and all elements inside this group',
			icon: 'warning',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#ff6961',
			confirmButtonText: 'Delete',
		}).then((result) => {
			if(result.isConfirmed) {
				confirmDelete();
			}
		});
	};

	return (
		<small onClick={handleDelete} className='clickable'>
			{deleting ? <Icon loading /> : <Icon name={'trash-alt'} />}
		</small>
	);
};

DeleteElementGroupIcon.propTypes = {
	id: PropTypes.string.isRequired,
};
