import React, { useState } from 'react';

import { Icon } from 'components';
import { MediaLibraryFilters, MediaLibraryMediaList } from './index';
import { PageBody } from 'components/PageBody/PageBody';
import { dashboardPath } from 'modules/dashboard/routes';
import { setBreadcrumbs } from '@/graphql/LocalState/breadcrumb';
import { setPageHeader } from '@/graphql/LocalState/pageHeading';
import { UploadMediaButton } from '../UploadMediaButton';

const CRUMBS = [
	{ text: 'Dashboard', link: dashboardPath() },
	{ text: 'Media Library' },
];

/**
 * Render media library page
 * @returns {*}
 * @constructor
 */
export const MediaLibraryPage = () => {
	const [showMediaZone, setShowMediaZone] = useState(false);

	const onDoneUploadVideo = () => {};

	setBreadcrumbs(CRUMBS);

	setPageHeader('Media Library');

	return (
		<PageBody
			subnav={<div style={{ marginBottom: 15 }} />}
			right={
				<div>
					<UploadMediaButton
						mediaLibraryPage={true}
						show={showMediaZone}
						showUploadFileArea
						onDone={onDoneUploadVideo}
						toggleMediaZone={() => setShowMediaZone(!showMediaZone)}
					>
						<Icon name={'cloud-upload'} /> Upload New Media
					</UploadMediaButton>
				</div>
			}
		>
			<div className='grid'>
				<div className='col8' style={{ maxWidth: '960px' }}>
					<MediaLibraryMediaList />
				</div>
				<div className='col4'>
					<MediaLibraryFilters />
				</div>
			</div>
		</PageBody>
	);
};
