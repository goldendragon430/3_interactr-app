import React, { useState, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';

import {
	getEditPopup,
	setEditPopup,
	SHOW_EDIT_POPUP_MODAL,
} from '@/graphql/LocalState/editPopup';
import { errorAlert } from 'utils';
import { Button } from 'components/Buttons';
import { DynamicText, Icon, Modal } from 'components';
import { useModalCommands } from '@/graphql/Modal/hooks';
import { getModalForSaving } from '@/graphql/Modal/utils';
import { ModalEditor } from './ModalEditor';
import { NameElementModal } from './NameElementModal';
import { useNavigate, useParams } from "react-router-dom";
import { modalsPath } from 'modules/modal/routes';
import Emitter, {
  SAVE_MODAL_PAGE,
  MODAL_PAGE_SAVE_COMPLETE,
	MODAL_PAGE_SAVE_START
} from '../../../utils/EventEmitter';

export const EditPopupModal = () => {
	const [saving, setSaving] = useState(false);
	const { activeModal, modal } = useReactiveVar(getEditPopup);
	const { projectId, modalId } = useParams();
	const navigate = useNavigate();
	const { saveModal } = useModalCommands(modalId);
	
	useSaveModalEditorListener(modalId);
	
	const onClose = () => {
		navigate(modalsPath({projectId}));
		setEditPopup({
			activeModal: '',
			modal: null,
		});
	};

	const handleSave = async (payload) => {
		setSaving(true);
		try {
			await saveModal({
				variables: {
          input: getModalForSaving(modalId, payload.detail),
        },
			});
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to save modal' });
		} finally {
			setSaving(false);
			onClose();
		}
	};

	return (
		<Modal
			height={750}
			width={1400}
			show={activeModal === SHOW_EDIT_POPUP_MODAL}
			onClose={onClose}
			onBack={onClose}
			heading={
				<>
					<Icon name='list' /> Edit Popup
				</>
			}

			submitButton={
				<Button
					icon='edit'
					loading={saving}
					primary
					noMarginRight
					onClick={handleSave}
					onEnter={handleSave}
				>
					Save Changes
				</Button>
			}
		>
			<DynamicText />
			{
				modalId ? <ModalEditor modalId = {modalId}/> : null
			}
			<NameElementModal />
		</Modal>
	);
};

const useSaveModalEditorListener = (modalId) => {
  const {saveModal} = useModalCommands(modalId);

  useEffect(() => {
    const handleSaveEvent = async (payload) => {
      // Events emitted here for the UI indication that the
      // page is saving
      Emitter.emit(MODAL_PAGE_SAVE_START);
			
      saveModal({
        variables: {
          input: getModalForSaving(modalId, payload.detail),
        },
      })
        .then(() => {
          Emitter.emit(MODAL_PAGE_SAVE_COMPLETE);
        })
        .catch((err) => {
          console.error(err);
          errorAlert({
            title: 'Unable to save node',
            text:
              'An error occurred when trying to save your node. Please try again. If the problem persists please contact support.',
          });
        });
    };

    window.addEventListener(SAVE_MODAL_PAGE, (payload) => handleSaveEvent(payload));
    return window.removeEventListener(SAVE_MODAL_PAGE, handleSaveEvent);
  }, [modalId]);
};