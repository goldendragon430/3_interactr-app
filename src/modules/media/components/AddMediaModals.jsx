import React from 'react';
import SelectUploadTypeModal from './uploadMedia/SelectUploadTypeModal';
import UploadFromFileModal from './uploadMedia/UploadFromFileModal';
import { errorAlert } from '../../../utils/alert';
import UploadFromUrlModal from './uploadMedia/UploadFromUrlModal';
import {
	ADD_MEDIA_VAR_INITIAL_DATA,
	getAddMedia,
	setAddMedia,
} from '../../../graphql/LocalState/addMedia';
import StockListModal from './uploadMedia/StockListModal';
import MediaLibraryModal from './uploadMedia/MediaLibraryModal';
import NewMediaNameModal from './uploadMedia/NewMediaNameModal';
import { useParams } from 'react-router-dom';
import { SelectVideoThumbnailModal } from './uploadMedia/SelectVideoThumbnailModal';
import { useReactiveVar } from '@apollo/client';
import last from 'lodash/last';
import dropRight from 'lodash/dropRight';

const AddMediaModals = () => {
	const { previousModals } = useReactiveVar(getAddMedia);

	const onClose = () => {
		setAddMedia(ADD_MEDIA_VAR_INITIAL_DATA);
	};

	const onBack = () => {
		const lastModal = last(previousModals);

		setAddMedia({
			activeModal: lastModal,
			previousModals: dropRight(previousModals, 1), // remove the last modal from array
		});
	};

	const onNext = (nextModal, currentModal) => {
		const _previousModals = previousModals.concat(currentModal);
		setAddMedia({
			activeModal: nextModal,
			previousModals: _previousModals,
		});
	};

	return (
		<>
			<SelectUploadTypeModal onClose={onClose} onNext={onNext} />
			<UploadFromFileModal onClose={onClose} onBack={onBack} onNext={onNext} />
			<UploadFromUrlModal onClose={onClose} onBack={onBack} onNext={onNext} />
			<StockListModal onClose={onClose} onBack={onBack} onNext={onNext} />
			<MediaLibraryModal onClose={onClose} onBack={onBack} onNext={onNext} />
			<SelectVideoThumbnailModal
				onClose={onClose}
				onBack={onBack}
				onNext={onNext}
			/>
			<NewMediaNameModal onClose={onClose} onBack={onBack} />
		</>
	);
};
export default AddMediaModals;
