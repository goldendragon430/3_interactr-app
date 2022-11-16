import React, { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import gql from 'graphql-tag';
import cx from 'classnames';
import client from '@/graphql/client';

import { Icon, Modal, VideoPlayer } from 'components';
import { Option, TextInput } from 'components/PropertyEditor';
import { Button } from 'components/Buttons';
import { errorAlert } from 'utils/alert';
import { useMediaLibraryRoute } from '../../routeHooks';
import { MEDIA_LIBRARY_QUERY_PARAMS } from '../mediaLibrarySidebar/MediaLibraryTabs';
import { useMediaCommands } from '@/graphql/Media/hooks';
import { GET_MEDIAS } from '@/graphql/Media/queries';
import { setAddNode } from '@/graphql/LocalState/addNode';
import { useProjectCommands } from '@/graphql/Project/hooks';
import {
	setNodeSettings,
	SHOW_CHANGE_SOURCE_MEDIA_MODAL,
} from '@/graphql/LocalState/nodeSettings';
import {
	getAddMedia,
	setAddMedia,
	ADD_MEDIA_VAR_INITIAL_DATA,
	SHOW_MEDIA_NAME_MODAL,
} from '@/graphql/LocalState/addMedia';

import styles from './NewMediaSettingsModal.module.scss';

const NewMediaNameModal = ({ onClose, onBack }) => {
	const {
		newMediaObject,
		addingNode,
		replaceMedia,
		activeModal,
		previousModals,
	} = useReactiveVar(getAddMedia);

	// Using the name value directly on the newMediaObject causes performance
	// issues on text inputs so we need to use a local state var for it
	const [name, setName] = useState('');

	const [disabled, setDisabled] = useState(false);

	const [loading, setLoading] = useState(false);

	const { createMedia, saveMedia } = useMediaCommands();

	const [{ page, q }] = useMediaLibraryRoute();

	const { saveProject } = useProjectCommands();

	/** Warning this function is a beast lol **/
	const onSubmit = async () => {
		if (!name) {
			errorAlert({ text: 'The media has no name' });
			return;
		}

		setLoading(true);

		const { project_id, thumbnail_url, is_image, temp_storage_url, url } = newMediaObject;
		// const url = thumbnail_url ? thumbnail_url : '';
		const projectId = project_id ? project_id : 0;
		
		// added for media_size
		const imageTag = document.getElementById('add-media-preview-image');
		const mediaRatio = getVideoRatio(imageTag.width, imageTag.height);

		try {
			// This creates a media record in the DB, the next step will create the job for encoding IF required
			// this should make the BE much cleaner
			const req = await createMedia({
				variables: {
					input: {
						...{ name },
						thumbnail_url: thumbnail_url,
						...newMediaObject,
						project_id: projectId,
						media_size: mediaRatio
					},
				},
				update(cache, { data: { createMedia } }) {
					const variables = {
						...MEDIA_LIBRARY_QUERY_PARAMS,
						...{
							page: parseInt(page),
							q,
							project_id: parseInt(createMedia.project_id),
						},
					};

					const query = client.readQuery({
						query: GET_MEDIAS,
						variables,
					});

					if (createMedia.project_id) {
						const project = client.readFragment({
							id: 'Project:' + createMedia.project_id,
							fragment: gql`
								fragment ProjectFragment on Project {
									id
									image_url
								}
							`,
						});

						// Checks if the current project has a thumbnail
						// If not, assigns the new media objects thumbnail as the project thumbnail
						if (!project.image_url) {
							saveProject({
								variables: {
									input: {
										id: project.id,
										image_url: createMedia.thumbnail_url,
									},
								},
							});
						}
					}

					// We only need to update the query if we actually have the query in the cache otherwise
					// we can ignore this part
					if (query) {
						const { result } = query;

						const newResult = {
							paginatorInfo: result['paginatorInfo'],
							data: [createMedia, ...result['data']],
						};

						client.writeQuery({
							query: GET_MEDIAS,
							variables,
							data: {
								result: newResult,
							},
						});
					}
				},
			});

			if (addingNode) {
				setAddNode({
					showNameSelectModal: true,
					newNodeObject: {
						media_id: parseInt(req.data.createMedia.id),
					},
					staticNode: !!req.data.createMedia.is_image,
				});
			}

			// If we activated the AddMedia workflow through NodeSettings
			// That means we initially added SHOW_CHANGE_SOURCE_MEDIA_MODAL to previousModals
			// This let's us go back to the NodeSourceMediaModal
			if (previousModals.includes(SHOW_CHANGE_SOURCE_MEDIA_MODAL)) {
				setNodeSettings({
					activeModal: SHOW_CHANGE_SOURCE_MEDIA_MODAL,
				});
			}

			// Everything done so lets cleanup
			setAddMedia(ADD_MEDIA_VAR_INITIAL_DATA);
			setLoading(false);
			setName('');
		} catch (e) {
			console.error(e);
			errorAlert({ text: 'Error creating new media' });
			setLoading(false);
		}
	};

	const onSave = async () => {
		setLoading(true);

		// added for media_size
		const imageTag = document.getElementById('add-media-preview-image');
		const mediaRatio = getVideoRatio(imageTag.width, imageTag.height);

		try {
			const req = await saveMedia({
				variables: {
					input: {
						...newMediaObject,
						...{ name },
						media_size: mediaRatio
					},
				},
			});

			setAddMedia(ADD_MEDIA_VAR_INITIAL_DATA);
			setLoading(false);
			setName('');
			setDisabled(false);
		} catch (e) {
			console.error(e);
			errorAlert({ text: 'Error replacing media' });
			setLoading(false);
		}
	};

	const reset = () => {
		setLoading(false);
		setName('');
		setDisabled(false);
	};

	const _onBack = () => {
		reset();
		onBack();
	};

	const _onClose = () => {
		reset();
		onClose();
	};

	useEffect(() => {
		if (replaceMedia && replaceMedia.name) {
			setName(replaceMedia.name);
			setDisabled(true);
		}
	}, [newMediaObject, replaceMedia]);

	return (
		<Modal
			height={450}
			width={900}
			show={activeModal === SHOW_MEDIA_NAME_MODAL}
			closeMaskOnClick={false}
			heading={
				<>
					<Icon name={'text'} /> Media Name
				</>
			}
			onClose={_onClose}
			onBack={_onBack}
			submitButton={
				<Button
					primary
					onClick={replaceMedia ? onSave : onSubmit}
					icon={'plus'}
					loading={loading}
				>
					Add New Media
				</Button>
			}
		>
			<div className={'grid'} style={{ maxHeight: 265, overflow: 'hidden' }}>
				<div className={'col6'}>
					<label>Media Preview</label>
					<MediaPreview media={newMediaObject} />
				</div>
				<div className={'col6'} style={{ paddingTop: 90 }}>
					<MediaName
						onEnter={onSubmit}
						name={name}
						setName={setName}
						disabled={disabled}
					/>
				</div>
			</div>
		</Modal>
	);
};
export default NewMediaNameModal;

const MediaName = ({ onEnter, name, setName, disabled }) => {
	return (
		<Option
			label='Give your new media a name'
			value={name}
			Component={TextInput}
			placeholder='My New Media'
			onChange={(val) => setName(val)}
			onEnter={onEnter}
			disabled={disabled}
		/>
	);
};

const MediaPreview = ({ media }) => {
	if (!media) return null;

	const { thumbnail_url, temp_storage_url } = media;

	if (thumbnail_url || temp_storage_url)
		return (
			<img id={'add-media-preview-image'} src={thumbnail_url || temp_storage_url} className={'img-fluid'} />
		);

	return (
		<VideoPlayer
			id={'add-media-preview-player'}
			url={temp_storage_url}
			controls
		/>
	);
};

const CompressionSettings = () => {
	const { newMediaObject } = useReactiveVar(getAddMedia);

	if (!newMediaObject) return null;

	const { encoded_size } = newMediaObject;

	if (!encoded_size) {
		// Set the default encoded size
		setAddMedia({
			newMediaObject: { encoded_size: 1280 },
		});
	}

	return (
		<>
			<label>Media Encoding</label>
			<p>
				<small>
					Please select the size you want to encode the video. The larger the
					video the longer it will take to load and play so we recommended
					encoding the video no larger than the size needed based on where your
					project will be embedded.
				</small>
			</p>

			<ul style={{ paddingLeft: 0 }}>
				<CompressionItemSelect
					label={'4k'}
					description={'3840px x 2160px'}
					value={3840}
					selected={encoded_size}
					setSelected={(val) =>
						setAddMedia({
							addMediaObject: { encoded_size: val },
						})
					}
				/>
				<CompressionItemSelect
					label={'1080p '}
					description={'1920px x 1080px'}
					value={1920}
					selected={encoded_size}
					setSelected={(val) =>
						setAddMedia({
							addMediaObject: { encoded_size: val },
						})
					}
				/>
				<CompressionItemSelect
					label={'720p (Recommended)'}
					description={'1280px x 720px'}
					value={1280}
					selected={encoded_size}
					setSelected={(val) =>
						setAddMedia({
							addMediaObject: { encoded_size: val },
						})
					}
				/>
				<CompressionItemSelect
					label={'540p'}
					description={'960px x 540px'}
					value={960}
					selected={encoded_size}
					setSelected={(val) =>
						setAddMedia({
							addMediaObject: { encoded_size: val },
						})
					}
				/>
				<CompressionItemSelect
					label="Don't Encode Media"
					description={'This will use the original media you provided'}
					value={0}
					selected={encoded_size}
					setSelected={(val) =>
						setAddMedia({
							addMediaObject: { encoded_size: val },
						})
					}
				/>
			</ul>
		</>
	);
};

const CompressionItemSelect = ({
	label,
	value,
	selected,
	setSelected,
	description,
}) => {
	return (
		<div
			onClick={() => setSelected(value)}
			className={cx(styles.sizeSelect, { [styles.active]: selected === value })}
		>
			<div className={'grid'}>
				<div className={'col1'} style={{ marginTop: '11px' }}>
					{selected === value ? (
						<Icon name={['fas', 'circle']} />
					) : (
						<Icon name={['far', 'circle']} />
					)}
				</div>
				<div className={'col11'}>
					<h4 style={{ margin: 0 }}>{label}</h4>
					<small style={{ opacity: '0.8' }}>{description}</small>
				</div>
			</div>
		</div>
	);
};

const getVideoRatio = (width, height) => {
	const ratio = width / height;
	if(ratio >= 1.7 && ratio <= 1.8)
		return "16:9";
	if(ratio >= 1.3 && ratio <= 1.4)
		return "4:3";
	if(ratio >= 0.5 && ratio <= 0.6)
		return "9:16";	
	return "16:9";
}