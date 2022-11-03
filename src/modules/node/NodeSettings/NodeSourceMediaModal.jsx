import React from 'react';
import { useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { UploadMediaButton } from 'modules/media/components';
import { useProject } from '@/graphql/Project/hooks';
import { useNodeCommands } from '@/graphql/Node/hooks';
import { NodeSourceMediaList } from '../SourceMedia';
import {
	getNodeSettings,
	setNodeSettings,
	SHOW_NODE_SETTINGS_MODAL,
	SHOW_CHANGE_SOURCE_MEDIA_MODAL,
	SHOW_NODE_BACKGROUND_COLOR_MODAL,
} from '@/graphql/LocalState/nodeSettings';

export const NodeSourceMediaModal = ({ node }) => {
	const { activeModal } = useReactiveVar(getNodeSettings);
	const { updateNode } = useNodeCommands(node.id);
	const [project, , ,] = useProject();

	const onChange = (id) => {
		updateNode({
			background_color: '',
			media_id: Number(id),
		});
		setNodeSettings({
			activeModal: '',
		});
	};

	return (
		<Modal
			width={920}
			height={625}
			show={activeModal === SHOW_CHANGE_SOURCE_MEDIA_MODAL}
			onClose={() =>
				setNodeSettings({
					activeModal: '',
				})
			}
			heading={
				<>
					<Icon icon='image' />
					Your Media Library
				</>
			}
			onBack={() => {
				setNodeSettings({
					activeModal: SHOW_NODE_SETTINGS_MODAL,
				});
			}}
			submitButton={
				<>
					<Button
						icon='palette'
						right
						secondary
						onClick={() => {
							setNodeSettings({
								activeModal: SHOW_NODE_BACKGROUND_COLOR_MODAL,
							});
						}}
					>
						Use Background Color
					</Button>
					<UploadMediaButton
						project={project}
						onCompleted={(media) => onChange(media.id)}
					>
						<Icon name='cloud-upload' /> Upload New Media
					</UploadMediaButton>
				</>
			}
		>
			<div style={{ textAlign: 'left' }}>
				<NodeSourceMediaList onChange={onChange} projectId={project?.id} />
			</div>
		</Modal>
	);
};
