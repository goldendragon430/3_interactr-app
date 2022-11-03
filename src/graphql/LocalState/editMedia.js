import { makeVar } from '@apollo/client';

export const SHOW_EDIT_MEDIA_MODAL = 'SHOW_EDIT_MEDIA_MODAL';

export const SHOW_REPLACE_MEDIA_MODAL = 'SHOW_REPLACE_MEDIA_MODAL';

export const getEditMedia = makeVar({
	activeModal: '',
	media: null,
});

export const setEditMedia = (newData) => {
	const oldData = getEditMedia();
	const data = { ...oldData, ...newData };
	getEditMedia(data);
};
