import { useQuery } from '@apollo/client';
import {
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	SubMenu
} from '@szhsin/react-menu';
import first from 'lodash/first';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import { setPreviewProject } from '../../../graphql/LocalState/previewProject';
import { setProjectEmbedCode } from '../../../graphql/LocalState/projectEmbedCode';
import {
	useProjectCommands
} from '../../../graphql/Project/hooks';
import { GET_PROJECT_GROUPS } from '../../../graphql/ProjectGroup/queries';
import {
	copyConfirmed,
	deleteConfirmed
} from '../../../graphql/utils';
import { errorAlert, info, success } from "../../../utils/alert";
import { openInNewTab } from '../../../utils/helpers';
import { projectPath } from '../routes';

/**
 * Render the single project actions list - delete/copy/move to folder
 * @param project
 * @param refetchProjects
 * @param allowedActions
 * @returns {*}
 * @constructor
 */
const ProjectActions = ({ project, refetchProjects, allowedActions }) => {
	const [loading, setLoading] = useState(false);
	const { getSharePageUrl, moveProject, deleteProject, copyProject, publishProject } =
		useProjectCommands();
	const navigate = useNavigate();

	const {
		data: folders,
		loading: foldersLoading,
		error: foldersError,
	} = useQuery(GET_PROJECT_GROUPS, {
		fetchPolicy: 'cache-only',
	});

	const handlePublish = async (e) => {
    try {
      await publishProject({
        variables: {
          id: project.id
        }
      });
    }catch(err){
      console.error(err);
      info({
        title: 'Unable to Publish Project',
        text : first(err.graphQLErrors).debugMessage || err.message
      })
    }
  };

	const handleMoveToFolder = async (folderId) => {
		setLoading(true);

		try {
			const res = await moveProject({
				variables: {
					input: {
						id: parseInt(project.id),
						project_group_id: folderId,
					},
				},
			});
			setLoading(false);
			refetchProjects();
		} catch (error) {
			setLoading(false);
			console.error(error);
			errorAlert({
				title: 'Error',
				text: 'An error occurred trying to update the project. Please try again.',
			});
		}
	};

	const handleDelete = async () => {
		await deleteConfirmed('Project', async () => {
			setLoading(true);

			try {
				const res = await deleteProject({
					variables: {
						id: project.id,
					},
				});
				setLoading(false);
			} catch (err) {
				setLoading(false);
				errorAlert({ text: 'Unable to delete project' });
				console.error(err);
			}
		});
	};

	const handleCopy = async () => {
		await copyConfirmed('Project', async () => {
			setLoading(true);
			try {
				const res = await copyProject({
					variables: {
						input: {
							projectId: parseInt(project.id),
							title: `${project.title} (copy)`,
							folderId: parseInt(project.project_group_id),
							description: project.description,
						},
					},
				});
				navigate(projectPath({ projectId: res.data.copyProject.id }));
			} catch (err) {
				errorAlert({ text: 'Unable to copy project' });
				console.error(err);
				setLoading(false);
			}
		});
	};

	/**
	 * Updates the local storage values to show the
	 * preview project modal
	 * @param id
	 * @returns {*}
	 */
	const previewProject = (id) =>
		setPreviewProject({
			projectId: id,
			templateId: false,
			startNodeId: false,
		});

	/**
	 * Update the local storage show
	 * embed code value this opens
	 * the embed code modal for the
	 * project
	 * @param id
	 */
	const showEmbedCode = (id) => {
		setProjectEmbedCode({
			projectId: id,
		});
	};

	const goToProject = (id) => {
		const path = projectPath({ projectId: id, library: 'open' });
		navigate(path);
	};

	if (foldersLoading || loading) return <Icon loading />;

	const checkActionIsAllowed = (action = '') => {
		return indexOf(allowedActions, action) > -1;
	};

	return (
		<Menu
			menuButton={
				<MenuButton>
					<Icon name={'ellipsis-v'} style={{ marginRight: 0 }} />
				</MenuButton>
			}
		>
			{checkActionIsAllowed('edit') && (
				<MenuItem onClick={() => goToProject(project.id)}>
					<Icon name={'edit'} /> Edit Project
				</MenuItem>
			)}
			{project.migration_status > 1 && checkActionIsAllowed('preview') && (
				<MenuItem onClick={() => previewProject(project.id)}>
					<Icon name={'eye'} /> Preview Project
				</MenuItem>
			)}
			{project.migration_status > 1 && checkActionIsAllowed('copy') && (
				<MenuItem onClick={handleCopy}>
					<Icon name={'copy'} /> Copy Project
				</MenuItem>
			)}
			{project.migration_status > 1 && checkActionIsAllowed('share') && (
				<SubMenu label='Share Project'>
					<MenuItem onClick={() => showEmbedCode(project.id)}>
						<Icon name={'code'} /> Embed Code
					</MenuItem> 
					{
						project.storage_path ?
							<MenuItem onClick={() => openInNewTab(getSharePageUrl(project))}>
								<Icon name={'share-alt'} /> Share Page
							</MenuItem>
							: ""
					}
				</SubMenu>
			)}
			{project.migration_status > 1 && checkActionIsAllowed('changeFolder') && (
				<SubMenu label='Move To Folder'>
					{map(folders?.result, (folder) => {
						if (!folder.projectIds.includes(parseInt(project.id))) {
							return (
								<MenuItem
									onClick={() => handleMoveToFolder(parseInt(folder.id))}
								>
									&middot; {folder.title}
								</MenuItem>
							);
						}
					})}
					{!!project.project_group_id && (
						<MenuItem onClick={() => handleMoveToFolder(null)}>
							&middot; No Folder
						</MenuItem>
					)}
				</SubMenu>
			)}
			{checkActionIsAllowed('changeFolder') && (
				<MenuItem onClick={handlePublish}>
					<Icon name={'cloud-upload'} /> {project.migration_status < 2 ? "Migrate Project" : "Publish Project"}
				</MenuItem>
			)
			}
			<MenuDivider />
			{checkActionIsAllowed('delete') && (
				<MenuItem onClick={() => handleDelete()}>
					<Icon name={'trash-alt'} /> Delete Project
				</MenuItem>
			)}
		</Menu>
	);
};
export default ProjectActions;
