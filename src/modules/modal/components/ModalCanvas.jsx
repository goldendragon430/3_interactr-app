import React from 'react';
import gql from 'graphql-tag';
import map from 'lodash/map';
import { useQuery } from '@apollo/client';

import ModalElementEditor from 'modules/element/components/ModalElementEditor';
import { MODAL_EDITOR_DOM_ID } from '../utils';
import ModalBackground from './ModalBackground';
import {useModalElementRoute} from "modules/modal/routeHooks";
import styles from './ModalPage.module.scss';

const PLAYER_QUERY = gql`
	query player {
		player @client {
			showGrid
			clickThruMode
		}
	}
`;

export const PreviewContext = React.createContext();

const ModalCanvas = ({ modal, preview, canPreview }) => {
	const [, , back] = useModalElementRoute();
	
	if (!modal) return null;
	
	const { elements } = modal;
	const { base_width, base_height } = modal.project;

	return (
		<>
			<div
				id={MODAL_EDITOR_DOM_ID}
				style={{
					height: base_height + 'px',
					width: base_width + 'px',
					position: 'relative',
					border: '1px solid #ccc',
				}}
			>
				<div className={styles.modalOverlay}>
					{/* Need to make the background colour editable here */}
					<PreviewContext.Provider value={canPreview}>
						<ModalBackground modal={modal} canPreview={canPreview}>
							<Elements elements={elements} preview={preview} />
							<div onClick={() => { back() } } style={{ height: '100%', width: '100%' }}>
								&nbsp;
							</div>
						</ModalBackground>
						<BackgroundImage preview={preview} baseWidth={modal.project.base_width}/>
					</PreviewContext.Provider>
				</div>
			</div>
		</>
	);
};
export default ModalCanvas;

const Elements = ({ elements, preview }) => {
	return map(elements, (modalElement) => (
		<ModalElementEditor
			key={modalElement.id}
			className={styles.stacked}
			modalElement={modalElement}
			preview={preview}
		/>
	));
};

const BackgroundImage = ({ preview, baseWidth }) => {
	const { data, error, loading } = useQuery(PLAYER_QUERY);
	// const { modalId } = useParams();

	if (loading || error) return null;

	const { clickThruMode } = data.player;

	// If we're in preview mode with the node
	// we need to stop this background showing
	// if (clickThruMode && !modalId && !preview) return null;
	if (clickThruMode && !preview) return null;

	const url = '/img/modal-page-bg-' + baseWidth + '.jpg';

	return (
		<img
			src={url}
			style={{ position: 'absolute', height: '100%', width: '100%' }}
		/>
	);
};
