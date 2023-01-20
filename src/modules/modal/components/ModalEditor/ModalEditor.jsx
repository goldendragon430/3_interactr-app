import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Button } from 'components/Buttons';
import { InlineBooleanInput } from 'components/PropertyEditor';
import EditModalElement from '../EditModalElement';
import { ModalTabs } from './ModalTabs';
import { usePlayer } from '@/graphql/LocalState/player';
import { GET_MODAL } from '@/graphql/Modal/queries';
import ModalPreview from '../ModalPreview';
import Icon from "components/Icon";

import styles from '../ModalPage.module.scss';

const PLAYER_QUERY = gql`
	query player {
		player @client {
			showGrid
		}
	}
`;

export const ModalEditor = ({modalId}) => {
	const { updatePlayer } = usePlayer();
	const { loading, error, data } = useQuery(PLAYER_QUERY);
	
	const { loading: modalLoading, error: modalError, data:modalData} = useQuery(GET_MODAL, {
		variables: {
			id: modalId
		},
		// fetchPolicy: 'cache-only',
	});
	
	if (error || modalError) return null;
	if(loading || modalLoading) return <Icon loading />;

	const { showGrid } = data.player;
	
	const { base_width, base_height } = modalData.result.project;
	
	return (
		<>
			<div className={styles.leftSide}>
				<ModalPreview modal={modalData.result} width={base_width} height={base_height} />
				<div className={'grid'}>
					<div className='col6'>
						<Button
							secondary
							small
							icon='play'
							style={{ marginTop: '15px' }}
							onClick={() => {
								var event = new CustomEvent('preview_animation', {
									detail: 'Modal:' + modalData.result.id,
								});
								window.dispatchEvent(event);
							}}
						>
							Preview Animation
						</Button>
					</div>
					<div
						className='col6'
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							paddingTop: '10px',
						}}
					>
						<InlineBooleanInput
							value={showGrid}
							onChange={() => updatePlayer('showGrid', !showGrid)}
							label='Grid'
						/>
					</div>
				</div>
			</div>
			<div className={styles.rightSide}>
				<EditModalElement />
				<ModalTabs elements={modalData.result.elements} />
			</div>
		</>
	);
};
