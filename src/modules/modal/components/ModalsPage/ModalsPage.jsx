import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';

import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import { ErrorMessage, Icon } from 'components';
import { setBreadcrumbs } from '@/graphql/LocalState/breadcrumb';
import { dashboardPath } from 'modules/dashboard/routes';
import { projectsPath } from 'modules/project/routes';
import { GET_MODALS } from '@/graphql/Modal/queries';
import { ModalsPageBody } from './ModalsPageBody';
import { EditPopupModal } from 'modules/modal/components/EditPopupModal';
import SelectImageElementModal from 'modules/element/components/Properties/SelectImageElementModal';

export const ModalsPage = () => {
	const { projectId } = useParams();

	useEffect(() => {
		setBreadcrumbs([
			{ text: 'Dashboard', link: dashboardPath() },
			{ text: 'Projects', link: projectsPath() },
			{ text: 'Project Popups' },
		]);
	}, []);

	const { data, loading, error } = useQuery(GET_MODALS, {
		variables: {
			project_id: parseInt(projectId),
		},
	});

	if (loading) return <Icon loading />;

	if (error) return <ErrorMessage error={error} />;

	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
				style={{ paddingLeft: '30px', paddingBottom: '30px' }}
				className={'clearfix'}
			>
				<EditPopupModal />
				<SelectImageElementModal />
				<ModalsPageBody data={data} />
			</motion.div>
		</AnimatePresence>
	);
};

