import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import Emitter, {
	NODE_PAGE_SAVE_COMPLETE,
	NODE_PAGE_SAVE_START,
	TOGGLE_ELEMENT_GROUP_MODAL,
} from 'utils/EventEmitter';
import { ErrorMessage, Icon } from 'components';
import { Button, LinkButton } from 'components/Buttons';
import NodeCanvas from './NodeCanvas';
import VideoControls from './VideoControls';
import { elementPath } from '../../element/routes';
import { ElementsList } from 'modules/element/components/ElementList';
import InteractionTimeline from 'modules/interaction/components/InteractionTimeline';
import ModalCanvas from 'modules/modal/components/ModalCanvas';
import { ELEMENT_EDITOR_DOM_ID } from 'modules/interaction/utils';
import { GET_MODAL } from '@/graphql/Modal/queries';

import styles from './NodePage.module.scss';

const NODE_QUERY = gql`
	query node($id: ID!) {
		node(id: $id) {
			id
			media {
				id
				is_image
			}
		}
	}
`;
const PROJECT_QUERY = gql`
	query project($id: ID!) {
		project(id: $id) {
			id
			base_width
			base_height
			embed_width
			embed_height
			image_url
		}
	}
`;
const PLAYER_QUERY = gql`
	query player {
		player @client {
			clickThruMode
			activeModal
		}
	}
`;

const NodeEditor = () => {
	const { nodeId, projectId } = useParams();

	const { loading, error, data } = useQuery(NODE_QUERY, {
		variables: { id: nodeId },
		fetchPolicy: 'cache-only',
	});

	const {
		data: playerData,
		loading: playerLoading,
		error: playerError,
	} = useQuery(PLAYER_QUERY);

	const {
		loading: projectLoading,
		error: projectError,
		data: projectData,
	} = useQuery(PROJECT_QUERY, { variables: { id: projectId } });

	if (projectLoading || loading) return null;

	if (projectError || error) return <ErrorMessage error={error} />;

	const { base_width, base_height } = projectData.project;

	// Used to center align the player on the different widths
	let marginLeft = 720 - base_width;
	if (marginLeft) marginLeft = marginLeft / 2;

	const { clickThruMode, activeModal } = playerData.player;
	
	return (
		<div>
			<div>{/* This part will flyout and overlay the content when open */}</div>
			<div>
				<motion.div
					className={styles.playerWrapper}
					animate={{
						opacity: [0, 1],
						scale: [0.8, 1],
					}}
					transition={{ duration: 0.7 }}
				>
					<div
						id={ELEMENT_EDITOR_DOM_ID}
						className={styles.canvasWrapper}
						style={{
							height: base_height + 'px',
							width: base_width + 'px',
							marginLeft,
						}}
					>
						{!!clickThruMode && !!activeModal && <ShowModal id={activeModal} />}
						<NodeCanvas />
					</div>
				</motion.div>
				<motion.div
					animate={{
						opacity: [0, 1],
						x: [-15, 0],
					}}
					transition={{ duration: 0.7 }}
					className={styles.videoControls}
				>
					<VideoControls />
				</motion.div>
				<div className={styles.elementsTabs}>
					<ul className={'clearfix'}>
						<li>
							<h3>Elements</h3>
						</li>
						<li style={{ paddingRight: '15px' }}>
							<LinkButton
								primary
								small
								right
								to={elementPath({ projectId, nodeId, interactionId: 0 })}
							>
								<Icon icon={'plus'} /> New Element
							</LinkButton>
						</li>
						<li>
							<Button
								onClick={() => Emitter.emit(TOGGLE_ELEMENT_GROUP_MODAL)}
								small
								primary
								icon='plus'
							>
								New Group
							</Button>
						</li>
						<li style={{ float: 'right', paddingRight: '30px' }}>
							<SavingStatus />
						</li>
					</ul>
					<div className={cx(styles.elementsList)}>
						<ElementsList />
					</div>
				</div>
			</div>

			{
				<motion.div
					className={styles.timeline}
					animate={{
						opacity: [0, 1],
						y: [100, 0],
					}}
					transition={{ duration: 0.7 }}
				>
					<InteractionTimeline />
				</motion.div>
			}
		</div>
	);
};
export default NodeEditor;

const SavingStatus = () => {
	const [text, setText] = useState('-');
	const [savedTimeout, setSavedTimeout] = useState(false);
	const [resetStatusTimeout, setResetStatusTimeout] = useState(false);

	useEffect(() => {
		// Subscribe to the play head scrub event on mount
		Emitter.on(NODE_PAGE_SAVE_START, () => {
			setText('Saving...');
		});

		Emitter.on(NODE_PAGE_SAVE_COMPLETE, () => {
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
			Emitter.off(NODE_PAGE_SAVE_START);
			Emitter.off(NODE_PAGE_SAVE_COMPLETE);
		};
	}, []);

	return <span>{text}</span>;
};

const ShowModal = ({ id }) => {
	const { data, loading, error } = useQuery(GET_MODAL, {
		variables: { id },
	});

	if (loading) return <Icon loading />;

	if (error) {
		console.error(error);
		return null;
	}

	return (
		<div style={{ position: 'absolute', zIndex: 500 }}>
			<ModalCanvas modal={data.result} canPreview={false} />;
			{/* <NodeModalCanvas modal={data.result} />; */}
		</div>
	);
};
