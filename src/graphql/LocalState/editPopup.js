import { makeVar } from '@apollo/client';

export const SHOW_EDIT_POPUP_MODAL = 'SHOW_EDIT_POPUP_MODAL';

export const EDIT_POPUP_INITIAL_DATA = {
	activeModal: '',
	modal: null,
};

export const getEditPopup = makeVar(EDIT_POPUP_INITIAL_DATA);

/**
 * Helper function to update data in the local var
 * @param newData
 */
export const setEditPopup = (newData) => {
	const oldData = getEditPopup();

	if (newData.modal) {
		// We want to ensure new data passed to this is merged
		// and doesn't override the whole object
		newData.modal = { ...oldData.modal, ...newData.modal };
	}

	const data = { ...oldData, ...newData };

	getEditPopup(data);
};
