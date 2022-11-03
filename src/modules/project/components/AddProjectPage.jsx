import React, { useState, useEffect } from 'react';
import PageBody from 'components/PageBody';
import { useAuthUser } from '../../../graphql/User/hooks';
import Icon from '../../../components/Icon';
import ErrorMessage from '../../../components/ErrorMessage';
import { useAddProjectRoute } from 'modules/project/routeHooks';
import ProTemplates from './ProTemplates';
import { setBreadcrumbs } from '../../../graphql/LocalState/breadcrumb';
import { dashboardPath } from '../../dashboard/routes';
import { addProjectPath, projectsPath } from '../routes';
import SubNav from '../../../components/SubNav';
import DFYTemplatesPage from './DFYTemplatesPage';
import Button from '../../../components/Buttons/Button';
import { setAddProject } from '../../../graphql/LocalState/addProject';

/**
 * Page wrapper for adding a new project. Allows the user to select from a template
 * or create a  blank project.
 * @returns {*}
 * @constructor
 */
const AddProjectPage = () => {
	const [{ activeTab, page, title }, setActiveTab] = useAddProjectRoute();

	setBreadcrumbs([
		{ text: 'Dashboard', link: dashboardPath() },
		{ text: 'Projects', link: projectsPath() },
		{ text: 'Create New Project' },
	]);

	const setActiveSelectedTab = (activeTab) => setActiveTab(activeTab);

	return (
		<PageBody heading={<PageHeading />} subnav={<AddProjectPageSubnav />}>
			<div className='grid' style={{ paddingLeft: '15px' }}>
				<Templates activeTab={activeTab} />
			</div>
		</PageBody>
	);
};
export default AddProjectPage;

const PageHeading = () => {
	const showAddProjectModal = () => {
		setAddProject({
			show: true,
		});
	};

	return (
		<div style={{ marginBottom: '5px' }}>
			<Button primary icon={'plus'} onClick={showAddProjectModal}>
				Create Blank Project
			</Button>
			<span style={{ lineHeight: '38px' }}>Or Select A Template Below</span>
		</div>
	);
};

const AddProjectPageSubnav = () => {
	const items = [
		{
			text: 'Done For You Templates',
			icon: 'film',
			to: addProjectPath({ activeTab: 'dfy-templates', page: 1 }),
		},
		{
			text: 'Example Templates',
			icon: 'share-alt',
			to: addProjectPath({ activeTab: 'example-templates', page: 1 }),
		},
	];

	return <SubNav items={items} />;
};

/**
 * Switch between the different content body tabs
 * @param activeTab
 * @param user
 * @param onSelect
 * @param setActiveTab
 * @returns {null|*}
 * @constructor
 */
const Templates = ({ activeTab, user, onSelect, setActiveTab }) => {
	switch (activeTab) {
		case 'dfy-templates':
			return <DFYTemplatesPage />;
		case 'example-templates':
			return <ProTemplates user={user} onSelect={onSelect} />;
		default:
			return null;
	}
};
