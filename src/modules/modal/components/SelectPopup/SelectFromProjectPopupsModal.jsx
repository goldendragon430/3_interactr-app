import React, { useState } from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import { useQuery, useReactiveVar } from '@apollo/client';

import { errorAlert } from 'utils';
import { Modal } from 'components';
import ModalListItem from '../ModalListItem';
import PopupsLoading from './PopupsLoading';
import { GET_MODALS } from '@/graphql/Modal/queries';
import { getAddModal, setAddModal } from '@/graphql/LocalState/addPopup';

const SelectFromProjectPopupsModal = ({ onClose }) => {
	const [saving, setSaving] = useState(false);
	const [height, setHeight] = useState(742);
	const [width, setWidth] = useState(1122);

	const { showSelectFromProjectPopupsModal, newModalObject, projectId } =
		useReactiveVar(getAddModal);

	const goBack = () => {
		setAddModal({
			showSelectPopupTypeModal: true,
			showSelectFromProjectPopupsModal: false,
			newModalObject,
		});
	};

	const clickHandler = async (modal) => {
		setSaving(true);

		setAddModal({
			newModalObject: { ...modal },
			showSelectFromProjectPopupsModal: false,
			isPopupSelected: true,
			// showPopupNameModal: true
		});

		setSaving(false);
	};

	return (
		<>
			{
				showSelectFromProjectPopupsModal && 
				<Modal
					height={height}
					width={width}
					show={showSelectFromProjectPopupsModal}
					onClose={onClose}
					onBack={goBack}
					heading={'Select a Popup'}
				>
					{showSelectFromProjectPopupsModal && (
						<ModalBody
							saving={saving}
							setHeight={setHeight}
							setWidth={setWidth}
							clickHandler={clickHandler}
							projectId={projectId}
						/>
					)}
				</Modal>
			}
		</>
	);
};

export default SelectFromProjectPopupsModal;

const ModalBody = ({
	setHeight,
	setWidth,
	clickHandler,
	saving,
	projectId,
}) => {
	const { data, loading, error } = useQuery(GET_MODALS, {
		variables: {
			project_id: projectId,
			fetchPolicy: 'network-only'
		},
	});

	if (data && !size(data.result)) {
		setHeight(300);
		setWidth(500);
	} else {
		setHeight(742);
		setWidth(1122);
	}

	if (error) {
		return errorAlert({ text: 'Unable to retrieve popups' });
	}

	if (loading) {
		return <PopupsLoading />;
	}

	if (!size(data.result)) {
		return (
			<div
				className={'grid'}
				style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}
			>
				You have no popups in this project
			</div>
		);
	}

	return (
		<div
			className={'grid'}
			style={{ height: '575px', overflow: 'hidden', overflowY: 'scroll' }}
		>
			{map(data?.result, (modal) => (
				<ModalListItem
					modal={modal}
					clickHandler={(modal) => clickHandler(modal)}
					loading={saving}
				/>
			))}
		</div>
	);
};
