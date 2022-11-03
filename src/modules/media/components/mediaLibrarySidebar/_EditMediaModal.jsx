import Icon from 'components/Icon';
import React, { useState, useEffect } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
// import styles from './EditMediaModal.module.scss';
import PropTypes from 'prop-types';

const _props = {
	/** Data to be filtered , must be an objects */
	media: PropTypes.object.isRequired,
	/** Show video settings modal property(boolean) */
	show: PropTypes.bool.isRequired,
	/** Gets called hideModal */
	close: PropTypes.func.isRequired,
};

const EditMediaModal = ({ media, show, close }) => {
	const [newName, setNewName] = useState(media.name);

	const [isSaving, setIsSaving] = useState(false);

	// const dispatch = useDispatch();
	const handleSubmit = (e) => {
		// Prevent a page reload when the form
		// is submitted with the enter key
		e.preventDefault();

		// Set the button state to loading
		setIsSaving(true);

		// Dispatch update action to redux
		// dispatch( updateMediaItem (
		//     media.id,
		//     {name: newName},
		//     true,
		//     ()=>close()
		// ))
	};

	return (
		<Modal 
			show={show} 
			onClose={close} 
			height={215} 
			width={500}
			heading={
				<>
					<Icon name='cog' /> Rename Media Item
				</>
			}
			submitButton={
				<Button primary onClick={handleSubmit} icon='save' loading={isSaving}>
					Save
				</Button>
			}
		>
			<form onSubmit={handleSubmit}>
				<div className='form-control'>
					<label>Name</label>
					<input
						placeholder='Your video name'
						value={newName}
						type='text'
						autoFocus={true}
						onChange={(e) => setNewName(e.target.value)}
					/>
				</div>
			</form>				
		</Modal>
	);
};

EditMediaModal.propTypes = _props;
export default EditMediaModal;
