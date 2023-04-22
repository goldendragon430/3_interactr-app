import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NodePageLayout from './NodePageLayout';
//import MenuProvider from 'react-flexible-sliding-menu';
import { useQuery } from '@apollo/client';

import NodeEditor from './NodeEditor';
import { NodeActions } from '../NodeActions';
import { DynamicText, ErrorMessage, Icon, NotFoundPage } from 'components';
import { dashboardPath } from 'modules/dashboard/routes';
import { projectPath, projectsPath } from 'modules/project/routes';
import ElementGroupModal from 'modules/element/components/ElementGroupModal';
import ElementPropertiesMenu from 'modules/element/components/Properties/ElementProperties';
// import SelectPopupModals from 'modules/modal/components/SelectPopup/SelectPopupModals';
import SelectImageElementModal from 'modules/element/components/Properties/SelectImageElementModal';
import SelectInteractionModal from 'modules/interaction/components/SelectInteractionModal';
import { setBreadcrumbs } from '@/graphql/LocalState/breadcrumb';
import { setPageHeader } from '@/graphql/LocalState/pageHeading';
import { GET_NODE } from '@/graphql/Node/queries';

import styles from './NodePage.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { EditPopupModal } from '../../modal/components/EditPopupModal';
import AddMediaModals from 'modules/media/components/AddMediaModals';

export const NodePage = () => {
	const { projectId, nodeId } = useParams();

	useEffect(() => {
		setBreadcrumbs([
			{ text: 'Dashboard', link: dashboardPath() },
			{ text: 'Projects', link: projectsPath() },
			{ text: 'Project Canvas', link: projectPath({ projectId }) },
			{ text: 'Node' },
		]);

		setPageHeader('');
	}, []);

	const { loading, error, data } = useQuery(GET_NODE, {
		variables: { nodeId },
	});

	if (loading)
		return (
			<div style={{ padding: 30 }}>
				<Icon loading />
			</div>
		);

	if (error) return <ErrorMessage error={error} />;

	if (!loading && !data.result) {
		return <NotFoundPage />;
	}

	return (
		<>
			{/* <MenuProvider
				id={'elementMenu'}
				MenuComponent={ElementPropertiesMenu}
				zIndex={10}
				direction={'right'}
				width='540px'
				style={{ position: 'absolute' }}
			> */}
				<NodePageLayout
					actionsComponent={<NodeActions />} // The node page buttons
				>
					<DynamicText />
					<section className={styles.editor}>
						<NodeEditor />
					</section>
				</NodePageLayout>
			{/* </MenuProvider> */}
			<EditPopupModal />				
			<SelectImageElementModal />
			<ElementGroupModal />
			<SelectInteractionModal />
			{/* <SelectPopupModals /> */}
			<ElementPropertiesMenu />
			<AddMediaModals />
		</>
	);
};
