import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { projectPath } from '../../routes';
import { errorAlert, useSetState } from 'utils';
import { AddProjectModalBody } from './AddProjectModalBody';
import { useProjectCommands } from '@/graphql/Project/hooks';
import { getAddProject, setAddProject } from '@/graphql/LocalState/addProject';

/**
 * Popup modal form for creating a new project
 * @param show
 * @param toggle
 * @returns {null|*}
 * @constructor
 */
export const INITIAL_STATE = {
	title: '',
	description: '',
	project_group_id: null,
	base_width: 720,
};

export const AddProjectModal = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { templateId } = useReactiveVar(getAddProject);
	const [state, setState] = useSetState(INITIAL_STATE);
	const { createBlankProject, createProjectFromTemplate } = useProjectCommands();

	// Func to run when the modal is closed by clicking the back button or
	// the X at the top of the modal
	const onClose = () => {
		setState(INITIAL_STATE);
		setAddProject({
			show: false,
			templateId: false,
		});
	};

	const handleSubmit = async () => {
		try {
			let createdProject = {};

			setLoading(true);
			// If user selected template, create project from template
			if (templateId) {
				const {
					data: { createTemplateProject: project },
				} = await createProjectFromTemplate({
					variables: {
						input: {
							title: state.title,
							description: state.description,
							project_group_id: state.project_group_id,
							templateId: parseInt(templateId),
						},
					},
				});

				createdProject = project;
			} else {
				const {
					data: { createBlankProject: project },
				} = await createBlankProject({
					variables: {
						input: {
							...state,
							embed_width: state.base_width,
							project_group_id: state.project_group_id === 'noFolder' ? null : state.project_group_id,
						},
					},
				});
				createdProject = project;
			}

			setLoading(false);
			setState(INITIAL_STATE);
			setAddProject({
				show: false,
				templateId: false,
			});

			// Navigate user to the new project page after creation
			navigate(
				projectPath({
					projectId: createdProject.id,
					library: 'open',
				})
			);
		} catch (e) {
			setLoading(false);
			console.error(e);
			errorAlert({
				text: 'Unable to create new project. Please refresh the page and try again',
			});
		}
	};
	return (
		<AddProjectModalBody
			state={state}
			loading={loading}
			onClose={onClose}
			setState={setState}
			handleSubmit={handleSubmit}
		/>
	);
};
