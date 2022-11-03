import React, { useState } from 'react';
import _sortBy from 'lodash/sortBy';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { FoldersList } from './FoldersList';
import { AddProjectGroupModal } from './AddProjectGroupModal';
import { useProjectGroups } from '@/graphql/ProjectGroup/hooks';

import styles from './FoldersManagementModel.module.scss';

export const ProjectGroupsButton = () => {
	const [showModal, toggleModal] = useState(false);
	return (
		<>
			<Button secondary onClick={() => toggleModal(true)}>
				<Icon name='bars' /> Manage Folders
			</Button>
			<ProjectGroupsModal show={showModal} toggle={toggleModal} />
		</>
	);
};

const ProjectGroupsModal = ({ show, toggle }) => {
	const [showAddGroupModal, toggleAddGroupModal] = useState(false);
	const [projectGroups, update, { loading, error }] = useProjectGroups();

	if (loading) return null;

	const folders = _sortBy(projectGroups, ['sort_order'], ['asc']);
	return (
		<>
			<Modal
				heading={
					<>
						<Icon name='plus' /> Manage Your Folders
					</>
				}
				height={585}
				width={460}
				show={show}
				onClose={() => toggle(false)}
				// customStyles={{ overflow: 'inherit' }}
				submitButton={
					<Button primary onClick={() => toggleAddGroupModal(true)}>
						<Icon icon='plus' /> Create New Folder
					</Button>
				}
			>
				{!projectGroups.length ? (
					<div className='grid'>
						<div className='col12'>
							<p>
								You haven't created any folders yet. Click{' '}
								<strong>Add New</strong> to create a new folder so you can
								organise your interactive videos.
							</p>
						</div>
					</div>
				) : (
					<>
						<p
							style={{
								marginTop: '0px',
								padding: '0 13px',
								marginBottom: '5px',
							}}
						>
							<small>
								Click and drag a folder re order them or click on a folder name
								to edit the name.
							</small>
						</p>
						<div className={styles.foldersRow}>
							<FoldersList folders={folders} />
						</div>
					</>
				)}
			</Modal>

			<AddProjectGroupModal
				show={showAddGroupModal}
				toggle={toggleAddGroupModal}
			/>
		</>
	);
};
