import React from 'react';
import PropTyeps from 'prop-types';
import gql from 'graphql-tag';
import ReactTooltip from 'react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import ContentLoader from 'react-content-loader';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import {
	setEditPopup,
	SHOW_EDIT_POPUP_MODAL,
} from '@/graphql/LocalState/editPopup';
import { Icon } from 'components';
import { Button } from 'components/Buttons';
import { MODAL_FRAGMENT } from '@/graphql/Modal/fragments';
import { setAddModal } from '@/graphql/LocalState/addPopup';
import ModalPreview from '../ModalPreview';

import styles from '../ModalPreview.module.scss';

export const SelectModal = ({ value, update }) => {
	const { projectId } = useParams();

	const openPopupSelectModal = () => {
		setAddModal({
			showSelectPopupTypeModal: true,
			projectId: parseInt(projectId),
		});
	};

	if (value) {
		return (
			<GetModalWithBody
				id={value}
				update={update}
				openPopupSelectModal={openPopupSelectModal}
			/>
		);
	}

	return <Body openPopupSelectModal={openPopupSelectModal} />;
};

SelectModal.propTypes = {
	value: PropTyeps.string,
};

const QUERY = gql`
	query modal($id: ID!) {
		modal(id: $id) {
			...ModalFragment
		}
	}
	${MODAL_FRAGMENT}
`;

const modalAnimations = {
	animate: { y: 0, opacity: 1 },
	initial: { y: 50, opacity: 0 },
	transition: { type: 'spring', duration: 0.2, bounce: 0.5, damping: 15 },
};

const GetModalWithBody = ({ id, openPopupSelectModal, update }) => {
	const { data, loading, error } = useQuery(QUERY, {
		variables: {
			id,
		},
	});

	if (error) return null;

	if (loading) {
		return (
			<motion.div {...modalAnimations}>
				<ContentLoader speed={2} width={460} height={310} viewBox='0 0 460 310'>
					{/* Only SVG shapes */}
					<rect x='0' y='16' rx='0' ry='0' width='120' height='30' />
					<rect x='270' y='18' rx='0' ry='0' width='170' height='26' />
					<rect x='0' y='56' rx='0' ry='0' width='440' height='220' />
					<rect x='0' y='286' rx='0' ry='0' width='140' height='26' />
					<rect x='150' y='286' rx='0' ry='0' width='140' height='26' />
				</ContentLoader>
			</motion.div>
		);
	}

	return (
		<>
			<Body modal={data?.modal} id={id} />
			<Preview
				modal={data.modal}
				update={update}
				openPopupSelectModal={openPopupSelectModal}
			/>
		</>
	);
};

const Preview = ({ modal, openPopupSelectModal, update }) => {
	const [showRemoveIcon, setShowRemoveIcon] = React.useState(false);

	const removeModal = async () => {
		console.log('clicked');
		try {
			await update({
				actionArg: null,
			});
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<motion.div
			{...modalAnimations}
			className='mb-2'
			style={{ position: 'relative' }}
			onMouseEnter={() => setShowRemoveIcon(true)}
			onMouseLeave={() => setShowRemoveIcon(false)}
		>
			<ModalPreview
				modal={modal}
				width={432}
				height={243}
				scale={0.6}
				update={update}
				disabled={true}
			/>
			<AnimatePresence>
				{showRemoveIcon && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<button
							className={styles.removeIcon}
							onClick={removeModal}
							data-tip='Remove Popup'
						>
							<ReactTooltip />
							<Icon
								icon='times'
								style={{
									color: 'black',
								}}
							/>
						</button>
					</motion.div>
				)}
			</AnimatePresence>
			<Button
				onClick={() =>
					setEditPopup({
						activeModal: SHOW_EDIT_POPUP_MODAL,
						modal,
					})
				}
				primary
				icon='edit'
				small
				style={{ marginTop: '10px' }}
			>
				Edit Popup
			</Button>
			<Button
				onClick={openPopupSelectModal}
				secondary
				icon='external-link'
				small
				style={{ marginTop: '10px' }}
			>
				Change Popup
			</Button>
		</motion.div>
	);
};

const Body = ({ modal, id, openPopupSelectModal }) => {
	if (modal) {
		const { name, background_animation } = modal;
		return (
			<div
				className={'clearfix'}
				style={{ marginBottom: '10px', position: 'relative' }}
			>
				<h3>{name}</h3>
				{background_animation && (
					<Button
						small
						icon='play'
						style={{ position: 'absolute', right: '18px', top: 0 }}
						onClick={() => {
							var event = new CustomEvent('preview_animation', {
								detail: 'Modal:' + id,
							});
							window.dispatchEvent(event);
						}}
					>
						Preview Animation
					</Button>
				)}
			</div>
		);
	}

	return (
		<>
			<Button
				// onClick={()=>window.dispatchEvent(event)}
				onClick={openPopupSelectModal}
				primary
				icon='external-link'
				small
				style={{ marginTop: '10px' }}
			>
				Choose Popup
			</Button>
		</>
	);
};
