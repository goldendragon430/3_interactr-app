import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import VideoThumbnail from 'react-video-thumbnail';

const DEFAULT_SNAPSHOT_TIME = 2;

import { Button } from 'components/Buttons';

export const VideoThumbnailGenerator = ({ url, setThumbnail, setInitLoading }) => {
	const [snapshotAtTime, setSnapshotAtTime] = useState(
		DEFAULT_SNAPSHOT_TIME
	);
	// We use this as a hack to force the component to re render and create a new thumb
	const [regenerateThumbnail, setRegenerateThumbnail] = useState(false);

	useEffect(() => {
		if (url) {
			onRegenerateThumb();
		}
	}, [url]);


	const onRegenerateThumb = () => {
		setInitLoading(true);
		setRegenerateThumbnail(true);

		const video = document.querySelector('#add-media-preview-player > video');
		setSnapshotAtTime(video?.currentTime);

		// Hack to force the thumbnail component to re-render
		setTimeout(() => {
			setRegenerateThumbnail(false);
		}, 1000);
	};

	const handleThumbnail = (thumbnail) => {
		setThumbnail(thumbnail);
		setInitLoading(false);
	}
	
	return (
		<>
			{/* Added this to prevent the UI jumping when a new thiumbnail is being created */}
			<div style={{ height: '256.13px', width: '450px' }}>
				{!regenerateThumbnail && url && (
					<VideoThumbnail
						videoUrl={url}
						thumbnailHandler={handleThumbnail}
						snapshotAtTime={snapshotAtTime}
						// width={450}
    					// height={256}
					/>
				)}
			</div>
			<p>
				<small>
					To change the thumbnail play the video until you get to the frame you
					want to use as the thumbnail. Then click regenerate thumbnail below.
				</small>
			</p>
			<Button
				icon={'sync'}
				loading={regenerateThumbnail}
				onClick={onRegenerateThumb}
			>
				Regenerate Thumbnail
			</Button>
		</>
	);
};

VideoThumbnailGenerator.propTypes = {
	url: PropTypes.string,
	setThumbnail: PropTypes.func.isRequired,
	setInitLoading: PropTypes.func.isRequired
};
