import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Icon } from 'components';
import { Option, TextInput } from 'components/PropertyEditor';
import { UploadMediaButton } from 'modules/media/components';
import { projectPath } from 'modules/project/routes';
import { useMediaLibraryRoute } from '../../routeHooks';
import { MediaDropArea } from './MediaDropArea';
import { MediaLibraryTabs } from './MediaLibraryTabs';
import { setAddMedia } from '@/graphql/LocalState/addMedia';
import { MediasTypeSelectorDropdown } from '../MediasTypeSelectorDropdown';

import filterInputStyles from 'components/FilterInput.module.scss';
import styles from './MediaLibrarySidebar.module.scss';
import menustyles from 'modules/element/components/Properties/ElementProperties.module.scss';
import elPropertiesStyles from 'modules/element/components/ElementPropertiesTabs.module.scss';
import cx from 'classnames';
import {delay} from "utils/timeUtils";

export const ALL_ACTIVE_TAB = 'all';
export const VIDEOS_ACTIVE_TAB = '0';
export const IMAGES_ACTIVE_TAB = '1';
export const TOGGLE_ON = true;

export const MediaLibraryContainer = () => {
	
	const { projectId } = useParams();
	const [search, setSearch] = useState('');
	const [show, setShow] = useState(false);

	useEffect(() => {
		(async () => {
			await delay(700);
			setShow(true);
		})();
		return () => {
			setShow(false);
		}
	}, []);

	const [{ isOpen, filterBy, orderBy, sortOrder }, setMediaRouteParams] = useMediaLibraryRoute();

	const handleDropFile = (files) => {
		setAddMedia({
			showUploadFromFileModal: true,
			droppedFiles: Array.from(files),
		});
	};
	
	return (
		<div className={cx(menustyles.menu, {[menustyles.slideIn]: (isOpen && show)})}>
			<div className={menustyles.header}>
				<div className={menustyles.close}>
					<Link to={projectPath({ projectId, library: false })}>
						<Icon name='arrow-to-right' size='2x' />
					</Link>
				</div>
				<h2 style={{ marginBottom: 0 }}>Project Media</h2>
				<p style={{ margin: 0 }}>
					<small>
						(Drag image or video onto the canvas to create a new node)
					</small>
				</p>
			</div>
			<div className={styles.mediaLibraryWrapper}>
				<div className={styles.mediaLibraryInner}>
					<div className={styles.buttons}>
						<UploadMediaButton>
							<Icon name='plus' /> Add New Media
						</UploadMediaButton>
					</div>
					<div className={elPropertiesStyles.headerWrapper}>
						<div
							style={{ display: 'flex', paddingBottom: 10, alignItems: 'end' }}
						>
							<div style={{ width: '50%', marginRight: 10 }}>
								<div className={filterInputStyles.wrapper}>
									<Option
										Component={TextInput}
										style={{ width: '100%', marginBottom: 0 }}
										value={search}
										placeholder='Search videos...'
										onChange={setSearch}
										onKeyPress={(e) =>
											e.key === 'Enter'
												? setMediaRouteParams({ q: e.target.value, filterBy })
												: null
										}
									/>
									<Icon
										name='search'
										style={{ marginLeft: 5 }}
										pointer
										onClick={() =>
											setMediaRouteParams({
												q: search,
												orderBy,
												sortOrder,
												filterBy,
											})
										}
									/>
								</div>
							</div>
							<div style={{ width: '50%', marginRight: 10 }}>
								<MediasTypeSelectorDropdown
									label={'Type:'}
									inline={true}
									filterBy={filterBy}
									onChange={(filterBy) => {
										setMediaRouteParams({ q: search, filterBy });
									}}
								/>
							</div>
						</div>
					</div>
					<div className={styles.listWrapper}>
						<MediaDropArea handleDropFile={handleDropFile}>
							<MediaLibraryTabs />
						</MediaDropArea>
					</div>
				</div>
			</div>
		</div>
	);
};
