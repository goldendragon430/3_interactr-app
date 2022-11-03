import React from 'react';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { MediaViews } from './MediaViews';
import Icon from '../../../components/Icon';
import EncodingStatusUpdater from './EncodingStatusUpdater';
import MediaEncodingUpdater from './MediaEncodingUpdater';
import Label from '../../../components/Label';

const MediaListItem = ({ item, actions, thumbnail, onSelect }) => {
	const { name, id, encoded_size, temp_storage_url } = item;

	return (
		<li
			className='grid'
			style={{
				borderBottom: '2px solid #f3f6fd',
				height: '67px',
				position: 'relative',
			}}
		>
			<ReactTooltip className='tooltip' />
			<div className='col3'>
				{thumbnail}
				{/*<img src={media.thumbnail_url || getAsset('/img/no-thumbnail.png')}  className="img-fluid " style={{borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05)'}} />*/}
			</div>
			<div className='col5' style={{ paddingLeft: 0 }}>
				<p
					style={{
						marginBottom: 0,
						marginTop: '10px',
						color: '#366fe0',
						cursor: 'pointer',
						fontSize: '14px',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						width: '100%',
						display: 'block',
					}}
					onClick={onSelect}
				>
					{name}
				</p>
				{temp_storage_url ? (
					<UploadingStatusUpdater item={item} />
				) : (
					<MetaRow item={item} />
				)}
			</div>
			<div className='col1 text-center' style={{ padding: 0 }}>
				<h5 style={{ marginTop: '15px' }}>
					<strong>
						<MediaViews id={id} />
					</strong>{' '}
					<br />
					<span style={{ opacity: 0.8 }}>Views</span>
				</h5>
			</div>
			<div className='col3 text-right' style={{ paddingTop: '20px' }}>
				{actions}
			</div>
		</li>
	);
};
export default MediaListItem;

const MetaRow = ({ item }) => {
	const type = item.is_image ? 'Image' : 'Video';

	return (
		<small
			style={{
				marginTop: '3px',
				opacity: 0.8,
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis',
				overflow: 'hidden',
				width: '100%',
				display: 'block',
			}}
		>
			{type} / Created {moment.utc(item.created_at).fromNow()}
		</small>
	);
};

const UploadingStatusUpdater = ({ item }) => {
	if (item.encoded_size) return <MediaEncodingUpdater media={item} />;

	return (
		<Label flash purple style={{ marginTop: 2 }} small>
			Uploading...
		</Label>
	);
};
