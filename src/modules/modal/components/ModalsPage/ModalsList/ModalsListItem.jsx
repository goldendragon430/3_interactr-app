import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import {
	setEditPopup,
	SHOW_EDIT_POPUP_MODAL,
} from '@/graphql/LocalState/editPopup';
import { Icon } from 'components';
import { Button } from 'components/Buttons';
import ModalPreview from '../../ModalPreview';
import { ModalsListItemStats } from './ModalsListItemStats';
import { ModalsListItemDelete } from './ModalsListItemDelete';
import { ModalsListItemCopy } from './ModalsListItemCopy';
import { modalPath } from 'modules/modal/routes';
import { useNavigate, useParams } from "react-router-dom";
import styles from '../ModalsPage.module.scss';

export const ModalsListItem = ({ modal, loading, stats }) => {
	const [showCopyModal, setShowCopyModal] = useState(false);
	const navigate = useNavigate();
	let {projectId} = useParams();
	const handlePreview = () => {
		var event = new CustomEvent('preview_animation', {
			detail: 'Modal:' + modal.id,
		});
		window.dispatchEvent(event);
	};

	const handleEdit = () => {
		const modalId = modal.id;
		navigate( modalPath({modalId, projectId}) );
		setEditPopup({
			activeModal: SHOW_EDIT_POPUP_MODAL,
			modal,
		});
	};
	
	const { id, created_at, name, background_animation } = modal;

	return (
		<>
			<ReactTooltip className='tooltip' />
			<div className={styles.preview}>
				<ModalPreview modal={modal} width={249} height={135} scale={0.33} disabled={true} />
			</div>
			<div className={styles.heading}>
				<h3
					style={{
						marginBottom: '5px',
						marginTop: background_animation ? '10px' : '30px',
					}}
				>
					{name}
				</h3>
				<div style={{ marginBottom: '10px', opacity: 0.8 }}>
					<small>Created {moment.utc(created_at).fromNow()}</small>
				</div>
				{background_animation && (
					<Button
						icon={'play'}
						small
						secondary
						onClick={handlePreview}
						tooltip={'Preview Animations (Not all popups will have animations)'}
					>
						Preview
					</Button>
				)}
			</div>
			<div className={styles.stats}>
				<h3 style={{ marginTop: '15px' }}>
					<strong>
						<ModalsListItemStats
							statKey={'modal_views_' + modal.id}
							stats={stats}
							loading={loading}
						/>
					</strong>{' '}
					<br />
					<span style={{ opacity: 0.8 }}>Views</span>
				</h3>
			</div>
			<div className={styles.stats}>
				<h3 style={{ marginTop: '15px' }}>
					<strong>
						<ModalsListItemStats
							statKey={'modal_interactions_' + modal.id}
							stats={stats}
							loading={loading}
						/>
					</strong>{' '}
					<br />
					<span style={{ opacity: 0.8 }}>Interactions</span>
				</h3>
			</div>
			<div className={styles.button}>
				<span
					onClick={() => setShowCopyModal(true)}
					style={{ cursor: 'pointer', marginRight: '15px' }}
					data-tip={'Copy Popup'}
				>
					<Icon name={'copy'} />
				</span>
				<span
					style={{ cursor: 'pointer', marginRight: '15px' }}
					data-tip={'Edit'}
					onClick={handleEdit}
				>
					<Icon name={'edit'} />
				</span>
				<ModalsListItemDelete id={modal.id} />
			</div>
			<ModalsListItemCopy
				idToCopy={id}
				show={showCopyModal}
				setShow={setShowCopyModal}
			/>
		</>
	);
};

ModalsListItem.propTypes = {
	modal: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	stats: PropTypes.arrayOf(PropTypes.object).isRequired,
};
