import React, { useState, useEffect } from 'react';

import Emitter, {
	MODAL_PAGE_SAVE_COMPLETE,
	MODAL_PAGE_SAVE_START,
} from 'utils/EventEmitter';

export const ModalEditorSavingStatus = () => {
	const [text, setText] = useState('-');
	const [savedTimeout, setSavedTimeout] = useState(false);
	const [resetStatusTimeout, setResetStatusTimeout] = useState(false);

	useEffect(() => {
		// Subscribe to the play head scrub event on mount
		Emitter.on(MODAL_PAGE_SAVE_START, () => {
			setText('Saving...');
		});

		Emitter.on(MODAL_PAGE_SAVE_COMPLETE, () => {
			if (savedTimeout) {
				clearTimeout(savedTimeout);
			}

			setSavedTimeout(
				setTimeout(() => {
					setText('Saved!');
				}, 500)
			);

			if (resetStatusTimeout) {
				clearTimeout(resetStatusTimeout);
			}

			setResetStatusTimeout(
				setTimeout(() => {
					setText('-');
				}, 4000)
			);
		});

		// Unsunscribe on unmount
		return () => {
			Emitter.off(MODAL_PAGE_SAVE_START);
			Emitter.off(MODAL_PAGE_SAVE_COMPLETE);
		};
	}, []);

	return <span style={{ lineHeight: '36px' }}>{text}</span>;
};
